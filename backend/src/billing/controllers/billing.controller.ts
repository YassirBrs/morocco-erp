import { Controller, Get, Post, Body } from '@nestjs/common';
import { BillingService } from '../services/billing.service';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}
  @Get() list() { return this.billingService.listInvoices(); }
  @Post() create(@Body() body: any) { return this.billingService.createInvoice(body); }
  @Post('payments') payment(@Body() body: any) { return this.billingService.recordPayment(body); }
  @Get('vat-report') vatReport() { return this.billingService.vatReport(); }
}
