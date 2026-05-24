const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID ?? 'tenant-demo';

export const documentExportRoutes = [
  '/sales/invoices/${invoice.id}/pdf',
  '/sales/delivery-notes/${delivery.id}/pdf',
  '/sales/credit-notes/${creditNote.id}/pdf',
  '/inventory/purchase-orders/${purchaseOrder.id}/pdf',
  '/inventory/purchase-receipts/${purchaseReceipt.id}/pdf',
  '/payroll/runs/${run.id}/payslips/${payslip.id}/pdf',
];

export const workflowReadinessRoutes = [
  '/sales/invoices/${invoice.id}/email-preview',
  '/sales/quotes/${quote.id}/approval-email-preview',
  '/sales/quotes/${quote.id}/accept',
  '/sales/customers/${customer.id}/statement.pdf',
  '/inventory/suppliers/${supplier.id}/statement',
  '/inventory/purchase-requests',
  '/inventory/purchase-requests/${request.id}/supplier-quotes',
  '/ledger/payments/reconciliation-by-method',
  '/ledger/cheques',
  '/ledger/deposit-batches',
  '/pos/cashbox-transfers',
  '/payroll/runs/${run.id}/damancom/preflight',
  '/payroll/exports/archive',
  '/payroll/leave-calendar',
];

export type DashboardSummary = {
  tenant: {
    legalEntity: {
      tradeName: string;
      ice: string;
      ifNumber: string;
      rc: string;
      patente: string;
      city: string;
    };
    plan: string;
    status: string;
  };
  metrics: {
    customers: number;
    suppliers: number;
    products: number;
    invoices: number;
    revenue: number;
    receivables: number;
    stockValue: number;
  };
  compliance: {
    id: string;
    vatRates: number[];
    invoiceMentions: string[];
  };
};

export type Invoice = {
  id: string;
  number: string;
  status: string;
  customerId: string;
  totals: { subtotal: number; vatTotal: number; total: number };
  paidAmount: number;
};

export type StockLine = {
  productId: string;
  sku: string;
  name: string;
  stockOnHand: number;
  weightedAverageCost: number;
  stockValue: number;
};

export type AccountingSnapshot = {
  accounts: Array<{ account: string; labelFr: string }>;
  journalEntries: Array<{ id: string; source: string; description: string; status: string; lines: Array<{ account: string }> }>;
  vatReport: { netVatPayable: number; byRate: Array<{ rate: string; net: number }> };
  reconciliation: { totals: { bankCash: number; receivables: number; payables: number } };
};

export type PayrollSnapshot = {
  employees: Array<{ id: string; fullName: string; baseSalary: number; active: boolean }>;
  contracts: Array<{ id: string; employeeId: string; salary: number; active: boolean }>;
  runs: Array<{ id: string; number: string; status: string; payslips: unknown[]; totals: { grossSalary: number; netSalary: number; employerCost: number } }>;
};

export type SalesDashboard = {
  period: string;
  invoiceCount: number;
  creditNoteCount: number;
  totals: { revenue: number; unpaid: number; vat: number };
  byCustomer: Array<{ customerId: string; customerName: string; revenue: number; unpaid: number; invoices: number }>;
  byProduct: Array<{ productId: string; sku: string; name: string; quantity: number; revenue: number }>;
  byVatRate: Array<{ rate: string; taxable: number; vat: number; total: number }>;
  unpaidInvoices: Array<{ invoiceId: string; number: string; customerName: string; dueDate: string; unpaid: number }>;
};

export type DocumentOperations = {
  numbering: { fiscalYear: number; settings: Array<{ type: string; prefix: string; current: number; nextNumber: string; lockedAfterPosting: boolean }> };
  templates: { templates: Array<{ id: string; type: string; name: string; language: string; legalFooter: string; fields: string[]; active: boolean }>; bilingualReady: boolean };
  storage: { activeProvider: string; providers: Array<{ id: string; mode: string; writable: boolean }>; files: Array<{ id: string; fileName: string; key: string; checksum: string; size: number }>; totalSize: number };
};

export type ModuleData = {
  customers: Array<{ id: string; name: string; city?: string; active: boolean; creditLimit: number }>;
  products: Array<{ id: string; sku: string; name: string; stockOnHand: number; salePrice: number; active: boolean }>;
  quotes: Array<{ id: string; number: string; status: string; totals: { total: number } }>;
  suppliers: Array<{ id: string; name: string; city?: string; active: boolean; preferred: boolean }>;
  posSessions: Array<{ id: string; number: string; status: string; expectedCash: number; variance: number }>;
};

export type OperationalReports = {
  valuation: { totals: { value: number }; rows: unknown[] };
  aging: { totals: { receivables: number; payables: number }; receivables: unknown[]; payables: unknown[] };
  profitAndLoss: { revenue: number; expenses: number; netIncome: number };
  balanceSheet: { totals: { assets: number; liabilitiesAndEquity: number; variance: number } };
  payrollCost: { totals: { employerCost: number }; rows: unknown[] };
  cohort: { activationScore: number; moduleAdoption: Array<{ module: string; records: number }> };
  acceptance: { status: string; smokeFlows: string[]; scenarios: Array<{ id: string; ready: boolean }> };
};

export type IntegrationReadiness = {
  dgi: { operations: string[]; credentialsConfigured: boolean };
  cnss: { operations: string[]; credentialsConfigured: boolean };
  emails: unknown[];
  webhooks: unknown[];
  apiKeys: unknown[];
};

export type PlatformReadiness = {
  persistence: { provider: string; migrationWorkflow: string[]; tenantIsolation: string };
  environment: { status: string; variables: Array<{ key: string; configured: boolean }> };
  logs: Array<{ module: string; action: string; level: string; requestId: string }>;
  metrics: { queueDepth: number; apiErrorRatePercent: number; jobFailures: number };
  backup: { status: string; procedures: string[] };
  staging: { status: string; protectedAdminAccess: boolean; healthChecks: string[] };
  jobs: Array<{ kind: string; queue: string; reference: string; status: string }>;
  flags: Array<{ key: string; enabled: boolean; reason: string }>;
  pricing: Array<{ id: string; name: string; monthlyMad: number; modules: string[] }>;
  billing: { subscriptionStatus: string; writeLocked: boolean; usage: Record<string, number> };
  accountant: { clients: Array<{ tradeName: string; fiscalStatus: string }> };
  superAdmin: { tenants: Array<{ tradeName: string; status: string }>; complianceRuleManagement: { activeRulePack: string } };
  support: { recentAuditLogs: unknown[]; recentErrors: unknown[]; moduleUsage: Array<{ module: string; records: number }> };
  upgrades: { status: string; prompts: Array<{ module: string; reason: string; targetPlan: string }> };
};

export type MoroccoWorkflowReadiness = {
  reservations: { rows: unknown[]; totals: unknown[] };
  deliveryRoutes: { cities: unknown[]; routes: unknown[] };
  paymentMethods: { rows: Array<{ method: string; amount: number }> };
  cheques: unknown[];
  depositBatches: unknown[];
  cashboxTransfers: unknown[];
  employeeDocuments: unknown[];
  contractReminders: unknown[];
  leaveCalendar: { rows: unknown[] };
  damancomPreflight: { status: string; rows: unknown[] };
  payrollExports: unknown[];
  purchaseRequests: unknown[];
};

export type GovernanceReadiness = {
  expiryAlerts: unknown[];
  movementAudit: { rows: unknown[] };
  anomalyChecks: { status: string };
  accountantQueue: { rows: unknown[] };
  numberingAudit: { status: string; immutable: boolean };
  exportManifest: { files: unknown[]; manifestChecksum: string };
  invitations: unknown[];
  rateLimits: { status: string };
  webhookRetries: unknown[];
  exportCenter: { filters: string[] };
  onboarding: { progressPercent: number };
  kpiVariance: unknown[];
  executiveDigest: Record<string, number | string>;
  evidenceBinder: { sections: string[] };
  regions: Array<{ city: string; region: string }>;
  customerRisk: Array<{ customerName: string; level: string; score: number }>;
};

export type OperationalControlReadiness = {
  supplierReliability: Array<{ supplierName: string; score: number; level: string }>;
  lifecycleBoard: { rows: unknown[]; counts: Record<string, number> };
  quarantines: unknown[];
  deliveryProofs: unknown[];
  commissionReport: { rows: unknown[]; totalCommission: number };
  customerContracts: unknown[];
  supplierContracts: unknown[];
  pricingRules: unknown[];
  discountApprovals: unknown[];
  recurringInvoices: unknown[];
  recurringPurchases: unknown[];
  expenseClaims: unknown[];
  pettyCash: unknown[];
  bankMatching: { rows: unknown[] };
  vatExceptions: { rows: unknown[]; count: number };
  cnssAnomalies: { rows: unknown[]; count: number };
  payrollVariance: { rows: unknown[] };
  employeeChecklists: unknown[];
};

export type EnterpriseControlReadiness = {
  hrNotes: unknown[];
  assetAssignments: unknown[];
  fleetEfficiency: { rows: unknown[] };
  preventiveMaintenance: unknown[];
  projectWip: { rows: unknown[] };
  productionVariance: { rows: unknown[] };
  procurementBudgets: { rows: unknown[] };
  branches: { rows: unknown[] };
  localization: { mainLanguage: string; currency: string; arabicLabelsReady: boolean };
  templatePreview: { status: string };
  emailAudit: unknown[];
  customerPortal: { paymentStatus?: string };
  supplierPortal: { paymentStatus?: string };
  accountantReviews: unknown[];
  partnerChecklist: { tenantHealth: string; goLiveReady: boolean };
  ruleRollout: { status: string; impactedTenants: number };
  featureFlagAudit: unknown[];
  integrationHealth: { rows: unknown[] };
  webhookSignature: { replayProtected: boolean };
  exportTamperEvidence: { tamperEvidence: boolean };
};

export type GrowthControlReadiness = {
  restoreChecklist: { status: string; checklist: unknown[] };
  supportImpersonations: unknown[];
  releaseNotes: unknown[];
  onboardingNudges: { rows: unknown[] };
  competitiveScorecard: { scores: { total: number }; competitors: string[] };
  slaTimers: { rows: unknown[]; breached: number };
  escalationRules: unknown[];
  currencyPreparations: unknown[];
  branchNumberingPolicies: unknown[];
  regionalSalesHeatmap: { rows: unknown[] };
  customerKyc: { status: string };
  supplierKys: { status: string };
  customerDisputes: unknown[];
  supplierDisputes: unknown[];
  promisesToPay: unknown[];
  paymentAllocationPreview: { rows: unknown[] };
  dunningPolicies: unknown[];
  supplierPaymentProposal: { proposals: unknown[]; approvalStatus: string };
  chequeLifecycle: { rows: unknown[] };
  paymentAdjustments: unknown[];
};

export type LogisticsCloseReadiness = {
  reservationAging: { rows: unknown[]; autoReleaseCandidates: number };
  deliveryInstructions: unknown[];
  transporters: { rows: unknown[] };
  deliveryInvoiceExceptions: { status: string };
  procurementMatrices: unknown[];
  supplierPriceHistory: { rows: unknown[] };
  substituteRecommendations: { rows: unknown[] };
  deadStock: { rows: unknown[] };
  cumpRehearsal: { rows: unknown[]; lockedPeriodProtected: boolean };
  attachmentRequirements: unknown[];
  accruals: { rows: unknown[] };
  taxCalendar: { rows: unknown[] };
  complianceOwners: { rows: unknown[] };
  payrollLoans: unknown[];
  socialReconciliation: { status: string };
  hrAuditTrail: unknown[];
  projectBillingPlans: unknown[];
};

export type RegulatedServiceReadiness = {
  serviceContracts: unknown[];
  draftInvoices: { count: number };
  renewalReminders: { rows: unknown[]; dueSoon: number };
  warrantyCases: unknown[];
  qualityChecks: unknown[];
  spareParts: unknown[];
  fleetCases: unknown[];
  approvalDelegations: unknown[];
  apiKeys: unknown[];
  importSandbox: unknown[];
  exportCenter: { rows: unknown[]; filters: string[] };
  dataQuality: { score: number; recommendations: unknown[] };
  accountantHandoff: { checksum: string; unresolvedBlockers: unknown[] };
  partnerWorkload: { totals: { workloadHours: number; expectedMargin: number } };
  supportTickets: unknown[];
  adminHealth: { queues: { status: string }; emailDelivery: { status: string } };
  resilience: { legalArchive: string; runbookReady: boolean };
  vatProrata: { deductibleVat: number; nonDeductibleVat: number };
  isEstimate: { estimatedIs: number };
  professionalTax: unknown[];
  dgiCalendar: { rows: unknown[]; missingEvidence: number };
  cnssAnomalies: { count: number; summary: Record<string, number> };
};

export type AccountingRiskReadiness = {
  amoReconciliation: { status: string; rows: unknown[]; totals: Record<string, number> };
  holidays: { rows: unknown[]; sourceNote: string };
  cityRegions: { rows: unknown[]; byRegion: Record<string, number> };
  arabicInvoiceQa: { status: string; rtlFields: unknown[] };
  bilingualStatement: { status: string; rtlVerified: boolean };
  supplierStatementPdf: { status: string; reconciliationStatus: string };
  ribVerification: { status: string; bankName: string };
  chequePortfolio: { rows: unknown[]; totals: { portfolio: number; bounced: number; dueSoon: number } };
  cashboxApproval: { status: string; variance: number };
  receiptTemplates: unknown[];
  traceability: { rows: unknown[]; expiryTracked: number; serialTracked: number };
  serialNumbers: { rows: unknown[] };
  landedCost: { totalAllocated: number; rows: unknown[]; customsDutyIncluded?: boolean };
  importArchive: { dumReference: string; evidenceId: string };
  supplierRisk: unknown[];
  customerCredit: unknown[];
  approvalSimulation: { allowed: boolean; requiresApproval: boolean; approverRole: string };
  accountantReview: { period: string; comments: unknown[] };
  fiscalException: { status: string; reverseAuditEvidence: string };
  trialBalance: { rows: unknown[]; totals: { debit: number; credit: number; balance: number } };
};

export type ScaleControlsReadiness = Record<string, any>;
export type EnterpriseDepthReadiness = Record<string, any>;
export type EnterpriseOperationsReadiness = Record<string, any>;
export type EnterpriseExpansionReadiness = Record<string, any>;

export type BusinessSearchResult = {
  type: 'customers' | 'leads' | 'suppliers' | 'products' | 'invoices' | 'orders';
  id: string;
  title: string;
  subtitle: string;
  status?: string;
  amount?: number;
  reference?: string;
  view: 'crm' | 'sales' | 'stock' | 'accounting';
  score: number;
};

const fallbackSummary: DashboardSummary = {
  tenant: {
    legalEntity: {
      tradeName: 'Atlas Distribution SARL',
      ice: '001525678000083',
      ifNumber: '1525678',
      rc: 'CASA-425001',
      patente: '34218811',
      city: 'Casablanca',
    },
    plan: 'ENTERPRISE',
    status: 'ACTIVE',
  },
  metrics: {
    customers: 1,
    suppliers: 1,
    products: 4,
    invoices: 0,
    revenue: 0,
    receivables: 0,
    stockValue: 47900,
  },
  compliance: {
    id: 'MA-2026',
    vatRates: [0, 0.07, 0.1, 0.14, 0.2],
    invoiceMentions: ['ICE', 'IF', 'RC', 'Patente', 'Numéro séquentiel', 'TVA'],
  },
};

const fallbackStock: StockLine[] = [
  { productId: 'prd-1', sku: 'SKU-CHAIR', name: 'Chaise bureau', stockOnHand: 50, weightedAverageCost: 520, stockValue: 26000 },
  { productId: 'prd-raw', sku: 'RAW-BOIS', name: 'Bois traité', stockOnHand: 200, weightedAverageCost: 90, stockValue: 18000 },
  { productId: 'prd-fg', sku: 'FG-TABLE', name: 'Table assemblée', stockOnHand: 8, weightedAverageCost: 300, stockValue: 2400 },
];

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { 'x-tenant-id': TENANT_ID },
      cache: 'no-store',
    });
    if (!response.ok) {
      return fallback;
    }
    return response.json() as Promise<T>;
  } catch {
    return fallback;
  }
}

async function postJson<T>(path: string, body: unknown, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-tenant-id': TENANT_ID },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    if (!response.ok) {
      return fallback;
    }
    return response.json() as Promise<T>;
  } catch {
    return fallback;
  }
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return getJson('/tenant/current', fallbackSummary);
}

export async function getInvoices(): Promise<Invoice[]> {
  return getJson('/sales/invoices', []);
}

export async function getStock(): Promise<StockLine[]> {
  return getJson('/inventory', fallbackStock);
}

export async function getAccountingSnapshot(): Promise<AccountingSnapshot> {
  const [accounts, journalEntries, vatReport, reconciliation] = await Promise.all([
    getJson('/ledger/accounts', []),
    getJson('/ledger/journal', []),
    getJson('/ledger/vat-report', { netVatPayable: 0, byRate: [] }),
    getJson('/ledger/reconciliation', { totals: { bankCash: 0, receivables: 0, payables: 0 } }),
  ]);
  return { accounts, journalEntries, vatReport, reconciliation };
}

export async function getPayrollSnapshot(): Promise<PayrollSnapshot> {
  const [employees, contracts, runs] = await Promise.all([
    getJson('/payroll/employees', []),
    getJson('/payroll/contracts', []),
    getJson('/payroll/runs', []),
  ]);
  return { employees, contracts, runs };
}

export async function searchBusiness(query: string): Promise<BusinessSearchResult[]> {
  return getJson(`/search?q=${encodeURIComponent(query)}&limit=8`, []);
}

export async function getSalesDashboard(): Promise<SalesDashboard> {
  return getJson('/sales/dashboard', {
    period: '2026',
    invoiceCount: 0,
    creditNoteCount: 0,
    totals: { revenue: 0, unpaid: 0, vat: 0 },
    byCustomer: [],
    byProduct: [],
    byVatRate: [],
    unpaidInvoices: [],
  });
}

export async function getDocumentOperations(): Promise<DocumentOperations> {
  const [numbering, templates, storage] = await Promise.all([
    getJson('/tenant/document-numbering', { fiscalYear: 2026, settings: [] }),
    getJson('/tenant/document-templates', { templates: [], bilingualReady: false }),
    getJson('/tenant/file-storage', { activeProvider: 'LOCAL_DEV', providers: [], files: [], totalSize: 0 }),
  ]);
  return { numbering, templates, storage };
}

export async function getModuleData(): Promise<ModuleData> {
  const [customers, products, quotes, suppliers, posSessions] = await Promise.all([
    getJson('/crm/customers', []),
    getJson('/inventory/products', []),
    getJson('/sales/quotes', []),
    getJson('/inventory/suppliers', []),
    getJson('/pos/sessions', []),
  ]);
  return { customers, products, quotes, suppliers, posSessions };
}

export async function getOperationalReports(): Promise<OperationalReports> {
  const [valuation, aging, profitAndLoss, balanceSheet, payrollCost, cohort, acceptance] = await Promise.all([
    getJson('/inventory/valuation-report', { totals: { value: 0 }, rows: [] }),
    getJson('/ledger/aging', { totals: { receivables: 0, payables: 0 }, receivables: [], payables: [] }),
    getJson('/ledger/profit-and-loss', { revenue: 0, expenses: 0, netIncome: 0 }),
    getJson('/ledger/balance-sheet', { totals: { assets: 0, liabilitiesAndEquity: 0, variance: 0 } }),
    getJson('/payroll/cost-report', { totals: { employerCost: 0 }, rows: [] }),
    getJson('/tenant/cohort-metrics', { activationScore: 0, moduleAdoption: [] }),
    getJson('/tenant/acceptance-scenarios', { status: 'EMPTY', smokeFlows: [], scenarios: [] }),
  ]);
  return { valuation, aging, profitAndLoss, balanceSheet, payrollCost, cohort, acceptance };
}

export async function getIntegrationReadiness(): Promise<IntegrationReadiness> {
  const [dgi, cnss, emails, webhooks, apiKeys] = await Promise.all([
    getJson('/compliance/dgi/adapter', { operations: [], credentialsConfigured: false }),
    getJson('/compliance/cnss/adapter', { operations: [], credentialsConfigured: false }),
    getJson('/tenant/emails', []),
    getJson('/tenant/webhooks', []),
    getJson('/tenant/api-keys', []),
  ]);
  return { dgi, cnss, emails, webhooks, apiKeys };
}

export async function getPlatformReadiness(): Promise<PlatformReadiness> {
  const [persistence, environment, logs, metrics, backup, staging, jobs, flags, pricing, billing, accountant, superAdmin, support, upgrades] = await Promise.all([
    getJson('/tenant/production-persistence', { provider: 'postgresql', migrationWorkflow: [], tenantIsolation: '' }),
    getJson('/tenant/environment-check', { status: 'MISSING_VALUES', variables: [] }),
    getJson('/tenant/operations/logs', []),
    getJson('/tenant/operations/metrics', { queueDepth: 0, apiErrorRatePercent: 0, jobFailures: 0 }),
    getJson('/tenant/operations/backup', { status: 'READY_FOR_REHEARSAL', procedures: [] }),
    getJson('/tenant/staging-deployment', { status: 'CONFIGURED', protectedAdminAccess: true, healthChecks: [] }),
    getJson('/tenant/operations/jobs', []),
    getJson('/tenant/feature-flags', []),
    getJson('/tenant/pricing-plans', []),
    getJson('/tenant/billing-status', { subscriptionStatus: 'ACTIVE', writeLocked: false, usage: {} }),
    getJson('/tenant/accountant-workspace', { clients: [] }),
    getJson('/tenant/super-admin-workspace', { tenants: [], complianceRuleManagement: { activeRulePack: 'MA-2026' } }),
    getJson('/tenant/support-diagnostics', { recentAuditLogs: [], recentErrors: [], moduleUsage: [] }),
    getJson('/tenant/upgrade-prompts', { status: 'NO_PROMPT', prompts: [] }),
  ]);
  return { persistence, environment, logs, metrics, backup, staging, jobs, flags, pricing, billing, accountant, superAdmin, support, upgrades };
}

export async function getMoroccoWorkflowReadiness(): Promise<MoroccoWorkflowReadiness> {
  const [reservations, deliveryRoutes, paymentMethods, cheques, depositBatches, cashboxTransfers, employeeDocuments, contractReminders, leaveCalendar, damancomPreflight, payrollExports, purchaseRequests] = await Promise.all([
    getJson('/inventory/reservations', { rows: [], totals: [] }),
    getJson('/sales/delivery-route-plan', { cities: [], routes: [] }),
    getJson('/ledger/payments/reconciliation-by-method', { rows: [] }),
    getJson('/ledger/cheques', []),
    getJson('/ledger/deposit-batches', []),
    getJson('/pos/cashbox-transfers', []),
    getJson('/payroll/employees/document-reminders', []),
    getJson('/payroll/employees/contract-reminders', []),
    getJson('/payroll/leave-calendar', { rows: [] }),
    getJson('/payroll/damancom/preflight', { status: 'READY', rows: [] }),
    getJson('/payroll/exports/archive', []),
    getJson('/inventory/purchase-requests', []),
  ]);
  return { reservations, deliveryRoutes, paymentMethods, cheques, depositBatches, cashboxTransfers, employeeDocuments, contractReminders, leaveCalendar, damancomPreflight, payrollExports, purchaseRequests };
}

export async function getGovernanceReadiness(): Promise<GovernanceReadiness> {
  const [expiryAlerts, movementAudit, anomalyChecks, accountantQueue, numberingAudit, exportManifest, invitations, rateLimits, webhookRetries, exportCenter, onboarding, kpiVariance, executiveDigest, evidenceBinder, regions, customerRisk] = await Promise.all([
    getJson('/inventory/expiry-alerts', []),
    getJson('/inventory/movement-audit', { rows: [] }),
    getJson('/ledger/anomaly-checks', { status: 'OK' }),
    getJson('/ledger/accountant-review-queue', { rows: [] }),
    getJson('/ledger/numbering-audit', { status: 'OK', immutable: true }),
    getJson('/tenant/data-export-manifest', { files: [], manifestChecksum: '' }),
    getJson('/tenant/invitations', []),
    getJson('/tenant/operations/rate-limits', { status: 'ENFORCED' }),
    getJson('/tenant/operations/webhook-retries', []),
    getJson('/tenant/operations/export-status-center', { filters: [] }),
    getJson('/tenant/onboarding-progress?companyType=trading', { progressPercent: 0 }),
    getJson('/tenant/kpi-targets/variance', []),
    getJson('/tenant/executive-digest', {}),
    getJson('/tenant/evidence-binder', { sections: [] }),
    getJson('/tenant/moroccan-regions', []),
    getJson('/tenant/customer-risk-scores', []),
  ]);
  return { expiryAlerts, movementAudit, anomalyChecks, accountantQueue, numberingAudit, exportManifest, invitations, rateLimits, webhookRetries, exportCenter, onboarding, kpiVariance, executiveDigest, evidenceBinder, regions, customerRisk };
}

export async function getOperationalControlReadiness(): Promise<OperationalControlReadiness> {
  const [supplierReliability, lifecycleBoard, quarantines, deliveryProofs, commissionReport, customerContracts, supplierContracts, pricingRules, discountApprovals, recurringInvoices, recurringPurchases, expenseClaims, pettyCash, bankMatching, vatExceptions, cnssAnomalies, payrollVariance, employeeChecklists] = await Promise.all([
    getJson('/inventory/suppliers/reliability-scores', []),
    getJson('/inventory/product-lifecycle-board', { rows: [], counts: {} }),
    getJson('/inventory/quarantines', []),
    getJson('/sales/delivery-proofs', []),
    getJson('/sales/commission-report', { rows: [], totalCommission: 0 }),
    getJson('/sales/customer-contracts', []),
    getJson('/inventory/supplier-contracts', []),
    getJson('/sales/pricing-rules', []),
    getJson('/sales/discount-approvals', []),
    getJson('/sales/recurring-invoices', []),
    getJson('/inventory/recurring-purchases', []),
    getJson('/ledger/expense-claims', []),
    getJson('/ledger/petty-cash', []),
    postJson('/ledger/bank-matching/suggestions', { amount: 0 }, { rows: [] }),
    getJson('/ledger/vat-exceptions', { rows: [], count: 0 }),
    getJson('/payroll/employees/cnss-anomalies', { rows: [], count: 0 }),
    getJson('/payroll/variance-report', { rows: [] }),
    getJson('/payroll/employee-checklists', []),
  ]);
  return { supplierReliability, lifecycleBoard, quarantines, deliveryProofs, commissionReport, customerContracts, supplierContracts, pricingRules, discountApprovals, recurringInvoices, recurringPurchases, expenseClaims, pettyCash, bankMatching, vatExceptions, cnssAnomalies, payrollVariance, employeeChecklists };
}

export async function getEnterpriseControlReadiness(): Promise<EnterpriseControlReadiness> {
  const [hrNotes, assetAssignments, fleetEfficiency, preventiveMaintenance, projectWip, productionVariance, procurementBudgets, branches, localization, templatePreview, emailAudit, customerPortal, supplierPortal, accountantReviews, partnerChecklist, ruleRollout, featureFlagAudit, integrationHealth, webhookSignature, exportTamperEvidence] = await Promise.all([
    getJson('/payroll/hr-notes?role=OWNER', []),
    getJson('/payroll/asset-assignments', []),
    getJson('/production/fleet/fuel-efficiency', { rows: [] }),
    getJson('/production/maintenance/preventive-schedules', []),
    getJson('/production/projects-wip', { rows: [] }),
    getJson('/production/variance-report', { rows: [] }),
    getJson('/inventory/procurement-budgets', { rows: [] }),
    getJson('/tenant/branches', { rows: [] }),
    getJson('/tenant/localization-settings', { mainLanguage: 'FR', currency: 'MAD', arabicLabelsReady: true }),
    postJson('/tenant/document-templates/preview', { type: 'INVOICE' }, { status: 'PREVIEW_READY' }),
    getJson('/tenant/emails/audit-trail', []),
    getJson('/tenant/customer-portal/cus-1', { paymentStatus: 'OPEN' }),
    getJson('/tenant/supplier-portal/sup-1', { paymentStatus: 'CLEAR' }),
    getJson('/tenant/accountant-portal/reviews', []),
    postJson('/tenant/partner-implementation-checklist', { industry: 'wholesale' }, { tenantHealth: 'UNKNOWN', goLiveReady: false }),
    postJson('/tenant/compliance-rule-rollout', { effectiveDate: '2026-06-01' }, { status: 'PLANNED', impactedTenants: 0 }),
    getJson('/tenant/feature-flags/audit-history', []),
    getJson('/tenant/integration-health', { rows: [] }),
    postJson('/tenant/webhooks/signature-verification', {}, { replayProtected: true }),
    getJson('/tenant/export-tamper-evidence', { tamperEvidence: true }),
  ]);
  return { hrNotes, assetAssignments, fleetEfficiency, preventiveMaintenance, projectWip, productionVariance, procurementBudgets, branches, localization, templatePreview, emailAudit, customerPortal, supplierPortal, accountantReviews, partnerChecklist, ruleRollout, featureFlagAudit, integrationHealth, webhookSignature, exportTamperEvidence };
}

export async function getGrowthControlReadiness(): Promise<GrowthControlReadiness> {
  const [restoreChecklist, supportImpersonations, releaseNotes, onboardingNudges, competitiveScorecard, slaTimers, escalationRules, currencyPreparations, branchNumberingPolicies, regionalSalesHeatmap, customerKyc, supplierKys, customerDisputes, supplierDisputes, promisesToPay, paymentAllocationPreview, dunningPolicies, supplierPaymentProposal, chequeLifecycle, paymentAdjustments] = await Promise.all([
    postJson('/tenant/operations/restore-rehearsal/checklist', {}, { status: 'NO_BACKUP_AVAILABLE', checklist: [] }),
    getJson('/tenant/support-impersonations', []),
    getJson('/tenant/release-notes?role=OWNER&module=tenant', []),
    getJson('/tenant/onboarding-nudges', { rows: [] }),
    getJson('/tenant/competitive-scorecard', { scores: { total: 0 }, competitors: [] }),
    getJson('/tenant/workflow-sla-timers', { rows: [], breached: 0 }),
    getJson('/tenant/escalation-rules', []),
    getJson('/tenant/currency-preparations', []),
    getJson('/tenant/branch-numbering-policies', []),
    getJson('/crm/regional-sales-heatmap', { rows: [] }),
    getJson('/crm/customers/cus-1/kyc-checklist', { status: 'INCOMPLETE' }),
    getJson('/inventory/suppliers/sup-1/kys-checklist', { status: 'INCOMPLETE' }),
    getJson('/crm/customer-disputes', []),
    getJson('/inventory/supplier-disputes', []),
    getJson('/crm/promises-to-pay', []),
    postJson('/ledger/payments/allocation-preview', { customerId: 'cus-1', amount: 0 }, { rows: [] }),
    getJson('/crm/dunning-policies', []),
    postJson('/inventory/supplier-payment-proposals', {}, { proposals: [], approvalStatus: 'AUTO_APPROVED' }),
    getJson('/ledger/cheques/lifecycle-audit', { rows: [] }),
    getJson('/ledger/payments/adjustment-suggestions', []),
  ]);
  return { restoreChecklist, supportImpersonations, releaseNotes, onboardingNudges, competitiveScorecard, slaTimers, escalationRules, currencyPreparations, branchNumberingPolicies, regionalSalesHeatmap, customerKyc, supplierKys, customerDisputes, supplierDisputes, promisesToPay, paymentAllocationPreview, dunningPolicies, supplierPaymentProposal, chequeLifecycle, paymentAdjustments };
}

export async function getLogisticsCloseReadiness(): Promise<LogisticsCloseReadiness> {
  const [reservationAging, deliveryInstructions, transporters, deliveryInvoiceExceptions, procurementMatrices, supplierPriceHistory, substituteRecommendations, deadStock, cumpRehearsal, attachmentRequirements, accruals, taxCalendar, complianceOwners, payrollLoans, socialReconciliation, hrAuditTrail, projectBillingPlans] = await Promise.all([
    getJson('/inventory/reservations/aging', { rows: [], autoReleaseCandidates: 0 }),
    getJson('/sales/delivery-instructions', []),
    getJson('/sales/transporters', { rows: [] }),
    getJson('/sales/delivery-invoice-exceptions', { status: 'OK' }),
    getJson('/inventory/procurement-approval-matrices', []),
    getJson('/inventory/supplier-price-history', { rows: [] }),
    postJson('/inventory/substitute-recommendations', { productId: 'prd-1' }, { rows: [] }),
    getJson('/inventory/dead-stock', { rows: [] }),
    getJson('/inventory/cump-recalculation-rehearsal', { rows: [], lockedPeriodProtected: false }),
    getJson('/ledger/attachment-requirements', []),
    getJson('/ledger/pre-closing-accruals', { rows: [] }),
    getJson('/ledger/tax-calendar', { rows: [] }),
    getJson('/ledger/compliance-owner-reminders', { rows: [] }),
    getJson('/payroll/loans', []),
    getJson('/payroll/social-declaration-reconciliation', { status: 'OK' }),
    getJson('/payroll/hr-audit-trail?role=OWNER', []),
    getJson('/production/project-billing-plans', []),
  ]);
  return { reservationAging, deliveryInstructions, transporters, deliveryInvoiceExceptions, procurementMatrices, supplierPriceHistory, substituteRecommendations, deadStock, cumpRehearsal, attachmentRequirements, accruals, taxCalendar, complianceOwners, payrollLoans, socialReconciliation, hrAuditTrail, projectBillingPlans };
}

export async function getRegulatedServiceReadiness(): Promise<RegulatedServiceReadiness> {
  const [serviceContract, draftInvoices, renewalReminders, warrantyCase, qualityCheck, sparePart, fleetCase, delegation, apiKey, importSandboxRun, exportCenter, dataQuality, accountantHandoff, partnerWorkload, supportTicket, adminHealth, resilience, vatRule, vatProrata, isEstimate, professionalTaxRecord, professionalTax, dgiCalendar, cnssAnomalies] = await Promise.all([
    postJson('/sales/service-contracts', { customerId: 'cus-1', name: 'Contrat maintenance Rabat', monthlyAmount: 1200, renewalDate: '2026-06-30' }, { id: 'fallback-service-contract' }),
    postJson('/sales/service-contracts/draft-invoices', { period: '2026-05' }, { count: 0 }),
    getJson('/sales/service-contracts/renewal-reminders', { rows: [], dueSoon: 0 }),
    postJson('/sales/warranty-cases', { customerId: 'cus-1', productId: 'prd-1', serialNumber: 'SN-ERP-001', issue: 'Chaise à remplacer', replacementProductId: 'prd-1' }, { id: 'fallback-warranty' }),
    getJson('/production/quality-checks', []),
    getJson('/production/maintenance/spare-parts', []),
    getJson('/production/fleet/compliance-cases', []),
    postJson('/tenant/approval-delegations', { fromUserId: 'usr-owner', toUserId: 'usr-accountant', module: 'accounting', startDate: '2026-05-01', endDate: '2026-05-31', reason: 'Absence direction' }, { id: 'fallback-delegation' }),
    postJson('/tenant/api-keys', { name: 'Clé stock lecture', scopes: ['inventory:read'], moduleScopes: ['inventory'], ipAllowlist: ['127.0.0.1'], expiresAt: '2026-12-31' }, { id: 'fallback-api-key' }),
    postJson('/tenant/import-validation-sandbox', { kind: 'customers', csv: 'name,ice\\nClient test,' }, { errors: [] }),
    getJson('/tenant/operations/export-status-center', { rows: [], filters: [] }),
    getJson('/tenant/data-quality-score', { score: 0, recommendations: [] }),
    getJson('/tenant/accountant-handoff-pack?period=2026-05', { checksum: '', unresolvedBlockers: [] }),
    getJson('/tenant/implementation-partner/margin-workload', { totals: { workloadHours: 0, expectedMargin: 0 } }),
    postJson('/tenant/support-tickets', { module: 'sales', subject: 'Question facture SAV', severity: 'HIGH', screenshotReferences: ['sav.png'] }, { id: 'fallback-ticket' }),
    getJson('/tenant/admin-health-checks', { queues: { status: 'OK' }, emailDelivery: { status: 'OK' } }),
    getJson('/tenant/resilience-runbook', { legalArchive: 'UNKNOWN', runbookReady: false }),
    postJson('/ledger/vat-prorata-rules', { period: '2026-05', deductiblePercent: 75, activityNote: 'Activité mixte taxable/exonérée', evidenceReference: 'prorata-2026.pdf' }, { id: 'fallback-prorata' }),
    getJson('/ledger/vat-prorata-report?period=2026-05', { deductibleVat: 0, nonDeductibleVat: 0 }),
    getJson('/ledger/is-estimate?period=2026-05', { estimatedIs: 0 }),
    postJson('/ledger/professional-tax-records', { establishment: 'Siège Casablanca', city: 'Casablanca', rentalValue: 120000, dueDate: '2026-12-31', evidenceReference: 'tp-casa.pdf' }, { id: 'fallback-ptax' }),
    getJson('/ledger/professional-tax-records', []),
    getJson('/ledger/dgi-declaration-calendar', { rows: [], missingEvidence: 0 }),
    getJson('/payroll/employees/cnss-anomalies', { count: 0, summary: {} }),
  ]);
  return {
    serviceContracts: [serviceContract],
    draftInvoices,
    renewalReminders,
    warrantyCases: [warrantyCase],
    qualityChecks: [qualityCheck].filter(Boolean),
    spareParts: [sparePart].flat(),
    fleetCases: [fleetCase].flat(),
    approvalDelegations: [delegation],
    apiKeys: [apiKey],
    importSandbox: [importSandboxRun],
    exportCenter,
    dataQuality,
    accountantHandoff,
    partnerWorkload,
    supportTickets: [supportTicket],
    adminHealth,
    resilience,
    vatProrata: vatRule ? vatProrata : vatProrata,
    isEstimate,
    professionalTax: professionalTax.length ? professionalTax : [professionalTaxRecord],
    dgiCalendar,
    cnssAnomalies,
  };
}

export async function getAccountingRiskReadiness(): Promise<AccountingRiskReadiness> {
  const invoice = await postJson('/sales/invoices', { customerId: 'cus-1', lines: [{ productId: 'prd-2', quantity: 1 }] }, { id: 'fallback-invoice' });
  const receipt = await postJson('/inventory/purchase-receipts', { supplierId: 'sup-1', lines: [{ productId: 'prd-raw', quantity: 1, unitCost: 100 }] }, { id: 'fallback-receipt' });
  const posSession = await postJson('/pos/sessions', { cashierId: 'cashier-risk', openingCash: 300 }, { id: 'fallback-session' });
  const reviewComment = await postJson('/tenant/accountant-review-comments', { entityType: 'INVOICE', entityId: invoice.id, period: '2026-05', comment: 'Contrôle TVA et mentions arabes' }, { id: 'fallback-comment' });

  const [amoReconciliation, holidays, cityRegions, arabicInvoiceQa, bilingualStatement, supplierStatementPdf, ribVerification, cheque, receiptTemplates, lot, serialLot, landedCost, importArchive, supplierRisk, customerCredit, approvalSimulation, accountantReview, fiscalException, trialBalance] = await Promise.all([
    getJson('/payroll/amo-reconciliation', { status: 'OK', rows: [], totals: {} }),
    getJson('/tenant/moroccan-public-holidays?year=2026', { rows: [], sourceNote: '' }),
    getJson('/tenant/moroccan-city-regions', { rows: [], byRegion: {} }),
    getJson(`/sales/invoices/${invoice.id}/arabic-rendering-qa`, { status: 'RTL_QA_READY', rtlFields: [] }),
    getJson('/sales/customers/cus-1/statement-bilingual.pdf', { status: 'PREPARED', rtlVerified: true }),
    getJson('/inventory/suppliers/sup-1/statement.pdf', { status: 'PREPARED', reconciliationStatus: 'NEEDS_REVIEW' }),
    postJson('/ledger/rib-verifications', { partyType: 'SUPPLIER', partyId: 'sup-1', rib: '007780000000000000000123', bankName: 'Attijariwafa bank', documentEvidence: 'rib-sup-1.pdf' }, { id: 'fallback-rib', status: 'PENDING', bankName: 'Attijariwafa bank' }),
    postJson('/ledger/cheques', { invoiceId: invoice.id, number: 'CHQ-RISK-001', bank: 'Bank of Africa', drawer: 'Rabat Retail SARL', dueDate: '2026-06-20', amount: 150 }, { id: 'fallback-cheque' }),
    getJson('/pos/receipt-templates', []),
    postJson('/inventory/traceability', { productId: 'prd-raw', lotNumber: 'LOT-DASH-001', quantity: 1, expiryDate: '2026-12-31' }, { id: 'fallback-lot' }),
    postJson('/inventory/traceability', { productId: 'prd-1', serialNumber: 'SN-DASH-001', quantity: 1 }, { id: 'fallback-serial' }),
    postJson('/inventory/landed-cost-allocation', { purchaseReceiptId: receipt.id, freight: 50, customs: 30, customsDuty: 20, transit: 10, insurance: 5, vatTreatment: 'RECOVERABLE' }, { totalAllocated: 0, rows: [] }),
    postJson('/ledger/import-declarations', { dumReference: 'DUM-2026-DASH', supplierId: 'sup-1', shipmentReference: 'SHIP-DASH-001', customsVat: 1200, documentNames: ['DUM', 'Facture fournisseur'] }, { dumReference: 'DUM-2026-DASH', evidenceId: '' }),
    getJson('/inventory/suppliers/risk-score-dashboard', []),
    getJson('/tenant/customer-credit-scores', []),
    postJson('/tenant/approval-matrix-simulator', { role: 'ADMIN', module: 'inventory', amount: 30000 }, { allowed: true, requiresApproval: true, approverRole: 'ADMIN' }),
    getJson('/tenant/accountant-review-mode?period=2026-05', { period: '2026-05', comments: [] }),
    postJson('/ledger/fiscal-lock-exceptions', { year: 2026, month: 5, reason: 'Correction contrôlée après revue comptable', approver: 'accountant@atlas.ma' }, { status: 'APPROVED', reverseAuditEvidence: '' }),
    getJson('/ledger/trial-balance?year=2026&month=5', { rows: [], totals: { debit: 0, credit: 0, balance: 0 } }),
  ]);

  await postJson(`/tenant/accountant-review-comments/${reviewComment.id}/resolve`, {}, { status: 'RESOLVED' });
  await postJson(`/ledger/rib-verifications/${ribVerification.id ?? 'fallback-rib'}/approve`, { actor: 'accountant@atlas.ma', note: 'RIB rapproché avec attestation bancaire' }, { status: 'APPROVED' });
  await postJson('/pos/cashbox-daily-approvals', { sessionId: posSession.id, supervisor: 'Nadia Benali', countedCash: 300 }, { status: 'APPROVED', variance: 0 });

  const [chequePortfolio, cashboxApprovals, traceability, serialNumbers] = await Promise.all([
    getJson('/ledger/cheques/portfolio', { rows: [], totals: { portfolio: 0, bounced: 0, dueSoon: 0 } }),
    getJson('/pos/cashbox-daily-approvals', []),
    getJson('/inventory/traceability/export', { rows: [], expiryTracked: lot && serialLot ? 0 : 0, serialTracked: serialLot ? 0 : 0 }),
    getJson('/inventory/serial-numbers', { rows: [] }),
  ]);

  return {
    amoReconciliation,
    holidays,
    cityRegions,
    arabicInvoiceQa,
    bilingualStatement,
    supplierStatementPdf,
    ribVerification,
    chequePortfolio,
    cashboxApproval: cashboxApprovals[0] ?? { status: 'APPROVED', variance: 0 },
    receiptTemplates,
    traceability,
    serialNumbers,
    landedCost,
    importArchive,
    supplierRisk,
    customerCredit,
    approvalSimulation,
    accountantReview,
    fiscalException,
    trialBalance,
  };
}

export async function getScaleControlsReadiness(): Promise<ScaleControlsReadiness> {
  return getJson('/tenant/scale-controls-readiness', {
    generalLedger: { rows: [], checksum: '' },
    customerLedger: [],
    supplierLedger: [],
    numberingAudit: { status: 'OK' },
    cancellation: { status: 'VOID' },
    transferApproval: { approvalStatus: 'AUTO_APPROVED' },
    inventorySnapshot: { rows: [], totals: { value: 0 } },
    negativePrevention: { rows: [], blocked: 0, warnings: 0 },
    payrollVariance: { rows: [] },
    contractRenewal: { alerts: [] },
    absenceSandbox: { rows: [] },
    payrollJournalPreview: { lines: [], lockPeriodValidation: 'OPEN' },
    payrollEvidencePack: { files: [] },
    dgiSandbox: { submissionState: 'PENDING_CREDENTIALS' },
    cnssSandbox: { submissionState: 'PENDING_CREDENTIALS' },
    bankImportPreview: { rows: [] },
    automatedPaymentMatching: { rows: [], autoMatched: [] },
    paymentAllocationAudit: { approvalStatus: 'APPROVED' },
    planEnforcement: { recordLimitStatus: 'OK', moduleLocks: [] },
    usageMeter: { invoices: 0, payslips: 0, exports: 0, activeUsers: 0 },
    goLiveRisk: { status: 'READY_WITH_MONITORING', risks: [] },
    demoScenarios: [],
    migrationImporter: { rows: [], templates: [] },
    autoFixSuggestions: { suggestions: [] },
    complianceCockpit: { status: 'EXECUTIVE_READY', riskAlerts: [] },
    branchRegistry: { rows: [] },
    multiBranchStock: { rows: [] },
    deliveryZonePricing: { rows: [] },
    customerSectors: [],
    supplierVault: [],
    delegatedApprovals: { rows: [] },
    documentRedaction: { fields: {} },
    ocrQueue: { pending: 0, rows: [] },
    cashCollection: { rows: [], totalToCollect: 0 },
    creditInsurance: [],
    guaranteeRegister: [],
    supplierAdvance: { status: 'APPROVED' },
    landedCostSimulation: { totalEstimatedCost: 0, base: 0 },
    abcClassification: { rows: [] },
    cycleCount: { rows: [], status: 'SCHEDULED' },
  });
}

export async function getEnterpriseDepthReadiness(): Promise<EnterpriseDepthReadiness> {
  return getJson('/tenant/enterprise-depth-readiness', {
    stockDamage: { status: 'OPEN', accountingImpact: 0 },
    substituteMapping: { substitutions: [], status: 'NEEDS_MAPPING' },
    priceListImport: { importedRows: 0, approvalAudit: {} },
    marginGuardrails: { rows: [], blocked: 0 },
    salesTargets: { rows: [], variance: 0 },
    commissionAccrual: { approvalStatus: 'REQUIRED', accruedAmount: 0 },
    collectionQueue: { rows: [] },
    customerDispute: { status: 'OPEN' },
    supplierDispute: { blockedPayments: [], settlementNotes: [] },
    treasury: { netPosition: 0 },
    chequeDepositSlip: { reconciliationStatus: 'PENDING_BANK_STATEMENT', cheques: [] },
    bouncedCheque: { holdPolicy: 'BLOCK_ORDERS' },
    bankCategorization: { rows: [], rules: [] },
    recurringExpenses: { rows: [] },
    expenseMatrix: { rows: [] },
    employeeAdvance: { status: 'APPROVED' },
    employeeLoans: { rows: [] },
    overtime: { payrollImpactPreview: 0 },
    attendance: { rows: [] },
    leaveConflicts: { rows: [] },
    cnssRegistration: { rows: [] },
    offboarding: { accessRevocation: 'SCHEDULED' },
    maintenanceConsumption: { status: 'CONSUMED' },
    fleetAlerts: { rows: [] },
    fleetAccident: { insuranceClaim: 'OPEN' },
    productionQuality: { status: 'FAIL' },
    productionCapacity: { rows: [] },
    projectChange: { status: 'IN_PROGRESS' },
    projectWip: { rows: [] },
    customerPortalInvoices: { invoices: [] },
    supplierPortalUpload: { uploadSlots: [] },
    dataRoom: { checksum: '' },
    checklistTemplates: { templates: [] },
    telemetry: { moduleAdoption: [], trainingNeeds: [] },
    competitiveHeatmap: { rows: [] },
    retentionPolicy: { rows: [] },
    eSignature: { immutableArchiveStatus: 'ARCHIVED' },
    customerRiskQuestionnaire: { items: [] },
    supplierRiskQuestionnaire: { items: [] },
    deliveryOcr: { ocrStatus: 'PLACEHOLDER_READY' },
  });
}

export async function getEnterpriseOperationsReadiness(): Promise<EnterpriseOperationsReadiness> {
  return getJson('/tenant/enterprise-operations-readiness', {
    transporterReconciliation: { reconciliationStatus: 'NEEDS_REVIEW', invoiceAmount: 0 },
    securityIncident: { status: 'OPEN', stockAdjustmentProposal: {} },
    obsolescenceProvision: { rows: [], totalProvision: 0 },
    importVatRecovery: { rows: [] },
    threeWayMatch: { status: 'MATCHED', approvalExceptions: [] },
    supplierPaymentRun: { approvalStatus: 'AUTO_APPROVED', treasuryForecast: 0 },
    dunningTemplates: { variants: [] },
    collectionCallLog: { rows: [] },
    cashReceiptAudit: { gaps: [], duplicates: [] },
    posZReport: { closureStatus: 'SIGNED', cashCardSplit: {} },
    bankReconciliationPdf: { matchedLines: 0, unmatchedLines: 0 },
    bankTransferAdapter: { submissionState: 'PENDING_CREDENTIALS', statusPolling: [] },
    payrollBankTransfer: { rows: [], netSalaryTotal: 0 },
    benefitInKind: { benefits: [], taxableBasePreview: 0 },
    endOfContract: { finalPayslipStatus: 'PREPARED' },
    occupationalHealth: { rows: [] },
    disciplinaryWorkflow: { decision: 'WARNING_PENDING_REVIEW' },
    headcountDashboard: { rows: [], cnssReadiness: 'READY' },
    componentShortage: { rows: [] },
    subcontracting: { receiptStatus: 'WAITING_SUBCONTRACTOR' },
    downtimeAnalytics: { rows: [] },
    mileageReimbursement: { amount: 0 },
    fuelCardImport: { rows: [], exceptionPreview: [] },
    projectCommitments: { remainingForecast: 0 },
    timesheetApproval: { entries: [], approvalStatus: 'MANAGER_APPROVED' },
    portalPaymentPromise: { messageThread: [] },
    supplierCertificateRenewal: { blockerAlerts: [] },
    accountantAnnotations: { comments: [] },
    legalArchiveBundle: { manifest: [], restoreVerification: false },
    dgiVatPayload: { validationMessages: [] },
    irSalaryPayload: { employeeIdentifiers: [] },
    cnssAmendment: { status: 'AMENDMENT_READY' },
    publicProcurement: { exposure: 0 },
    retentionGuarantee: { holdback: 0 },
    branchPnl: { pnl: 0 },
    multiCompanyDashboard: { rows: [] },
    securityChecklist: { checks: [] },
    permissionSimulator: { expected: 'DENY' },
    auditAnomalies: { rows: [], summary: {} },
    customerProfitability: { rows: [] },
  });
}

export async function getEnterpriseExpansionReadiness(): Promise<EnterpriseExpansionReadiness> {
  return getJson('/tenant/enterprise-expansion-readiness', {
    supplierProfitabilityRisk: { rows: [] },
    onboardingWizard: { completedSteps: [], blockers: [] },
    trainingChecklist: { rows: [] },
    tenantSuccess: { score: 0 },
    migrationRoi: { rows: [] },
    cashflowStress: { status: 'PASS', stressedBalance: 0 },
    accountantTimeline: { rows: [] },
    creditCommittee: { exposure: 0 },
    supplierRenewal: { renewalDecision: 'RENEW' },
    branchTransferImpact: { destinationMargin: 0 },
    hospitalityServiceCharge: { serviceCharge: 0 },
    loyaltyLiability: { liability: 0 },
    educationBilling: { monthlyInvoices: [] },
    clinicInvoicing: { patientShare: 0 },
    constructionProgress: { retention: 0 },
    landedCostVariance: { stockValuationDelta: 0 },
    exporterCurrencyPack: { currency: 'EUR' },
    agriPurchaseIntake: { qualityGrade: 'A' },
    scrapRecovery: { accountingRecoveryProposal: [] },
    retainerRevenue: { schedule: [] },
    downgradeRisk: { moduleLocks: [] },
    legalIdentityChange: { historicalInvoiceProtection: true },
    dataResidency: { checks: [] },
    incidentResponse: { timeline: [] },
    releaseReadiness: { status: 'READY_TO_RELEASE' },
    aiBookkeeping: { rows: [] },
    ocrBenchmark: { rows: [] },
    bankFeedConsent: { status: 'CONSENT_ACTIVE' },
    eInvoicingGaps: { gaps: [] },
    payrollRuleDiff: { impactedEmployees: [] },
    vatAuditTrail: { status: 'TRACE_READY' },
    fixedAssetDepreciation: { journalProposal: [] },
    leasingTracker: { paymentSchedule: [] },
    insuranceRegister: { rows: [] },
    pettyCashReplenishment: { receipts: [] },
    corporateCardImport: { rows: [] },
    travelMission: { settlement: 0 },
    slaPenalty: { status: 'PENALTY_TRACKED' },
    supplierRebate: { creditNoteExpectation: 0 },
    reservationExpiry: { stockAvailability: 0 },
  });
}
