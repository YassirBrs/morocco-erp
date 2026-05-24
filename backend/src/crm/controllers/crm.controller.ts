import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CrmService } from '../services/crm.service';

@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}
  @Get('leads') list() { return this.crmService.listLeads(); }
  @Get('leads/analytics') leadSourceAnalytics() { return this.crmService.leadSourceAnalytics(); }
  @Get('leads/export.csv') exportLeadsCsv() { return this.crmService.exportLeadsCsv(); }
  @Post('leads/import') importLeadsCsv(@Body() body: { csv?: string }) { return this.crmService.importLeadsCsv(body); }
  @Post('leads') create(@Body() body: any) { return this.crmService.createLead(body); }
  @Patch('leads/:id') updateLead(@Param('id') id: string, @Body() body: any) { return this.crmService.updateLead(id, body); }
  @Post('leads/:id/quote') convertLeadToQuote(@Param('id') id: string, @Body() body: any) { return this.crmService.convertLeadToQuote(id, body); }
  @Get('customers') customers() { return this.crmService.listCustomers(); }
  @Get('customers/credit-control') customerCreditControls() { return this.crmService.customerCreditControls(); }
  @Get('customers/document-reminders') customerDocumentReminders() { return this.crmService.customerDocumentReminders(); }
  @Get('customers/duplicates') customerDuplicateReview() { return this.crmService.customerDuplicateReview(); }
  @Get('customers/:id') customer(@Param('id') id: string) { return this.crmService.getCustomer(id); }
  @Post('customers') createCustomer(@Body() body: any) { return this.crmService.createCustomer(body); }
  @Patch('customers/:id') updateCustomer(@Param('id') id: string, @Body() body: any) { return this.crmService.updateCustomer(id, body); }
  @Delete('customers/:id') archiveCustomer(@Param('id') id: string) { return this.crmService.archiveCustomer(id); }
}
