import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class CrmService {
  constructor(private readonly store: ErpStoreService) {}

  listLeads() { return this.store.listLeads(); }
  createLead(data: any) { return this.store.addLead(data); }
  listCustomers() { return this.store.listCustomers(); }
  createCustomer(data: any) { return this.store.addCustomer(data); }
}
