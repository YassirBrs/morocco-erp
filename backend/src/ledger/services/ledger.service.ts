import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class LedgerService {
  constructor(private readonly store: ErpStoreService) {}

  listEntries() { return this.store.listJournalEntries(); }
  postJournal(data: any) { return { accepted: false, reason: 'Manual journals are disabled in V1', requested: data }; }
  lockPeriod(data: { year: number; month: number }) { return this.store.lockFiscalPeriod(data.year, data.month); }
  closeChecklist(data: { year?: number; month?: number }) { return this.store.fiscalDocumentCompletenessCheck(data.year, data.month); }
  listPeriods() { return this.store.listFiscalPeriods(); }
  auditLogs() { return this.store.auditLogs(); }
  chartOfAccountsImportTemplateCsv() { return this.store.importTemplateCsv('chart-of-accounts'); }
}
