import { Controller, Get, Patch, Post, Body, Param, Query } from '@nestjs/common';
import { LedgerService } from '../services/ledger.service';

@Controller('ledger')
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}
  @Get('accounts') accounts(@Query('q') q?: string) { return this.ledgerService.accounts(q); }
  @Post('accounts') createAccount(@Body() body: any) { return this.ledgerService.createAccount(body); }
  @Get('journal') entries() { return this.ledgerService.listEntries(); }
  @Post('journal') post(@Body() body: any) { return this.ledgerService.postJournal(body); }
  @Patch('journal/:id') updateJournal(@Param('id') id: string, @Body() body: any) { return this.ledgerService.updateJournal(id, body); }
  @Post('journal/:id/post') postManualJournal(@Param('id') id: string) { return this.ledgerService.postManualJournal(id); }
  @Post('journal/:id/void') voidJournal(@Param('id') id: string) { return this.ledgerService.voidJournal(id); }
  @Get('periods') periods() { return this.ledgerService.listPeriods(); }
  @Post('periods') upsertPeriod(@Body() body: { year: number; month: number; status?: any }) { return this.ledgerService.upsertPeriod(body); }
  @Get('periods/close-checklist') closeChecklist(@Query('year') year?: string, @Query('month') month?: string) {
    return this.ledgerService.closeChecklist({
      year: year ? Number(year) : undefined,
      month: month ? Number(month) : undefined,
    });
  }
  @Post('periods/soft-lock') softLock(@Body() body: { year: number; month: number }) { return this.ledgerService.softLockPeriod(body); }
  @Post('periods/lock') lock(@Body() body: { year: number; month: number }) { return this.ledgerService.lockPeriod(body); }
  @Post('periods/close') close(@Body() body: { year: number; month: number }) { return this.ledgerService.closePeriod(body); }
  @Get('vat-report') vatReport(@Query('year') year?: string, @Query('month') month?: string) {
    return this.ledgerService.vatReport({ year: year ? Number(year) : undefined, month: month ? Number(month) : undefined });
  }
  @Get('vat-exceptions') vatExceptions() { return this.ledgerService.vatExceptionDrilldown(); }
  @Get('export') accountingExport(@Query('format') format?: 'CSV' | 'JSON', @Query('year') year?: string, @Query('month') month?: string) {
    return this.ledgerService.accountingExport({ format, year: year ? Number(year) : undefined, month: month ? Number(month) : undefined });
  }
  @Get('reconciliation') reconciliation() { return this.ledgerService.reconciliation(); }
  @Get('anomaly-checks') anomalyChecks() { return this.ledgerService.anomalyChecks(); }
  @Get('accountant-review-queue') accountantReviewQueue() { return this.ledgerService.accountantReviewQueue(); }
  @Get('numbering-audit') numberingAudit() { return this.ledgerService.numberingAudit(); }
  @Get('aging') aging() { return this.ledgerService.aging(); }
  @Get('profit-and-loss') profitAndLoss(@Query('year') year?: string, @Query('month') month?: string) {
    return this.ledgerService.profitAndLoss({ year: year ? Number(year) : undefined, month: month ? Number(month) : undefined });
  }
  @Get('balance-sheet') balanceSheet(@Query('year') year?: string, @Query('month') month?: string) {
    return this.ledgerService.balanceSheet({ year: year ? Number(year) : undefined, month: month ? Number(month) : undefined });
  }
  @Post('bank-import/preview') bankImportPreview(@Body() body: { csv: string }) { return this.ledgerService.bankImportPreview(body); }
  @Post('bank-matching/suggestions') bankMatchingSuggestions(@Body() body: any) { return this.ledgerService.bankStatementMatchingSuggestions(body); }
  @Get('payments/reconciliation-by-method') paymentMethodReconciliation() { return this.ledgerService.paymentMethodReconciliation(); }
  @Post('payments/allocation-rules') upsertPaymentAllocationRule(@Body() body: any) { return this.ledgerService.upsertPaymentAllocationRule(body); }
  @Post('payments/allocation-preview') paymentAllocationPreview(@Body() body: any) { return this.ledgerService.paymentAllocationPreview(body); }
  @Get('payments/adjustment-suggestions') paymentAdjustmentSuggestions() { return this.ledgerService.paymentAdjustmentSuggestions(); }
  @Post('payments/adjustment-suggestions') suggestPaymentAdjustment(@Body() body: any) { return this.ledgerService.suggestPaymentAdjustment(body); }
  @Get('cheques') cheques() { return this.ledgerService.listCheques(); }
  @Post('cheques') createCheque(@Body() body: any) { return this.ledgerService.createCheque(body); }
  @Get('cheques/lifecycle-audit') chequeLifecycleAudit() { return this.ledgerService.chequeLifecycleAudit(); }
  @Get('deposit-batches') depositBatches() { return this.ledgerService.listDepositBatches(); }
  @Post('deposit-batches') createDepositBatch(@Body() body: any) { return this.ledgerService.createDepositBatch(body); }
  @Get('evidence') legalEvidence() { return this.ledgerService.legalEvidence(); }
  @Post('evidence') archiveEvidence(@Body() body: any) { return this.ledgerService.archiveEvidence(body); }
  @Get('audit') audit() { return this.ledgerService.auditLogs(); }
  @Get('chart-of-accounts/import-template.csv') chartOfAccountsImportTemplateCsv() { return this.ledgerService.chartOfAccountsImportTemplateCsv(); }
  @Get('attachment-requirements') attachmentRequirements() { return this.ledgerService.attachmentRequirements(); }
  @Post('attachment-requirements') createAttachmentRequirement(@Body() body: any) { return this.ledgerService.createAttachmentRequirement(body); }
  @Get('pre-closing-accruals') preClosingAccruals() { return this.ledgerService.preClosingAccrualSuggestions(); }
  @Get('tax-calendar') taxCalendar() { return this.ledgerService.taxCalendar(); }
  @Get('compliance-owner-reminders') complianceOwnerReminders() { return this.ledgerService.complianceOwnerReminders(); }
  @Post('compliance-owner-reminders') assignComplianceOwner(@Body() body: any) { return this.ledgerService.assignComplianceOwner(body); }
  @Get('expense-claims') expenseClaims() { return this.ledgerService.listExpenseClaims(); }
  @Post('expense-claims') createExpenseClaim(@Body() body: any) { return this.ledgerService.createExpenseClaim(body); }
  @Post('expense-claims/:id/approve') approveExpenseClaim(@Param('id') id: string) { return this.ledgerService.approveExpenseClaim(id); }
  @Post('expense-claims/export') exportExpenseClaims() { return this.ledgerService.exportExpenseClaims(); }
  @Get('petty-cash') pettyCashJournals() { return this.ledgerService.listPettyCashJournals(); }
  @Post('petty-cash') openPettyCashJournal(@Body() body: any) { return this.ledgerService.openPettyCashJournal(body); }
  @Post('petty-cash/:id/movements') addPettyCashMovement(@Param('id') id: string, @Body() body: any) { return this.ledgerService.addPettyCashMovement(id, body); }
  @Post('petty-cash/:id/close') closePettyCashJournal(@Param('id') id: string, @Body() body: any) { return this.ledgerService.closePettyCashJournal(id, body); }
}
