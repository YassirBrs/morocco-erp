import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class LedgerService {
  constructor(private readonly store: ErpStoreService) {}

  listEntries() { return this.store.listJournalEntries(); }
  accounts(query?: string) { return query ? this.store.searchChartAccounts(query) : this.store.listChartOfAccounts(); }
  createAccount(data: any) { return this.store.addChartAccount(data); }
  postJournal(data: any) { return this.store.createJournalEntry(data); }
  updateJournal(id: string, data: any) { return this.store.updateJournalEntry(id, data); }
  postManualJournal(id: string) { return this.store.postManualJournal(id); }
  voidJournal(id: string) { return this.store.voidJournalEntry(id); }
  upsertPeriod(data: { year: number; month: number; status?: any }) { return this.store.upsertFiscalPeriod(data); }
  softLockPeriod(data: { year: number; month: number }) { return this.store.softLockFiscalPeriod(data.year, data.month); }
  lockPeriod(data: { year: number; month: number }) { return this.store.lockFiscalPeriod(data.year, data.month); }
  closePeriod(data: { year: number; month: number }) { return this.store.closeFiscalPeriod(data.year, data.month); }
  closeChecklist(data: { year?: number; month?: number }) { return this.store.fiscalDocumentCompletenessCheck(data.year, data.month); }
  listPeriods() { return this.store.listFiscalPeriods(); }
  vatReport(data: { year?: number; month?: number }) { return this.store.exportVatReport(data); }
  accountingExport(data: { format?: 'CSV' | 'JSON'; year?: number; month?: number }) { return this.store.exportAccounting(data.format, data); }
  reconciliation() { return this.store.accountReconciliation(); }
  aging() { return this.store.agingReports(); }
  profitAndLoss(data: { year?: number; month?: number }) { return this.store.profitAndLossReport(data); }
  balanceSheet(data: { year?: number; month?: number }) { return this.store.balanceSheetReport(data); }
  bankImportPreview(data: { csv: string }) { return this.store.importBankStatement(data); }
  legalEvidence() { return this.store.listLegalEvidences(); }
  archiveEvidence(data: any) { return this.store.archiveLegalEvidence(data); }
  auditLogs() { return this.store.auditLogs(); }
  chartOfAccountsImportTemplateCsv() { return this.store.importTemplateCsv('chart-of-accounts'); }
}
