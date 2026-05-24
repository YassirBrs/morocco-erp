import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class TenantService {
  constructor(private readonly store: ErpStoreService) {}

  findAll() {
    return this.store.listTenants();
  }

  current() {
    return this.store.summary();
  }

  setupChecklist() {
    return this.store.setupChecklist();
  }

  dashboardFilters() {
    return this.store.dashboardFilters();
  }

  roleWidgets() {
    return this.store.roleDashboardWidgets();
  }

  roleNavigation(role?: string) {
    return this.store.roleNavigation(role);
  }

  subscriptionGate() {
    return this.store.subscriptionGate();
  }

  updateSubscriptionGate(data: any) {
    return this.store.updateSubscriptionGate(data);
  }

  retentionPolicy() {
    return this.store.dataRetentionPolicy();
  }

  requestDataExport() {
    return this.store.requestTenantExport();
  }

  requestTenantDelete(data: any) {
    return this.store.requestTenantDelete(data);
  }

  importTemplates() {
    return this.store.importTemplates();
  }

  documentNumbering() {
    return this.store.documentNumberingSettings();
  }

  updateDocumentNumbering(data: any) {
    return this.store.updateDocumentNumberingSetting(data);
  }

  documentTemplates() {
    return this.store.documentTemplateCatalog();
  }

  fileStorage() {
    return this.store.fileStorageStatus();
  }

  cohortMetrics() {
    return this.store.cohortMetrics();
  }

  acceptanceScenarios() {
    return this.store.acceptanceScenarios();
  }

  productionPersistence() {
    return this.store.productionPersistenceConfig();
  }

  environmentCheck() {
    return this.store.environmentCheck();
  }

  structuredLogs() {
    return this.store.structuredLogEntries();
  }

  metrics() {
    return this.store.metricsSnapshot();
  }

  backupPlan() {
    return this.store.backupPlan();
  }

  requestBackup() {
    return this.store.requestBackup();
  }

  restoreRehearsal(data: any) {
    return this.store.restoreRehearsal(data);
  }

  stagingDeployment() {
    return this.store.stagingDeployment();
  }

  jobs() {
    return this.store.listBackgroundJobs();
  }

  enqueueJob(data: any) {
    return this.store.enqueueBackgroundJob(data);
  }

  runNextJob() {
    return this.store.runNextBackgroundJob();
  }

  featureFlags() {
    return this.store.listFeatureFlags();
  }

  updateFeatureFlag(data: any) {
    return this.store.updateFeatureFlag(data);
  }

  featureFlagAuditHistory() { return this.store.featureFlagAuditHistory(); }

  pricingPlans() {
    return this.store.pricingPlans();
  }

  billingStatus() {
    return this.store.tenantBillingStatus();
  }

  accountantWorkspace() {
    return this.store.accountantWorkspace();
  }

  superAdminWorkspace() {
    return this.store.superAdminWorkspace();
  }

  supportDiagnostics() {
    return this.store.supportDiagnostics();
  }

  dataExportManifest() { return this.store.tenantDataExportManifest(); }
  exportTamperEvidenceReport() { return this.store.exportTamperEvidenceReport(); }
  invitations() { return this.store.listUserInvitations(); }
  inviteUser(data: any) { return this.store.inviteUser(data); }
  revokeSession(data: any) { return this.store.revokeSession(data.sessionId); }
  rateLimits() { return this.store.apiRateLimitStatus(); }
  webhookRetries() { return this.store.webhookRetryLogs(); }
  retryWebhook(data: any) { return this.store.retryWebhook(data.webhookEventId); }
  exportStatusCenter() { return this.store.exportStatusCenter(); }
  onboardingProgress(companyType?: any) { return this.store.onboardingProgress(companyType); }
  resetSampleModule(data: any) { return this.store.resetSampleModule(data); }
  upsertKpiTarget(data: any) { return this.store.upsertKpiTarget(data); }
  kpiVariance() { return this.store.kpiVariance(); }
  executiveDigest() { return this.store.executiveDailyDigest(); }
  evidenceBinder(data: any) { return this.store.accountantEvidenceBinder(data); }
  moroccanRegions() { return this.store.moroccanRegions(); }
  customerRiskScores() { return this.store.customerRiskScores(); }
  createBranch(data: any) { return this.store.createBranch(data); }
  branchDashboard() { return this.store.branchDashboard(); }
  localizationSettings() { return this.store.localizationSettings(); }
  updateLocalizationSettings(data: any) { return this.store.updateLocalizationSettings(data); }
  documentTemplatePreview(data: any) { return this.store.documentTemplatePreview(data); }
  emailAuditTrail() { return this.store.emailAuditTrail(); }
  customerPortalWorkflow(customerId: string) { return this.store.customerPortalWorkflow(customerId); }
  supplierPortalWorkflow(supplierId: string) { return this.store.supplierPortalWorkflow(supplierId); }
  createAccountantPortalReview(data: any) { return this.store.createAccountantPortalReview(data); }
  accountantPortalReviews() { return this.store.accountantPortalReviews(); }
  partnerImplementationChecklist(data: any) { return this.store.partnerImplementationChecklist(data); }
  complianceRuleRollout(data: any) { return this.store.complianceRuleRollout(data); }
  integrationHealthDashboard() { return this.store.integrationHealthDashboard(); }
  webhookSignatureVerification(data: any) { return this.store.webhookSignatureVerificationExample(data); }

  upgradePrompts() {
    return this.store.upgradePrompts();
  }

  performanceScenario(data: any) {
    return this.store.largeTenantPerformanceScenario(data ?? {});
  }

  emails() {
    return this.store.listEmailDeliveries();
  }

  queueEmail(data: any) {
    return this.store.queueEmailDelivery(data);
  }

  webhooks() {
    return this.store.listWebhookEvents();
  }

  emitWebhook(data: any) {
    return this.store.emitWebhookEvent(data);
  }

  apiKeys() {
    return this.store.listPartnerApiKeys();
  }

  createApiKey(data: any) {
    return this.store.createPartnerApiKey(data);
  }

  implementationPartnerWorkspace() {
    return this.store.implementationPartnerWorkspace();
  }

  createPartnerClient(data: any) {
    return this.store.createPartnerClientTenant(data);
  }

  updatePartnerClientOnboarding(tenantId: string, data: any) {
    return this.store.updatePartnerClientOnboarding(tenantId, data);
  }

  collaborationBoard() {
    return this.store.collaborationBoard();
  }

  updateInternalTaskStatus(taskId: string, status: any) {
    return this.store.updateInternalTaskStatus(taskId, status);
  }

  approvalLimits() {
    return this.store.approvalLimitReview();
  }

  updateApprovalLimits(data: any) {
    return this.store.updateApprovalLimits(data);
  }

  profile() {
    return this.store.companyProfile();
  }

  updateProfile(data: any) {
    return this.store.updateCompanyProfile(data);
  }

  approveProfile(reviewer?: string) {
    return this.store.approveCompanyProfile(reviewer);
  }

  resetDemo(environment?: string) {
    return this.store.resetDemoData(environment);
  }

  completeOnboarding(data: any) {
    return this.store.completeTenantOnboarding(data);
  }

  create(data: any) {
    return this.store.createTenant(data);
  }
}
