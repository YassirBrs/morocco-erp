import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
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
  @Get('dashboard') dashboard(@Query('year') year?: string, @Query('month') month?: string) {
    return this.salesService.dashboard({ year: year ? Number(year) : undefined, month: month ? Number(month) : undefined });
  }
  @Get('orders') orders() { return this.salesService.listOrders(); }
  @Post('orders') createOrder(@Body() body: any) { return this.salesService.createOrder(body); }
  @Post('orders/:id/delivery-notes') createDeliveryNote(@Param('id') id: string) { return this.salesService.createDeliveryNote(id); }
  @Post('orders/:id/invoice') convertOrderToInvoice(@Param('id') id: string) { return this.salesService.convertOrderToInvoice(id); }
  @Get('delivery-notes') deliveryNotes() { return this.salesService.listDeliveryNotes(); }
  @Get('delivery-notes/:id/pdf') deliveryNotePdf(@Param('id') id: string) { return this.salesService.exportDeliveryNotePdf(id); }
  @Delete('delivery-notes/:id') cancelDeliveryNote(@Param('id') id: string) { return this.salesService.cancelDeliveryNote(id); }
  @Get('invoices') invoices() { return this.salesService.listInvoices(); }
  @Post('invoices') createInvoice(@Body() body: any) { return this.salesService.createInvoice(body); }
  @Get('invoices/:id/pdf') invoicePdf(@Param('id') id: string) { return this.salesService.exportInvoicePdf(id); }
  @Get('invoices/:id/timeline') invoiceTimeline(@Param('id') id: string) { return this.salesService.invoiceTimeline(id); }
  @Post('invoices/:id/notes') addInvoiceNote(@Param('id') id: string, @Body() body: any) { return this.salesService.addInvoiceNote(id, body); }
  @Post('invoices/:id/tasks') addInvoiceTask(@Param('id') id: string, @Body() body: any) { return this.salesService.addInvoiceTask(id, body); }
  @Get('credit-notes') creditNotes() { return this.salesService.listCreditNotes(); }
  @Post('credit-notes') createCreditNote(@Body() body: any) { return this.salesService.createCreditNote(body); }
  @Get('credit-notes/:id/pdf') creditNotePdf(@Param('id') id: string) { return this.salesService.exportCreditNotePdf(id); }
  @Post('credit-notes/:id/approve') approveCreditNote(@Param('id') id: string) { return this.salesService.approveCreditNote(id); }
  @Get('customers/:id/statement') customerStatement(@Param('id') id: string) { return this.salesService.customerStatement(id); }
  @Get('payment-reminders') paymentReminders() { return this.salesService.paymentReminderSchedule(); }
  @Post('payments') payment(@Body() body: any) { return this.salesService.recordPayment(body); }
}
