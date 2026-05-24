import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}
  @Get() list() { return this.inventoryService.listStock(); }
  @Get('valuation-report') valuationReport() { return this.inventoryService.valuationReport(); }
  @Get('products') products() { return this.inventoryService.listProducts(); }
  @Get('products/import-template.csv') productImportTemplateCsv() { return this.inventoryService.productImportTemplateCsv(); }
  @Get('products/margin-alerts') productMarginAlerts() { return this.inventoryService.productMarginAlerts(); }
  @Get('products/duplicates') productDuplicateReview() { return this.inventoryService.productDuplicateReview(); }
  @Get('products/:id') product(@Param('id') id: string) { return this.inventoryService.getProduct(id); }
  @Post('products') createProduct(@Body() body: any) { return this.inventoryService.createProduct(body); }
  @Post('products/bulk-status') bulkProductStatus(@Body() body: any) { return this.inventoryService.bulkProductStatus(body); }
  @Patch('products/:id') updateProduct(@Param('id') id: string, @Body() body: any) { return this.inventoryService.updateProduct(id, body); }
  @Delete('products/:id') archiveProduct(@Param('id') id: string) { return this.inventoryService.archiveProduct(id); }
  @Get('suppliers') suppliers() { return this.inventoryService.listSuppliers(); }
  @Get('suppliers/import-template.csv') supplierImportTemplateCsv() { return this.inventoryService.supplierImportTemplateCsv(); }
  @Get('suppliers/export.csv') exportSuppliersCsv() { return this.inventoryService.exportSuppliersCsv(); }
  @Post('suppliers/import') importSuppliersCsv(@Body() body: { csv?: string }) { return this.inventoryService.importSuppliersCsv(body); }
  @Get('suppliers/risk-reminders') supplierRiskReminders(@Query('filter') filter?: string) { return this.inventoryService.supplierRiskReminders(filter); }
  @Get('suppliers/payment-calendar') supplierPaymentCalendar() { return this.inventoryService.supplierPaymentCalendar(); }
  @Get('suppliers/reliability-scores') supplierReliabilityScores() { return this.inventoryService.supplierReliabilityScores(); }
  @Get('supplier-contracts') supplierContracts() { return this.inventoryService.listSupplierContracts(); }
  @Post('supplier-contracts') createSupplierContract(@Body() body: any) { return this.inventoryService.createSupplierContract(body); }
  @Get('suppliers/:id/statement') supplierStatement(@Param('id') id: string) { return this.inventoryService.supplierStatement(id); }
  @Post('suppliers/bulk-status') bulkSupplierStatus(@Body() body: any) { return this.inventoryService.bulkSupplierStatus(body); }
  @Post('suppliers/:id/document-placeholders') addSupplierDocumentPlaceholder(@Param('id') id: string, @Body() body: any) {
    return this.inventoryService.addSupplierDocumentPlaceholder(id, body);
  }
  @Get('suppliers/:id/timeline') supplierTimeline(@Param('id') id: string) { return this.inventoryService.supplierTimeline(id); }
  @Post('suppliers/:id/notes') addSupplierNote(@Param('id') id: string, @Body() body: any) { return this.inventoryService.addSupplierNote(id, body); }
  @Post('suppliers/:id/tasks') addSupplierTask(@Param('id') id: string, @Body() body: any) { return this.inventoryService.addSupplierTask(id, body); }
  @Get('suppliers/:id') supplier(@Param('id') id: string) { return this.inventoryService.getSupplier(id); }
  @Post('suppliers') createSupplier(@Body() body: any) { return this.inventoryService.createSupplier(body); }
  @Patch('suppliers/:id') updateSupplier(@Param('id') id: string, @Body() body: any) { return this.inventoryService.updateSupplier(id, body); }
  @Delete('suppliers/:id') archiveSupplier(@Param('id') id: string) { return this.inventoryService.archiveSupplier(id); }
  @Get('warehouses') warehouses() { return this.inventoryService.listWarehouses(); }
  @Post('warehouses') createWarehouse(@Body() body: any) { return this.inventoryService.createWarehouse(body); }
  @Patch('warehouses/:id') updateWarehouse(@Param('id') id: string, @Body() body: any) { return this.inventoryService.updateWarehouse(id, body); }
  @Get('warehouse-stock') warehouseStock() { return this.inventoryService.warehouseStock(); }
  @Get('barcode/:code') barcodeLookup(@Param('code') code: string) { return this.inventoryService.barcodeLookup(code); }
  @Get('stock-alerts') stockAlerts() { return this.inventoryService.stockAlerts(); }
  @Get('reservations') reservationVisibility() { return this.inventoryService.reservationVisibility(); }
  @Post('landed-cost-allocation') landedCostAllocation(@Body() body: any) { return this.inventoryService.landedCostAllocation(body); }
  @Get('traceability') traceabilityLots() { return this.inventoryService.listTraceabilityLots(); }
  @Post('traceability') createTraceabilityLot(@Body() body: any) { return this.inventoryService.createTraceabilityLot(body); }
  @Get('expiry-alerts') expiryAlerts() { return this.inventoryService.stockExpiryAlerts(); }
  @Get('movement-audit') movementAudit() { return this.inventoryService.movementAudit(); }
  @Get('product-lifecycle-board') lifecycleBoard() { return this.inventoryService.lifecycleBoard(); }
  @Post('products/:id/lifecycle') setProductLifecycleState(@Param('id') id: string, @Body() body: any) {
    return this.inventoryService.setProductLifecycleState(id, body);
  }
  @Get('quarantines') stockQuarantines() { return this.inventoryService.listStockQuarantines(); }
  @Post('quarantines') createStockQuarantine(@Body() body: any) { return this.inventoryService.createStockQuarantine(body); }
  @Post('quarantines/:id/release') releaseStockQuarantine(@Param('id') id: string) { return this.inventoryService.releaseStockQuarantine(id); }
  @Post('reservations/release-expired') releaseExpiredReservations(@Body() body: any) { return this.inventoryService.releaseExpiredReservations(body); }
  @Post('adjustments') adjust(@Body() body: { productId: string; quantity: number; reason?: string }) {
    return this.inventoryService.adjustStock(body.productId, body.quantity, body.reason);
  }
  @Post('stock-moves/:id/approve') approveStockMove(@Param('id') id: string) { return this.inventoryService.approveStockMove(id); }
  @Get('purchase-requests') purchaseRequests() { return this.inventoryService.listPurchaseRequests(); }
  @Post('purchase-requests') createPurchaseRequest(@Body() body: any) { return this.inventoryService.createPurchaseRequest(body); }
  @Post('purchase-requests/:id/approve') approvePurchaseRequest(@Param('id') id: string) { return this.inventoryService.approvePurchaseRequest(id); }
  @Post('purchase-requests/:id/convert-to-order') convertPurchaseRequest(@Param('id') id: string, @Body() body: any) { return this.inventoryService.convertPurchaseRequestToOrder(id, body); }
  @Post('supplier-quotes') addSupplierQuote(@Body() body: any) { return this.inventoryService.addSupplierQuoteComparison(body); }
  @Get('purchase-requests/:id/supplier-quotes') supplierQuoteMatrix(@Param('id') id: string) { return this.inventoryService.supplierQuoteMatrix(id); }
  @Get('recurring-purchases') recurringPurchases() { return this.inventoryService.listRecurringPurchaseSchedules(); }
  @Post('recurring-purchases') createRecurringPurchase(@Body() body: any) { return this.inventoryService.createRecurringPurchaseSchedule(body); }
  @Post('recurring-purchases/:id/run') runRecurringPurchase(@Param('id') id: string) { return this.inventoryService.runRecurringPurchaseSchedule(id); }
  @Get('purchase-orders') purchaseOrders() { return this.inventoryService.listPurchaseOrders(); }
  @Post('purchase-orders') createPurchaseOrder(@Body() body: any) { return this.inventoryService.createPurchaseOrder(body); }
  @Get('purchase-orders/:id/pdf') purchaseOrderPdf(@Param('id') id: string) { return this.inventoryService.purchaseOrderPdf(id); }
  @Post('purchase-orders/:id/approve') approvePurchaseOrder(@Param('id') id: string) { return this.inventoryService.approvePurchaseOrder(id); }
  @Post('purchase-orders/:id/cancel') cancelPurchaseOrder(@Param('id') id: string) { return this.inventoryService.cancelPurchaseOrder(id); }
  @Get('purchase-receipts') purchaseReceipts() { return this.inventoryService.listPurchaseReceipts(); }
  @Post('purchase-receipts') purchaseReceipt(@Body() body: any) { return this.inventoryService.receivePurchase(body); }
  @Get('purchase-receipts/:id/pdf') purchaseReceiptPdf(@Param('id') id: string) { return this.inventoryService.purchaseReceiptPdf(id); }
  @Post('purchase-receipts/:id/approve') approvePurchaseReceipt(@Param('id') id: string) { return this.inventoryService.approvePurchaseReceipt(id); }
  @Get('supplier-invoices') supplierInvoices() { return this.inventoryService.listSupplierInvoices(); }
  @Post('supplier-invoices') createSupplierInvoice(@Body() body: any) { return this.inventoryService.createSupplierInvoice(body); }
  @Get('stock-transfers') stockTransfers() { return this.inventoryService.listStockTransfers(); }
  @Post('stock-transfers') transferStock(@Body() body: any) { return this.inventoryService.transferStock(body); }
  @Post('stock-transfers/:id/receive') receiveTransfer(@Param('id') id: string) { return this.inventoryService.receiveTransfer(id); }
  @Get('inventory-counts') inventoryCounts() { return this.inventoryService.listInventoryCounts(); }
  @Post('inventory-counts') createInventoryCount(@Body() body: any) { return this.inventoryService.createInventoryCount(body); }
  @Post('inventory-counts/:id/approve') approveInventoryCount(@Param('id') id: string) { return this.inventoryService.approveInventoryCount(id); }
}
