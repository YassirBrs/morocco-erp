import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { LedgerService } from '../services/ledger.service';

@Controller('ledger')
export class LedgerController {
  constructor(private readonly ledgerService: LedgerService) {}
  @Get('journal') entries() { return this.ledgerService.listEntries(); }
  @Post('journal') post(@Body() body: any) { return this.ledgerService.postJournal(body); }
  @Get('periods') periods() { return this.ledgerService.listPeriods(); }
  @Get('periods/close-checklist') closeChecklist(@Query('year') year?: string, @Query('month') month?: string) {
    return this.ledgerService.closeChecklist({
      year: year ? Number(year) : undefined,
      month: month ? Number(month) : undefined,
    });
  }
  @Post('periods/lock') lock(@Body() body: { year: number; month: number }) { return this.ledgerService.lockPeriod(body); }
  @Get('audit') audit() { return this.ledgerService.auditLogs(); }
  @Get('chart-of-accounts/import-template.csv') chartOfAccountsImportTemplateCsv() { return this.ledgerService.chartOfAccountsImportTemplateCsv(); }
}
