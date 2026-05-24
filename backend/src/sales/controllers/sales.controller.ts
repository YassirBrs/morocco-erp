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
  @Get('quotes/:id/approval-email-preview') quoteApprovalEmail(@Param('id') id: string) { return this.salesService.quoteApprovalEmailPreview(id); }
  @Post('quotes/:id/accept') acceptQuote(@Param('id') id: string, @Body() body: any) { return this.salesService.acceptQuote(id, body); }
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
  @Get('delivery-route-plan') deliveryRoutePlan() { return this.salesService.deliveryRoutePlanning(); }
  @Get('delivery-invoice-exceptions') deliveryInvoiceExceptions() { return this.salesService.deliveryInvoiceExceptions(); }
  @Get('delivery-instructions') deliveryInstructions() { return this.salesService.customerDeliveryInstructions(); }
  @Post('delivery-instructions') upsertDeliveryInstruction(@Body() body: any) { return this.salesService.upsertCustomerDeliveryInstruction(body); }
  @Get('transporters') transporters() { return this.salesService.transporterRegistry(); }
  @Post('transporters') createTransporter(@Body() body: any) { return this.salesService.createTransporter(body); }
  @Get('delivery-proofs') deliveryProofs() { return this.salesService.listDeliveryProofs(); }
  @Post('delivery-proofs') captureDeliveryProof(@Body() body: any) { return this.salesService.captureDeliveryProof(body); }
  @Get('delivery-notes/:id/pdf') deliveryNotePdf(@Param('id') id: string) { return this.salesService.exportDeliveryNotePdf(id); }
  @Delete('delivery-notes/:id') cancelDeliveryNote(@Param('id') id: string) { return this.salesService.cancelDeliveryNote(id); }
  @Get('invoices') invoices() { return this.salesService.listInvoices(); }
  @Post('invoices') createInvoice(@Body() body: any) { return this.salesService.createInvoice(body); }
  @Get('invoices/:id/email-preview') invoiceEmail(@Param('id') id: string) { return this.salesService.invoiceEmailPreview(id); }
  @Get('invoices/:id/arabic-rendering-qa') invoiceArabicQa(@Param('id') id: string) { return this.salesService.invoiceArabicRenderingQa(id); }
  @Get('invoices/:id/pdf') invoicePdf(@Param('id') id: string) { return this.salesService.exportInvoicePdf(id); }
  @Get('invoices/:id/timeline') invoiceTimeline(@Param('id') id: string) { return this.salesService.invoiceTimeline(id); }
  @Post('invoices/:id/notes') addInvoiceNote(@Param('id') id: string, @Body() body: any) { return this.salesService.addInvoiceNote(id, body); }
  @Post('invoices/:id/tasks') addInvoiceTask(@Param('id') id: string, @Body() body: any) { return this.salesService.addInvoiceTask(id, body); }
  @Get('credit-notes') creditNotes() { return this.salesService.listCreditNotes(); }
  @Post('credit-notes') createCreditNote(@Body() body: any) { return this.salesService.createCreditNote(body); }
  @Get('credit-notes/:id/pdf') creditNotePdf(@Param('id') id: string) { return this.salesService.exportCreditNotePdf(id); }
  @Post('credit-notes/:id/approve') approveCreditNote(@Param('id') id: string) { return this.salesService.approveCreditNote(id); }
  @Get('customers/:id/statement') customerStatement(@Param('id') id: string) { return this.salesService.customerStatement(id); }
  @Get('customers/:id/statement.pdf') customerStatementPdf(@Param('id') id: string) { return this.salesService.customerStatementPdf(id); }
  @Get('customers/:id/statement-bilingual.pdf') bilingualCustomerStatementPdf(@Param('id') id: string) { return this.salesService.bilingualCustomerStatementPdf(id); }
  @Get('commission-report') salesCommissionReport(@Query('period') period?: string) { return this.salesService.salesCommissionReport({ period }); }
  @Get('customer-contracts') customerContracts() { return this.salesService.listCustomerContracts(); }
  @Post('customer-contracts') createCustomerContract(@Body() body: any) { return this.salesService.createCustomerContract(body); }
  @Get('pricing-rules') pricingRules() { return this.salesService.listPricingRules(); }
  @Post('pricing-rules') createPricingRule(@Body() body: any) { return this.salesService.createPricingRule(body); }
  @Post('pricing-rules/preview') pricingPreview(@Body() body: any) { return this.salesService.pricingPreview(body); }
  @Get('discount-approvals') discountApprovals() { return this.salesService.listDiscountApprovals(); }
  @Post('discount-approvals') requestDiscountApproval(@Body() body: any) { return this.salesService.requestDiscountApproval(body); }
  @Post('discount-approvals/:id/approve') approveDiscountApproval(@Param('id') id: string) { return this.salesService.approveDiscountApproval(id); }
  @Get('recurring-invoices') recurringInvoices() { return this.salesService.listRecurringInvoiceBatches(); }
  @Post('recurring-invoices/generate') generateRecurringInvoice(@Body() body: any) { return this.salesService.generateRecurringInvoiceBatch(body); }
  @Get('service-contracts') serviceContracts() { return this.salesService.listServiceContracts(); }
  @Post('service-contracts') createServiceContract(@Body() body: any) { return this.salesService.createServiceContract(body); }
  @Post('service-contracts/draft-invoices') serviceContractDraftInvoices(@Body() body: any) { return this.salesService.generateServiceContractDraftInvoices(body); }
  @Get('service-contracts/renewal-reminders') serviceContractRenewals() { return this.salesService.serviceContractRenewalReminders(); }
  @Get('warranty-cases') warrantyCases() { return this.salesService.listWarrantyServiceCases(); }
  @Post('warranty-cases') createWarrantyCase(@Body() body: any) { return this.salesService.createWarrantyServiceCase(body); }
  @Get('payment-reminders') paymentReminders() { return this.salesService.paymentReminderSchedule(); }
  @Post('payments') payment(@Body() body: any) { return this.salesService.recordPayment(body); }
}
