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
});
