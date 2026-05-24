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
  quoteApprovalEmailPreview(id: string) { return this.store.quoteApprovalEmailPreview(id); }
  acceptQuote(id: string, data: any) { return this.store.acceptQuote(id, data); }
  exportQuotePdf(id: string) { return this.store.exportQuotePdf(id); }
  exportInvoicePdf(id: string) { return this.store.exportInvoicePdf(id); }
  exportDeliveryNotePdf(id: string) { return this.store.exportDeliveryNotePdf(id); }
  exportCreditNotePdf(id: string) { return this.store.exportCreditNotePdf(id); }
  convertQuoteToOrder(id: string) { return this.store.convertQuoteToOrder(id); }
  convertQuoteToInvoice(quoteId: string) { return this.store.convertQuoteToInvoice(quoteId); }
  dashboard(data: { year?: number; month?: number }) { return this.store.salesDashboardReport(data); }
  listOrders() { return this.store.listSalesOrders(); }
  createOrder(data: any) { return this.store.createSalesOrder(data); }
  createDeliveryNote(orderId: string) { return this.store.createDeliveryNoteFromOrder(orderId); }
  cancelDeliveryNote(id: string) { return this.store.cancelDeliveryNote(id); }
  listDeliveryNotes() { return this.store.listDeliveryNotes(); }
  deliveryRoutePlanning() { return this.store.deliveryRoutePlanning(); }
  convertOrderToInvoice(id: string) { return this.store.convertOrderToInvoice(id); }
  listInvoices() { return this.store.listInvoices(); }
  createInvoice(data: any) { return this.store.createInvoice(data); }
  invoiceEmailPreview(id: string) { return this.store.invoiceEmailPreview(id); }
  invoiceTimeline(id: string) { return this.store.entityTimeline('INVOICE', id); }
  addInvoiceNote(id: string, data: any) { return this.store.addInternalNote({ entityType: 'INVOICE', entityId: id, ...data }); }
  addInvoiceTask(id: string, data: any) { return this.store.addInternalTask({ entityType: 'INVOICE', entityId: id, ...data }); }
  listCreditNotes() { return this.store.listCreditNotes(); }
  createCreditNote(data: any) { return this.store.createCreditNote(data); }
  approveCreditNote(id: string) { return this.store.approveCreditNote(id); }
  customerStatement(customerId: string) { return this.store.customerStatement(customerId); }
  customerStatementPdf(customerId: string) { return this.store.exportCustomerStatementPdf(customerId); }
  paymentReminderSchedule() { return this.store.paymentReminderSchedule(); }
  recordPayment(data: any) { return this.store.recordPayment(data); }
}
