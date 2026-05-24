import { expect, type Page } from '@playwright/test';
import { BasePage, latest } from './base-page';

const selectors = {
  salesNavigation: '[data-view="sales"]',
  customerName: '#customerForm [name="name"]',
  customerArabicName: '#customerForm [name="arabicName"]',
  customerIce: '#customerForm [name="ice"]',
  customerIf: '#customerForm [name="ifNumber"]',
  customerEmail: '#customerForm [name="email"]',
  customerPhone: '#customerForm [name="phone"]',
  customerPaymentTerms: '#customerForm [name="paymentTermsDays"]',
  customerCreditLimit: '#customerForm [name="creditLimit"]',
  customerSubmit: '#customerForm button[type="submit"]',
  customerRows: '#customerRows',
  createQuote: '#createQuote',
  approveQuote: '#approveQuote',
  convertQuoteToOrder: '#convertQuoteToOrder',
  createDelivery: '#createDelivery',
  invoiceOrder: '#invoiceOrder',
  payInvoicePartial: '#payInvoicePartial',
  salesFlowState: '#salesFlowState',
  invoiceResult: '#invoiceResult',
};

type Customer = { id: string; name: string; ice: string };
type Quote = { id: string; number: string; status: string; customerId: string; totals: { total: number } };
type SalesOrder = { id: string; number: string; status: string; customerId: string; totals: { total: number } };
type DeliveryNote = { id: string; number: string; status: string; sourceOrderId: string };
export type Invoice = {
  id: string;
  number: string;
  status: string;
  customerId: string;
  paidAmount: number;
  lines: Array<{ productId: string; quantity: number; vatRate: number }>;
  totals: { subtotal: number; vatTotal: number; total: number; vatByRate: Record<string, number> };
};

export class CrmSalesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openSalesWorkspace() {
    await this.click(selectors.salesNavigation);
    await expect(this.locator(selectors.customerRows)).toBeVisible();
  }

  async createCustomerWithMoroccanIce(data: {
    name: string;
    arabicName: string;
    ice: string;
    ifNumber: string;
    email: string;
    phone: string;
    creditLimit: string;
  }): Promise<Customer> {
    await this.fill(selectors.customerName, data.name);
    await this.fill(selectors.customerArabicName, data.arabicName);
    await this.fill(selectors.customerIce, data.ice);
    await this.fill(selectors.customerIf, data.ifNumber);
    await this.fill(selectors.customerEmail, data.email);
    await this.fill(selectors.customerPhone, data.phone);
    await this.fill(selectors.customerPaymentTerms, '30');
    await this.fill(selectors.customerCreditLimit, data.creditLimit);
    await this.click(selectors.customerSubmit);
    await this.waitForSuccessMessage(`Client ${data.name} ajouté.`);
    await expect(this.locator(selectors.customerRows)).toContainText(data.ice);
    const customers = await this.apiGet<Customer[]>('/crm/customers');
    const customer = customers.find((candidate) => candidate.ice === data.ice);
    expect(customer).toBeTruthy();
    return customer!;
  }

  async createApproveConvertDeliverAndInvoice(customer: Customer): Promise<{ order: SalesOrder; deliveryNote: DeliveryNote; invoice: Invoice }> {
    await this.click(selectors.createQuote);
    await this.waitForSuccessMessage(/Devis .* créé/);
    let quote = latest(await this.apiGet<Quote[]>('/sales/quotes'));
    expect(quote.customerId).toBe(customer.id);
    expect(quote.status).toBe('DRAFT');

    await this.click(selectors.approveQuote);
    await this.waitForSuccessMessage(/Devis .* approuvé/);
    quote = latest(await this.apiGet<Quote[]>('/sales/quotes'));
    expect(quote.status).toBe('APPROVED');

    await this.click(selectors.convertQuoteToOrder);
    await this.waitForSuccessMessage(/Commande .* créée avec réservation stock/);
    const order = latest(await this.apiGet<SalesOrder[]>('/sales/orders'));
    expect(order.customerId).toBe(customer.id);
    expect(order.status).toBe('CONFIRMED');
    await this.expectStockReservationForOrder(order.number);

    await this.click(selectors.createDelivery);
    await this.waitForSuccessMessage(/Bon de livraison .* comptabilisé/);
    const deliveryNote = latest(await this.apiGet<DeliveryNote[]>('/sales/delivery-notes'));
    expect(deliveryNote.sourceOrderId).toBe(order.id);
    expect(deliveryNote.status).toBe('POSTED');

    await this.click(selectors.invoiceOrder);
    await this.waitForSuccessMessage(/Facture .* créée depuis commande/);
    const invoice = latest(await this.apiGet<Invoice[]>('/sales/invoices'));
    expect(invoice.customerId).toBe(customer.id);
    expect(invoice.status).toBe('POSTED');
    await expect(this.locator(selectors.salesFlowState)).toContainText(invoice.number);
    await expect(this.locator(selectors.invoiceResult)).toContainText(invoice.number);

    return { order, deliveryNote, invoice };
  }

  async recordPartialBankTransfer(invoice: Invoice): Promise<Invoice> {
    await this.click(selectors.payInvoicePartial);
    await this.waitForSuccessMessage(/Acompte bancaire de .* enregistré/);
    const invoices = await this.apiGet<Invoice[]>('/sales/invoices');
    const updated = invoices.find((candidate) => candidate.id === invoice.id);
    expect(updated).toBeTruthy();
    expect(updated!.paidAmount).toBeGreaterThan(0);
    expect(updated!.paidAmount).toBeLessThan(updated!.totals.total);
    return updated!;
  }

  private async expectStockReservationForOrder(orderNumber: string) {
    const reservations = await this.apiGet<{
      rows: Array<{ sourceNumber: string; quantity: number; status: string }>;
      totals: Array<{ sku: string; reservedStock: number }>;
    }>('/inventory/reservations');
    expect(reservations.rows.some((row) => row.sourceNumber === orderNumber && row.quantity > 0 && row.status === 'CONFIRMED')).toBeTruthy();
    expect(reservations.totals.some((row) => row.sku === 'SKU-CHAIR' && row.reservedStock > 0)).toBeTruthy();
  }
}
