import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}
  @Get() list() { return this.inventoryService.listStock(); }
  @Get('products') products() { return this.inventoryService.listProducts(); }
  @Get('products/margin-alerts') productMarginAlerts() { return this.inventoryService.productMarginAlerts(); }
  @Get('products/:id') product(@Param('id') id: string) { return this.inventoryService.getProduct(id); }
  @Post('products') createProduct(@Body() body: any) { return this.inventoryService.createProduct(body); }
  @Patch('products/:id') updateProduct(@Param('id') id: string, @Body() body: any) { return this.inventoryService.updateProduct(id, body); }
  @Delete('products/:id') archiveProduct(@Param('id') id: string) { return this.inventoryService.archiveProduct(id); }
  @Get('suppliers') suppliers() { return this.inventoryService.listSuppliers(); }
  @Get('suppliers/export.csv') exportSuppliersCsv() { return this.inventoryService.exportSuppliersCsv(); }
  @Post('suppliers/import') importSuppliersCsv(@Body() body: { csv?: string }) { return this.inventoryService.importSuppliersCsv(body); }
  @Get('suppliers/risk-reminders') supplierRiskReminders(@Query('filter') filter?: string) { return this.inventoryService.supplierRiskReminders(filter); }
  @Post('suppliers/:id/document-placeholders') addSupplierDocumentPlaceholder(@Param('id') id: string, @Body() body: any) {
    return this.inventoryService.addSupplierDocumentPlaceholder(id, body);
  }
  @Get('suppliers/:id') supplier(@Param('id') id: string) { return this.inventoryService.getSupplier(id); }
  @Post('suppliers') createSupplier(@Body() body: any) { return this.inventoryService.createSupplier(body); }
  @Patch('suppliers/:id') updateSupplier(@Param('id') id: string, @Body() body: any) { return this.inventoryService.updateSupplier(id, body); }
  @Delete('suppliers/:id') archiveSupplier(@Param('id') id: string) { return this.inventoryService.archiveSupplier(id); }
  @Get('warehouses') warehouses() { return this.inventoryService.listWarehouses(); }
  @Post('adjustments') adjust(@Body() body: { productId: string; quantity: number; reason?: string }) {
    return this.inventoryService.adjustStock(body.productId, body.quantity, body.reason);
  }
  @Post('purchase-receipts') purchaseReceipt(@Body() body: any) { return this.inventoryService.receivePurchase(body); }
}
