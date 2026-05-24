import { Controller, Get, Post, Body } from '@nestjs/common';
import { PosService } from '../services/pos.service';

@Controller('pos')
export class PosController {
  constructor(private readonly posService: PosService) {}
  @Get('transactions') list() { return this.posService.listTransactions(); }
  @Post('transactions') create(@Body() body: any) { return this.posService.createTransaction(body); }
}
