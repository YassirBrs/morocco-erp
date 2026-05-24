import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class BillingService {
  constructor(private readonly store: ErpStoreService) {}

  listInvoices() { return this.store.listInvoices(); }
  createInvoice(data: any) { return this.store.createInvoice(data); }
  recordPayment(data: any) { return this.store.recordPayment(data); }
  vatReport() { return this.store.exportVatReport(); }
}
