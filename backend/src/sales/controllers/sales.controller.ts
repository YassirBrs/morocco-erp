import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SalesService } from '../services/sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}
  @Get('quotes') list() { return this.salesService.listQuotes(); }
  @Get('quotes/:id') quote(@Param('id') id: string) { return this.salesService.getQuote(id); }
  @Post('quotes') create(@Body() body: any) { return this.salesService.createQuote(body); }
  @Patch('quotes/:id') revise(@Param('id') id: string, @Body() body: any) { return this.salesService.reviseQuote(id, body); }
  @Post('quotes/:id/approve') approve(@Param('id') id: string) { return this.salesService.approveQuote(id); }
  @Get('quotes/:id/pdf') quotePdf(@Param('id') id: string) { return this.salesService.exportQuotePdf(id); }
  @Post('quotes/:id/convert-to-order') convertQuoteToOrder(@Param('id') id: string) { return this.salesService.convertQuoteToOrder(id); }
  @Post('quotes/convert') convert(@Body() body: { quoteId: string }) { return this.salesService.convertQuoteToInvoice(body.quoteId); }
  @Get('orders') orders() { return this.salesService.listOrders(); }
  @Post('orders') createOrder(@Body() body: any) { return this.salesService.createOrder(body); }
  @Post('orders/:id/delivery-notes') createDeliveryNote(@Param('id') id: string) { return this.salesService.createDeliveryNote(id); }
  @Post('orders/:id/invoice') convertOrderToInvoice(@Param('id') id: string) { return this.salesService.convertOrderToInvoice(id); }
  @Get('delivery-notes') deliveryNotes() { return this.salesService.listDeliveryNotes(); }
  @Delete('delivery-notes/:id') cancelDeliveryNote(@Param('id') id: string) { return this.salesService.cancelDeliveryNote(id); }
  @Get('invoices') invoices() { return this.salesService.listInvoices(); }
  @Post('invoices') createInvoice(@Body() body: any) { return this.salesService.createInvoice(body); }
  @Post('payments') payment(@Body() body: any) { return this.salesService.recordPayment(body); }
}
