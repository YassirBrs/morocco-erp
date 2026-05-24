import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { ErpStoreService } from './erp-store.service';

describe('ErpStoreService working ERP workflows', () => {
  let store: ErpStoreService;
  const cls = { get: jest.fn(() => 'tenant-demo') } as unknown as ClsService;

  beforeEach(() => {
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
    expect(store.listJournalEntries().some((entry) => entry.description.includes('Payment'))).toBe(true);
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
    expect(store.listJournalEntries()[0].description).toContain('POS ticket');
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
});
