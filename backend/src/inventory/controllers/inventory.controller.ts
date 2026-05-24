import { Body, Controller, Get, Post } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}
  @Get() list() { return this.inventoryService.listStock(); }
  @Get('products') products() { return this.inventoryService.listProducts(); }
  @Post('products') createProduct(@Body() body: any) { return this.inventoryService.createProduct(body); }
  @Get('suppliers') suppliers() { return this.inventoryService.listSuppliers(); }
  @Post('suppliers') createSupplier(@Body() body: any) { return this.inventoryService.createSupplier(body); }
  @Get('warehouses') warehouses() { return this.inventoryService.listWarehouses(); }
  @Post('adjustments') adjust(@Body() body: { productId: string; quantity: number; reason?: string }) {
    return this.inventoryService.adjustStock(body.productId, body.quantity, body.reason);
  }
  @Post('purchase-receipts') purchaseReceipt(@Body() body: any) { return this.inventoryService.receivePurchase(body); }
}
