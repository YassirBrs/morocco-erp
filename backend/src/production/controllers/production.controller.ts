import { Controller, Get, Patch, Post, Body, Param } from '@nestjs/common';
import { ProductionService } from '../services/production.service';

@Controller('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}
  @Get('boms') boms() { return this.productionService.listBoms(); }
  @Post('boms') createBom(@Body() body: any) { return this.productionService.createBom(body); }
  @Get('orders') list() { return this.productionService.listOrders(); }
  @Post('orders') create(@Body() body: any) { return this.productionService.createOrder(body); }
  @Get('maintenance') maintenance() { return this.productionService.listMaintenance(); }
  @Post('maintenance/assets') createMaintenanceAsset(@Body() body: any) { return this.productionService.createMaintenanceAsset(body); }
  @Post('maintenance/work-orders') createMaintenanceWorkOrder(@Body() body: any) { return this.productionService.createMaintenanceWorkOrder(body); }
  @Post('maintenance/work-orders/:id/complete') completeMaintenanceWorkOrder(@Param('id') id: string) { return this.productionService.completeMaintenanceWorkOrder(id); }
  @Get('fleet') fleet() { return this.productionService.listFleet(); }
  @Post('fleet/vehicles') createFleetVehicle(@Body() body: any) { return this.productionService.createFleetVehicle(body); }
  @Post('fleet/logs') addFleetLog(@Body() body: any) { return this.productionService.addFleetLog(body); }
  @Get('projects') projects() { return this.productionService.listProjects(); }
  @Post('projects') createProject(@Body() body: any) { return this.productionService.createProject(body); }
  @Patch('projects/:id') updateProject(@Param('id') id: string, @Body() body: any) { return this.productionService.updateProject(id, body); }
  @Get('profitability') profitability() { return this.productionService.profitability(); }
}
