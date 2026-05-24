import { Controller, Get, Post, Body } from '@nestjs/common';
import { TenantService } from '../services/tenant.service';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}
  @Get() list() { return this.tenantService.findAll(); }
  @Get('current') current() { return this.tenantService.current(); }
  @Post() create(@Body() body: any) { return this.tenantService.create(body); }
}
