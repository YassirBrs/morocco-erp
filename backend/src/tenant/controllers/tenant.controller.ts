import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
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
  @Post('operations/restore-rehearsal/checklist') restoreRehearsalChecklist(@Body() body: any) { return this.tenantService.restoreRehearsalChecklist(body); }
  @Get('staging-deployment') stagingDeployment() { return this.tenantService.stagingDeployment(); }
  @Get('operations/jobs') jobs() { return this.tenantService.jobs(); }
  @Post('operations/jobs') enqueueJob(@Body() body: any) { return this.tenantService.enqueueJob(body); }
  @Post('operations/jobs/run-next') runNextJob() { return this.tenantService.runNextJob(); }
  @Get('feature-flags') featureFlags() { return this.tenantService.featureFlags(); }
  @Patch('feature-flags') updateFeatureFlag(@Body() body: any) { return this.tenantService.updateFeatureFlag(body); }
  @Get('feature-flags/audit-history') featureFlagAuditHistory() { return this.tenantService.featureFlagAuditHistory(); }
  @Get('support-impersonations') supportImpersonations() { return this.tenantService.supportImpersonations(); }
  @Post('support-impersonations') requestSupportImpersonation(@Body() body: any) { return this.tenantService.requestSupportImpersonation(body); }
  @Get('release-notes') releaseNotes(@Query('role') role?: any, @Query('module') module?: any, @Query('plan') plan?: any) {
    return this.tenantService.targetedReleaseNotes({ role, module, plan });
  }
  @Post('release-notes') publishReleaseNote(@Body() body: any) { return this.tenantService.publishReleaseNote(body); }
  @Get('onboarding-nudges') onboardingNudges() { return this.tenantService.onboardingNudges(); }
  @Get('competitive-scorecard') competitiveScorecard() { return this.tenantService.competitiveScorecard(); }
  @Get('workflow-sla-timers') workflowSlaTimers() { return this.tenantService.workflowSlaTimers(); }
  @Get('escalation-rules') escalationRules() { return this.tenantService.escalationRules(); }
  @Post('escalation-rules') createEscalationRule(@Body() body: any) { return this.tenantService.createEscalationRule(body); }
  @Get('currency-preparations') currencyPreparations() { return this.tenantService.currencyPreparations(); }
  @Post('currency-preparations') prepareCurrency(@Body() body: any) { return this.tenantService.prepareMultiCurrencyDocument(body); }
  @Get('branch-numbering-policies') branchNumberingPolicies() { return this.tenantService.branchNumberingPolicies(); }
  @Post('branch-numbering-policies') upsertBranchNumberingPolicy(@Body() body: any) { return this.tenantService.upsertBranchNumberingPolicy(body); }
  @Get('pricing-plans') pricingPlans() { return this.tenantService.pricingPlans(); }
  @Get('billing-status') billingStatus() { return this.tenantService.billingStatus(); }
  @Get('accountant-workspace') accountantWorkspace() { return this.tenantService.accountantWorkspace(); }
  @Get('super-admin-workspace') superAdminWorkspace() { return this.tenantService.superAdminWorkspace(); }
  @Get('support-diagnostics') supportDiagnostics() { return this.tenantService.supportDiagnostics(); }
  @Get('data-export-manifest') dataExportManifest() { return this.tenantService.dataExportManifest(); }
  @Get('export-tamper-evidence') exportTamperEvidence() { return this.tenantService.exportTamperEvidenceReport(); }
  @Get('invitations') invitations() { return this.tenantService.invitations(); }
  @Post('invitations') inviteUser(@Body() body: any) { return this.tenantService.inviteUser(body); }
  @Post('sessions/revoke') revokeSession(@Body() body: any) { return this.tenantService.revokeSession(body); }
  @Get('operations/rate-limits') rateLimits() { return this.tenantService.rateLimits(); }
  @Get('operations/webhook-retries') webhookRetries() { return this.tenantService.webhookRetries(); }
  @Post('operations/webhook-retries') retryWebhook(@Body() body: any) { return this.tenantService.retryWebhook(body); }
  @Get('operations/export-status-center') exportStatusCenter() { return this.tenantService.exportStatusCenter(); }
  @Get('approval-delegations') approvalDelegations() { return this.tenantService.approvalDelegations(); }
  @Post('approval-delegations') createApprovalDelegation(@Body() body: any) { return this.tenantService.createApprovalDelegation(body); }
  @Get('import-validation-sandbox') importValidationRuns() { return this.tenantService.importValidationRuns(); }
  @Post('import-validation-sandbox') importValidationSandbox(@Body() body: any) { return this.tenantService.importValidationSandbox(body); }
  @Get('data-quality-score') dataQualityScore() { return this.tenantService.tenantDataQualityScore(); }
  @Get('accountant-handoff-pack') accountantHandoffPack(@Query('period') period?: string) { return this.tenantService.guidedAccountantHandoffPack(period); }
  @Get('implementation-partner/margin-workload') implementationPartnerMarginWorkload() { return this.tenantService.implementationPartnerMarginWorkloadDashboard(); }
  @Get('support-tickets') supportTickets() { return this.tenantService.listSupportTickets(); }
  @Post('support-tickets') createSupportTicket(@Body() body: any) { return this.tenantService.createSupportTicket(body); }
  @Get('admin-health-checks') adminHealthChecks() { return this.tenantService.adminHealthChecks(); }
  @Get('resilience-runbook') resilienceRunbook() { return this.tenantService.tenantResilienceRunbookStatus(); }
  @Get('onboarding-progress') onboardingProgress(@Query('companyType') companyType?: any) { return this.tenantService.onboardingProgress(companyType); }
  @Post('sample-data/reset-module') resetSampleModule(@Body() body: any) { return this.tenantService.resetSampleModule(body); }
  @Get('kpi-targets/variance') kpiVariance() { return this.tenantService.kpiVariance(); }
  @Post('kpi-targets') upsertKpiTarget(@Body() body: any) { return this.tenantService.upsertKpiTarget(body); }
  @Get('executive-digest') executiveDigest() { return this.tenantService.executiveDigest(); }
  @Get('evidence-binder') evidenceBinderGet() { return this.tenantService.evidenceBinder({}); }
  @Post('evidence-binder') evidenceBinder(@Body() body: any) { return this.tenantService.evidenceBinder(body); }
  @Get('moroccan-regions') moroccanRegions() { return this.tenantService.moroccanRegions(); }
  @Get('customer-risk-scores') customerRiskScores() { return this.tenantService.customerRiskScores(); }
  @Get('moroccan-public-holidays') moroccanPublicHolidays(@Query('year') year?: string) { return this.tenantService.moroccanPublicHolidays(year ? Number(year) : undefined); }
  @Get('moroccan-city-regions') moroccanCityRegions() { return this.tenantService.moroccanCityRegions(); }
  @Get('customer-credit-scores') customerCreditScores() { return this.tenantService.customerCreditScores(); }
  @Post('approval-matrix-simulator') approvalMatrixSimulator(@Body() body: any) { return this.tenantService.approvalMatrixSimulator(body); }
  @Get('accountant-review-mode') accountantReviewMode(@Query('period') period?: string) { return this.tenantService.accountantReviewMode(period); }
  @Post('accountant-review-comments') createAccountantReviewComment(@Body() body: any) { return this.tenantService.createAccountantReviewComment(body); }
  @Post('accountant-review-comments/:id/resolve') resolveAccountantReviewComment(@Param('id') id: string) { return this.tenantService.resolveAccountantReviewComment(id); }
  @Get('scale-controls-readiness') scaleControlsReadiness() { return this.tenantService.scaleControlsReadiness(); }
  @Get('enterprise-depth-readiness') enterpriseDepthReadiness() { return this.tenantService.enterpriseDepthReadiness(); }
  @Get('enterprise-operations-readiness') enterpriseOperationsReadiness() { return this.tenantService.enterpriseOperationsReadiness(); }
  @Get('enterprise-expansion-readiness') enterpriseExpansionReadiness() { return this.tenantService.enterpriseExpansionReadiness(); }
  @Get('enterprise-acceleration-readiness') enterpriseAccelerationReadiness() { return this.tenantService.enterpriseAccelerationReadiness(); }
  @Get('branches') branchDashboard() { return this.tenantService.branchDashboard(); }
  @Post('branches') createBranch(@Body() body: any) { return this.tenantService.createBranch(body); }
  @Get('localization-settings') localizationSettings() { return this.tenantService.localizationSettings(); }
  @Patch('localization-settings') updateLocalizationSettings(@Body() body: any) { return this.tenantService.updateLocalizationSettings(body); }
  @Post('document-templates/preview') documentTemplatePreview(@Body() body: any) { return this.tenantService.documentTemplatePreview(body); }
  @Get('emails/audit-trail') emailAuditTrail() { return this.tenantService.emailAuditTrail(); }
  @Get('customer-portal/:customerId') customerPortalWorkflow(@Param('customerId') customerId: string) { return this.tenantService.customerPortalWorkflow(customerId); }
  @Get('supplier-portal/:supplierId') supplierPortalWorkflow(@Param('supplierId') supplierId: string) { return this.tenantService.supplierPortalWorkflow(supplierId); }
  @Get('accountant-portal/reviews') accountantPortalReviews() { return this.tenantService.accountantPortalReviews(); }
  @Post('accountant-portal/reviews') createAccountantPortalReview(@Body() body: any) { return this.tenantService.createAccountantPortalReview(body); }
  @Post('partner-implementation-checklist') partnerImplementationChecklist(@Body() body: any) { return this.tenantService.partnerImplementationChecklist(body); }
  @Post('compliance-rule-rollout') complianceRuleRollout(@Body() body: any) { return this.tenantService.complianceRuleRollout(body); }
  @Get('integration-health') integrationHealthDashboard() { return this.tenantService.integrationHealthDashboard(); }
  @Post('webhooks/signature-verification') webhookSignatureVerification(@Body() body: any) { return this.tenantService.webhookSignatureVerification(body); }
  @Get('upgrade-prompts') upgradePrompts() { return this.tenantService.upgradePrompts(); }
  @Post('performance/large-tenant') performanceScenario(@Body() body: any) { return this.tenantService.performanceScenario(body); }
  @Get('emails') emails() { return this.tenantService.emails(); }
  @Post('emails') queueEmail(@Body() body: any) { return this.tenantService.queueEmail(body); }
  @Get('webhooks') webhooks() { return this.tenantService.webhooks(); }
  @Post('webhooks') emitWebhook(@Body() body: any) { return this.tenantService.emitWebhook(body); }
  @Get('api-keys') apiKeys() { return this.tenantService.apiKeys(); }
  @Post('api-keys') createApiKey(@Body() body: any) { return this.tenantService.createApiKey(body); }
  @Patch('api-keys/:id/last-used') recordApiKeyUse(@Param('id') id: string, @Body() body: any) { return this.tenantService.recordApiKeyUse(id, body); }
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
