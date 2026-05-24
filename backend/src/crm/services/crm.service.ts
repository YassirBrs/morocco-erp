import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class CrmService {
  constructor(private readonly store: ErpStoreService) {}

  listLeads() { return this.store.listLeads(); }
  createLead(data: any) { return this.store.addLead(data); }
  updateLead(id: string, data: any) { return this.store.updateLead(id, data); }
  convertLeadToQuote(id: string, data: any) { return this.store.convertLeadToQuote(id, data); }
  exportLeadsCsv() { return this.store.exportLeadsCsv(); }
  importLeadsCsv(data: { csv?: string }) { return this.store.importLeadsCsv(data.csv ?? ''); }
  leadSourceAnalytics() { return this.store.leadSourceAnalytics(); }
  listCustomers() { return this.store.listCustomers(); }
  getCustomer(id: string) { return this.store.getCustomer(id); }
  createCustomer(data: any) { return this.store.addCustomer(data); }
  updateCustomer(id: string, data: any) { return this.store.updateCustomer(id, data); }
  archiveCustomer(id: string) { return this.store.archiveCustomer(id); }
}
