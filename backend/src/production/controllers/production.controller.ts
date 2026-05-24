import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductionService } from '../services/production.service';

@Controller('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}
  @Get('orders') list() { return this.productionService.listOrders(); }
  @Post('orders') create(@Body() body: any) { return this.productionService.createOrder(body); }
}
