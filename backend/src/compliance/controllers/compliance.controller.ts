import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ComplianceService } from '../services/compliance.service';

@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('morocco/rules')
  rules() {
    return this.complianceService.getMoroccoRuleSet();
  }

  @Get('rule-packs')
  rulePacks() {
    return this.complianceService.listRulePacks();
  }

  @Get('vat-report')
  vatReport(@Query('year') year?: string, @Query('month') month?: string) {
    return this.complianceService.exportVatReport({
      year: year ? Number(year) : undefined,
      month: month ? Number(month) : undefined,
    });
  }

  @Get('vat-declaration-checklist')
  vatDeclarationChecklist() {
    return this.complianceService.vatDeclarationReviewChecklist();
  }

  @Post('dgi/invoice-envelope')
  dgiEnvelope(@Body() body: { invoiceId: string }) {
    return this.complianceService.prepareDgiInvoiceEnvelope(body.invoiceId);
  }
}
