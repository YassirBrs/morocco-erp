import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class SalesService {
  constructor(private readonly store: ErpStoreService) {}

  listQuotes() { return this.store.listQuotes(); }
  createQuote(data: any) { return this.store.createQuote(data); }
  getQuote(id: string) { return this.store.getQuote(id); }
  reviseQuote(id: string, data: any) { return this.store.reviseQuote(id, data); }
  approveQuote(id: string) { return this.store.approveQuote(id); }
  exportQuotePdf(id: string) { return this.store.exportQuotePdf(id); }
  convertQuoteToOrder(id: string) { return this.store.convertQuoteToOrder(id); }
  convertQuoteToInvoice(quoteId: string) { return this.store.convertQuoteToInvoice(quoteId); }
  listOrders() { return this.store.listSalesOrders(); }
  createOrder(data: any) { return this.store.createSalesOrder(data); }
  createDeliveryNote(orderId: string) { return this.store.createDeliveryNoteFromOrder(orderId); }
  cancelDeliveryNote(id: string) { return this.store.cancelDeliveryNote(id); }
  listDeliveryNotes() { return this.store.listDeliveryNotes(); }
  convertOrderToInvoice(id: string) { return this.store.convertOrderToInvoice(id); }
  listInvoices() { return this.store.listInvoices(); }
  createInvoice(data: any) { return this.store.createInvoice(data); }
  listCreditNotes() { return this.store.listCreditNotes(); }
  createCreditNote(data: any) { return this.store.createCreditNote(data); }
  approveCreditNote(id: string) { return this.store.approveCreditNote(id); }
  customerStatement(customerId: string) { return this.store.customerStatement(customerId); }
  recordPayment(data: any) { return this.store.recordPayment(data); }
}
