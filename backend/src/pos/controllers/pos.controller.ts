import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PosService } from '../services/pos.service';

@Controller('pos')
export class PosController {
  constructor(private readonly posService: PosService) {}
  @Get('sessions') sessions() { return this.posService.listSessions(); }
  @Post('sessions') openSession(@Body() body: any) { return this.posService.openSession(body); }
  @Post('sessions/:id/close') closeSession(@Param('id') id: string, @Body() body: any) { return this.posService.closeSession(id, body); }
  @Get('transactions') list() { return this.posService.listTransactions(); }
  @Post('transactions') create(@Body() body: any) { return this.posService.createTransaction(body); }
  @Post('transactions/:id/refund') refund(@Param('id') id: string, @Body() body: any) { return this.posService.refundTransaction(id, body); }
  @Post('cash-movements') cashMovement(@Body() body: any) { return this.posService.addCashMovement(body); }
  @Get('cashbox-transfers') cashboxTransfers() { return this.posService.listCashboxTransfers(); }
  @Post('cashbox-transfers') createCashboxTransfer(@Body() body: any) { return this.posService.createCashboxTransfer(body); }
  @Get('z-report') zReport(@Query('date') date?: string) { return this.posService.zReport(date); }
  @Get('offline-queue') offlineQueue() { return this.posService.offlineQueue(); }
  @Post('offline-queue') queueOffline(@Body() body: any) { return this.posService.queueOffline(body); }
  @Post('offline-queue/sync') syncOffline() { return this.posService.syncOffline(); }
}
