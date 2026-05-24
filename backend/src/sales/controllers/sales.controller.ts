import { Controller, Get, Post, Body } from '@nestjs/common';
import { SalesService } from '../services/sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}
  @Get('quotes') list() { return this.salesService.listQuotes(); }
  @Post('quotes') create(@Body() body: any) { return this.salesService.createQuote(body); }
  @Post('quotes/convert') convert(@Body() body: { quoteId: string }) { return this.salesService.convertQuoteToInvoice(body.quoteId); }
  @Get('invoices') invoices() { return this.salesService.listInvoices(); }
  @Post('invoices') createInvoice(@Body() body: any) { return this.salesService.createInvoice(body); }
  @Post('payments') payment(@Body() body: any) { return this.salesService.recordPayment(body); }
}
