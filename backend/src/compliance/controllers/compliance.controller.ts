import { Body, Controller, Get, Post } from '@nestjs/common';
import { ComplianceService } from '../services/compliance.service';

@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('morocco/rules')
  rules() {
    return this.complianceService.getMoroccoRuleSet();
  }

  @Get('vat-report')
  vatReport() {
    return this.complianceService.exportVatReport();
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
