import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class ComplianceService {
  constructor(private readonly store: ErpStoreService) {}

  getMoroccoRuleSet() {
    return this.store.morocco2026Rules;
  }

  listRulePacks() {
    return this.store.listComplianceRulePacks();
  }

  exportVatReport(options: { year?: number; month?: number } = {}) {
    return this.store.exportVatReport(options);
  }

  vatDeclarationReviewChecklist() {
    return this.store.vatDeclarationReviewChecklist();
  }

  prepareDgiInvoiceEnvelope(invoiceId: string) {
    return this.store.prepareDgiInvoiceEnvelope(invoiceId);
  }
}
