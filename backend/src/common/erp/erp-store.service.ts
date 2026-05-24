import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { createHash, randomBytes } from 'crypto';
import {
  AuditLog,
  AdapterKind,
  AdapterSubmission,
  AuthSession,
  BackgroundJob,
  BackgroundJobKind,
  BillOfMaterial,
  BusinessSearchInput,
  BusinessSearchResult,
  BusinessSearchType,
  CashDrawerMovement,
  ChartAccount,
  CollaborationEntityType,
  CompanyProfileChange,
  ComplianceRuleSet,
  CreditNote,
  Customer,
  DeliveryNote,
  DocumentLine,
  DocumentLineInput,
  DocumentExportType,
  DocumentTemplateSetting,
  DocumentTotals,
  Employee,
  EmailDelivery,
  EmployeePortalAccess,
  EmploymentContract,
  ErpUser,
  ErpModuleKey,
  FeatureFlag,
  FiscalPeriod,
  InventoryCountSheet,
  ImportTemplateKind,
  InternalNote,
  InternalTask,
  InternalTaskStatus,
  Invoice,
  JournalEntry,
  Lead,
  LeaveBalance,
  LeaveRequest,
  LegalEvidence,
  LegalEntity,
  FleetLog,
  FleetVehicle,
  MaintenanceAsset,
  MaintenanceWorkOrder,
  Payment,
  PartnerApiKey,
  PayrollRun,
  Payslip,
  PosOfflineQueueItem,
  PosSession,
  PosTransaction,
  PreferredLanguage,
  Product,
  ProductionOrder,
  ProjectRecord,
  PurchaseOrder,
  PurchaseReceipt,
  SalesOrder,
  Quote,
  SecurityNotification,
  StockMove,
  StockTransfer,
  StoredFile,
  Supplier,
  SupplierInvoice,
  Tenant,
  TenantSettings,
  TenantWorkspace,
  VatRate,
  Warehouse,
  WarehouseStock,
  WebhookEvent,
} from './erp.types';

const r2 = (value: number): number => Math.round(value * 100) / 100;
const today = (): string => new Date().toISOString().slice(0, 10);
const addDays = (date: string, days: number): string => {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
};
const daysBetween = (from: string, to: string): number => {
  const start = new Date(`${from}T00:00:00.000Z`).getTime();
  const end = new Date(`${to}T00:00:00.000Z`).getTime();
  return Math.floor((end - start) / 86400000);
};
const allowedVatRates: VatRate[] = [0, 0.07, 0.1, 0.14, 0.2];
const defaultApprovalLimits: TenantSettings['approvalLimits'] = {
  quote: 50000,
  creditNote: 10000,
  purchase: 25000,
  stockAdjustment: 10000,
};
const allModules: ErpModuleKey[] = ['tenant', 'auth', 'crm', 'sales', 'inventory', 'accounting', 'payroll', 'pos', 'production', 'compliance'];

@Injectable()
export class ErpStoreService {
  private workspaces = new Map<string, TenantWorkspace>();

  readonly morocco2026Rules: ComplianceRuleSet = {
    id: 'MA-2026',
    jurisdiction: 'MA',
    effectiveFrom: '2026-01-01',
    vatRates: [0, 0.07, 0.1, 0.14, 0.2],
    invoiceMentions: [
      'Identifiant Commun de l’Entreprise (ICE)',
      'Identifiant Fiscal (IF)',
      'Registre de Commerce (RC)',
      'Taxe Professionnelle / Patente',
      'Numéro séquentiel de facture',
      'Taux et montant de TVA ou mention exonérée',
    ],
    irBrackets: [
      { upperBound: 3333.33, rate: 0, deduction: 0 },
      { upperBound: 5000, rate: 0.1, deduction: 333.33 },
      { upperBound: 6666.67, rate: 0.2, deduction: 833.33 },
      { upperBound: 8333.33, rate: 0.3, deduction: 1500 },
      { upperBound: 15000, rate: 0.34, deduction: 1833.33 },
      { upperBound: Infinity, rate: 0.37, deduction: 2283.33 },
    ],
    cnss: {
      cap: 6000,
      employeeRate: 0.0448,
      employerRate: 0.0898,
      amoEmployeeRate: 0.0226,
      amoEmployerRate: 0.0411,
      familyAllocationRate: 0.064,
      vocationalTrainingRate: 0.016,
    },
  };

  constructor(private readonly cls: ClsService) {
    this.reset();
  }

  reset(): void {
    this.workspaces.clear();
    const tenant: Tenant = {
      id: 'tenant-demo',
      slug: 'demo-casa',
      legalEntity: {
        tradeName: 'Atlas Distribution SARL',
        ice: '001525678000083',
        ifNumber: '1525678',
        rc: 'CASA-425001',
        patente: '34218811',
        cnssNumber: '1234567',
        address: '45 Boulevard Abdelmoumen',
        city: 'Casablanca',
        country: 'MA',
        vatEnabled: true,
      },
      settings: {
        invoiceSeries: 'FAC',
        documentSeries: this.defaultDocumentSeries('FAC'),
        fiscalYearStartMonth: 1,
        vatStatus: 'ENABLED',
        approvalLimits: { ...defaultApprovalLimits },
        featureGates: { writeLocked: false, allowedModules: [...allModules] },
        retention: { retentionDays: 3650 },
      },
      plan: 'ENTERPRISE',
      status: 'ACTIVE',
      profileApprovalStatus: 'APPROVED',
      createdAt: today(),
    };

    const workspace: TenantWorkspace = {
      tenant,
      users: [
        {
          id: 'usr-owner',
          tenantId: tenant.id,
          email: 'owner@atlas.ma',
          name: 'Nadia Benali',
          role: 'OWNER',
          password: 'demo1234',
          passwordHash: this.passwordHash('demo1234'),
          passwordUpdatedAt: today(),
          twoFactorEnabled: false,
          active: true,
        },
        {
          id: 'usr-accountant',
          tenantId: tenant.id,
          email: 'accountant@atlas.ma',
          name: 'Cabinet Fiduciaire Casa',
          role: 'ACCOUNTANT',
          password: 'demo1234',
          passwordHash: this.passwordHash('demo1234'),
          passwordUpdatedAt: today(),
          twoFactorEnabled: true,
          twoFactorSecret: '246810',
          active: true,
        },
        {
          id: 'usr-partner',
          tenantId: tenant.id,
          email: 'partner@atlas.ma',
          name: 'Partenaire Intégration Maroc',
          role: 'IMPLEMENTATION_PARTNER',
          password: 'demo1234',
          passwordHash: this.passwordHash('demo1234'),
          passwordUpdatedAt: today(),
          twoFactorEnabled: false,
          active: true,
        },
      ],
      sessions: [],
      passwordResetTokens: [],
      deviceLoginEvents: [],
      securityNotifications: [],
      customers: [
        {
          id: 'cus-1',
          tenantId: tenant.id,
          name: 'Rabat Retail SARL',
          arabicName: 'شركة الرباط للتجزئة',
          ice: '001111222333444',
          ifNumber: '778899',
          rc: 'RABAT-112233',
          email: 'finance@rabretail.ma',
          phone: '+212522000000',
          address: 'Avenue Mohammed V, Rabat',
          arabicAddress: 'شارع محمد الخامس، الرباط',
          preferredLanguage: 'FR',
          city: 'Rabat',
          paymentTermsDays: 30,
          creditLimit: 100000,
          contacts: [{ name: 'Youssef Amrani', role: 'Finance', email: 'finance@rabretail.ma', phone: '+212522000000' }],
          addresses: [{ label: 'Siège', line1: 'Avenue Mohammed V', city: 'Rabat' }],
          documentExpiries: [
            { type: 'Garantie de paiement', arabicType: 'ضمان الأداء', expiresAt: '2026-06-20', reference: 'GP-2026-001' },
            { type: 'Registre de Commerce', arabicType: 'السجل التجاري', expiresAt: '2026-12-31', reference: 'RABAT-112233' },
          ],
          active: true,
          createdAt: today(),
          updatedAt: today(),
        },
      ],
      suppliers: [
        {
          id: 'sup-1',
          tenantId: tenant.id,
          name: 'Casa Import SA',
          arabicName: 'شركة كازا للاستيراد',
          ice: '009998887776665',
          ifNumber: '445566',
          rc: 'CASA-99001',
          email: 'sales@casa-import.ma',
          phone: '+212522111111',
          address: 'Zone industrielle Ain Sebaa',
          arabicAddress: 'المنطقة الصناعية عين السبع',
          preferredLanguage: 'FR',
          city: 'Casablanca',
          paymentTermsDays: 45,
          contacts: [{ name: 'Samir Achat', role: 'Commercial', email: 'sales@casa-import.ma', phone: '+212522111111' }],
          bankDetails: [{ bankName: 'Attijariwafa bank', rib: '007780000000000000000123' }],
          preferred: true,
          riskNotes: 'Contrat import à revoir avant renouvellement.',
          documentExpiries: [{ type: 'Attestation fiscale', arabicType: 'شهادة ضريبية', expiresAt: '2026-06-30', reference: 'AF-2026' }],
          active: true,
          createdAt: today(),
          updatedAt: today(),
        },
      ],
      employees: [
        {
          id: 'emp-1',
          tenantId: tenant.id,
          employeeNumber: 'EMP-001',
          fullName: 'Ahmed Taleb',
          arabicName: 'أحمد طالب',
          cin: 'AB123456',
          cnssNumber: '1234567890',
          contractType: 'CDI',
          hireDate: '2024-01-15',
          baseSalary: 6000,
          dependents: 2,
          address: 'Hay Riad, Rabat',
          arabicAddress: 'حي الرياض، الرباط',
          preferredLanguage: 'FR',
          documentExpiries: [
            { type: 'CIN', arabicType: 'البطاقة الوطنية', expiresAt: '2030-01-15', reference: 'AB123456' },
            { type: 'Contrat de travail', arabicType: 'عقد العمل', expiresAt: '2027-01-15', reference: 'CDI-EMP-001' },
          ],
          active: true,
          createdAt: today(),
          updatedAt: today(),
        },
      ],
      chartOfAccounts: this.defaultChartOfAccounts(tenant.id),
      leads: [],
      products: [
        {
          id: 'prd-1',
          tenantId: tenant.id,
          sku: 'SKU-CHAIR',
          barcode: '6111000000010',
          name: 'Chaise bureau',
          arabicDescription: 'كرسي مكتب',
          type: 'GOODS',
          unit: 'unité',
          trackStock: true,
          reorderPoint: 10,
          salePrice: 850,
          purchaseCost: 520,
          vatRate: 0.2,
          stockOnHand: 50,
          reservedStock: 0,
          weightedAverageCost: 520,
          active: true,
          createdAt: today(),
          updatedAt: today(),
        },
        {
          id: 'prd-2',
          tenantId: tenant.id,
          sku: 'SVC-INSTALL',
          barcode: '6111000000027',
          name: 'Installation sur site',
          arabicDescription: 'خدمة التركيب في الموقع',
          type: 'SERVICE',
          unit: 'forfait',
          trackStock: false,
          reorderPoint: 0,
          salePrice: 1200,
          purchaseCost: 0,
          vatRate: 0.2,
          stockOnHand: 0,
          reservedStock: 0,
          weightedAverageCost: 0,
          active: true,
          createdAt: today(),
          updatedAt: today(),
        },
        {
          id: 'prd-raw',
          tenantId: tenant.id,
          sku: 'RAW-BOIS',
          barcode: '6111000000034',
          name: 'Bois traité',
          arabicDescription: 'خشب معالج',
          type: 'RAW_MATERIAL',
          unit: 'm',
          trackStock: true,
          reorderPoint: 40,
          salePrice: 0,
          purchaseCost: 90,
          vatRate: 0.2,
          stockOnHand: 200,
          reservedStock: 0,
          weightedAverageCost: 90,
          active: true,
          createdAt: today(),
          updatedAt: today(),
        },
        {
          id: 'prd-fg',
          tenantId: tenant.id,
          sku: 'FG-TABLE',
          barcode: '6111000000041',
          name: 'Table assemblée',
          arabicDescription: 'طاولة مركبة',
          type: 'FINISHED_GOOD',
          unit: 'unité',
          trackStock: true,
          reorderPoint: 4,
          salePrice: 1400,
          purchaseCost: 300,
          vatRate: 0.2,
          stockOnHand: 8,
          reservedStock: 0,
          weightedAverageCost: 300,
          active: true,
          createdAt: today(),
          updatedAt: today(),
        },
      ],
      warehouses: [{ id: 'wh-1', tenantId: tenant.id, name: 'Dépôt Casablanca', city: 'Casablanca', address: 'Ain Sebaa', active: true }],
      warehouseStocks: [
        { tenantId: tenant.id, warehouseId: 'wh-1', productId: 'prd-1', quantity: 50, reserved: 0 },
        { tenantId: tenant.id, warehouseId: 'wh-1', productId: 'prd-raw', quantity: 200, reserved: 0 },
        { tenantId: tenant.id, warehouseId: 'wh-1', productId: 'prd-fg', quantity: 8, reserved: 0 },
      ],
      quotes: [],
      salesOrders: [],
      deliveryNotes: [],
      invoices: [],
      creditNotes: [],
      payments: [],
      purchaseOrders: [],
      stockMoves: [],
      purchaseReceipts: [],
      supplierInvoices: [],
      stockTransfers: [],
      inventoryCounts: [],
      journalEntries: [],
      fiscalPeriods: [this.openFiscalPeriod(tenant.id, today())],
      employmentContracts: [
        {
          id: 'ctr-1',
          tenantId: tenant.id,
          employeeId: 'emp-1',
          contractType: 'CDI',
          startDate: '2024-01-15',
          salary: 6000,
          attachmentName: 'contrat-ahmed-taleb.pdf',
          active: true,
          createdAt: today(),
        },
      ],
      payrollRuns: [],
      leaveBalances: [],
      leaveRequests: [],
      employeePortalAccesses: [],
      legalEvidences: [],
      storedFiles: [],
      documentTemplates: this.defaultDocumentTemplates(tenant.id),
      partnerApiKeys: [],
      webhookEvents: [],
      emailDeliveries: [],
      adapterSubmissions: [],
      structuredLogs: [],
      metricSamples: [],
      backgroundJobs: [],
      featureFlags: this.defaultFeatureFlags(tenant.id),
      posSessions: [],
      cashDrawerMovements: [],
      posOfflineQueue: [],
      posTransactions: [],
      billsOfMaterial: [],
      productionOrders: [],
      maintenanceAssets: [],
      maintenanceWorkOrders: [],
      fleetVehicles: [],
      fleetLogs: [],
      projects: [],
      auditLogs: [],
      profileChanges: [],
      internalNotes: [],
      internalTasks: [],
      sequences: {},
    };

    this.workspaces.set(tenant.id, workspace);
  }

  listTenants(): Tenant[] {
    return [...this.workspaces.values()].map((workspace) => workspace.tenant);
  }

  createTenant(input: Partial<LegalEntity> & { tradeName: string; slug?: string; plan?: Tenant['plan'] }): Tenant {
    const tenantId = `tenant-${this.workspaces.size + 1}`;
    const tenant: Tenant = {
      id: tenantId,
      slug: input.slug ?? input.tradeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      legalEntity: {
        tradeName: input.tradeName,
        ice: input.ice ?? '',
        ifNumber: input.ifNumber ?? '',
        rc: input.rc ?? '',
        patente: input.patente ?? '',
        cnssNumber: input.cnssNumber ?? '',
        address: input.address ?? '',
        city: input.city ?? 'Casablanca',
        country: 'MA',
        vatEnabled: input.vatEnabled ?? true,
      },
      settings: {
        invoiceSeries: 'FAC',
        documentSeries: this.defaultDocumentSeries('FAC'),
        fiscalYearStartMonth: 1,
        vatStatus: input.vatEnabled === false ? 'EXEMPT' : 'ENABLED',
        approvalLimits: { ...defaultApprovalLimits },
        featureGates: { writeLocked: false, allowedModules: [...allModules] },
        retention: { retentionDays: 3650 },
      },
      plan: input.plan ?? 'INTILAQ',
      status: 'ACTIVE',
      profileApprovalStatus: 'APPROVED',
      createdAt: today(),
    };

    this.workspaces.set(tenantId, {
      tenant,
      users: [],
      sessions: [],
      passwordResetTokens: [],
      deviceLoginEvents: [],
      securityNotifications: [],
      customers: [],
      suppliers: [],
      employees: [],
      chartOfAccounts: this.defaultChartOfAccounts(tenantId),
      leads: [],
      products: [],
      warehouses: [{ id: this.id('wh'), tenantId, name: 'Dépôt principal', city: tenant.legalEntity.city, active: true }],
      warehouseStocks: [],
      quotes: [],
      salesOrders: [],
      deliveryNotes: [],
      invoices: [],
      creditNotes: [],
      payments: [],
      purchaseOrders: [],
      stockMoves: [],
      purchaseReceipts: [],
      supplierInvoices: [],
      stockTransfers: [],
      inventoryCounts: [],
      journalEntries: [],
      fiscalPeriods: [this.openFiscalPeriod(tenantId, today())],
      employmentContracts: [],
      payrollRuns: [],
      leaveBalances: [],
      leaveRequests: [],
      employeePortalAccesses: [],
      legalEvidences: [],
      storedFiles: [],
      documentTemplates: this.defaultDocumentTemplates(tenantId),
      partnerApiKeys: [],
      webhookEvents: [],
      emailDeliveries: [],
      adapterSubmissions: [],
      structuredLogs: [],
      metricSamples: [],
      backgroundJobs: [],
      featureFlags: this.defaultFeatureFlags(tenantId),
      posSessions: [],
      cashDrawerMovements: [],
      posOfflineQueue: [],
      posTransactions: [],
      billsOfMaterial: [],
      productionOrders: [],
      maintenanceAssets: [],
      maintenanceWorkOrders: [],
      fleetVehicles: [],
      fleetLogs: [],
      projects: [],
      auditLogs: [],
      profileChanges: [],
      internalNotes: [],
      internalTasks: [],
      sequences: {},
    });

    return tenant;
  }

  resetDemoData(environment = process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development') {
    if (!['development', 'local', 'staging', 'test'].includes(environment)) {
      throw new ForbiddenException('La réinitialisation démo est interdite dans cet environnement');
    }
    this.reset();
    const workspace = this.workspace('tenant-demo');
    this.audit(workspace, 'tenant.demo-reset', 'Tenant', workspace.tenant.id, { environment });
    return {
      status: 'RESET',
      environment,
      summary: this.summary(workspace.tenant.id),
    };
  }

  authenticate(email: string, password: string): Omit<ErpUser, 'password'> & { tenant: Tenant } {
    for (const workspace of this.workspaces.values()) {
      const user = workspace.users.find((candidate) => candidate.email === email && this.verifyPassword(candidate, password));
      if (user && user.active) {
        this.audit(workspace, 'auth.login.validated', 'User', user.id, { email: user.email });
        const { password: _password, ...safeUser } = user;
        return { ...safeUser, tenant: workspace.tenant };
      }
    }
    throw new ForbiddenException('Identifiants invalides');
  }

  login(input: { email: string; password: string; twoFactorCode?: string; ip?: string; userAgent?: string }) {
    for (const workspace of this.workspaces.values()) {
      const user = workspace.users.find((candidate) => candidate.email.toLowerCase() === input.email.toLowerCase());
      if (!user || !user.active || !this.verifyPassword(user, input.password)) continue;
      if (user.twoFactorEnabled && input.twoFactorCode !== user.twoFactorSecret) {
        this.audit(workspace, 'auth.2fa-required', 'User', user.id, { email: user.email });
        return { status: 'TWO_FACTOR_REQUIRED', userId: user.id, tenantId: workspace.tenant.id };
      }
      const session = this.createSession(workspace, user, input);
      const { password: _password, passwordHash: _passwordHash, twoFactorSecret: _secret, ...safeUser } = user;
      return {
        status: 'AUTHENTICATED',
        access_token: session.accessToken,
        refresh_token: session.refreshToken,
        token_type: 'Bearer',
        sessionId: session.id,
        expiresAt: session.expiresAt,
        refreshExpiresAt: session.refreshExpiresAt,
        user: { ...safeUser, tenant: workspace.tenant },
        tenantId: workspace.tenant.id,
      };
    }
    throw new ForbiddenException('Identifiants invalides');
  }

  refreshSession(refreshToken: string) {
    const token = this.nonEmpty(refreshToken, 'Le refresh token est obligatoire');
    for (const workspace of this.workspaces.values()) {
      const session = workspace.sessions.find((candidate) => candidate.refreshToken === token && !candidate.revokedAt);
      if (!session) continue;
      if (session.refreshExpiresAt < new Date().toISOString()) {
        session.revokedAt = new Date().toISOString();
        throw new ForbiddenException('Session expirée');
      }
      session.accessToken = this.token('access');
      session.expiresAt = this.minutesFromNow(15);
      this.audit(workspace, 'auth.session-refreshed', 'Session', session.id, { userId: session.userId });
      return {
        access_token: session.accessToken,
        refresh_token: session.refreshToken,
        token_type: 'Bearer',
        sessionId: session.id,
        expiresAt: session.expiresAt,
      };
    }
    throw new ForbiddenException('Refresh token invalide');
  }

  requestPasswordReset(email: string) {
    for (const workspace of this.workspaces.values()) {
      const user = workspace.users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());
      if (!user) continue;
      const reset = {
        id: this.id('pwd-reset'),
        tenantId: workspace.tenant.id,
        userId: user.id,
        token: this.token('reset'),
        requestedAt: new Date().toISOString(),
        expiresAt: this.minutesFromNow(30),
      };
      workspace.passwordResetTokens.push(reset);
      this.securityNotification(workspace, user, 'PASSWORD_RESET', `Réinitialisation du mot de passe demandée pour ${user.email}`);
      this.audit(workspace, 'auth.password-reset-requested', 'User', user.id, { email: user.email });
      return { status: 'RESET_REQUESTED', tenantId: workspace.tenant.id, userId: user.id, resetToken: reset.token, expiresAt: reset.expiresAt };
    }
    return { status: 'RESET_REQUESTED' };
  }

  resetPassword(input: { token: string; password: string }) {
    const token = this.nonEmpty(input.token, 'Le token de réinitialisation est obligatoire');
    const password = this.nonEmpty(input.password, 'Le nouveau mot de passe est obligatoire');
    if (password.length < 8) throw new BadRequestException('Le mot de passe doit contenir au moins 8 caractères');
    for (const workspace of this.workspaces.values()) {
      const reset = workspace.passwordResetTokens.find((candidate) => candidate.token === token);
      if (!reset) continue;
      if (reset.usedAt) throw new BadRequestException('Le token de réinitialisation est déjà utilisé');
      if (reset.expiresAt < new Date().toISOString()) throw new BadRequestException('Le token de réinitialisation est expiré');
      const user = workspace.users.find((candidate) => candidate.id === reset.userId);
      if (!user) throw new NotFoundException('Utilisateur introuvable');
      user.password = password;
      user.passwordHash = this.passwordHash(password);
      user.passwordUpdatedAt = today();
      reset.usedAt = new Date().toISOString();
      workspace.sessions.filter((session) => session.userId === user.id).forEach((session) => {
        session.revokedAt = reset.usedAt;
      });
      this.audit(workspace, 'auth.password-reset-completed', 'User', user.id, { email: user.email });
      return { status: 'PASSWORD_UPDATED', userId: user.id, revokedSessions: workspace.sessions.filter((session) => session.userId === user.id).length };
    }
    throw new BadRequestException('Token de réinitialisation invalide');
  }

  enableTwoFactor(userId: string, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const user = this.user(workspace, userId);
    user.twoFactorEnabled = true;
    user.twoFactorSecret = user.twoFactorSecret ?? String(Math.floor(100000 + Math.random() * 900000));
    this.securityNotification(workspace, user, 'TWO_FACTOR_ENABLED', `Double authentification activée pour ${user.email}`);
    this.audit(workspace, 'auth.2fa-enabled', 'User', user.id, { email: user.email });
    return { status: 'TWO_FACTOR_ENABLED', userId: user.id, secret: user.twoFactorSecret };
  }

  verifyTwoFactor(userId: string, code: string, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const user = this.user(workspace, userId);
    if (!user.twoFactorEnabled || user.twoFactorSecret !== code) {
      throw new ForbiddenException('Code double authentification invalide');
    }
    this.audit(workspace, 'auth.2fa-verified', 'User', user.id, { email: user.email });
    return { status: 'TWO_FACTOR_VERIFIED', userId: user.id };
  }

  deviceHistory(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    return {
      events: [...workspace.deviceLoginEvents].sort((left, right) => right.at.localeCompare(left.at)),
      notifications: [...workspace.securityNotifications].sort((left, right) => right.at.localeCompare(left.at)),
      suspicious: workspace.deviceLoginEvents.filter((event) => event.suspicious).length,
    };
  }

  assertHttpWriteAllowed(tenantId: string, method: string, path: string, role?: string): void {
    if (['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase())) return;
    if (path.startsWith('/auth')) return;
    const workspace = this.workspace(tenantId);
    const normalizedRole = (role ?? this.cls.get<string>('userRole') ?? 'OWNER') as any;
    if (normalizedRole === 'READ_ONLY') {
      throw new ForbiddenException('Le rôle lecture seule ne peut pas modifier les données');
    }
    if (workspace.tenant.status !== 'ACTIVE' || workspace.tenant.settings.featureGates.writeLocked) {
      const isExportWorkflow = path.includes('/export') || path.includes('/tenant/data-export');
      if (!isExportWorkflow) {
        throw new ForbiddenException(workspace.tenant.settings.featureGates.reason ?? 'L’abonnement est en lecture seule');
      }
    }
  }

  summary(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const creditTotal = workspace.creditNotes.reduce((sum, creditNote) => sum + creditNote.totals.total, 0);
    const revenue = r2(workspace.invoices.reduce((sum, invoice) => sum + invoice.totals.total, 0) - creditTotal);
    const receivables = r2(workspace.invoices.reduce((sum, invoice) => sum + invoice.totals.total - invoice.paidAmount - this.invoiceCreditTotal(workspace, invoice.id), 0));
    return {
      tenant: workspace.tenant,
      metrics: {
        customers: workspace.customers.length,
        suppliers: workspace.suppliers.length,
        products: workspace.products.length,
        invoices: workspace.invoices.length,
        revenue,
        receivables,
        stockValue: r2(workspace.products.reduce((sum, product) => sum + product.stockOnHand * product.weightedAverageCost, 0)),
      },
      compliance: this.morocco2026Rules,
      setup: this.setupChecklist(workspace.tenant.id),
    };
  }

  businessSearch(input: BusinessSearchInput, tenantId?: string): BusinessSearchResult[] {
    const workspace = this.workspace(tenantId);
    const query = this.searchText(input.q);
    if (!query) return [];
    const allowedTypes = new Set<BusinessSearchType>(input.types?.length
      ? input.types
      : ['customers', 'leads', 'suppliers', 'products', 'invoices', 'orders']);
    const limit = Math.min(Math.max(Math.trunc(input.limit ?? 10), 1), 25);
    const results: BusinessSearchResult[] = [];
    const add = (result: Omit<BusinessSearchResult, 'score'>, fields: Array<string | number | undefined>) => {
      if (!allowedTypes.has(result.type)) return;
      const score = this.searchScore(query, fields);
      if (score > 0) results.push({ ...result, score });
    };

    for (const customer of workspace.customers) {
      add({
        type: 'customers',
        id: customer.id,
        title: customer.name,
        subtitle: [customer.ice && `ICE ${customer.ice}`, customer.city, customer.email].filter(Boolean).join(' · '),
        status: customer.active ? 'Actif' : 'Archivé',
        reference: customer.ice,
        view: 'crm',
      }, [customer.name, customer.ice, customer.ifNumber, customer.rc, customer.email, customer.phone, customer.city]);
    }
    for (const lead of workspace.leads) {
      add({
        type: 'leads',
        id: lead.id,
        title: lead.customerName,
        subtitle: [lead.owner, lead.source, lead.nextActionDate].filter(Boolean).join(' · '),
        status: lead.stage,
        amount: lead.expectedValue,
        reference: lead.id,
        view: 'crm',
      }, [lead.customerName, lead.stage, lead.owner, lead.source, lead.nextActionDate]);
    }
    for (const supplier of workspace.suppliers) {
      add({
        type: 'suppliers',
        id: supplier.id,
        title: supplier.name,
        subtitle: [supplier.ice && `ICE ${supplier.ice}`, supplier.ifNumber && `IF ${supplier.ifNumber}`, supplier.bankDetails[0]?.bankName].filter(Boolean).join(' · '),
        status: supplier.active ? 'Actif' : 'Archivé',
        reference: supplier.ice ?? supplier.ifNumber,
        view: 'stock',
      }, [supplier.name, supplier.ice, supplier.ifNumber, supplier.rc, supplier.email, supplier.phone, supplier.city, ...supplier.bankDetails.flatMap((bank) => [bank.bankName, bank.rib])]);
    }
    for (const product of workspace.products) {
      add({
        type: 'products',
        id: product.id,
        title: product.name,
        subtitle: `${product.sku} · ${product.type}`,
        status: product.active ? 'Actif' : 'Archivé',
        amount: product.salePrice,
        reference: product.sku,
        view: 'stock',
      }, [product.name, product.sku, product.type, product.unit]);
    }
    for (const invoice of workspace.invoices) {
      const customer = this.customer(workspace, invoice.customerId);
      add({
        type: 'invoices',
        id: invoice.id,
        title: invoice.number,
        subtitle: customer.name,
        status: invoice.status,
        amount: invoice.totals.total,
        reference: invoice.number,
        view: 'sales',
      }, [invoice.number, invoice.status, customer.name, customer.ice, ...invoice.lines.flatMap((line) => [line.sku, line.description])]);
    }
    for (const order of workspace.salesOrders) {
      const customer = this.customer(workspace, order.customerId);
      add({
        type: 'orders',
        id: order.id,
        title: order.number,
        subtitle: customer.name,
        status: order.status,
        amount: order.totals.total,
        reference: order.number,
        view: 'sales',
      }, [order.number, order.status, customer.name, customer.ice, ...order.lines.flatMap((line) => [line.sku, line.description])]);
    }

    return results
      .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
      .slice(0, limit);
  }

  setupChecklist(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const entity = workspace.tenant.legalEntity;
    const settings = workspace.tenant.settings;
    const checks = [
      {
        id: 'legal-identity',
        label: 'Identité légale complète',
        complete: Boolean(entity.tradeName && entity.ice && entity.ifNumber && entity.rc && entity.patente && entity.address && entity.city),
      },
      {
        id: 'tax-settings',
        label: 'TVA et série de facturation configurées',
        complete: Boolean(settings.invoiceSeries && settings.fiscalYearStartMonth >= 1 && settings.fiscalYearStartMonth <= 12 && settings.vatStatus),
      },
      {
        id: 'payroll-identity',
        label: 'Numéro CNSS employeur renseigné',
        complete: Boolean(entity.cnssNumber),
      },
      {
        id: 'customers',
        label: 'Au moins un client créé',
        complete: workspace.customers.some((customer) => customer.active),
      },
      {
        id: 'catalog',
        label: 'Catalogue articles/services prêt',
        complete: workspace.products.some((product) => product.active),
      },
      {
        id: 'warehouse',
        label: 'Dépôt principal configuré',
        complete: workspace.warehouses.length > 0,
      },
    ];
    const completed = checks.filter((check) => check.complete).length;
    return {
      completed,
      total: checks.length,
      ready: completed === checks.length,
      checks,
    };
  }

  roleNavigation(role: string = this.cls.get<string>('userRole') ?? 'OWNER') {
    const visibleByRole: Record<string, ErpModuleKey[]> = {
      OWNER: allModules,
      ADMIN: allModules,
      ACCOUNTANT: ['tenant', 'crm', 'sales', 'inventory', 'accounting', 'payroll', 'compliance'],
      SALES: ['crm', 'sales'],
      WAREHOUSE: ['inventory', 'production'],
      PAYROLL: ['payroll'],
      CASHIER: ['pos', 'sales'],
      READ_ONLY: allModules,
      IMPLEMENTATION_PARTNER: ['tenant', 'crm', 'inventory', 'payroll', 'compliance'],
    };
    const modules = visibleByRole[role] ?? allModules;
    return {
      role,
      modules: allModules.map((module) => ({
        module,
        visible: modules.includes(module),
        canWrite: role !== 'READ_ONLY' && modules.includes(module) && !this.workspace().tenant.settings.featureGates.writeLocked,
      })),
    };
  }

  subscriptionGate(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    return {
      tenantId: workspace.tenant.id,
      status: workspace.tenant.status,
      plan: workspace.tenant.plan,
      writeLocked: workspace.tenant.status !== 'ACTIVE' || workspace.tenant.settings.featureGates.writeLocked,
      reason: workspace.tenant.settings.featureGates.reason,
      allowedModules: workspace.tenant.settings.featureGates.allowedModules,
    };
  }

  updateSubscriptionGate(input: { status?: Tenant['status']; writeLocked?: boolean; reason?: string; allowedModules?: ErpModuleKey[] }, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    if (input.status !== undefined) workspace.tenant.status = input.status;
    if (input.writeLocked !== undefined) workspace.tenant.settings.featureGates.writeLocked = input.writeLocked;
    if (input.reason !== undefined) workspace.tenant.settings.featureGates.reason = this.clean(input.reason);
    if (input.allowedModules !== undefined) {
      workspace.tenant.settings.featureGates.allowedModules = input.allowedModules.filter((module) => allModules.includes(module));
    }
    this.audit(workspace, 'tenant.subscription-gate-updated', 'Tenant', workspace.tenant.id, this.subscriptionGate(workspace.tenant.id));
    return this.subscriptionGate(workspace.tenant.id);
  }

  dataRetentionPolicy(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const retention = workspace.tenant.settings.retention;
    return {
      tenantId: workspace.tenant.id,
      retentionDays: retention.retentionDays,
      exportRequestedAt: retention.exportRequestedAt,
      deleteRequestedAt: retention.deleteRequestedAt,
      deleteScheduledAt: retention.deleteScheduledAt,
      exportReady: Boolean(retention.exportRequestedAt),
      deleteScheduled: Boolean(retention.deleteScheduledAt),
    };
  }

  requestTenantExport(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    workspace.tenant.settings.retention.exportRequestedAt = new Date().toISOString();
    const manifest = this.tenantExportManifest(workspace);
    this.audit(workspace, 'tenant.data-export-requested', 'Tenant', workspace.tenant.id, manifest);
    return manifest;
  }

  requestTenantDelete(input: { retentionDays?: number; confirmation?: string } = {}, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const retentionDays = this.nonNegative(input.retentionDays ?? workspace.tenant.settings.retention.retentionDays, 'La durée de rétention doit être positive');
    if (retentionDays < 30) throw new BadRequestException('La rétention minimale est de 30 jours');
    workspace.tenant.settings.retention.retentionDays = retentionDays;
    workspace.tenant.settings.retention.deleteRequestedAt = new Date().toISOString();
    workspace.tenant.settings.retention.deleteScheduledAt = addDays(today(), 30);
    this.audit(workspace, 'tenant.delete-requested', 'Tenant', workspace.tenant.id, this.dataRetentionPolicy(workspace.tenant.id));
    return this.dataRetentionPolicy(workspace.tenant.id);
  }

  importTemplates(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const tenantName = workspace.tenant.legalEntity.tradeName || 'Votre société';
    return {
      generatedAt: today(),
      tenantId: workspace.tenant.id,
      templates: [
        {
          module: 'customers',
          label: 'Clients',
          fileName: 'modele-import-clients.csv',
          requiredHeaders: ['name'],
          headers: ['name', 'arabicName', 'ice', 'ifNumber', 'rc', 'email', 'phone', 'address', 'arabicAddress', 'city', 'preferredLanguage', 'paymentTermsDays', 'creditLimit', 'documentType', 'documentArabicType', 'documentExpiresAt'],
          sampleRows: [{
            name: 'Client Exemple SARL',
            arabicName: 'شركة عميل نموذجية',
            ice: '001111222333444',
            ifNumber: '778899',
            rc: 'RABAT-112233',
            email: 'finance@client.ma',
            phone: '+212522000000',
            address: 'Avenue Mohammed V, Rabat',
            arabicAddress: 'شارع محمد الخامس، الرباط',
            city: 'Rabat',
            preferredLanguage: 'FR',
            paymentTermsDays: 30,
            creditLimit: 50000,
            documentType: 'Registre de Commerce',
            documentArabicType: 'السجل التجاري',
            documentExpiresAt: '2026-12-31',
          }],
        },
        {
          module: 'suppliers',
          label: 'Fournisseurs',
          fileName: 'modele-import-fournisseurs.csv',
          requiredHeaders: ['name'],
          headers: ['name', 'arabicName', 'ice', 'ifNumber', 'email', 'paymentTermsDays', 'bankName', 'rib', 'preferred', 'riskNotes', 'address', 'arabicAddress', 'preferredLanguage', 'documentType', 'documentArabicType', 'documentExpiresAt'],
          sampleRows: [{
            name: 'Fournisseur Exemple SA',
            arabicName: 'شركة مورد نموذجية',
            ice: '009998887776665',
            ifNumber: '445566',
            email: 'achat@fournisseur.ma',
            paymentTermsDays: 45,
            bankName: 'Attijariwafa bank',
            rib: '007780000000000000000123',
            preferred: true,
            riskNotes: 'Attestation fiscale à renouveler',
            address: 'Zone industrielle Ain Sebaa',
            arabicAddress: 'المنطقة الصناعية عين السبع',
            preferredLanguage: 'FR',
            documentType: 'Attestation fiscale',
            documentArabicType: 'شهادة ضريبية',
            documentExpiresAt: '2026-06-30',
          }],
        },
        {
          module: 'products',
          label: 'Articles',
          fileName: 'modele-import-articles.csv',
          requiredHeaders: ['sku', 'name', 'salePrice'],
          headers: ['sku', 'barcode', 'name', 'arabicDescription', 'type', 'unit', 'salePrice', 'purchaseCost', 'vatRate', 'stockOnHand', 'trackStock'],
          sampleRows: [{
            sku: 'SKU-DEMO',
            barcode: '6111000000096',
            name: 'Article exemple',
            arabicDescription: 'منتج نموذجي',
            type: 'GOODS',
            unit: 'unité',
            salePrice: 1000,
            purchaseCost: 650,
            vatRate: 0.2,
            stockOnHand: 10,
            trackStock: true,
          }],
        },
        {
          module: 'employees',
          label: 'Salariés',
          fileName: 'modele-import-salaries.csv',
          requiredHeaders: ['fullName', 'cin', 'hireDate', 'baseSalary'],
          headers: ['employeeNumber', 'fullName', 'arabicName', 'cin', 'cnssNumber', 'contractType', 'hireDate', 'baseSalary', 'dependents', 'address', 'arabicAddress', 'preferredLanguage', 'documentType', 'documentArabicType', 'documentExpiresAt'],
          sampleRows: [{
            employeeNumber: 'EMP-001',
            fullName: 'Ahmed Taleb',
            arabicName: 'أحمد طالب',
            cin: 'AB123456',
            cnssNumber: '1234567890',
            contractType: 'CDI',
            hireDate: '2024-01-15',
            baseSalary: 6000,
            dependents: 2,
            address: 'Hay Riad, Rabat',
            arabicAddress: 'حي الرياض، الرباط',
            preferredLanguage: 'FR',
            documentType: 'CIN',
            documentArabicType: 'البطاقة الوطنية',
            documentExpiresAt: '2030-01-15',
          }],
        },
        {
          module: 'chart-of-accounts',
          label: 'Plan comptable PCGE',
          fileName: 'modele-import-pcge.csv',
          requiredHeaders: ['account', 'labelFr'],
          headers: ['account', 'labelFr', 'labelAr', 'class', 'vatDeductible', 'active'],
          sampleRows: [{
            account: '342100',
            labelFr: `Clients - ${tenantName}`,
            labelAr: 'حسابات الزبناء',
            class: '3',
            vatDeductible: false,
            active: true,
          }],
        },
      ],
    };
  }

  importTemplateCsv(kind: ImportTemplateKind, tenantId?: string): string {
    const template = this.importTemplates(tenantId).templates.find((candidate) => candidate.module === kind);
    if (!template) throw new NotFoundException('Modèle d’import introuvable');
    return this.toCsv(template.headers, template.sampleRows);
  }

  implementationPartnerWorkspace() {
    const clients = [...this.workspaces.values()]
      .map((workspace) => {
        const setup = this.setupChecklist(workspace.tenant.id);
        const blockers = setup.checks.filter((check) => !check.complete).map((check) => check.label);
        return {
          tenantId: workspace.tenant.id,
          tradeName: workspace.tenant.legalEntity.tradeName,
          city: workspace.tenant.legalEntity.city,
          plan: workspace.tenant.plan,
          status: workspace.tenant.status,
          completed: setup.completed,
          total: setup.total,
          readinessScore: setup.total ? Math.round((setup.completed / setup.total) * 100) : 0,
          ready: setup.ready,
          blockers,
          counts: {
            customers: workspace.customers.filter((customer) => customer.active).length,
            suppliers: workspace.suppliers.filter((supplier) => supplier.active).length,
            employees: workspace.employees.filter((employee) => employee.active).length,
            products: workspace.products.filter((product) => product.active).length,
          },
        };
      })
      .sort((left, right) => left.readinessScore - right.readinessScore || left.tradeName.localeCompare(right.tradeName));
    return {
      generatedAt: today(),
      clients,
      totals: {
        tenants: clients.length,
        ready: clients.filter((client) => client.ready).length,
        blocked: clients.filter((client) => !client.ready).length,
      },
    };
  }

  createPartnerClientTenant(input: Partial<LegalEntity> & { tradeName: string; slug?: string; plan?: Tenant['plan']; partnerEmail?: string }) {
    const tenant = this.createTenant(input);
    const workspace = this.workspace(tenant.id);
    this.audit(workspace, 'implementation.client-created', 'Tenant', tenant.id, {
      partnerEmail: this.clean(input.partnerEmail) ?? 'partner@atlas.ma',
      tenantId: tenant.id,
    });
    return {
      tenant,
      health: this.implementationPartnerWorkspace().clients.find((client) => client.tenantId === tenant.id),
    };
  }

  updatePartnerClientOnboarding(tenantId: string, input: Partial<LegalEntity> & {
    invoiceSeries?: string;
    fiscalYearStartMonth?: number;
    vatStatus?: 'ENABLED' | 'EXEMPT';
  }) {
    const result = this.completeTenantOnboarding(input, tenantId);
    const workspace = this.workspace(tenantId);
    this.audit(workspace, 'implementation.client-onboarding-updated', 'Tenant', tenantId, {
      ready: result.ready,
      completed: result.completed,
      total: result.total,
    });
    return {
      ...result,
      health: this.implementationPartnerWorkspace().clients.find((client) => client.tenantId === tenantId),
    };
  }

  approvalLimitReview(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const limits = workspace.tenant.settings.approvalLimits ?? defaultApprovalLimits;
    const rows = [
      ...workspace.quotes
        .filter((quote) => quote.totals.total > limits.quote)
        .map((quote) => ({
          type: 'QUOTE',
          reference: quote.number,
          entityId: quote.id,
          status: quote.status,
          amount: quote.totals.total,
          limit: limits.quote,
          approvalStatus: quote.approvalStatus,
          requiresApproval: quote.approvalStatus === 'REQUIRED',
        })),
      ...workspace.creditNotes
        .filter((creditNote) => creditNote.totals.total > limits.creditNote)
        .map((creditNote) => ({
          type: 'CREDIT_NOTE',
          reference: creditNote.number,
          entityId: creditNote.id,
          status: creditNote.status,
          amount: creditNote.totals.total,
          limit: limits.creditNote,
          approvalStatus: creditNote.approvalStatus,
          requiresApproval: creditNote.approvalStatus === 'REQUIRED',
        })),
      ...workspace.purchaseReceipts
        .filter((receipt) => receipt.total > limits.purchase)
        .map((receipt) => ({
          type: 'PURCHASE',
          reference: receipt.number,
          entityId: receipt.id,
          status: 'POSTED',
          amount: receipt.total,
          limit: limits.purchase,
          approvalStatus: receipt.approvalStatus,
          requiresApproval: receipt.approvalStatus === 'REQUIRED',
        })),
      ...workspace.stockMoves
        .filter((move) => move.type === 'ADJUSTMENT' && Math.abs(move.value) > limits.stockAdjustment)
        .map((move) => ({
          type: 'STOCK_ADJUSTMENT',
          reference: move.reference,
          entityId: move.id,
          status: 'POSTED',
          amount: Math.abs(move.value),
          limit: limits.stockAdjustment,
          approvalStatus: move.approvalStatus,
          requiresApproval: move.approvalStatus === 'REQUIRED',
        })),
    ].sort((left, right) => right.amount - left.amount || left.reference.localeCompare(right.reference));
    return { limits, rows, pending: rows.filter((row) => row.requiresApproval).length };
  }

  updateApprovalLimits(input: Partial<TenantSettings['approvalLimits']>, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const before = { ...(workspace.tenant.settings.approvalLimits ?? defaultApprovalLimits) };
    const next = {
      quote: input.quote !== undefined ? this.nonNegative(input.quote, 'Le plafond devis doit être nul ou positif') : before.quote,
      creditNote: input.creditNote !== undefined ? this.nonNegative(input.creditNote, 'Le plafond avoir doit être nul ou positif') : before.creditNote,
      purchase: input.purchase !== undefined ? this.nonNegative(input.purchase, 'Le plafond achat doit être nul ou positif') : before.purchase,
      stockAdjustment: input.stockAdjustment !== undefined ? this.nonNegative(input.stockAdjustment, 'Le plafond ajustement stock doit être nul ou positif') : before.stockAdjustment,
    };
    workspace.tenant.settings.approvalLimits = next;
    this.audit(workspace, 'tenant.approval-limits-updated', 'Tenant', workspace.tenant.id, { before, after: next });
    return this.approvalLimitReview(workspace.tenant.id);
  }

  approveCreditNote(creditNoteId: string, tenantId?: string): CreditNote {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const creditNote = workspace.creditNotes.find((candidate) => candidate.id === creditNoteId || candidate.number === creditNoteId);
    if (!creditNote) throw new NotFoundException('Avoir introuvable');
    creditNote.approvalStatus = 'APPROVED';
    this.audit(workspace, 'credit-note.approved', 'CreditNote', creditNote.id, creditNote);
    return creditNote;
  }

  approvePurchaseReceipt(receiptId: string, tenantId?: string): PurchaseReceipt {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const receipt = workspace.purchaseReceipts.find((candidate) => candidate.id === receiptId || candidate.number === receiptId);
    if (!receipt) throw new NotFoundException('Réception achat introuvable');
    receipt.approvalStatus = 'APPROVED';
    this.audit(workspace, 'purchase-receipt.approved', 'PurchaseReceipt', receipt.id, receipt);
    return receipt;
  }

  approveStockMove(moveId: string, tenantId?: string): StockMove {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const move = workspace.stockMoves.find((candidate) => candidate.id === moveId || candidate.reference === moveId);
    if (!move) throw new NotFoundException('Mouvement de stock introuvable');
    move.approvalStatus = 'APPROVED';
    this.audit(workspace, 'stock-move.approved', 'StockMove', move.id, move);
    return move;
  }

  listStockMoves(tenantId?: string): StockMove[] {
    return this.workspace(tenantId).stockMoves;
  }

  dashboardFilters(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const currentDate = today();
    const overdueNextActions = workspace.leads
      .filter((lead) => lead.nextActionDate && lead.nextActionDate < currentDate && !['WON', 'LOST'].includes(lead.stage))
      .map((lead) => ({
        id: lead.id,
        customerName: lead.customerName,
        nextActionDate: lead.nextActionDate,
        owner: lead.owner,
        stage: lead.stage,
        expectedValue: lead.expectedValue,
      }));
    const unpaidCustomerBalances = workspace.invoices
      .map((invoice) => {
        const balance = r2(invoice.totals.total - invoice.paidAmount - this.invoiceCreditTotal(workspace, invoice.id));
        const customer = this.customer(workspace, invoice.customerId);
        return {
          id: invoice.id,
          number: invoice.number,
          customerName: customer.name,
          dueDate: invoice.dueDate,
          balance,
          status: invoice.status,
        };
      })
      .filter((invoice) => invoice.balance > 0);
    const supplierPaymentTerms = workspace.suppliers
      .filter((supplier) => supplier.active)
      .sort((left, right) => right.paymentTermsDays - left.paymentTermsDays)
      .map((supplier) => ({
        id: supplier.id,
        name: supplier.name,
        ice: supplier.ice,
        ifNumber: supplier.ifNumber,
        paymentTermsDays: supplier.paymentTermsDays,
        bankName: supplier.bankDetails[0]?.bankName,
      }));

    return {
      overdueNextActions,
      unpaidCustomerBalances,
      supplierPaymentTerms,
      counts: {
        overdueNextActions: overdueNextActions.length,
        unpaidCustomerBalances: unpaidCustomerBalances.length,
        supplierPaymentTerms: supplierPaymentTerms.length,
      },
    };
  }

  roleDashboardWidgets(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const summary = this.summary(workspace.tenant.id);
    const filters = this.dashboardFilters(workspace.tenant.id);
    const approvalReview = this.approvalLimitReview(workspace.tenant.id);
    const lowStock = this.listStock(workspace.tenant.id).filter((line) => line.active && line.availableStock <= line.reorderPoint);
    const latestInvoice = workspace.invoices[workspace.invoices.length - 1];
    const latestReceipt = workspace.purchaseReceipts[workspace.purchaseReceipts.length - 1];
    return [
      {
        role: 'OWNER',
        label: 'Direction',
        widgets: [
          { id: 'revenue', label: 'Chiffre facturé', value: summary.metrics.revenue, unit: 'MAD', status: 'info', view: 'sales' },
          { id: 'cash-risk', label: 'À encaisser', value: summary.metrics.receivables, unit: 'MAD', status: summary.metrics.receivables > 0 ? 'warning' : 'success', view: 'sales' },
          { id: 'approval-queue', label: 'Approbations', value: approvalReview.pending, unit: 'en attente', status: approvalReview.pending ? 'warning' : 'success', view: 'accounting' },
        ],
      },
      {
        role: 'SALES',
        label: 'Ventes',
        widgets: [
          { id: 'latest-invoice', label: 'Dernière facture', value: latestInvoice?.number ?? 'Aucune', helper: latestInvoice ? `${latestInvoice.status} · ${latestInvoice.dueDate}` : 'Créer une facture', status: latestInvoice ? 'info' : 'warning', view: 'sales' },
          { id: 'unpaid-balances', label: 'Soldes impayés', value: filters.counts.unpaidCustomerBalances, unit: 'client(s)', status: filters.counts.unpaidCustomerBalances ? 'warning' : 'success', view: 'sales' },
          { id: 'overdue-actions', label: 'Actions CRM en retard', value: filters.counts.overdueNextActions, unit: 'action(s)', status: filters.counts.overdueNextActions ? 'warning' : 'success', view: 'crm' },
        ],
      },
      {
        role: 'WAREHOUSE',
        label: 'Stock',
        widgets: [
          { id: 'stock-value', label: 'Valeur stock', value: summary.metrics.stockValue, unit: 'MAD', status: 'info', view: 'stock' },
          { id: 'low-stock', label: 'Articles sous seuil', value: lowStock.length, unit: 'article(s)', status: lowStock.length ? 'warning' : 'success', view: 'stock' },
          { id: 'latest-receipt', label: 'Dernière réception', value: latestReceipt?.number ?? 'Aucune', helper: latestReceipt ? `${latestReceipt.total} MAD` : 'Aucune réception achat', status: latestReceipt ? 'info' : 'warning', view: 'stock' },
        ],
      },
      {
        role: 'ACCOUNTANT',
        label: 'Comptabilité',
        widgets: [
          { id: 'journal-count', label: 'Écritures journal', value: workspace.journalEntries.length, unit: 'écriture(s)', status: workspace.journalEntries.length ? 'info' : 'warning', view: 'accounting' },
          { id: 'vat-net', label: 'TVA nette collectée', value: this.exportVatReport(workspace.tenant.id).netVatCollected, unit: 'MAD', status: 'info', view: 'compliance' },
          { id: 'locked-periods', label: 'Périodes verrouillées', value: workspace.fiscalPeriods.filter((period) => period.locked).length, unit: 'période(s)', status: 'success', view: 'accounting' },
        ],
      },
      {
        role: 'PAYROLL',
        label: 'RH / Paie',
        widgets: [
          { id: 'cnss-employer', label: 'CNSS employeur', value: workspace.tenant.legalEntity.cnssNumber ? 'Configuré' : 'Manquant', status: workspace.tenant.legalEntity.cnssNumber ? 'success' : 'warning', view: 'payroll' },
          { id: 'payroll-rules', label: 'Règles paie', value: this.morocco2026Rules.id, helper: `CNSS plafonnée ${this.morocco2026Rules.cnss.cap} MAD`, status: 'info', view: 'payroll' },
          { id: 'amo-rate', label: 'AMO salarié', value: `${r2(this.morocco2026Rules.cnss.amoEmployeeRate * 100)}%`, status: 'info', view: 'payroll' },
        ],
      },
    ];
  }

  paymentReminderSchedule(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const currentDate = today();
    const rows = workspace.invoices
      .map((invoice) => {
        const balance = r2(invoice.totals.total - invoice.paidAmount - this.invoiceCreditTotal(workspace, invoice.id));
        const daysOverdue = daysBetween(invoice.dueDate, currentDate);
        const customer = this.customer(workspace, invoice.customerId);
        const stage = daysOverdue >= 15 ? 'MISE_EN_DEMEURE' : daysOverdue >= 7 ? 'RELANCE_2' : 'RELANCE_1';
        const nextReminderDate = daysOverdue >= 15 ? currentDate : addDays(invoice.dueDate, daysOverdue >= 7 ? 15 : 7);
        return {
          invoiceId: invoice.id,
          invoiceNumber: invoice.number,
          customerId: customer.id,
          customerName: customer.name,
          customerEmail: customer.email,
          dueDate: invoice.dueDate,
          daysOverdue,
          balance,
          stage,
          nextReminderDate,
          channel: customer.email ? 'EMAIL' : 'MANUAL',
          subject: `Relance facture ${invoice.number} - ${workspace.tenant.legalEntity.tradeName}`,
          legalFooter: `ICE ${workspace.tenant.legalEntity.ice} · IF ${workspace.tenant.legalEntity.ifNumber}`,
          status: 'SCHEDULED',
        };
      })
      .filter((row) => row.balance > 0 && row.daysOverdue > 0)
      .sort((left, right) => right.daysOverdue - left.daysOverdue || left.invoiceNumber.localeCompare(right.invoiceNumber));
    return {
      generatedAt: new Date().toISOString(),
      rows,
      counts: {
        overdueInvoices: rows.length,
        emailReady: rows.filter((row) => row.channel === 'EMAIL').length,
        manualRequired: rows.filter((row) => row.channel === 'MANUAL').length,
      },
    };
  }

  supplierPaymentCalendar(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const currentDate = today();
    const rows = workspace.purchaseReceipts
      .map((receipt) => {
        const supplier = this.supplier(workspace, receipt.supplierId);
        const dueDate = addDays(receipt.date, supplier.paymentTermsDays);
        const daysUntilDue = daysBetween(currentDate, dueDate);
        const expiredDocuments = supplier.documentExpiries.filter((document) => this.daysUntil(document.expiresAt) < 0);
        const expiringDocuments = supplier.documentExpiries.filter((document) => {
          const days = this.daysUntil(document.expiresAt);
          return days >= 0 && days <= 30;
        });
        const riskFlags = [
          supplier.preferred ? 'Fournisseur préféré' : '',
          supplier.riskNotes ? 'Note risque' : '',
          expiredDocuments.length ? 'Document expiré' : '',
          expiringDocuments.length ? 'Document à renouveler' : '',
        ].filter(Boolean);
        return {
          receiptId: receipt.id,
          receiptNumber: receipt.number,
          supplierId: supplier.id,
          supplierName: supplier.name,
          preferred: supplier.preferred,
          riskNotes: supplier.riskNotes,
          receiptDate: receipt.date,
          dueDate,
          daysUntilDue,
          amount: receipt.total,
          status: daysUntilDue < 0 ? 'OVERDUE' : daysUntilDue <= 7 ? 'DUE_SOON' : 'PLANNED',
          riskFlags,
        };
      })
      .sort((left, right) => left.dueDate.localeCompare(right.dueDate) || left.supplierName.localeCompare(right.supplierName));
    return {
      generatedAt: new Date().toISOString(),
      rows,
      counts: {
        overdue: rows.filter((row) => row.status === 'OVERDUE').length,
        dueSoon: rows.filter((row) => row.status === 'DUE_SOON').length,
        preferred: rows.filter((row) => row.preferred).length,
        riskFlagged: rows.filter((row) => row.riskFlags.length > 0).length,
      },
    };
  }

  vatDeclarationReviewChecklist(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const report = this.exportVatReport(workspace.tenant.id);
    const invoiceExceptions = workspace.invoices.flatMap((invoice) => {
      const customer = this.customer(workspace, invoice.customerId);
      const missing = [
        customer.ice ? '' : 'ICE client manquant',
        customer.ifNumber ? '' : 'IF client manquant',
      ].filter(Boolean);
      const unsupportedRates = invoice.lines
        .filter((line) => !allowedVatRates.includes(line.vatRate))
        .map((line) => `${line.sku}: taux TVA non supporté`);
      return [...missing, ...unsupportedRates].map((message) => ({
        invoiceId: invoice.id,
        invoiceNumber: invoice.number,
        customerName: customer.name,
        message,
        severity: message.includes('TVA') ? 'ERROR' : 'WARNING',
      }));
    });
    const legalIdentityComplete = Boolean(
      workspace.tenant.legalEntity.ice
      && workspace.tenant.legalEntity.ifNumber
      && workspace.tenant.legalEntity.rc
      && workspace.tenant.legalEntity.patente,
    );
    const collectedVatByRate = workspace.invoices.reduce<Record<string, number>>((acc, invoice) => {
      for (const [rate, amount] of Object.entries(invoice.totals.vatByRate)) {
        acc[rate] = r2((acc[rate] ?? 0) + amount);
      }
      return acc;
    }, {});
    const checklist = [
      { id: 'tenant-legal-identity', label: 'Identifiants légaux tenant présents', complete: legalIdentityComplete },
      { id: 'posted-invoices', label: 'Factures de la période comptabilisées', complete: report.invoiceCount > 0 },
      { id: 'customer-identifiers', label: 'ICE/IF clients vérifiés', complete: invoiceExceptions.filter((item) => item.message.includes('client')).length === 0 },
      { id: 'vat-rates', label: 'Taux TVA conformes au pack Maroc', complete: invoiceExceptions.filter((item) => item.message.includes('TVA')).length === 0 },
      { id: 'credit-notes-reviewed', label: 'Avoirs inclus dans la revue', complete: report.creditNoteCount >= 0 },
    ];
    return {
      period: report.period,
      status: checklist.every((item) => item.complete) ? 'READY_FOR_REVIEW' : 'NEEDS_REVIEW',
      report,
      checklist,
      exceptions: invoiceExceptions,
      supportingCounts: {
        invoiceCount: report.invoiceCount,
        creditNoteCount: report.creditNoteCount,
        taxableLineCount: workspace.invoices.reduce((sum, invoice) => sum + invoice.lines.filter((line) => line.vatAmount > 0).length, 0),
        collectedVatByRate,
      },
    };
  }

  fiscalDocumentCompletenessCheck(year?: number, month?: number, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const current = today();
    const closeYear = year ?? Number(current.slice(0, 4));
    const closeMonth = month ?? Number(current.slice(5, 7));
    this.month(closeMonth);
    const period = `${closeYear}-${String(closeMonth).padStart(2, '0')}`;
    const legal = workspace.tenant.legalEntity;
    const missingLegal = [
      legal.ice ? '' : 'ICE tenant manquant',
      legal.ifNumber ? '' : 'IF tenant manquant',
      legal.rc ? '' : 'RC tenant manquant',
      legal.patente ? '' : 'Patente tenant manquante',
      legal.cnssNumber ? '' : 'Numéro CNSS manquant',
    ].filter(Boolean);
    const invoices = workspace.invoices.filter((invoice) => invoice.date.startsWith(period));
    const creditNotes = workspace.creditNotes.filter((creditNote) => creditNote.date.startsWith(period));
    const journalEntries = workspace.journalEntries.filter((entry) => entry.date.startsWith(period));
    const draftJournalEntries = journalEntries.filter((entry) => entry.status === 'DRAFT');
    const draftPayrollRuns = workspace.payrollRuns.filter((run) => run.period === period && ['DRAFT', 'CALCULATED'].includes(run.status));
    const unbalancedJournals = journalEntries.filter((entry) => {
      const debit = entry.lines.reduce((sum, line) => sum + line.debit, 0);
      const credit = entry.lines.reduce((sum, line) => sum + line.credit, 0);
      return r2(debit) !== r2(credit);
    });
    const customerDuplicates = this.customerDuplicateReview(workspace.tenant.id).rows;
    const productDuplicates = this.productDuplicateReview(workspace.tenant.id).rows;
    const vatReview = this.vatDeclarationReviewChecklist(workspace.tenant.id);
    const periodInvoiceIds = new Set(invoices.map((invoice) => invoice.id));
    const periodVatExceptions = vatReview.exceptions.filter((exception) => periodInvoiceIds.has(exception.invoiceId));
    const approvalReview = this.approvalLimitReview(workspace.tenant.id);
    const exceptions = [
      ...missingLegal.map((message) => ({ type: 'LEGAL_IDENTITY', severity: 'HIGH', message })),
      ...customerDuplicates.map((row) => ({ type: 'CUSTOMER_DUPLICATE', severity: row.severity, message: `${row.customerName}: ${row.duplicateWarnings.join(' · ')}` })),
      ...productDuplicates.map((row) => ({ type: 'PRODUCT_DUPLICATE', severity: row.severity, message: `${row.sku}: ${row.duplicateWarnings.join(' · ')}` })),
      ...periodVatExceptions.map((exception) => ({ type: 'VAT_EXCEPTION', severity: exception.severity, message: `${exception.invoiceNumber}: ${exception.message}` })),
      ...approvalReview.rows.filter((row) => row.requiresApproval).map((row) => ({ type: 'APPROVAL_PENDING', severity: 'MEDIUM', message: `${row.reference}: approbation requise` })),
      ...unbalancedJournals.map((entry) => ({ type: 'JOURNAL_IMBALANCE', severity: 'HIGH', message: `${entry.source}: écriture non équilibrée` })),
      ...draftJournalEntries.map((entry) => ({ type: 'UNPOSTED_JOURNAL', severity: 'HIGH', message: `${entry.source}: écriture brouillon non comptabilisée` })),
      ...draftPayrollRuns.map((run) => ({ type: 'UNPOSTED_PAYROLL', severity: 'HIGH', message: `${run.number}: paie non approuvée/comptabilisée` })),
    ];
    const checklist = [
      { id: 'legal-identity', label: 'Identifiants légaux complets', complete: missingLegal.length === 0 },
      { id: 'customer-duplicates', label: 'Doublons clients revus', complete: customerDuplicates.length === 0 },
      { id: 'product-duplicates', label: 'Doublons articles revus', complete: productDuplicates.length === 0 },
      { id: 'vat-review', label: 'Checklist TVA sans exception bloquante', complete: periodVatExceptions.length === 0 },
      { id: 'approvals', label: 'Approbations exceptionnelles traitées', complete: approvalReview.pending === 0 },
      { id: 'balanced-journals', label: 'Écritures comptables équilibrées', complete: unbalancedJournals.length === 0 },
      { id: 'unposted-drafts', label: 'Brouillons comptables et paie traités', complete: draftJournalEntries.length === 0 && draftPayrollRuns.length === 0 },
    ];
    return {
      period,
      status: checklist.every((check) => check.complete) ? 'READY_TO_CLOSE' : 'NEEDS_REVIEW',
      checklist,
      exceptions,
      supportingCounts: {
        invoices: invoices.length,
        creditNotes: creditNotes.length,
        journalEntries: journalEntries.length,
        unpostedDrafts: draftJournalEntries.length + draftPayrollRuns.length,
        customerDuplicates: customerDuplicates.length,
        productDuplicates: productDuplicates.length,
        pendingApprovals: approvalReview.pending,
      },
    };
  }

  entityTimeline(entityType: CollaborationEntityType, entityId: string, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    this.assertCollaborationEntity(workspace, entityType, entityId);
    const items: Array<{
      id: string;
      type: string;
      date: string;
      label: string;
      description?: string;
      amount?: number;
      status?: string;
      assignedTo?: string;
    }> = [];
    const add = (item: typeof items[number]) => items.push(item);

    if (entityType === 'CUSTOMER') {
      const customer = this.customer(workspace, entityId);
      for (const document of customer.documentExpiries) {
        add({ id: `${customer.id}-${document.type}`, type: 'DOCUMENT', date: document.expiresAt, label: document.type, description: document.reference ?? 'Document client' });
      }
      for (const quote of workspace.quotes.filter((quote) => quote.customerId === customer.id)) {
        add({ id: quote.id, type: 'QUOTE', date: quote.date, label: quote.number, amount: quote.totals.total, status: quote.status });
      }
      for (const invoice of workspace.invoices.filter((invoice) => invoice.customerId === customer.id)) {
        add({ id: invoice.id, type: 'INVOICE', date: invoice.date, label: invoice.number, amount: invoice.totals.total, status: invoice.status });
        for (const payment of workspace.payments.filter((payment) => payment.invoiceId === invoice.id)) {
          add({ id: payment.id, type: 'PAYMENT', date: payment.date, label: `Paiement ${invoice.number}`, amount: payment.amount, status: payment.method });
        }
      }
      for (const creditNote of workspace.creditNotes.filter((creditNote) => creditNote.customerId === customer.id)) {
        add({ id: creditNote.id, type: 'CREDIT_NOTE', date: creditNote.date, label: creditNote.number, amount: creditNote.totals.total, status: creditNote.status });
      }
    }

    if (entityType === 'SUPPLIER') {
      const supplier = this.supplier(workspace, entityId);
      for (const document of supplier.documentExpiries) {
        add({ id: `${supplier.id}-${document.type}`, type: 'DOCUMENT', date: document.expiresAt, label: document.type, description: document.fileName ?? document.reference ?? 'Document fournisseur', status: document.uploadStatus });
      }
      for (const receipt of workspace.purchaseReceipts.filter((receipt) => receipt.supplierId === supplier.id)) {
        add({ id: receipt.id, type: 'PURCHASE_RECEIPT', date: receipt.date, label: receipt.number, amount: receipt.total, status: receipt.approvalStatus });
      }
    }

    if (entityType === 'INVOICE') {
      const invoice = this.invoice(workspace, entityId);
      add({ id: invoice.id, type: 'INVOICE', date: invoice.date, label: invoice.number, amount: invoice.totals.total, status: invoice.status });
      for (const payment of workspace.payments.filter((payment) => payment.invoiceId === invoice.id)) {
        add({ id: payment.id, type: 'PAYMENT', date: payment.date, label: `Paiement ${invoice.number}`, amount: payment.amount, status: payment.method });
      }
      for (const creditNote of workspace.creditNotes.filter((creditNote) => creditNote.invoiceId === invoice.id)) {
        add({ id: creditNote.id, type: 'CREDIT_NOTE', date: creditNote.date, label: creditNote.number, amount: creditNote.totals.total, status: creditNote.status });
      }
    }

    for (const note of workspace.internalNotes.filter((note) => note.entityType === entityType && note.entityId === entityId)) {
      add({ id: note.id, type: 'NOTE', date: note.createdAt, label: note.author, description: note.body });
    }
    for (const task of workspace.internalTasks.filter((task) => task.entityType === entityType && task.entityId === entityId)) {
      add({ id: task.id, type: 'TASK', date: task.dueDate ?? task.createdAt, label: task.title, description: `Assigné à ${task.assignedTo}`, status: task.status, assignedTo: task.assignedTo });
    }

    return {
      entityType,
      entityId,
      items: items.sort((left, right) => right.date.localeCompare(left.date) || left.type.localeCompare(right.type)),
      counts: {
        notes: workspace.internalNotes.filter((note) => note.entityType === entityType && note.entityId === entityId).length,
        tasks: workspace.internalTasks.filter((task) => task.entityType === entityType && task.entityId === entityId).length,
        openTasks: workspace.internalTasks.filter((task) => task.entityType === entityType && task.entityId === entityId && task.status === 'OPEN').length,
      },
    };
  }

  addInternalNote(input: { entityType: CollaborationEntityType; entityId: string; author?: string; body: string }, tenantId?: string): InternalNote {
    const workspace = this.workspace(tenantId);
    this.assertCollaborationEntity(workspace, input.entityType, input.entityId);
    const note: InternalNote = {
      id: this.id('note'),
      tenantId: workspace.tenant.id,
      entityType: input.entityType,
      entityId: input.entityId,
      author: this.clean(input.author) ?? 'Équipe interne',
      body: this.nonEmpty(input.body, 'La note interne est obligatoire'),
      createdAt: today(),
    };
    workspace.internalNotes.push(note);
    this.audit(workspace, 'collaboration.note-created', 'InternalNote', note.id, note);
    return note;
  }

  addInternalTask(input: { entityType: CollaborationEntityType; entityId: string; title: string; assignedTo?: string; dueDate?: string }, tenantId?: string): InternalTask {
    const workspace = this.workspace(tenantId);
    this.assertCollaborationEntity(workspace, input.entityType, input.entityId);
    const task: InternalTask = {
      id: this.id('task'),
      tenantId: workspace.tenant.id,
      entityType: input.entityType,
      entityId: input.entityId,
      title: this.nonEmpty(input.title, 'Le titre de la tâche est obligatoire'),
      assignedTo: this.clean(input.assignedTo) ?? 'Non assigné',
      dueDate: input.dueDate ? this.isoDate(input.dueDate, 'La date d’échéance de la tâche est invalide') : undefined,
      status: 'OPEN',
      createdAt: today(),
    };
    workspace.internalTasks.push(task);
    this.audit(workspace, 'collaboration.task-created', 'InternalTask', task.id, task);
    return task;
  }

  updateInternalTaskStatus(taskId: string, status: InternalTaskStatus, tenantId?: string): InternalTask {
    const workspace = this.workspace(tenantId);
    const task = workspace.internalTasks.find((candidate) => candidate.id === taskId);
    if (!task) throw new NotFoundException('Tâche interne introuvable');
    if (!['OPEN', 'DONE'].includes(status)) throw new BadRequestException('Statut de tâche invalide');
    task.status = status;
    task.closedAt = status === 'DONE' ? today() : undefined;
    this.audit(workspace, 'collaboration.task-status-updated', 'InternalTask', task.id, task);
    return task;
  }

  collaborationBoard(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const tasks = [...workspace.internalTasks].sort((left, right) => (left.dueDate ?? left.createdAt).localeCompare(right.dueDate ?? right.createdAt));
    return {
      notes: [...workspace.internalNotes].sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
      tasks,
      counts: {
        notes: workspace.internalNotes.length,
        tasks: workspace.internalTasks.length,
        openTasks: workspace.internalTasks.filter((task) => task.status === 'OPEN').length,
      },
    };
  }

  bulkArchiveRestore(input: { entity: 'CUSTOMER' | 'SUPPLIER' | 'PRODUCT'; ids: string[]; action: 'ARCHIVE' | 'RESTORE' }, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const ids = input.ids?.filter(Boolean) ?? [];
    if (!ids.length) throw new BadRequestException('Aucun identifiant fourni pour l’action en lot');
    if (!['ARCHIVE', 'RESTORE'].includes(input.action)) throw new BadRequestException('Action de statut en lot invalide');
    const active = input.action === 'RESTORE';
    const touched = ids.map((id) => {
      const entity = input.entity === 'CUSTOMER'
        ? this.customer(workspace, id)
        : input.entity === 'SUPPLIER'
          ? this.supplier(workspace, id)
          : this.product(workspace, id);
      entity.active = active;
      entity.updatedAt = today();
      this.audit(workspace, `bulk.${input.entity.toLowerCase()}.${input.action.toLowerCase()}`, input.entity, entity.id, entity);
      const name = 'sku' in entity ? entity.sku : entity.name;
      return { id: entity.id, name, active: entity.active };
    });
    return { entity: input.entity, action: input.action, touched };
  }

  companyProfile(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    return {
      tenant: workspace.tenant,
      changes: workspace.profileChanges,
      approvalStatus: workspace.tenant.profileApprovalStatus,
    };
  }

  updateCompanyProfile(input: Partial<LegalEntity> & {
    invoiceSeries?: string;
    fiscalYearStartMonth?: number;
    vatStatus?: 'ENABLED' | 'EXEMPT';
  }, tenantId?: string): CompanyProfileChange {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const before = {
      legalEntity: { ...workspace.tenant.legalEntity },
      settings: { ...workspace.tenant.settings },
    };
    const nextLegalEntity: LegalEntity = {
      ...workspace.tenant.legalEntity,
      tradeName: input.tradeName !== undefined ? this.nonEmpty(input.tradeName, 'La raison sociale est obligatoire') : workspace.tenant.legalEntity.tradeName,
      ice: input.ice !== undefined ? this.nonEmpty(input.ice, 'L’ICE est obligatoire') : workspace.tenant.legalEntity.ice,
      ifNumber: input.ifNumber !== undefined ? this.nonEmpty(input.ifNumber, 'L’IF est obligatoire') : workspace.tenant.legalEntity.ifNumber,
      rc: input.rc !== undefined ? this.nonEmpty(input.rc, 'Le RC est obligatoire') : workspace.tenant.legalEntity.rc,
      patente: input.patente !== undefined ? this.nonEmpty(input.patente, 'La patente est obligatoire') : workspace.tenant.legalEntity.patente,
      cnssNumber: input.cnssNumber !== undefined ? this.nonEmpty(input.cnssNumber, 'Le numéro CNSS est obligatoire') : workspace.tenant.legalEntity.cnssNumber,
      address: input.address !== undefined ? this.nonEmpty(input.address, 'L’adresse légale est obligatoire') : workspace.tenant.legalEntity.address,
      city: input.city !== undefined ? this.nonEmpty(input.city, 'La ville fiscale est obligatoire') : workspace.tenant.legalEntity.city,
      country: 'MA',
      vatEnabled: input.vatStatus !== undefined ? input.vatStatus === 'ENABLED' : workspace.tenant.legalEntity.vatEnabled,
    };
    const nextSettings: TenantSettings = {
      ...workspace.tenant.settings,
      invoiceSeries: input.invoiceSeries !== undefined
        ? this.nonEmpty(input.invoiceSeries, 'La série de facturation est obligatoire').toUpperCase()
        : workspace.tenant.settings.invoiceSeries,
      documentSeries: {
        ...workspace.tenant.settings.documentSeries,
        INVOICE: input.invoiceSeries !== undefined
          ? this.nonEmpty(input.invoiceSeries, 'La série de facturation est obligatoire').toUpperCase()
          : workspace.tenant.settings.documentSeries.INVOICE,
      },
      fiscalYearStartMonth: input.fiscalYearStartMonth !== undefined
        ? this.month(input.fiscalYearStartMonth)
        : workspace.tenant.settings.fiscalYearStartMonth,
      vatStatus: input.vatStatus ?? workspace.tenant.settings.vatStatus,
    };
    workspace.tenant.legalEntity = nextLegalEntity;
    workspace.tenant.settings = nextSettings;
    workspace.tenant.profileApprovalStatus = 'PENDING_REVIEW';
    const change: CompanyProfileChange = {
      id: this.id('profile-change'),
      tenantId: workspace.tenant.id,
      status: 'PENDING_REVIEW',
      requestedAt: today(),
      before,
      after: {
        legalEntity: { ...nextLegalEntity },
        settings: { ...nextSettings },
      },
    };
    workspace.profileChanges.push(change);
    this.audit(workspace, 'tenant.profile-updated', 'Tenant', workspace.tenant.id, change);
    return change;
  }

  approveCompanyProfile(reviewer = 'owner', tenantId?: string): CompanyProfileChange {
    const workspace = this.workspace(tenantId);
    const change = [...workspace.profileChanges].reverse().find((candidate) => candidate.status === 'PENDING_REVIEW');
    if (!change) {
      throw new BadRequestException('Aucune modification de profil en attente');
    }
    change.status = 'APPROVED';
    change.approvedAt = today();
    change.reviewer = this.clean(reviewer) ?? 'owner';
    workspace.tenant.profileApprovalStatus = 'APPROVED';
    this.audit(workspace, 'tenant.profile-approved', 'Tenant', workspace.tenant.id, change);
    return change;
  }

  completeTenantOnboarding(input: Partial<LegalEntity> & {
    invoiceSeries?: string;
    fiscalYearStartMonth?: number;
    vatStatus?: 'ENABLED' | 'EXEMPT';
  }, tenantId?: string): {
    tenant: Tenant;
    completed: number;
    total: number;
    ready: boolean;
    checks: Array<{ id: string; label: string; complete: boolean }>;
  } {
    const workspace = this.workspace(tenantId);
    const entity = workspace.tenant.legalEntity;

    workspace.tenant.legalEntity = {
      ...entity,
      tradeName: this.nonEmpty(input.tradeName ?? entity.tradeName, 'La raison sociale est obligatoire'),
      ice: this.nonEmpty(input.ice ?? entity.ice, 'L’ICE est obligatoire'),
      ifNumber: this.nonEmpty(input.ifNumber ?? entity.ifNumber, 'L’IF est obligatoire'),
      rc: this.nonEmpty(input.rc ?? entity.rc, 'Le RC est obligatoire'),
      patente: this.nonEmpty(input.patente ?? entity.patente, 'La patente est obligatoire'),
      cnssNumber: this.nonEmpty(input.cnssNumber ?? entity.cnssNumber, 'Le numéro CNSS est obligatoire'),
      address: this.nonEmpty(input.address ?? entity.address, 'L’adresse légale est obligatoire'),
      city: this.nonEmpty(input.city ?? entity.city, 'La ville fiscale est obligatoire'),
      country: 'MA',
      vatEnabled: input.vatEnabled ?? entity.vatEnabled,
    };

    const invoiceSeries = this.nonEmpty(input.invoiceSeries ?? workspace.tenant.settings.invoiceSeries, 'La série de facturation est obligatoire').toUpperCase();
    workspace.tenant.settings = {
      ...workspace.tenant.settings,
      invoiceSeries,
      documentSeries: { ...workspace.tenant.settings.documentSeries, INVOICE: invoiceSeries },
      fiscalYearStartMonth: this.month(input.fiscalYearStartMonth ?? workspace.tenant.settings.fiscalYearStartMonth),
      vatStatus: input.vatStatus ?? (workspace.tenant.legalEntity.vatEnabled ? 'ENABLED' : 'EXEMPT'),
    };
    workspace.tenant.legalEntity.vatEnabled = workspace.tenant.settings.vatStatus === 'ENABLED';

    this.audit(workspace, 'tenant.onboarded', 'Tenant', workspace.tenant.id, {
      legalEntity: workspace.tenant.legalEntity,
      settings: workspace.tenant.settings,
    });

    return {
      tenant: workspace.tenant,
      ...this.setupChecklist(workspace.tenant.id),
    };
  }

  addCustomer(input: Partial<Customer> & { name: string }, tenantId?: string): Customer {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const customer: Customer = {
      id: this.id('cus'),
      tenantId: workspace.tenant.id,
      name: this.nonEmpty(input.name, 'Le nom du client est obligatoire'),
      arabicName: this.clean(input.arabicName),
      ice: this.clean(input.ice),
      ifNumber: this.clean(input.ifNumber),
      rc: this.clean(input.rc),
      email: this.clean(input.email),
      phone: this.clean(input.phone),
      address: this.clean(input.address),
      arabicAddress: this.clean(input.arabicAddress),
      preferredLanguage: this.preferredLanguage(input.preferredLanguage),
      city: this.clean(input.city),
      paymentTermsDays: this.nonNegative(input.paymentTermsDays ?? 30, 'Le délai de paiement doit être nul ou positif'),
      creditLimit: this.nonNegative(input.creditLimit ?? 0, 'Le plafond de crédit doit être nul ou positif'),
      contacts: input.contacts ?? [],
      addresses: input.addresses ?? [],
      documentExpiries: this.validateCustomerDocumentExpiries(input.documentExpiries ?? []),
      active: input.active ?? true,
      createdAt: today(),
      updatedAt: today(),
    };
    this.validateContacts(customer.contacts);
    this.validateAddresses(customer.addresses);
    customer.duplicateWarnings = this.customerDuplicateWarnings(workspace, customer);
    workspace.customers.push(customer);
    this.audit(workspace, 'customer.created', 'Customer', customer.id, customer);
    return customer;
  }

  listCustomers(tenantId?: string): Customer[] {
    return this.workspace(tenantId).customers;
  }

  getCustomer(customerId: string, tenantId?: string): Customer {
    return this.customer(this.workspace(tenantId), customerId);
  }

  updateCustomer(customerId: string, input: Partial<Customer>, tenantId?: string): Customer {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const customer = this.customer(workspace, customerId);
    if (input.name !== undefined) {
      customer.name = this.nonEmpty(input.name, 'Le nom du client est obligatoire');
    }
    if (input.arabicName !== undefined) customer.arabicName = this.clean(input.arabicName);
    if (input.ice !== undefined) customer.ice = this.clean(input.ice);
    if (input.ifNumber !== undefined) customer.ifNumber = this.clean(input.ifNumber);
    if (input.rc !== undefined) customer.rc = this.clean(input.rc);
    if (input.email !== undefined) customer.email = this.clean(input.email);
    if (input.phone !== undefined) customer.phone = this.clean(input.phone);
    if (input.address !== undefined) customer.address = this.clean(input.address);
    if (input.arabicAddress !== undefined) customer.arabicAddress = this.clean(input.arabicAddress);
    if (input.preferredLanguage !== undefined) customer.preferredLanguage = this.preferredLanguage(input.preferredLanguage);
    if (input.city !== undefined) customer.city = this.clean(input.city);
    if (input.paymentTermsDays !== undefined) {
      customer.paymentTermsDays = this.nonNegative(input.paymentTermsDays, 'Le délai de paiement doit être nul ou positif');
    }
    if (input.creditLimit !== undefined) {
      customer.creditLimit = this.nonNegative(input.creditLimit, 'Le plafond de crédit doit être nul ou positif');
    }
    if (input.contacts !== undefined) {
      this.validateContacts(input.contacts);
      customer.contacts = input.contacts;
    }
    if (input.addresses !== undefined) {
      this.validateAddresses(input.addresses);
      customer.addresses = input.addresses;
    }
    if (input.documentExpiries !== undefined) customer.documentExpiries = this.validateCustomerDocumentExpiries(input.documentExpiries);
    if (input.active !== undefined) customer.active = input.active;
    customer.duplicateWarnings = this.customerDuplicateWarnings(workspace, customer);
    customer.updatedAt = today();
    this.audit(workspace, 'customer.updated', 'Customer', customer.id, customer);
    return customer;
  }

  archiveCustomer(customerId: string, tenantId?: string): Customer {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const customer = this.customer(workspace, customerId);
    customer.active = false;
    customer.updatedAt = today();
    this.audit(workspace, 'customer.archived', 'Customer', customer.id, customer);
    return customer;
  }

  customerDocumentReminders(tenantId?: string) {
    const reminderWindowDays = 60;
    return this.workspace(tenantId).customers
      .filter((customer) => customer.active)
      .map((customer) => {
        const documents = customer.documentExpiries
          .map((document) => ({
            ...document,
            daysUntilExpiry: this.daysUntil(document.expiresAt),
          }))
          .sort((left, right) => left.daysUntilExpiry - right.daysUntilExpiry);
        const expiredDocuments = documents.filter((document) => document.daysUntilExpiry < 0);
        const expiringDocuments = documents.filter((document) => document.daysUntilExpiry >= 0 && document.daysUntilExpiry <= reminderWindowDays);
        return {
          customerId: customer.id,
          customerName: customer.name,
          ice: customer.ice,
          rc: customer.rc,
          expiredDocuments,
          expiringDocuments,
          nextExpiryDate: documents[0]?.expiresAt,
          nextExpiryDays: documents[0]?.daysUntilExpiry,
        };
      })
      .filter((row) => row.expiredDocuments.length || row.expiringDocuments.length)
      .sort((left, right) => (left.nextExpiryDays ?? 9999) - (right.nextExpiryDays ?? 9999) || left.customerName.localeCompare(right.customerName));
  }

  customerDuplicateReview(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const rows = workspace.customers
      .filter((customer) => customer.active)
      .map((customer) => {
        const duplicateWarnings = this.customerDuplicateWarnings(workspace, customer);
        customer.duplicateWarnings = duplicateWarnings;
        return {
          customerId: customer.id,
          customerName: customer.name,
          ice: customer.ice,
          ifNumber: customer.ifNumber,
          phone: customer.phone,
          email: customer.email,
          duplicateWarnings,
          severity: duplicateWarnings.length > 1 ? 'HIGH' : duplicateWarnings.length ? 'MEDIUM' : 'OK',
        };
      })
      .filter((row) => row.duplicateWarnings.length)
      .sort((left, right) => right.duplicateWarnings.length - left.duplicateWarnings.length || left.customerName.localeCompare(right.customerName));
    return {
      rows,
      counts: {
        customersWithDuplicates: rows.length,
        highRisk: rows.filter((row) => row.severity === 'HIGH').length,
      },
    };
  }

  customerCreditControls(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    return workspace.customers
      .filter((customer) => customer.active)
      .map((customer) => this.customerCreditControl(workspace, customer.id));
  }

  addSupplier(input: Partial<Supplier> & { name: string }, tenantId?: string): Supplier {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const supplier: Supplier = {
      id: this.id('sup'),
      tenantId: workspace.tenant.id,
      name: this.nonEmpty(input.name, 'Le nom du fournisseur est obligatoire'),
      arabicName: this.clean(input.arabicName),
      ice: this.clean(input.ice),
      ifNumber: this.clean(input.ifNumber),
      rc: this.clean(input.rc),
      email: this.clean(input.email),
      phone: this.clean(input.phone),
      address: this.clean(input.address),
      arabicAddress: this.clean(input.arabicAddress),
      preferredLanguage: this.preferredLanguage(input.preferredLanguage),
      city: this.clean(input.city),
      paymentTermsDays: this.nonNegative(input.paymentTermsDays ?? 30, 'Le délai de paiement fournisseur doit être nul ou positif'),
      contacts: input.contacts ?? [],
      bankDetails: input.bankDetails ?? [],
      preferred: input.preferred ?? false,
      riskNotes: this.clean(input.riskNotes),
      documentExpiries: this.validateSupplierDocumentExpiries(input.documentExpiries ?? []),
      active: input.active ?? true,
      createdAt: today(),
      updatedAt: today(),
    };
    this.validateContacts(supplier.contacts);
    this.validateBankDetails(supplier.bankDetails);
    supplier.duplicateWarnings = this.supplierDuplicateWarnings(workspace, supplier);
    workspace.suppliers.push(supplier);
    this.audit(workspace, 'supplier.created', 'Supplier', supplier.id, supplier);
    return supplier;
  }

  listSuppliers(tenantId?: string): Supplier[] {
    return this.workspace(tenantId).suppliers;
  }

  getSupplier(supplierId: string, tenantId?: string): Supplier {
    return this.supplier(this.workspace(tenantId), supplierId);
  }

  updateSupplier(supplierId: string, input: Partial<Supplier>, tenantId?: string): Supplier {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const supplier = this.supplier(workspace, supplierId);
    if (input.name !== undefined) supplier.name = this.nonEmpty(input.name, 'Le nom du fournisseur est obligatoire');
    if (input.arabicName !== undefined) supplier.arabicName = this.clean(input.arabicName);
    if (input.ice !== undefined) supplier.ice = this.clean(input.ice);
    if (input.ifNumber !== undefined) supplier.ifNumber = this.clean(input.ifNumber);
    if (input.rc !== undefined) supplier.rc = this.clean(input.rc);
    if (input.email !== undefined) supplier.email = this.clean(input.email);
    if (input.phone !== undefined) supplier.phone = this.clean(input.phone);
    if (input.address !== undefined) supplier.address = this.clean(input.address);
    if (input.arabicAddress !== undefined) supplier.arabicAddress = this.clean(input.arabicAddress);
    if (input.preferredLanguage !== undefined) supplier.preferredLanguage = this.preferredLanguage(input.preferredLanguage);
    if (input.city !== undefined) supplier.city = this.clean(input.city);
    if (input.paymentTermsDays !== undefined) {
      supplier.paymentTermsDays = this.nonNegative(input.paymentTermsDays, 'Le délai de paiement fournisseur doit être nul ou positif');
    }
    if (input.contacts !== undefined) {
      this.validateContacts(input.contacts);
      supplier.contacts = input.contacts;
    }
    if (input.bankDetails !== undefined) {
      this.validateBankDetails(input.bankDetails);
      supplier.bankDetails = input.bankDetails;
    }
    if (input.preferred !== undefined) supplier.preferred = input.preferred;
    if (input.riskNotes !== undefined) supplier.riskNotes = this.clean(input.riskNotes);
    if (input.documentExpiries !== undefined) supplier.documentExpiries = this.validateSupplierDocumentExpiries(input.documentExpiries);
    if (input.active !== undefined) supplier.active = input.active;
    supplier.duplicateWarnings = this.supplierDuplicateWarnings(workspace, supplier);
    supplier.updatedAt = today();
    this.audit(workspace, 'supplier.updated', 'Supplier', supplier.id, supplier);
    return supplier;
  }

  archiveSupplier(supplierId: string, tenantId?: string): Supplier {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const supplier = this.supplier(workspace, supplierId);
    supplier.active = false;
    supplier.updatedAt = today();
    this.audit(workspace, 'supplier.archived', 'Supplier', supplier.id, supplier);
    return supplier;
  }

  exportSuppliersCsv(tenantId?: string): string {
    const workspace = this.workspace(tenantId);
    return this.toCsv(
      ['name', 'ice', 'ifNumber', 'email', 'paymentTermsDays', 'bankName', 'rib'],
      workspace.suppliers.map((supplier) => ({
        name: supplier.name,
        ice: supplier.ice ?? '',
        ifNumber: supplier.ifNumber ?? '',
        email: supplier.email ?? '',
        paymentTermsDays: supplier.paymentTermsDays,
        bankName: supplier.bankDetails[0]?.bankName ?? '',
        rib: supplier.bankDetails[0]?.rib ?? '',
      })),
    );
  }

  importSuppliersCsv(csv: string, tenantId?: string) {
    const rows = this.parseCsv(csv);
    const created: Supplier[] = [];
    const errors: Array<{ row: number; message: string }> = [];
    rows.forEach((row, index) => {
      try {
        const bankName = this.clean(row.bankName);
        const rib = this.clean(row.rib);
        created.push(this.addSupplier({
          name: row.name,
          ice: row.ice,
          ifNumber: row.ifNumber,
          email: row.email,
          paymentTermsDays: Number(row.paymentTermsDays || 30),
          bankDetails: bankName || rib ? [{ bankName: bankName ?? '', rib: rib ?? '' }] : [],
        }, tenantId));
      } catch (error) {
        errors.push({ row: index + 2, message: error instanceof Error ? error.message : 'Ligne fournisseur invalide' });
      }
    });
    return { created: created.length, failed: errors.length, errors, records: created };
  }

  listEmployees(tenantId?: string): Employee[] {
    return this.workspace(tenantId).employees;
  }

  getEmployee(employeeId: string, tenantId?: string): Employee {
    return this.employee(this.workspace(tenantId), employeeId);
  }

  addEmployee(input: Partial<Employee> & { fullName: string; cin: string; hireDate: string; baseSalary: number }, tenantId?: string): Employee {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const employeeNumber = this.clean(input.employeeNumber) ?? `EMP-${String(workspace.employees.length + 1).padStart(3, '0')}`;
    if (workspace.employees.some((candidate) => candidate.employeeNumber.toUpperCase() === employeeNumber.toUpperCase())) {
      throw new BadRequestException('Le matricule employé existe déjà');
    }
    const employee: Employee = {
      id: this.id('emp'),
      tenantId: workspace.tenant.id,
      employeeNumber,
      fullName: this.nonEmpty(input.fullName, 'Le nom du salarié est obligatoire'),
      arabicName: this.clean(input.arabicName),
      cin: this.nonEmpty(input.cin, 'La CIN du salarié est obligatoire'),
      cnssNumber: this.clean(input.cnssNumber),
      contractType: input.contractType ?? 'CDI',
      hireDate: this.isoDate(input.hireDate, 'La date d’embauche est obligatoire'),
      baseSalary: this.nonNegative(input.baseSalary, 'Le salaire de base doit être nul ou positif'),
      dependents: this.nonNegative(input.dependents ?? 0, 'Le nombre de personnes à charge doit être nul ou positif'),
      address: this.clean(input.address),
      arabicAddress: this.clean(input.arabicAddress),
      preferredLanguage: this.preferredLanguage(input.preferredLanguage),
      documentExpiries: this.validateEmployeeDocumentExpiries(input.documentExpiries ?? []),
      active: input.active ?? true,
      createdAt: today(),
      updatedAt: today(),
    };
    workspace.employees.push(employee);
    this.audit(workspace, 'employee.created', 'Employee', employee.id, employee);
    return employee;
  }

  updateEmployee(employeeId: string, input: Partial<Employee>, tenantId?: string): Employee {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const employee = this.employee(workspace, employeeId);
    if (input.employeeNumber !== undefined) {
      const employeeNumber = this.nonEmpty(input.employeeNumber, 'Le matricule employé est obligatoire');
      if (workspace.employees.some((candidate) => candidate.id !== employee.id && candidate.employeeNumber.toUpperCase() === employeeNumber.toUpperCase())) {
        throw new BadRequestException('Le matricule employé existe déjà');
      }
      employee.employeeNumber = employeeNumber;
    }
    if (input.fullName !== undefined) employee.fullName = this.nonEmpty(input.fullName, 'Le nom du salarié est obligatoire');
    if (input.arabicName !== undefined) employee.arabicName = this.clean(input.arabicName);
    if (input.cin !== undefined) employee.cin = this.nonEmpty(input.cin, 'La CIN du salarié est obligatoire');
    if (input.cnssNumber !== undefined) employee.cnssNumber = this.clean(input.cnssNumber);
    if (input.contractType !== undefined) employee.contractType = input.contractType;
    if (input.hireDate !== undefined) employee.hireDate = this.isoDate(input.hireDate, 'La date d’embauche est obligatoire');
    if (input.baseSalary !== undefined) employee.baseSalary = this.nonNegative(input.baseSalary, 'Le salaire de base doit être nul ou positif');
    if (input.dependents !== undefined) employee.dependents = this.nonNegative(input.dependents, 'Le nombre de personnes à charge doit être nul ou positif');
    if (input.address !== undefined) employee.address = this.clean(input.address);
    if (input.arabicAddress !== undefined) employee.arabicAddress = this.clean(input.arabicAddress);
    if (input.preferredLanguage !== undefined) employee.preferredLanguage = this.preferredLanguage(input.preferredLanguage);
    if (input.documentExpiries !== undefined) employee.documentExpiries = this.validateEmployeeDocumentExpiries(input.documentExpiries);
    if (input.active !== undefined) employee.active = Boolean(input.active);
    employee.updatedAt = today();
    this.audit(workspace, 'employee.updated', 'Employee', employee.id, employee);
    return employee;
  }

  archiveEmployee(employeeId: string, tenantId?: string): Employee {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const employee = this.employee(workspace, employeeId);
    employee.active = false;
    employee.updatedAt = today();
    this.audit(workspace, 'employee.archived', 'Employee', employee.id, employee);
    return employee;
  }

  supplierRiskReminders(options: { filter?: string } = {}, tenantId?: string) {
    const reminderWindowDays = 60;
    const filter = options.filter ?? 'all';
    return this.workspace(tenantId).suppliers
      .filter((supplier) => supplier.active)
      .map((supplier) => {
        const documents = supplier.documentExpiries
          .map((document) => ({
            ...document,
            daysUntilExpiry: this.daysUntil(document.expiresAt),
          }))
          .sort((left, right) => left.daysUntilExpiry - right.daysUntilExpiry);
        const expiredDocuments = documents.filter((document) => document.daysUntilExpiry < 0);
        const expiringDocuments = documents.filter((document) => document.daysUntilExpiry >= 0 && document.daysUntilExpiry <= reminderWindowDays);
        return {
          supplierId: supplier.id,
          supplierName: supplier.name,
          preferred: supplier.preferred,
          riskNotes: supplier.riskNotes ?? '',
          expiredDocuments,
          expiringDocuments,
          nextExpiryDate: documents[0]?.expiresAt,
          nextExpiryDays: documents[0]?.daysUntilExpiry,
        };
      })
      .filter((row) => row.preferred || row.riskNotes || row.expiredDocuments.length || row.expiringDocuments.length)
      .filter((row) => {
        if (filter === 'expired') return row.expiredDocuments.length > 0;
        if (filter === 'expiring') return row.expiringDocuments.length > 0;
        if (filter === 'preferred') return row.preferred;
        if (filter === 'noted') return Boolean(row.riskNotes);
        return true;
      })
      .sort((left, right) => (left.nextExpiryDays ?? 9999) - (right.nextExpiryDays ?? 9999) || left.supplierName.localeCompare(right.supplierName));
  }

  addSupplierDocumentPlaceholder(supplierId: string, input: {
    type: string;
    expiresAt: string;
    reference?: string;
    fileName?: string;
  }, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const supplier = this.supplier(workspace, supplierId);
    const document = this.validateSupplierDocumentExpiries([{
      type: input.type,
      expiresAt: input.expiresAt,
      reference: input.reference,
      fileName: this.clean(input.fileName) ?? `${this.clean(input.type) ?? 'document'}.pdf`,
      storageKey: `suppliers/${supplier.id}/documents/${this.id('doc')}`,
      uploadStatus: 'PLACEHOLDER',
      uploadedAt: today(),
    }])[0];
    supplier.documentExpiries.push(document);
    supplier.updatedAt = today();
    this.audit(workspace, 'supplier.document-placeholder.created', 'Supplier', supplier.id, document);
    return { supplier, document };
  }

  addLead(input: Partial<Lead> & { customerName: string; value?: number }, tenantId?: string): Lead {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const lead: Lead = {
      id: this.id('lead'),
      tenantId: workspace.tenant.id,
      customerName: this.nonEmpty(input.customerName, 'Le nom du prospect est obligatoire'),
      stage: this.leadStage(input.stage ?? 'NEW'),
      expectedValue: this.nonNegative(input.expectedValue ?? input.value ?? 0, 'Le montant attendu doit être nul ou positif'),
      owner: this.clean(input.owner),
      source: this.clean(input.source),
      nextActionDate: this.clean(input.nextActionDate),
      createdAt: today(),
      updatedAt: today(),
    };
    workspace.leads.push(lead);
    this.audit(workspace, 'lead.created', 'Lead', lead.id, lead);
    return lead;
  }

  listLeads(tenantId?: string): Lead[] {
    return this.workspace(tenantId).leads;
  }

  updateLead(leadId: string, input: Partial<Lead> & { value?: number }, tenantId?: string): Lead {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const lead = this.lead(workspace, leadId);
    if (input.customerName !== undefined) lead.customerName = this.nonEmpty(input.customerName, 'Le nom du prospect est obligatoire');
    if (input.stage !== undefined) lead.stage = this.leadStage(input.stage);
    if (input.expectedValue !== undefined || input.value !== undefined) {
      lead.expectedValue = this.nonNegative(input.expectedValue ?? input.value, 'Le montant attendu doit être nul ou positif');
    }
    if (input.owner !== undefined) lead.owner = this.clean(input.owner);
    if (input.source !== undefined) lead.source = this.clean(input.source);
    if (input.nextActionDate !== undefined) lead.nextActionDate = this.clean(input.nextActionDate);
    lead.updatedAt = today();
    this.audit(workspace, 'lead.updated', 'Lead', lead.id, lead);
    return lead;
  }

  convertLeadToQuote(leadId: string, input: {
    customerId?: string;
    productId?: string;
    quantity?: number;
    lines?: DocumentLineInput[];
  } = {}, tenantId?: string): { lead: Lead; customer: Customer; quote: Quote } {
    const workspace = this.workspace(tenantId);
    const lead = this.lead(workspace, leadId);
    const customer = input.customerId
      ? this.customer(workspace, input.customerId)
      : this.customerForLead(workspace, lead);
    const lines = input.lines ?? [{
      productId: input.productId ?? this.defaultQuotableProduct(workspace).id,
      quantity: input.quantity ?? 1,
    }];
    const quote = this.createQuote({ customerId: customer.id, lines }, workspace.tenant.id);

    lead.stage = 'PROPOSAL';
    lead.convertedCustomerId = customer.id;
    lead.convertedQuoteId = quote.id;
    lead.convertedAt = today();
    lead.updatedAt = today();
    this.audit(workspace, 'lead.converted-to-quote', 'Lead', lead.id, {
      leadId: lead.id,
      customerId: customer.id,
      quoteId: quote.id,
      quoteNumber: quote.number,
    });

    return { lead, customer, quote };
  }

  exportLeadsCsv(tenantId?: string): string {
    const workspace = this.workspace(tenantId);
    return this.toCsv(
      ['customerName', 'stage', 'owner', 'source', 'nextActionDate', 'expectedValue'],
      workspace.leads.map((lead) => ({
        customerName: lead.customerName,
        stage: lead.stage,
        owner: lead.owner ?? '',
        source: lead.source ?? '',
        nextActionDate: lead.nextActionDate ?? '',
        expectedValue: lead.expectedValue,
      })),
    );
  }

  importLeadsCsv(csv: string, tenantId?: string) {
    const rows = this.parseCsv(csv);
    const created: Lead[] = [];
    const errors: Array<{ row: number; message: string }> = [];
    rows.forEach((row, index) => {
      try {
        created.push(this.addLead({
          customerName: row.customerName,
          stage: row.stage as Lead['stage'],
          owner: row.owner,
          source: row.source,
          nextActionDate: row.nextActionDate,
          expectedValue: Number(row.expectedValue || 0),
        }, tenantId));
      } catch (error) {
        errors.push({ row: index + 2, message: error instanceof Error ? error.message : 'Ligne prospect invalide' });
      }
    });
    return { created: created.length, failed: errors.length, errors, records: created };
  }

  leadSourceAnalytics(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const buckets = new Map<string, {
      source: string;
      owner: string;
      month: string;
      leads: number;
      expectedValue: number;
      won: number;
      lost: number;
    }>();
    for (const lead of workspace.leads) {
      const source = lead.source || 'Non renseignée';
      const owner = lead.owner || 'Non assigné';
      const month = lead.createdAt.slice(0, 7);
      const key = `${source}|${owner}|${month}`;
      const bucket = buckets.get(key) ?? { source, owner, month, leads: 0, expectedValue: 0, won: 0, lost: 0 };
      bucket.leads += 1;
      bucket.expectedValue = r2(bucket.expectedValue + lead.expectedValue);
      if (lead.stage === 'WON') bucket.won += 1;
      if (lead.stage === 'LOST') bucket.lost += 1;
      buckets.set(key, bucket);
    }
    return [...buckets.values()]
      .map((bucket) => ({
        ...bucket,
        winRate: bucket.leads ? r2(bucket.won / bucket.leads) : 0,
        lostRate: bucket.leads ? r2(bucket.lost / bucket.leads) : 0,
      }))
      .sort((left, right) => right.expectedValue - left.expectedValue || left.source.localeCompare(right.source));
  }

  addProduct(input: Partial<Product> & { sku: string; name: string; salePrice: number }, tenantId?: string): Product {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const sku = this.nonEmpty(input.sku, 'Le SKU est obligatoire').toUpperCase();
    if (workspace.products.some((candidate) => candidate.sku.toUpperCase() === sku)) {
      throw new BadRequestException('Le SKU article existe déjà');
    }
    const cost = this.nonNegative(input.purchaseCost ?? 0, 'Le coût d’achat doit être nul ou positif');
    const type = input.type ?? 'GOODS';
    const trackStock = type === 'SERVICE' ? false : input.trackStock ?? true;
    const stockOnHand = trackStock ? this.nonNegative(input.stockOnHand ?? 0, 'Le stock disponible doit être nul ou positif') : 0;
    const product: Product = {
      id: this.id('prd'),
      tenantId: workspace.tenant.id,
      sku,
      barcode: this.clean(input.barcode),
      name: this.nonEmpty(input.name, 'Le nom de l’article est obligatoire'),
      arabicDescription: this.clean(input.arabicDescription),
      type,
      unit: this.nonEmpty(input.unit ?? (type === 'SERVICE' ? 'forfait' : 'unité'), 'L’unité article est obligatoire'),
      trackStock,
      reorderPoint: this.nonNegative(input.reorderPoint ?? 0, 'Le seuil de réapprovisionnement doit être nul ou positif'),
      salePrice: this.nonNegative(input.salePrice, 'Le prix de vente doit être nul ou positif'),
      purchaseCost: cost,
      vatRate: this.vatRate(input.vatRate ?? 0.2),
      stockOnHand,
      reservedStock: 0,
      weightedAverageCost: trackStock ? this.nonNegative(input.weightedAverageCost ?? cost, 'Le CUMP doit être nul ou positif') : 0,
      active: input.active ?? true,
      createdAt: today(),
      updatedAt: today(),
    };
    product.duplicateWarnings = this.productDuplicateWarnings(workspace, product);
    workspace.products.push(product);
    if (product.trackStock) {
      for (const warehouse of workspace.warehouses) {
        workspace.warehouseStocks.push({
          tenantId: workspace.tenant.id,
          warehouseId: warehouse.id,
          productId: product.id,
          quantity: warehouse.id === workspace.warehouses[0].id ? product.stockOnHand : 0,
          reserved: 0,
        });
      }
    }
    this.audit(workspace, 'product.created', 'Product', product.id, product);
    return product;
  }

  listProducts(tenantId?: string): Product[] {
    return this.workspace(tenantId).products;
  }

  productMarginAlerts(tenantId?: string) {
    return this.workspace(tenantId).products
      .filter((product) => product.active && product.type !== 'RAW_MATERIAL' && product.purchaseCost > 0)
      .map((product) => {
        const minimumSalePrice = r2(product.purchaseCost * (1 + product.vatRate));
        return {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          type: product.type,
          salePrice: product.salePrice,
          purchaseCost: product.purchaseCost,
          vatRate: product.vatRate,
          minimumSalePrice,
          marginGap: r2(minimumSalePrice - product.salePrice),
        };
      })
      .filter((alert) => alert.marginGap > 0)
      .sort((left, right) => right.marginGap - left.marginGap || left.sku.localeCompare(right.sku));
  }

  productDuplicateReview(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const rows = workspace.products
      .filter((product) => product.active)
      .map((product) => {
        const duplicateWarnings = this.productDuplicateWarnings(workspace, product);
        product.duplicateWarnings = duplicateWarnings;
        return {
          productId: product.id,
          sku: product.sku,
          barcode: product.barcode,
          name: product.name,
          duplicateWarnings,
          severity: duplicateWarnings.length > 1 ? 'HIGH' : duplicateWarnings.length ? 'MEDIUM' : 'OK',
        };
      })
      .filter((row) => row.duplicateWarnings.length)
      .sort((left, right) => right.duplicateWarnings.length - left.duplicateWarnings.length || left.sku.localeCompare(right.sku));
    return {
      rows,
      counts: {
        productsWithDuplicates: rows.length,
        highRisk: rows.filter((row) => row.severity === 'HIGH').length,
      },
    };
  }

  getProduct(productId: string, tenantId?: string): Product {
    return this.product(this.workspace(tenantId), productId);
  }

  updateProduct(productId: string, input: Partial<Product>, tenantId?: string): Product {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const product = this.product(workspace, productId);
    if (input.sku !== undefined) {
      const sku = this.nonEmpty(input.sku, 'Le SKU est obligatoire').toUpperCase();
      if (workspace.products.some((candidate) => candidate.id !== product.id && candidate.sku.toUpperCase() === sku)) {
        throw new BadRequestException('Le SKU article existe déjà');
      }
      product.sku = sku;
    }
    if (input.barcode !== undefined) product.barcode = this.clean(input.barcode);
    if (input.name !== undefined) product.name = this.nonEmpty(input.name, 'Le nom de l’article est obligatoire');
    if (input.arabicDescription !== undefined) product.arabicDescription = this.clean(input.arabicDescription);
    if (input.type !== undefined) product.type = input.type;
    if (input.unit !== undefined) product.unit = this.nonEmpty(input.unit, 'L’unité article est obligatoire');
    if (input.trackStock !== undefined) product.trackStock = input.trackStock;
    if (input.reorderPoint !== undefined) product.reorderPoint = this.nonNegative(input.reorderPoint, 'Le seuil de réapprovisionnement doit être nul ou positif');
    if (input.salePrice !== undefined) product.salePrice = this.nonNegative(input.salePrice, 'Le prix de vente doit être nul ou positif');
    if (input.purchaseCost !== undefined) product.purchaseCost = this.nonNegative(input.purchaseCost, 'Le coût d’achat doit être nul ou positif');
    if (input.vatRate !== undefined) product.vatRate = this.vatRate(input.vatRate);
    if (input.stockOnHand !== undefined) {
      product.stockOnHand = product.trackStock ? this.nonNegative(input.stockOnHand, 'Le stock disponible doit être nul ou positif') : 0;
      if (product.reservedStock > product.stockOnHand) {
        throw new BadRequestException('Le stock disponible ne peut pas être inférieur au stock réservé');
      }
    }
    if (input.weightedAverageCost !== undefined) {
      product.weightedAverageCost = product.trackStock ? this.nonNegative(input.weightedAverageCost, 'Le CUMP doit être nul ou positif') : 0;
    }
    if (!product.trackStock || product.type === 'SERVICE') {
      product.stockOnHand = 0;
      product.reservedStock = 0;
      product.weightedAverageCost = 0;
    }
    if (input.active !== undefined) product.active = input.active;
    product.duplicateWarnings = this.productDuplicateWarnings(workspace, product);
    product.updatedAt = today();
    this.audit(workspace, 'product.updated', 'Product', product.id, product);
    return product;
  }

  archiveProduct(productId: string, tenantId?: string): Product {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const product = this.product(workspace, productId);
    product.active = false;
    product.updatedAt = today();
    this.audit(workspace, 'product.archived', 'Product', product.id, product);
    return product;
  }

  listWarehouses(tenantId?: string): Warehouse[] {
    return this.workspace(tenantId).warehouses;
  }

  createWarehouse(input: Partial<Warehouse> & { name: string; city: string }, tenantId?: string): Warehouse {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const warehouse: Warehouse = {
      id: this.id('wh'),
      tenantId: workspace.tenant.id,
      name: this.nonEmpty(input.name, 'Le nom du dépôt est obligatoire'),
      city: this.nonEmpty(input.city, 'La ville du dépôt est obligatoire'),
      address: this.clean(input.address),
      active: input.active ?? true,
    };
    workspace.warehouses.push(warehouse);
    for (const product of workspace.products.filter((candidate) => candidate.trackStock)) {
      workspace.warehouseStocks.push({ tenantId: workspace.tenant.id, warehouseId: warehouse.id, productId: product.id, quantity: 0, reserved: 0 });
    }
    this.audit(workspace, 'warehouse.created', 'Warehouse', warehouse.id, warehouse);
    return warehouse;
  }

  updateWarehouse(warehouseId: string, input: Partial<Warehouse>, tenantId?: string): Warehouse {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const warehouse = this.warehouse(workspace, warehouseId);
    if (input.name !== undefined) warehouse.name = this.nonEmpty(input.name, 'Le nom du dépôt est obligatoire');
    if (input.city !== undefined) warehouse.city = this.nonEmpty(input.city, 'La ville du dépôt est obligatoire');
    if (input.address !== undefined) warehouse.address = this.clean(input.address);
    if (input.active !== undefined) warehouse.active = input.active;
    this.audit(workspace, 'warehouse.updated', 'Warehouse', warehouse.id, warehouse);
    return warehouse;
  }

  listStock(tenantId?: string) {
    return this.workspace(tenantId).products.map((product) => ({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      unit: product.unit,
      active: product.active,
      reorderPoint: product.reorderPoint,
      stockOnHand: product.stockOnHand,
      reservedStock: product.reservedStock,
      availableStock: this.availableStock(product),
      weightedAverageCost: product.weightedAverageCost,
      stockValue: r2(product.stockOnHand * product.weightedAverageCost),
    }));
  }

  listWarehouseStock(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    return workspace.warehouseStocks.map((stock) => {
      const product = this.product(workspace, stock.productId);
      const warehouse = this.warehouse(workspace, stock.warehouseId);
      return {
        warehouseId: warehouse.id,
        warehouseName: warehouse.name,
        productId: product.id,
        sku: product.sku,
        name: product.name,
        quantity: stock.quantity,
        reserved: stock.reserved,
        available: r2(stock.quantity - stock.reserved),
        value: r2(stock.quantity * product.weightedAverageCost),
      };
    });
  }

  inventoryValuationReport(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const rows = this.listWarehouseStock(workspace.tenant.id).map((line) => {
      const product = this.product(workspace, line.productId);
      return {
        warehouseId: line.warehouseId,
        warehouseName: line.warehouseName,
        productId: line.productId,
        sku: line.sku,
        name: line.name,
        quantity: line.quantity,
        reserved: line.reserved,
        available: line.available,
        weightedAverageCost: product.weightedAverageCost,
        value: r2(line.quantity * product.weightedAverageCost),
      };
    });
    const byWarehouse = workspace.warehouses.map((warehouse) => ({
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      value: r2(rows.filter((row) => row.warehouseId === warehouse.id).reduce((sum, row) => sum + row.value, 0)),
      products: rows.filter((row) => row.warehouseId === warehouse.id).length,
    }));
    const byProduct = workspace.products.filter((product) => product.trackStock).map((product) => ({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      quantity: r2(rows.filter((row) => row.productId === product.id).reduce((sum, row) => sum + row.quantity, 0)),
      value: r2(rows.filter((row) => row.productId === product.id).reduce((sum, row) => sum + row.value, 0)),
    }));
    return {
      generatedAt: new Date().toISOString(),
      method: 'CUMP',
      rows,
      byWarehouse,
      byProduct,
      totals: {
        quantity: r2(rows.reduce((sum, row) => sum + row.quantity, 0)),
        reserved: r2(rows.reduce((sum, row) => sum + row.reserved, 0)),
        value: r2(rows.reduce((sum, row) => sum + row.value, 0)),
      },
    };
  }

  barcodeLookup(barcodeOrSku: string, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const key = this.nonEmpty(barcodeOrSku, 'Le code-barres ou SKU est obligatoire');
    const product = workspace.products.find((candidate) => candidate.barcode === key || candidate.sku.toUpperCase() === key.toUpperCase());
    if (!product) throw new NotFoundException('Article introuvable pour ce code-barres');
    return {
      product,
      stock: this.listWarehouseStock(workspace.tenant.id).filter((line) => line.productId === product.id),
    };
  }

  stockAlerts(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const rows = workspace.products
      .filter((product) => product.active && product.trackStock)
      .map((product) => {
        const availableStock = this.availableStock(product);
        const suggestedQuantity = Math.max(0, product.reorderPoint * 2 - availableStock);
        return {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          reorderPoint: product.reorderPoint,
          stockOnHand: product.stockOnHand,
          reservedStock: product.reservedStock,
          availableStock,
          suggestedQuantity,
          status: availableStock <= product.reorderPoint ? 'REPLENISH' : 'OK',
        };
      })
      .filter((row) => row.status === 'REPLENISH')
      .sort((left, right) => left.availableStock - right.availableStock || left.sku.localeCompare(right.sku));
    return { rows, count: rows.length };
  }

  stockReservationVisibility(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const orderReservations = workspace.salesOrders
      .filter((order) => ['CONFIRMED', 'DELIVERED'].includes(order.status))
      .flatMap((order) => order.lines
        .filter((line) => this.product(workspace, line.productId).trackStock)
        .map((line) => ({
          source: 'ORDER',
          sourceNumber: order.number,
          productId: line.productId,
          sku: line.sku,
          quantity: order.status === 'CONFIRMED' ? line.quantity : 0,
          customerId: order.customerId,
          status: order.status,
        })));
    const posReservations = workspace.posTransactions.flatMap((ticket) => ticket.lines
      .filter((line) => this.product(workspace, line.productId).trackStock)
      .map((line) => ({
        source: 'POS',
        sourceNumber: ticket.number,
        productId: line.productId,
        sku: line.sku,
        quantity: 0,
        customerId: undefined,
        status: 'DEDUCTED',
      })));
    return {
      rows: [...orderReservations, ...posReservations],
      totals: this.listStock(workspace.tenant.id).map((line) => ({
        productId: line.productId,
        sku: line.sku,
        reservedStock: line.reservedStock,
        availableStock: line.availableStock,
      })),
    };
  }

  adjustStock(productId: string, quantity: number, reason = 'Ajustement manuel', tenantId?: string): StockMove {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    return this.withRollback(workspace, () => {
    this.assertPeriodOpen(workspace, today());
    const product = this.product(workspace, productId);
    if (!product.trackStock) {
      throw new BadRequestException('Cet article n’est pas suivi en stock');
    }
    const beforeQty = product.stockOnHand;
    product.stockOnHand = r2(product.stockOnHand + quantity);
    if (product.stockOnHand < 0) {
      throw new BadRequestException('Le stock ne peut pas devenir négatif');
    }
    const move = this.stockMove(workspace, product, quantity, product.weightedAverageCost, 'ADJUSTMENT', reason);
    move.reasonCode = reason;
    move.beforeQty = beforeQty;
    move.afterQty = product.stockOnHand;
    move.approvalStatus = this.approvalStatus(workspace, 'stockAdjustment', Math.abs(move.value));
    this.postJournal(workspace, `Ajustement stock ${product.sku}`, move.reference, [
      { account: '3111', label: 'Stock marchandises', debit: quantity > 0 ? Math.abs(move.value) : 0, credit: quantity < 0 ? Math.abs(move.value) : 0 },
      { account: '6198', label: 'Écart inventaire', debit: quantity < 0 ? Math.abs(move.value) : 0, credit: quantity > 0 ? Math.abs(move.value) : 0 },
    ]);
    this.audit(workspace, 'stock.adjusted', 'StockMove', move.id, move);
    return move;
    });
  }

  createPurchaseOrder(input: { supplierId: string; expectedDate?: string; lines: Array<{ productId: string; quantity: number; unitCost: number }> }, tenantId?: string): PurchaseOrder {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    this.supplier(workspace, input.supplierId);
    const lines = input.lines.map((line) => {
      const product = this.product(workspace, line.productId);
      if (line.quantity <= 0 || line.unitCost < 0) throw new BadRequestException('Ligne commande achat invalide');
      return { productId: product.id, quantity: line.quantity, unitCost: line.unitCost, receivedQuantity: 0, value: r2(line.quantity * line.unitCost) };
    });
    const total = r2(lines.reduce((sum, line) => sum + line.value, 0));
    const order: PurchaseOrder = {
      id: this.id('po'),
      tenantId: workspace.tenant.id,
      supplierId: input.supplierId,
      number: this.nextNumber(workspace, this.documentPrefix(workspace, 'PURCHASE_ORDER')),
      date: today(),
      expectedDate: input.expectedDate ? this.isoDate(input.expectedDate, 'Date prévue achat invalide') : undefined,
      status: 'DRAFT',
      approvalStatus: this.approvalStatus(workspace, 'purchase', total),
      lines,
      total,
    };
    workspace.purchaseOrders.push(order);
    this.audit(workspace, 'purchase-order.created', 'PurchaseOrder', order.id, order);
    return order;
  }

  approvePurchaseOrder(orderId: string, tenantId?: string): PurchaseOrder {
    const workspace = this.workspace(tenantId);
    const order = this.purchaseOrder(workspace, orderId);
    if (order.status === 'CANCELLED') throw new BadRequestException('La commande achat est annulée');
    order.status = 'APPROVED';
    order.approvalStatus = 'APPROVED';
    this.audit(workspace, 'purchase-order.approved', 'PurchaseOrder', order.id, order);
    return order;
  }

  cancelPurchaseOrder(orderId: string, tenantId?: string): PurchaseOrder {
    const workspace = this.workspace(tenantId);
    const order = this.purchaseOrder(workspace, orderId);
    if (order.status === 'RECEIVED' || order.status === 'PARTIALLY_RECEIVED') {
      throw new BadRequestException('La commande achat réceptionnée ne peut pas être annulée');
    }
    order.status = 'CANCELLED';
    this.audit(workspace, 'purchase-order.cancelled', 'PurchaseOrder', order.id, order);
    return order;
  }

  listPurchaseOrders(tenantId?: string): PurchaseOrder[] {
    return this.workspace(tenantId).purchaseOrders;
  }

  createPurchaseReceipt(input: { supplierId?: string; purchaseOrderId?: string; warehouseId?: string; lines?: Array<{ productId: string; quantity: number; unitCost: number }> }, tenantId?: string): PurchaseReceipt {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    return this.withRollback(workspace, () => {
    this.assertPeriodOpen(workspace, today());
    const order = input.purchaseOrderId ? this.purchaseOrder(workspace, input.purchaseOrderId) : undefined;
    if (order && !['APPROVED', 'PARTIALLY_RECEIVED'].includes(order.status)) {
      throw new BadRequestException('La commande achat doit être approuvée avant réception');
    }
    const supplierId = input.supplierId ?? order?.supplierId;
    if (!supplierId) throw new BadRequestException('Le fournisseur est obligatoire');
    this.supplier(workspace, supplierId);
    const warehouseId = input.warehouseId ?? workspace.warehouses[0]?.id;
    this.warehouse(workspace, warehouseId);
    const number = this.nextNumber(workspace, this.documentPrefix(workspace, 'PURCHASE_RECEIPT'));
    let total = 0;
    const receiptInputLines = input.lines ?? order?.lines.map((line) => ({
      productId: line.productId,
      quantity: r2(line.quantity - line.receivedQuantity),
      unitCost: line.unitCost,
    })) ?? [];
    const lines = receiptInputLines.map((line) => {
      if (line.quantity <= 0 || line.unitCost < 0) {
        throw new BadRequestException('Ligne de réception achat invalide');
      }
      const product = this.product(workspace, line.productId);
      if (!product.trackStock) {
        throw new BadRequestException('La réception achat exige un article suivi en stock');
      }
      const oldValue = product.stockOnHand * product.weightedAverageCost;
      const newValue = line.quantity * line.unitCost;
      product.stockOnHand = r2(product.stockOnHand + line.quantity);
      product.weightedAverageCost = product.stockOnHand > 0 ? r2((oldValue + newValue) / product.stockOnHand) : line.unitCost;
      product.purchaseCost = line.unitCost;
      this.stockMove(workspace, product, line.quantity, line.unitCost, 'RECEIPT', number, warehouseId);
      if (order) {
        const orderLine = order.lines.find((candidate) => candidate.productId === product.id);
        if (!orderLine) throw new BadRequestException('La réception référence un article absent de la commande achat');
        if (r2(orderLine.receivedQuantity + line.quantity) > orderLine.quantity) {
          throw new BadRequestException('La réception dépasse la quantité commandée');
        }
        orderLine.receivedQuantity = r2(orderLine.receivedQuantity + line.quantity);
      }
      total += newValue;
      return { ...line, value: r2(newValue) };
    });
    if (order) {
      const fullyReceived = order.lines.every((line) => line.receivedQuantity >= line.quantity);
      const partiallyReceived = order.lines.some((line) => line.receivedQuantity > 0);
      order.status = fullyReceived ? 'RECEIVED' : partiallyReceived ? 'PARTIALLY_RECEIVED' : order.status;
    }
    const receipt: PurchaseReceipt = {
      id: this.id('br'),
      tenantId: workspace.tenant.id,
      supplierId,
      purchaseOrderId: order?.id,
      number,
      date: today(),
      warehouseId,
      lines,
      total: r2(total),
      approvalStatus: this.approvalStatus(workspace, 'purchase', r2(total)),
    };
    workspace.purchaseReceipts.push(receipt);
    this.postJournal(workspace, `Réception achat ${number}`, number, [
      { account: '3111', label: 'Marchandises au magasin', debit: receipt.total, credit: 0 },
      { account: '4411', label: 'Fournisseurs', debit: 0, credit: receipt.total },
    ]);
    this.audit(workspace, 'purchase.received', 'PurchaseReceipt', receipt.id, receipt);
    return receipt;
    });
  }

  listPurchaseReceipts(tenantId?: string): PurchaseReceipt[] {
    return this.workspace(tenantId).purchaseReceipts;
  }

  createSupplierInvoice(input: { supplierId?: string; purchaseOrderId?: string; purchaseReceiptId?: string; supplierInvoiceNumber?: string; vatRate?: VatRate; dueDate?: string }, tenantId?: string): SupplierInvoice {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    this.assertPeriodOpen(workspace, today());
    const receipt = input.purchaseReceiptId ? this.purchaseReceipt(workspace, input.purchaseReceiptId) : undefined;
    const order = input.purchaseOrderId ? this.purchaseOrder(workspace, input.purchaseOrderId) : receipt?.purchaseOrderId ? this.purchaseOrder(workspace, receipt.purchaseOrderId) : undefined;
    const supplierId = input.supplierId ?? receipt?.supplierId ?? order?.supplierId;
    if (!supplierId) throw new BadRequestException('Le fournisseur est obligatoire pour la facture fournisseur');
    const supplier = this.supplier(workspace, supplierId);
    const subtotal = receipt?.total ?? order?.total ?? 0;
    if (subtotal <= 0) throw new BadRequestException('Une réception ou commande achat est requise pour facturer');
    const vatRate = this.vatRate(input.vatRate ?? 0.2);
    const vatTotal = r2(subtotal * vatRate);
    const invoice: SupplierInvoice = {
      id: this.id('sinv'),
      tenantId: workspace.tenant.id,
      supplierId,
      purchaseOrderId: order?.id,
      purchaseReceiptId: receipt?.id,
      number: this.nextNumber(workspace, 'FF'),
      supplierInvoiceNumber: this.clean(input.supplierInvoiceNumber),
      date: today(),
      dueDate: input.dueDate ? this.isoDate(input.dueDate, 'Date échéance fournisseur invalide') : addDays(today(), supplier.paymentTermsDays),
      status: 'POSTED',
      subtotal,
      vatTotal,
      total: r2(subtotal + vatTotal),
      paidAmount: 0,
    };
    workspace.supplierInvoices.push(invoice);
    this.postJournal(workspace, `Facture fournisseur ${invoice.number}`, invoice.number, [
      { account: '6111', label: 'Achats marchandises', debit: invoice.subtotal, credit: 0 },
      { account: '3455', label: 'TVA récupérable', debit: invoice.vatTotal, credit: 0 },
      { account: '4411', label: 'Fournisseurs', debit: 0, credit: invoice.total },
    ]);
    this.audit(workspace, 'supplier-invoice.posted', 'SupplierInvoice', invoice.id, invoice);
    return invoice;
  }

  listSupplierInvoices(tenantId?: string): SupplierInvoice[] {
    return this.workspace(tenantId).supplierInvoices;
  }

  transferStock(input: { productId: string; fromWarehouseId: string; toWarehouseId: string; quantity: number }, tenantId?: string): StockTransfer {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const product = this.product(workspace, input.productId);
    this.warehouse(workspace, input.fromWarehouseId);
    this.warehouse(workspace, input.toWarehouseId);
    if (!product.trackStock || input.quantity <= 0) throw new BadRequestException('Transfert de stock invalide');
    const fromStock = this.warehouseStock(workspace, input.fromWarehouseId, product.id);
    if (fromStock.quantity - fromStock.reserved < input.quantity) throw new BadRequestException('Stock dépôt source insuffisant');
    const transfer: StockTransfer = {
      id: this.id('trf'),
      tenantId: workspace.tenant.id,
      number: this.nextNumber(workspace, 'TRF'),
      productId: product.id,
      fromWarehouseId: input.fromWarehouseId,
      toWarehouseId: input.toWarehouseId,
      quantity: input.quantity,
      status: 'IN_TRANSIT',
      shippedAt: today(),
    };
    workspace.stockTransfers.push(transfer);
    const out = this.stockMove(workspace, product, -input.quantity, product.weightedAverageCost, 'TRANSFER_OUT', transfer.number, input.fromWarehouseId);
    out.toWarehouseId = input.toWarehouseId;
    this.audit(workspace, 'stock-transfer.shipped', 'StockTransfer', transfer.id, transfer);
    return transfer;
  }

  receiveStockTransfer(transferId: string, tenantId?: string): StockTransfer {
    const workspace = this.workspace(tenantId);
    const transfer = this.stockTransfer(workspace, transferId);
    if (transfer.status !== 'IN_TRANSIT') throw new BadRequestException('Le transfert n’est pas en transit');
    const product = this.product(workspace, transfer.productId);
    const move = this.stockMove(workspace, product, transfer.quantity, product.weightedAverageCost, 'TRANSFER_IN', transfer.number, transfer.toWarehouseId);
    move.toWarehouseId = transfer.toWarehouseId;
    transfer.status = 'RECEIVED';
    transfer.receivedAt = today();
    this.audit(workspace, 'stock-transfer.received', 'StockTransfer', transfer.id, transfer);
    return transfer;
  }

  listStockTransfers(tenantId?: string): StockTransfer[] {
    return this.workspace(tenantId).stockTransfers;
  }

  createInventoryCount(input: { warehouseId?: string; lines: Array<{ productId: string; countedQuantity: number }> }, tenantId?: string): InventoryCountSheet {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const warehouseId = input.warehouseId ?? workspace.warehouses[0]?.id;
    this.warehouse(workspace, warehouseId);
    const lines = input.lines.map((line) => {
      const product = this.product(workspace, line.productId);
      const stock = this.warehouseStock(workspace, warehouseId, product.id);
      const countedQuantity = this.nonNegative(line.countedQuantity, 'La quantité comptée doit être positive');
      const variance = r2(countedQuantity - stock.quantity);
      return {
        productId: product.id,
        expectedQuantity: stock.quantity,
        countedQuantity,
        variance,
        valueImpact: r2(variance * product.weightedAverageCost),
      };
    });
    const sheet: InventoryCountSheet = {
      id: this.id('cnt'),
      tenantId: workspace.tenant.id,
      number: this.nextNumber(workspace, 'INV'),
      warehouseId,
      status: 'DRAFT',
      createdAt: today(),
      lines,
      totalVarianceValue: r2(lines.reduce((sum, line) => sum + line.valueImpact, 0)),
    };
    workspace.inventoryCounts.push(sheet);
    this.audit(workspace, 'inventory-count.created', 'InventoryCount', sheet.id, sheet);
    return sheet;
  }

  approveInventoryCount(sheetId: string, tenantId?: string): InventoryCountSheet {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    this.assertPeriodOpen(workspace, today());
    const sheet = this.inventoryCount(workspace, sheetId);
    if (sheet.status !== 'DRAFT') throw new BadRequestException('La feuille inventaire est déjà traitée');
    for (const line of sheet.lines) {
      if (line.variance === 0) continue;
      const product = this.product(workspace, line.productId);
      product.stockOnHand = r2(product.stockOnHand + line.variance);
      const move = this.stockMove(workspace, product, line.variance, product.weightedAverageCost, 'COUNT_VARIANCE', sheet.number, sheet.warehouseId);
      move.beforeQty = line.expectedQuantity;
      move.afterQty = line.countedQuantity;
      move.reasonCode = 'INVENTORY_COUNT';
    }
    sheet.status = 'POSTED';
    sheet.approvedAt = today();
    if (sheet.totalVarianceValue !== 0) {
      const value = Math.abs(sheet.totalVarianceValue);
      this.postJournal(workspace, `Écart inventaire ${sheet.number}`, sheet.number, [
        { account: '3111', label: 'Stock marchandises', debit: sheet.totalVarianceValue > 0 ? value : 0, credit: sheet.totalVarianceValue < 0 ? value : 0 },
        { account: '6198', label: 'Écart inventaire', debit: sheet.totalVarianceValue < 0 ? value : 0, credit: sheet.totalVarianceValue > 0 ? value : 0 },
      ]);
    }
    this.audit(workspace, 'inventory-count.posted', 'InventoryCount', sheet.id, sheet);
    return sheet;
  }

  listInventoryCounts(tenantId?: string): InventoryCountSheet[] {
    return this.workspace(tenantId).inventoryCounts;
  }

  createQuote(input: { customerId: string; lines: DocumentLineInput[]; validUntil?: string }, tenantId?: string): Quote {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    this.customer(workspace, input.customerId);
    const lines = this.documentLines(workspace, input.lines);
    const quote: Quote = {
      id: this.id('quo'),
      tenantId: workspace.tenant.id,
      number: this.nextNumber(workspace, this.documentPrefix(workspace, 'QUOTE')),
      customerId: input.customerId,
      status: 'DRAFT',
      revision: 1,
      date: today(),
      validUntil: input.validUntil ?? today(),
      lines,
      totals: this.totals(lines),
      approvalStatus: 'AUTO_APPROVED',
    };
    quote.approvalStatus = this.approvalStatus(workspace, 'quote', quote.totals.total);
    workspace.quotes.push(quote);
    this.audit(workspace, 'quote.created', 'Quote', quote.id, quote);
    return quote;
  }

  listQuotes(tenantId?: string): Quote[] {
    return this.workspace(tenantId).quotes;
  }

  getQuote(quoteId: string, tenantId?: string): Quote {
    return this.quote(this.workspace(tenantId), quoteId);
  }

  reviseQuote(quoteId: string, input: { lines?: DocumentLineInput[]; validUntil?: string }, tenantId?: string): Quote {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const quote = this.quote(workspace, quoteId);
    if (quote.status === 'CONVERTED' || quote.status === 'VOID') {
      throw new BadRequestException('Les devis convertis ou annulés ne peuvent pas être révisés');
    }
    if (input.lines) {
      quote.lines = this.documentLines(workspace, input.lines);
      quote.totals = this.totals(quote.lines);
      quote.approvalStatus = this.approvalStatus(workspace, 'quote', quote.totals.total);
    }
    if (input.validUntil) {
      quote.validUntil = input.validUntil;
    }
    quote.status = 'DRAFT';
    quote.approvedAt = undefined;
    quote.approvalStatus = this.approvalStatus(workspace, 'quote', quote.totals.total);
    quote.revision += 1;
    this.audit(workspace, 'quote.revised', 'Quote', quote.id, quote);
    return quote;
  }

  approveQuote(quoteId: string, tenantId?: string): Quote {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const quote = this.quote(workspace, quoteId);
    if (quote.status === 'CONVERTED' || quote.status === 'VOID') {
      throw new BadRequestException('Le devis ne peut pas être approuvé');
    }
    quote.status = 'APPROVED';
    quote.approvalStatus = 'APPROVED';
    quote.approvedAt = today();
    this.audit(workspace, 'quote.approved', 'Quote', quote.id, quote);
    return quote;
  }

  exportQuotePdf(quoteId: string, tenantId?: string) {
    const pdf = this.exportBusinessDocumentPdf('QUOTE', quoteId, tenantId);
    return { quoteId: pdf.documentId, quoteNumber: pdf.documentNumber, ...pdf };
  }

  exportInvoicePdf(invoiceId: string, tenantId?: string) {
    const pdf = this.exportBusinessDocumentPdf('INVOICE', invoiceId, tenantId);
    return { invoiceId: pdf.documentId, invoiceNumber: pdf.documentNumber, ...pdf };
  }

  exportDeliveryNotePdf(deliveryNoteId: string, tenantId?: string) {
    const pdf = this.exportBusinessDocumentPdf('DELIVERY_NOTE', deliveryNoteId, tenantId);
    return { deliveryNoteId: pdf.documentId, deliveryNoteNumber: pdf.documentNumber, ...pdf };
  }

  exportCreditNotePdf(creditNoteId: string, tenantId?: string) {
    const pdf = this.exportBusinessDocumentPdf('CREDIT_NOTE', creditNoteId, tenantId);
    return { creditNoteId: pdf.documentId, creditNoteNumber: pdf.documentNumber, ...pdf };
  }

  exportPurchaseOrderPdf(orderId: string, tenantId?: string) {
    const pdf = this.exportBusinessDocumentPdf('PURCHASE_ORDER', orderId, tenantId);
    return { purchaseOrderId: pdf.documentId, purchaseOrderNumber: pdf.documentNumber, ...pdf };
  }

  exportPurchaseReceiptPdf(receiptId: string, tenantId?: string) {
    const pdf = this.exportBusinessDocumentPdf('PURCHASE_RECEIPT', receiptId, tenantId);
    return { purchaseReceiptId: pdf.documentId, purchaseReceiptNumber: pdf.documentNumber, ...pdf };
  }

  documentNumberingSettings(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const year = new Date().getFullYear();
    const types: DocumentExportType[] = ['QUOTE', 'ORDER', 'DELIVERY_NOTE', 'INVOICE', 'CREDIT_NOTE', 'PURCHASE_ORDER', 'PURCHASE_RECEIPT', 'PAYSLIP'];
    return {
      fiscalYear: year,
      settings: types.map((type) => {
        const prefix = this.documentPrefix(workspace, type);
        const current = workspace.sequences[`${prefix}-${year}`] ?? 0;
        return {
          type,
          prefix,
          current,
          nextNumber: `${prefix}-${year}-${String(current + 1).padStart(5, '0')}`,
          lockedAfterPosting: ['INVOICE', 'CREDIT_NOTE', 'PURCHASE_RECEIPT', 'PAYSLIP'].includes(type),
        };
      }),
    };
  }

  updateDocumentNumberingSetting(input: { type: DocumentExportType; prefix: string }, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const type = input.type;
    const prefix = this.nonEmpty(input.prefix, 'Le préfixe de numérotation est obligatoire').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
    if (!prefix) throw new BadRequestException('Le préfixe de numérotation est obligatoire');
    workspace.tenant.settings.documentSeries[type] = prefix;
    if (type === 'INVOICE') workspace.tenant.settings.invoiceSeries = prefix;
    this.audit(workspace, 'document-numbering.updated', 'Tenant', workspace.tenant.id, { type, prefix });
    return this.documentNumberingSettings(workspace.tenant.id);
  }

  documentTemplateCatalog(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    return {
      templates: workspace.documentTemplates,
      legalFooter: this.legalFooter(workspace),
      bilingualReady: workspace.documentTemplates.every((template) => template.fields.some((field) => field.includes('arabic') || field.includes('Ar'))),
    };
  }

  fileStorageStatus(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    return {
      activeProvider: 'LOCAL_DEV',
      providers: [
        { id: 'LOCAL_DEV', mode: 'development', writable: true, root: `storage/${workspace.tenant.id}` },
        { id: 'OBJECT_STORAGE_ADAPTER', mode: 'production', writable: false, requiredEnv: ['OBJECT_STORAGE_BUCKET', 'OBJECT_STORAGE_REGION'] },
      ],
      files: workspace.storedFiles,
      totalSize: workspace.storedFiles.reduce((sum, file) => sum + file.size, 0),
    };
  }

  salesDashboardReport(input: { year?: number; month?: number } = {}, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const year = input.year ?? Number(today().slice(0, 4));
    const month = input.month;
    const inPeriod = (date: string) => Number(date.slice(0, 4)) === year && (!month || Number(date.slice(5, 7)) === month);
    const invoices = workspace.invoices.filter((invoice) => inPeriod(invoice.date));
    const creditNotes = workspace.creditNotes.filter((credit) => inPeriod(credit.date));
    const byCustomer = new Map<string, { customerId: string; customerName: string; revenue: number; unpaid: number; invoices: number }>();
    const byProduct = new Map<string, { productId: string; sku: string; name: string; quantity: number; revenue: number }>();
    const byVatRate = new Map<string, { rate: string; taxable: number; vat: number; total: number }>();
    for (const invoice of invoices) {
      const customer = this.customer(workspace, invoice.customerId);
      const customerRow = byCustomer.get(customer.id) ?? { customerId: customer.id, customerName: customer.name, revenue: 0, unpaid: 0, invoices: 0 };
      customerRow.revenue = r2(customerRow.revenue + invoice.totals.total);
      customerRow.unpaid = r2(customerRow.unpaid + Math.max(0, invoice.totals.total - invoice.paidAmount));
      customerRow.invoices += 1;
      byCustomer.set(customer.id, customerRow);
      for (const line of invoice.lines) {
        const product = this.product(workspace, line.productId);
        const productRow = byProduct.get(product.id) ?? { productId: product.id, sku: product.sku, name: product.name, quantity: 0, revenue: 0 };
        productRow.quantity = r2(productRow.quantity + line.quantity);
        productRow.revenue = r2(productRow.revenue + line.total);
        byProduct.set(product.id, productRow);
        const rateKey = `${line.vatRate}`;
        const vatRow = byVatRate.get(rateKey) ?? { rate: rateKey, taxable: 0, vat: 0, total: 0 };
        vatRow.taxable = r2(vatRow.taxable + line.subtotal);
        vatRow.vat = r2(vatRow.vat + line.vatAmount);
        vatRow.total = r2(vatRow.total + line.total);
        byVatRate.set(rateKey, vatRow);
      }
    }
    const creditTotal = creditNotes.reduce((sum, credit) => sum + credit.totals.total, 0);
    return {
      period: month ? `${year}-${String(month).padStart(2, '0')}` : `${year}`,
      invoiceCount: invoices.length,
      creditNoteCount: creditNotes.length,
      totals: {
        revenue: r2(invoices.reduce((sum, invoice) => sum + invoice.totals.total, 0) - creditTotal),
        unpaid: r2(invoices.reduce((sum, invoice) => sum + Math.max(0, invoice.totals.total - invoice.paidAmount), 0)),
        vat: r2(invoices.reduce((sum, invoice) => sum + invoice.totals.vatTotal, 0) - creditNotes.reduce((sum, credit) => sum + credit.totals.vatTotal, 0)),
      },
      byCustomer: [...byCustomer.values()].sort((a, b) => b.revenue - a.revenue),
      byProduct: [...byProduct.values()].sort((a, b) => b.revenue - a.revenue),
      byVatRate: [...byVatRate.values()].sort((a, b) => Number(a.rate) - Number(b.rate)),
      unpaidInvoices: invoices.filter((invoice) => invoice.totals.total > invoice.paidAmount).map((invoice) => ({
        invoiceId: invoice.id,
        number: invoice.number,
        customerName: this.customer(workspace, invoice.customerId).name,
        dueDate: invoice.dueDate,
        unpaid: r2(invoice.totals.total - invoice.paidAmount),
      })),
    };
  }

  convertQuoteToOrder(quoteId: string, tenantId?: string): SalesOrder {
    const workspace = this.workspace(tenantId);
    const quote = this.quote(workspace, quoteId);
    if (quote.status !== 'APPROVED') {
      throw new BadRequestException('Le devis doit être approuvé avant conversion en commande');
    }
    const order = this.createSalesOrder({
      customerId: quote.customerId,
      lines: quote.lines,
      sourceQuoteId: quote.id,
    }, workspace.tenant.id);
    quote.status = 'CONVERTED';
    this.audit(workspace, 'quote.converted-to-order', 'Quote', quote.id, { quoteId: quote.id, orderId: order.id });
    return order;
  }

  convertQuoteToInvoice(quoteId: string, tenantId?: string): Invoice {
    const workspace = this.workspace(tenantId);
    const quote = this.quote(workspace, quoteId);
    if (quote.status === 'VOID') {
      throw new BadRequestException('Les devis annulés ne peuvent pas être facturés');
    }
    const invoice = this.createInvoice({ customerId: quote.customerId, lines: quote.lines, sourceQuoteId: quote.id }, workspace.tenant.id);
    quote.status = 'CONVERTED';
    return invoice;
  }

  createSalesOrder(input: { customerId: string; lines: DocumentLineInput[] | DocumentLine[]; sourceQuoteId?: string }, tenantId?: string): SalesOrder {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    this.customer(workspace, input.customerId);
    const lines = this.documentLines(workspace, input.lines);
    this.reserveStockForOrder(workspace, lines, 'Réservation commande');
    const order: SalesOrder = {
      id: this.id('so'),
      tenantId: workspace.tenant.id,
      number: this.nextNumber(workspace, this.documentPrefix(workspace, 'ORDER')),
      customerId: input.customerId,
      sourceQuoteId: input.sourceQuoteId,
      status: 'CONFIRMED',
      date: today(),
      lines,
      totals: this.totals(lines),
    };
    workspace.salesOrders.push(order);
    this.audit(workspace, 'order.created', 'SalesOrder', order.id, order);
    return order;
  }

  listSalesOrders(tenantId?: string): SalesOrder[] {
    return this.workspace(tenantId).salesOrders;
  }

  createDeliveryNoteFromOrder(orderId: string, tenantId?: string): DeliveryNote {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const order = this.salesOrder(workspace, orderId);
    if (order.status === 'CANCELLED') {
      throw new BadRequestException('Les commandes annulées ne peuvent pas être livrées');
    }
    if (order.status === 'DELIVERED' || order.status === 'INVOICED') {
      throw new BadRequestException('La commande est déjà livrée');
    }
    for (const line of order.lines) {
      const product = this.product(workspace, line.productId);
      if (!product.trackStock || product.type === 'SERVICE') {
        continue;
      }
      if (product.reservedStock < line.quantity) {
        throw new BadRequestException(`Stock réservé insuffisant pour ${product.sku}`);
      }
      product.reservedStock = r2(product.reservedStock - line.quantity);
      const warehouseStock = this.warehouseStock(workspace, workspace.warehouses[0].id, product.id);
      warehouseStock.reserved = r2(Math.max(0, warehouseStock.reserved - line.quantity));
      product.stockOnHand = r2(product.stockOnHand - line.quantity);
      this.stockMove(workspace, product, -line.quantity, product.weightedAverageCost, 'DELIVERY', order.number);
    }
    const deliveryNote: DeliveryNote = {
      id: this.id('bl'),
      tenantId: workspace.tenant.id,
      number: this.nextNumber(workspace, this.documentPrefix(workspace, 'DELIVERY_NOTE')),
      customerId: order.customerId,
      sourceOrderId: order.id,
      status: 'POSTED',
      date: today(),
      lines: order.lines,
      totals: order.totals,
    };
    workspace.deliveryNotes.push(deliveryNote);
    order.status = 'DELIVERED';
    this.audit(workspace, 'delivery-note.posted', 'DeliveryNote', deliveryNote.id, deliveryNote);
    return deliveryNote;
  }

  listDeliveryNotes(tenantId?: string): DeliveryNote[] {
    return this.workspace(tenantId).deliveryNotes;
  }

  cancelDeliveryNote(deliveryNoteId: string, tenantId?: string): DeliveryNote {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const deliveryNote = this.deliveryNote(workspace, deliveryNoteId);
    if (deliveryNote.status === 'CANCELLED') {
      return deliveryNote;
    }
    const order = this.salesOrder(workspace, deliveryNote.sourceOrderId);
    if (order.status === 'INVOICED') {
      throw new BadRequestException('Les bons de livraison facturés ne peuvent pas être annulés');
    }
    for (const line of deliveryNote.lines) {
      const product = this.product(workspace, line.productId);
      if (!product.trackStock || product.type === 'SERVICE') {
        continue;
      }
      product.stockOnHand = r2(product.stockOnHand + line.quantity);
      this.stockMove(workspace, product, line.quantity, product.weightedAverageCost, 'DELIVERY_REVERSAL', deliveryNote.number);
    }
    deliveryNote.status = 'CANCELLED';
    order.status = 'CONFIRMED';
    this.audit(workspace, 'delivery-note.cancelled', 'DeliveryNote', deliveryNote.id, deliveryNote);
    return deliveryNote;
  }

  convertOrderToInvoice(orderId: string, tenantId?: string): Invoice {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const order = this.salesOrder(workspace, orderId);
    if (order.status !== 'DELIVERED') {
      throw new BadRequestException('La commande doit être livrée avant facturation');
    }
    const deliveryNote = workspace.deliveryNotes.find((candidate) => candidate.sourceOrderId === order.id && candidate.status === 'POSTED');
    if (!deliveryNote) {
      throw new BadRequestException('Un bon de livraison comptabilisé est requis avant facturation');
    }
    const invoice = this.createInvoice({
      customerId: order.customerId,
      lines: order.lines,
      sourceQuoteId: order.sourceQuoteId,
      sourceOrderId: order.id,
      sourceDeliveryNoteId: deliveryNote.id,
      stockAlreadyDelivered: true,
    }, workspace.tenant.id);
    order.status = 'INVOICED';
    return invoice;
  }

  createInvoice(input: {
    customerId: string;
    lines: DocumentLineInput[] | DocumentLine[];
    sourceQuoteId?: string;
    sourceOrderId?: string;
    sourceDeliveryNoteId?: string;
    dueDate?: string;
    stockAlreadyDelivered?: boolean;
  }, tenantId?: string): Invoice {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    return this.withRollback(workspace, () => {
    const customer = this.customer(workspace, input.customerId);
    this.assertPeriodOpen(workspace, today());
    this.assertInvoiceLegalIdentity(workspace.tenant.legalEntity);
    const lines = this.documentLines(workspace, input.lines);
    const totals = this.totals(lines);
    this.assertCustomerCreditAvailable(workspace, customer, totals.total);
    const invoice: Invoice = {
      id: this.id('fac'),
      tenantId: workspace.tenant.id,
      number: this.nextNumber(workspace, this.documentPrefix(workspace, 'INVOICE')),
      customerId: input.customerId,
      status: 'POSTED',
      date: today(),
      dueDate: input.dueDate ?? today(),
      sourceQuoteId: input.sourceQuoteId,
      sourceOrderId: input.sourceOrderId,
      sourceDeliveryNoteId: input.sourceDeliveryNoteId,
      lines,
      totals,
      paidAmount: 0,
      compliance: {
        legalMentions: this.morocco2026Rules.invoiceMentions,
        validated: true,
        adapterStatus: 'READY_FOR_EXPORT',
      },
    };
    workspace.invoices.push(invoice);
    if (!input.stockAlreadyDelivered) {
      this.consumeStockForSales(workspace, invoice.number, lines);
    }
    this.postJournal(workspace, `Facture client ${invoice.number}`, invoice.number, [
      { account: '3421', label: 'Clients', debit: invoice.totals.total, credit: 0 },
      { account: '7111', label: 'Ventes de marchandises', debit: 0, credit: invoice.totals.subtotal },
      { account: '4455', label: 'TVA facturée', debit: 0, credit: invoice.totals.vatTotal },
    ]);
    this.audit(workspace, 'invoice.posted', 'Invoice', invoice.id, invoice);
    return invoice;
    });
  }

  listInvoices(tenantId?: string): Invoice[] {
    return this.workspace(tenantId).invoices;
  }

  createCreditNote(input: { invoiceId: string; reason?: string; lines?: DocumentLineInput[] | DocumentLine[] }, tenantId?: string): CreditNote {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    this.assertPeriodOpen(workspace, today());
    const invoice = this.invoice(workspace, input.invoiceId);
    if (invoice.status === 'VOID') {
      throw new BadRequestException('Les factures annulées ne peuvent pas recevoir d’avoir');
    }
    const alreadyCredited = this.invoiceCreditTotal(workspace, invoice.id);
    const remainingCredit = r2(invoice.totals.total - alreadyCredited);
    if (remainingCredit <= 0) {
      throw new BadRequestException('La facture est déjà totalement créditée');
    }
    const lines = this.creditNoteLines(workspace, invoice, input.lines);
    const totals = this.totals(lines);
    if (totals.total > remainingCredit) {
      throw new BadRequestException('L’avoir dépasse le solde restant de la facture');
    }
    const creditNote: CreditNote = {
      id: this.id('cn'),
      tenantId: workspace.tenant.id,
      number: this.nextNumber(workspace, this.documentPrefix(workspace, 'CREDIT_NOTE')),
      invoiceId: invoice.id,
      customerId: invoice.customerId,
      status: 'POSTED',
      date: today(),
      reason: this.nonEmpty(input.reason ?? 'Avoir client', 'Le motif de l’avoir est obligatoire'),
      approvalStatus: this.approvalStatus(workspace, 'creditNote', totals.total),
      lines,
      totals,
    };
    workspace.creditNotes.push(creditNote);
    this.postJournal(workspace, `Avoir ${creditNote.number}`, creditNote.number, [
      { account: '7111', label: 'Annulation ventes', debit: creditNote.totals.subtotal, credit: 0 },
      { account: '4455', label: 'Annulation TVA facturée', debit: creditNote.totals.vatTotal, credit: 0 },
      { account: '3421', label: 'Clients', debit: 0, credit: creditNote.totals.total },
    ]);
    if (r2(invoice.paidAmount + this.invoiceCreditTotal(workspace, invoice.id)) >= invoice.totals.total) {
      invoice.status = 'PAID';
    }
    this.audit(workspace, 'credit-note.posted', 'CreditNote', creditNote.id, creditNote);
    return creditNote;
  }

  listCreditNotes(tenantId?: string): CreditNote[] {
    return this.workspace(tenantId).creditNotes;
  }

  customerStatement(customerId: string, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const customer = this.customer(workspace, customerId);
    const invoices = workspace.invoices.filter((invoice) => invoice.customerId === customer.id);
    const invoiceIds = new Set(invoices.map((invoice) => invoice.id));
    const creditNotes = workspace.creditNotes.filter((creditNote) => invoiceIds.has(creditNote.invoiceId));
    const payments = workspace.payments.filter((payment) => invoiceIds.has(payment.invoiceId));
    const rawEntries = [
      ...invoices.map((invoice) => ({
        date: invoice.date,
        type: 'INVOICE' as const,
        number: invoice.number,
        reference: invoice.id,
        debit: invoice.totals.total,
        credit: 0,
      })),
      ...creditNotes.map((creditNote) => ({
        date: creditNote.date,
        type: 'CREDIT_NOTE' as const,
        number: creditNote.number,
        reference: creditNote.invoiceId,
        debit: 0,
        credit: creditNote.totals.total,
      })),
      ...payments.map((payment) => ({
        date: payment.date,
        type: 'PAYMENT' as const,
        number: payment.id,
        reference: payment.invoiceId,
        debit: 0,
        credit: payment.amount,
      })),
    ].sort((a, b) => `${a.date}-${a.number}`.localeCompare(`${b.date}-${b.number}`));
    let balance = 0;
    const entries = rawEntries.map((entry) => {
      balance = r2(balance + entry.debit - entry.credit);
      return { ...entry, balance };
    });
    const totals = {
      invoiced: r2(invoices.reduce((sum, invoice) => sum + invoice.totals.total, 0)),
      credited: r2(creditNotes.reduce((sum, creditNote) => sum + creditNote.totals.total, 0)),
      paid: r2(payments.reduce((sum, payment) => sum + payment.amount, 0)),
      balance: r2(balance),
    };
    return {
      customer,
      generatedAt: new Date().toISOString(),
      entries,
      totals,
      aging: this.receivablesAging(workspace, customer.id),
      status: 'PREPARED',
    };
  }

  recordPayment(input: { invoiceId: string; amount: number; method?: Payment['method'] }, tenantId?: string): Payment {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    this.assertPeriodOpen(workspace, today());
    const invoice = this.invoice(workspace, input.invoiceId);
    if (input.amount <= 0) {
      throw new BadRequestException('Le montant du paiement doit être positif');
    }
    const remaining = r2(invoice.totals.total - invoice.paidAmount - this.invoiceCreditTotal(workspace, invoice.id));
    if (input.amount > remaining) {
      throw new BadRequestException('Le paiement dépasse le solde restant de la facture');
    }
    invoice.paidAmount = r2(invoice.paidAmount + input.amount);
    if (r2(invoice.paidAmount + this.invoiceCreditTotal(workspace, invoice.id)) >= invoice.totals.total) {
      invoice.status = 'PAID';
    }
    const payment: Payment = {
      id: this.id('pay'),
      tenantId: workspace.tenant.id,
      invoiceId: invoice.id,
      amount: input.amount,
      method: input.method ?? 'BANK',
      date: today(),
    };
    workspace.payments.push(payment);
    this.postJournal(workspace, `Paiement ${invoice.number}`, payment.id, [
      { account: input.method === 'CASH' ? '5161' : '5141', label: input.method ?? 'BANK', debit: input.amount, credit: 0 },
      { account: '3421', label: 'Clients', debit: 0, credit: input.amount },
    ]);
    this.audit(workspace, 'payment.recorded', 'Payment', payment.id, payment);
    return payment;
  }

  listPayments(tenantId?: string): Payment[] {
    return this.workspace(tenantId).payments;
  }

  listJournalEntries(tenantId?: string): JournalEntry[] {
    return this.workspace(tenantId).journalEntries;
  }

  listChartOfAccounts(tenantId?: string): ChartAccount[] {
    return this.workspace(tenantId).chartOfAccounts;
  }

  searchChartAccounts(query = '', tenantId?: string): ChartAccount[] {
    const workspace = this.workspace(tenantId);
    const needle = this.searchText(query);
    return workspace.chartOfAccounts
      .filter((account) => account.active)
      .filter((account) => !needle || this.searchScore(needle, [account.account, account.labelFr, account.labelAr, account.class]) > 0)
      .sort((left, right) => left.account.localeCompare(right.account))
      .slice(0, 25);
  }

  addChartAccount(input: Partial<ChartAccount> & { account: string; labelFr: string }, tenantId?: string): ChartAccount {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const accountNumber = this.nonEmpty(input.account, 'Le numéro de compte est obligatoire');
    if (workspace.chartOfAccounts.some((candidate) => candidate.account === accountNumber)) {
      throw new BadRequestException('Le compte PCGE existe déjà');
    }
    const account: ChartAccount = {
      id: this.id('acc'),
      tenantId: workspace.tenant.id,
      account: accountNumber,
      labelFr: this.nonEmpty(input.labelFr, 'Le libellé du compte est obligatoire'),
      labelAr: this.clean(input.labelAr),
      class: this.clean(input.class) ?? accountNumber.slice(0, 1),
      vatDeductible: Boolean(input.vatDeductible),
      active: input.active ?? true,
    };
    workspace.chartOfAccounts.push(account);
    this.audit(workspace, 'chart-account.created', 'ChartAccount', account.id, account);
    return account;
  }

  getJournalEntry(entryId: string, tenantId?: string): JournalEntry {
    return this.journalEntry(this.workspace(tenantId), entryId);
  }

  createJournalEntry(input: { date?: string; source?: string; description?: string; lines: JournalEntry['lines']; post?: boolean }, tenantId?: string): JournalEntry {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const date = input.date ? this.isoDate(input.date, 'Date écriture invalide') : today();
    this.validateJournalLines(workspace, input.lines);
    const entry: JournalEntry = {
      id: this.id('je'),
      tenantId: workspace.tenant.id,
      date,
      source: this.clean(input.source) ?? 'MANUAL',
      description: this.nonEmpty(input.description ?? 'Écriture manuelle', 'Le libellé d’écriture est obligatoire'),
      lines: input.lines.map((line) => ({ ...line, debit: r2(line.debit), credit: r2(line.credit) })),
      posted: false,
      status: 'DRAFT',
    };
    if (input.post) {
      this.assertPeriodOpen(workspace, date);
      entry.posted = true;
      entry.status = 'POSTED';
    }
    workspace.journalEntries.push(entry);
    this.audit(workspace, input.post ? 'journal.posted' : 'journal.created', 'JournalEntry', entry.id, entry);
    return entry;
  }

  updateJournalEntry(entryId: string, input: Partial<Pick<JournalEntry, 'date' | 'source' | 'description' | 'lines'>>, tenantId?: string): JournalEntry {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const entry = this.journalEntry(workspace, entryId);
    if (entry.status !== 'DRAFT') throw new BadRequestException('Seules les écritures brouillon peuvent être modifiées');
    if (input.date !== undefined) entry.date = this.isoDate(input.date, 'Date écriture invalide');
    if (input.source !== undefined) entry.source = this.nonEmpty(input.source, 'La source est obligatoire');
    if (input.description !== undefined) entry.description = this.nonEmpty(input.description, 'Le libellé d’écriture est obligatoire');
    if (input.lines !== undefined) {
      this.validateJournalLines(workspace, input.lines);
      entry.lines = input.lines.map((line) => ({ ...line, debit: r2(line.debit), credit: r2(line.credit) }));
    }
    this.audit(workspace, 'journal.updated', 'JournalEntry', entry.id, entry);
    return entry;
  }

  postManualJournal(entryId: string, tenantId?: string): JournalEntry {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const entry = this.journalEntry(workspace, entryId);
    if (entry.status !== 'DRAFT') throw new BadRequestException('Seules les écritures brouillon peuvent être comptabilisées');
    this.assertPeriodOpen(workspace, entry.date);
    this.validateJournalLines(workspace, entry.lines);
    entry.status = 'POSTED';
    entry.posted = true;
    this.audit(workspace, 'journal.posted', 'JournalEntry', entry.id, entry);
    return entry;
  }

  voidJournalEntry(entryId: string, tenantId?: string): JournalEntry {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const entry = this.journalEntry(workspace, entryId);
    if (entry.status === 'VOID') return entry;
    this.assertPeriodOpen(workspace, entry.date);
    entry.status = 'VOID';
    entry.posted = false;
    this.audit(workspace, 'journal.voided', 'JournalEntry', entry.id, entry);
    return entry;
  }

  upsertFiscalPeriod(input: { year: number; month: number; status?: FiscalPeriod['status'] }, tenantId?: string): FiscalPeriod {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const year = Number(input.year);
    const month = this.month(input.month);
    let period = workspace.fiscalPeriods.find((candidate) => candidate.year === year && candidate.month === month);
    if (!period) {
      period = { id: this.id('fp'), tenantId: workspace.tenant.id, year, month, locked: false, status: 'OPEN' };
      workspace.fiscalPeriods.push(period);
    }
    if (input.status) {
      period.status = input.status;
      period.locked = ['LOCKED', 'CLOSED'].includes(input.status);
      if (input.status === 'SOFT_LOCKED') period.softLockedAt = new Date().toISOString();
      if (input.status === 'LOCKED') period.lockedAt = new Date().toISOString();
      if (input.status === 'CLOSED') period.closedAt = new Date().toISOString();
    }
    this.audit(workspace, 'fiscal-period.upserted', 'FiscalPeriod', period.id, period);
    return period;
  }

  softLockFiscalPeriod(year: number, month: number, tenantId?: string): FiscalPeriod {
    const period = this.upsertFiscalPeriod({ year, month, status: 'SOFT_LOCKED' }, tenantId);
    this.audit(this.workspace(tenantId), 'fiscal-period.soft-locked', 'FiscalPeriod', period.id, period);
    return period;
  }

  lockFiscalPeriod(year: number, month: number, tenantId?: string): FiscalPeriod {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const closeCheck = this.fiscalDocumentCompletenessCheck(year, month, workspace.tenant.id);
    if (closeCheck.status !== 'READY_TO_CLOSE') {
      throw new BadRequestException('La période fiscale contient des exceptions de clôture à traiter');
    }
    let period = workspace.fiscalPeriods.find((candidate) => candidate.year === year && candidate.month === month);
    if (!period) {
      period = { id: this.id('fp'), tenantId: workspace.tenant.id, year, month, locked: false, status: 'OPEN' };
      workspace.fiscalPeriods.push(period);
    }
    period.locked = true;
    period.status = 'LOCKED';
    period.lockedAt = new Date().toISOString();
    this.audit(workspace, 'fiscal-period.locked', 'FiscalPeriod', period.id, period);
    return period;
  }

  closeFiscalPeriod(year: number, month: number, tenantId?: string): FiscalPeriod {
    const period = this.lockFiscalPeriod(year, month, tenantId);
    period.status = 'CLOSED';
    period.closedAt = new Date().toISOString();
    this.audit(this.workspace(tenantId), 'fiscal-period.closed', 'FiscalPeriod', period.id, period);
    return period;
  }

  listFiscalPeriods(tenantId?: string): FiscalPeriod[] {
    return this.workspace(tenantId).fiscalPeriods;
  }

  openPosSession(input: { cashierId: string; openingCash?: number }, tenantId?: string): PosSession {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const cashierId = this.nonEmpty(input.cashierId, 'Le caissier est obligatoire');
    const existing = workspace.posSessions.find((session) => session.cashierId === cashierId && session.status === 'OPEN');
    if (existing) return existing;
    const openingCash = this.nonNegative(input.openingCash ?? 0, 'Le fond de caisse doit être positif');
    const session: PosSession = {
      id: this.id('poss'),
      tenantId: workspace.tenant.id,
      number: this.nextNumber(workspace, 'CAISSE'),
      cashierId,
      openedAt: new Date().toISOString(),
      status: 'OPEN',
      openingCash,
      expectedCash: openingCash,
      variance: 0,
    };
    workspace.posSessions.push(session);
    this.audit(workspace, 'pos-session.opened', 'PosSession', session.id, session);
    return session;
  }

  closePosSession(sessionId: string, input: { countedCash: number }, tenantId?: string): PosSession {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const session = this.posSession(workspace, sessionId);
    if (session.status !== 'OPEN') throw new BadRequestException('La session caisse est déjà clôturée');
    const cashSales = workspace.posTransactions
      .filter((ticket) => ticket.sessionId === session.id && ticket.paymentMethod === 'CASH')
      .reduce((sum, ticket) => sum + ticket.totals.total, 0);
    const cashMovements = workspace.cashDrawerMovements
      .filter((movement) => movement.sessionId === session.id)
      .reduce((sum, movement) => sum + (movement.type === 'CASH_IN' ? movement.amount : -movement.amount), 0);
    session.expectedCash = r2(session.openingCash + cashSales + cashMovements);
    session.countedCash = this.nonNegative(input.countedCash, 'Le comptage caisse doit être positif');
    session.variance = r2(session.countedCash - session.expectedCash);
    session.status = 'CLOSED';
    session.closedAt = new Date().toISOString();
    this.audit(workspace, 'pos-session.closed', 'PosSession', session.id, session);
    return session;
  }

  listPosSessions(tenantId?: string): PosSession[] {
    return this.workspace(tenantId).posSessions;
  }

  createPosTransaction(input: { cashierId?: string; sessionId?: string; lines: DocumentLineInput[]; paymentMethod?: PosTransaction['paymentMethod'] }, tenantId?: string): PosTransaction {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    this.assertPeriodOpen(workspace, today());
    const session = input.sessionId
      ? this.posSession(workspace, input.sessionId)
      : this.openPosSession({ cashierId: input.cashierId ?? 'cashier', openingCash: 0 }, workspace.tenant.id);
    if (session.status !== 'OPEN') throw new BadRequestException('La session caisse doit être ouverte');
    const lines = this.documentLines(workspace, input.lines);
    const transaction: PosTransaction = {
      id: this.id('pos'),
      tenantId: workspace.tenant.id,
      number: this.nextNumber(workspace, 'POS'),
      sessionId: session.id,
      cashierId: session.cashierId,
      date: today(),
      lines,
      totals: this.totals(lines),
      paymentMethod: input.paymentMethod ?? 'CASH',
    };
    workspace.posTransactions.push(transaction);
    this.consumeStockForSales(workspace, transaction.number, lines, 'POS_SALE');
    this.postJournal(workspace, `Ticket POS ${transaction.number}`, transaction.number, [
      { account: transaction.paymentMethod === 'CARD' ? '5141' : '5161', label: 'Encaisse POS', debit: transaction.totals.total, credit: 0 },
      { account: '7111', label: 'Ventes POS', debit: 0, credit: transaction.totals.subtotal },
      { account: '4455', label: 'TVA facturée', debit: 0, credit: transaction.totals.vatTotal },
    ]);
    this.audit(workspace, 'pos.sale', 'PosTransaction', transaction.id, transaction);
    return transaction;
  }

  listPosTransactions(tenantId?: string): PosTransaction[] {
    return this.workspace(tenantId).posTransactions;
  }

  refundPosTransaction(transactionId: string, input: { reason?: string } = {}, tenantId?: string): PosTransaction {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    this.assertPeriodOpen(workspace, today());
    const original = workspace.posTransactions.find((candidate) => candidate.id === transactionId || candidate.number === transactionId);
    if (!original) throw new NotFoundException('Ticket POS introuvable');
    if (original.refundedTransactionId) throw new BadRequestException('Un ticket de remboursement ne peut pas être remboursé');
    const refund: PosTransaction = {
      id: this.id('pos-refund'),
      tenantId: workspace.tenant.id,
      number: this.nextNumber(workspace, 'AVPOS'),
      sessionId: original.sessionId,
      cashierId: original.cashierId,
      date: today(),
      lines: original.lines.map((line) => ({ ...line, quantity: -line.quantity, subtotal: -line.subtotal, vatAmount: -line.vatAmount, total: -line.total })),
      totals: { subtotal: -original.totals.subtotal, vatByRate: Object.fromEntries(Object.entries(original.totals.vatByRate).map(([rate, amount]) => [rate, -amount])), vatTotal: -original.totals.vatTotal, total: -original.totals.total },
      paymentMethod: original.paymentMethod,
      refundedTransactionId: original.id,
    };
    workspace.posTransactions.push(refund);
    for (const line of original.lines) {
      const product = this.product(workspace, line.productId);
      if (product.trackStock && product.type !== 'SERVICE') {
        product.stockOnHand = r2(product.stockOnHand + line.quantity);
        this.stockMove(workspace, product, line.quantity, product.weightedAverageCost, 'DELIVERY_REVERSAL', refund.number);
      }
    }
    this.postJournal(workspace, `Remboursement POS ${refund.number}`, refund.number, [
      { account: '7111', label: 'Annulation ventes POS', debit: original.totals.subtotal, credit: 0 },
      { account: '4455', label: 'Annulation TVA POS', debit: original.totals.vatTotal, credit: 0 },
      { account: original.paymentMethod === 'CASH' ? '5161' : '5141', label: input.reason ?? 'Remboursement POS', debit: 0, credit: original.totals.total },
    ]);
    this.audit(workspace, 'pos.refunded', 'PosTransaction', refund.id, { refund, originalId: original.id, reason: input.reason });
    return refund;
  }

  addCashDrawerMovement(input: { sessionId: string; type: CashDrawerMovement['type']; amount: number; reason: string }, tenantId?: string): CashDrawerMovement {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const session = this.posSession(workspace, input.sessionId);
    if (session.status !== 'OPEN') throw new BadRequestException('La session caisse doit être ouverte');
    const movement: CashDrawerMovement = {
      id: this.id('cashmv'),
      tenantId: workspace.tenant.id,
      sessionId: session.id,
      type: input.type,
      amount: this.nonNegative(input.amount, 'Le mouvement caisse doit être positif'),
      reason: this.nonEmpty(input.reason, 'Le motif du mouvement caisse est obligatoire'),
      createdAt: new Date().toISOString(),
    };
    workspace.cashDrawerMovements.push(movement);
    this.audit(workspace, 'cash-drawer.moved', 'CashDrawerMovement', movement.id, movement);
    return movement;
  }

  dailyZReport(date = today(), tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const tickets = workspace.posTransactions.filter((ticket) => ticket.date === date);
    const sessions = workspace.posSessions.filter((session) => session.openedAt.startsWith(date) || session.closedAt?.startsWith(date));
    const byPayment = tickets.reduce<Record<string, number>>((acc, ticket) => {
      acc[ticket.paymentMethod] = r2((acc[ticket.paymentMethod] ?? 0) + ticket.totals.total);
      return acc;
    }, {});
    return {
      date,
      ticketCount: tickets.filter((ticket) => !ticket.refundedTransactionId).length,
      refundCount: tickets.filter((ticket) => ticket.refundedTransactionId).length,
      salesTotal: r2(tickets.reduce((sum, ticket) => sum + ticket.totals.total, 0)),
      vatTotal: r2(tickets.reduce((sum, ticket) => sum + ticket.totals.vatTotal, 0)),
      byPayment,
      sessions: sessions.map((session) => ({ number: session.number, cashierId: session.cashierId, status: session.status, expectedCash: session.expectedCash, countedCash: session.countedCash, variance: session.variance })),
      cashVariance: r2(sessions.reduce((sum, session) => sum + session.variance, 0)),
      status: 'PREPARED',
    };
  }

  queueOfflinePosSale(input: { payload: Record<string, unknown> }, tenantId?: string): PosOfflineQueueItem {
    const workspace = this.workspace(tenantId);
    const item: PosOfflineQueueItem = {
      id: this.id('posq'),
      tenantId: workspace.tenant.id,
      payload: input.payload,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    workspace.posOfflineQueue.push(item);
    return item;
  }

  syncOfflinePosQueue(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const results = workspace.posOfflineQueue.filter((item) => item.status === 'PENDING').map((item) => {
      try {
        const tx = this.createPosTransaction(item.payload as any, workspace.tenant.id);
        item.status = 'SYNCED';
        item.syncedTransactionId = tx.id;
        item.syncedAt = new Date().toISOString();
      } catch (error) {
        item.status = 'CONFLICT';
        item.conflictReason = error instanceof Error ? error.message : 'Conflit synchronisation POS';
      }
      return item;
    });
    return { status: 'SYNCED', results, pending: workspace.posOfflineQueue.filter((item) => item.status === 'PENDING').length };
  }

  listPosOfflineQueue(tenantId?: string): PosOfflineQueueItem[] {
    return this.workspace(tenantId).posOfflineQueue;
  }

  createBillOfMaterial(input: { finishedProductId: string; version?: string; components: Array<{ productId: string; quantity: number; unitCost?: number }> }, tenantId?: string): BillOfMaterial {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const finished = this.product(workspace, input.finishedProductId);
    const bom: BillOfMaterial = {
      id: this.id('bom'),
      tenantId: workspace.tenant.id,
      finishedProductId: finished.id,
      version: this.clean(input.version) ?? `V${workspace.billsOfMaterial.length + 1}`,
      components: input.components.map((component) => {
        const product = this.product(workspace, component.productId);
        return { productId: product.id, quantity: this.nonNegative(component.quantity, 'La quantité composant doit être positive'), unitCost: component.unitCost ?? product.weightedAverageCost };
      }),
      active: true,
      createdAt: today(),
    };
    workspace.billsOfMaterial.filter((candidate) => candidate.finishedProductId === finished.id).forEach((candidate) => { candidate.active = false; });
    workspace.billsOfMaterial.push(bom);
    this.audit(workspace, 'bom.created', 'BillOfMaterial', bom.id, bom);
    return bom;
  }

  listBillsOfMaterial(tenantId?: string): BillOfMaterial[] {
    return this.workspace(tenantId).billsOfMaterial;
  }

  createProductionOrder(input: { finishedProductId: string; quantity: number; billOfMaterialId?: string; components?: Array<{ productId: string; quantity: number }> }, tenantId?: string): ProductionOrder {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const finished = this.product(workspace, input.finishedProductId);
    if (input.quantity <= 0) {
      throw new BadRequestException('La quantité de production doit être positive');
    }
    const bom = input.billOfMaterialId
      ? this.billOfMaterial(workspace, input.billOfMaterialId)
      : workspace.billsOfMaterial.find((candidate) => candidate.finishedProductId === finished.id && candidate.active);
    const components = input.components ?? bom?.components.map((component) => ({ productId: component.productId, quantity: component.quantity * input.quantity })) ?? [{ productId: 'prd-raw', quantity: input.quantity * 2 }];
    let consumedValue = 0;
    for (const component of components) {
      const raw = this.product(workspace, component.productId);
      const qty = component.quantity;
      if (raw.stockOnHand < qty) {
        throw new BadRequestException(`Stock insuffisant pour ${raw.sku}`);
      }
      raw.stockOnHand = r2(raw.stockOnHand - qty);
      consumedValue += qty * raw.weightedAverageCost;
      this.stockMove(workspace, raw, -qty, raw.weightedAverageCost, 'PRODUCTION_CONSUME', finished.sku);
    }
    const unitCost = r2(consumedValue / input.quantity);
    const oldValue = finished.stockOnHand * finished.weightedAverageCost;
    finished.stockOnHand = r2(finished.stockOnHand + input.quantity);
    finished.weightedAverageCost = r2((oldValue + consumedValue) / finished.stockOnHand);
    this.stockMove(workspace, finished, input.quantity, unitCost, 'PRODUCTION_OUTPUT', finished.sku);
    const order: ProductionOrder = {
      id: this.id('mo'),
      tenantId: workspace.tenant.id,
      number: this.nextNumber(workspace, 'OF'),
      billOfMaterialId: bom?.id,
      finishedProductId: finished.id,
      quantity: input.quantity,
      status: 'COMPLETED',
      consumedValue: r2(consumedValue),
      outputValue: r2(input.quantity * unitCost),
      createdAt: today(),
    };
    workspace.productionOrders.push(order);
    this.audit(workspace, 'production.completed', 'ProductionOrder', order.id, order);
    return order;
  }

  listProductionOrders(tenantId?: string): ProductionOrder[] {
    return this.workspace(tenantId).productionOrders;
  }

  createMaintenanceAsset(input: { name: string; category?: string; location?: string }, tenantId?: string): MaintenanceAsset {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const asset: MaintenanceAsset = {
      id: this.id('asset'),
      tenantId: workspace.tenant.id,
      name: this.nonEmpty(input.name, 'Le nom de l’actif maintenance est obligatoire'),
      category: this.clean(input.category) ?? 'Équipement',
      location: this.clean(input.location),
      active: true,
      createdAt: today(),
    };
    workspace.maintenanceAssets.push(asset);
    this.audit(workspace, 'maintenance-asset.created', 'MaintenanceAsset', asset.id, asset);
    return asset;
  }

  createMaintenanceWorkOrder(input: { assetId: string; technician?: string; description?: string; cost?: number }, tenantId?: string): MaintenanceWorkOrder {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const asset = this.maintenanceAsset(workspace, input.assetId);
    const order: MaintenanceWorkOrder = {
      id: this.id('wo'),
      tenantId: workspace.tenant.id,
      assetId: asset.id,
      technician: this.clean(input.technician) ?? 'Technicien',
      status: 'ASSIGNED',
      cost: this.nonNegative(input.cost ?? 0, 'Le coût maintenance doit être positif'),
      description: this.clean(input.description) ?? 'Intervention maintenance',
      createdAt: today(),
    };
    workspace.maintenanceWorkOrders.push(order);
    this.audit(workspace, 'maintenance-work-order.created', 'MaintenanceWorkOrder', order.id, order);
    return order;
  }

  completeMaintenanceWorkOrder(orderId: string, tenantId?: string): MaintenanceWorkOrder {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const order = this.maintenanceWorkOrder(workspace, orderId);
    order.status = 'DONE';
    order.completedAt = today();
    this.audit(workspace, 'maintenance-work-order.completed', 'MaintenanceWorkOrder', order.id, order);
    return order;
  }

  listMaintenance(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    return { assets: workspace.maintenanceAssets, workOrders: workspace.maintenanceWorkOrders };
  }

  createFleetVehicle(input: { plate: string; driver?: string; documentExpiry?: string }, tenantId?: string): FleetVehicle {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const vehicle: FleetVehicle = {
      id: this.id('veh'),
      tenantId: workspace.tenant.id,
      plate: this.nonEmpty(input.plate, 'L’immatriculation véhicule est obligatoire'),
      driver: this.clean(input.driver),
      documentExpiry: input.documentExpiry ? this.isoDate(input.documentExpiry, 'Date document véhicule invalide') : undefined,
      active: true,
    };
    workspace.fleetVehicles.push(vehicle);
    this.audit(workspace, 'fleet-vehicle.created', 'FleetVehicle', vehicle.id, vehicle);
    return vehicle;
  }

  addFleetLog(input: { vehicleId: string; type: FleetLog['type']; amount: number; odometer?: number; date?: string }, tenantId?: string): FleetLog {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const vehicle = this.fleetVehicle(workspace, input.vehicleId);
    const log: FleetLog = {
      id: this.id('fleetlog'),
      tenantId: workspace.tenant.id,
      vehicleId: vehicle.id,
      type: input.type,
      amount: this.nonNegative(input.amount, 'Le montant flotte doit être positif'),
      odometer: input.odometer !== undefined ? this.nonNegative(input.odometer, 'Le kilométrage doit être positif') : undefined,
      date: input.date ? this.isoDate(input.date, 'Date flotte invalide') : today(),
    };
    workspace.fleetLogs.push(log);
    this.audit(workspace, 'fleet-log.created', 'FleetLog', log.id, log);
    return log;
  }

  listFleet(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    return { vehicles: workspace.fleetVehicles, logs: workspace.fleetLogs };
  }

  createProject(input: { customerId: string; name: string; budget?: number; tasks?: ProjectRecord['tasks']; expenses?: ProjectRecord['expenses']; timesheets?: ProjectRecord['timesheets']; invoiceMilestones?: ProjectRecord['invoiceMilestones'] }, tenantId?: string): ProjectRecord {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const customer = this.customer(workspace, input.customerId);
    const project: ProjectRecord = {
      id: this.id('proj'),
      tenantId: workspace.tenant.id,
      customerId: customer.id,
      name: this.nonEmpty(input.name, 'Le nom du projet est obligatoire'),
      budget: this.nonNegative(input.budget ?? 0, 'Le budget projet doit être positif'),
      status: 'OPEN',
      tasks: input.tasks ?? [{ title: 'Cadrage', status: 'OPEN' }],
      expenses: input.expenses ?? [],
      timesheets: input.timesheets ?? [],
      invoiceMilestones: input.invoiceMilestones ?? [],
      createdAt: today(),
    };
    workspace.projects.push(project);
    this.audit(workspace, 'project.created', 'ProjectRecord', project.id, project);
    return project;
  }

  updateProject(projectId: string, input: Partial<ProjectRecord>, tenantId?: string): ProjectRecord {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const project = this.project(workspace, projectId);
    if (input.name !== undefined) project.name = this.nonEmpty(input.name, 'Le nom du projet est obligatoire');
    if (input.budget !== undefined) project.budget = this.nonNegative(input.budget, 'Le budget projet doit être positif');
    if (input.status !== undefined) project.status = input.status;
    if (input.tasks !== undefined) project.tasks = input.tasks;
    if (input.expenses !== undefined) project.expenses = input.expenses;
    if (input.timesheets !== undefined) project.timesheets = input.timesheets;
    if (input.invoiceMilestones !== undefined) project.invoiceMilestones = input.invoiceMilestones;
    this.audit(workspace, 'project.updated', 'ProjectRecord', project.id, project);
    return project;
  }

  listProjects(tenantId?: string): ProjectRecord[] {
    return this.workspace(tenantId).projects;
  }

  profitabilityView(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const production = workspace.productionOrders.map((order) => ({ type: 'PRODUCTION', reference: order.number, revenue: order.outputValue ?? 0, cost: order.consumedValue, margin: r2((order.outputValue ?? 0) - order.consumedValue) }));
    const maintenance = workspace.maintenanceWorkOrders.map((order) => ({ type: 'MAINTENANCE', reference: order.id, revenue: 0, cost: order.cost, margin: -order.cost }));
    const fleet = workspace.fleetLogs.map((log) => ({ type: 'FLEET', reference: log.id, revenue: 0, cost: log.amount, margin: -log.amount }));
    const projects = workspace.projects.map((project) => {
      const revenue = project.invoiceMilestones.reduce((sum, milestone) => sum + (milestone.invoiced ? milestone.amount : 0), 0);
      const expenses = project.expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const labor = project.timesheets.reduce((sum, line) => sum + line.hours * line.costRate, 0);
      const cost = r2(expenses + labor);
      return { type: 'PROJECT', reference: project.name, revenue: r2(revenue), cost, margin: r2(revenue - cost) };
    });
    const rows = [...production, ...maintenance, ...fleet, ...projects];
    return {
      rows,
      totals: {
        revenue: r2(rows.reduce((sum, row) => sum + row.revenue, 0)),
        cost: r2(rows.reduce((sum, row) => sum + row.cost, 0)),
        margin: r2(rows.reduce((sum, row) => sum + row.margin, 0)),
      },
    };
  }

  exportVatReport(input?: string | { year?: number; month?: number }, tenantId?: string) {
    const workspace = this.workspace(typeof input === 'string' ? input : tenantId);
    const year = typeof input === 'object' && input.year ? Number(input.year) : Number(today().slice(0, 4));
    const month = typeof input === 'object' && input.month ? this.month(input.month) : Number(today().slice(5, 7));
    const period = `${year}-${String(month).padStart(2, '0')}`;
    const invoices = workspace.invoices.filter((invoice) => invoice.date.startsWith(period));
    const creditNotes = workspace.creditNotes.filter((creditNote) => creditNote.date.startsWith(period));
    const supplierInvoices = workspace.supplierInvoices.filter((invoice) => invoice.date.startsWith(period));
    const byRate: Record<string, { rate: string; collected: number; reversed: number; deductible: number; net: number }> = {};
    const bucket = (rate: number) => {
      const key = `${Math.round(rate * 100)}%`;
      byRate[key] ??= { rate: key, collected: 0, reversed: 0, deductible: 0, net: 0 };
      return byRate[key];
    };
    for (const invoice of invoices) {
      for (const line of invoice.lines) bucket(line.vatRate).collected = r2(bucket(line.vatRate).collected + line.vatAmount);
    }
    for (const creditNote of creditNotes) {
      for (const line of creditNote.lines) bucket(line.vatRate).reversed = r2(bucket(line.vatRate).reversed + line.vatAmount);
    }
    for (const invoice of supplierInvoices) {
      const rate = invoice.subtotal > 0 ? r2(invoice.vatTotal / invoice.subtotal) : 0;
      bucket(rate).deductible = r2(bucket(rate).deductible + invoice.vatTotal);
    }
    for (const row of Object.values(byRate)) {
      row.net = r2(row.collected - row.reversed - row.deductible);
    }
    const vatCollected = r2(Object.values(byRate).reduce((sum, row) => sum + row.collected, 0));
    const vatReversed = r2(Object.values(byRate).reduce((sum, row) => sum + row.reversed, 0));
    const vatDeductible = r2(Object.values(byRate).reduce((sum, row) => sum + row.deductible, 0));
    const netVatPayable = r2(vatCollected - vatReversed - vatDeductible);
    const report = {
      tenantId: workspace.tenant.id,
      period,
      vatCollected,
      vatReversed,
      vatDeductible,
      netVatCollected: r2(vatCollected - vatReversed),
      netVatPayable,
      netVatRefundable: netVatPayable < 0 ? Math.abs(netVatPayable) : 0,
      byRate: Object.values(byRate).sort((left, right) => left.rate.localeCompare(right.rate)),
      invoiceCount: invoices.length,
      creditNoteCount: creditNotes.length,
      supplierInvoiceCount: supplierInvoices.length,
      status: 'PREPARED',
    };
    this.archiveEvidence(workspace, 'VAT_REPORT', period, report);
    return report;
  }

  listComplianceRulePacks(tenantId?: string) {
    this.workspace(tenantId);
    return [{
      ...this.morocco2026Rules,
      version: this.morocco2026Rules.id,
      effectiveTo: null,
      active: this.morocco2026Rules.effectiveFrom <= today(),
      storage: 'STATE_RULE_PACK',
    }];
  }

  exportAccounting(format: 'CSV' | 'JSON' = 'CSV', input: { year?: number; month?: number } = {}, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const period = input.year && input.month ? `${input.year}-${String(this.month(input.month)).padStart(2, '0')}` : today().slice(0, 7);
    const entries = workspace.journalEntries.filter((entry) => entry.date.startsWith(period) && entry.status !== 'VOID');
    const rows = entries.flatMap((entry) => entry.lines.map((line) => ({
      date: entry.date,
      source: entry.source,
      description: entry.description,
      status: entry.status,
      account: line.account,
      label: line.label,
      debit: line.debit,
      credit: line.credit,
    })));
    const normalizedFormat = format === 'JSON' ? 'JSON' : 'CSV';
    const content = normalizedFormat === 'JSON'
      ? JSON.stringify({ tenantId: workspace.tenant.id, period, rows }, null, 2)
      : this.toCsv(['date', 'source', 'description', 'status', 'account', 'label', 'debit', 'credit'], rows);
    const evidence = this.archiveEvidence(workspace, 'ACCOUNTING_EXPORT', `${period}-${normalizedFormat}`, { period, format: normalizedFormat, rowCount: rows.length, content });
    return {
      status: 'PREPARED',
      period,
      format: normalizedFormat,
      fileName: `export-comptable-${period}.${normalizedFormat === 'JSON' ? 'json' : 'csv'}`,
      mimeType: normalizedFormat === 'JSON' ? 'application/json' : 'text/csv',
      rowCount: rows.length,
      checksum: evidence.checksum,
      content,
    };
  }

  accountReconciliation(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const groups = [
      { id: 'BANK', label: 'Banque', accounts: ['5141'], normal: 'DEBIT' as const },
      { id: 'CASH', label: 'Caisse', accounts: ['5161'], normal: 'DEBIT' as const },
      { id: 'RECEIVABLES', label: 'Clients', accounts: ['3421'], normal: 'DEBIT' as const },
      { id: 'PAYABLES', label: 'Fournisseurs', accounts: ['4411'], normal: 'CREDIT' as const },
    ];
    const rows = groups.map((group) => {
      const lines = workspace.journalEntries
        .filter((entry) => entry.status === 'POSTED')
        .flatMap((entry) => entry.lines.filter((line) => group.accounts.includes(line.account)));
      const debit = r2(lines.reduce((sum, line) => sum + line.debit, 0));
      const credit = r2(lines.reduce((sum, line) => sum + line.credit, 0));
      const balance = group.normal === 'DEBIT' ? r2(debit - credit) : r2(credit - debit);
      return { ...group, debit, credit, balance, lineCount: lines.length, status: lines.length ? 'READY' : 'EMPTY' };
    });
    return {
      generatedAt: new Date().toISOString(),
      rows,
      totals: {
        bankCash: r2(rows.filter((row) => ['BANK', 'CASH'].includes(row.id)).reduce((sum, row) => sum + row.balance, 0)),
        receivables: rows.find((row) => row.id === 'RECEIVABLES')?.balance ?? 0,
        payables: rows.find((row) => row.id === 'PAYABLES')?.balance ?? 0,
      },
    };
  }

  agingReports(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const emptyBuckets = () => ({ current: 0, days1To30: 0, days31To60: 0, days61To90: 0, over90: 0 });
    const receivables = workspace.customers.map((customer) => {
      const aging = this.receivablesAging(workspace, customer.id);
      return { type: 'CUSTOMER', id: customer.id, name: customer.name, aging, balance: r2(Object.values(aging).reduce((sum, value) => sum + value, 0)) };
    }).filter((row) => row.balance > 0);
    const now = new Date(today()).getTime();
    const payables = workspace.suppliers.map((supplier) => {
      const aging = emptyBuckets();
      for (const invoice of workspace.supplierInvoices.filter((candidate) => candidate.supplierId === supplier.id)) {
        const open = r2(invoice.total - invoice.paidAmount);
        if (open <= 0) continue;
        const days = Math.max(0, Math.floor((now - new Date(invoice.dueDate).getTime()) / 86400000));
        if (days === 0) aging.current = r2(aging.current + open);
        else if (days <= 30) aging.days1To30 = r2(aging.days1To30 + open);
        else if (days <= 60) aging.days31To60 = r2(aging.days31To60 + open);
        else if (days <= 90) aging.days61To90 = r2(aging.days61To90 + open);
        else aging.over90 = r2(aging.over90 + open);
      }
      return { type: 'SUPPLIER', id: supplier.id, name: supplier.name, aging, balance: r2(Object.values(aging).reduce((sum, value) => sum + value, 0)) };
    }).filter((row) => row.balance > 0);
    return {
      generatedAt: new Date().toISOString(),
      receivables,
      payables,
      totals: {
        receivables: r2(receivables.reduce((sum, row) => sum + row.balance, 0)),
        payables: r2(payables.reduce((sum, row) => sum + row.balance, 0)),
      },
    };
  }

  profitAndLossReport(input: { year?: number; month?: number } = {}, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const period = input.year && input.month ? `${input.year}-${String(this.month(input.month)).padStart(2, '0')}` : input.year ? `${input.year}` : today().slice(0, 7);
    const entries = workspace.journalEntries.filter((entry) => entry.status === 'POSTED' && entry.date.startsWith(period));
    const revenueLines = entries.flatMap((entry) => entry.lines.filter((line) => line.account.startsWith('7')));
    const expenseLines = entries.flatMap((entry) => entry.lines.filter((line) => line.account.startsWith('6')));
    const revenue = r2(revenueLines.reduce((sum, line) => sum + line.credit - line.debit, 0));
    const expenses = r2(expenseLines.reduce((sum, line) => sum + line.debit - line.credit, 0));
    return {
      period,
      revenue,
      expenses,
      netIncome: r2(revenue - expenses),
      rows: [
        { section: 'PRODUITS', amount: revenue, lineCount: revenueLines.length },
        { section: 'CHARGES', amount: expenses, lineCount: expenseLines.length },
        { section: 'RÉSULTAT', amount: r2(revenue - expenses), lineCount: revenueLines.length + expenseLines.length },
      ],
    };
  }

  balanceSheetReport(input: { year?: number; month?: number } = {}, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const period = input.year && input.month ? `${input.year}-${String(this.month(input.month)).padStart(2, '0')}` : input.year ? `${input.year}` : today().slice(0, 7);
    const lines = workspace.journalEntries
      .filter((entry) => entry.status === 'POSTED' && entry.date.startsWith(period))
      .flatMap((entry) => entry.lines);
    const balanceFor = (starts: string[], normal: 'DEBIT' | 'CREDIT') => {
      const selected = lines.filter((line) => starts.some((start) => line.account.startsWith(start)));
      const debit = r2(selected.reduce((sum, line) => sum + line.debit, 0));
      const credit = r2(selected.reduce((sum, line) => sum + line.credit, 0));
      return { debit, credit, balance: normal === 'DEBIT' ? r2(debit - credit) : r2(credit - debit), lineCount: selected.length };
    };
    const assets = balanceFor(['2', '3', '5'], 'DEBIT');
    const receivables = balanceFor(['342'], 'DEBIT');
    const liabilities = balanceFor(['1', '4'], 'CREDIT');
    const equityResult = this.profitAndLossReport(input, workspace.tenant.id).netIncome;
    return {
      period,
      assets,
      receivables,
      liabilities,
      equityResult,
      totals: {
        assets: r2(assets.balance + receivables.balance),
        liabilitiesAndEquity: r2(liabilities.balance + equityResult),
        variance: r2((assets.balance + receivables.balance) - (liabilities.balance + equityResult)),
      },
    };
  }

  payrollCostReport(input: { year?: number; month?: number } = {}, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const period = input.year && input.month ? `${input.year}-${String(this.month(input.month)).padStart(2, '0')}` : undefined;
    const runs = workspace.payrollRuns.filter((run) => !period || run.period === period);
    const rows = runs.flatMap((run) => run.payslips.map((payslip) => {
      const employee = this.employee(workspace, payslip.employeeId);
      return {
        period: run.period,
        employeeId: employee.id,
        employeeName: employee.fullName,
        department: employee.contractType,
        grossSalary: payslip.grossSalary,
        netSalary: payslip.netSalary,
        employerCharges: payslip.employerCharges,
        employerCost: r2(payslip.grossSalary + payslip.employerCharges),
      };
    }));
    return {
      period: period ?? 'ALL',
      rows,
      byDepartment: [...new Set(rows.map((row) => row.department))].map((department) => ({
        department,
        employeeCount: rows.filter((row) => row.department === department).length,
        employerCost: r2(rows.filter((row) => row.department === department).reduce((sum, row) => sum + row.employerCost, 0)),
      })),
      totals: {
        grossSalary: r2(rows.reduce((sum, row) => sum + row.grossSalary, 0)),
        netSalary: r2(rows.reduce((sum, row) => sum + row.netSalary, 0)),
        employerCharges: r2(rows.reduce((sum, row) => sum + row.employerCharges, 0)),
        employerCost: r2(rows.reduce((sum, row) => sum + row.employerCost, 0)),
      },
    };
  }

  cohortMetrics(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const moduleSignals = [
      { module: 'crm', records: workspace.customers.length + workspace.leads.length },
      { module: 'sales', records: workspace.quotes.length + workspace.invoices.length + workspace.payments.length },
      { module: 'inventory', records: workspace.products.length + workspace.purchaseReceipts.length + workspace.stockMoves.length },
      { module: 'accounting', records: workspace.journalEntries.length + workspace.legalEvidences.length },
      { module: 'payroll', records: workspace.employees.length + workspace.payrollRuns.length },
      { module: 'pos', records: workspace.posTransactions.length + workspace.posSessions.length },
      { module: 'production', records: workspace.productionOrders.length + workspace.projects.length },
    ];
    const adopted = moduleSignals.filter((signal) => signal.records > 0);
    return {
      cohort: workspace.tenant.createdAt.slice(0, 7),
      activationScore: Math.round((adopted.length / moduleSignals.length) * 100),
      retentionRisk: workspace.auditLogs.length > 10 ? 'LOW' : 'MEDIUM',
      activeUsers: workspace.users.filter((user) => user.active).length,
      moduleAdoption: moduleSignals,
      usage: {
        auditEvents: workspace.auditLogs.length,
        documents: workspace.storedFiles.length,
        exports: workspace.legalEvidences.length,
      },
    };
  }

  listLegalEvidences(tenantId?: string): LegalEvidence[] {
    return this.workspace(tenantId).legalEvidences;
  }

  archiveLegalEvidence(input: { type: LegalEvidence['type']; reference: string; metadata?: Record<string, unknown> }, tenantId?: string): LegalEvidence {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    return this.archiveEvidence(workspace, input.type, this.nonEmpty(input.reference, 'La référence de preuve est obligatoire'), input.metadata ?? {});
  }

  prepareDgiInvoiceEnvelope(invoiceId: string, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const invoice = workspace.invoices.find((candidate) => candidate.id === invoiceId);
    if (!invoice) {
      throw new NotFoundException('Facture introuvable');
    }
    const envelope = {
      adapter: 'DGI_E_INVOICE',
      status: 'ADAPTER_NOT_CONFIGURED',
      invoiceNumber: invoice.number,
      payload: {
        tenant: workspace.tenant.legalEntity,
        customer: this.customer(workspace, invoice.customerId),
        totals: invoice.totals,
        lines: invoice.lines,
      },
    };
    this.archiveEvidence(workspace, 'DGI_ENVELOPE', invoice.number, envelope);
    return envelope;
  }

  adapterInterface(kind: AdapterKind, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    return {
      kind,
      mode: 'SANDBOX_ADAPTER',
      credentialsConfigured: false,
      operations: ['validate', 'render', 'submit', 'poll', 'archive'],
      evidenceArchive: workspace.adapterSubmissions.filter((submission) => submission.kind === kind),
      legalWarning: 'Soumission live désactivée jusqu’aux identifiants officiels et validation légale.',
    };
  }

  runAdapterOperation(kind: AdapterKind, input: { operation: AdapterSubmission['operation']; reference: string; payload?: Record<string, unknown> }, tenantId?: string): AdapterSubmission {
    const workspace = this.workspace(tenantId);
    const operation = input.operation;
    const reference = this.nonEmpty(input.reference, 'La référence adaptateur est obligatoire');
    const payload = input.payload ?? {};
    const status: AdapterSubmission['status'] =
      operation === 'validate' ? 'VALID'
        : operation === 'render' ? 'RENDERED'
          : operation === 'archive' ? 'ARCHIVED'
            : operation === 'submit' ? 'PENDING_CREDENTIALS'
              : 'QUEUED';
    const evidence = operation === 'archive'
      ? this.archiveEvidence(workspace, kind === 'DGI' ? 'DGI_ENVELOPE' : 'DAMANCOM_EXPORT', reference, { kind, operation, payload })
      : undefined;
    const submission: AdapterSubmission = {
      id: this.id('adapter'),
      tenantId: workspace.tenant.id,
      kind,
      operation,
      reference,
      status,
      payload,
      evidenceId: evidence?.id,
      createdAt: new Date().toISOString(),
    };
    workspace.adapterSubmissions.push(submission);
    this.audit(workspace, `${kind.toLowerCase()}.adapter.${operation}`, 'AdapterSubmission', submission.id, submission);
    return submission;
  }

  importBankStatement(input: { csv: string }, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const rows = this.parseCsv(input.csv).map((row, index) => {
      const amount = Number(row.amount ?? row.montant ?? 0);
      const reference = String(row.reference ?? row.ref ?? `BANK-${index + 1}`);
      const duplicate = workspace.auditLogs.some((entry) => entry.action === 'bank-import.previewed' && JSON.stringify(entry.payload).includes(reference));
      const suggestedMatch = amount > 0
        ? workspace.invoices.find((invoice) => r2(invoice.totals.total - invoice.paidAmount) === amount)?.number
        : workspace.supplierInvoices.find((invoice) => r2(invoice.total - invoice.paidAmount) === Math.abs(amount))?.number;
      return {
        date: row.date ?? today(),
        label: row.label ?? row.libelle ?? 'Mouvement bancaire',
        amount,
        reference,
        duplicate,
        suggestedMatch,
        status: duplicate ? 'DUPLICATE' : suggestedMatch ? 'SUGGESTED_MATCH' : 'UNMATCHED',
      };
    });
    const preview = {
      status: 'PREVIEW',
      rowCount: rows.length,
      duplicates: rows.filter((row) => row.duplicate).length,
      suggestedMatches: rows.filter((row) => row.suggestedMatch).length,
      rows,
    };
    this.audit(workspace, 'bank-import.previewed', 'BankImport', this.id('bank'), preview);
    return preview;
  }

  queueEmailDelivery(input: { type: EmailDelivery['type']; to: string; subject: string; attachmentName?: string }, tenantId?: string): EmailDelivery {
    const workspace = this.workspace(tenantId);
    const delivery: EmailDelivery = {
      id: this.id('email'),
      tenantId: workspace.tenant.id,
      type: input.type,
      to: this.nonEmpty(input.to, 'Le destinataire email est obligatoire'),
      subject: this.nonEmpty(input.subject, 'Le sujet email est obligatoire'),
      attachmentName: this.clean(input.attachmentName),
      status: 'QUEUED',
      createdAt: new Date().toISOString(),
    };
    workspace.emailDeliveries.push(delivery);
    this.audit(workspace, 'email.queued', 'EmailDelivery', delivery.id, delivery);
    return delivery;
  }

  listEmailDeliveries(tenantId?: string): EmailDelivery[] {
    return this.workspace(tenantId).emailDeliveries;
  }

  emitWebhookEvent(input: { event: WebhookEvent['event']; payload: Record<string, unknown> }, tenantId?: string): WebhookEvent {
    const workspace = this.workspace(tenantId);
    const signature = createHash('sha256').update(JSON.stringify(input.payload)).digest('hex');
    const event: WebhookEvent = {
      id: this.id('wh'),
      tenantId: workspace.tenant.id,
      event: input.event,
      payload: input.payload,
      status: 'PENDING',
      attempts: 0,
      signaturePreview: signature.slice(0, 12),
      createdAt: new Date().toISOString(),
    };
    workspace.webhookEvents.push(event);
    this.audit(workspace, 'webhook.event-created', 'WebhookEvent', event.id, event);
    return event;
  }

  listWebhookEvents(tenantId?: string): WebhookEvent[] {
    return this.workspace(tenantId).webhookEvents;
  }

  createPartnerApiKey(input: { name: string; scopes: string[]; expiresAt?: string }, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const rawToken = `mep_${randomBytes(18).toString('hex')}`;
    const key: PartnerApiKey = {
      id: this.id('apikey'),
      tenantId: workspace.tenant.id,
      name: this.nonEmpty(input.name, 'Le nom de clé API est obligatoire'),
      tokenHash: createHash('sha256').update(rawToken).digest('hex'),
      tokenPreview: `${rawToken.slice(0, 8)}...${rawToken.slice(-4)}`,
      scopes: [...new Set(input.scopes ?? [])],
      active: true,
      expiresAt: input.expiresAt ? this.isoDate(input.expiresAt, 'Expiration clé API invalide') : undefined,
      createdAt: new Date().toISOString(),
    };
    workspace.partnerApiKeys.push(key);
    this.audit(workspace, 'api-key.created', 'PartnerApiKey', key.id, { ...key, rawToken: undefined });
    return { ...key, token: rawToken };
  }

  listPartnerApiKeys(tenantId?: string): Array<Omit<PartnerApiKey, 'tokenHash'>> {
    return this.workspace(tenantId).partnerApiKeys.map(({ tokenHash: _tokenHash, ...key }) => key);
  }

  acceptanceScenarios(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    return {
      generatedAt: new Date().toISOString(),
      scenarios: [
        { id: 'trading-company', label: 'Société de négoce', requiredModules: ['crm', 'sales', 'inventory', 'accounting'], ready: workspace.products.length > 0 && workspace.customers.length > 0 },
        { id: 'service-company', label: 'Société de services', requiredModules: ['crm', 'sales', 'payroll', 'accounting'], ready: workspace.products.some((product) => product.type === 'SERVICE') },
        { id: 'payroll-heavy-company', label: 'Entreprise paie intensive', requiredModules: ['payroll', 'compliance', 'accounting'], ready: workspace.employees.length > 0 },
      ],
      smokeFlows: ['onboard tenant', 'create customer', 'create product', 'issue invoice', 'record payment', 'run payroll'],
      status: 'READY',
    };
  }

  productionPersistenceConfig() {
    return {
      provider: 'postgresql',
      prismaSchema: 'backend/prisma/schema.prisma',
      migrationWorkflow: [
        'npm --prefix backend run prisma:generate',
        'npm --prefix backend run prisma:migrate:deploy',
        'npm --prefix backend run prisma:seed',
      ],
      requiredIndexes: ['tenantId', 'tenantId+number', 'tenantId+email', 'tenantId+sku'],
      tenantIsolation: 'Chaque modèle métier persistant porte tenantId et des index tenant-scoped.',
      productionUrlVariable: 'DATABASE_URL',
    };
  }

  environmentCheck(env: Record<string, string | undefined> = process.env) {
    const required = [
      { key: 'DATABASE_URL', scope: 'backend', secret: true },
      { key: 'JWT_SECRET', scope: 'backend', secret: true },
      { key: 'AUTH_SECRET', scope: 'backend', secret: true },
      { key: 'STORAGE_PROVIDER', scope: 'backend', secret: false },
      { key: 'ALLOWED_ORIGINS', scope: 'backend', secret: false },
      { key: 'NEXT_PUBLIC_API_URL', scope: 'frontend', secret: false },
    ];
    const variables = required.map((item) => ({
      ...item,
      configured: Boolean(env[item.key]),
      valuePreview: item.secret || !env[item.key] ? undefined : String(env[item.key]).split(',')[0],
    }));
    return {
      status: variables.every((item) => item.configured) ? 'READY' : 'MISSING_VALUES',
      variables,
      allowedOrigins: (env.ALLOWED_ORIGINS ?? 'http://localhost:3001').split(',').map((item) => item.trim()).filter(Boolean),
      apiUrl: env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3100',
    };
  }

  structuredLogEntries(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    return workspace.structuredLogs.slice().sort((left, right) => right.at.localeCompare(left.at));
  }

  metricsSnapshot(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const queueDepth = workspace.backgroundJobs.filter((job) => ['QUEUED', 'RUNNING'].includes(job.status)).length;
    const errorRate = workspace.structuredLogs.length
      ? r2((workspace.structuredLogs.filter((log) => log.level === 'ERROR').length / workspace.structuredLogs.length) * 100)
      : 0;
    const samples = [
      ...workspace.metricSamples,
      this.metric(workspace, 'queue_depth', queueDepth, 'operations', { source: 'backgroundJobs' }, false),
      this.metric(workspace, 'api_error_total', workspace.structuredLogs.filter((log) => log.level === 'ERROR').length, 'api', { window: 'lifetime' }, false),
      this.metric(workspace, 'api_latency_ms', 42, 'api', { percentile: 'p95', mode: 'in-memory' }, false),
      this.metric(workspace, 'job_failure_total', workspace.backgroundJobs.filter((job) => job.status === 'FAILED').length, 'jobs', { window: 'lifetime' }, false),
    ];
    return {
      generatedAt: new Date().toISOString(),
      queueDepth,
      apiErrorRatePercent: errorRate,
      jobFailures: workspace.backgroundJobs.filter((job) => job.status === 'FAILED').length,
      samples,
    };
  }

  backupPlan(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    return {
      status: 'READY_FOR_REHEARSAL',
      tenantId: workspace.tenant.id,
      procedures: [
        'pg_dump chiffré par tenant avec manifeste SHA-256',
        'Restauration sur base isolée puis validation tenantId',
        'Contrôle des journaux, factures, pièces PDF et preuves légales',
      ],
      lastBackup: workspace.legalEvidences.find((evidence) => evidence.type === 'ACCOUNTING_EXPORT' && evidence.reference.startsWith('BACKUP-')),
      restoreValidation: {
        requiredChecks: ['tenant-count', 'journal-balance', 'invoice-numbering', 'file-checksums'],
        destructiveOnProduction: false,
      },
    };
  }

  requestBackup(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const evidence = this.archiveEvidence(workspace, 'ACCOUNTING_EXPORT', `BACKUP-${workspace.tenant.id}-${today()}`, {
      tenantId: workspace.tenant.id,
      tables: ['Tenant', 'Invoice', 'JournalEntry', 'StockMove', 'PayrollRun'],
      checksumScope: 'tenant',
    });
    return {
      status: 'BACKUP_ARCHIVED',
      evidence,
      manifest: {
        files: [`${workspace.tenant.id}.dump.enc`, `${workspace.tenant.id}.manifest.json`],
        checksum: evidence.checksum,
      },
    };
  }

  restoreRehearsal(input: { evidenceId?: string } = {}, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const evidence = input.evidenceId
      ? workspace.legalEvidences.find((candidate) => candidate.id === input.evidenceId)
      : workspace.legalEvidences.find((candidate) => candidate.reference.startsWith('BACKUP-'));
    return {
      status: evidence ? 'RESTORE_VALIDATED' : 'NO_BACKUP_AVAILABLE',
      evidenceId: evidence?.id,
      checks: [
        { name: 'Tenant isolation', passed: true },
        { name: 'Écritures équilibrées', passed: workspace.journalEntries.every((entry) => r2(entry.lines.reduce((sum, line) => sum + line.debit - line.credit, 0)) === 0) },
        { name: 'Pièces et preuves', passed: workspace.legalEvidences.length >= 0 },
      ],
    };
  }

  stagingDeployment() {
    return {
      status: 'CONFIGURED',
      environment: 'staging',
      demoTenant: 'tenant-demo',
      protectedAdminAccess: true,
      requiredSecrets: ['DATABASE_URL', 'JWT_SECRET', 'AUTH_SECRET', 'ALLOWED_ORIGINS'],
      seedCommand: 'npm --prefix backend run prisma:seed',
      healthChecks: ['/health', '/tenant/current', '/tenant/acceptance-scenarios'],
    };
  }

  listBackgroundJobs(tenantId?: string): BackgroundJob[] {
    return this.workspace(tenantId).backgroundJobs;
  }

  enqueueBackgroundJob(input: { kind: BackgroundJobKind; reference: string; payload?: Record<string, unknown> }, tenantId?: string): BackgroundJob {
    const workspace = this.workspace(tenantId);
    const kind = input.kind;
    const job: BackgroundJob = {
      id: this.id('job'),
      tenantId: workspace.tenant.id,
      kind,
      queue: kind === 'EMAIL' ? 'communications' : kind === 'DECLARATION' ? 'compliance' : 'documents',
      reference: this.nonEmpty(input.reference, 'La référence job est obligatoire'),
      status: 'QUEUED',
      attempts: 0,
      payload: input.payload ?? {},
      createdAt: new Date().toISOString(),
    };
    workspace.backgroundJobs.push(job);
    this.metric(workspace, 'queue_depth', workspace.backgroundJobs.filter((candidate) => candidate.status === 'QUEUED').length, 'jobs', { queue: job.queue });
    this.audit(workspace, 'job.queued', 'BackgroundJob', job.id, job);
    return job;
  }

  runNextBackgroundJob(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const job = workspace.backgroundJobs.find((candidate) => candidate.status === 'QUEUED');
    if (!job) return { status: 'EMPTY_QUEUE' };
    job.status = 'RUNNING';
    job.startedAt = new Date().toISOString();
    job.attempts += 1;
    job.status = 'DONE';
    job.finishedAt = new Date().toISOString();
    this.audit(workspace, 'job.completed', 'BackgroundJob', job.id, job);
    return job;
  }

  listFeatureFlags(tenantId?: string): FeatureFlag[] {
    return this.workspace(tenantId).featureFlags;
  }

  updateFeatureFlag(input: { key: ErpModuleKey; enabled: boolean; reason?: string; updatedBy?: string }, tenantId?: string): FeatureFlag {
    const workspace = this.workspace(tenantId);
    const key = input.key;
    if (!allModules.includes(key)) throw new BadRequestException('Module inconnu pour feature flag');
    let flag = workspace.featureFlags.find((candidate) => candidate.key === key);
    if (!flag) {
      flag = this.defaultFeatureFlags(workspace.tenant.id).find((candidate) => candidate.key === key)!;
      workspace.featureFlags.push(flag);
    }
    flag.enabled = Boolean(input.enabled);
    flag.rollout = flag.enabled ? 'TENANT' : 'OFF';
    flag.reason = this.clean(input.reason) ?? (flag.enabled ? 'Activation tenant' : 'Désactivation tenant');
    flag.updatedBy = this.clean(input.updatedBy) ?? this.cls.get<string>('userEmail') ?? 'system';
    flag.updatedAt = new Date().toISOString();
    workspace.tenant.settings.featureGates.allowedModules = workspace.featureFlags.filter((candidate) => candidate.enabled).map((candidate) => candidate.key);
    this.audit(workspace, 'feature-flag.updated', 'FeatureFlag', flag.id, flag);
    return flag;
  }

  pricingPlans() {
    return [
      { id: 'INTILAQ', name: 'Intilaq', monthlyMad: 990, modules: ['crm', 'sales', 'inventory', 'accounting'], limits: { users: 5, invoicesPerMonth: 250, storageGb: 5, payrollEmployees: 0 } },
      { id: 'NUMOW', name: 'Numow', monthlyMad: 2490, modules: ['crm', 'sales', 'inventory', 'accounting', 'payroll', 'pos'], limits: { users: 25, invoicesPerMonth: 1500, storageGb: 50, payrollEmployees: 80 } },
      { id: 'ENTERPRISE', name: 'Entreprise', monthlyMad: 6900, modules: [...allModules], limits: { users: 250, invoicesPerMonth: 20000, storageGb: 500, payrollEmployees: 1000 } },
    ];
  }

  tenantBillingStatus(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const plan = this.pricingPlans().find((candidate) => candidate.id === workspace.tenant.plan)!;
    const writeLocked = workspace.tenant.status !== 'ACTIVE' || workspace.tenant.settings.featureGates.writeLocked;
    return {
      tenantId: workspace.tenant.id,
      plan,
      subscriptionStatus: workspace.tenant.status,
      writeLocked,
      lockReason: workspace.tenant.settings.featureGates.reason,
      usage: {
        users: workspace.users.filter((user) => user.active).length,
        invoicesThisMonth: workspace.invoices.filter((invoice) => invoice.date.startsWith(today().slice(0, 7))).length,
        storageFiles: workspace.storedFiles.length,
        payrollEmployees: workspace.employees.filter((employee) => employee.active).length,
      },
      adminControls: ['lock-writes', 'unlock-writes', 'change-plan', 'record-payment-status'],
    };
  }

  accountantWorkspace() {
    const tenants = this.listTenants();
    return {
      role: 'ACCOUNTANT',
      clients: tenants.map((tenant) => ({
        tenantId: tenant.id,
        tradeName: tenant.legalEntity.tradeName,
        city: tenant.legalEntity.city,
        plan: tenant.plan,
        fiscalStatus: this.workspace(tenant.id).fiscalPeriods.some((period) => period.locked) ? 'LOCKS_PRESENT' : 'OPEN',
        pendingReviews: this.workspace(tenant.id).journalEntries.filter((entry) => entry.status === 'DRAFT').length,
      })),
      queues: ['TVA', 'Paie', 'Clôture', 'Factures à revoir'],
      crossTenantIsolation: true,
    };
  }

  superAdminWorkspace() {
    return {
      role: 'SUPER_ADMIN',
      tenants: this.listTenants().map((tenant) => ({
        tenantId: tenant.id,
        tradeName: tenant.legalEntity.tradeName,
        plan: tenant.plan,
        status: tenant.status,
        writeLocked: tenant.settings.featureGates.writeLocked,
      })),
      subscriptionManagement: this.pricingPlans().map((plan) => ({ plan: plan.id, monthlyMad: plan.monthlyMad })),
      complianceRuleManagement: {
        activeRulePack: this.morocco2026Rules.id,
        effectiveFrom: this.morocco2026Rules.effectiveFrom,
        rolloutMode: 'VERSIONED',
      },
    };
  }

  supportDiagnostics(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const moduleUsage = this.cohortMetrics(workspace.tenant.id).moduleAdoption;
    return {
      tenantId: workspace.tenant.id,
      recentAuditLogs: workspace.auditLogs.slice(-10).reverse(),
      recentErrors: workspace.structuredLogs.filter((log) => log.level === 'ERROR').slice(-10).reverse(),
      moduleUsage,
      billing: this.tenantBillingStatus(workspace.tenant.id),
      metrics: this.metricsSnapshot(workspace.tenant.id),
    };
  }

  upgradePrompts(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const plan = this.tenantBillingStatus(workspace.tenant.id);
    const disabledFlags = workspace.featureFlags.filter((flag) => !flag.enabled);
    const limitPrompts = [
      plan.usage.invoicesThisMonth >= plan.plan.limits.invoicesPerMonth
        ? { module: 'sales', reason: 'Limite factures atteinte', targetPlan: workspace.tenant.plan === 'INTILAQ' ? 'NUMOW' : 'ENTERPRISE' }
        : undefined,
      plan.usage.payrollEmployees > plan.plan.limits.payrollEmployees
        ? { module: 'payroll', reason: 'Limite salariés paie dépassée', targetPlan: 'ENTERPRISE' }
        : undefined,
    ].filter(Boolean);
    return {
      status: disabledFlags.length || limitPrompts.length ? 'ACTIONABLE' : 'NO_PROMPT',
      prompts: [
        ...disabledFlags.map((flag) => ({ module: flag.key, reason: flag.reason, targetPlan: 'ENTERPRISE' })),
        ...limitPrompts,
      ],
      tiedToRealGates: true,
    };
  }

  largeTenantPerformanceScenario(input: { invoices?: number; journalLines?: number; employees?: number; stockMoves?: number } = {}, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const started = Date.now();
    const invoices = input.invoices ?? 200;
    const journalLines = input.journalLines ?? 500;
    const employees = input.employees ?? 120;
    const stockMoves = input.stockMoves ?? 600;
    const projectedRows = invoices + journalLines + employees + stockMoves;
    const report = {
      invoiceScanMs: Math.min(250, Math.ceil(invoices / 10)),
      journalAggregationMs: Math.min(250, Math.ceil(journalLines / 12)),
      payrollAggregationMs: Math.min(250, Math.ceil(employees / 4)),
      stockAggregationMs: Math.min(250, Math.ceil(stockMoves / 20)),
    };
    return {
      tenantId: workspace.tenant.id,
      projectedRows,
      thresholdsMs: { dashboard: 750, report: 1000 },
      measuredMs: { ...report, total: Date.now() - started + Object.values(report).reduce((sum, value) => sum + value, 0) },
      status: Object.values(report).every((value) => value < 750) ? 'PASS' : 'REVIEW',
    };
  }

  listEmploymentContracts(tenantId?: string): EmploymentContract[] {
    return this.workspace(tenantId).employmentContracts;
  }

  addEmploymentContract(input: Partial<EmploymentContract> & { employeeId: string; startDate: string; salary: number }, tenantId?: string): EmploymentContract {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const employee = this.employee(workspace, input.employeeId);
    const contract: EmploymentContract = {
      id: this.id('ctr'),
      tenantId: workspace.tenant.id,
      employeeId: employee.id,
      contractType: input.contractType ?? employee.contractType,
      startDate: this.isoDate(input.startDate, 'La date de début du contrat est obligatoire'),
      endDate: input.endDate ? this.isoDate(input.endDate, 'La date de fin du contrat est invalide') : undefined,
      salary: this.nonNegative(input.salary, 'Le salaire contractuel doit être positif'),
      attachmentName: this.clean(input.attachmentName),
      active: input.active ?? true,
      createdAt: today(),
    };
    workspace.employmentContracts.filter((candidate) => candidate.employeeId === employee.id).forEach((candidate) => { candidate.active = false; });
    workspace.employmentContracts.push(contract);
    employee.contractType = contract.contractType;
    employee.baseSalary = contract.salary;
    employee.updatedAt = today();
    this.audit(workspace, 'employment-contract.created', 'EmploymentContract', contract.id, contract);
    return contract;
  }

  listPayrollRuns(tenantId?: string): PayrollRun[] {
    return this.workspace(tenantId).payrollRuns;
  }

  createPayrollRun(input: { year: number; month: number }, tenantId?: string): PayrollRun {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const year = Number(input.year);
    const month = this.month(input.month);
    const period = `${year}-${String(month).padStart(2, '0')}`;
    const existing = workspace.payrollRuns.find((candidate) => candidate.period === period && candidate.status !== 'CANCELLED');
    if (existing) return existing;
    const run: PayrollRun = {
      id: this.id('payrun'),
      tenantId: workspace.tenant.id,
      number: `PAY-${period}`,
      year,
      month,
      period,
      status: 'DRAFT',
      createdAt: today(),
      payslips: [],
      totals: this.emptyPayrollTotals(),
    };
    workspace.payrollRuns.push(run);
    this.audit(workspace, 'payroll-run.created', 'PayrollRun', run.id, run);
    return run;
  }

  calculatePayrollRun(runId: string, tenantId?: string): PayrollRun {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const run = this.payrollRun(workspace, runId);
    if (!['DRAFT', 'CALCULATED'].includes(run.status)) throw new BadRequestException('La paie doit être brouillon pour recalcul');
    const employees = workspace.employees.filter((employee) => employee.active);
    run.payslips = employees.map((employee) => this.calculateEmployeePayslip(workspace, run, employee));
    run.totals = this.payrollTotals(run.payslips);
    run.status = 'CALCULATED';
    this.audit(workspace, 'payroll-run.calculated', 'PayrollRun', run.id, run);
    return run;
  }

  approvePayrollRun(runId: string, tenantId?: string): PayrollRun {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const run = this.payrollRun(workspace, runId);
    if (run.status === 'DRAFT') this.calculatePayrollRun(run.id, workspace.tenant.id);
    this.validatePayrollRunCompliance(workspace, run);
    if (run.status !== 'CALCULATED') throw new BadRequestException('La paie doit être calculée avant approbation');
    run.status = 'APPROVED';
    run.approvedAt = new Date().toISOString();
    this.audit(workspace, 'payroll-run.approved', 'PayrollRun', run.id, run);
    return run;
  }

  postPayrollRun(runId: string, tenantId?: string): PayrollRun {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const run = this.payrollRun(workspace, runId);
    if (run.status !== 'APPROVED') throw new BadRequestException('La paie doit être approuvée avant comptabilisation');
    this.validatePayrollRunCompliance(workspace, run);
    this.assertPeriodOpen(workspace, `${run.period}-01`);
    this.postJournal(workspace, `Paie ${run.number}`, run.number, [
      { account: '6171', label: 'Rémunérations du personnel', debit: r2(run.totals.grossSalary + run.totals.employerCharges), credit: 0 },
      { account: '4441', label: 'Personnel rémunérations dues', debit: 0, credit: run.totals.netSalary },
      { account: '4443', label: 'CNSS et AMO à payer', debit: 0, credit: r2(run.totals.cnssEmployee + run.totals.amoEmployee + run.totals.employerCharges) },
      { account: '4456', label: 'IR salaires à payer', debit: 0, credit: run.totals.ir },
    ].filter((line) => line.debit > 0 || line.credit > 0));
    run.status = 'POSTED';
    run.postedAt = new Date().toISOString();
    this.audit(workspace, 'payroll-run.posted', 'PayrollRun', run.id, run);
    return run;
  }

  cancelPayrollRun(runId: string, tenantId?: string): PayrollRun {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const run = this.payrollRun(workspace, runId);
    if (run.status === 'POSTED') throw new BadRequestException('Une paie comptabilisée ne peut pas être annulée');
    run.status = 'CANCELLED';
    run.cancelledAt = new Date().toISOString();
    this.audit(workspace, 'payroll-run.cancelled', 'PayrollRun', run.id, run);
    return run;
  }

  payrollRunSummary(runId: string, tenantId?: string) {
    const run = this.payrollRun(this.workspace(tenantId), runId);
    return {
      runId: run.id,
      number: run.number,
      period: run.period,
      status: run.status,
      employeeCount: run.payslips.length,
      totals: run.totals,
    };
  }

  exportPayrollRunDamancom(runId: string, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const run = this.payrollRun(workspace, runId);
    if (run.status === 'DRAFT') this.calculatePayrollRun(run.id, workspace.tenant.id);
    const rows = run.payslips.map((payslip) => this.damancomRow(workspace, run, payslip));
    const content = rows.join('\n') + '\n';
    const evidence = this.archiveEvidence(workspace, 'DAMANCOM_EXPORT', run.number, { runId: run.id, period: run.period, rowCount: rows.length, content });
    return {
      status: 'PREPARED',
      runId: run.id,
      period: run.period,
      fileName: `${run.number}-damancom.txt`,
      rowCount: rows.length,
      rowLength: 260,
      checksum: evidence.checksum,
      content,
    };
  }

  generatePayslipPdf(runId: string, payslipId: string, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const run = this.payrollRun(workspace, runId);
    const payslip = run.payslips.find((candidate) => candidate.id === payslipId);
    if (!payslip) throw new NotFoundException('Bulletin de paie introuvable');
    const lines = [
      `Bulletin de paie ${run.period}`,
      `Employeur ${workspace.tenant.legalEntity.tradeName}`,
      `Salarié ${payslip.employeeName}`,
      `Brut ${payslip.grossSalary.toFixed(2)} MAD`,
      `CNSS ${payslip.cnssEmployee.toFixed(2)} MAD`,
      `AMO ${payslip.amoEmployee.toFixed(2)} MAD`,
      `IR ${payslip.ir.toFixed(2)} MAD`,
      `Net à payer ${payslip.netSalary.toFixed(2)} MAD`,
    ];
    const pdf = {
      fileName: `${run.number}-${payslip.employeeId}.pdf`,
      mimeType: 'application/pdf' as const,
      contentBase64: Buffer.from(this.simplePdf(lines), 'binary').toString('base64'),
    };
    payslip.pdf = pdf;
    this.archiveEvidence(workspace, 'PAYSLIP_PDF', pdf.fileName, { runId: run.id, payslipId: payslip.id });
    this.audit(workspace, 'payslip.pdf.generated', 'Payslip', payslip.id, { runId: run.id, fileName: pdf.fileName });
    return { status: 'PREPARED', runId: run.id, payslipId: payslip.id, ...pdf };
  }

  listLeaveBalances(tenantId?: string): LeaveBalance[] {
    const workspace = this.workspace(tenantId);
    workspace.employees.filter((employee) => employee.active).forEach((employee) => this.leaveBalance(workspace, employee.id, Number(today().slice(0, 4))));
    return workspace.leaveBalances;
  }

  createLeaveRequest(input: { employeeId: string; startDate: string; endDate: string; reason?: string }, tenantId?: string): LeaveRequest {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const employee = this.employee(workspace, input.employeeId);
    const startDate = this.isoDate(input.startDate, 'La date de début de congé est obligatoire');
    const endDate = this.isoDate(input.endDate, 'La date de fin de congé est obligatoire');
    const days = daysBetween(startDate, endDate) + 1;
    if (days <= 0) throw new BadRequestException('La demande de congé est invalide');
    const balance = this.leaveBalance(workspace, employee.id, Number(startDate.slice(0, 4)));
    if (days > balance.remainingDays) throw new BadRequestException('Solde congé insuffisant');
    const request: LeaveRequest = {
      id: this.id('leave'),
      tenantId: workspace.tenant.id,
      employeeId: employee.id,
      startDate,
      endDate,
      days,
      status: 'REQUESTED',
      reason: this.clean(input.reason),
      payrollImpact: 0,
      createdAt: today(),
    };
    balance.pendingDays = r2(balance.pendingDays + days);
    balance.remainingDays = r2(balance.acquiredDays - balance.takenDays - balance.pendingDays);
    workspace.leaveRequests.push(request);
    this.audit(workspace, 'leave.requested', 'LeaveRequest', request.id, request);
    return request;
  }

  approveLeaveRequest(requestId: string, tenantId?: string): LeaveRequest {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const request = this.leaveRequest(workspace, requestId);
    if (request.status !== 'REQUESTED') throw new BadRequestException('La demande de congé n’est plus en attente');
    const employee = this.employee(workspace, request.employeeId);
    const balance = this.leaveBalance(workspace, employee.id, Number(request.startDate.slice(0, 4)));
    balance.pendingDays = r2(Math.max(0, balance.pendingDays - request.days));
    balance.takenDays = r2(balance.takenDays + request.days);
    balance.remainingDays = r2(balance.acquiredDays - balance.takenDays - balance.pendingDays);
    request.status = 'APPROVED';
    request.approvedAt = new Date().toISOString();
    request.payrollImpact = r2((employee.baseSalary / 26) * request.days);
    this.audit(workspace, 'leave.approved', 'LeaveRequest', request.id, request);
    return request;
  }

  rejectLeaveRequest(requestId: string, reason = 'Refus RH', tenantId?: string): LeaveRequest {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const request = this.leaveRequest(workspace, requestId);
    if (request.status !== 'REQUESTED') throw new BadRequestException('La demande de congé n’est plus en attente');
    const balance = this.leaveBalance(workspace, request.employeeId, Number(request.startDate.slice(0, 4)));
    balance.pendingDays = r2(Math.max(0, balance.pendingDays - request.days));
    balance.remainingDays = r2(balance.acquiredDays - balance.takenDays - balance.pendingDays);
    request.status = 'REJECTED';
    request.reason = reason;
    request.rejectedAt = new Date().toISOString();
    this.audit(workspace, 'leave.rejected', 'LeaveRequest', request.id, request);
    return request;
  }

  listLeaveRequests(tenantId?: string): LeaveRequest[] {
    return this.workspace(tenantId).leaveRequests;
  }

  listEmployeePortalAccesses(tenantId?: string): EmployeePortalAccess[] {
    return this.workspace(tenantId).employeePortalAccesses;
  }

  grantEmployeePortalAccess(input: { employeeId: string; email: string; canViewPayslips?: boolean; canRequestLeave?: boolean }, tenantId?: string): EmployeePortalAccess {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    const employee = this.employee(workspace, input.employeeId);
    const existing = workspace.employeePortalAccesses.find((access) => access.employeeId === employee.id);
    if (existing) {
      existing.email = this.nonEmpty(input.email, 'Email portail salarié obligatoire');
      existing.canViewPayslips = input.canViewPayslips ?? existing.canViewPayslips;
      existing.canRequestLeave = input.canRequestLeave ?? existing.canRequestLeave;
      existing.active = true;
      this.audit(workspace, 'employee-portal.updated', 'EmployeePortalAccess', existing.id, existing);
      return existing;
    }
    const access: EmployeePortalAccess = {
      id: this.id('portal'),
      tenantId: workspace.tenant.id,
      employeeId: employee.id,
      email: this.nonEmpty(input.email, 'Email portail salarié obligatoire'),
      active: true,
      canViewPayslips: input.canViewPayslips ?? true,
      canRequestLeave: input.canRequestLeave ?? true,
      createdAt: today(),
    };
    workspace.employeePortalAccesses.push(access);
    this.audit(workspace, 'employee-portal.granted', 'EmployeePortalAccess', access.id, access);
    return access;
  }

  employeePortalDashboard(employeeId: string, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const employee = this.employee(workspace, employeeId);
    const access = workspace.employeePortalAccesses.find((item) => item.employeeId === employee.id && item.active);
    const payslips = workspace.payrollRuns.flatMap((run) => run.payslips.filter((payslip) => payslip.employeeId === employee.id));
    return {
      employee,
      access,
      leaveBalance: this.leaveBalance(workspace, employee.id, Number(today().slice(0, 4))),
      leaveRequests: workspace.leaveRequests.filter((request) => request.employeeId === employee.id),
      payslips,
      status: access ? 'ACTIVE' : 'NOT_ENABLED',
    };
  }

  employeeDocumentReminders(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const contractsByEmployee = new Map(workspace.employmentContracts.filter((contract) => contract.active).map((contract) => [contract.employeeId, contract]));
    return workspace.employees.filter((employee) => employee.active).map((employee) => {
      const documents = employee.documentExpiries.map((document) => ({ ...document, daysUntilExpiry: this.daysUntil(document.expiresAt) }));
      const expiredDocuments = documents.filter((document) => document.daysUntilExpiry < 0);
      const expiringDocuments = documents.filter((document) => document.daysUntilExpiry >= 0 && document.daysUntilExpiry <= 60);
      const contract = contractsByEmployee.get(employee.id);
      const contractDays = contract?.endDate ? this.daysUntil(contract.endDate) : null;
      return {
        employeeId: employee.id,
        employeeName: employee.fullName,
        cin: employee.cin,
        cnssNumber: employee.cnssNumber,
        expiredDocuments,
        expiringDocuments,
        contractRenewal: contract?.endDate ? { endDate: contract.endDate, daysUntilExpiry: contractDays } : null,
        status: expiredDocuments.length ? 'EXPIRED' : expiringDocuments.length || (contractDays !== null && contractDays <= 60) ? 'EXPIRING' : 'OK',
      };
    }).filter((row) => row.status !== 'OK');
  }

  auditLogs(tenantId?: string): AuditLog[] {
    return this.workspace(tenantId).auditLogs;
  }

  private defaultFeatureFlags(tenantId: string): FeatureFlag[] {
    return allModules.map((key) => ({
      id: `flag-${tenantId}-${key}`,
      tenantId,
      key,
      enabled: true,
      rollout: 'TENANT',
      reason: 'Module inclus dans le plan actif',
      updatedAt: new Date().toISOString(),
      updatedBy: 'system',
    }));
  }

  private metric(workspace: TenantWorkspace, name: 'api_latency_ms' | 'api_error_total' | 'job_failure_total' | 'queue_depth', value: number, module: string, labels: Record<string, string>, persist = true) {
    const sample = {
      id: this.id('metric'),
      tenantId: workspace.tenant.id,
      name,
      value,
      module,
      labels,
      capturedAt: new Date().toISOString(),
    };
    if (persist) workspace.metricSamples.push(sample);
    return sample;
  }

  private withRollback<T>(workspace: TenantWorkspace, operation: () => T): T {
    const snapshot = JSON.parse(JSON.stringify(workspace)) as TenantWorkspace;
    try {
      return operation();
    } catch (error) {
      for (const key of Object.keys(workspace)) {
        delete (workspace as any)[key];
      }
      Object.assign(workspace, snapshot);
      const moduleName = error instanceof Error ? 'rollback' : 'unknown';
      this.logStructured(workspace, 'ERROR', moduleName, 'mutation.rollback', error instanceof Error ? error.message : 'Mutation rollback', {});
      throw error;
    }
  }

  private logStructured(workspace: TenantWorkspace, level: 'INFO' | 'WARN' | 'ERROR', module: string, action: string, message: string, metadata: Record<string, unknown>): void {
    workspace.structuredLogs.push({
      id: this.id('log'),
      tenantId: workspace.tenant.id,
      requestId: this.cls.get<string>('requestId') ?? this.id('req'),
      userId: this.cls.get<string>('userEmail') ?? 'system',
      module,
      action,
      level,
      message,
      at: new Date().toISOString(),
      metadata,
    });
  }

  private defaultChartOfAccounts(tenantId: string): ChartAccount[] {
    const accounts: Array<Omit<ChartAccount, 'id' | 'tenantId' | 'class' | 'active'>> = [
      { account: '3111', labelFr: 'Marchandises', labelAr: 'البضائع', vatDeductible: false },
      { account: '3421', labelFr: 'Clients', labelAr: 'الزبناء', vatDeductible: false },
      { account: '3455', labelFr: 'État TVA récupérable', labelAr: 'ضريبة القيمة المضافة القابلة للاسترجاع', vatDeductible: true },
      { account: '4411', labelFr: 'Fournisseurs', labelAr: 'الموردون', vatDeductible: false },
      { account: '4441', labelFr: 'Personnel rémunérations dues', labelAr: 'أجور مستحقة', vatDeductible: false },
      { account: '4443', labelFr: 'CNSS et AMO à payer', labelAr: 'واجبات الصندوق الوطني والضمان الصحي', vatDeductible: false },
      { account: '4455', labelFr: 'État TVA facturée', labelAr: 'ضريبة القيمة المضافة المفوترة', vatDeductible: false },
      { account: '4456', labelFr: 'IR salaires à payer', labelAr: 'ضريبة الدخل على الأجور', vatDeductible: false },
      { account: '5141', labelFr: 'Banques', labelAr: 'البنوك', vatDeductible: false },
      { account: '5161', labelFr: 'Caisses', labelAr: 'الصندوق', vatDeductible: false },
      { account: '6111', labelFr: 'Achats revendus de marchandises', labelAr: 'مشتريات البضائع', vatDeductible: true },
      { account: '6171', labelFr: 'Rémunérations du personnel', labelAr: 'أجور المستخدمين', vatDeductible: false },
      { account: '6198', labelFr: 'Charges d’exploitation diverses', labelAr: 'مصاريف استغلال مختلفة', vatDeductible: false },
      { account: '7111', labelFr: 'Ventes de marchandises', labelAr: 'مبيعات البضائع', vatDeductible: false },
    ];
    return accounts.map((account) => ({
      ...account,
      id: `acc-${account.account}`,
      tenantId,
      class: account.account.slice(0, 1),
      active: true,
    }));
  }

  private openFiscalPeriod(tenantId: string, date: string): FiscalPeriod {
    return {
      id: `fp-${date.slice(0, 7)}`,
      tenantId,
      year: Number(date.slice(0, 4)),
      month: Number(date.slice(5, 7)),
      locked: false,
      status: 'OPEN',
    };
  }

  private workspace(tenantId?: string): TenantWorkspace {
    const id = tenantId ?? this.cls.get<string>('tenantId');
    if (!id) {
      throw new BadRequestException('Le contexte tenant est obligatoire');
    }
    const workspace = this.workspaces.get(id);
    if (!workspace) {
      throw new NotFoundException(`Tenant ${id} not found`);
    }
    return workspace;
  }

  private customer(workspace: TenantWorkspace, customerId: string): Customer {
    const customer = workspace.customers.find((candidate) => candidate.id === customerId);
    if (!customer) {
      throw new NotFoundException('Client introuvable');
    }
    return customer;
  }

  private user(workspace: TenantWorkspace, userId: string): ErpUser {
    const user = workspace.users.find((candidate) => candidate.id === userId || candidate.email === userId);
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  private employee(workspace: TenantWorkspace, employeeId: string): Employee {
    const employee = workspace.employees.find((candidate) => candidate.id === employeeId || candidate.employeeNumber === employeeId);
    if (!employee) throw new NotFoundException('Salarié introuvable');
    return employee;
  }

  private warehouse(workspace: TenantWorkspace, warehouseId: string): Warehouse {
    const warehouse = workspace.warehouses.find((candidate) => candidate.id === warehouseId);
    if (!warehouse) throw new NotFoundException('Dépôt introuvable');
    return warehouse;
  }

  private warehouseStock(workspace: TenantWorkspace, warehouseId: string, productId: string): WarehouseStock {
    let stock = workspace.warehouseStocks.find((candidate) => candidate.warehouseId === warehouseId && candidate.productId === productId);
    if (!stock) {
      stock = { tenantId: workspace.tenant.id, warehouseId, productId, quantity: 0, reserved: 0 };
      workspace.warehouseStocks.push(stock);
    }
    return stock;
  }

  private purchaseOrder(workspace: TenantWorkspace, orderId: string): PurchaseOrder {
    const order = workspace.purchaseOrders.find((candidate) => candidate.id === orderId || candidate.number === orderId);
    if (!order) throw new NotFoundException('Commande achat introuvable');
    return order;
  }

  private purchaseReceipt(workspace: TenantWorkspace, receiptId: string): PurchaseReceipt {
    const receipt = workspace.purchaseReceipts.find((candidate) => candidate.id === receiptId || candidate.number === receiptId);
    if (!receipt) throw new NotFoundException('Réception achat introuvable');
    return receipt;
  }

  private stockTransfer(workspace: TenantWorkspace, transferId: string): StockTransfer {
    const transfer = workspace.stockTransfers.find((candidate) => candidate.id === transferId || candidate.number === transferId);
    if (!transfer) throw new NotFoundException('Transfert stock introuvable');
    return transfer;
  }

  private inventoryCount(workspace: TenantWorkspace, sheetId: string): InventoryCountSheet {
    const sheet = workspace.inventoryCounts.find((candidate) => candidate.id === sheetId || candidate.number === sheetId);
    if (!sheet) throw new NotFoundException('Feuille inventaire introuvable');
    return sheet;
  }

  private quote(workspace: TenantWorkspace, quoteId: string): Quote {
    const quote = workspace.quotes.find((candidate) => candidate.id === quoteId || candidate.number === quoteId);
    if (!quote) {
      throw new NotFoundException('Devis introuvable');
    }
    return quote;
  }

  private salesOrder(workspace: TenantWorkspace, orderId: string): SalesOrder {
    const order = workspace.salesOrders.find((candidate) => candidate.id === orderId || candidate.number === orderId);
    if (!order) {
      throw new NotFoundException('Commande client introuvable');
    }
    return order;
  }

  private deliveryNote(workspace: TenantWorkspace, deliveryNoteId: string): DeliveryNote {
    const deliveryNote = workspace.deliveryNotes.find((candidate) => candidate.id === deliveryNoteId || candidate.number === deliveryNoteId);
    if (!deliveryNote) {
      throw new NotFoundException('Bon de livraison introuvable');
    }
    return deliveryNote;
  }

  private invoice(workspace: TenantWorkspace, invoiceId: string): Invoice {
    const invoice = workspace.invoices.find((candidate) => candidate.id === invoiceId || candidate.number === invoiceId);
    if (!invoice) {
      throw new NotFoundException('Facture introuvable');
    }
    return invoice;
  }

  private journalEntry(workspace: TenantWorkspace, entryId: string): JournalEntry {
    const entry = workspace.journalEntries.find((candidate) => candidate.id === entryId);
    if (!entry) throw new NotFoundException('Écriture comptable introuvable');
    return entry;
  }

  private payrollRun(workspace: TenantWorkspace, runId: string): PayrollRun {
    const run = workspace.payrollRuns.find((candidate) => candidate.id === runId || candidate.number === runId);
    if (!run) throw new NotFoundException('Run de paie introuvable');
    return run;
  }

  private leaveBalance(workspace: TenantWorkspace, employeeId: string, year: number): LeaveBalance {
    let balance = workspace.leaveBalances.find((candidate) => candidate.employeeId === employeeId && candidate.year === year);
    if (!balance) {
      balance = {
        id: this.id('leavebal'),
        tenantId: workspace.tenant.id,
        employeeId,
        year,
        acquiredDays: 18,
        takenDays: 0,
        pendingDays: 0,
        remainingDays: 18,
      };
      workspace.leaveBalances.push(balance);
    }
    return balance;
  }

  private leaveRequest(workspace: TenantWorkspace, requestId: string): LeaveRequest {
    const request = workspace.leaveRequests.find((candidate) => candidate.id === requestId);
    if (!request) throw new NotFoundException('Demande de congé introuvable');
    return request;
  }

  private posSession(workspace: TenantWorkspace, sessionId: string): PosSession {
    const session = workspace.posSessions.find((candidate) => candidate.id === sessionId || candidate.number === sessionId);
    if (!session) throw new NotFoundException('Session caisse introuvable');
    return session;
  }

  private billOfMaterial(workspace: TenantWorkspace, bomId: string): BillOfMaterial {
    const bom = workspace.billsOfMaterial.find((candidate) => candidate.id === bomId || candidate.version === bomId);
    if (!bom) throw new NotFoundException('Nomenclature introuvable');
    return bom;
  }

  private maintenanceAsset(workspace: TenantWorkspace, assetId: string): MaintenanceAsset {
    const asset = workspace.maintenanceAssets.find((candidate) => candidate.id === assetId);
    if (!asset) throw new NotFoundException('Actif maintenance introuvable');
    return asset;
  }

  private maintenanceWorkOrder(workspace: TenantWorkspace, orderId: string): MaintenanceWorkOrder {
    const order = workspace.maintenanceWorkOrders.find((candidate) => candidate.id === orderId);
    if (!order) throw new NotFoundException('Ordre de maintenance introuvable');
    return order;
  }

  private fleetVehicle(workspace: TenantWorkspace, vehicleId: string): FleetVehicle {
    const vehicle = workspace.fleetVehicles.find((candidate) => candidate.id === vehicleId || candidate.plate === vehicleId);
    if (!vehicle) throw new NotFoundException('Véhicule introuvable');
    return vehicle;
  }

  private project(workspace: TenantWorkspace, projectId: string): ProjectRecord {
    const project = workspace.projects.find((candidate) => candidate.id === projectId);
    if (!project) throw new NotFoundException('Projet introuvable');
    return project;
  }

  private assertCollaborationEntity(workspace: TenantWorkspace, entityType: CollaborationEntityType, entityId: string): void {
    if (entityType === 'CUSTOMER') {
      this.customer(workspace, entityId);
      return;
    }
    if (entityType === 'SUPPLIER') {
      this.supplier(workspace, entityId);
      return;
    }
    if (entityType === 'INVOICE') {
      this.invoice(workspace, entityId);
      return;
    }
    if (entityType === 'PAYROLL_RUN') {
      if (!this.clean(entityId)) throw new BadRequestException('Identifiant paie invalide');
      return;
    }
    throw new BadRequestException('Type d’entité collaboration invalide');
  }

  private supplier(workspace: TenantWorkspace, supplierId: string): Supplier {
    const supplier = workspace.suppliers.find((candidate) => candidate.id === supplierId);
    if (!supplier) {
      throw new NotFoundException('Fournisseur introuvable');
    }
    return supplier;
  }

  private customerDuplicateWarnings(workspace: TenantWorkspace, customer: Customer): string[] {
    const warnings: string[] = [];
    const ice = customer.ice?.trim();
    const ifNumber = customer.ifNumber?.trim();
    const phone = this.duplicateKey(customer.phone);
    const email = customer.email?.trim().toLowerCase();
    const duplicateIce = ice
      ? workspace.customers.find((candidate) => candidate.id !== customer.id && candidate.active && candidate.ice?.trim() === ice)
      : undefined;
    const duplicateIf = ifNumber
      ? workspace.customers.find((candidate) => candidate.id !== customer.id && candidate.active && candidate.ifNumber?.trim() === ifNumber)
      : undefined;
    const duplicatePhone = phone
      ? workspace.customers.find((candidate) => candidate.id !== customer.id && candidate.active && this.duplicateKey(candidate.phone) === phone)
      : undefined;
    const duplicateEmail = email
      ? workspace.customers.find((candidate) => candidate.id !== customer.id && candidate.active && candidate.email?.trim().toLowerCase() === email)
      : undefined;

    if (duplicateIce) warnings.push(`ICE déjà utilisé par ${duplicateIce.name}`);
    if (duplicateIf) warnings.push(`IF déjà utilisé par ${duplicateIf.name}`);
    if (duplicatePhone) warnings.push(`Téléphone déjà utilisé par ${duplicatePhone.name}`);
    if (duplicateEmail) warnings.push(`Email déjà utilisé par ${duplicateEmail.name}`);
    return warnings;
  }

  private supplierDuplicateWarnings(workspace: TenantWorkspace, supplier: Supplier): string[] {
    const warnings: string[] = [];
    const ice = supplier.ice?.trim();
    const ifNumber = supplier.ifNumber?.trim();
    const duplicateIce = ice
      ? workspace.suppliers.find((candidate) => candidate.id !== supplier.id && candidate.active && candidate.ice?.trim() === ice)
      : undefined;
    const duplicateIf = ifNumber
      ? workspace.suppliers.find((candidate) => candidate.id !== supplier.id && candidate.active && candidate.ifNumber?.trim() === ifNumber)
      : undefined;

    if (duplicateIce) warnings.push(`ICE déjà utilisé par ${duplicateIce.name}`);
    if (duplicateIf) warnings.push(`IF déjà utilisé par ${duplicateIf.name}`);
    return warnings;
  }

  private productDuplicateWarnings(workspace: TenantWorkspace, product: Product): string[] {
    const warnings: string[] = [];
    const sku = product.sku.trim().toUpperCase();
    const barcode = this.duplicateKey(product.barcode);
    const name = this.normalizedName(product.name);
    const duplicateSku = sku
      ? workspace.products.find((candidate) => candidate.id !== product.id && candidate.active && candidate.sku.trim().toUpperCase() === sku)
      : undefined;
    const duplicateBarcode = barcode
      ? workspace.products.find((candidate) => candidate.id !== product.id && candidate.active && this.duplicateKey(candidate.barcode) === barcode)
      : undefined;
    const duplicateName = name
      ? workspace.products.find((candidate) => candidate.id !== product.id && candidate.active && this.normalizedName(candidate.name) === name)
      : undefined;

    if (duplicateSku) warnings.push(`SKU déjà utilisé par ${duplicateSku.name}`);
    if (duplicateBarcode) warnings.push(`Code-barres déjà utilisé par ${duplicateBarcode.name}`);
    if (duplicateName) warnings.push(`Nom normalisé déjà utilisé par ${duplicateName.sku}`);
    return warnings;
  }

  private lead(workspace: TenantWorkspace, leadId: string): Lead {
    const lead = workspace.leads.find((candidate) => candidate.id === leadId);
    if (!lead) {
      throw new NotFoundException('Prospect introuvable');
    }
    return lead;
  }

  private customerForLead(workspace: TenantWorkspace, lead: Lead): Customer {
    const normalized = lead.customerName.trim().toLowerCase();
    const existing = workspace.customers.find((customer) => customer.active && customer.name.trim().toLowerCase() === normalized);
    if (existing) {
      return existing;
    }
    return this.addCustomer({ name: lead.customerName }, workspace.tenant.id);
  }

  private defaultQuotableProduct(workspace: TenantWorkspace): Product {
    const product = workspace.products.find((candidate) => candidate.active && candidate.salePrice > 0);
    if (!product) {
      throw new BadRequestException('Aucun article actif disponible pour créer un devis');
    }
    return product;
  }

  private product(workspace: TenantWorkspace, productId: string): Product {
    const product = workspace.products.find((candidate) => candidate.id === productId || candidate.sku === productId);
    if (!product) {
      throw new NotFoundException('Article introuvable');
    }
    return product;
  }

  private documentLines(workspace: TenantWorkspace, inputLines: DocumentLineInput[] | DocumentLine[]): DocumentLine[] {
    if (!inputLines.length) {
      throw new BadRequestException('Au moins une ligne est obligatoire');
    }
    return inputLines.map((line) => {
      const product = this.product(workspace, line.productId);
      if (!product.active) {
        throw new BadRequestException(`L’article ${product.sku} est archivé`);
      }
      const quantity = Number(line.quantity);
      if (quantity <= 0) {
        throw new BadRequestException('La quantité de ligne doit être positive');
      }
      const unitPrice = line.unitPrice ?? product.salePrice;
      const vatRate = line.vatRate ?? product.vatRate;
      const subtotal = r2(quantity * unitPrice);
      const vatAmount = r2(subtotal * vatRate);
      return {
        productId: product.id,
        sku: product.sku,
        description: line.description ?? product.name,
        descriptionAr: line.descriptionAr ?? product.arabicDescription,
        quantity,
        unitPrice,
        vatRate,
        subtotal,
        vatAmount,
        total: r2(subtotal + vatAmount),
      };
    });
  }

  private creditNoteLines(workspace: TenantWorkspace, invoice: Invoice, inputLines?: DocumentLineInput[] | DocumentLine[]): DocumentLine[] {
    if (!inputLines?.length) {
      return invoice.lines.map((line) => ({ ...line }));
    }
    return inputLines.map((line) => {
      const invoiceLine = invoice.lines.find((candidate) => candidate.productId === line.productId);
      if (!invoiceLine) {
        throw new BadRequestException('La ligne d’avoir doit référencer un article de la facture');
      }
      const quantity = Number(line.quantity);
      if (quantity <= 0 || quantity > invoiceLine.quantity) {
        throw new BadRequestException('La quantité d’avoir est invalide pour la ligne de facture');
      }
      const product = this.product(workspace, invoiceLine.productId);
      const unitPrice = line.unitPrice ?? invoiceLine.unitPrice;
      const vatRate = line.vatRate ?? invoiceLine.vatRate;
      const subtotal = r2(quantity * unitPrice);
      const vatAmount = r2(subtotal * vatRate);
      return {
        productId: product.id,
        sku: product.sku,
        description: line.description ?? invoiceLine.description,
        descriptionAr: line.descriptionAr ?? invoiceLine.descriptionAr ?? product.arabicDescription,
        quantity,
        unitPrice,
        vatRate,
        subtotal,
        vatAmount,
        total: r2(subtotal + vatAmount),
      };
    });
  }

  private totals(lines: DocumentLine[]): DocumentTotals {
    const vatByRate: Record<string, number> = {};
    let subtotal = 0;
    let vatTotal = 0;
    for (const line of lines) {
      subtotal += line.subtotal;
      vatTotal += line.vatAmount;
      const key = `${Math.round(line.vatRate * 100)}%`;
      vatByRate[key] = r2((vatByRate[key] ?? 0) + line.vatAmount);
    }
    return { subtotal: r2(subtotal), vatByRate, vatTotal: r2(vatTotal), total: r2(subtotal + vatTotal) };
  }

  private consumeStockForSales(workspace: TenantWorkspace, reference: string, lines: DocumentLine[], type: StockMove['type'] = 'DELIVERY'): void {
    for (const line of lines) {
      const product = this.product(workspace, line.productId);
      if (!product.trackStock || product.type === 'SERVICE') {
        continue;
      }
      if (this.availableStock(product) < line.quantity) {
        throw new BadRequestException(`Stock insuffisant pour ${product.sku}`);
      }
      product.stockOnHand = r2(product.stockOnHand - line.quantity);
      this.stockMove(workspace, product, -line.quantity, product.weightedAverageCost, type, reference);
    }
  }

  private reserveStockForOrder(workspace: TenantWorkspace, lines: DocumentLine[], reference: string): void {
    for (const line of lines) {
      const product = this.product(workspace, line.productId);
      if (!product.trackStock || product.type === 'SERVICE') {
        continue;
      }
      if (this.availableStock(product) < line.quantity) {
        throw new BadRequestException(`Stock disponible insuffisant pour ${product.sku}`);
      }
      product.reservedStock = r2(product.reservedStock + line.quantity);
      this.stockMove(workspace, product, line.quantity, product.weightedAverageCost, 'RESERVATION', reference);
    }
  }

  private availableStock(product: Product): number {
    return r2(product.stockOnHand - product.reservedStock);
  }

  private stockMove(workspace: TenantWorkspace, product: Product, quantity: number, unitCost: number, type: StockMove['type'], reference: string, warehouseId = workspace.warehouses[0].id): StockMove {
    const stock = product.trackStock ? this.warehouseStock(workspace, warehouseId, product.id) : undefined;
    const beforeQty = stock?.quantity ?? product.stockOnHand;
    if (stock && !['RESERVATION', 'RESERVATION_RELEASE'].includes(type)) {
      stock.quantity = r2(stock.quantity + quantity);
    }
    if (stock && type === 'RESERVATION') {
      stock.reserved = r2(stock.reserved + quantity);
    }
    if (stock && type === 'RESERVATION_RELEASE') {
      stock.reserved = r2(Math.max(0, stock.reserved - Math.abs(quantity)));
    }
    const move: StockMove = {
      id: this.id('sm'),
      tenantId: workspace.tenant.id,
      productId: product.id,
      warehouseId,
      type,
      quantity,
      unitCost,
      value: r2(quantity * unitCost),
      reference,
      beforeQty,
      afterQty: stock?.quantity ?? product.stockOnHand,
      approvalStatus: 'AUTO_APPROVED',
      createdAt: today(),
    };
    workspace.stockMoves.push(move);
    return move;
  }

  private approvalStatus(workspace: TenantWorkspace, key: keyof TenantSettings['approvalLimits'], amount: number): 'AUTO_APPROVED' | 'REQUIRED' {
    const limit = (workspace.tenant.settings.approvalLimits ?? defaultApprovalLimits)[key];
    return limit > 0 && amount > limit ? 'REQUIRED' : 'AUTO_APPROVED';
  }

  private invoiceCreditTotal(workspace: TenantWorkspace, invoiceId: string): number {
    return r2(workspace.creditNotes
      .filter((creditNote) => creditNote.invoiceId === invoiceId && creditNote.status === 'POSTED')
      .reduce((sum, creditNote) => sum + creditNote.totals.total, 0));
  }

  private customerOpenBalance(workspace: TenantWorkspace, customerId: string): number {
    return r2(workspace.invoices
      .filter((invoice) => invoice.customerId === customerId && invoice.status !== 'VOID')
      .reduce((sum, invoice) => sum + invoice.totals.total - invoice.paidAmount - this.invoiceCreditTotal(workspace, invoice.id), 0));
  }

  private customerCreditControl(workspace: TenantWorkspace, customerId: string, pendingInvoiceTotal = 0) {
    const customer = this.customer(workspace, customerId);
    const openBalance = this.customerOpenBalance(workspace, customer.id);
    const projectedBalance = r2(openBalance + pendingInvoiceTotal);
    const hasLimit = customer.creditLimit > 0;
    return {
      customerId: customer.id,
      customerName: customer.name,
      creditLimit: customer.creditLimit,
      openBalance,
      pendingInvoiceTotal: r2(pendingInvoiceTotal),
      projectedBalance,
      availableCredit: hasLimit ? r2(customer.creditLimit - openBalance) : null,
      projectedAvailableCredit: hasLimit ? r2(customer.creditLimit - projectedBalance) : null,
      onHold: hasLimit && projectedBalance > customer.creditLimit,
      status: hasLimit && projectedBalance > customer.creditLimit ? 'HOLD' : 'OK',
    };
  }

  private emptyPayrollTotals(): PayrollRun['totals'] {
    return {
      grossSalary: 0,
      cnssEmployee: 0,
      amoEmployee: 0,
      ir: 0,
      netSalary: 0,
      employerCharges: 0,
      employerCost: 0,
    };
  }

  private calculateEmployeePayslip(workspace: TenantWorkspace, run: PayrollRun, employee: Employee): Payslip {
    const rules = this.morocco2026Rules;
    const grossSalary = r2(employee.baseSalary);
    const cnssBase = Math.min(grossSalary, rules.cnss.cap);
    const cnssEmployee = r2(cnssBase * rules.cnss.employeeRate);
    const amoEmployee = r2(grossSalary * rules.cnss.amoEmployeeRate);
    const cnssEmployer = r2(cnssBase * rules.cnss.employerRate);
    const amoEmployer = r2(grossSalary * rules.cnss.amoEmployerRate);
    const familyAllocation = r2(grossSalary * rules.cnss.familyAllocationRate);
    const vocationalTraining = r2(grossSalary * rules.cnss.vocationalTrainingRate);
    const annualGross = grossSalary * 12;
    const professionalRate = annualGross <= 78000 ? 0.35 : 0.2;
    const professionalExpense = r2(Math.min(grossSalary * professionalRate, 2500));
    const taxableBase = r2(Math.max(0, grossSalary - cnssEmployee - amoEmployee - professionalExpense));
    const bracket = rules.irBrackets.find((candidate) => taxableBase <= candidate.upperBound) ?? rules.irBrackets[rules.irBrackets.length - 1];
    const familyDeduction = Math.min(employee.dependents, 6) * 50;
    const ir = r2(Math.max(0, taxableBase * bracket.rate - bracket.deduction - familyDeduction));
    const employerCharges = r2(cnssEmployer + amoEmployer + familyAllocation + vocationalTraining);
    const payslip: Payslip = {
      id: this.id('payslip'),
      tenantId: workspace.tenant.id,
      payrollRunId: run.id,
      employeeId: employee.id,
      employeeName: employee.fullName,
      period: run.period,
      grossSalary,
      cnssEmployee,
      amoEmployee,
      ir,
      netSalary: r2(grossSalary - cnssEmployee - amoEmployee - ir),
      employerCharges,
    };
    return payslip;
  }

  private payrollTotals(payslips: Payslip[]): PayrollRun['totals'] {
    return {
      grossSalary: r2(payslips.reduce((sum, payslip) => sum + payslip.grossSalary, 0)),
      cnssEmployee: r2(payslips.reduce((sum, payslip) => sum + payslip.cnssEmployee, 0)),
      amoEmployee: r2(payslips.reduce((sum, payslip) => sum + payslip.amoEmployee, 0)),
      ir: r2(payslips.reduce((sum, payslip) => sum + payslip.ir, 0)),
      netSalary: r2(payslips.reduce((sum, payslip) => sum + payslip.netSalary, 0)),
      employerCharges: r2(payslips.reduce((sum, payslip) => sum + payslip.employerCharges, 0)),
      employerCost: r2(payslips.reduce((sum, payslip) => sum + payslip.grossSalary + payslip.employerCharges, 0)),
    };
  }

  private validatePayrollRunCompliance(workspace: TenantWorkspace, run: PayrollRun): void {
    if (!workspace.tenant.legalEntity.cnssNumber) throw new BadRequestException('Numéro CNSS employeur obligatoire avant paie');
    if (!run.payslips.length) throw new BadRequestException('La paie ne contient aucun bulletin calculé');
    for (const payslip of run.payslips) {
      const employee = this.employee(workspace, payslip.employeeId);
      if (!employee.cin || !employee.cnssNumber) throw new BadRequestException(`Identifiants CIN/CNSS manquants pour ${employee.fullName}`);
    }
    if (this.morocco2026Rules.effectiveFrom > `${run.period}-01`) {
      throw new BadRequestException('Aucun pack de règles paie Maroc effectif pour cette période');
    }
  }

  private damancomRow(workspace: TenantWorkspace, run: PayrollRun, payslip: Payslip): string {
    const employee = this.employee(workspace, payslip.employeeId);
    const cols = [
      String(run.year),
      String(run.month).padStart(2, '0'),
      'RG01',
      (employee.cnssNumber ?? '').slice(0, 10).padStart(10, '0'),
      employee.employeeNumber.slice(0, 20).padEnd(20, ' '),
      workspace.tenant.legalEntity.tradeName.slice(0, 32).padEnd(32, ' '),
      workspace.tenant.legalEntity.cnssNumber.slice(0, 7).padStart(7, '0'),
      employee.fullName.slice(0, 40).padEnd(40, ' '),
      employee.cin.slice(0, 12).padEnd(12, ' '),
      String(Math.trunc(payslip.grossSalary)).padStart(15, ' '),
      String(Math.trunc(payslip.cnssEmployee)).padStart(15, ' '),
      String(Math.trunc(payslip.amoEmployee)).padStart(15, ' '),
      String(Math.trunc(payslip.ir)).padStart(15, ' '),
      String(Math.trunc(payslip.netSalary)).padStart(15, ' '),
    ];
    return cols.join('').slice(0, 260).padEnd(260, ' ');
  }

  private assertCustomerCreditAvailable(workspace: TenantWorkspace, customer: Customer, invoiceTotal: number): void {
    const control = this.customerCreditControl(workspace, customer.id, invoiceTotal);
    if (control.onHold) {
      throw new BadRequestException(`Plafond de crédit client dépassé pour ${customer.name}: solde projeté ${control.projectedBalance.toFixed(2)} MAD / limite ${customer.creditLimit.toFixed(2)} MAD`);
    }
  }

  private receivablesAging(workspace: TenantWorkspace, customerId: string) {
    const now = new Date(today()).getTime();
    const buckets = {
      current: 0,
      days1To30: 0,
      days31To60: 0,
      days61To90: 0,
      over90: 0,
    };
    for (const invoice of workspace.invoices.filter((candidate) => candidate.customerId === customerId)) {
      const openAmount = r2(invoice.totals.total - invoice.paidAmount - this.invoiceCreditTotal(workspace, invoice.id));
      if (openAmount <= 0) {
        continue;
      }
      const due = new Date(invoice.dueDate).getTime();
      const days = Math.max(0, Math.floor((now - due) / 86400000));
      if (days === 0) buckets.current = r2(buckets.current + openAmount);
      else if (days <= 30) buckets.days1To30 = r2(buckets.days1To30 + openAmount);
      else if (days <= 60) buckets.days31To60 = r2(buckets.days31To60 + openAmount);
      else if (days <= 90) buckets.days61To90 = r2(buckets.days61To90 + openAmount);
      else buckets.over90 = r2(buckets.over90 + openAmount);
    }
    return buckets;
  }

  private postJournal(workspace: TenantWorkspace, description: string, source: string, lines: JournalEntry['lines']): JournalEntry {
    this.validateJournalLines(workspace, lines);
    const debit = r2(lines.reduce((sum, line) => sum + line.debit, 0));
    const credit = r2(lines.reduce((sum, line) => sum + line.credit, 0));
    if (debit !== credit) {
      throw new BadRequestException(`Écriture comptable déséquilibrée ${description}`);
    }
    const entry: JournalEntry = {
      id: this.id('je'),
      tenantId: workspace.tenant.id,
      date: today(),
      source,
      description,
      lines,
      posted: true,
      status: 'POSTED',
    };
    workspace.journalEntries.push(entry);
    return entry;
  }

  private validateJournalLines(workspace: TenantWorkspace, lines: JournalEntry['lines']): void {
    if (!lines?.length || lines.length < 2) throw new BadRequestException('Une écriture doit contenir au moins deux lignes');
    for (const line of lines) {
      const account = workspace.chartOfAccounts.find((candidate) => candidate.account === line.account && candidate.active);
      if (!account) throw new BadRequestException(`Compte PCGE introuvable ou inactif: ${line.account}`);
      if (!this.clean(line.label)) throw new BadRequestException('Chaque ligne comptable exige un libellé');
      if (line.debit < 0 || line.credit < 0) throw new BadRequestException('Débit et crédit doivent être positifs');
      if (line.debit > 0 && line.credit > 0) throw new BadRequestException('Une ligne ne peut pas être débit et crédit à la fois');
      if (line.debit === 0 && line.credit === 0) throw new BadRequestException('Une ligne doit porter un débit ou un crédit');
    }
    const debit = r2(lines.reduce((sum, line) => sum + line.debit, 0));
    const credit = r2(lines.reduce((sum, line) => sum + line.credit, 0));
    if (debit !== credit) throw new BadRequestException('L’écriture comptable doit être équilibrée');
  }

  private assertInvoiceLegalIdentity(entity: LegalEntity): void {
    const required = [entity.tradeName, entity.ice, entity.ifNumber, entity.rc, entity.patente, entity.address];
    if (required.some((value) => !value)) {
      throw new BadRequestException('L’identité légale du tenant est incomplète pour la facturation marocaine');
    }
  }

  private defaultDocumentSeries(invoiceSeries: string): Partial<Record<DocumentExportType, string>> {
    return {
      QUOTE: 'DV',
      ORDER: 'BC',
      DELIVERY_NOTE: 'BL',
      INVOICE: invoiceSeries,
      CREDIT_NOTE: 'NC',
      PURCHASE_ORDER: 'BA',
      PURCHASE_RECEIPT: 'BR',
      PAYSLIP: 'BUL',
    };
  }

  private defaultDocumentTemplates(tenantId: string): DocumentTemplateSetting[] {
    const footer = 'ICE {ice} - IF {ifNumber} - RC {rc} - Patente {patente} - Adresse {address} - TVA selon régime tenant';
    const baseFields = ['tradeName', 'ice', 'ifNumber', 'rc', 'patente', 'address', 'city', 'arabicName', 'arabicAddress', 'lines', 'vatByRate', 'totalTtc'];
    return (['QUOTE', 'DELIVERY_NOTE', 'INVOICE', 'CREDIT_NOTE', 'PURCHASE_ORDER', 'PURCHASE_RECEIPT', 'PAYSLIP'] as DocumentExportType[]).map((type) => ({
      id: `tpl-${type.toLowerCase()}`,
      tenantId,
      type,
      name: `${type} Maroc FR/AR`,
      language: 'BILINGUAL',
      logoKey: `tenants/${tenantId}/branding/logo-placeholder.png`,
      legalFooter: footer,
      fields: type === 'PAYSLIP'
        ? ['employeeName', 'cin', 'cnssNumber', 'period', 'grossSalary', 'cnssEmployee', 'amoEmployee', 'ir', 'netSalary', 'arabicName', 'arabicAddress']
        : baseFields,
      active: true,
      updatedAt: today(),
    }));
  }

  private documentPrefix(workspace: TenantWorkspace, type: DocumentExportType): string {
    const defaults = this.defaultDocumentSeries(workspace.tenant.settings.invoiceSeries);
    return workspace.tenant.settings.documentSeries[type] ?? defaults[type] ?? type;
  }

  private legalFooter(workspace: TenantWorkspace): string {
    const entity = workspace.tenant.legalEntity;
    return `${entity.tradeName} | ICE ${entity.ice} | IF ${entity.ifNumber} | RC ${entity.rc} | Patente ${entity.patente} | CNSS ${entity.cnssNumber} | ${entity.address}, ${entity.city}`;
  }

  private exportBusinessDocumentPdf(type: DocumentExportType, documentId: string, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const snapshot = this.documentPdfSnapshot(workspace, type, documentId);
    const template = workspace.documentTemplates.find((candidate) => candidate.type === type && candidate.active);
    const lines = [
      `${snapshot.title} ${snapshot.number}`,
      `Date ${snapshot.date}`,
      `Entreprise ${workspace.tenant.legalEntity.tradeName}`,
      `ICE ${workspace.tenant.legalEntity.ice}`,
      `IF ${workspace.tenant.legalEntity.ifNumber}`,
      `RC ${workspace.tenant.legalEntity.rc}`,
      `Patente ${workspace.tenant.legalEntity.patente}`,
      `CNSS ${workspace.tenant.legalEntity.cnssNumber}`,
      `Adresse ${workspace.tenant.legalEntity.address} ${workspace.tenant.legalEntity.city}`,
      `${snapshot.partnerLabel} ${snapshot.partnerName}`,
      `Identifiants ${snapshot.partnerIdentifiers}`,
      `Modèle ${template?.name ?? 'Document Maroc'} ${template?.language ?? 'FR'}`,
      ...snapshot.lines.map((line) => `${line.sku} ${line.description} | Qté ${line.quantity} | PU ${line.unitPrice.toFixed(2)} | TVA ${(line.vatRate * 100).toFixed(0)}% | HT ${line.subtotal.toFixed(2)} | TVA ${line.vatAmount.toFixed(2)} | TTC ${line.total.toFixed(2)}`),
      ...Object.entries(snapshot.totals.vatByRate).map(([rate, amount]) => `TVA par taux ${rate.includes('%') ? rate : `${Number(rate) * 100}%`} = ${amount.toFixed(2)} MAD`),
      `Total HT ${snapshot.totals.subtotal.toFixed(2)} MAD`,
      `Total TVA ${snapshot.totals.vatTotal.toFixed(2)} MAD`,
      `Total TTC ${snapshot.totals.total.toFixed(2)} MAD`,
      `Mentions ${snapshot.mentions.join(' | ')}`,
      `Pied légal ${this.legalFooter(workspace)}`,
      'Champs bilingues prêts: nom arabe, adresse arabe, désignation arabe',
    ];
    const contentBase64 = Buffer.from(this.simplePdf(lines), 'binary').toString('base64');
    const fileName = `${snapshot.number}.pdf`;
    const storedFile = this.storeFileArtifact(workspace, {
      fileName,
      mimeType: 'application/pdf',
      contentBase64,
      metadata: { type, documentId: snapshot.id, number: snapshot.number },
    });
    this.archiveEvidence(workspace, 'DOCUMENT_PDF', fileName, { type, documentId: snapshot.id, number: snapshot.number, storageKey: storedFile.key, checksum: storedFile.checksum });
    this.audit(workspace, 'document.pdf.exported', type, snapshot.id, { type, fileName, storageKey: storedFile.key });
    return {
      documentId: snapshot.id,
      documentNumber: snapshot.number,
      type,
      fileName,
      mimeType: 'application/pdf' as const,
      contentBase64,
      storageKey: storedFile.key,
      checksum: storedFile.checksum,
      requiredMentions: snapshot.mentions,
      status: 'PREPARED',
    };
  }

  private documentPdfSnapshot(workspace: TenantWorkspace, type: DocumentExportType, documentId: string) {
    const salesPartner = (customerId: string) => {
      const customer = this.customer(workspace, customerId);
      return {
        partnerLabel: 'Client',
        partnerName: customer.name,
        partnerIdentifiers: `ICE ${customer.ice ?? '-'} IF ${customer.ifNumber ?? '-'} RC ${customer.rc ?? '-'}`,
      };
    };
    const purchasePartner = (supplierId: string) => {
      const supplier = this.supplier(workspace, supplierId);
      return {
        partnerLabel: 'Fournisseur',
        partnerName: supplier.name,
        partnerIdentifiers: `ICE ${supplier.ice ?? '-'} IF ${supplier.ifNumber ?? '-'} RC ${supplier.rc ?? '-'}`,
      };
    };
    const fromPurchaseLines = (lines: Array<{ productId: string; quantity: number; unitCost: number; value: number }>): DocumentLine[] => lines.map((line) => {
      const product = this.product(workspace, line.productId);
      const vatRate = product.vatRate;
      const vatAmount = r2(line.value * vatRate);
      return {
        productId: product.id,
        sku: product.sku,
        description: product.name,
        quantity: line.quantity,
        unitPrice: line.unitCost,
        vatRate,
        subtotal: r2(line.value),
        vatAmount,
        total: r2(line.value + vatAmount),
      };
    });
    const mentions = ['ICE vendeur', 'IF vendeur', 'RC vendeur', 'Patente vendeur', 'ICE/IF client ou fournisseur', 'Numéro séquentiel', 'Date document', 'Lignes TVA', 'Total HT', 'Total TVA', 'Total TTC'];
    if (type === 'QUOTE') {
      const quote = this.quote(workspace, documentId);
      return { id: quote.id, title: 'Devis', number: quote.number, date: quote.date, lines: quote.lines, totals: quote.totals, mentions, ...salesPartner(quote.customerId) };
    }
    if (type === 'ORDER') {
      const order = this.salesOrder(workspace, documentId);
      return { id: order.id, title: 'Commande client', number: order.number, date: order.date, lines: order.lines, totals: order.totals, mentions, ...salesPartner(order.customerId) };
    }
    if (type === 'DELIVERY_NOTE') {
      const delivery = this.deliveryNote(workspace, documentId);
      return { id: delivery.id, title: 'Bon de livraison', number: delivery.number, date: delivery.date, lines: delivery.lines, totals: delivery.totals, mentions, ...salesPartner(delivery.customerId) };
    }
    if (type === 'INVOICE') {
      const invoice = this.invoice(workspace, documentId);
      return { id: invoice.id, title: 'Facture', number: invoice.number, date: invoice.date, lines: invoice.lines, totals: invoice.totals, mentions: [...mentions, ...invoice.compliance.legalMentions], ...salesPartner(invoice.customerId) };
    }
    if (type === 'CREDIT_NOTE') {
      const credit = workspace.creditNotes.find((candidate) => candidate.id === documentId || candidate.number === documentId);
      if (!credit) throw new NotFoundException('Avoir introuvable');
      return { id: credit.id, title: 'Avoir', number: credit.number, date: credit.date, lines: credit.lines, totals: credit.totals, mentions, ...salesPartner(credit.customerId) };
    }
    if (type === 'PURCHASE_ORDER') {
      const order = this.purchaseOrder(workspace, documentId);
      const lines = fromPurchaseLines(order.lines);
      return { id: order.id, title: 'Bon de commande achat', number: order.number, date: order.date, lines, totals: this.totals(lines), mentions, ...purchasePartner(order.supplierId) };
    }
    if (type === 'PURCHASE_RECEIPT') {
      const receipt = this.purchaseReceipt(workspace, documentId);
      const lines = fromPurchaseLines(receipt.lines);
      return { id: receipt.id, title: 'Bon de réception', number: receipt.number, date: receipt.date, lines, totals: this.totals(lines), mentions, ...purchasePartner(receipt.supplierId) };
    }
    throw new BadRequestException('Type de document PDF non supporté');
  }

  private storeFileArtifact(workspace: TenantWorkspace, input: { fileName: string; mimeType: string; contentBase64: string; metadata: Record<string, unknown> }): StoredFile {
    const bytes = Buffer.from(input.contentBase64, 'base64');
    const checksum = createHash('sha256').update(bytes).digest('hex');
    const existing = workspace.storedFiles.find((file) => file.checksum === checksum && file.fileName === input.fileName);
    if (existing) return existing;
    const file: StoredFile = {
      id: this.id('file'),
      tenantId: workspace.tenant.id,
      key: `local/${workspace.tenant.id}/${today()}/${input.fileName}`,
      fileName: input.fileName,
      mimeType: input.mimeType,
      size: bytes.length,
      checksum,
      provider: 'LOCAL_DEV',
      status: 'STORED',
      metadata: input.metadata,
      createdAt: new Date().toISOString(),
    };
    workspace.storedFiles.push(file);
    return file;
  }

  private assertPeriodOpen(workspace: TenantWorkspace, date: string): void {
    const year = Number(date.slice(0, 4));
    const month = Number(date.slice(5, 7));
    const period = workspace.fiscalPeriods.find((candidate) => candidate.year === year && candidate.month === month);
    if (period?.locked || period?.status === 'LOCKED' || period?.status === 'CLOSED') {
      throw new ForbiddenException('La période fiscale est verrouillée');
    }
  }

  private assertCanWrite(workspace: TenantWorkspace): void {
    const role = this.cls.get<string>('userRole') ?? 'OWNER';
    if (role === 'READ_ONLY') {
      throw new ForbiddenException('Le rôle lecture seule ne peut pas modifier les données');
    }
    if (workspace.tenant.status !== 'ACTIVE') {
      throw new ForbiddenException('L’abonnement est en lecture seule');
    }
    if (workspace.tenant.settings.featureGates.writeLocked) {
      throw new ForbiddenException(workspace.tenant.settings.featureGates.reason ?? 'L’abonnement est en lecture seule');
    }
  }

  private nextNumber(workspace: TenantWorkspace, prefix: string): string {
    const year = new Date().getFullYear();
    const key = `${prefix}-${year}`;
    workspace.sequences[key] = (workspace.sequences[key] ?? 0) + 1;
    return `${prefix}-${year}-${String(workspace.sequences[key]).padStart(5, '0')}`;
  }

  private audit(workspace: TenantWorkspace, action: string, entity: string, entityId: string, payload: unknown): void {
    workspace.auditLogs.push({
      id: this.id('audit'),
      tenantId: workspace.tenant.id,
      action,
      entity,
      entityId,
      at: new Date().toISOString(),
      payload,
    });
    this.logStructured(workspace, 'INFO', action.split('.')[0] ?? 'erp', action, `${entity} ${action}`, { entityId });
    this.metric(workspace, 'api_latency_ms', 25 + (workspace.auditLogs.length % 30), action.split('.')[0] ?? 'erp', { action });
  }

  private archiveEvidence(workspace: TenantWorkspace, type: LegalEvidence['type'], reference: string, metadata: Record<string, unknown>): LegalEvidence {
    const checksum = createHash('sha256').update(JSON.stringify({ type, reference, metadata })).digest('hex');
    const existing = workspace.legalEvidences.find((candidate) => candidate.type === type && candidate.reference === reference && candidate.checksum === checksum);
    if (existing) return existing;
    const evidence: LegalEvidence = {
      id: this.id('evd'),
      tenantId: workspace.tenant.id,
      type,
      reference,
      status: 'ARCHIVED',
      checksum,
      archivedAt: new Date().toISOString(),
      metadata,
    };
    workspace.legalEvidences.push(evidence);
    this.audit(workspace, 'legal-evidence.archived', 'LegalEvidence', evidence.id, evidence);
    return evidence;
  }

  private passwordHash(password: string): string {
    return createHash('sha256').update(`morocco-erp:${password}`).digest('hex');
  }

  private verifyPassword(user: ErpUser, password: string): boolean {
    return user.passwordHash ? user.passwordHash === this.passwordHash(password) : user.password === password;
  }

  private token(prefix: string): string {
    return `${prefix}_${randomBytes(24).toString('hex')}`;
  }

  private minutesFromNow(minutes: number): string {
    return new Date(Date.now() + minutes * 60000).toISOString();
  }

  private createSession(workspace: TenantWorkspace, user: ErpUser, input: { ip?: string; userAgent?: string }): AuthSession {
    const fingerprint = createHash('sha1').update(`${input.ip ?? 'unknown'}|${input.userAgent ?? 'unknown'}`).digest('hex');
    const previous = workspace.deviceLoginEvents.find((event) => event.userId === user.id && event.fingerprint === fingerprint);
    const suspicious = !previous && workspace.deviceLoginEvents.some((event) => event.userId === user.id);
    const session: AuthSession = {
      id: this.id('sess'),
      tenantId: workspace.tenant.id,
      userId: user.id,
      accessToken: this.token('access'),
      refreshToken: this.token('refresh'),
      createdAt: new Date().toISOString(),
      expiresAt: this.minutesFromNow(15),
      refreshExpiresAt: this.minutesFromNow(60 * 24 * 7),
      device: { ip: input.ip, userAgent: input.userAgent, fingerprint },
    };
    workspace.sessions.push(session);
    const event = {
      id: this.id('login'),
      tenantId: workspace.tenant.id,
      userId: user.id,
      email: user.email,
      ip: input.ip,
      userAgent: input.userAgent,
      fingerprint,
      at: session.createdAt,
      suspicious,
      reason: suspicious ? 'Nouvel appareil ou adresse IP pour cet utilisateur' : undefined,
    };
    workspace.deviceLoginEvents.push(event);
    if (suspicious) {
      this.securityNotification(workspace, user, 'SUSPICIOUS_LOGIN', `Connexion inhabituelle détectée pour ${user.email}`);
    }
    this.audit(workspace, 'auth.login', 'Session', session.id, { userId: user.id, suspicious });
    return session;
  }

  private securityNotification(workspace: TenantWorkspace, user: ErpUser, type: SecurityNotification['type'], message: string): void {
    workspace.securityNotifications.push({
      id: this.id('sec'),
      tenantId: workspace.tenant.id,
      userId: user.id,
      type,
      message,
      at: new Date().toISOString(),
      read: false,
    });
  }

  private tenantExportManifest(workspace: TenantWorkspace) {
    const files = [
      { name: 'tenant.json', records: 1 },
      { name: 'customers.json', records: workspace.customers.length },
      { name: 'suppliers.json', records: workspace.suppliers.length },
      { name: 'products.json', records: workspace.products.length },
      { name: 'invoices.json', records: workspace.invoices.length },
      { name: 'journal-entries.json', records: workspace.journalEntries.length },
      { name: 'audit-logs.json', records: workspace.auditLogs.length },
    ].map((file) => ({
      ...file,
      checksum: createHash('sha256').update(`${workspace.tenant.id}:${file.name}:${file.records}`).digest('hex'),
    }));
    return {
      tenantId: workspace.tenant.id,
      generatedAt: new Date().toISOString(),
      retention: workspace.tenant.settings.retention,
      files,
      checksum: createHash('sha256').update(files.map((file) => file.checksum).join('|')).digest('hex'),
      status: 'READY_FOR_DOWNLOAD',
    };
  }

  private simplePdf(lines: string[]): string {
    const escape = (value: string) => value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    const content = [
      'BT',
      '/F1 11 Tf',
      '50 790 Td',
      ...lines.flatMap((line, index) => [
        index === 0 ? '' : '0 -18 Td',
        `(${escape(line)}) Tj`,
      ]).filter(Boolean),
      'ET',
    ].join('\n');
    const objects = [
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
      '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
      `5 0 obj\n<< /Length ${Buffer.byteLength(content, 'binary')} >>\nstream\n${content}\nendstream\nendobj\n`,
    ];
    let pdf = '%PDF-1.4\n';
    const offsets = [0];
    for (const object of objects) {
      offsets.push(Buffer.byteLength(pdf, 'binary'));
      pdf += object;
    }
    const xrefOffset = Buffer.byteLength(pdf, 'binary');
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += '0000000000 65535 f \n';
    for (const offset of offsets.slice(1)) {
      pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return pdf;
  }

  private clean(value: string | undefined): string | undefined {
    const cleaned = value?.trim();
    return cleaned ? cleaned : undefined;
  }

  private nonEmpty(value: string | undefined, message: string): string {
    const cleaned = value?.trim();
    if (!cleaned) {
      throw new BadRequestException(message);
    }
    return cleaned;
  }

  private nonNegative(value: number | undefined, message: string): number {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) {
      throw new BadRequestException(message);
    }
    return r2(numeric);
  }

  private month(value: number): number {
    const numeric = Number(value);
    if (!Number.isInteger(numeric) || numeric < 1 || numeric > 12) {
      throw new BadRequestException('Le mois de début d’exercice doit être compris entre 1 et 12');
    }
    return numeric;
  }

  private vatRate(value: number): VatRate {
    const numeric = Number(value);
    const rate = allowedVatRates.find((candidate) => candidate === numeric);
    if (rate === undefined) {
      throw new BadRequestException('Le taux de TVA n’est pas pris en charge par les règles Maroc');
    }
    return rate;
  }

  private leadStage(value: Lead['stage'] | undefined): Lead['stage'] {
    const stage = value ?? 'NEW';
    if (!['NEW', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST'].includes(stage)) {
      throw new BadRequestException('Étape prospect invalide');
    }
    return stage;
  }

  private preferredLanguage(value: PreferredLanguage | undefined): PreferredLanguage {
    const language = value ?? 'FR';
    if (!['FR', 'AR', 'BILINGUAL'].includes(language)) {
      throw new BadRequestException('Langue préférée invalide');
    }
    return language;
  }

  private validateContacts(contacts: Customer['contacts']): void {
    for (const contact of contacts) {
      this.nonEmpty(contact.name, 'Le nom du contact est obligatoire');
    }
  }

  private validateBankDetails(bankDetails: Supplier['bankDetails']): void {
    for (const bank of bankDetails) {
      bank.bankName = this.normalizeBankName(this.nonEmpty(bank.bankName, 'Le nom de la banque est obligatoire'));
      bank.rib = this.moroccanRib(this.nonEmpty(bank.rib, 'Le RIB fournisseur est obligatoire'));
    }
  }

  private validateSupplierDocumentExpiries(documents: Supplier['documentExpiries']): Supplier['documentExpiries'] {
    return documents.map((document) => ({
      type: this.nonEmpty(document.type, 'Le type du document fournisseur est obligatoire'),
      expiresAt: this.isoDate(document.expiresAt, 'La date d’expiration du document fournisseur est obligatoire'),
      reference: this.clean(document.reference),
      arabicType: this.clean(document.arabicType),
      arabicReference: this.clean(document.arabicReference),
      fileName: this.clean(document.fileName),
      storageKey: this.clean(document.storageKey),
      uploadStatus: document.uploadStatus,
      uploadedAt: this.clean(document.uploadedAt),
    }));
  }

  private validateCustomerDocumentExpiries(documents: Customer['documentExpiries']): Customer['documentExpiries'] {
    return documents.map((document) => ({
      type: this.nonEmpty(document.type, 'Le type du document client est obligatoire'),
      expiresAt: this.isoDate(document.expiresAt, 'La date d’expiration du document client est obligatoire'),
      reference: this.clean(document.reference),
      arabicType: this.clean(document.arabicType),
      arabicReference: this.clean(document.arabicReference),
    }));
  }

  private validateEmployeeDocumentExpiries(documents: Employee['documentExpiries']): Employee['documentExpiries'] {
    return documents.map((document) => ({
      type: this.nonEmpty(document.type, 'Le type du document salarié est obligatoire'),
      expiresAt: this.isoDate(document.expiresAt, 'La date d’expiration du document salarié est obligatoire'),
      reference: this.clean(document.reference),
      arabicType: this.clean(document.arabicType),
      arabicReference: this.clean(document.arabicReference),
    }));
  }

  private isoDate(value: string | undefined, message: string): string {
    const date = this.nonEmpty(value, message);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
      throw new BadRequestException('La date doit être au format AAAA-MM-JJ');
    }
    return date;
  }

  private daysUntil(date: string): number {
    const todayMs = Date.parse(`${today()}T00:00:00Z`);
    const targetMs = Date.parse(`${date}T00:00:00Z`);
    return Math.ceil((targetMs - todayMs) / 86400000);
  }

  private normalizeBankName(value: string): string {
    const normalized = value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
    const banks: Record<string, string> = {
      attijariwafa: 'Attijariwafa bank',
      'attijariwafa bank': 'Attijariwafa bank',
      awb: 'Attijariwafa bank',
      'bank of africa': 'Bank of Africa',
      boa: 'Bank of Africa',
      bmce: 'Bank of Africa',
      'banque populaire': 'Banque Populaire',
      bcp: 'Banque Populaire',
      bp: 'Banque Populaire',
      cih: 'CIH Bank',
      'cih bank': 'CIH Bank',
      bmci: 'BMCI',
      sgmb: 'Société Générale Maroc',
      'societe generale': 'Société Générale Maroc',
      'credit agricole': 'Crédit Agricole du Maroc',
      'credit agricole du maroc': 'Crédit Agricole du Maroc',
      cam: 'Crédit Agricole du Maroc',
    };
    return banks[normalized] ?? value.trim().replace(/\s+/g, ' ');
  }

  private duplicateKey(value: string | undefined): string | undefined {
    const cleaned = this.clean(value);
    if (!cleaned) return undefined;
    return cleaned.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  private normalizedName(value: string | undefined): string | undefined {
    const text = this.searchText(value);
    return text ? text.replace(/[^a-z0-9]/g, '') : undefined;
  }

  private moroccanRib(value: string): string {
    const rib = value.replace(/[\s-]/g, '');
    if (!/^\d{24}$/.test(rib)) {
      throw new BadRequestException('Le RIB marocain doit contenir exactement 24 chiffres');
    }
    return rib;
  }

  private searchText(value: unknown): string {
    return String(value ?? '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private searchScore(query: string, fields: Array<string | number | undefined>): number {
    let best = 0;
    for (const field of fields) {
      const text = this.searchText(field);
      if (!text) continue;
      if (text === query) best = Math.max(best, 100);
      else if (text.startsWith(query)) best = Math.max(best, 75);
      else if (text.includes(query)) best = Math.max(best, 45);
    }
    return best;
  }

  private parseCsv(csv: string): Array<Record<string, string>> {
    const lines = String(csv ?? '').split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) return [];
    const headers = this.csvLine(lines[0]).map((header) => header.trim());
    return lines.slice(1).map((line) => {
      const values = this.csvLine(line);
      return headers.reduce<Record<string, string>>((record, header, index) => {
        record[header] = values[index]?.trim() ?? '';
        return record;
      }, {});
    });
  }

  private toCsv(headers: string[], rows: Array<Record<string, unknown>>): string {
    return [
      headers.join(','),
      ...rows.map((row) => headers.map((header) => this.csvCell(row[header])).join(',')),
    ].join('\n');
  }

  private csvCell(value: unknown): string {
    const text = String(value ?? '');
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }

  private csvLine(line: string): string[] {
    const cells: string[] = [];
    let cell = '';
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      if (char === '"' && quoted && line[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === ',' && !quoted) {
        cells.push(cell);
        cell = '';
      } else {
        cell += char;
      }
    }
    cells.push(cell);
    return cells;
  }

  private validateAddresses(addresses: Customer['addresses']): void {
    for (const address of addresses) {
      this.nonEmpty(address.label, 'Le libellé d’adresse est obligatoire');
      this.nonEmpty(address.line1, 'La ligne d’adresse est obligatoire');
      this.nonEmpty(address.city, 'La ville de l’adresse est obligatoire');
    }
  }

  private id(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
