import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { ErpStoreService } from './erp-store.service';

describe('ErpStoreService working ERP workflows', () => {
  let store: ErpStoreService;
  const cls = { get: jest.fn(() => 'tenant-demo') } as unknown as ClsService;

  beforeEach(() => {
    (cls.get as jest.Mock).mockImplementation((key?: string) => key === 'userRole' ? 'OWNER' : 'tenant-demo');
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
});
