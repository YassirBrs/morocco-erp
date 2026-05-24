import { Controller, Get, Post, Body } from '@nestjs/common';
import { CrmService } from '../services/crm.service';

@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}
  @Get('leads') list() { return this.crmService.listLeads(); }
  @Post('leads') create(@Body() body: any) { return this.crmService.createLead(body); }
  @Get('customers') customers() { return this.crmService.listCustomers(); }
  @Post('customers') createCustomer(@Body() body: any) { return this.crmService.createCustomer(body); }
}
