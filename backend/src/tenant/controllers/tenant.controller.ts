import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TenantService } from '../services/tenant.service';

@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}
  @Get() list() { return this.tenantService.findAll(); }
  @Get('current') current() { return this.tenantService.current(); }
  @Get('setup-checklist') setupChecklist() { return this.tenantService.setupChecklist(); }
  @Get('dashboard-filters') dashboardFilters() { return this.tenantService.dashboardFilters(); }
  @Get('role-widgets') roleWidgets() { return this.tenantService.roleWidgets(); }
  @Get('role-navigation/:role') roleNavigation(@Param('role') role: string) { return this.tenantService.roleNavigation(role); }
  @Get('subscription-gate') subscriptionGate() { return this.tenantService.subscriptionGate(); }
  @Patch('subscription-gate') updateSubscriptionGate(@Body() body: any) { return this.tenantService.updateSubscriptionGate(body); }
  @Get('retention-policy') retentionPolicy() { return this.tenantService.retentionPolicy(); }
  @Post('data-export') requestDataExport() { return this.tenantService.requestDataExport(); }
  @Post('delete-request') requestTenantDelete(@Body() body: any) { return this.tenantService.requestTenantDelete(body); }
  @Get('import-templates') importTemplates() { return this.tenantService.importTemplates(); }
  @Get('document-numbering') documentNumbering() { return this.tenantService.documentNumbering(); }
  @Patch('document-numbering') updateDocumentNumbering(@Body() body: any) { return this.tenantService.updateDocumentNumbering(body); }
  @Get('document-templates') documentTemplates() { return this.tenantService.documentTemplates(); }
  @Get('file-storage') fileStorage() { return this.tenantService.fileStorage(); }
  @Get('implementation-partner/workspace') implementationPartnerWorkspace() { return this.tenantService.implementationPartnerWorkspace(); }
  @Post('implementation-partner/clients') createPartnerClient(@Body() body: any) { return this.tenantService.createPartnerClient(body); }
  @Patch('implementation-partner/clients/:tenantId/onboarding') updatePartnerClientOnboarding(@Param('tenantId') tenantId: string, @Body() body: any) {
    return this.tenantService.updatePartnerClientOnboarding(tenantId, body);
  }
  @Get('collaboration-board') collaborationBoard() { return this.tenantService.collaborationBoard(); }
  @Patch('tasks/:id') updateInternalTaskStatus(@Param('id') id: string, @Body() body: { status?: string }) {
    return this.tenantService.updateInternalTaskStatus(id, body?.status);
  }
  @Get('approval-limits') approvalLimits() { return this.tenantService.approvalLimits(); }
  @Patch('approval-limits') updateApprovalLimits(@Body() body: any) { return this.tenantService.updateApprovalLimits(body); }
  @Get('company-profile') profile() { return this.tenantService.profile(); }
  @Patch('company-profile') updateProfile(@Body() body: any) { return this.tenantService.updateProfile(body); }
  @Post('company-profile/approve') approveProfile(@Body() body: { reviewer?: string }) { return this.tenantService.approveProfile(body?.reviewer); }
  @Post('demo-reset') resetDemo(@Body() body: { environment?: string }) { return this.tenantService.resetDemo(body?.environment); }
  @Post('onboarding') completeOnboarding(@Body() body: any) { return this.tenantService.completeOnboarding(body); }
  @Post() create(@Body() body: any) { return this.tenantService.create(body); }
}
