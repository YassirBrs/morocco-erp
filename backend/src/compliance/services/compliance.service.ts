import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class ComplianceService {
  constructor(private readonly store: ErpStoreService) {}

  getMoroccoRuleSet() {
    return this.store.morocco2026Rules;
  }

  exportVatReport() {
    return this.store.exportVatReport();
  }

  vatDeclarationReviewChecklist() {
    return this.store.vatDeclarationReviewChecklist();
  }

  prepareDgiInvoiceEnvelope(invoiceId: string) {
    return this.store.prepareDgiInvoiceEnvelope(invoiceId);
  }
}
