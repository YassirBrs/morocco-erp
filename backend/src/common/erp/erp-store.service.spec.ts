import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { ErpStoreService } from './erp-store.service';

describe('ErpStoreService working ERP workflows', () => {
  let store: ErpStoreService;
  const cls = { get: jest.fn(() => 'tenant-demo') } as unknown as ClsService;

  beforeEach(() => {
    (cls.get as jest.Mock).mockImplementation((key?: string) => key === 'userRole' ? 'OWNER' : key === 'userEmail' ? 'owner@atlas.ma' : 'tenant-demo');
    store = new ErpStoreService(cls);
  });

  it('creates a compliant quote, converts it to an invoice, deducts stock, and posts accounting', () => {
    const quote = store.createQuote({
      customerId: 'cus-1',
      lines: [{ productId: 'prd-1', quantity: 2 }],
    });

    const invoice = store.convertQuoteToInvoice(quote.id);
    const stock = store.listStock().find((line) => line.productId === 'prd-1');
    const journals = store.listJournalEntries();

    expect(invoice.number).toMatch(/^FAC-\d{4}-00001$/);
    expect(invoice.compliance.validated).toBe(true);
    expect(invoice.totals.total).toBe(2040);
    expect(stock?.stockOnHand).toBe(48);
    expect(journals).toHaveLength(1);
    expect(journals[0].lines.reduce((sum, line) => sum + line.debit, 0))
      .toBeCloseTo(journals[0].lines.reduce((sum, line) => sum + line.credit, 0), 2);
  });

  it('blocks invoices that exceed customer credit limits before numbering, stock, journals, or conversion mutation', () => {
    const limited = store.addCustomer({ name: 'Client Bloqué Crédit', creditLimit: 100 });
    const stockBefore = store.getProduct('prd-1').stockOnHand;

    expect(() => store.createInvoice({
      customerId: limited.id,
      lines: [{ productId: 'prd-1', quantity: 1 }],
    })).toThrow('Plafond de crédit client dépassé');

    expect(store.listInvoices()).toHaveLength(0);
    expect(store.listJournalEntries()).toHaveLength(0);
    expect(store.getProduct('prd-1').stockOnHand).toBe(stockBefore);

    const quote = store.createQuote({ customerId: limited.id, lines: [{ productId: 'prd-2', quantity: 1 }] });
    expect(() => store.convertQuoteToInvoice(quote.id)).toThrow('Plafond de crédit client dépassé');
    expect(store.getQuote(quote.id).status).toBe('DRAFT');

    const noLimit = store.addCustomer({ name: 'Client Sans Plafond', creditLimit: 0 });
    const invoice = store.createInvoice({ customerId: noLimit.id, lines: [{ productId: 'prd-2', quantity: 1 }] });
    expect(invoice.number).toMatch(/^FAC-\d{4}-00001$/);
  });

  it('allows credit limit equality and releases credit holds after payment or credit note', () => {
    const paidCustomer = store.addCustomer({ name: 'Client Paiement Crédit', creditLimit: 1440 });
    const first = store.createInvoice({ customerId: paidCustomer.id, lines: [{ productId: 'prd-2', quantity: 1 }] });
    expect(first.totals.total).toBe(1440);
    expect(() => store.createInvoice({ customerId: paidCustomer.id, lines: [{ productId: 'prd-2', quantity: 1 }] })).toThrow('Plafond de crédit client dépassé');
    store.recordPayment({ invoiceId: first.id, amount: first.totals.total });
    expect(store.createInvoice({ customerId: paidCustomer.id, lines: [{ productId: 'prd-2', quantity: 1 }] }).number).toMatch(/^FAC-\d{4}-00002$/);

    const creditedCustomer = store.addCustomer({ name: 'Client Avoir Crédit', creditLimit: 1440 });
    const creditedInvoice = store.createInvoice({ customerId: creditedCustomer.id, lines: [{ productId: 'prd-2', quantity: 1 }] });
    expect(() => store.createInvoice({ customerId: creditedCustomer.id, lines: [{ productId: 'prd-2', quantity: 1 }] })).toThrow('Plafond de crédit client dépassé');
    store.createCreditNote({ invoiceId: creditedInvoice.id });
    expect(store.createInvoice({ customerId: creditedCustomer.id, lines: [{ productId: 'prd-2', quantity: 1 }] }).number).toMatch(/^FAC-\d{4}-00004$/);
  });

  it('applies configurable approval limits to quotes, credit notes, purchases, and stock adjustments', () => {
    store.updateApprovalLimits({ quote: 500, creditNote: 100, purchase: 500, stockAdjustment: 100 });
    const quote = store.createQuote({ customerId: 'cus-1', lines: [{ productId: 'prd-1', quantity: 1 }] });
    const invoice = store.createInvoice({ customerId: 'cus-1', lines: [{ productId: 'prd-2', quantity: 1 }] });
    const creditNote = store.createCreditNote({ invoiceId: invoice.id, lines: [{ productId: 'prd-2', quantity: 0.25 }] });
    const receipt = store.createPurchaseReceipt({ supplierId: 'sup-1', lines: [{ productId: 'prd-1', quantity: 1, unitCost: 600 }] });
    const adjustment = store.adjustStock('prd-1', 1, 'Ajustement approbation');

    const review = store.approvalLimitReview();

    expect(quote.approvalStatus).toBe('REQUIRED');
    expect(creditNote.approvalStatus).toBe('REQUIRED');
    expect(receipt.approvalStatus).toBe('REQUIRED');
    expect(adjustment.approvalStatus).toBe('REQUIRED');
    expect(review.pending).toBeGreaterThanOrEqual(4);
    expect(review.rows.map((row) => row.type)).toEqual(expect.arrayContaining(['QUOTE', 'CREDIT_NOTE', 'PURCHASE', 'STOCK_ADJUSTMENT']));

    store.approveQuote(quote.id);
    store.approveCreditNote(creditNote.id);
    store.approvePurchaseReceipt(receipt.id);
    store.approveStockMove(adjustment.id);

    expect(store.getQuote(quote.id).approvalStatus).toBe('APPROVED');
    expect(store.approvalLimitReview().rows.filter((row) => row.requiresApproval)).toHaveLength(0);
    expect(() => store.updateApprovalLimits({ purchase: -1 })).toThrow(BadRequestException);

    store.updateApprovalLimits({ quote: quote.totals.total });
    const exactLimitQuote = store.createQuote({ customerId: 'cus-1', lines: [{ productId: 'prd-1', quantity: 1 }] });
    expect(exactLimitQuote.approvalStatus).toBe('AUTO_APPROVED');
  });

  it('builds role widgets, customer payment reminders, supplier payment calendar, and VAT review checklist', () => {
    store.addLead({
      customerName: 'Prospect relance rôle',
      stage: 'QUALIFIED',
      owner: 'Nadia',
      source: 'Salon',
      nextActionDate: '2026-04-01',
      expectedValue: 15000,
    });
    const overdueInvoice = store.createInvoice({
      customerId: 'cus-1',
      dueDate: '2026-04-01',
      lines: [{ productId: 'prd-2', quantity: 1 }],
    });
    const receipt = store.createPurchaseReceipt({
      supplierId: 'sup-1',
      lines: [{ productId: 'prd-1', quantity: 2, unitCost: 600 }],
    });
    store.lockFiscalPeriod(2026, 1);

    const roleWidgets = store.roleDashboardWidgets();
    const paymentReminders = store.paymentReminderSchedule();
    const supplierCalendar = store.supplierPaymentCalendar();
    const vatChecklist = store.vatDeclarationReviewChecklist();

    expect(roleWidgets.map((role) => role.role)).toEqual(['OWNER', 'SALES', 'WAREHOUSE', 'ACCOUNTANT', 'PAYROLL']);
    expect(roleWidgets.find((role) => role.role === 'SALES')?.widgets.map((widget) => widget.label))
      .toEqual(expect.arrayContaining(['Soldes impayés', 'Actions CRM en retard']));
    expect(roleWidgets.find((role) => role.role === 'ACCOUNTANT')?.widgets.map((widget) => widget.label))
      .toEqual(expect.arrayContaining(['TVA nette collectée', 'Périodes verrouillées']));

    expect(paymentReminders.rows).toHaveLength(1);
    expect(paymentReminders.rows[0]).toMatchObject({
      invoiceId: overdueInvoice.id,
      invoiceNumber: overdueInvoice.number,
      customerName: 'Rabat Retail SARL',
      channel: 'EMAIL',
      status: 'SCHEDULED',
    });
    expect(paymentReminders.rows[0].daysOverdue).toBeGreaterThan(0);
    expect(paymentReminders.rows[0].legalFooter).toContain('ICE');

    expect(supplierCalendar.rows).toHaveLength(1);
    expect(supplierCalendar.rows[0]).toMatchObject({
      receiptId: receipt.id,
      receiptNumber: receipt.number,
      supplierName: 'Casa Import SA',
      preferred: true,
      amount: receipt.total,
    });
    expect(supplierCalendar.rows[0].riskFlags).toEqual(expect.arrayContaining(['Fournisseur préféré', 'Note risque']));

    expect(vatChecklist.report.invoiceCount).toBe(1);
    expect(vatChecklist.supportingCounts.taxableLineCount).toBe(1);
    expect(vatChecklist.checklist.map((check) => check.label)).toEqual(expect.arrayContaining(['ICE/IF clients vérifiés', 'Taux TVA conformes au pack Maroc']));
    expect(vatChecklist.exceptions).toHaveLength(0);

    const customerWithoutTaxIds = store.addCustomer({ name: 'Client Sans ICE IF', creditLimit: 0 });
    store.createInvoice({
      customerId: customerWithoutTaxIds.id,
      dueDate: '2026-04-01',
      lines: [{ productId: 'prd-2', quantity: 1 }],
    });
    const reviewWithException = store.vatDeclarationReviewChecklist();
    expect(reviewWithException.status).toBe('NEEDS_REVIEW');
    expect(reviewWithException.exceptions.map((item) => item.message)).toEqual(expect.arrayContaining(['ICE client manquant', 'IF client manquant']));
  });

  it('revises, approves, exports, and converts a quote to order, delivery note, and invoice', () => {
    const quote = store.createQuote({
      customerId: 'cus-1',
      lines: [{ productId: 'prd-1', quantity: 1 }],
    });

    const revised = store.reviseQuote(quote.id, {
      lines: [{ productId: 'prd-1', quantity: 2 }],
    });
    const approved = store.approveQuote(revised.id);
    expect(revised.revision).toBe(2);
    expect(approved.status).toBe('APPROVED');

    const pdf = store.exportQuotePdf(approved.id);
    const order = store.convertQuoteToOrder(approved.id);
    const reservedStock = store.listStock().find((line) => line.productId === 'prd-1');
    const delivery = store.createDeliveryNoteFromOrder(order.id);
    const deliveredStock = store.listStock().find((line) => line.productId === 'prd-1');
    const invoice = store.convertOrderToInvoice(order.id);

    expect(Buffer.from(pdf.contentBase64, 'base64').toString('binary').startsWith('%PDF-')).toBe(true);
    expect(store.getQuote(quote.id).status).toBe('CONVERTED');
    expect(order.number).toMatch(/^BC-/);
    expect(reservedStock?.reservedStock).toBe(2);
    expect(reservedStock?.availableStock).toBe(48);
    expect(delivery.number).toMatch(/^BL-/);
    expect(deliveredStock?.stockOnHand).toBe(48);
    expect(deliveredStock?.reservedStock).toBe(0);
    expect(invoice.sourceOrderId).toBe(order.id);
    expect(store.listSalesOrders()[0].status).toBe('INVOICED');
  });

  it('posts and cancels delivery notes with stock release', () => {
    const order = store.createSalesOrder({
      customerId: 'cus-1',
      lines: [{ productId: 'prd-1', quantity: 1 }],
    });
    const delivery = store.createDeliveryNoteFromOrder(order.id);
    expect(store.listStock().find((line) => line.productId === 'prd-1')?.stockOnHand).toBe(49);

    const cancelled = store.cancelDeliveryNote(delivery.id);
    const stock = store.listStock().find((line) => line.productId === 'prd-1');

    expect(cancelled.status).toBe('CANCELLED');
    expect(stock?.stockOnHand).toBe(50);
    expect(stock?.reservedStock).toBe(0);
    expect(store.listSalesOrders()[0].status).toBe('CONFIRMED');
  });

  it('records invoice payments and posts a balanced bank/customer journal entry', () => {
    const invoice = store.createInvoice({
      customerId: 'cus-1',
      lines: [{ productId: 'prd-2', quantity: 1 }],
    });

    const payment = store.recordPayment({ invoiceId: invoice.id, amount: invoice.totals.total, method: 'BANK' });

    expect(payment.amount).toBe(invoice.totals.total);
    expect(store.listInvoices()[0].status).toBe('PAID');
    expect(store.listJournalEntries().some((entry) => entry.description.includes('Paiement'))).toBe(true);
  });

  it('rejects overpayments and keeps customer receivables accurate for partial payments', () => {
    const invoice = store.createInvoice({
      customerId: 'cus-1',
      lines: [{ productId: 'prd-2', quantity: 1 }],
    });

    store.recordPayment({ invoiceId: invoice.id, amount: 500, method: 'BANK' });

    expect(store.listInvoices()[0].status).toBe('POSTED');
    expect(store.summary().metrics.receivables).toBe(invoice.totals.total - 500);
    expect(() => store.recordPayment({ invoiceId: invoice.id, amount: invoice.totals.total, method: 'BANK' })).toThrow(BadRequestException);
  });

  it('posts credit notes against invoices and reverses customer, revenue, and VAT accounting', () => {
    const invoice = store.createInvoice({
      customerId: 'cus-1',
      lines: [{ productId: 'prd-2', quantity: 1 }],
    });

    const creditNote = store.createCreditNote({
      invoiceId: invoice.id,
      reason: 'Remise commerciale',
      lines: [{ productId: 'prd-2', quantity: 0.5 }],
    });
    const summary = store.summary();
    const creditJournal = store.listJournalEntries().find((entry) => entry.source === creditNote.number);
    const vat = store.exportVatReport();

    expect(creditNote.number).toMatch(/^NC-/);
    expect(creditNote.invoiceId).toBe(invoice.id);
    expect(creditNote.totals.total).toBe(720);
    expect(summary.metrics.revenue).toBe(720);
    expect(summary.metrics.receivables).toBe(720);
    expect(creditJournal?.lines.reduce((sum, line) => sum + line.debit, 0))
      .toBeCloseTo(creditJournal!.lines.reduce((sum, line) => sum + line.credit, 0), 2);
    expect(vat.vatCollected).toBe(240);
    expect(vat.vatReversed).toBe(120);
    expect(vat.netVatCollected).toBe(120);
    expect(() => store.createCreditNote({ invoiceId: invoice.id })).toThrow(BadRequestException);

    const payment = store.recordPayment({ invoiceId: invoice.id, amount: 720, method: 'BANK' });

    expect(payment.amount).toBe(720);
    expect(invoice.status).toBe('PAID');
    expect(store.summary().metrics.receivables).toBe(0);
  });

  it('exports customer statements with invoices, credit notes, payments, and aging', () => {
    const invoice = store.createInvoice({
      customerId: 'cus-1',
      lines: [{ productId: 'prd-2', quantity: 1 }],
    });
    store.createCreditNote({
      invoiceId: invoice.id,
      reason: 'Avoir partiel',
      lines: [{ productId: 'prd-2', quantity: 0.25 }],
    });
    store.recordPayment({ invoiceId: invoice.id, amount: 300, method: 'BANK' });

    const statement = store.customerStatement('cus-1');

    expect(statement.status).toBe('PREPARED');
    expect(statement.entries.map((entry) => entry.type)).toEqual(['INVOICE', 'CREDIT_NOTE', 'PAYMENT']);
    expect(statement.totals.invoiced).toBe(1440);
    expect(statement.totals.credited).toBe(360);
    expect(statement.totals.paid).toBe(300);
    expect(statement.totals.balance).toBe(780);
    expect(statement.aging.current).toBe(780);
  });

  it('uses tenant invoice series for continuous fiscal-year numbering', () => {
    store.completeTenantOnboarding({ invoiceSeries: 'ATLAS' });

    const first = store.createInvoice({
      customerId: 'cus-1',
      lines: [{ productId: 'prd-2', quantity: 1 }],
    });
    const second = store.createInvoice({
      customerId: 'cus-1',
      lines: [{ productId: 'prd-2', quantity: 1 }],
    });

    expect(first.number).toMatch(/^ATLAS-\d{4}-00001$/);
    expect(second.number).toMatch(/^ATLAS-\d{4}-00002$/);
  });

  it('receives purchases, recalculates CUMP, and creates supplier liability accounting', () => {
    const receipt = store.createPurchaseReceipt({
      supplierId: 'sup-1',
      lines: [{ productId: 'prd-1', quantity: 10, unitCost: 650 }],
    });
    const product = store.listProducts().find((candidate) => candidate.id === 'prd-1');

    expect(receipt.total).toBe(6500);
    expect(product?.stockOnHand).toBe(60);
    expect(product?.weightedAverageCost).toBeCloseTo(541.67, 2);
    expect(store.listJournalEntries()[0].source).toBe(receipt.number);
  });

  it('rejects new invoices in locked fiscal periods', () => {
    const now = new Date();
    store.lockFiscalPeriod(now.getFullYear(), now.getMonth() + 1);

    expect(() => store.createInvoice({
      customerId: 'cus-1',
      lines: [{ productId: 'prd-2', quantity: 1 }],
    })).toThrow(ForbiddenException);
  });

  it('runs a POS sale with stock synchronization and accounting', () => {
    const tx = store.createPosTransaction({
      cashierId: 'cashier-1',
      lines: [{ productId: 'prd-1', quantity: 1 }],
      paymentMethod: 'CASH',
    });

    expect(tx.number).toMatch(/^POS-/);
    expect(store.listStock().find((line) => line.productId === 'prd-1')?.stockOnHand).toBe(49);
    expect(store.listJournalEntries()[0].description).toContain('Ticket POS');
  });

  it('completes production by consuming raw material and receiving finished goods', () => {
    const beforeRaw = store.listProducts().find((product) => product.id === 'prd-raw')!.stockOnHand;
    const beforeFinished = store.listProducts().find((product) => product.id === 'prd-fg')!.stockOnHand;

    const order = store.createProductionOrder({ finishedProductId: 'prd-fg', quantity: 3 });

    expect(order.status).toBe('COMPLETED');
    expect(store.listProducts().find((product) => product.id === 'prd-raw')?.stockOnHand).toBe(beforeRaw - 6);
    expect(store.listProducts().find((product) => product.id === 'prd-fg')?.stockOnHand).toBe(beforeFinished + 3);
  });

  it('prepares VAT and DGI adapter exports without live government credentials', () => {
    const invoice = store.createInvoice({
      customerId: 'cus-1',
      lines: [{ productId: 'prd-2', quantity: 1 }],
    });

    const vat = store.exportVatReport();
    const envelope = store.prepareDgiInvoiceEnvelope(invoice.id);

    expect(vat.status).toBe('PREPARED');
    expect(vat.vatCollected).toBe(240);
    expect(envelope.status).toBe('ADAPTER_NOT_CONFIGURED');
    expect(envelope.invoiceNumber).toBe(invoice.number);
  });

  it('enforces Moroccan legal identity before invoice posting', () => {
    const tenant = store.createTenant({ tradeName: 'Incomplete SARL' });
    const customer = store.addCustomer({ name: 'Client Test' }, tenant.id);
    const product = store.addProduct({ sku: 'SVC', name: 'Service', salePrice: 1000, type: 'SERVICE' }, tenant.id);

    expect(() => store.createInvoice({
      customerId: customer.id,
      lines: [{ productId: product.id, quantity: 1 }],
    }, tenant.id)).toThrow(BadRequestException);
  });

  it('tracks tenant onboarding readiness from Moroccan setup data', () => {
    const tenant = store.createTenant({ tradeName: 'NewCo SARL', city: 'Tanger' });
    let setup = store.setupChecklist(tenant.id);

    expect(setup.ready).toBe(false);
    expect(setup.checks.find((check) => check.id === 'legal-identity')?.complete).toBe(false);

    const customer = store.addCustomer({ name: 'Client Tanger' }, tenant.id);
    store.addProduct({ sku: 'SVC-TNG', name: 'Service Tanger', type: 'SERVICE', salePrice: 500 }, tenant.id);
    const onboarding = store.completeTenantOnboarding({
      ice: '001234567000099',
      ifNumber: '1234567',
      rc: 'TNG-10001',
      patente: '99887766',
      cnssNumber: '7654321',
      address: 'Zone Franche Tanger',
      city: 'Tanger',
      invoiceSeries: 'TNG',
      fiscalYearStartMonth: 1,
    }, tenant.id);

    expect(customer.paymentTermsDays).toBe(30);
    expect(onboarding.ready).toBe(true);
    expect(onboarding.tenant.settings.invoiceSeries).toBe('TNG');
    expect(store.auditLogs(tenant.id).some((log) => log.action === 'tenant.onboarded')).toBe(true);
  });

  it('resets demo data only outside production-like environments and audits the action', () => {
    store.createInvoice({
      customerId: 'cus-1',
      lines: [{ productId: 'prd-1', quantity: 1 }],
    });
    store.updateCompanyProfile({ city: 'Tanger', invoiceSeries: 'TNG' });

    expect(store.summary().metrics.invoices).toBe(1);
    expect(store.companyProfile().changes).toHaveLength(1);
    expect(() => store.resetDemoData('production')).toThrow(ForbiddenException);

    const result = store.resetDemoData('test');

    expect(result.status).toBe('RESET');
    expect(result.environment).toBe('test');
    expect(result.summary.tenant.id).toBe('tenant-demo');
    expect(result.summary.metrics.invoices).toBe(0);
    expect(store.companyProfile().approvalStatus).toBe('APPROVED');
    expect(store.companyProfile().changes).toHaveLength(0);
    expect(store.listCustomers()).toHaveLength(1);
    expect(store.auditLogs().some((log) => log.action === 'tenant.demo-reset')).toBe(true);
  });

  it('edits the company profile with pending approval, snapshots, validation, and audit history', () => {
    const change = store.updateCompanyProfile({
      tradeName: 'Atlas Distribution Nord SARL',
      city: 'Tanger',
      invoiceSeries: 'TNG',
      fiscalYearStartMonth: 4,
      vatStatus: 'EXEMPT',
    });
    const pendingProfile = store.companyProfile();

    expect(change.status).toBe('PENDING_REVIEW');
    expect(change.before.legalEntity.city).toBe('Casablanca');
    expect(change.after.legalEntity.city).toBe('Tanger');
    expect(change.after.settings.invoiceSeries).toBe('TNG');
    expect(pendingProfile.approvalStatus).toBe('PENDING_REVIEW');
    expect(pendingProfile.tenant.legalEntity.tradeName).toBe('Atlas Distribution Nord SARL');
    expect(pendingProfile.tenant.legalEntity.vatEnabled).toBe(false);
    expect(pendingProfile.tenant.settings.fiscalYearStartMonth).toBe(4);
    expect(store.auditLogs().some((log) => log.action === 'tenant.profile-updated')).toBe(true);

    const approved = store.approveCompanyProfile('Cabinet Fiduciaire');

    expect(approved.status).toBe('APPROVED');
    expect(approved.reviewer).toBe('Cabinet Fiduciaire');
    expect(approved.approvedAt).toBeTruthy();
    expect(store.companyProfile().approvalStatus).toBe('APPROVED');
    expect(store.auditLogs().some((log) => log.action === 'tenant.profile-approved')).toBe(true);
    expect(() => store.updateCompanyProfile({ tradeName: '' })).toThrow(BadRequestException);
    expect(() => store.updateCompanyProfile({ fiscalYearStartMonth: 13 })).toThrow(BadRequestException);
  });

  it('supports full customer CRUD fields with validation and archive workflow', () => {
    const customer = store.addCustomer({
      name: 'Marrakech Retail',
      ice: '001000222333444',
      ifNumber: '554433',
      rc: 'RAK-88331',
      city: 'Marrakech',
      paymentTermsDays: 45,
      creditLimit: 25000,
      contacts: [{ name: 'Sara Finance', role: 'DAF', email: 'sara@example.ma' }],
      addresses: [{ label: 'Siege', line1: 'Gueliz', city: 'Marrakech' }],
    });

    expect(store.getCustomer(customer.id).contacts[0].name).toBe('Sara Finance');

    const updated = store.updateCustomer(customer.id, { creditLimit: 30000, paymentTermsDays: 60 });
    expect(updated.creditLimit).toBe(30000);
    expect(updated.paymentTermsDays).toBe(60);

    const archived = store.archiveCustomer(customer.id);
    expect(archived.active).toBe(false);
    expect(store.auditLogs().filter((log) => log.entity === 'Customer')).toHaveLength(3);
    expect(() => store.addCustomer({ name: '', creditLimit: -1 })).toThrow(BadRequestException);
  });

  it('tracks customer document expiry reminders for ICE, RC, contracts, and payment guarantees', () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const customer = store.addCustomer({
      name: 'Client Documents',
      ice: '001122334455667',
      rc: 'CASA-2026',
      documentExpiries: [
        { type: 'ICE', expiresAt: tomorrow, reference: '001122334455667' },
        { type: 'Registre de Commerce', expiresAt: '2026-12-31', reference: 'CASA-2026' },
        { type: 'Contrat cadre', expiresAt: tomorrow, reference: 'CC-2026' },
        { type: 'Garantie de paiement', expiresAt: tomorrow, reference: 'GP-2026' },
      ],
    });

    const reminders = store.customerDocumentReminders();

    expect(reminders).toEqual(expect.arrayContaining([
      expect.objectContaining({
        customerId: customer.id,
        customerName: 'Client Documents',
        ice: '001122334455667',
        rc: 'CASA-2026',
        expiringDocuments: expect.arrayContaining([
          expect.objectContaining({ type: 'ICE', daysUntilExpiry: 1 }),
          expect.objectContaining({ type: 'Contrat cadre', daysUntilExpiry: 1 }),
          expect.objectContaining({ type: 'Garantie de paiement', daysUntilExpiry: 1 }),
        ]),
      }),
    ]));
    expect(() => store.updateCustomer(customer.id, { documentExpiries: [{ type: '', expiresAt: 'bad-date' }] })).toThrow(BadRequestException);
  });

  it('manages the CRM lead pipeline with stage, source, owner, next action, and expected value', () => {
    const lead = store.addLead({
      customerName: 'Hotel Atlas Marrakech',
      stage: 'NEW',
      owner: 'Nadia',
      source: 'Salon Casablanca',
      nextActionDate: '2026-06-01',
      expectedValue: 48000,
    });

    const updated = store.updateLead(lead.id, {
      stage: 'PROPOSAL',
      nextActionDate: '2026-06-10',
      expectedValue: 52000,
    });

    expect(updated.stage).toBe('PROPOSAL');
    expect(updated.source).toBe('Salon Casablanca');
    expect(updated.owner).toBe('Nadia');
    expect(updated.nextActionDate).toBe('2026-06-10');
    expect(updated.expectedValue).toBe(52000);
    expect(store.listLeads()).toHaveLength(1);
    expect(store.auditLogs().filter((log) => log.entity === 'Lead')).toHaveLength(2);
    expect(() => store.addLead({ customerName: '', expectedValue: -1 })).toThrow(BadRequestException);
    expect(() => store.updateLead(lead.id, { stage: 'INVALID' as any })).toThrow(BadRequestException);
  });

  it('converts a lead to a draft quote by creating or linking the customer', () => {
    const lead = store.addLead({
      customerName: 'Hotel Atlas Marrakech',
      stage: 'QUALIFIED',
      expectedValue: 48000,
      owner: 'Nadia',
    });

    const created = store.convertLeadToQuote(lead.id, { productId: 'prd-1', quantity: 2 });

    expect(created.customer.name).toBe('Hotel Atlas Marrakech');
    expect(created.quote.customerId).toBe(created.customer.id);
    expect(created.quote.status).toBe('DRAFT');
    expect(created.quote.totals.total).toBe(2040);
    expect(created.lead.stage).toBe('PROPOSAL');
    expect(created.lead.convertedCustomerId).toBe(created.customer.id);
    expect(created.lead.convertedQuoteId).toBe(created.quote.id);
    expect(store.auditLogs().some((log) => log.action === 'lead.converted-to-quote')).toBe(true);

    const secondLead = store.addLead({ customerName: 'Rabat Retail SARL', expectedValue: 12000 });
    const linked = store.convertLeadToQuote(secondLead.id, { customerId: 'cus-1', lines: [{ productId: 'prd-2', quantity: 1 }] });

    expect(linked.customer.id).toBe('cus-1');
    expect(linked.quote.totals.total).toBe(1440);
    expect(store.listCustomers().filter((customer) => customer.name === 'Rabat Retail SARL')).toHaveLength(1);
  });

  it('supports supplier CRUD fields with payment terms, contacts, bank details, and archive workflow', () => {
    const supplier = store.addSupplier({
      name: 'Fournitures Rabat SA',
      ice: '001222333444555',
      ifNumber: '998877',
      rc: 'RABAT-7788',
      email: 'contact@fournitures-rabat.ma',
      city: 'Rabat',
      paymentTermsDays: 60,
      contacts: [{ name: 'Mina Achat', role: 'Commerciale', email: 'mina@example.ma' }],
      bankDetails: [{ bankName: 'Bank of Africa', rib: '011780000000000000000456' }],
    });

    const updated = store.updateSupplier(supplier.id, {
      paymentTermsDays: 75,
      bankDetails: [{ bankName: 'CIH Bank', rib: '230780000000000000000789' }],
    });
    const archived = store.archiveSupplier(supplier.id);

    expect(store.getSupplier(supplier.id).ifNumber).toBe('998877');
    expect(updated.paymentTermsDays).toBe(75);
    expect(updated.bankDetails[0].bankName).toBe('CIH Bank');
    expect(archived.active).toBe(false);
    expect(store.auditLogs().filter((log) => log.entity === 'Supplier')).toHaveLength(3);
    expect(() => store.addSupplier({ name: '', paymentTermsDays: -1 })).toThrow(BadRequestException);
    expect(() => store.updateSupplier(supplier.id, { bankDetails: [{ bankName: '', rib: '' }] })).toThrow(BadRequestException);
  });

  it('flags supplier duplicates by ICE and IF without blocking creation or update', () => {
    const duplicate = store.addSupplier({
      name: 'Casa Import Duplicate',
      ice: '009998887776665',
      ifNumber: '445566',
      paymentTermsDays: 30,
    });

    expect(duplicate.duplicateWarnings).toEqual([
      'ICE déjà utilisé par Casa Import SA',
      'IF déjà utilisé par Casa Import SA',
    ]);
    expect(store.listSuppliers()).toHaveLength(2);

    const unique = store.addSupplier({ name: 'Unique Supplier', ice: '100200300400500', ifNumber: '111222' });
    const updated = store.updateSupplier(unique.id, { ice: '009998887776665' });

    expect(updated.duplicateWarnings).toEqual(['ICE déjà utilisé par Casa Import SA']);
    expect(store.auditLogs().filter((log) => log.entity === 'Supplier')).toHaveLength(3);
  });

  it('reviews fiscal close completeness and flags duplicate customers and products', () => {
    const duplicateCustomer = store.addCustomer({
      name: 'Rabat Retail Copie',
      ice: '001111222333444',
      ifNumber: '778899',
      email: 'finance@rabretail.ma',
      phone: '+212522000000',
    });
    const duplicateProduct = store.addProduct({
      sku: 'CHAIR-COPY',
      barcode: '6111000000010',
      name: 'Chaïse   Bureau',
      salePrice: 900,
      purchaseCost: 500,
    });
    const invoice = store.createInvoice({ customerId: 'cus-1', lines: [{ productId: 'prd-2', quantity: 1 }] });
    const year = Number(invoice.date.slice(0, 4));
    const month = Number(invoice.date.slice(5, 7));

    expect(duplicateCustomer.duplicateWarnings).toEqual(expect.arrayContaining([
      'ICE déjà utilisé par Rabat Retail SARL',
      'IF déjà utilisé par Rabat Retail SARL',
      'Téléphone déjà utilisé par Rabat Retail SARL',
      'Email déjà utilisé par Rabat Retail SARL',
    ]));
    expect(store.customerDuplicateReview().counts).toMatchObject({ customersWithDuplicates: 2, highRisk: 2 });
    expect(duplicateProduct.duplicateWarnings).toEqual(expect.arrayContaining([
      'Code-barres déjà utilisé par Chaise bureau',
      'Nom normalisé déjà utilisé par SKU-CHAIR',
    ]));
    expect(store.productDuplicateReview().counts).toMatchObject({ productsWithDuplicates: 2, highRisk: 2 });
    expect(() => store.addProduct({ sku: 'SKU-CHAIR', name: 'SKU protégé', salePrice: 10 })).toThrow(BadRequestException);

    const blockedClose = store.fiscalDocumentCompletenessCheck(year, month);
    expect(blockedClose.status).toBe('NEEDS_REVIEW');
    expect(blockedClose.exceptions.map((exception) => exception.type)).toEqual(expect.arrayContaining(['CUSTOMER_DUPLICATE', 'PRODUCT_DUPLICATE']));
    expect(blockedClose.supportingCounts).toMatchObject({ invoices: 1, customerDuplicates: 2, productDuplicates: 2 });
    expect(() => store.lockFiscalPeriod(year, month)).toThrow('La période fiscale contient des exceptions de clôture à traiter');

    store.archiveCustomer(duplicateCustomer.id);
    store.archiveProduct(duplicateProduct.id);
    const cleanClose = store.fiscalDocumentCompletenessCheck(year, month);
    expect(cleanClose.status).toBe('READY_TO_CLOSE');
    expect(cleanClose.checklist.every((check) => check.complete)).toBe(true);
    expect(store.lockFiscalPeriod(year, month).locked).toBe(true);
  });

  it('normalizes Moroccan supplier banks and validates 24 digit RIB values', () => {
    const supplier = store.addSupplier({
      name: 'Banque Test Supplier',
      bankDetails: [{ bankName: '  awb  ', rib: '007 780 000000000000000123' }],
    });

    expect(supplier.bankDetails[0].bankName).toBe('Attijariwafa bank');
    expect(supplier.bankDetails[0].rib).toBe('007780000000000000000123');

    const updated = store.updateSupplier(supplier.id, {
      bankDetails: [{ bankName: 'boa', rib: '01178-0000000000000000456' }],
    });

    expect(updated.bankDetails[0].bankName).toBe('Bank of Africa');
    expect(updated.bankDetails[0].rib).toBe('011780000000000000000456');
    expect(() => store.addSupplier({
      name: 'Invalid RIB',
      bankDetails: [{ bankName: 'CIH', rib: '23078' }],
    })).toThrow(BadRequestException);
  });

  it('warns when sellable product sale price is below purchase cost plus VAT', () => {
    const lowMargin = store.addProduct({
      sku: 'LOW-MARGIN',
      name: 'Produit marge basse',
      salePrice: 110,
      purchaseCost: 100,
      vatRate: 0.2,
    });
    const exactThreshold = store.addProduct({
      sku: 'OK-MARGIN',
      name: 'Produit seuil exact',
      salePrice: 120,
      purchaseCost: 100,
      vatRate: 0.2,
    });

    expect(store.productMarginAlerts()).toEqual(expect.arrayContaining([
      expect.objectContaining({
        productId: lowMargin.id,
        sku: 'LOW-MARGIN',
        minimumSalePrice: 120,
        marginGap: 10,
      }),
    ]));
    expect(store.productMarginAlerts().some((alert) => alert.productId === exactThreshold.id)).toBe(false);

    store.updateProduct(lowMargin.id, { salePrice: 130 });
    expect(store.productMarginAlerts().some((alert) => alert.productId === lowMargin.id)).toBe(false);

    store.createPurchaseReceipt({
      supplierId: 'sup-1',
      lines: [{ productId: lowMargin.id, quantity: 1, unitCost: 150 }],
    });

    expect(store.productMarginAlerts()).toEqual(expect.arrayContaining([
      expect.objectContaining({
        productId: lowMargin.id,
        purchaseCost: 150,
        minimumSalePrice: 180,
        marginGap: 50,
      }),
    ]));
    expect(store.productMarginAlerts().some((alert) => alert.sku === 'RAW-BOIS')).toBe(false);
  });

  it('tracks supplier risk notes, preferred flags, and document expiry reminders', () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const supplier = store.addSupplier({
      name: 'Preferred Risk Supplier',
      preferred: true,
      riskNotes: 'Attestation fiscale à renouveler avant achat.',
      documentExpiries: [{ type: 'Attestation fiscale', expiresAt: tomorrow, reference: 'AF-2026' }],
    });

    const reminders = store.supplierRiskReminders();

    expect(supplier.preferred).toBe(true);
    expect(reminders).toEqual(expect.arrayContaining([
      expect.objectContaining({
        supplierId: supplier.id,
        supplierName: 'Preferred Risk Supplier',
        preferred: true,
        riskNotes: 'Attestation fiscale à renouveler avant achat.',
        expiringDocuments: [expect.objectContaining({ type: 'Attestation fiscale', daysUntilExpiry: 1 })],
      }),
    ]));
    expect(() => store.updateSupplier(supplier.id, { documentExpiries: [{ type: '', expiresAt: 'bad-date' }] })).toThrow(BadRequestException);
  });

  it('filters supplier risk reminders by expired, expiring, preferred, and noted states', () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    store.addSupplier({
      name: 'Expired Docs Supplier',
      documentExpiries: [{ type: 'RC', expiresAt: yesterday }],
    });
    store.addSupplier({
      name: 'Expiring Docs Supplier',
      documentExpiries: [{ type: 'Attestation fiscale', expiresAt: tomorrow }],
    });
    store.addSupplier({ name: 'Preferred Only Supplier', preferred: true });
    store.addSupplier({ name: 'Noted Only Supplier', riskNotes: 'Surveiller les délais de livraison.' });

    expect(store.supplierRiskReminders({ filter: 'expired' }).map((row) => row.supplierName)).toContain('Expired Docs Supplier');
    expect(store.supplierRiskReminders({ filter: 'expiring' }).map((row) => row.supplierName)).toContain('Expiring Docs Supplier');
    expect(store.supplierRiskReminders({ filter: 'preferred' }).map((row) => row.supplierName)).toContain('Preferred Only Supplier');
    expect(store.supplierRiskReminders({ filter: 'noted' }).map((row) => row.supplierName)).toContain('Noted Only Supplier');
  });

  it('adds supplier document upload placeholders linked to expiry reminders', () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const supplier = store.addSupplier({ name: 'Document Placeholder Supplier' });

    const result = store.addSupplierDocumentPlaceholder(supplier.id, {
      type: 'Attestation CNSS',
      expiresAt: tomorrow,
      fileName: 'attestation-cnss.pdf',
    });

    expect(result.document).toMatchObject({
      type: 'Attestation CNSS',
      expiresAt: tomorrow,
      fileName: 'attestation-cnss.pdf',
      uploadStatus: 'PLACEHOLDER',
      uploadedAt: new Date().toISOString().slice(0, 10),
    });
    expect(result.document.storageKey).toContain(`suppliers/${supplier.id}/documents/doc-`);
    expect(store.supplierRiskReminders({ filter: 'expiring' })).toEqual(expect.arrayContaining([
      expect.objectContaining({
        supplierId: supplier.id,
        expiringDocuments: [expect.objectContaining({ fileName: 'attestation-cnss.pdf' })],
      }),
    ]));
  });

  it('imports and exports leads CSV with validation summaries', () => {
    const result = store.importLeadsCsv([
      'customerName,stage,owner,source,nextActionDate,expectedValue',
      'Hotel CSV,QUALIFIED,Nadia,Salon,2026-06-01,35000',
      ',INVALID,,,,-1',
    ].join('\n'));
    const csv = store.exportLeadsCsv();

    expect(result.created).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.errors[0].row).toBe(3);
    expect(result.records[0].customerName).toBe('Hotel CSV');
    expect(csv).toContain('customerName,stage,owner,source,nextActionDate,expectedValue');
    expect(csv).toContain('Hotel CSV,QUALIFIED,Nadia,Salon,2026-06-01,35000');
  });

  it('groups lead source analytics by source, owner, expected value, won/lost rate, and month', () => {
    store.addLead({ customerName: 'Lead Won', stage: 'WON', owner: 'Nadia', source: 'Salon', expectedValue: 10000 });
    store.addLead({ customerName: 'Lead Lost', stage: 'LOST', owner: 'Nadia', source: 'Salon', expectedValue: 5000 });
    store.addLead({ customerName: 'Lead Web', stage: 'QUALIFIED', owner: 'Omar', source: 'Web', expectedValue: 20000 });

    const analytics = store.leadSourceAnalytics();

    expect(analytics[0]).toMatchObject({
      source: 'Web',
      owner: 'Omar',
      leads: 1,
      expectedValue: 20000,
      won: 0,
      lost: 0,
      winRate: 0,
      lostRate: 0,
    });
    expect(analytics.find((row) => row.source === 'Salon')).toMatchObject({
      owner: 'Nadia',
      leads: 2,
      expectedValue: 15000,
      won: 1,
      lost: 1,
      winRate: 0.5,
      lostRate: 0.5,
    });
    expect(analytics[0].month).toMatch(/^\d{4}-\d{2}$/);
  });

  it('imports and exports supplier CSV with bank normalization and validation summaries', () => {
    const result = store.importSuppliersCsv([
      'name,ice,ifNumber,email,paymentTermsDays,bankName,rib',
      'Supplier CSV,001000111222333,889900,csv@example.ma,60,awb,007 780 000000000000000321',
      'Bad Supplier,,,,30,CIH,12345',
    ].join('\n'));
    const csv = store.exportSuppliersCsv();

    expect(result.created).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.errors[0]).toEqual(expect.objectContaining({ row: 3 }));
    expect(result.records[0].bankDetails[0].bankName).toBe('Attijariwafa bank');
    expect(result.records[0].bankDetails[0].rib).toBe('007780000000000000000321');
    expect(csv).toContain('name,ice,ifNumber,email,paymentTermsDays,bankName,rib');
    expect(csv).toContain('Supplier CSV,001000111222333,889900,csv@example.ma,60,Attijariwafa bank,007780000000000000000321');
  });

  it('searches tenant business records across CRM, suppliers, products, invoices, and orders', () => {
    const lead = store.addLead({ customerName: 'Clinique Atlas Search', source: 'Web', expectedValue: 30000 });
    const order = store.createSalesOrder({ customerId: 'cus-1', lines: [{ productId: 'prd-1', quantity: 1 }] });
    const invoice = store.createInvoice({ customerId: 'cus-1', lines: [{ productId: 'prd-2', quantity: 1 }] });

    expect(store.businessSearch({ q: 'Rabat Retail' }).map((result) => result.type)).toContain('customers');
    expect(store.businessSearch({ q: 'Clinique Atlas' })[0]).toMatchObject({ type: 'leads', id: lead.id, view: 'crm' });
    expect(store.businessSearch({ q: '445566' })[0]).toMatchObject({ type: 'suppliers', title: 'Casa Import SA' });
    expect(store.businessSearch({ q: 'SKU-CHAIR', types: ['products'] })[0]).toMatchObject({ type: 'products', reference: 'SKU-CHAIR' });
    expect(store.businessSearch({ q: invoice.number })[0]).toMatchObject({ type: 'invoices', reference: invoice.number, amount: 1440 });
    expect(store.businessSearch({ q: order.number, types: ['orders'], limit: 1 })).toEqual([
      expect.objectContaining({ type: 'orders', reference: order.number }),
    ]);
    expect(store.businessSearch({ q: 'Rabat Retail', types: ['products'] })).toEqual([]);
  });

  it('keeps business search tenant scoped', () => {
    const tenant = store.createTenant({ tradeName: 'Tenant Search SARL', ice: '009999888777666' });
    const customer = store.addCustomer({ name: 'Client Secret Tenant', ice: '009999888777111' }, tenant.id);

    expect(store.businessSearch({ q: 'Client Secret' })).toEqual([]);
    expect(store.businessSearch({ q: 'Client Secret' }, tenant.id)[0]).toMatchObject({
      type: 'customers',
      id: customer.id,
    });
  });

  it('summarizes dashboard filters for overdue actions, unpaid balances, and supplier terms', () => {
    store.addLead({
      customerName: 'Action Retard',
      stage: 'QUALIFIED',
      nextActionDate: '2026-01-15',
      owner: 'Nadia',
      expectedValue: 8000,
    });
    store.addLead({
      customerName: 'Action Gagnée',
      stage: 'WON',
      nextActionDate: '2026-01-10',
      expectedValue: 1000,
    });
    const invoice = store.createInvoice({ customerId: 'cus-1', lines: [{ productId: 'prd-1', quantity: 1 }] });
    store.addSupplier({ name: 'Long Terms Supplier', paymentTermsDays: 90 });

    const filters = store.dashboardFilters();

    expect(filters.overdueNextActions).toEqual([
      expect.objectContaining({ customerName: 'Action Retard', owner: 'Nadia' }),
    ]);
    expect(filters.unpaidCustomerBalances).toEqual([
      expect.objectContaining({ number: invoice.number, customerName: 'Rabat Retail SARL', balance: 1020 }),
    ]);
    expect(filters.supplierPaymentTerms[0]).toMatchObject({ name: 'Long Terms Supplier', paymentTermsDays: 90 });
    expect(filters.counts).toMatchObject({
      overdueNextActions: 1,
      unpaidCustomerBalances: 1,
      supplierPaymentTerms: 2,
    });
  });

  it('supports full product CRUD, SKU uniqueness, VAT rule validation, and stock behavior', () => {
    const product = store.addProduct({
      sku: 'sku-desk',
      name: 'Bureau compact',
      type: 'GOODS',
      unit: 'unite',
      salePrice: 1500,
      purchaseCost: 900,
      vatRate: 0.2,
      stockOnHand: 5,
      reorderPoint: 2,
    });

    expect(product.sku).toBe('SKU-DESK');
    expect(store.getProduct(product.id).trackStock).toBe(true);
    expect(() => store.addProduct({ sku: 'SKU-DESK', name: 'Duplicate', salePrice: 10 })).toThrow(BadRequestException);
    expect(() => store.updateProduct(product.id, { vatRate: 0.19 as any })).toThrow(BadRequestException);

    const service = store.addProduct({ sku: 'svc-clean', name: 'Nettoyage', type: 'SERVICE', salePrice: 300, stockOnHand: 99 });
    expect(service.trackStock).toBe(false);
    expect(service.stockOnHand).toBe(0);
    expect(() => store.adjustStock(service.id, 1)).toThrow(BadRequestException);

    const updated = store.updateProduct(product.id, { salePrice: 1600, active: false });
    expect(updated.salePrice).toBe(1600);
    expect(updated.active).toBe(false);
  });

  it('builds customer, supplier, and invoice timelines from documents, commercial events, notes, and tasks', () => {
    const quote = store.createQuote({ customerId: 'cus-1', lines: [{ productId: 'prd-1', quantity: 1 }] });
    const invoice = store.createInvoice({ customerId: 'cus-1', lines: [{ productId: 'prd-2', quantity: 1 }] });
    const payment = store.recordPayment({ invoiceId: invoice.id, amount: 400, method: 'BANK' });
    const creditNote = store.createCreditNote({
      invoiceId: invoice.id,
      reason: 'Geste commercial',
      lines: [{ productId: 'prd-2', quantity: 0.25 }],
    });
    const receipt = store.createPurchaseReceipt({ supplierId: 'sup-1', lines: [{ productId: 'prd-1', quantity: 2, unitCost: 500 }] });
    const customerNote = store.addInternalNote({ entityType: 'CUSTOMER', entityId: 'cus-1', author: 'Compta', body: 'Relancer avec facture et ICE.' });
    const customerTask = store.addInternalTask({ entityType: 'CUSTOMER', entityId: 'cus-1', title: 'Vérifier garantie', assignedTo: 'Nadia', dueDate: '2026-06-01' });
    const supplierNote = store.addInternalNote({ entityType: 'SUPPLIER', entityId: 'sup-1', body: 'Demander attestation fiscale.' });
    const invoiceTask = store.addInternalTask({ entityType: 'INVOICE', entityId: invoice.id, title: 'Contrôler paiement', assignedTo: 'Omar' });

    const customerTimeline = store.entityTimeline('CUSTOMER', 'cus-1');
    const supplierTimeline = store.entityTimeline('SUPPLIER', 'sup-1');
    const invoiceTimeline = store.entityTimeline('INVOICE', invoice.id);

    expect(customerTimeline.counts).toMatchObject({ notes: 1, tasks: 1, openTasks: 1 });
    expect(customerTimeline.items).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: quote.id, type: 'QUOTE', label: quote.number }),
      expect.objectContaining({ id: invoice.id, type: 'INVOICE', label: invoice.number }),
      expect.objectContaining({ id: payment.id, type: 'PAYMENT', amount: 400 }),
      expect.objectContaining({ id: creditNote.id, type: 'CREDIT_NOTE', label: creditNote.number }),
      expect.objectContaining({ id: customerNote.id, type: 'NOTE', description: 'Relancer avec facture et ICE.' }),
      expect.objectContaining({ id: customerTask.id, type: 'TASK', assignedTo: 'Nadia' }),
    ]));
    expect(supplierTimeline.items).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: receipt.id, type: 'PURCHASE_RECEIPT', label: receipt.number }),
      expect.objectContaining({ id: supplierNote.id, type: 'NOTE', description: 'Demander attestation fiscale.' }),
    ]));
    expect(invoiceTimeline.counts.openTasks).toBe(1);
    expect(invoiceTimeline.items).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: invoice.id, type: 'INVOICE' }),
      expect.objectContaining({ id: payment.id, type: 'PAYMENT' }),
      expect.objectContaining({ id: creditNote.id, type: 'CREDIT_NOTE' }),
      expect.objectContaining({ id: invoiceTask.id, type: 'TASK', label: 'Contrôler paiement' }),
    ]));
  });

  it('tracks internal payroll-run collaboration and task status on the board', () => {
    const note = store.addInternalNote({ entityType: 'PAYROLL_RUN', entityId: 'PAY-2026-05', author: 'RH', body: 'CNSS à contrôler avant Damancom.' });
    const task = store.addInternalTask({ entityType: 'PAYROLL_RUN', entityId: 'PAY-2026-05', title: 'Valider les bases IR', assignedTo: 'Comptable', dueDate: '2026-05-31' });

    expect(store.entityTimeline('PAYROLL_RUN', 'PAY-2026-05').items).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: note.id, type: 'NOTE' }),
      expect.objectContaining({ id: task.id, type: 'TASK', status: 'OPEN' }),
    ]));
    expect(store.collaborationBoard().counts).toMatchObject({ notes: 1, tasks: 1, openTasks: 1 });

    const closed = store.updateInternalTaskStatus(task.id, 'DONE');

    expect(closed.status).toBe('DONE');
    expect(closed.closedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(store.collaborationBoard().counts.openTasks).toBe(0);
    expect(() => store.updateInternalTaskStatus(task.id, 'INVALID' as any)).toThrow(BadRequestException);
    expect(() => store.addInternalNote({ entityType: 'CUSTOMER', entityId: 'missing', body: 'Impossible' })).toThrow('Client introuvable');
  });

  it('archives and restores inactive customers, suppliers, and products in bulk with audit evidence', () => {
    const customer = store.addCustomer({ name: 'Client Archive Bulk' });
    const supplier = store.addSupplier({ name: 'Fournisseur Archive Bulk' });
    const product = store.addProduct({ sku: 'BULK-ARCH', name: 'Produit archive bulk', salePrice: 100, purchaseCost: 50 });

    expect(store.bulkArchiveRestore({ entity: 'CUSTOMER', ids: [customer.id], action: 'ARCHIVE' }).touched)
      .toEqual([expect.objectContaining({ id: customer.id, active: false })]);
    expect(store.bulkArchiveRestore({ entity: 'SUPPLIER', ids: [supplier.id], action: 'ARCHIVE' }).touched)
      .toEqual([expect.objectContaining({ id: supplier.id, active: false })]);
    expect(store.bulkArchiveRestore({ entity: 'PRODUCT', ids: [product.id], action: 'ARCHIVE' }).touched)
      .toEqual([expect.objectContaining({ id: product.id, name: 'BULK-ARCH', active: false })]);

    store.bulkArchiveRestore({ entity: 'CUSTOMER', ids: [customer.id], action: 'RESTORE' });
    store.bulkArchiveRestore({ entity: 'SUPPLIER', ids: [supplier.id], action: 'RESTORE' });
    store.bulkArchiveRestore({ entity: 'PRODUCT', ids: [product.id], action: 'RESTORE' });

    expect(store.getCustomer(customer.id).active).toBe(true);
    expect(store.getSupplier(supplier.id).active).toBe(true);
    expect(store.getProduct(product.id).active).toBe(true);
    expect(store.auditLogs().map((entry) => entry.action)).toEqual(expect.arrayContaining([
      'bulk.customer.archive',
      'bulk.supplier.archive',
      'bulk.product.archive',
      'bulk.customer.restore',
      'bulk.supplier.restore',
      'bulk.product.restore',
    ]));
    expect(() => store.bulkArchiveRestore({ entity: 'CUSTOMER', ids: [], action: 'ARCHIVE' })).toThrow(BadRequestException);
    expect(() => store.bulkArchiveRestore({ entity: 'PRODUCT', ids: [product.id], action: 'BAD' as any })).toThrow(BadRequestException);
  });

  it('keeps Arabic-ready customer, supplier, product, document, and employee fields without changing French-first workflows', () => {
    const customer = store.addCustomer({
      name: 'Client Arabic Ready',
      arabicName: 'عميل جاهز للعربية',
      arabicAddress: 'شارع الحسن الثاني',
      preferredLanguage: 'BILINGUAL',
      documentExpiries: [{ type: 'Contrat cadre', arabicType: 'عقد إطار', expiresAt: '2027-01-01' }],
    });
    const supplier = store.addSupplier({
      name: 'Supplier Arabic Ready',
      arabicName: 'مورد جاهز للعربية',
      arabicAddress: 'المنطقة الصناعية',
      preferredLanguage: 'AR',
      documentExpiries: [{ type: 'Attestation fiscale', arabicType: 'شهادة ضريبية', expiresAt: '2027-02-01' }],
    });
    const product = store.addProduct({
      sku: 'AR-SVC',
      name: 'Service bilingue',
      arabicDescription: 'خدمة ثنائية اللغة',
      type: 'SERVICE',
      salePrice: 900,
    });
    const employee = store.addEmployee({
      fullName: 'Salma Idrissi',
      arabicName: 'سلمى الإدريسي',
      cin: 'CD123456',
      hireDate: '2026-01-02',
      baseSalary: 7000,
      preferredLanguage: 'BILINGUAL',
      documentExpiries: [{ type: 'CIN', arabicType: 'البطاقة الوطنية', expiresAt: '2031-01-02' }],
    });
    const quote = store.createQuote({
      customerId: customer.id,
      lines: [{ productId: product.id, description: 'Service bilingue', descriptionAr: 'خدمة ثنائية اللغة', quantity: 1 }],
    });

    expect(customer).toMatchObject({ arabicName: 'عميل جاهز للعربية', preferredLanguage: 'BILINGUAL' });
    expect(customer.documentExpiries[0]).toMatchObject({ arabicType: 'عقد إطار' });
    expect(supplier).toMatchObject({ arabicName: 'مورد جاهز للعربية', preferredLanguage: 'AR' });
    expect(supplier.documentExpiries[0]).toMatchObject({ arabicType: 'شهادة ضريبية' });
    expect(product.arabicDescription).toBe('خدمة ثنائية اللغة');
    expect(employee).toMatchObject({ arabicName: 'سلمى الإدريسي', preferredLanguage: 'BILINGUAL' });
    expect(quote.lines[0]).toMatchObject({ descriptionAr: 'خدمة ثنائية اللغة' });
    expect(store.businessSearch({ q: 'Client Arabic Ready' })[0]).toMatchObject({ type: 'customers', title: 'Client Arabic Ready' });
    expect(() => store.addCustomer({ name: 'Bad Language', preferredLanguage: 'ES' as any })).toThrow(BadRequestException);
  });

  it('publishes stable CSV import templates for master data and PCGE setup', () => {
    const catalog = store.importTemplates();
    const modules = catalog.templates.map((template) => template.module);

    expect(modules).toEqual(['customers', 'suppliers', 'products', 'employees', 'chart-of-accounts']);
    expect(catalog.templates.find((template) => template.module === 'customers')?.headers).toEqual(expect.arrayContaining(['arabicName', 'arabicAddress', 'preferredLanguage']));
    expect(catalog.templates.find((template) => template.module === 'employees')?.headers).toEqual(expect.arrayContaining(['fullName', 'arabicName', 'cnssNumber']));
    expect(catalog.templates.find((template) => template.module === 'chart-of-accounts')?.headers).toEqual(expect.arrayContaining(['account', 'labelFr', 'labelAr']));
    expect(store.importTemplateCsv('customers')).toContain('name,arabicName,ice');
    expect(store.importTemplateCsv('products')).toContain('sku,barcode,name,arabicDescription');
    expect(store.importTemplateCsv('employees')).toContain('employeeNumber,fullName,arabicName');
    expect(store.importTemplateCsv('chart-of-accounts')).toContain('342100');
  });

  it('summarizes implementation partner client tenants and onboarding readiness', () => {
    const created = store.createPartnerClientTenant({
      tradeName: 'Client Partenaire SARL',
      city: 'Marrakech',
      partnerEmail: 'partner@atlas.ma',
    });
    let workspace = store.implementationPartnerWorkspace();
    const newClient = workspace.clients.find((client) => client.tenantId === created.tenant.id);

    expect(workspace.totals.tenants).toBeGreaterThanOrEqual(2);
    expect(newClient).toMatchObject({
      tradeName: 'Client Partenaire SARL',
      ready: false,
      counts: { customers: 0, suppliers: 0, employees: 0, products: 0 },
    });
    expect(newClient?.blockers).toEqual(expect.arrayContaining(['Identité légale complète', 'Au moins un client créé']));

    store.updatePartnerClientOnboarding(created.tenant.id, {
      tradeName: 'Client Partenaire SARL',
      ice: '009999888777666',
      ifNumber: '555444',
      rc: 'MARRAKECH-1001',
      patente: 'PAT-1001',
      cnssNumber: '7654321',
      address: 'Avenue Mohammed VI',
      city: 'Marrakech',
      invoiceSeries: 'CP',
      fiscalYearStartMonth: 1,
      vatStatus: 'ENABLED',
    });
    store.addCustomer({ name: 'Client final' }, created.tenant.id);
    store.addProduct({ sku: 'CP-SVC', name: 'Service client', type: 'SERVICE', salePrice: 1000 }, created.tenant.id);
    workspace = store.implementationPartnerWorkspace();

    expect(workspace.clients.find((client) => client.tenantId === created.tenant.id)).toMatchObject({
      readinessScore: 100,
      ready: true,
    });
    expect(store.auditLogs(created.tenant.id).map((entry) => entry.action)).toEqual(expect.arrayContaining([
      'implementation.client-created',
      'implementation.client-onboarding-updated',
    ]));
  });

  it('runs secure auth sessions, refresh, password reset, 2FA, device history, role navigation, and write gates', () => {
    const firstLogin = store.login({
      email: 'owner@atlas.ma',
      password: 'demo1234',
      ip: '41.248.10.1',
      userAgent: 'Chrome Casablanca',
    });
    const refreshed = store.refreshSession(firstLogin.refresh_token);
    const reset = store.requestPasswordReset('owner@atlas.ma');
    const passwordUpdate = store.resetPassword({ token: reset.resetToken!, password: 'new-demo-1234' });
    const secondLogin = store.login({
      email: 'owner@atlas.ma',
      password: 'new-demo-1234',
      ip: '41.248.10.99',
      userAgent: 'Firefox Rabat',
    });
    const twoFactor = store.login({ email: 'accountant@atlas.ma', password: 'demo1234' });
    const verified = store.login({ email: 'accountant@atlas.ma', password: 'demo1234', twoFactorCode: '246810' });
    const deviceHistory = store.deviceHistory();
    const nav = store.roleNavigation('READ_ONLY');

    expect(firstLogin.status).toBe('AUTHENTICATED');
    expect(firstLogin.access_token).toMatch(/^access_/);
    expect(refreshed.access_token).toMatch(/^access_/);
    expect(refreshed.access_token).not.toBe(firstLogin.access_token);
    expect(passwordUpdate).toMatchObject({ status: 'PASSWORD_UPDATED' });
    expect(secondLogin.status).toBe('AUTHENTICATED');
    expect(twoFactor).toMatchObject({ status: 'TWO_FACTOR_REQUIRED', tenantId: 'tenant-demo' });
    expect(verified.status).toBe('AUTHENTICATED');
    expect(deviceHistory.suspicious).toBeGreaterThanOrEqual(1);
    expect(deviceHistory.notifications.map((notification) => notification.type)).toEqual(expect.arrayContaining(['PASSWORD_RESET', 'SUSPICIOUS_LOGIN']));
    expect(nav.modules.every((module) => module.visible)).toBe(true);
    expect(nav.modules.every((module) => !module.canWrite)).toBe(true);
    expect(store.auditLogs().map((entry) => entry.action)).toEqual(expect.arrayContaining(['auth.login', 'auth.session-refreshed', 'auth.password-reset-completed']));

    (cls.get as jest.Mock).mockImplementation((key?: string) => key === 'userRole' ? 'READ_ONLY' : 'tenant-demo');
    expect(() => store.addCustomer({ name: 'Client lecture seule' })).toThrow(ForbiddenException);
    (cls.get as jest.Mock).mockImplementation((key?: string) => key === 'userRole' ? 'OWNER' : 'tenant-demo');

    const gate = store.updateSubscriptionGate({ writeLocked: true, reason: 'Facture abonnement en retard' });
    expect(gate.writeLocked).toBe(true);
    expect(() => store.addCustomer({ name: 'Client verrouillé' })).toThrow(ForbiddenException);
    expect(store.listCustomers()).toHaveLength(1);
    const manifest = store.requestTenantExport();
    const retention = store.requestTenantDelete({ retentionDays: 365 });
    expect(manifest.status).toBe('READY_FOR_DOWNLOAD');
    expect(manifest.files.map((file) => file.name)).toEqual(expect.arrayContaining(['customers.json', 'audit-logs.json']));
    expect(retention.deleteScheduled).toBe(true);
    store.updateSubscriptionGate({ writeLocked: false, reason: '' });
  });

  it('keeps tenants isolated across auth, CRM, sales, inventory, payroll, accounting, and audit data', () => {
    const tenant = store.createTenant({
      tradeName: 'Tenant Isolation SARL',
      ice: '001234000999888',
      ifNumber: '991122',
      rc: 'CASA-ISO-1',
      patente: '445566',
      cnssNumber: '998877',
      address: 'Maarif',
      city: 'Casablanca',
    });
    const customer = store.addCustomer({ name: 'Client isolé' }, tenant.id);
    const product = store.addProduct({ sku: 'ISO-SVC', name: 'Service isolé', type: 'SERVICE', salePrice: 1000 }, tenant.id);
    const invoice = store.createInvoice({ customerId: customer.id, lines: [{ productId: product.id, quantity: 1 }] }, tenant.id);
    const employee = store.addEmployee({ fullName: 'Salarié Isolé', cin: 'II123456', hireDate: '2026-02-01', baseSalary: 5000 }, tenant.id);

    expect(store.listCustomers()).toHaveLength(1);
    expect(store.listCustomers(tenant.id).map((item) => item.name)).toEqual(['Client isolé']);
    expect(store.listProducts().some((item) => item.sku === 'ISO-SVC')).toBe(false);
    expect(store.listInvoices()).toHaveLength(0);
    expect(store.listInvoices(tenant.id)[0].id).toBe(invoice.id);
    expect(store.listEmployees(tenant.id)[0].id).toBe(employee.id);
    expect(store.listJournalEntries(tenant.id)).toHaveLength(1);
    expect(store.auditLogs(tenant.id).every((entry) => entry.tenantId === tenant.id)).toBe(true);
    expect(() => store.getCustomer(customer.id)).toThrow();
  });

  it('runs purchase orders through approval, partial/full receipt, supplier invoice posting, CUMP, and payable accounting', () => {
    const order = store.createPurchaseOrder({
      supplierId: 'sup-1',
      expectedDate: '2026-06-10',
      lines: [{ productId: 'prd-1', quantity: 10, unitCost: 650 }],
    });
    const approved = store.approvePurchaseOrder(order.id);
    const partial = store.createPurchaseReceipt({
      purchaseOrderId: approved.id,
      lines: [{ productId: 'prd-1', quantity: 4, unitCost: 650 }],
    });
    const completed = store.createPurchaseReceipt({ purchaseOrderId: approved.id });
    const supplierInvoice = store.createSupplierInvoice({
      purchaseReceiptId: completed.id,
      supplierInvoiceNumber: 'F-CASA-100',
      vatRate: 0.2,
    });
    const product = store.getProduct('prd-1');

    expect(order.number).toMatch(/^BA-/);
    expect(order.status).toBe('RECEIVED');
    expect(partial.purchaseOrderId).toBe(order.id);
    expect(partial.total).toBe(2600);
    expect(completed.total).toBe(3900);
    expect(product.stockOnHand).toBe(60);
    expect(product.weightedAverageCost).toBeCloseTo(541.67, 2);
    expect(supplierInvoice).toMatchObject({ status: 'POSTED', subtotal: 3900, vatTotal: 780, total: 4680 });
    expect(store.listJournalEntries().map((entry) => entry.source)).toEqual(expect.arrayContaining([partial.number, completed.number, supplierInvoice.number]));
  });

  it('manages warehouses, stock by warehouse, transfers, adjustments, counts, alerts, reservations, and barcode lookup', () => {
    const secondary = store.createWarehouse({ name: 'Dépôt Rabat', city: 'Rabat', address: 'Agdal' });
    const transfer = store.transferStock({
      productId: 'prd-1',
      fromWarehouseId: 'wh-1',
      toWarehouseId: secondary.id,
      quantity: 5,
    });
    const receivedTransfer = store.receiveStockTransfer(transfer.id);
    const adjustment = store.adjustStock('prd-1', -2, 'CASSE');
    store.updateProduct('prd-1', { reorderPoint: 60 });
    const count = store.createInventoryCount({
      warehouseId: secondary.id,
      lines: [{ productId: 'prd-1', countedQuantity: 8 }],
    });
    const postedCount = store.approveInventoryCount(count.id);
    const lookup = store.barcodeLookup('6111000000010');
    const alerts = store.stockAlerts();
    const order = store.createSalesOrder({ customerId: 'cus-1', lines: [{ productId: 'prd-1', quantity: 3 }] });
    const reservations = store.stockReservationVisibility();

    expect(receivedTransfer.status).toBe('RECEIVED');
    expect(adjustment).toMatchObject({ reasonCode: 'CASSE', type: 'ADJUSTMENT' });
    expect(postedCount.status).toBe('POSTED');
    expect(store.listWarehouseStock().find((line) => line.warehouseId === secondary.id && line.productId === 'prd-1')?.quantity).toBe(8);
    expect(lookup.product.sku).toBe('SKU-CHAIR');
    expect(alerts.rows.map((row) => row.sku)).toContain('SKU-CHAIR');
    expect(reservations.rows).toEqual(expect.arrayContaining([expect.objectContaining({ source: 'ORDER', sourceNumber: order.number, quantity: 3 })]));
    expect(store.listStockTransfers()).toHaveLength(1);
    expect(store.listInventoryCounts()).toHaveLength(1);
    expect(store.listStock().find((line) => line.productId === 'prd-1')?.reservedStock).toBe(3);
  });

  it('supports PCGE search, manual journal CRUD, period states, VAT, exports, reconciliation, and legal evidence', () => {
    expect(store.searchChartAccounts('client').map((account) => account.account)).toContain('3421');

    const draft = store.createJournalEntry({
      description: 'Encaissement manuel',
      source: 'MANUAL-TEST',
      lines: [
        { account: '5141', label: 'Banque', debit: 1200, credit: 0 },
        { account: '3421', label: 'Clients', debit: 0, credit: 1200 },
      ],
    });
    const updated = store.updateJournalEntry(draft.id, { description: 'Encaissement manuel validé' });
    const posted = store.postManualJournal(updated.id);

    const invoice = store.createInvoice({ customerId: 'cus-1', lines: [{ productId: 'prd-2', quantity: 1 }] });
    store.createCreditNote({ invoiceId: invoice.id, lines: [{ productId: 'prd-2', quantity: 0.25 }] });
    const receipt = store.createPurchaseReceipt({ supplierId: 'sup-1', lines: [{ productId: 'prd-1', quantity: 1, unitCost: 500 }] });
    store.createSupplierInvoice({ purchaseReceiptId: receipt.id, vatRate: 0.2 });

    const vat = store.exportVatReport();
    const exportFile = store.exportAccounting('CSV');
    const reconciliation = store.accountReconciliation();
    const evidence = store.listLegalEvidences();
    const softLocked = store.softLockFiscalPeriod(2026, 1);
    const softLockedStatus = softLocked.status;
    const closed = store.closeFiscalPeriod(2026, 1);

    expect(posted.status).toBe('POSTED');
    expect(() => store.createJournalEntry({
      description: 'Déséquilibrée',
      lines: [
        { account: '5141', label: 'Banque', debit: 100, credit: 0 },
        { account: '3421', label: 'Clients', debit: 0, credit: 50 },
      ],
    })).toThrow(BadRequestException);
    expect(vat.vatCollected).toBe(240);
    expect(vat.vatReversed).toBe(60);
    expect(vat.vatDeductible).toBe(100);
    expect(vat.netVatPayable).toBe(80);
    expect(exportFile.content).toContain('date,source,description,status,account,label,debit,credit');
    expect(reconciliation.rows.map((row) => row.id)).toEqual(['BANK', 'CASH', 'RECEIVABLES', 'PAYABLES']);
    expect(evidence.map((item) => item.type)).toEqual(expect.arrayContaining(['VAT_REPORT', 'ACCOUNTING_EXPORT']));
    expect(softLockedStatus).toBe('SOFT_LOCKED');
    expect(closed.status).toBe('CLOSED');
  });

  it('manages employee CRUD, contracts, payroll runs, payslip PDFs, Damancom export, and locked-period payroll rejection', () => {
    const employee = store.addEmployee({
      employeeNumber: 'EMP-LOCK',
      fullName: 'Salariée Paie Test',
      cin: 'PA123456',
      cnssNumber: '9876543210',
      hireDate: '2026-01-01',
      baseSalary: 8000,
      dependents: 1,
    });
    const updated = store.updateEmployee(employee.id, { baseSalary: 9000, address: 'Casablanca' });
    const contract = store.addEmploymentContract({
      employeeId: employee.id,
      startDate: '2026-02-01',
      salary: 9000,
      attachmentName: 'contrat-paie-test.pdf',
    });
    const run = store.createPayrollRun({ year: 2026, month: 2 });
    const calculated = store.calculatePayrollRun(run.id);
    const calculatedStatus = calculated.status;
    const approved = store.approvePayrollRun(calculated.id);
    const pdf = store.generatePayslipPdf(approved.id, approved.payslips[0].id);
    const damancom = store.exportPayrollRunDamancom(approved.id);
    const posted = store.postPayrollRun(approved.id);

    const lockedRun = store.createPayrollRun({ year: 2026, month: 3 });
    store.calculatePayrollRun(lockedRun.id);
    store.approvePayrollRun(lockedRun.id);
    store.lockFiscalPeriod(2026, 3);

    expect(updated.baseSalary).toBe(9000);
    expect(contract.active).toBe(true);
    expect(calculatedStatus).toBe('CALCULATED');
    expect(calculated.totals.grossSalary).toBeGreaterThan(0);
    expect(pdf.contentBase64).toBeTruthy();
    expect(damancom.content.split('\n').filter(Boolean).every((row) => row.length === 260)).toBe(true);
    expect(posted.status).toBe('POSTED');
    expect(store.listJournalEntries().some((entry) => entry.source === posted.number)).toBe(true);
    expect(store.listLegalEvidences().map((item) => item.type)).toEqual(expect.arrayContaining(['PAYSLIP_PDF', 'DAMANCOM_EXPORT']));
    expect(() => store.postPayrollRun(lockedRun.id)).toThrow(ForbiddenException);
    expect(store.archiveEmployee(employee.id).active).toBe(false);
  });

  it('tracks leave balances, approvals, payroll impact, employee portal access, and HR document reminders', () => {
    const employee = store.addEmployee({
      employeeNumber: 'EMP-HR',
      fullName: 'Salariée RH Test',
      cin: 'RH123456',
      cnssNumber: '1112223334',
      hireDate: '2026-01-01',
      baseSalary: 7800,
      documentExpiries: [{ type: 'CIN', expiresAt: '2026-06-15', reference: 'RH123456' }],
    });
    store.addEmploymentContract({
      employeeId: employee.id,
      startDate: '2026-01-01',
      endDate: '2026-06-20',
      salary: 7800,
    });

    const request = store.createLeaveRequest({
      employeeId: employee.id,
      startDate: '2026-06-10',
      endDate: '2026-06-12',
      reason: 'Congé annuel',
    });
    const balanceAfterRequest = { ...store.listLeaveBalances().find((balance) => balance.employeeId === employee.id)! };
    const approved = store.approveLeaveRequest(request.id);
    const balanceAfterApproval = store.listLeaveBalances().find((balance) => balance.employeeId === employee.id);
    const rejectedRequest = store.createLeaveRequest({
      employeeId: employee.id,
      startDate: '2026-07-01',
      endDate: '2026-07-01',
      reason: 'Personnel',
    });
    const rejected = store.rejectLeaveRequest(rejectedRequest.id, 'Planning équipe');
    const access = store.grantEmployeePortalAccess({
      employeeId: employee.id,
      email: 'salarie.rh@atlas.ma',
      canViewPayslips: true,
      canRequestLeave: true,
    });
    const portal = store.employeePortalDashboard(employee.id);
    const reminders = store.employeeDocumentReminders();

    expect(request.days).toBe(3);
    expect(balanceAfterRequest).toMatchObject({ pendingDays: 3, remainingDays: 15 });
    expect(approved).toMatchObject({ status: 'APPROVED', days: 3 });
    expect(approved.payrollImpact).toBeCloseTo(900, 2);
    expect(balanceAfterApproval).toMatchObject({ takenDays: 3, pendingDays: 0, remainingDays: 15 });
    expect(rejected.status).toBe('REJECTED');
    expect(access).toMatchObject({ active: true, email: 'salarie.rh@atlas.ma', canViewPayslips: true, canRequestLeave: true });
    expect(portal).toMatchObject({ status: 'ACTIVE' });
    expect(portal.leaveRequests.map((item) => item.id)).toEqual(expect.arrayContaining([request.id, rejectedRequest.id]));
    expect(reminders.find((row) => row.employeeId === employee.id)).toMatchObject({ status: 'EXPIRING', contractRenewal: expect.any(Object) });
    expect(store.auditLogs().map((entry) => entry.action)).toEqual(expect.arrayContaining(['leave.requested', 'leave.approved', 'leave.rejected', 'employee-portal.granted']));
  });

  it('runs POS sessions, tickets, cash movements, refunds, Z reports, and offline queue sync conflicts', () => {
    const stockBefore = store.getProduct('prd-1').stockOnHand;
    const session = store.openPosSession({ cashierId: 'cashier-test', openingCash: 1100 });
    const ticket = store.createPosTransaction({
      sessionId: session.id,
      lines: [{ productId: 'prd-1', quantity: 1 }],
      paymentMethod: 'CASH',
    });
    const movement = store.addCashDrawerMovement({
      sessionId: session.id,
      type: 'CASH_OUT',
      amount: 20,
      reason: 'Achat fourniture caisse',
    });
    const closed = store.closePosSession(session.id, { countedCash: 2105 });
    const refund = store.refundPosTransaction(ticket.id, { reason: 'Retour client' });
    const validQueued = store.queueOfflinePosSale({
      payload: { cashierId: 'offline-test', lines: [{ productId: 'prd-2', quantity: 1 }], paymentMethod: 'CARD' },
    });
    const invalidQueued = store.queueOfflinePosSale({
      payload: { cashierId: 'offline-test', lines: [{ productId: 'missing-product', quantity: 1 }], paymentMethod: 'CARD' },
    });
    const sync = store.syncOfflinePosQueue();
    const zReport = store.dailyZReport();

    expect(ticket.number).toMatch(/^POS-/);
    expect(ticket.sessionId).toBe(session.id);
    expect(store.getProduct('prd-1').stockOnHand).toBe(stockBefore);
    expect(movement).toMatchObject({ type: 'CASH_OUT', amount: 20 });
    expect(closed).toMatchObject({ status: 'CLOSED', expectedCash: 2100, countedCash: 2105, variance: 5 });
    expect(refund.refundedTransactionId).toBe(ticket.id);
    expect(refund.totals.total).toBe(-ticket.totals.total);
    expect(sync.results.find((item) => item.id === validQueued.id)).toMatchObject({ status: 'SYNCED' });
    expect(sync.results.find((item) => item.id === invalidQueued.id)).toMatchObject({ status: 'CONFLICT' });
    expect(zReport).toMatchObject({ ticketCount: 2, refundCount: 1, salesTotal: 1440, cashVariance: 5, status: 'PREPARED' });
    expect(zReport.byPayment).toMatchObject({ CASH: 0, CARD: 1440 });
    expect(store.listJournalEntries().map((entry) => entry.source)).toEqual(expect.arrayContaining([ticket.number, refund.number]));
  });

  it('builds BOM-driven production orders with component issue, finished goods receipt, and cost rollup', () => {
    const rawBefore = store.getProduct('prd-raw').stockOnHand;
    const finishedBefore = store.getProduct('prd-fg').stockOnHand;
    const bom = store.createBillOfMaterial({
      finishedProductId: 'prd-fg',
      version: 'TEST-V1',
      components: [{ productId: 'prd-raw', quantity: 2 }],
    });
    const order = store.createProductionOrder({
      finishedProductId: 'prd-fg',
      billOfMaterialId: bom.id,
      quantity: 3,
    });

    expect(bom).toMatchObject({ active: true, finishedProductId: 'prd-fg' });
    expect(order).toMatchObject({ status: 'COMPLETED', billOfMaterialId: bom.id, consumedValue: 540, outputValue: 540 });
    expect(store.getProduct('prd-raw').stockOnHand).toBe(rawBefore - 6);
    expect(store.getProduct('prd-fg').stockOnHand).toBe(finishedBefore + 3);
    expect(store.getProduct('prd-fg').weightedAverageCost).toBeCloseTo(267.27, 2);
    expect(store.listProductionOrders()[0].number).toMatch(/^OF-/);
  });

  it('tracks maintenance assets, fleet logs, projects, and profitability rows', () => {
    const asset = store.createMaintenanceAsset({ name: 'Presse atelier', category: 'Machine', location: 'Tanger' });
    const workOrder = store.createMaintenanceWorkOrder({
      assetId: asset.id,
      technician: 'Technicien Tanger',
      description: 'Révision hydraulique',
      cost: 1250,
    });
    const completedWorkOrder = store.completeMaintenanceWorkOrder(workOrder.id);
    const vehicle = store.createFleetVehicle({
      plate: 'WW-123456',
      driver: 'Chauffeur Nord',
      documentExpiry: '2026-12-31',
    });
    const fleetLog = store.addFleetLog({ vehicleId: vehicle.id, type: 'FUEL', amount: 500, odometer: 15000 });
    const project = store.createProject({
      customerId: 'cus-1',
      name: 'Projet intégration ERP',
      budget: 40000,
      tasks: [{ title: 'Atelier cadrage', status: 'DONE' }],
      expenses: [{ label: 'Déplacement', amount: 700 }],
      timesheets: [{ employeeId: 'emp-1', hours: 10, costRate: 150 }],
      invoiceMilestones: [{ label: 'Acompte', amount: 12000, invoiced: true }],
    });
    const updated = store.updateProject(project.id, { status: 'IN_PROGRESS', tasks: [{ title: 'Recette', status: 'OPEN' }] });
    const maintenance = store.listMaintenance();
    const fleet = store.listFleet();
    const profitability = store.profitabilityView();

    expect(completedWorkOrder.status).toBe('DONE');
    expect(maintenance).toMatchObject({ assets: [expect.objectContaining({ id: asset.id })], workOrders: [expect.objectContaining({ id: workOrder.id, cost: 1250 })] });
    expect(fleet).toMatchObject({ vehicles: [expect.objectContaining({ id: vehicle.id })], logs: [expect.objectContaining({ id: fleetLog.id, amount: 500 })] });
    expect(updated).toMatchObject({ status: 'IN_PROGRESS', tasks: [{ title: 'Recette', status: 'OPEN' }] });
    expect(profitability.rows).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'MAINTENANCE', cost: 1250, margin: -1250 }),
      expect.objectContaining({ type: 'FLEET', cost: 500, margin: -500 }),
      expect.objectContaining({ type: 'PROJECT', reference: 'Projet intégration ERP', revenue: 12000, cost: 2200, margin: 9800 }),
    ]));
    expect(profitability.totals.margin).toBe(8050);
  });

  it('generates Moroccan document PDFs, persists file metadata, exposes templates, and controls numbering by document type', () => {
    const quote = store.createQuote({ customerId: 'cus-1', lines: [{ productId: 'prd-1', quantity: 1 }] });
    store.approveQuote(quote.id);
    const order = store.convertQuoteToOrder(quote.id);
    const delivery = store.createDeliveryNoteFromOrder(order.id);
    const invoice = store.convertOrderToInvoice(order.id);
    const creditNote = store.createCreditNote({ invoiceId: invoice.id, lines: [{ productId: 'prd-1', quantity: 0.25 }] });
    const purchaseOrder = store.approvePurchaseOrder(store.createPurchaseOrder({ supplierId: 'sup-1', lines: [{ productId: 'prd-raw', quantity: 2, unitCost: 90 }] }).id);
    const purchaseReceipt = store.createPurchaseReceipt({ purchaseOrderId: purchaseOrder.id });

    const pdfs = [
      store.exportQuotePdf(quote.id),
      store.exportDeliveryNotePdf(delivery.id),
      store.exportInvoicePdf(invoice.id),
      store.exportCreditNotePdf(creditNote.id),
      store.exportPurchaseOrderPdf(purchaseOrder.id),
      store.exportPurchaseReceiptPdf(purchaseReceipt.id),
    ];
    const invoicePdfText = Buffer.from(pdfs[2].contentBase64, 'base64').toString('binary');
    const numbering = store.documentNumberingSettings();
    const updatedNumbering = store.updateDocumentNumberingSetting({ type: 'INVOICE', prefix: 'FCA' });
    const templates = store.documentTemplateCatalog();
    const storage = store.fileStorageStatus();

    expect(pdfs.every((pdf) => Buffer.from(pdf.contentBase64, 'base64').toString('binary').startsWith('%PDF-'))).toBe(true);
    for (const required of ['Facture', invoice.number, 'ICE 001525678000083', 'IF 1525678', 'RC CASA-425001', 'Patente 34218811', 'Client Rabat Retail SARL', 'TVA par taux', 'Total TTC', 'Champs bilingues prêts']) {
      expect(invoicePdfText).toContain(required);
    }
    expect(invoicePdfText).toContain('TVA par taux 20%');
    expect(invoicePdfText).not.toContain('NaN%');
    expect(pdfs[2].requiredMentions).toEqual(expect.arrayContaining(['ICE vendeur', 'Numéro séquentiel', 'Lignes TVA', 'Total TTC']));
    expect(numbering.settings.map((setting) => setting.type)).toEqual(expect.arrayContaining(['QUOTE', 'INVOICE', 'PURCHASE_ORDER', 'PAYSLIP']));
    expect(updatedNumbering.settings.find((setting) => setting.type === 'INVOICE')?.prefix).toBe('FCA');
    expect(templates.bilingualReady).toBe(true);
    expect(templates.templates.map((template) => template.type)).toEqual(expect.arrayContaining(['INVOICE', 'PAYSLIP']));
    expect(storage.activeProvider).toBe('LOCAL_DEV');
    expect(storage.providers.map((provider) => provider.id)).toEqual(['LOCAL_DEV', 'OBJECT_STORAGE_ADAPTER']);
    expect(storage.files).toHaveLength(6);
    expect(store.listLegalEvidences().map((item) => item.type)).toContain('DOCUMENT_PDF');
  });

  it('builds a sales dashboard by period, customer, product, VAT rate, and unpaid balance', () => {
    const first = store.createInvoice({ customerId: 'cus-1', lines: [{ productId: 'prd-1', quantity: 2 }] });
    const second = store.createInvoice({ customerId: 'cus-1', lines: [{ productId: 'prd-2', quantity: 1 }] });
    store.recordPayment({ invoiceId: first.id, amount: 1000, method: 'BANK' });
    store.createCreditNote({ invoiceId: second.id, lines: [{ productId: 'prd-2', quantity: 0.25 }] });

    const report = store.salesDashboardReport({ year: 2026 });

    expect(report.invoiceCount).toBe(2);
    expect(report.creditNoteCount).toBe(1);
    expect(report.totals).toMatchObject({ revenue: 3120, unpaid: 2480, vat: 520 });
    expect(report.byCustomer[0]).toMatchObject({ customerName: 'Rabat Retail SARL', revenue: 3480, unpaid: 2480, invoices: 2 });
    expect(report.byProduct.map((row) => row.sku)).toEqual(expect.arrayContaining(['SKU-CHAIR', 'SVC-INSTALL']));
    expect(report.byVatRate).toEqual([expect.objectContaining({ rate: '0.2', taxable: 2900, vat: 580, total: 3480 })]);
    expect(report.unpaidInvoices.map((row) => row.number)).toEqual(expect.arrayContaining([first.number, second.number]));
  });

  it('prepares operational reports, adapters, bank import, email delivery, webhooks, API keys, and seed acceptance scenarios', () => {
    const invoice = store.createInvoice({ customerId: 'cus-1', dueDate: '2026-04-01', lines: [{ productId: 'prd-1', quantity: 1 }] });
    store.recordPayment({ invoiceId: invoice.id, amount: 500, method: 'BANK' });
    const receipt = store.createPurchaseReceipt({ supplierId: 'sup-1', lines: [{ productId: 'prd-raw', quantity: 2, unitCost: 95 }] });
    const supplierInvoice = store.createSupplierInvoice({ purchaseReceiptId: receipt.id, dueDate: '2026-04-01' });
    const payrollRun = store.createPayrollRun({ year: 2026, month: 5 });
    store.calculatePayrollRun(payrollRun.id);
    store.approvePayrollRun(payrollRun.id);
    store.postPayrollRun(payrollRun.id);

    const valuation = store.inventoryValuationReport();
    const aging = store.agingReports();
    const pnl = store.profitAndLossReport({ year: 2026 });
    const balance = store.balanceSheetReport({ year: 2026 });
    const payrollCost = store.payrollCostReport({ year: 2026, month: 5 });
    const cohort = store.cohortMetrics();
    const dgi = store.adapterInterface('DGI');
    const cnssSubmission = store.runAdapterOperation('CNSS', { operation: 'archive', reference: payrollRun.number, payload: { period: payrollRun.period } });
    const bank = store.importBankStatement({ csv: `date,label,amount,reference\n2026-05-24,Client ${invoice.number},${invoice.totals.total - 500},${invoice.number}` });
    const email = store.queueEmailDelivery({ type: 'INVOICE', to: 'client@example.ma', subject: `Facture ${invoice.number}`, attachmentName: `${invoice.number}.pdf` });
    const webhook = store.emitWebhookEvent({ event: 'invoice.posted', payload: { invoiceId: invoice.id, total: invoice.totals.total } });
    const apiKey = store.createPartnerApiKey({ name: 'Cabinet API', scopes: ['sales:read', 'accounting:read'], expiresAt: '2026-12-31' });
    const scenarios = store.acceptanceScenarios();

    expect(valuation.method).toBe('CUMP');
    expect(valuation.totals.value).toBeGreaterThan(0);
    expect(valuation.byWarehouse[0].warehouseName).toContain('Dépôt');
    expect(aging.totals.receivables).toBeGreaterThan(0);
    expect(aging.totals.payables).toBe(supplierInvoice.total);
    expect(pnl.revenue).toBeGreaterThan(0);
    expect(pnl.expenses).toBeGreaterThan(0);
    expect(balance.totals).toHaveProperty('variance');
    expect(payrollCost.totals.employerCost).toBeGreaterThan(0);
    expect(payrollCost.byDepartment[0]).toHaveProperty('department');
    expect(cohort.activationScore).toBeGreaterThan(50);
    expect(dgi.operations).toEqual(['validate', 'render', 'submit', 'poll', 'archive']);
    expect(cnssSubmission).toMatchObject({ kind: 'CNSS', status: 'ARCHIVED' });
    expect(bank.rows[0]).toMatchObject({ status: 'SUGGESTED_MATCH', suggestedMatch: invoice.number });
    expect(email).toMatchObject({ status: 'QUEUED', type: 'INVOICE' });
    expect(webhook).toMatchObject({ status: 'PENDING', event: 'invoice.posted' });
    expect(apiKey.token).toMatch(/^mep_/);
    expect(store.listPartnerApiKeys()[0]).not.toHaveProperty('tokenHash');
    expect(scenarios.status).toBe('READY');
    expect(scenarios.smokeFlows).toEqual(expect.arrayContaining(['onboard tenant', 'create customer', 'create product', 'issue invoice', 'record payment', 'run payroll']));
  });

  it('rolls back sales, inventory receipts, and stock adjustments when accounting posting fails', () => {
    const workspace = (store as any).workspace('tenant-demo');
    const deactivateAccount = (account: string) => {
      workspace.chartOfAccounts.find((candidate: any) => candidate.account === account).active = false;
    };
    const activateAccount = (account: string) => {
      workspace.chartOfAccounts.find((candidate: any) => candidate.account === account).active = true;
    };

    const stockBeforeInvoice = store.getProduct('prd-1').stockOnHand;
    deactivateAccount('7111');
    expect(() => store.createInvoice({ customerId: 'cus-1', lines: [{ productId: 'prd-1', quantity: 1 }] })).toThrow('Compte PCGE introuvable');
    expect(store.listInvoices()).toHaveLength(0);
    expect(store.listJournalEntries()).toHaveLength(0);
    expect(store.listStock().find((line) => line.productId === 'prd-1')?.stockOnHand).toBe(stockBeforeInvoice);
    expect(store.listStockMoves()).toHaveLength(0);
    activateAccount('7111');
    expect(store.createInvoice({ customerId: 'cus-1', lines: [{ productId: 'prd-2', quantity: 1 }] }).number).toMatch(/^FAC-\d{4}-00001$/);

    const stockBeforeReceipt = store.getProduct('prd-raw').stockOnHand;
    const costBeforeReceipt = store.getProduct('prd-raw').weightedAverageCost;
    deactivateAccount('4411');
    expect(() => store.createPurchaseReceipt({ supplierId: 'sup-1', lines: [{ productId: 'prd-raw', quantity: 10, unitCost: 200 }] })).toThrow('Compte PCGE introuvable');
    expect(store.listPurchaseReceipts()).toHaveLength(0);
    expect(store.getProduct('prd-raw').stockOnHand).toBe(stockBeforeReceipt);
    expect(store.getProduct('prd-raw').weightedAverageCost).toBe(costBeforeReceipt);
    activateAccount('4411');

    const stockBeforeAdjustment = store.getProduct('prd-1').stockOnHand;
    deactivateAccount('6198');
    expect(() => store.adjustStock('prd-1', -1, 'Rollback test')).toThrow('Compte PCGE introuvable');
    expect(store.getProduct('prd-1').stockOnHand).toBe(stockBeforeAdjustment);
    expect(store.listStockMoves().filter((move) => move.reference === 'Rollback test')).toHaveLength(0);
  });

  it('exposes production operations, feature gates, billing, support workspaces, and large-tenant performance checks', () => {
    store.createInvoice({ customerId: 'cus-1', lines: [{ productId: 'prd-2', quantity: 1 }] });
    const persistence = store.productionPersistenceConfig();
    const environment = store.environmentCheck({
      DATABASE_URL: 'postgresql://demo',
      JWT_SECRET: 'jwt',
      AUTH_SECRET: 'auth',
      STORAGE_PROVIDER: 'LOCAL_DEV',
      ALLOWED_ORIGINS: 'http://localhost:3001',
      NEXT_PUBLIC_API_URL: 'http://localhost:3100',
    });
    const backup = store.requestBackup();
    const restore = store.restoreRehearsal({ evidenceId: backup.evidence.id });
    const job = store.enqueueBackgroundJob({ kind: 'PDF', reference: 'FAC-DEMO', payload: { documentType: 'INVOICE' } });
    expect(job).toMatchObject({ queue: 'documents', status: 'QUEUED' });
    const processed = store.runNextBackgroundJob();
    const disabledPayroll = store.updateFeatureFlag({ key: 'payroll', enabled: false, reason: 'Plan Intilaq sans paie', updatedBy: 'admin@atlas.ma' });
    const billing = store.tenantBillingStatus();
    const prompts = store.upgradePrompts();
    const performance = store.largeTenantPerformanceScenario({ invoices: 1000, journalLines: 2000, employees: 400, stockMoves: 3000 });

    expect(persistence.provider).toBe('postgresql');
    expect(persistence.migrationWorkflow).toEqual(expect.arrayContaining(['npm --prefix backend run prisma:migrate:deploy']));
    expect(environment.status).toBe('READY');
    expect(store.structuredLogEntries()[0]).toMatchObject({ tenantId: 'tenant-demo', level: 'INFO' });
    expect(store.metricsSnapshot()).toMatchObject({ jobFailures: 0 });
    expect(backup.status).toBe('BACKUP_ARCHIVED');
    expect(restore.status).toBe('RESTORE_VALIDATED');
    expect(store.stagingDeployment()).toMatchObject({ status: 'CONFIGURED', protectedAdminAccess: true });
    expect(processed).toMatchObject({ status: 'DONE' });
    expect(disabledPayroll).toMatchObject({ key: 'payroll', enabled: false });
    expect(store.pricingPlans().map((plan) => plan.id)).toEqual(['INTILAQ', 'NUMOW', 'ENTERPRISE']);
    expect(billing.adminControls).toEqual(expect.arrayContaining(['lock-writes', 'unlock-writes']));
    expect(store.accountantWorkspace().clients[0]).toHaveProperty('fiscalStatus');
    expect(store.superAdminWorkspace().complianceRuleManagement.activeRulePack).toBe('MA-2026');
    expect(store.supportDiagnostics().moduleUsage.length).toBeGreaterThan(0);
    expect(prompts).toMatchObject({ tiedToRealGates: true, status: 'ACTIONABLE' });
    expect(performance.status).toBe('PASS');
    expect(performance.projectedRows).toBe(6400);
  });

  it('covers advanced Morocco workflows for reservations, delivery routes, emails, treasury, payroll review, and procurement', () => {
    const quote = store.createQuote({ customerId: 'cus-1', lines: [{ productId: 'prd-1', quantity: 1 }] });
    const quoteEmail = store.quoteApprovalEmailPreview(quote.id);
    const acceptance = store.acceptQuote(quote.id, { acceptedBy: 'Youssef Amrani', comment: 'Bon pour accord' });
    const order = store.convertQuoteToOrder(quote.id);
    const reservations = store.stockReservationVisibility();
    const delivery = store.createDeliveryNoteFromOrder(order.id);
    const routePlan = store.deliveryRoutePlanning();
    const invoice = store.convertOrderToInvoice(order.id);
    const invoiceEmail = store.invoiceEmailPreview(invoice.id);
    const customerStatementPdf = store.exportCustomerStatementPdf('cus-1');
    store.recordPayment({ invoiceId: invoice.id, amount: 200, method: 'CHEQUE' });
    const cheque = store.createCheque({ invoiceId: invoice.id, number: 'CHQ-2026-001', bank: 'Attijariwafa bank', drawer: 'Rabat Retail SARL', dueDate: '2026-06-15', amount: 200 });
    const deposit = store.createDepositBatch({ bankAccount: '5141', cashAmount: 100, chequeIds: [cheque.id] });
    const reconciliation = store.paymentMethodReconciliation();

    const receipt = store.createPurchaseReceipt({ supplierId: 'sup-1', lines: [{ productId: 'prd-raw', quantity: 1, unitCost: 100 }] });
    store.createSupplierInvoice({ purchaseReceiptId: receipt.id });
    const supplierStatement = store.supplierStatement('sup-1');

    const session = store.openPosSession({ cashierId: 'usr-owner', openingCash: 500 });
    const cashboxTransfer = store.createCashboxTransfer({ fromSessionId: session.id, amount: 250, toTreasuryAccount: '5161' });

    const payrollRun = store.createPayrollRun({ year: 2026, month: 5 });
    store.calculatePayrollRun(payrollRun.id);
    const preflight = store.payrollDamancomPreflight(payrollRun.id);
    const approvedRun = store.approvePayrollRun(payrollRun.id, { comment: 'Contrôle CNSS/IR validé', approvedBy: 'accountant@atlas.ma' });
    const damancom = store.exportPayrollRunDamancom(approvedRun.id);
    const leave = store.createLeaveRequest({ employeeId: 'emp-1', startDate: '2026-06-01', endDate: '2026-06-02' });
    store.approveLeaveRequest(leave.id);
    const leaveCalendar = store.leaveCalendar();
    const rejectedRun = store.createPayrollRun({ year: 2026, month: 6 });
    const rejection = store.rejectPayrollRun(rejectedRun.id, { reason: 'Prime variable manquante' });

    const purchaseRequest = store.createPurchaseRequest({
      requester: 'Responsable stock',
      department: 'Logistique',
      supplierId: 'sup-1',
      lines: [{ productId: 'prd-raw', quantity: 5, estimatedUnitCost: 95 }],
      reason: 'Réassort bois',
    });
    const supplierQuote = store.addSupplierQuoteComparison({ purchaseRequestId: purchaseRequest.id, supplierId: 'sup-1', price: 475, delayDays: 3, risk: 'LOW', preferred: true });
    const matrix = store.supplierQuoteMatrix(purchaseRequest.id);
    const purchaseOrder = store.convertPurchaseRequestToOrder(purchaseRequest.id);

    expect(quoteEmail.subject).toContain(quote.number);
    expect(acceptance).toMatchObject({ status: 'ACCEPTED', acceptedBy: 'Youssef Amrani' });
    expect(reservations.rows).toEqual(expect.arrayContaining([expect.objectContaining({ source: 'ORDER', productId: 'prd-1', quantity: 1 })]));
    expect(delivery.number).toMatch(/^BL-/);
    expect(routePlan.cities.map((city) => city.city)).toEqual(expect.arrayContaining(['Casablanca', 'Rabat', 'Tanger']));
    expect(invoiceEmail).toMatchObject({ status: 'READY' });
    expect(invoiceEmail.legalFooter).toContain('ICE');
    expect(Buffer.from(customerStatementPdf.contentBase64, 'base64').toString('binary')).toContain('Relevé client');
    expect(customerStatementPdf.requiredMentions).toEqual(expect.arrayContaining(['ICE vendeur', 'Aging']));
    expect(supplierStatement.totals.purchases).toBeGreaterThan(0);
    expect(supplierStatement.legalIdentifiers.tenantIce).toBe('001525678000083');
    expect(cheque).toMatchObject({ status: 'DEPOSITED', depositBatchId: deposit.id });
    expect(deposit.total).toBe(300);
    expect(reconciliation.rows.map((row) => row.method)).toEqual(['CASH', 'BANK', 'CHEQUE', 'CARD', 'MOBILE_MONEY']);
    expect(cashboxTransfer).toMatchObject({ status: 'RECORDED', amount: 250 });
    expect(store.employeeDocumentReminders()[0].missingDocuments).toEqual(expect.arrayContaining(['Diplôme', 'Visite médicale']));
    expect(approvedRun.approvalComment).toBe('Contrôle CNSS/IR validé');
    expect(rejection.rejectionReason).toBe('Prime variable manquante');
    expect(damancom.archive).toMatchObject({ generatedBy: 'owner@atlas.ma', period: '2026-05' });
    expect(preflight.status).toBe('READY');
    expect(payrollRun.payslips[0].irExplanation?.map((line) => line.label)).toEqual(expect.arrayContaining(['Base imposable IR', 'Taux IR']));
    expect(leaveCalendar.rows[0]).toMatchObject({ employeeName: 'Ahmed Taleb', approvalStatus: 'APPROVED' });
    expect(store.contractLifecycleReminders()).toEqual([]);
    expect(supplierQuote.preferred).toBe(true);
    expect(matrix.recommendedSupplierId).toBe('sup-1');
    expect(purchaseOrder.supplierId).toBe('sup-1');
  });

  it('covers import costing, traceability, governance, security, export, onboarding, KPI, digest, regions, and customer risk workflows', () => {
    const receipt = store.createPurchaseReceipt({ supplierId: 'sup-1', lines: [{ productId: 'prd-raw', quantity: 10, unitCost: 100 }] });
    const landed = store.landedCostAllocation({ purchaseReceiptId: receipt.id, freight: 200, customs: 100, transit: 50, insurance: 50 });
    const lot = store.createTraceabilityLot({ productId: 'prd-raw', lotNumber: 'LOT-2026-001', quantity: 5, expiryDate: '2026-06-30' });
    const expiry = store.stockExpiryAlerts();
    const movementAudit = store.inventoryMovementAudit();
    const invoice = store.createInvoice({ customerId: 'cus-1', dueDate: '2026-04-01', lines: [{ productId: 'prd-2', quantity: 1 }] });
    const anomaly = store.accountingAnomalyChecks();
    const reviewQueue = store.accountantReviewQueue();
    const numbering = store.numberingAudit();
    const manifest = store.tenantDataExportManifest();
    const invitation = store.inviteUser({ email: 'new.user@atlas.ma', role: 'SALES', expiresAt: '2026-06-30' });
    const login = store.login({ email: 'owner@atlas.ma', password: 'demo1234' }) as any;
    const revoked = store.revokeSession(login.sessionId);
    const rateLimits = store.apiRateLimitStatus();
    const webhook = store.emitWebhookEvent({ event: 'invoice.posted', payload: { invoiceId: invoice.id } });
    const retry = store.retryWebhook(webhook.id);
    const exportJob = store.enqueueBackgroundJob({ kind: 'EXPORT', reference: 'EXPORT-GOV' });
    const exportCenter = store.exportStatusCenter();
    const onboarding = store.onboardingProgress('trading');
    const reset = store.resetSampleModule({ module: 'payroll' });
    const kpi = store.upsertKpiTarget({ module: 'sales', owner: 'Direction', metric: 'CA mensuel', target: 100000, actual: 65000, period: '2026-05' });
    const digest = store.executiveDailyDigest();
    const binder = store.accountantEvidenceBinder({ year: 2026, month: 5 });
    const regions = store.moroccanRegions();
    const risk = store.customerRiskScores();

    expect(landed.totalAllocated).toBe(400);
    expect(landed.rows[0]).toHaveProperty('newCump');
    expect(lot).toMatchObject({ lotNumber: 'LOT-2026-001', status: 'ACTIVE' });
    expect(expiry[0]).toMatchObject({ lotNumber: 'LOT-2026-001' });
    expect(movementAudit.rows[0]).toHaveProperty('beforeQty');
    expect(anomaly.status).toBe('OK');
    expect(reviewQueue.rows.map((row) => row.type)).toContain('INVOICE');
    expect(numbering).toMatchObject({ status: 'OK', immutable: true });
    expect(manifest).toMatchObject({ tamperEvidence: true });
    expect(invitation).toMatchObject({ email: 'new.user@atlas.ma', status: 'PENDING' });
    expect(revoked).toMatchObject({ status: 'REVOKED', sessionId: login.sessionId });
    expect(rateLimits.status).toBe('ENFORCED');
    expect(retry).toMatchObject({ webhookEventId: webhook.id, attempt: 1, status: 'SCHEDULED' });
    expect(exportJob.status).toBe('QUEUED');
    expect(exportCenter.filters).toEqual(expect.arrayContaining(['period', 'checksum']));
    expect(onboarding.progressPercent).toBeGreaterThanOrEqual(80);
    expect(reset).toMatchObject({ status: 'RESET', legalConfigurationPreserved: true });
    expect(kpi.target).toBe(100000);
    expect(store.kpiVariance()[0]).toMatchObject({ variance: -35000 });
    expect(digest).toHaveProperty('overdueInvoices');
    expect(binder.sections).toEqual(expect.arrayContaining(['vat-review', 'payroll-exports']));
    expect(regions.map((row) => row.city)).toEqual(expect.arrayContaining(['Casablanca', 'Rabat', 'Agadir']));
    expect(risk[0]).toHaveProperty('score');
  });

  it('covers operational controls for supplier reliability, product lifecycle, contracts, recurring work, cash, VAT, CNSS, and HR checklists', () => {
    const supplierScore = store.supplierReliabilityScores()[0];
    const lifecycle = store.setProductLifecycleState('prd-raw', 'BLOCKED');
    const lifecycleBoard = store.productLifecycleBoard();
    const quarantine = store.createStockQuarantine({ productId: 'prd-1', quantity: 2, reason: 'COMPLIANCE_HOLD', documentReference: 'CTRL-2026-001' });
    const releasedQuarantine = store.releaseStockQuarantine(quarantine.id);

    const salesOrder = store.createSalesOrder({ customerId: 'cus-1', lines: [{ productId: 'prd-1', quantity: 1 }] });
    const delivery = store.createDeliveryNoteFromOrder(salesOrder.id);
    const proof = store.captureDeliveryProof({ deliveryNoteId: delivery.id, signer: 'Youssef Amrani', documentReference: 'POD-001' });
    const invoice = store.convertOrderToInvoice(salesOrder.id);
    store.recordPayment({ invoiceId: invoice.id, amount: invoice.totals.total, method: 'BANK' });
    const commission = store.salesCommissionReport({ period: invoice.date.slice(0, 7), ratePercent: 3 });

    const customerContract = store.createCustomerContract({ customerId: 'cus-1', name: 'Contrat cadre retail', renewalDate: '2026-06-20', priceList: 'Retail 2026', creditTermsDays: 45, documentStatus: 'RECEIVED' });
    const supplierContract = store.createSupplierContract({ supplierId: 'sup-1', name: 'Contrat import', renewalDate: '2026-06-25', sla: 'Livraison 72h', paymentTermsDays: 45 });
    const pricingRule = store.createPricingRule({ customerSegment: 'Retail', productFamily: 'GOODS', startDate: '2026-01-01', endDate: '2026-12-31', minQuantity: 10, discountPercent: 5 });
    const pricePreview = store.pricingPreview({ customerSegment: 'Retail', productFamily: 'GOODS', quantity: 12, unitPrice: 100 });
    const discount = store.requestDiscountApproval({ invoiceId: invoice.id, requestedBy: 'sales@atlas.ma', discountPercent: 18, marginImpact: 600 });
    const approvedDiscount = store.approveDiscountApproval(discount.id);

    const staleOrder = store.createSalesOrder({ customerId: 'cus-1', lines: [{ productId: 'prd-1', quantity: 1 }] });
    staleOrder.date = '2026-05-01';
    const releasedReservations = store.releaseExpiredStockReservations({ maxAgeDays: 7 });
    const recurringInvoice = store.generateRecurringInvoiceBatch({ customerId: 'cus-1', period: '2026-05', lines: [{ productId: 'prd-2', quantity: 1 }] });
    const recurringPurchase = store.createRecurringPurchaseSchedule({ supplierId: 'sup-1', category: 'RENT', amount: 12000, nextRunDate: '2026-06-01' });
    const recurringPurchaseRun = store.runRecurringPurchaseSchedule(recurringPurchase.id);

    const expense = store.createExpenseClaim({ employeeId: 'emp-1', category: 'Déplacement client', amount: 350, receiptReference: 'REC-001' });
    store.approveExpenseClaim(expense.id);
    const expenseExport = store.exportExpenseClaims();
    const pettyCash = store.openPettyCashJournal({ custodian: 'Nadia Benali', openingBalance: 1000 });
    store.addPettyCashMovement(pettyCash.id, { type: 'OUT', amount: 200, label: 'Taxi client', attachmentReference: 'PC-001' });
    const closedPettyCash = store.closePettyCashJournal(pettyCash.id, 790);

    const matching = store.bankStatementMatchingSuggestions({ amount: invoice.totals.total, reference: invoice.number, party: 'Rabat' });
    const weakCustomer = store.addCustomer({ name: 'Client Sans ICE', paymentTermsDays: 15 });
    store.createInvoice({ customerId: weakCustomer.id, lines: [{ productId: 'prd-2', quantity: 1 }] });
    const vatExceptions = store.vatExceptionDrilldown();
    store.updateEmployee('emp-1', { cnssNumber: '' });
    const cnssAnomalies = store.cnssEmployeeAnomalyDrilldown();
    const payrollRun = store.createPayrollRun({ year: 2026, month: 5 });
    store.calculatePayrollRun(payrollRun.id);
    const payrollVariance = store.payrollVarianceReport({ period: '2026-05' });
    const onboarding = store.employeeChecklist({ employeeId: 'emp-1', type: 'ONBOARDING' });
    const completedChecklist = store.completeEmployeeChecklistItem(onboarding.id, { key: onboarding.items[0].key, evidence: 'cin.pdf' });
    const offboarding = store.employeeChecklist({ employeeId: 'emp-1', type: 'OFFBOARDING' });

    expect(supplierScore).toHaveProperty('score');
    expect(lifecycle).toMatchObject({ lifecycleState: 'BLOCKED' });
    expect(lifecycleBoard.counts.BLOCKED).toBe(1);
    expect(releasedQuarantine).toMatchObject({ status: 'RELEASED' });
    expect(proof).toMatchObject({ signer: 'Youssef Amrani', status: 'CAPTURED' });
    expect(commission.totalCommission).toBeGreaterThan(0);
    expect(customerContract).toMatchObject({ status: 'RENEWAL_DUE', priceList: 'Retail 2026' });
    expect(supplierContract).toMatchObject({ status: 'RENEWAL_DUE', sla: 'Livraison 72h' });
    expect(pricingRule.discountPercent).toBe(5);
    expect(pricePreview).toMatchObject({ appliedPercent: 5, discount: 60 });
    expect(approvedDiscount).toMatchObject({ status: 'APPROVED', requiredRole: 'ADMIN' });
    expect(releasedReservations.count).toBe(1);
    expect(recurringInvoice.invoiceIds).toHaveLength(1);
    expect(recurringPurchaseRun.order.supplierId).toBe('sup-1');
    expect(expenseExport).toMatchObject({ count: 1 });
    expect(closedPettyCash).toMatchObject({ status: 'CLOSED', variance: -10 });
    expect(matching.rows[0]).toHaveProperty('score');
    expect(vatExceptions.count).toBeGreaterThan(0);
    expect(cnssAnomalies.rows[0]).toMatchObject({ employeeName: 'Ahmed Taleb' });
    expect(payrollVariance.rows[0]).toHaveProperty('varianceVsContract');
    expect(completedChecklist.items[0]).toMatchObject({ done: true, evidence: 'cin.pdf' });
    expect(offboarding.items.map((item) => item.label)).toEqual(expect.arrayContaining(['Dernière paie', 'Restitution équipement']));
  });

  it('covers enterprise controls for HR privacy, assets, fleet, maintenance, WIP, branches, portals, rollouts, integrations, and tamper evidence', () => {
    const note = store.createHrPrivateNote({ employeeId: 'emp-1', type: 'PERFORMANCE', body: 'Objectifs Q2 validés', visibilityRoles: ['OWNER', 'PAYROLL'] });
    const hiddenNotes = store.listHrPrivateNotes('READ_ONLY');
    const asset = store.assignAsset({ employeeId: 'emp-1', assetType: 'LAPTOP', assetTag: 'PC-ATLAS-001' });
    const returnedAsset = store.returnAsset(asset.id);

    const vehicle = store.createFleetVehicle({ plate: 'WW-123456', driver: 'Ahmed Taleb' });
    store.addFleetLog({ vehicleId: vehicle.id, type: 'FUEL', amount: 500, odometer: 1000, date: '2026-05-01' });
    store.addFleetLog({ vehicleId: vehicle.id, type: 'FUEL', amount: 650, odometer: 1500, date: '2026-05-20' });
    const fleetEfficiency = store.fleetFuelEfficiencyReport({ month: '2026-05' });

    const maintenanceAsset = store.createMaintenanceAsset({ name: 'Presse atelier', category: 'Production' });
    const preventive = store.createPreventiveMaintenanceSchedule({ assetId: maintenanceAsset.id, nextDueDate: '2026-06-15', partsBudget: 1000, laborBudget: 800, plannedDowntimeHours: 4 });

    const project = store.createProject({
      customerId: 'cus-1',
      name: 'Projet showroom Rabat',
      budget: 50000,
      expenses: [{ label: 'Matériel', amount: 12000 }],
      timesheets: [{ employeeId: 'emp-1', hours: 10, costRate: 200 }],
      invoiceMilestones: [{ label: 'Acompte', amount: 18000, invoiced: true }, { label: 'Solde', amount: 30000, invoiced: false }],
    });
    const wip = store.projectWipReport();

    const bom = store.createBillOfMaterial({ finishedProductId: 'prd-fg', version: 'V2', components: [{ productId: 'prd-raw', quantity: 2, unitCost: 90 }] });
    const production = store.createProductionOrder({ finishedProductId: 'prd-fg', quantity: 2, billOfMaterialId: bom.id });
    const productionVariance = store.productionVarianceReport();

    const budget = store.createProcurementBudget({ department: 'Logistique', supplierId: 'sup-1', category: 'Matières', period: '2026-05', budget: 50000 });
    store.createPurchaseOrder({ supplierId: 'sup-1', lines: [{ productId: 'prd-raw', quantity: 10, unitCost: 100 }] });
    const budgetControls = store.procurementBudgetControls();
    const branch = store.createBranch({ name: 'Agence Rabat', city: 'Rabat' });
    const branchDashboard = store.branchDashboard();
    const localization = store.updateLocalizationSettings({ mainLanguage: 'FR', dateFormat: 'DD/MM/YYYY', currency: 'MAD', arabicLabelsReady: true });
    const preview = store.documentTemplatePreview({ type: 'INVOICE', language: 'FR' });

    store.queueEmailDelivery({ type: 'INVOICE', to: 'finance@rabretail.ma', subject: 'Facture test', attachmentName: 'FAC-test.pdf' });
    const emailAudit = store.emailAuditTrail();
    const invoice = store.createInvoice({ customerId: 'cus-1', lines: [{ productId: 'prd-2', quantity: 1 }] });
    const customerPortal = store.customerPortalWorkflow('cus-1');
    const supplierPortal = store.supplierPortalWorkflow('sup-1');
    const accountantReview = store.createAccountantPortalReview({ period: '2026-05', comment: 'Revue mensuelle' });
    const partnerChecklist = store.partnerImplementationChecklist({ industry: 'wholesale' });
    const rollout = store.complianceRuleRollout({ effectiveDate: '2026-06-01' });
    store.updateFeatureFlag({ key: 'payroll', enabled: false, reason: 'Pilotage rollout', updatedBy: 'admin@atlas.ma' });
    const flagAudit = store.featureFlagAuditHistory();
    const webhook = store.emitWebhookEvent({ event: 'invoice.posted', payload: { invoiceId: invoice.id } });
    store.retryWebhook(webhook.id);
    const health = store.integrationHealthDashboard();
    const signature = store.webhookSignatureVerificationExample();
    const tamper = store.exportTamperEvidenceReport();

    expect(note).toMatchObject({ type: 'PERFORMANCE' });
    expect(hiddenNotes).toEqual([]);
    expect(returnedAsset).toMatchObject({ status: 'RETURNED' });
    expect(fleetEfficiency.rows[0]).toMatchObject({ plate: 'WW-123456', distance: 500 });
    expect(preventive).toMatchObject({ recurrence: 'MONTHLY', plannedDowntimeHours: 4 });
    expect(wip.rows[0]).toMatchObject({ projectId: project.id, wip: -4000, marginForecast: 34000 });
    expect(productionVariance.rows[0]).toMatchObject({ productionOrderId: production.id });
    expect(budgetControls.rows[0]).toMatchObject({ id: budget.id, status: 'OK' });
    expect(branchDashboard.rows[0]).toMatchObject({ branchId: branch.id, city: 'Rabat' });
    expect(localization).toMatchObject({ mainLanguage: 'FR', currency: 'MAD', arabicLabelsReady: true });
    expect(preview).toMatchObject({ status: 'PREVIEW_READY' });
    expect(emailAudit[0]).toMatchObject({ to: 'finance@rabretail.ma', document: 'FAC-test.pdf' });
    expect(customerPortal).toMatchObject({ paymentStatus: 'OPEN' });
    expect(supplierPortal.documentUpload.required).toEqual(expect.arrayContaining(['Attestation fiscale', 'RIB']));
    expect(accountantReview.checklist.map((item) => item.label)).toEqual(expect.arrayContaining(['TVA', 'Paie']));
    expect(partnerChecklist).toHaveProperty('tenantHealth');
    expect(rollout).toMatchObject({ rulePackId: 'MA-2026', impactedTenants: 1, status: 'PLANNED' });
    expect(flagAudit[0]).toMatchObject({ key: 'payroll', actor: 'admin@atlas.ma' });
    expect(health.rows.map((row) => row.integration)).toEqual(['DGI', 'CNSS', 'WEBHOOKS']);
    expect(signature).toMatchObject({ replayProtected: true, valid: true });
    expect(tamper).toMatchObject({ tamperEvidence: true });
  });

  it('covers growth, restore, support, SLA, FX, onboarding, dispute, collection, and payment control workflows', () => {
    const backup = store.requestBackup();
    const restore = store.restoreRehearsalChecklist({ evidenceId: backup.evidence.id });
    const impersonation = store.requestSupportImpersonation({ supportUser: 'support@morocco-erp.ma', approvedBy: 'owner@atlas.ma', reason: 'Analyse ticket facture', durationMinutes: 20 });
    const release = store.publishReleaseNote({ title: 'Nouveaux contrôles recouvrement', body: 'Relances et promesses de paiement.', roles: ['OWNER'], modules: ['tenant'], plans: ['ENTERPRISE'] });
    const targeted = store.targetedReleaseNotes({ role: 'OWNER', module: 'tenant', plan: 'ENTERPRISE' });
    const nudges = store.usageBasedOnboardingNudges();
    const scorecard = store.competitiveReadinessScorecard();

    const quote = store.createQuote({ customerId: 'cus-1', lines: [{ productId: 'prd-2', quantity: 1 }] });
    const invoice = store.convertQuoteToInvoice(quote.id);
    const sla = store.workflowSlaTimers();
    const escalation = store.createEscalationRule({ role: 'SALES', amountThreshold: 50000, customerRisk: 'HIGH', overdueDays: 30, escalateTo: 'ADMIN' });
    const fx = store.prepareMultiCurrencyDocument({ documentType: 'INVOICE', documentId: invoice.id, currency: 'EUR', foreignAmount: 1000, fxRateToMad: 10.9 });
    const branch = store.createBranch({ name: 'Agence Tanger', city: 'Tanger' });
    const branchPolicy = store.upsertBranchNumberingPolicy({ branchId: branch.id, invoicePrefix: 'TNG-FAC', nextNumber: 25 });
    const heatmap = store.regionalSalesHeatmap();

    const kyc = store.customerKycChecklist('cus-1');
    const kys = store.supplierKysChecklist('sup-1');
    const customerDispute = store.createDisputeCase({ type: 'CUSTOMER', partyId: 'cus-1', referenceId: invoice.id, reason: 'Prix contesté', collectionStatus: 'PAUSED' });
    const receipt = store.createPurchaseReceipt({ supplierId: 'sup-1', lines: [{ productId: 'prd-raw', quantity: 2, unitCost: 100 }] });
    const supplierInvoice = store.createSupplierInvoice({ purchaseReceiptId: receipt.id });
    const supplierDispute = store.createDisputeCase({ type: 'SUPPLIER', partyId: 'sup-1', referenceId: supplierInvoice.id, reason: 'Écart réception', blockedApprovals: true });
    const promise = store.createPromiseToPay({ customerId: 'cus-1', invoiceId: invoice.id, promisedDate: '2026-06-10', amount: 500, owner: 'recouvrement@atlas.ma' });
    const allocationRule = store.upsertPaymentAllocationRule({ mode: 'OLDEST_INVOICE', priority: 1 });
    const allocationPreview = store.paymentAllocationPreview({ customerId: 'cus-1', amount: 500, mode: 'OLDEST_INVOICE' });
    const dunning = store.upsertDunningPolicy({ level: 2, daysOverdue: 15 });
    const proposal = store.supplierPaymentProposalRun({ cutoffDate: '2026-12-31', cashBalance: 50000 });
    const payment = store.recordPayment({ invoiceId: invoice.id, amount: 300, method: 'BANK' });
    const cheque = store.createCheque({ invoiceId: invoice.id, number: 'CHQ-AUDIT-001', bank: 'Bank of Africa', drawer: 'Rabat Retail SARL', dueDate: '2026-06-20', amount: 250 });
    const chequeAudit = store.chequeLifecycleAudit();
    const adjustment = store.suggestPaymentAdjustment({ paymentId: payment.id, bankFee: 15, withholdingTax: 10 });

    expect(restore).toMatchObject({ status: 'RESTORE_VALIDATED' });
    expect(restore.tenantValidation).toMatchObject({ tenantId: 'tenant-demo', isolatedRestore: true });
    expect(impersonation).toMatchObject({ status: 'APPROVED', supportUser: 'support@morocco-erp.ma' });
    expect(targeted[0]).toMatchObject({ id: release.id, title: 'Nouveaux contrôles recouvrement' });
    expect(nudges.rows.length).toBeGreaterThan(0);
    expect(scorecard.competitors).toEqual(expect.arrayContaining(['Odoo', 'Sage', 'ERP local Maroc']));
    expect(scorecard.scores.total).toBeGreaterThan(0);
    expect(sla.rows.map((row) => row.type)).toEqual(expect.arrayContaining(['QUOTE', 'INVOICE']));
    expect(escalation).toMatchObject({ role: 'SALES', escalateTo: 'ADMIN' });
    expect(fx).toMatchObject({ currency: 'EUR', madAmount: 10900 });
    expect(branchPolicy).toMatchObject({ invoicePrefix: 'TNG-FAC', legalIdentifierValid: true });
    expect(heatmap.rows[0]).toHaveProperty('region');
    expect(kyc.items.map((item) => item.key)).toEqual(expect.arrayContaining(['ice', 'signed-terms']));
    expect(kys.riskApprovalRequired).toBe(true);
    expect(customerDispute).toMatchObject({ type: 'CUSTOMER', collectionStatus: 'PAUSED' });
    expect(supplierDispute).toMatchObject({ type: 'SUPPLIER', blockedApprovals: true });
    expect(promise).toMatchObject({ status: 'PROMISED', owner: 'recouvrement@atlas.ma' });
    expect(allocationRule).toMatchObject({ mode: 'OLDEST_INVOICE', active: true });
    expect(allocationPreview.rows[0]).toMatchObject({ allocated: 500 });
    expect(dunning).toMatchObject({ level: 2, holdPolicy: 'SOFT_HOLD' });
    expect(proposal.proposals[0]).toMatchObject({ supplierId: 'sup-1' });
    expect(chequeAudit.rows.map((row) => row.number)).toContain(cheque.number);
    expect(adjustment).toMatchObject({ bankFee: 15, withholdingTax: 10, status: 'SUGGESTED' });
  });

  it('covers logistics, close, compliance, payroll control, HR audit, and project billing workflows', () => {
    const order = store.createSalesOrder({ customerId: 'cus-1', lines: [{ productId: 'prd-1', quantity: 2 }] });
    order.date = '2026-05-01';
    const reservationAging = store.stockReservationAgingReport();
    const instruction = store.upsertCustomerDeliveryInstruction({ customerId: 'cus-1', city: 'Rabat', constraints: ['Accès médina interdit camion'], preferredTransporter: 'TransMaroc', deliveryWindow: '09:00-12:00' });
    const transporter = store.createTransporter({ name: 'TransMaroc', vehicle: 'Camion 3.5T', driver: 'Karim Routier', license: 'TR-2026', insuranceExpiry: '2026-12-31', deliveries: 10, onTimeDeliveries: 8 });
    const transporterRegistry = store.transporterRegistry();
    const delivery = store.createDeliveryNoteFromOrder(order.id);
    const exceptions = store.deliveryInvoiceExceptionReport();

    const matrix = store.createProcurementApprovalMatrix({ department: 'Logistique', budgetOwner: 'Directeur opérations', amountThreshold: 20000, category: 'Transport', approverRole: 'ADMIN' });
    const receipt = store.createPurchaseReceipt({ supplierId: 'sup-1', lines: [{ productId: 'prd-raw', quantity: 4, unitCost: 95 }] });
    const priceHistory = store.supplierPriceHistoryReport();
    store.addProduct({ sku: 'SKU-CHAIR-ALT', name: 'Chaise alternative', type: 'GOODS', salePrice: 780, purchaseCost: 430, stockOnHand: 12, weightedAverageCost: 430 });
    const substitutes = store.substituteProductRecommendations({ productId: 'prd-1', customerSegment: 'Retail' });
    const deadStock = store.inventoryDeadStockReport();
    const cump = store.cumpRecalculationRehearsal();

    const requirement = store.createAccountingAttachmentRequirement({ journalType: 'ACHAT', amountThreshold: 10000, evidenceCategory: 'INVOICE' });
    const accruals = store.preClosingAccrualSuggestions();
    const taxCalendar = store.moroccoTaxCalendar();
    const owner = store.assignComplianceOwner({ declaration: 'VAT', owner: 'fiscaliste@atlas.ma', dueDay: 20, reminderDaysBefore: 5 });
    const reminders = store.complianceOwnerReminders();

    const loan = store.createPayrollLoan({ employeeId: 'emp-1', amount: 5000, monthlyDeductionLimit: 800, approvalEvidence: 'loan-approval.pdf' });
    const expense = store.createExpenseClaim({ employeeId: 'emp-1', category: 'Taxi', amount: 120, receiptReference: 'TX-1' });
    const reimbursement = store.createEmployeeReimbursement({ employeeId: 'emp-1', expenseClaimId: expense.id, amount: 120, channel: 'ACCOUNTS_PAYABLE' });
    const overtime = store.createOvertimeApproval({ employeeId: 'emp-1', department: 'Logistique', reason: 'Inventaire nuit', hours: 4, rateMultiplier: 1.5 });
    const amendment = store.amendEmploymentContract({ employeeId: 'emp-1', newSalary: 6500, effectiveDate: '2026-06-01', signedDocumentEvidence: 'avenant-emp-1.pdf' });
    const social = store.payrollSocialDeclarationReconciliation();
    const hrAudit = store.hrAuditTrail('OWNER');

    const project = store.createProject({ customerId: 'cus-1', name: 'Projet retainer', budget: 30000 });
    const billing = store.createProjectBillingPlan({ projectId: project.id, retainerAmount: 5000, milestones: [{ label: 'Livraison 1', amount: 10000, revenueRecognitionNote: 'Reconnaissance à validation client', accountantReview: true }] });

    expect(reservationAging.rows[0]).toMatchObject({ orderId: order.id, expiryPolicy: 'AUTO_RELEASE' });
    expect(instruction).toMatchObject({ city: 'Rabat', preferredTransporter: 'TransMaroc' });
    expect(transporterRegistry.rows[0]).toMatchObject({ id: transporter.id, onTimeRate: 80 });
    expect(exceptions.deliveredNotInvoiced[0]).toMatchObject({ id: delivery.id });
    expect(matrix).toMatchObject({ department: 'Logistique', approverRole: 'ADMIN' });
    expect(priceHistory.rows[0]).toMatchObject({ supplierId: 'sup-1', productId: receipt.lines[0].productId });
    expect(substitutes.rows[0]).toHaveProperty('margin');
    expect(deadStock.rows.length).toBeGreaterThan(0);
    expect(cump.rows[0]).toHaveProperty('afterCump');
    expect(requirement).toMatchObject({ evidenceCategory: 'INVOICE', required: true });
    expect(accruals.rows.map((row) => row.category)).toEqual(expect.arrayContaining(['RENT', 'SALARIES']));
    expect(taxCalendar.rows.map((row) => row.declaration)).toEqual(['VAT', 'IR', 'CNSS', 'IS', 'PAYROLL']);
    expect(reminders.rows[0]).toMatchObject({ id: owner.id, reminderDay: 15 });
    expect(loan).toMatchObject({ outstanding: 5000, monthlyDeductionLimit: 800 });
    expect(reimbursement).toMatchObject({ status: 'POSTED' });
    expect(overtime.payrollImpact).toBeGreaterThan(0);
    expect(amendment).toMatchObject({ previousSalary: 6000, newSalary: 6500 });
    expect(social).toHaveProperty('variance');
    expect(hrAudit.map((entry) => entry.category)).toContain('SALARY');
    expect(billing).toMatchObject({ projectId: project.id, retainerAmount: 5000 });
  });

  it('covers service contracts, SAV, production quality, admin controls, Moroccan tax, and CNSS anomaly workflows', () => {
    const contract = store.createServiceContract({ customerId: 'cus-1', name: 'Contrat support Rabat', monthlyAmount: 1200, renewalDate: '2026-06-15' });
    const drafts = store.generateServiceContractDraftInvoices({ period: '2026-05' });
    const renewals = store.serviceContractRenewalReminders();
    const warranty = store.createWarrantyServiceCase({ customerId: 'cus-1', productId: 'prd-1', serialNumber: 'SN-001', issue: 'Remplacement assise', replacementProductId: 'prd-1' });

    const bom = store.createBillOfMaterial({ finishedProductId: 'prd-fg', version: 'QA', components: [{ productId: 'prd-raw', quantity: 1, unitCost: 90 }] });
    const production = store.createProductionOrder({ finishedProductId: 'prd-fg', quantity: 1, billOfMaterialId: bom.id });
    const quality = store.createProductionQualityCheck({ productionOrderId: production.id, result: 'FAIL', scrapQuantity: 1, reworkCost: 250, evidenceReference: 'qa-fail.pdf' });

    const asset = store.createMaintenanceAsset({ name: 'Scie atelier', category: 'Production' });
    const workOrder = store.createMaintenanceWorkOrder({ assetId: asset.id, technician: 'Technicien Casa', cost: 100, description: 'Changement pièce' });
    const spare = store.reserveMaintenanceSparePart({ workOrderId: workOrder.id, productId: 'prd-raw', quantity: 2 });
    const consumed = store.consumeMaintenanceSparePart(spare.id);
    const vehicle = store.createFleetVehicle({ plate: 'WW-654321', driver: 'Karim Routier' });
    const fleetCase = store.createFleetComplianceCase({ vehicleId: vehicle.id, type: 'INSURANCE_RENEWAL', amount: 3200, dueDate: '2026-06-30', description: 'Renouvellement assurance' });

    const delegation = store.createApprovalDelegation({ fromUserId: 'usr-owner', toUserId: 'usr-accountant', module: 'accounting', startDate: '2026-05-01', endDate: '2026-06-01', reason: 'Absence gérant' });
    const apiKey = store.createPartnerApiKey({ name: 'Stock lecture', scopes: ['inventory:read'], moduleScopes: ['inventory'], ipAllowlist: ['127.0.0.1'], expiresAt: '2026-12-31' });
    const usedKey = store.recordApiKeyUse(apiKey.id, { ip: '127.0.0.1', evidence: 'health-check' });
    const importRun = store.importValidationSandbox({ kind: 'customers', csv: 'name,ice\nClient sans ICE,' });
    const exportCenter = store.exportStatusCenter();
    const qualityScore = store.tenantDataQualityScore();
    const handoff = store.guidedAccountantHandoffPack({ period: '2026-05' });
    const partnerWorkload = store.implementationPartnerMarginWorkloadDashboard();
    const ticket = store.createSupportTicket({ module: 'sales', subject: 'Erreur facture SAV', severity: 'HIGH', screenshotReferences: ['sav.png'] });
    const health = store.adminHealthChecks();
    const resilience = store.tenantResilienceRunbookStatus();

    const receipt = store.createPurchaseReceipt({ supplierId: 'sup-1', lines: [{ productId: 'prd-raw', quantity: 2, unitCost: 100 }] });
    store.createSupplierInvoice({ purchaseReceiptId: receipt.id });
    const prorata = store.createVatProrataRule({ period: '2026-05', deductiblePercent: 75, activityNote: 'Activité mixte taxable/exonérée', evidenceReference: 'prorata.pdf' });
    const prorataReport = store.vatProrataReport({ period: '2026-05' });
    const isEstimate = store.isEstimateDashboard({ period: '2026-05' });
    const professionalTax = store.createProfessionalTaxRecord({ establishment: 'Siège Casablanca', city: 'Casablanca', rentalValue: 120000, dueDate: '2026-12-31' });
    const dgiCalendar = store.dgiDeclarationCalendar();
    const cnssAnomalies = store.cnssEmployeeAnomalyDrilldown();

    expect(contract).toMatchObject({ customerId: 'cus-1', active: true });
    expect(drafts.draftInvoices[0].invoice).toMatchObject({ status: 'DRAFT' });
    expect(renewals.rows.map((row) => row.id)).toContain(contract.id);
    expect(warranty).toMatchObject({ status: 'REPLACEMENT_RESERVED', replacementProductId: 'prd-1' });
    expect(quality).toMatchObject({ result: 'FAIL', evidenceReference: 'qa-fail.pdf' });
    expect(store.getProduct('prd-fg').lifecycleState).toBe('BLOCKED');
    expect(consumed).toMatchObject({ status: 'CONSUMED' });
    expect(store.listMaintenance().workOrders.find((order) => order.id === workOrder.id)?.cost).toBeGreaterThan(100);
    expect(fleetCase).toMatchObject({ type: 'INSURANCE_RENEWAL', status: 'OPEN' });
    expect(delegation).toMatchObject({ module: 'accounting', active: true });
    expect(usedKey).toMatchObject({ lastUseEvidence: 'health-check' });
    expect(importRun.errors[0]).toMatchObject({ field: 'ice' });
    expect(exportCenter.filters).toEqual(expect.arrayContaining(['period', 'module', 'checksum']));
    expect(qualityScore).toHaveProperty('score');
    expect(handoff).toHaveProperty('checksum');
    expect(partnerWorkload.totals).toHaveProperty('workloadHours');
    expect(ticket).toMatchObject({ severity: 'HIGH', status: 'OPEN' });
    expect(health.queues).toHaveProperty('status');
    expect(resilience).toHaveProperty('incidentContacts');
    expect(prorata).toMatchObject({ deductiblePercent: 75 });
    expect(prorataReport.deductibleVat).toBeGreaterThan(0);
    expect(isEstimate.installments).toHaveLength(4);
    expect(professionalTax).toMatchObject({ city: 'Casablanca', professionalTaxEstimate: 12000 });
    expect(dgiCalendar.rows.map((row) => row.declaration)).toEqual(expect.arrayContaining(['VAT', 'IR', 'IS']));
    expect(cnssAnomalies.summary).toHaveProperty('missingAffiliation');
  });

  it('covers AMO, Moroccan references, bilingual documents, risk scoring, fiscal exceptions, and trial balance controls', () => {
    const payrollRun = store.createPayrollRun({ year: 2026, month: 5 });
    store.calculatePayrollRun(payrollRun.id);
    const amo = store.amoReconciliation();
    const holidays = store.moroccanPublicHolidayCalendar({ year: 2026 });
    const cityRegions = store.moroccanCityRegionReference();

    const invoice = store.createInvoice({ customerId: 'cus-1', lines: [{ productId: 'prd-2', quantity: 1 }] });
    const arabicQa = store.arabicInvoiceRenderingQa({ invoiceId: invoice.id });
    const bilingualStatement = store.exportBilingualCustomerStatementPdf('cus-1');
    const customerCredit = store.customerCreditScores();

    const receipt = store.createPurchaseReceipt({ supplierId: 'sup-1', lines: [{ productId: 'prd-raw', quantity: 3, unitCost: 100 }] });
    store.createSupplierInvoice({ purchaseReceiptId: receipt.id });
    const supplierStatement = store.exportSupplierStatementPdf('sup-1');
    const landed = store.landedCostAllocation({ purchaseReceiptId: receipt.id, freight: 60, customs: 30, customsDuty: 20, transit: 10, insurance: 5, vatTreatment: 'RECOVERABLE' });
    const importArchive = store.archiveImportDeclarationEvidence({ dumReference: 'DUM-2026-001', supplierId: 'sup-1', shipmentReference: 'SHIP-001', customsVat: 1200, documentNames: ['DUM', 'Facture fournisseur'] });
    const supplierRisk = store.supplierRiskScoreDashboard();

    const rib = store.requestBankRibVerification({ partyType: 'SUPPLIER', partyId: 'sup-1', rib: '007 780 000000000000000123', bankName: 'Attijariwafa bank', documentEvidence: 'rib.pdf' });
    const approvedRib = store.approveBankRibVerification(rib.id, { actor: 'accountant@atlas.ma', note: 'RIB conforme' });

    const cheque = store.createCheque({ invoiceId: invoice.id, number: 'CHQ-PORT-001', bank: 'Bank of Africa', drawer: 'Rabat Retail SARL', dueDate: '2026-06-20', amount: 200 });
    cheque.status = 'REJECTED';
    const chequePortfolio = store.chequePortfolioDashboard();

    const pos = store.openPosSession({ cashierId: 'cashier-1', openingCash: 500 });
    const cashbox = store.createCashboxDailyApproval({ sessionId: pos.id, supervisor: 'Nadia Benali', countedCash: 510 });
    const receiptTemplates = store.posReceiptTemplateCatalog();

    const lot = store.createTraceabilityLot({ productId: 'prd-raw', lotNumber: 'LOT-EXP-001', quantity: 2, expiryDate: '2026-12-31' });
    const serial = store.createTraceabilityLot({ productId: 'prd-1', serialNumber: 'SN-ERP-2026', quantity: 1 });
    const traceability = store.traceabilityExport();
    const serials = store.serialNumberRegistry();

    const approvalSimulation = store.approvalMatrixSimulator({ role: 'ADMIN', module: 'inventory', amount: 30000 });
    const comment = store.createAccountantReviewComment({ entityType: 'INVOICE', entityId: invoice.id, period: '2026-05', comment: 'Contrôle facture arabe et TVA' });
    const resolved = store.resolveAccountantReviewComment(comment.id);
    const reviewMode = store.accountantReviewMode({ period: '2026-05' });
    const fiscalException = store.requestFiscalLockException({ year: 2026, month: 5, reason: 'Correction contrôlée post-clôture', approver: 'Cabinet Fiduciaire Casa' });
    const trialBalance = store.trialBalanceReport({ year: 2026, month: 5 });

    expect(amo.rows[0]).toHaveProperty('payslipAmoEmployee');
    expect(amo.status).toBe('NEEDS_REVIEW');
    expect(holidays.rows.map((row) => row.label)).toEqual(expect.arrayContaining(['Fête du Travail', 'Aïd Al Adha - observation lunaire']));
    expect(holidays.sourceNote).toContain('observation lunaire');
    expect(cityRegions.rows.map((row) => row.city)).toEqual(expect.arrayContaining(['Casablanca', 'Dakhla']));
    expect(arabicQa).toMatchObject({ status: 'RTL_QA_READY', invoiceId: invoice.id });
    expect(arabicQa.rtlFields.map((field) => field.direction)).toContain('rtl');
    expect(bilingualStatement).toMatchObject({ status: 'PREPARED', rtlVerified: true });
    expect(bilingualStatement.requiredMentions).toEqual(expect.arrayContaining(['RTL arabe', 'Promesses paiement']));
    expect(supplierStatement).toMatchObject({ status: 'PREPARED' });
    expect(supplierStatement.reconciliationStatus).toBe('NEEDS_REVIEW');
    expect(approvedRib).toMatchObject({ status: 'APPROVED', bankName: 'Attijariwafa bank' });
    expect(store.bankRibVerifications()).toHaveLength(1);
    expect(chequePortfolio.totals.bounced).toBe(1);
    expect(cashbox).toMatchObject({ status: 'APPROVED', variance: 10 });
    expect(cashbox.journalEntryId).toBeDefined();
    expect(receiptTemplates[0]).toMatchObject({ showsIce: true, showsVat: true });
    expect(traceability.rows.map((row) => row.lotId)).toEqual(expect.arrayContaining([lot.id, serial.id]));
    expect(traceability).toMatchObject({ expiryTracked: 1, serialTracked: 1 });
    expect(serials.rows[0]).toMatchObject({ serialNumber: 'SN-ERP-2026' });
    expect(landed).toMatchObject({ totalAllocated: 95, customsDutyIncluded: true });
    expect(landed.rows[0]).toHaveProperty('previousCump');
    expect(importArchive).toMatchObject({ dumReference: 'DUM-2026-001', supplierId: 'sup-1' });
    expect(store.importDeclarationArchives()).toHaveLength(1);
    expect(supplierRisk[0]).toHaveProperty('score');
    expect(customerCredit[0]).toHaveProperty('concentrationRisk');
    expect(approvalSimulation).toMatchObject({ requiresApproval: true, allowed: true, approverRole: 'ADMIN' });
    expect(resolved).toMatchObject({ status: 'RESOLVED' });
    expect(reviewMode.comments.map((item) => item.id)).toContain(comment.id);
    expect(fiscalException).toMatchObject({ status: 'APPROVED', approver: 'Cabinet Fiduciaire Casa' });
    expect(fiscalException.reverseAuditEvidence).toHaveLength(64);
    expect(store.fiscalLockExceptions()).toHaveLength(1);
    expect(trialBalance.totals.debit).toBeCloseTo(trialBalance.totals.credit, 2);
    expect(trialBalance.rows.length).toBeGreaterThan(0);
  });

  it('covers the scale-up batch for ledgers, payroll, SaaS controls, branches, delivery, approvals, and inventory planning', () => {
    const batch = store.moroccoScaleControlsReadiness();

    expect(batch.generalLedger.checksum).toHaveLength(64);
    expect(batch.customerLedger[0].totals).toHaveProperty('residual');
    expect(batch.supplierLedger[0].totals).toHaveProperty('residual');
    expect(batch.numberingAudit).toHaveProperty('fiscalYear');
    expect(batch.cancellation).toMatchObject({ reversalEntryCreated: true });
    expect(batch.transferApproval).toHaveProperty('approvalStatus');
    expect(batch.inventorySnapshot.checksum).toHaveLength(64);
    expect(batch.negativePrevention.rows.length).toBeGreaterThan(0);
    expect(batch.payrollVariance.rows[0]).toHaveProperty('varianceVsPrevious');
    expect(batch.contractRenewal.renewal).toMatchObject({ newSalary: 6700 });
    expect(batch.absenceSandbox).toMatchObject({ status: 'VALIDATED', approvedBy: 'payroll@atlas.ma' });
    expect(batch.payrollJournalPreview.lockPeriodValidation).toBe('OPEN');
    expect(batch.payrollEvidencePack.files.map((file) => file.type)).toEqual(expect.arrayContaining(['DAMANCOM', 'PAYSLIP', 'JOURNAL_PREVIEW']));
    expect(batch.dgiSandbox.submissionState).toBe('PENDING_CREDENTIALS');
    expect(batch.cnssSandbox.kind).toBe('CNSS');
    expect(batch.bankImportPreview.rows[0]).toHaveProperty('suggestedMatch');
    expect(batch.automatedPaymentMatching.criteria).toEqual(expect.arrayContaining(['customerRib']));
    expect(batch.paymentAllocationAudit).toMatchObject({ approvalStatus: 'APPROVED' });
    expect(batch.planEnforcement.exportPermissions.legalArchive).toBe(true);
    expect(batch.usageMeter).toHaveProperty('activeUsers');
    expect(batch.goLiveRisk).toHaveProperty('totalScore');
    expect(batch.demoScenarios.map((scenario) => scenario.id)).toEqual(expect.arrayContaining(['trading', 'pos-retail', 'production']));
    expect(batch.migrationImporter.templates).toEqual(expect.arrayContaining(['Odoo partenaires']));
    expect(batch.autoFixSuggestions).toHaveProperty('suggestions');
    expect(batch.complianceCockpit.status).toBe('EXECUTIVE_READY');
    expect(batch.branchRegistry.rows[0]).toHaveProperty('invoiceSeries');
    expect(batch.multiBranchStock.rows[0]).toHaveProperty('transferLeadTimeDays');
    expect(batch.deliveryZonePricing.rows.map((row) => row.city)).toContain('Rabat');
    expect(batch.customerSectors[0]).toHaveProperty('sector');
    expect(batch.supplierVault[0]).toHaveProperty('workflowStatus');
    expect(batch.delegatedApprovals.rows.map((row) => row.role)).toEqual(expect.arrayContaining(['accountant']));
    expect(batch.documentRedaction.fields.salary).toBe('REDACTED');
    expect(batch.ocrQueue).toHaveProperty('pending');
    expect(batch.cashCollection).toHaveProperty('totalToCollect');
    expect(batch.creditInsurance[0]).toHaveProperty('coveredAmount');
    expect(batch.guaranteeRegister[0].guarantees.map((item) => item.type)).toEqual(expect.arrayContaining(['BANK_GUARANTEE']));
    expect(batch.supplierAdvance).toMatchObject({ status: 'APPROVED' });
    expect(batch.landedCostSimulation.totalEstimatedCost).toBeGreaterThan(batch.landedCostSimulation.base);
    expect(batch.abcClassification.rows[0]).toHaveProperty('class');
    expect(batch.cycleCount.status).toBe('SCHEDULED');
  });

  it('covers the enterprise depth batch for sales, treasury, HR, production, portals, archive, and onboarding controls', () => {
    const batch = store.moroccoEnterpriseDepthReadiness();

    expect(batch.stockDamage).toMatchObject({ status: 'OPEN', photoEvidenceStatus: 'PLACEHOLDER_READY' });
    expect(batch.stockDamage.accountingImpact).toBeGreaterThan(0);
    expect(batch.substituteMapping.substitutions[0]).toHaveProperty('marginDelta');
    expect(batch.priceListImport).toMatchObject({ status: 'IMPORTED' });
    expect(batch.priceListImport.approvalAudit.checksum).toHaveLength(64);
    expect(batch.marginGuardrails).toHaveProperty('blocked');
    expect(batch.salesTargets.target).toMatchObject({ module: 'sales' });
    expect(batch.commissionAccrual).toMatchObject({ approvalStatus: 'APPROVED', paymentDependency: 'INVOICE_PAID_ONLY' });
    expect(batch.collectionQueue.rows[0]).toHaveProperty('dunningLevel');
    expect(batch.customerDispute).toHaveProperty('legalEvidenceId');
    expect(batch.supplierDispute.blockedPayments).toBeDefined();
    expect(batch.treasury).toHaveProperty('netPosition');
    expect(batch.chequeDepositSlip).toMatchObject({ reconciliationStatus: 'PENDING_BANK_STATEMENT' });
    expect(batch.bouncedCheque).toMatchObject({ holdPolicy: 'BLOCK_ORDERS', customerNotification: 'QUEUED' });
    expect(batch.bankCategorization.rules.map((rule) => rule.category)).toEqual(expect.arrayContaining(['RENT', 'CUSTOMER_PAYMENT']));
    expect(batch.recurringExpenses.rows.map((row) => row.category)).toEqual(expect.arrayContaining(['rent', 'telecom', 'tax-installment']));
    expect(batch.expenseMatrix.rows[0]).toHaveProperty('budgetOwner');
    expect(batch.employeeAdvance).toMatchObject({ status: 'APPROVED' });
    expect(batch.employeeLoans.rows[0]).toHaveProperty('payslipExplanation');
    expect(batch.overtime).toHaveProperty('payrollImpactPreview');
    expect(batch.attendance.rows[0]).toHaveProperty('anomalyFlags');
    expect(batch.leaveConflicts).toMatchObject({ status: 'CONFLICT_SCAN_READY' });
    expect(batch.cnssRegistration.rows[0]).toHaveProperty('contractEvidence');
    expect(batch.offboarding).toMatchObject({ accessRevocation: 'SCHEDULED' });
    expect(batch.maintenanceConsumption).toMatchObject({ status: 'CONSUMED', warehouseDeduction: true });
    expect(batch.fleetAlerts.rows.map((row) => row.document)).toEqual(expect.arrayContaining(['insurance', 'vignette', 'technicalInspection']));
    expect(batch.fleetAccident).toHaveProperty('repairOrderId');
    expect(batch.productionQuality).toMatchObject({ finishedGoodsHold: true });
    expect(batch.productionCapacity.rows[0]).toHaveProperty('componentAvailability');
    expect(batch.projectChange).toMatchObject({ customerApproval: 'PENDING' });
    expect(batch.projectWip.rows[0]).toHaveProperty('earnedValue');
    expect(batch.customerPortalInvoices).toHaveProperty('fileEvidenceId');
    expect(batch.supplierPortalUpload.uploadSlots[0]).toHaveProperty('renewalReminder');
    expect(batch.dataRoom.checksum).toHaveLength(64);
    expect(batch.checklistTemplates.templates.map((template) => template.industry)).toEqual(expect.arrayContaining(['retail', 'manufacturing', 'construction']));
    expect(batch.telemetry).toHaveProperty('trainingNeeds');
    expect(batch.competitiveHeatmap.rows.map((row) => row.competitor)).toEqual(expect.arrayContaining(['Odoo', 'ERP local Maroc']));
    expect(batch.retentionPolicy).toMatchObject({ checksumRequired: true, retentionYears: 10 });
    expect(batch.eSignature).toMatchObject({ immutableArchiveStatus: 'ARCHIVED' });
    expect(batch.customerRiskQuestionnaire.items.map((item) => item.key)).toEqual(expect.arrayContaining(['ice', 'sanctionsNotes']));
    expect(batch.supplierRiskQuestionnaire.items.map((item) => item.key)).toEqual(expect.arrayContaining(['taxStatus', 'ribOwnership']));
    expect(batch.deliveryOcr).toMatchObject({ ocrStatus: 'PLACEHOLDER_READY', manualValidation: true });
  });

  it('covers the enterprise operations batch for logistics, treasury, payroll, projects, portals, declarations, and security', () => {
    const batch = store.moroccoEnterpriseOperationsReadiness();

    expect(batch.transporterReconciliation).toHaveProperty('reconciliationStatus');
    expect(batch.securityIncident.stockAdjustmentProposal).toHaveProperty('valuation');
    expect(batch.obsolescenceProvision.totalProvision).toBeGreaterThan(0);
    expect(batch.importVatRecovery.rows[0]).toHaveProperty('dumReference');
    expect(batch.threeWayMatch).toHaveProperty('landedCostTotal');
    expect(batch.supplierPaymentRun).toHaveProperty('treasuryForecast');
    expect(batch.dunningTemplates.variants.map((variant) => variant.language)).toEqual(expect.arrayContaining(['FR', 'AR']));
    expect(batch.collectionCallLog.rows[0]).toHaveProperty('promiseId');
    expect(batch.cashReceiptAudit).toMatchObject({ accountabilityStatus: 'TRACEABLE' });
    expect(batch.posZReport).toMatchObject({ closureStatus: 'SIGNED' });
    expect(batch.bankReconciliationPdf.evidenceId).toBeDefined();
    expect(batch.bankTransferAdapter.statusPolling.map((step) => step.operation)).toEqual(expect.arrayContaining(['validate', 'poll']));
    expect(batch.payrollBankTransfer).toMatchObject({ employeeRibValidation: true });
    expect(batch.benefitInKind.taxableBasePreview).toBeGreaterThan(0);
    expect(batch.endOfContract).toMatchObject({ finalPayslipStatus: 'PREPARED' });
    expect(batch.occupationalHealth.rows[0]).toHaveProperty('evidenceVault');
    expect(batch.disciplinaryWorkflow).toMatchObject({ restrictedNotes: true });
    expect(batch.headcountDashboard).toHaveProperty('byContractType');
    expect(batch.componentShortage.rows[0]).toHaveProperty('purchaseLeadTimeDays');
    expect(batch.subcontracting).toHaveProperty('costRollup');
    expect(batch.downtimeAnalytics.rows[0]).toHaveProperty('lostProductionEstimate');
    expect(batch.mileageReimbursement).toMatchObject({ approvalStatus: 'APPROVED' });
    expect(batch.fuelCardImport.exceptionPreview[0]).toHaveProperty('reason', 'DUPLICATE');
    expect(batch.projectCommitments).toHaveProperty('remainingForecast');
    expect(batch.timesheetApproval.entries[0]).toHaveProperty('billable', true);
    expect(batch.portalPaymentPromise.secureToken).toHaveLength(64);
    expect(batch.supplierCertificateRenewal).toHaveProperty('blockerAlerts');
    expect(batch.accountantAnnotations.comments.length).toBeGreaterThanOrEqual(3);
    expect(batch.legalArchiveBundle).toMatchObject({ restoreVerification: true });
    expect(batch.dgiVatPayload).toHaveProperty('archiveEvidenceId');
    expect(batch.irSalaryPayload.employeeIdentifiers[0]).toHaveProperty('cin');
    expect(batch.cnssAmendment).toMatchObject({ status: 'AMENDMENT_READY' });
    expect(batch.publicProcurement).toMatchObject({ publicProcurement: true });
    expect(batch.retentionGuarantee.accountingProposal).toHaveLength(2);
    expect(batch.branchPnl).toHaveProperty('pnl');
    expect(batch.multiCompanyDashboard.rows[0]).toHaveProperty('workloadScore');
    expect(batch.securityChecklist.checks.map((check) => check.key)).toEqual(expect.arrayContaining(['mfa', 'apiKeys']));
    expect(batch.permissionSimulator).toHaveProperty('explanation');
    expect(batch.auditAnomalies).toHaveProperty('summary');
    expect(batch.customerProfitability.rows[0]).toHaveProperty('profitability');
  });

  it('covers the enterprise expansion batch for SaaS adoption, verticals, compliance, finance, and stock workflows', () => {
    const batch = store.moroccoEnterpriseExpansionReadiness();

    expect(batch.supplierProfitabilityRisk.rows[0]).toHaveProperty('purchaseVolume');
    expect(batch.onboardingWizard).toMatchObject({ persisted: true });
    expect(batch.trainingChecklist.rows[0]).toHaveProperty('completedLessons');
    expect(batch.tenantSuccess.score).toBeGreaterThanOrEqual(0);
    expect(batch.migrationRoi.rows.map((row) => row.competitor)).toEqual(expect.arrayContaining(['Odoo', 'Sage']));
    expect(batch.cashflowStress).toHaveProperty('stressedBalance');
    expect(batch.accountantTimeline.rows.map((row) => row.type)).toEqual(expect.arrayContaining(['REQUEST', 'SIGN_OFF']));
    expect(batch.creditCommittee).toHaveProperty('proposedLimit');
    expect(batch.supplierRenewal).toHaveProperty('renewalDecision');
    expect(batch.branchTransferImpact).toHaveProperty('approvalRoute');
    expect(batch.hospitalityServiceCharge).toHaveProperty('tipAccountingProposal');
    expect(batch.loyaltyLiability.accountingProvisionPreview).toHaveLength(1);
    expect(batch.educationBilling.parentPortalPromises.length).toBeGreaterThan(0);
    expect(batch.clinicInvoicing).toMatchObject({ status: 'COMPLIANT' });
    expect(batch.constructionProgress).toHaveProperty('customerApproval');
    expect(batch.landedCostVariance).toHaveProperty('dumReference');
    expect(batch.exporterCurrencyPack).toMatchObject({ currency: 'EUR' });
    expect(batch.agriPurchaseIntake).toHaveProperty('withholdingNote');
    expect(batch.scrapRecovery.accountingRecoveryProposal[0]).toHaveProperty('account');
    expect(batch.retainerRevenue).toHaveProperty('deferredRevenue');
    expect(batch.downgradeRisk).toHaveProperty('customerCommunication');
    expect(batch.legalIdentityChange).toMatchObject({ historicalInvoiceProtection: true });
    expect(batch.dataResidency.checks.map((check) => check.key)).toEqual(expect.arrayContaining(['region', 'subcontractors']));
    expect(batch.incidentResponse.timeline.length).toBeGreaterThan(0);
    expect(batch.releaseReadiness).toMatchObject({ status: 'READY_TO_RELEASE' });
    expect(batch.aiBookkeeping.rows[0]).toHaveProperty('confidence');
    expect(batch.ocrBenchmark.rows[0]).toHaveProperty('arabicSupport');
    expect(batch.bankFeedConsent).toMatchObject({ status: 'CONSENT_ACTIVE' });
    expect(batch.eInvoicingGaps.gaps.map((gap) => gap.key)).toEqual(expect.arrayContaining(['legalMentions', 'adapter']));
    expect(batch.payrollRuleDiff.impactedEmployees).toContain('emp-1');
    expect(batch.vatAuditTrail).toHaveProperty('archiveEvidenceId');
    expect(batch.fixedAssetDepreciation.journalProposal).toHaveLength(2);
    expect(batch.leasingTracker.paymentSchedule.length).toBeGreaterThan(0);
    expect(batch.insuranceRegister.rows[0]).toHaveProperty('documentVault');
    expect(batch.pettyCashReplenishment).toHaveProperty('cashboxImpact');
    expect(batch.corporateCardImport).toHaveProperty('duplicateDetection');
    expect(batch.travelMission).toMatchObject({ clientBillable: true });
    expect(batch.slaPenalty).toMatchObject({ status: 'PENALTY_TRACKED' });
    expect(batch.supplierRebate).toHaveProperty('creditNoteExpectation');
    expect(batch.reservationExpiry).toMatchObject({ status: 'RESERVATION_TRACKED' });
  });

  it('keeps enterprise expansion readiness available without mutating a locked fiscal period', () => {
    const [year, month] = new Date().toISOString().slice(0, 7).split('-').map(Number);
    const invoiceCountBefore = store.listInvoices().length;

    store.requestFiscalLockException({
      year,
      month,
      reason: 'Correction contrôlée après revue comptable',
      approver: 'accountant@atlas.ma',
    });

    const lockedBefore = store.listFiscalPeriods().find((period) => period.year === year && period.month === month);
    expect(lockedBefore).toMatchObject({ locked: true, status: 'LOCKED' });

    const batch = store.moroccoEnterpriseExpansionReadiness();

    expect(batch.exporterCurrencyPack).toMatchObject({ currency: 'EUR' });
    expect(batch.vatAuditTrail).toMatchObject({ status: 'TRACE_READY' });
    expect(store.listInvoices()).toHaveLength(invoiceCountBefore);
    expect(store.listFiscalPeriods().find((period) => period.year === year && period.month === month))
      .toMatchObject({ locked: true, status: 'LOCKED' });
  });

  it('covers the enterprise acceleration batch for commerce, verticals, HR, tax, and integration workflows', () => {
    const batch = store.moroccoEnterpriseAccelerationReadiness();

    expect(batch.consignmentStock).toMatchObject({ valuationExcluded: true });
    expect(batch.warrantyReserve.reserve).toBeGreaterThan(0);
    expect(batch.afterSalesRma).toHaveProperty('creditNoteLink');
    expect(batch.subscriptionProration).toHaveProperty('invoiceNote');
    expect(batch.competitorBattlecard.rows.map((row) => row.competitor)).toEqual(expect.arrayContaining(['Odoo', 'Sage']));
    expect(batch.ecommerceReconciliation).toHaveProperty('marketplacePayout');
    expect(batch.marketplaceSettlement).toHaveProperty('netSettlement');
    expect(batch.wholesaleRebate).toHaveProperty('monthlyAccrual');
    expect(batch.retailCashAudit).toMatchObject({ status: 'CASH_AUDITED' });
    expect(batch.pharmaLotExpiry).toMatchObject({ quarantine: true });
    expect(batch.foodRecallDrill.customerDeliveries.length).toBeGreaterThan(0);
    expect(batch.hotelOccupancy).toHaveProperty('occupancyRate');
    expect(batch.spaPackageLiability).toHaveProperty('liability');
    expect(batch.routeProfitability.margin).toBeGreaterThan(0);
    expect(batch.brokerFeeReconciliation).toHaveProperty('dumReference');
    expect(batch.fxExposure).toHaveProperty('gainLossPreview');
    expect(batch.bouncedPaymentRecovery).toMatchObject({ accountHold: true });
    expect(batch.blockedPaymentRelease).toMatchObject({ status: 'PAYMENT_RELEASED' });
    expect(batch.warrantyClaimReserve.accountingProposal).toHaveLength(2);
    expect(batch.fleetClaimSettlement.journalProposal).toHaveLength(3);
    expect(batch.maintenanceCompliance).toHaveProperty('score');
    expect(batch.projectCloseout).toHaveProperty('archiveBundle');
    expect(batch.consultantUtilization).toHaveProperty('grossMargin');
    expect(batch.certificationRegister.rows[0]).toHaveProperty('renewalWorkflow');
    expect(batch.payrollLoanCompliance.rows[0]).toHaveProperty('payslipDisclosure', true);
    expect(batch.hrOnboardingPack.documents).toEqual(expect.arrayContaining(['CIN']));
    expect(batch.executiveDigest).toHaveProperty('churnRisk');
    expect(batch.supportEscalation.rows[0]).toHaveProperty('customerNotice');
    expect(batch.partnerCapacity).toHaveProperty('riskScore');
    expect(batch.sandboxResetAudit.restorePoint).toHaveLength(64);
    expect(batch.invoiceMentionValidator.checks.map((check) => check.key)).toEqual(expect.arrayContaining(['ICE', 'NUMBERING']));
    expect(batch.bilingualPdfQueue.rows[0]).toHaveProperty('rtlFields');
    expect(batch.vatCarryforward).toHaveProperty('sourceDeclaration');
    expect(batch.isForecast.dueDates).toHaveLength(4);
    expect(batch.professionalTaxCalendar.rows[0]).toHaveProperty('municipality');
    expect(batch.cnssAnomalyHeatmap.rows[0]).toHaveProperty('correctionOwner');
    expect(batch.amoReimbursements.rows[0]).toHaveProperty('documentVault');
    expect(batch.dataExportApproval.checksum).toHaveLength(64);
    expect(batch.apiContractDashboard.rows[0]).toHaveProperty('keyRotation');
    expect(batch.webhookReplay).toMatchObject({ signatureValidation: 'VALID' });
    expect(batch.featureAdoptionExperiment).toHaveProperty('rollback');
    expect(batch.priceIncreaseCommunication).toHaveProperty('templateFr');
    expect(batch.customerChurnRisk).toHaveProperty('actionPlan');
    expect(batch.supplierDependency.rows[0]).toHaveProperty('mitigationOwner');
    expect(batch.verticalTemplateSelector.documentPack).toEqual(expect.arrayContaining(['Facture FR/AR']));
  });

  it('keeps enterprise acceleration readiness available without mutating a locked fiscal period', () => {
    const [year, month] = new Date().toISOString().slice(0, 7).split('-').map(Number);
    const invoiceCountBefore = store.listInvoices().length;

    store.requestFiscalLockException({
      year,
      month,
      reason: 'Correction contrôlée après revue comptable',
      approver: 'accountant@atlas.ma',
    });

    const batch = store.moroccoEnterpriseAccelerationReadiness();

    expect(batch.invoiceMentionValidator).toMatchObject({ status: 'MENTIONS_VALID' });
    expect(batch.webhookReplay).toMatchObject({ status: 'REPLAY_READY' });
    expect(store.listInvoices()).toHaveLength(invoiceCountBefore);
    expect(store.listFiscalPeriods().find((period) => period.year === year && period.month === month))
      .toMatchObject({ locked: true, status: 'LOCKED' });
  });

  it('covers the enterprise intelligence batch for forecasts, risk, operations, and platform controls', () => {
    const batch = store.moroccoEnterpriseIntelligenceReadiness();

    expect(batch.salesPipelineForecast.totalWeighted).toBeGreaterThanOrEqual(0);
    expect(batch.customerLifetimeValue.rows[0]).toHaveProperty('retentionAction');
    expect(batch.renewalRevenueCalendar.rows[0]).toHaveProperty('noticePeriod');
    expect(batch.pricingElasticity.forecastImpact.length).toBeGreaterThan(0);
    expect(batch.dsoForecast).toHaveProperty('targetDays', 45);
    expect(batch.supplierPriceVariance.rows[0]).toHaveProperty('approvalThreshold');
    expect(batch.purchaseBudgetBurn).toHaveProperty('remainingBudget');
    expect(batch.stockServiceLevel.rows[0]).toHaveProperty('fillRate');
    expect(batch.demandForecast.rows[0]).toHaveProperty('suggestedPo');
    expect(batch.warehouseSlotting.rows[0]).toHaveProperty('movePlan');
    expect(batch.productionYield.rows[0]).toHaveProperty('correctiveOwner');
    expect(batch.qualityNonconformance).toHaveProperty('capa');
    expect(batch.fleetCo2Fuel.rows[0]).toHaveProperty('co2Kg');
    expect(batch.maintenanceCostTrend.rows[0]).toHaveProperty('replacementSignal');
    expect(batch.projectMilestoneBillingRisk).toHaveProperty('delayOwner');
    expect(batch.consultantStaffingForecast).toHaveProperty('hiringTrigger');
    expect(batch.payrollOvertimeRisk.rows[0]).toHaveProperty('legalCap');
    expect(batch.leaveLiability.rows[0]).toHaveProperty('liability');
    expect(batch.trainingRoi.rows[0]).toHaveProperty('renewalDate');
    expect(batch.cnssDueReminder).toHaveProperty('paymentDeadline');
    expect(batch.vatSensitivity).toHaveProperty('cashScenario');
    expect(batch.iceIfDataQuality).toHaveProperty('rows');
    expect(batch.auditSampling).toHaveProperty('selectedEntries');
    expect(batch.bankCovenant).toHaveProperty('threshold');
    expect(batch.cashRunway.runwayDays).toBeGreaterThan(0);
    expect(batch.creditInsurance.rows[0]).toHaveProperty('evidence');
    expect(batch.ecommerceReturnReasons.rows[0]).toHaveProperty('correctiveAction');
    expect(batch.posFraudAnomaly.rows[0]).toHaveProperty('escalation');
    expect(batch.loyaltyCohorts.rows[0]).toHaveProperty('liability');
    expect(batch.supportDeflectionKb.rows[0]).toHaveProperty('owner');
    expect(batch.onboardingTimeToValue).toHaveProperty('successManager');
    expect(batch.featureEntitlementAudit).toHaveProperty('remediation');
    expect(batch.apiErrorBudget.rows[0]).toHaveProperty('slo');
    expect(batch.webhookDeliverySlo).toHaveProperty('rows');
    expect(batch.dataRetentionPurge.rows[0]).toHaveProperty('approval');
    expect(batch.backupRestoreSla).toHaveProperty('rto');
    expect(batch.regionalProfitability.rows[0]).toHaveProperty('taxNote');
    expect(batch.branchExpansionReadiness.rows[0]).toHaveProperty('launchChecklist');
    expect(batch.partnerReferralPipeline.rows[0]).toHaveProperty('commission');
    expect(batch.accountantWorkloadBalancing.rows[0]).toHaveProperty('reassignmentProposal');
  });

  it('keeps enterprise intelligence readiness read-only for tenant operational records', () => {
    const before = {
      invoices: store.listInvoices().length,
      journalEntries: store.listJournalEntries().length,
      auditLogs: store.auditLogs().length,
    };

    store.moroccoEnterpriseIntelligenceReadiness();

    expect({
      invoices: store.listInvoices().length,
      journalEntries: store.listJournalEntries().length,
      auditLogs: store.auditLogs().length,
    }).toEqual(before);
  });

  it('covers the enterprise automation batch for close, finance, operations, compliance, and platform workflows', () => {
    const batch = store.moroccoEnterpriseAutomationReadiness();

    expect(batch.closeChecklistScoring).toHaveProperty('score');
    expect(batch.invoiceMatchingAssistant).toMatchObject({ status: 'INVOICE_MATCHING_READY' });
    expect(Array.isArray(batch.invoiceMatchingAssistant.rows)).toBe(true);
    expect(batch.supplierInvoiceOcrTriage).toMatchObject({ status: 'OCR_TRIAGE_READY' });
    expect(Array.isArray(batch.supplierInvoiceOcrTriage.rows)).toBe(true);
    expect(batch.paymentRunOptimization).toHaveProperty('proposals');
    expect(Array.isArray(batch.paymentRunOptimization.proposals)).toBe(true);
    expect(batch.promiseReliabilityScore.rows[0]).toHaveProperty('creditImpact');
    expect(batch.salesTaxAnomalyDetector).toMatchObject({ status: 'SALES_TAX_ANALYZED' });
    expect(Array.isArray(batch.salesTaxAnomalyDetector.rows)).toBe(true);
    expect(batch.payrollVarianceExplainability.rows[0]).toHaveProperty('drivers');
    expect(batch.hrDocumentExpiryBoard.rows[0]).toHaveProperty('restrictedEvidence');
    expect(batch.purchaseRequestPolicy).toHaveProperty('rows');
    expect(batch.replenishmentAutopilot.rows[0]).toHaveProperty('suggestedQuantity');
    expect(batch.serializedTraceability.rows[0]).toHaveProperty('serviceHistory');
    expect(batch.recallCommunicationCenter).toHaveProperty('archive');
    expect(batch.productionFeasibility).toHaveProperty('machineReadiness');
    expect(batch.maintenancePrioritizer.rows[0]).toHaveProperty('sla');
    expect(batch.fleetRouteCompliance).toHaveProperty('rows');
    expect(batch.projectMarginWarning).toHaveProperty('rows');
    expect(batch.serviceContractProfitability).toHaveProperty('rows');
    expect(batch.customerPortalAdoption).toHaveProperty('nudgePlan');
    expect(batch.supplierPortalAdoption).toHaveProperty('onboardingOwner');
    expect(batch.accountantPortalSla).toHaveProperty('rows');
    expect(batch.dgiReadinessScore).toHaveProperty('adapterStatus', 'SANDBOX');
    expect(batch.cnssReadinessScore).toHaveProperty('damancomPreflight', 'READY');
    expect(batch.amoReconciliationInsight).toHaveProperty('employerShare');
    expect(batch.professionalTaxVault.rows[0]).toHaveProperty('declarationArchive');
    expect(batch.legalArchiveCompleteness.rows[0]).toHaveProperty('retentionPeriod');
    expect(batch.bankImportDuplicateGuard.hash).toHaveLength(64);
    expect(batch.cashboxRootCause).toHaveProperty('likelyReason');
    expect(batch.posOfflineRisk).toHaveProperty('rows');
    expect(batch.branchStockBalancing).toHaveProperty('rows');
    expect(batch.landedCostAutomation).toHaveProperty('rows');
    expect(batch.fxRevaluation).toHaveProperty('rows');
    expect(batch.recurringInvoiceMonitor).toHaveProperty('rows');
    expect(batch.usageBillingAudit).toHaveProperty('invoiceImpact');
    expect(batch.tenantHealthForecast).toHaveProperty('riskLevel');
    expect(batch.migrationReadiness.mappedEntities).toEqual(expect.arrayContaining(['clients', 'articles']));
    expect(batch.releaseImpactSimulator.rollbackChecklist).toEqual(expect.arrayContaining(['backup']));
    expect(batch.accessReviewCampaign).toHaveProperty('rows');
    expect(batch.apiKeyRotationCampaign).toHaveProperty('rows');
    expect(batch.webhookContractTesting.rows[0]).toHaveProperty('replaySample');
    expect(batch.biExportCatalog.rows[0]).toHaveProperty('dataset');
  });

  it('keeps enterprise automation readiness read-only for tenant operational records', () => {
    const before = {
      invoices: store.listInvoices().length,
      journalEntries: store.listJournalEntries().length,
      auditLogs: store.auditLogs().length,
      legalEvidences: store.listLegalEvidences().length,
    };

    store.moroccoEnterpriseAutomationReadiness();

    expect({
      invoices: store.listInvoices().length,
      journalEntries: store.listJournalEntries().length,
      auditLogs: store.auditLogs().length,
      legalEvidences: store.listLegalEvidences().length,
    }).toEqual(before);
  });
});
