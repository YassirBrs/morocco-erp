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
  @Get('cohort-metrics') cohortMetrics() { return this.tenantService.cohortMetrics(); }
  @Get('acceptance-scenarios') acceptanceScenarios() { return this.tenantService.acceptanceScenarios(); }
  @Get('production-persistence') productionPersistence() { return this.tenantService.productionPersistence(); }
  @Get('environment-check') environmentCheck() { return this.tenantService.environmentCheck(); }
  @Get('operations/logs') structuredLogs() { return this.tenantService.structuredLogs(); }
  @Get('operations/metrics') metrics() { return this.tenantService.metrics(); }
  @Get('operations/backup') backupPlan() { return this.tenantService.backupPlan(); }
  @Post('operations/backup') requestBackup() { return this.tenantService.requestBackup(); }
  @Post('operations/restore-rehearsal') restoreRehearsal(@Body() body: any) { return this.tenantService.restoreRehearsal(body); }
  @Get('staging-deployment') stagingDeployment() { return this.tenantService.stagingDeployment(); }
  @Get('operations/jobs') jobs() { return this.tenantService.jobs(); }
  @Post('operations/jobs') enqueueJob(@Body() body: any) { return this.tenantService.enqueueJob(body); }
  @Post('operations/jobs/run-next') runNextJob() { return this.tenantService.runNextJob(); }
  @Get('feature-flags') featureFlags() { return this.tenantService.featureFlags(); }
  @Patch('feature-flags') updateFeatureFlag(@Body() body: any) { return this.tenantService.updateFeatureFlag(body); }
  @Get('pricing-plans') pricingPlans() { return this.tenantService.pricingPlans(); }
  @Get('billing-status') billingStatus() { return this.tenantService.billingStatus(); }
  @Get('accountant-workspace') accountantWorkspace() { return this.tenantService.accountantWorkspace(); }
  @Get('super-admin-workspace') superAdminWorkspace() { return this.tenantService.superAdminWorkspace(); }
  @Get('support-diagnostics') supportDiagnostics() { return this.tenantService.supportDiagnostics(); }
  @Get('upgrade-prompts') upgradePrompts() { return this.tenantService.upgradePrompts(); }
  @Post('performance/large-tenant') performanceScenario(@Body() body: any) { return this.tenantService.performanceScenario(body); }
  @Get('emails') emails() { return this.tenantService.emails(); }
  @Post('emails') queueEmail(@Body() body: any) { return this.tenantService.queueEmail(body); }
  @Get('webhooks') webhooks() { return this.tenantService.webhooks(); }
  @Post('webhooks') emitWebhook(@Body() body: any) { return this.tenantService.emitWebhook(body); }
  @Get('api-keys') apiKeys() { return this.tenantService.apiKeys(); }
  @Post('api-keys') createApiKey(@Body() body: any) { return this.tenantService.createApiKey(body); }
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
