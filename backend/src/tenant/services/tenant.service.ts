import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class TenantService {
  constructor(private readonly store: ErpStoreService) {}

  findAll() {
    return this.store.listTenants();
  }

  current() {
    return this.store.summary();
  }

  setupChecklist() {
    return this.store.setupChecklist();
  }

  dashboardFilters() {
    return this.store.dashboardFilters();
  }

  profile() {
    return this.store.companyProfile();
  }

  updateProfile(data: any) {
    return this.store.updateCompanyProfile(data);
  }

  approveProfile(reviewer?: string) {
    return this.store.approveCompanyProfile(reviewer);
  }

  resetDemo(environment?: string) {
    return this.store.resetDemoData(environment);
  }

  completeOnboarding(data: any) {
    return this.store.completeTenantOnboarding(data);
  }

  create(data: any) {
    return this.store.createTenant(data);
  }
}
