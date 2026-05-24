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

  completeOnboarding(data: any) {
    return this.store.completeTenantOnboarding(data);
  }

  create(data: any) {
    return this.store.createTenant(data);
  }
}
