import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class SalesService {
  constructor(private readonly store: ErpStoreService) {}

  listQuotes() { return this.store.listQuotes(); }
  createQuote(data: any) { return this.store.createQuote(data); }
  convertQuoteToInvoice(quoteId: string) { return this.store.convertQuoteToInvoice(quoteId); }
  listInvoices() { return this.store.listInvoices(); }
  createInvoice(data: any) { return this.store.createInvoice(data); }
  recordPayment(data: any) { return this.store.recordPayment(data); }
}
