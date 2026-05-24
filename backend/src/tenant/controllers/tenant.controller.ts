import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { TenantService } from '../services/tenant.service';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}
  @Get() list() { return this.tenantService.findAll(); }
  @Get('current') current() { return this.tenantService.current(); }
  @Get('setup-checklist') setupChecklist() { return this.tenantService.setupChecklist(); }
  @Get('company-profile') profile() { return this.tenantService.profile(); }
  @Patch('company-profile') updateProfile(@Body() body: any) { return this.tenantService.updateProfile(body); }
  @Post('company-profile/approve') approveProfile(@Body() body: { reviewer?: string }) { return this.tenantService.approveProfile(body?.reviewer); }
  @Post('demo-reset') resetDemo(@Body() body: { environment?: string }) { return this.tenantService.resetDemo(body?.environment); }
  @Post('onboarding') completeOnboarding(@Body() body: any) { return this.tenantService.completeOnboarding(body); }
  @Post() create(@Body() body: any) { return this.tenantService.create(body); }
}
