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
