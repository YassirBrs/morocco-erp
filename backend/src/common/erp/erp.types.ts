export type SubscriptionPlan = 'INTILAQ' | 'NUMOW' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
export type UserRole = 'OWNER' | 'ADMIN' | 'ACCOUNTANT' | 'SALES' | 'WAREHOUSE' | 'PAYROLL' | 'CASHIER' | 'READ_ONLY' | 'IMPLEMENTATION_PARTNER';
export type VatRate = 0 | 0.07 | 0.1 | 0.14 | 0.2;
export type DocumentStatus = 'DRAFT' | 'POSTED' | 'PAID' | 'VOID';
export type QuoteStatus = 'DRAFT' | 'APPROVED' | 'CONVERTED' | 'VOID';
export type SalesOrderStatus = 'CONFIRMED' | 'DELIVERED' | 'INVOICED' | 'CANCELLED';
export type DeliveryNoteStatus = 'POSTED' | 'CANCELLED';
export type PurchaseOrderStatus = 'DRAFT' | 'APPROVED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED';
export type SupplierInvoiceStatus = 'POSTED' | 'PAID' | 'VOID';
export type StockTransferStatus = 'IN_TRANSIT' | 'RECEIVED' | 'CANCELLED';
export type InventoryCountStatus = 'DRAFT' | 'APPROVED' | 'POSTED';
export type FiscalPeriodStatus = 'OPEN' | 'SOFT_LOCKED' | 'LOCKED' | 'CLOSED';
export type PayrollRunStatus = 'DRAFT' | 'CALCULATED' | 'APPROVED' | 'POSTED' | 'CANCELLED';
export type LeaveRequestStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type PosSessionStatus = 'OPEN' | 'CLOSED';
export type PosOfflineQueueStatus = 'PENDING' | 'SYNCED' | 'CONFLICT';
export type WorkOrderStatus = 'OPEN' | 'ASSIGNED' | 'DONE';
export type ProjectStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'ON_HOLD';
export type StockMoveType = 'RECEIPT' | 'DELIVERY' | 'DELIVERY_REVERSAL' | 'ADJUSTMENT' | 'PRODUCTION_CONSUME' | 'PRODUCTION_OUTPUT' | 'POS_SALE' | 'RESERVATION' | 'RESERVATION_RELEASE' | 'TRANSFER_OUT' | 'TRANSFER_IN' | 'COUNT_VARIANCE';
export type BusinessSearchType = 'customers' | 'leads' | 'suppliers' | 'products' | 'invoices' | 'orders';
export type ApprovalStatus = 'AUTO_APPROVED' | 'REQUIRED' | 'APPROVED';
export type CollaborationEntityType = 'CUSTOMER' | 'SUPPLIER' | 'INVOICE' | 'PAYROLL_RUN';
export type InternalTaskStatus = 'OPEN' | 'DONE';
export type PreferredLanguage = 'FR' | 'AR' | 'BILINGUAL';
export type ImportTemplateKind = 'customers' | 'suppliers' | 'products' | 'employees' | 'chart-of-accounts';
export type PermissionAction = 'READ' | 'WRITE' | 'ADMIN';
export type ErpModuleKey = 'tenant' | 'auth' | 'crm' | 'sales' | 'inventory' | 'accounting' | 'payroll' | 'pos' | 'production' | 'compliance';
export type DocumentExportType = 'QUOTE' | 'ORDER' | 'DELIVERY_NOTE' | 'INVOICE' | 'CREDIT_NOTE' | 'PURCHASE_ORDER' | 'PURCHASE_RECEIPT' | 'PAYSLIP';
export type AdapterKind = 'DGI' | 'CNSS';
export type BackgroundJobKind = 'PDF' | 'EXPORT' | 'EMAIL' | 'DECLARATION' | 'IMPORT';
export type BackgroundJobStatus = 'QUEUED' | 'RUNNING' | 'DONE' | 'FAILED';
export type ChequeStatus = 'RECEIVED' | 'DEPOSITED' | 'CLEARED' | 'REJECTED';
export type DepositBatchStatus = 'DRAFT' | 'DEPOSITED' | 'RECONCILED';

export interface LocalizedFields {
  arabicName?: string;
  arabicAddress?: string;
  arabicDescription?: string;
  preferredLanguage?: PreferredLanguage;
}

export interface DocumentExpiry {
  type: string;
  expiresAt: string;
  reference?: string;
  arabicType?: string;
  arabicReference?: string;
}

export interface BusinessSearchInput {
  q: string;
  types?: BusinessSearchType[];
  limit?: number;
}

export interface BusinessSearchResult {
  type: BusinessSearchType;
  id: string;
  title: string;
  subtitle: string;
  status?: string;
  amount?: number;
  reference?: string;
  view: 'crm' | 'sales' | 'stock' | 'accounting';
  score: number;
}

export interface LegalEntity {
  tradeName: string;
  ice: string;
  ifNumber: string;
  rc: string;
  patente: string;
  cnssNumber: string;
  address: string;
  city: string;
  country: 'MA';
  vatEnabled: boolean;
}

export interface TenantSettings {
  invoiceSeries: string;
  documentSeries: Partial<Record<DocumentExportType, string>>;
  fiscalYearStartMonth: number;
  vatStatus: 'ENABLED' | 'EXEMPT';
  approvalLimits: {
    quote: number;
    creditNote: number;
    purchase: number;
    stockAdjustment: number;
  };
  featureGates: {
    writeLocked: boolean;
    reason?: string;
    allowedModules: ErpModuleKey[];
  };
  retention: {
    retentionDays: number;
    exportRequestedAt?: string;
    deleteRequestedAt?: string;
    deleteScheduledAt?: string;
  };
}

export interface Tenant {
  id: string;
  slug: string;
  legalEntity: LegalEntity;
  settings: TenantSettings;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  profileApprovalStatus: 'APPROVED' | 'PENDING_REVIEW' | 'REJECTED';
  createdAt: string;
}

export interface ErpUser {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: UserRole;
  password: string;
  passwordHash?: string;
  passwordUpdatedAt?: string;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  active: boolean;
}

export interface AuthSession {
  id: string;
  tenantId: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  createdAt: string;
  expiresAt: string;
  refreshExpiresAt: string;
  revokedAt?: string;
  device: {
    ip?: string;
    userAgent?: string;
    fingerprint: string;
  };
}

export interface PasswordResetToken {
  id: string;
  tenantId: string;
  userId: string;
  token: string;
  requestedAt: string;
  expiresAt: string;
  usedAt?: string;
}

export interface DeviceLoginEvent {
  id: string;
  tenantId: string;
  userId: string;
  email: string;
  ip?: string;
  userAgent?: string;
  fingerprint: string;
  at: string;
  suspicious: boolean;
  reason?: string;
}

export interface SecurityNotification {
  id: string;
  tenantId: string;
  userId: string;
  type: 'SUSPICIOUS_LOGIN' | 'PASSWORD_RESET' | 'TWO_FACTOR_ENABLED';
  message: string;
  at: string;
  read: boolean;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  arabicName?: string;
  ice?: string;
  ifNumber?: string;
  rc?: string;
  email?: string;
  phone?: string;
  address?: string;
  arabicAddress?: string;
  preferredLanguage: PreferredLanguage;
  city?: string;
  paymentTermsDays: number;
  creditLimit: number;
  contacts: Array<{ name: string; role?: string; email?: string; phone?: string }>;
  addresses: Array<{ label: string; line1: string; city: string }>;
  documentExpiries: DocumentExpiry[];
  duplicateWarnings?: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  tenantId: string;
  name: string;
  arabicName?: string;
  ice?: string;
  ifNumber?: string;
  rc?: string;
  email?: string;
  phone?: string;
  address?: string;
  arabicAddress?: string;
  preferredLanguage: PreferredLanguage;
  city?: string;
  paymentTermsDays: number;
  contacts: Array<{ name: string; role?: string; email?: string; phone?: string }>;
  bankDetails: Array<{ bankName: string; rib: string; iban?: string }>;
  duplicateWarnings?: string[];
  preferred: boolean;
  riskNotes?: string;
  documentExpiries: Array<DocumentExpiry & {
    fileName?: string;
    storageKey?: string;
    uploadStatus?: 'PLACEHOLDER' | 'RECEIVED';
    uploadedAt?: string;
  }>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  tenantId: string;
  customerName: string;
  stage: 'NEW' | 'QUALIFIED' | 'PROPOSAL' | 'WON' | 'LOST';
  expectedValue: number;
  owner?: string;
  source?: string;
  nextActionDate?: string;
  convertedCustomerId?: string;
  convertedQuoteId?: string;
  convertedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  tenantId: string;
  sku: string;
  barcode?: string;
  name: string;
  arabicDescription?: string;
  type: 'GOODS' | 'SERVICE' | 'FINISHED_GOOD' | 'RAW_MATERIAL';
  unit: string;
  trackStock: boolean;
  reorderPoint: number;
  salePrice: number;
  purchaseCost: number;
  vatRate: VatRate;
  stockOnHand: number;
  reservedStock: number;
  weightedAverageCost: number;
  duplicateWarnings?: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseStock {
  tenantId: string;
  warehouseId: string;
  productId: string;
  quantity: number;
  reserved: number;
}

export interface Employee {
  id: string;
  tenantId: string;
  employeeNumber: string;
  fullName: string;
  arabicName?: string;
  cin: string;
  cnssNumber?: string;
  contractType: 'CDI' | 'CDD' | 'STAGE' | 'ANAPEC';
  hireDate: string;
  baseSalary: number;
  dependents: number;
  address?: string;
  arabicAddress?: string;
  preferredLanguage: PreferredLanguage;
  documentExpiries: DocumentExpiry[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  tenantId: string;
  name: string;
  city: string;
  address?: string;
  active: boolean;
}

export interface DocumentLineInput {
  productId: string;
  description?: string;
  descriptionAr?: string;
  quantity: number;
  unitPrice?: number;
  vatRate?: VatRate;
}

export interface DocumentLine {
  productId: string;
  sku: string;
  description: string;
  descriptionAr?: string;
  quantity: number;
  unitPrice: number;
  vatRate: VatRate;
  subtotal: number;
  vatAmount: number;
  total: number;
}

export interface DocumentTotals {
  subtotal: number;
  vatByRate: Record<string, number>;
  vatTotal: number;
  total: number;
}

export interface Quote {
  id: string;
  tenantId: string;
  number: string;
  customerId: string;
  status: QuoteStatus;
  revision: number;
  date: string;
  validUntil: string;
  approvedAt?: string;
  approvalStatus: ApprovalStatus;
  lines: DocumentLine[];
  totals: DocumentTotals;
}

export interface SalesOrder {
  id: string;
  tenantId: string;
  number: string;
  customerId: string;
  sourceQuoteId?: string;
  status: SalesOrderStatus;
  date: string;
  lines: DocumentLine[];
  totals: DocumentTotals;
}

export interface DeliveryNote {
  id: string;
  tenantId: string;
  number: string;
  customerId: string;
  sourceOrderId: string;
  status: DeliveryNoteStatus;
  date: string;
  lines: DocumentLine[];
  totals: DocumentTotals;
  routePlan?: {
    city: string;
    region: string;
    zone: string;
    promisedDate: string;
    driver?: string;
    vehicle?: string;
  };
}

export interface Invoice {
  id: string;
  tenantId: string;
  number: string;
  customerId: string;
  status: DocumentStatus;
  date: string;
  dueDate: string;
  sourceQuoteId?: string;
  sourceOrderId?: string;
  sourceDeliveryNoteId?: string;
  lines: DocumentLine[];
  totals: DocumentTotals;
  paidAmount: number;
  compliance: {
    legalMentions: string[];
    validated: boolean;
    adapterStatus: 'READY_FOR_EXPORT' | 'NOT_SUBMITTED' | 'SUBMISSION_PENDING';
  };
}

export interface CreditNote {
  id: string;
  tenantId: string;
  number: string;
  invoiceId: string;
  customerId: string;
  status: 'POSTED' | 'VOID';
  date: string;
  reason: string;
  approvalStatus: ApprovalStatus;
  lines: DocumentLine[];
  totals: DocumentTotals;
}

export interface Payment {
  id: string;
  tenantId: string;
  invoiceId: string;
  amount: number;
  method: 'BANK' | 'CASH' | 'CARD' | 'CHEQUE' | 'MOBILE_MONEY';
  date: string;
}

export interface StockMove {
  id: string;
  tenantId: string;
  productId: string;
  warehouseId: string;
  toWarehouseId?: string;
  type: StockMoveType;
  quantity: number;
  unitCost: number;
  value: number;
  reference: string;
  reasonCode?: string;
  beforeQty?: number;
  afterQty?: number;
  approvalStatus: ApprovalStatus;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  tenantId: string;
  supplierId: string;
  number: string;
  date: string;
  expectedDate?: string;
  status: PurchaseOrderStatus;
  approvalStatus: ApprovalStatus;
  lines: Array<{
    productId: string;
    quantity: number;
    unitCost: number;
    receivedQuantity: number;
    value: number;
  }>;
  total: number;
}

export interface PurchaseReceipt {
  id: string;
  tenantId: string;
  supplierId: string;
  purchaseOrderId?: string;
  number: string;
  date: string;
  warehouseId?: string;
  lines: Array<{ productId: string; quantity: number; unitCost: number; value: number }>;
  total: number;
  approvalStatus: ApprovalStatus;
}

export interface SupplierInvoice {
  id: string;
  tenantId: string;
  supplierId: string;
  purchaseOrderId?: string;
  purchaseReceiptId?: string;
  number: string;
  supplierInvoiceNumber?: string;
  date: string;
  dueDate: string;
  status: SupplierInvoiceStatus;
  subtotal: number;
  vatTotal: number;
  total: number;
  paidAmount: number;
}

export interface ChartAccount {
  id: string;
  tenantId: string;
  account: string;
  labelFr: string;
  labelAr?: string;
  class: string;
  vatDeductible: boolean;
  active: boolean;
}

export interface StockTransfer {
  id: string;
  tenantId: string;
  number: string;
  productId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  status: StockTransferStatus;
  shippedAt: string;
  receivedAt?: string;
}

export interface InventoryCountSheet {
  id: string;
  tenantId: string;
  number: string;
  warehouseId: string;
  status: InventoryCountStatus;
  createdAt: string;
  approvedAt?: string;
  lines: Array<{
    productId: string;
    expectedQuantity: number;
    countedQuantity: number;
    variance: number;
    valueImpact: number;
  }>;
  totalVarianceValue: number;
}

export interface JournalEntry {
  id: string;
  tenantId: string;
  date: string;
  source: string;
  description: string;
  lines: Array<{ account: string; label: string; debit: number; credit: number }>;
  posted: boolean;
  status: 'DRAFT' | 'POSTED' | 'VOID';
}

export interface FiscalPeriod {
  id: string;
  tenantId: string;
  year: number;
  month: number;
  locked: boolean;
  status: FiscalPeriodStatus;
  softLockedAt?: string;
  lockedAt?: string;
  closedAt?: string;
}

export interface EmploymentContract {
  id: string;
  tenantId: string;
  employeeId: string;
  contractType: Employee['contractType'];
  startDate: string;
  endDate?: string;
  salary: number;
  attachmentName?: string;
  active: boolean;
  createdAt: string;
}

export interface Payslip {
  id: string;
  tenantId: string;
  payrollRunId: string;
  employeeId: string;
  employeeName: string;
  period: string;
  grossSalary: number;
  cnssEmployee: number;
  amoEmployee: number;
  ir: number;
  irExplanation?: Array<{ label: string; amount: number | string }>;
  netSalary: number;
  employerCharges: number;
  pdf?: { fileName: string; mimeType: 'application/pdf'; contentBase64: string };
}

export interface PayrollRun {
  id: string;
  tenantId: string;
  number: string;
  year: number;
  month: number;
  period: string;
  status: PayrollRunStatus;
  createdAt: string;
  approvedAt?: string;
  approvalComment?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  postedAt?: string;
  cancelledAt?: string;
  payslips: Payslip[];
  totals: {
    grossSalary: number;
    cnssEmployee: number;
    amoEmployee: number;
    ir: number;
    netSalary: number;
    employerCharges: number;
    employerCost: number;
  };
}

export interface LeaveBalance {
  id: string;
  tenantId: string;
  employeeId: string;
  year: number;
  acquiredDays: number;
  takenDays: number;
  pendingDays: number;
  remainingDays: number;
}

export interface LeaveRequest {
  id: string;
  tenantId: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveRequestStatus;
  reason?: string;
  payrollImpact: number;
  approvedAt?: string;
  rejectedAt?: string;
  createdAt: string;
}

export interface EmployeePortalAccess {
  id: string;
  tenantId: string;
  employeeId: string;
  email: string;
  active: boolean;
  canViewPayslips: boolean;
  canRequestLeave: boolean;
  createdAt: string;
}

export interface LegalEvidence {
  id: string;
  tenantId: string;
  type: 'VAT_REPORT' | 'DGI_ENVELOPE' | 'DAMANCOM_EXPORT' | 'ACCOUNTING_EXPORT' | 'PAYSLIP_PDF' | 'DOCUMENT_PDF';
  reference: string;
  status: 'ARCHIVED';
  checksum: string;
  archivedAt: string;
  metadata: Record<string, unknown>;
}

export interface StoredFile {
  id: string;
  tenantId: string;
  key: string;
  fileName: string;
  mimeType: string;
  size: number;
  checksum: string;
  provider: 'LOCAL_DEV' | 'OBJECT_STORAGE_ADAPTER';
  status: 'STORED' | 'PENDING_REMOTE';
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface DocumentTemplateSetting {
  id: string;
  tenantId: string;
  type: DocumentExportType;
  name: string;
  language: PreferredLanguage;
  logoKey?: string;
  legalFooter: string;
  fields: string[];
  active: boolean;
  updatedAt: string;
}

export interface PartnerApiKey {
  id: string;
  tenantId: string;
  name: string;
  tokenHash: string;
  tokenPreview: string;
  scopes: string[];
  active: boolean;
  expiresAt?: string;
  createdAt: string;
  lastUsedAt?: string;
}

export interface WebhookEvent {
  id: string;
  tenantId: string;
  event: 'invoice.posted' | 'payment.received' | 'payroll.posted' | 'stock.low';
  payload: Record<string, unknown>;
  status: 'PENDING' | 'DELIVERED' | 'FAILED';
  attempts: number;
  signaturePreview: string;
  createdAt: string;
  deliveredAt?: string;
}

export interface EmailDelivery {
  id: string;
  tenantId: string;
  type: 'INVOICE' | 'STATEMENT' | 'PAYSLIP' | 'REMINDER';
  to: string;
  subject: string;
  attachmentName?: string;
  status: 'QUEUED' | 'SENT' | 'FAILED';
  createdAt: string;
  sentAt?: string;
}

export interface AdapterSubmission {
  id: string;
  tenantId: string;
  kind: AdapterKind;
  operation: 'validate' | 'render' | 'submit' | 'poll' | 'archive';
  reference: string;
  status: 'VALID' | 'RENDERED' | 'QUEUED' | 'PENDING_CREDENTIALS' | 'ARCHIVED';
  payload: Record<string, unknown>;
  evidenceId?: string;
  createdAt: string;
}

export interface ChequeTracking {
  id: string;
  tenantId: string;
  invoiceId?: string;
  number: string;
  bank: string;
  drawer: string;
  dueDate: string;
  amount: number;
  status: ChequeStatus;
  depositBatchId?: string;
  createdAt: string;
}

export interface DepositBatch {
  id: string;
  tenantId: string;
  number: string;
  type: 'CASH' | 'CHEQUE' | 'MIXED';
  bankAccount: string;
  status: DepositBatchStatus;
  cashAmount: number;
  chequeIds: string[];
  total: number;
  createdAt: string;
  depositedAt?: string;
}

export interface CashboxTransfer {
  id: string;
  tenantId: string;
  fromSessionId: string;
  toTreasuryAccount: string;
  amount: number;
  status: 'RECORDED';
  createdAt: string;
}

export interface PurchaseRequest {
  id: string;
  tenantId: string;
  requester: string;
  department: string;
  supplierId?: string;
  status: 'REQUESTED' | 'APPROVED' | 'CONVERTED' | 'REJECTED';
  lines: Array<{ productId: string; quantity: number; estimatedUnitCost: number }>;
  total: number;
  reason?: string;
  createdAt: string;
  approvedAt?: string;
  purchaseOrderId?: string;
}

export interface SupplierQuoteComparison {
  id: string;
  tenantId: string;
  purchaseRequestId: string;
  supplierId: string;
  price: number;
  delayDays: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  preferred: boolean;
  score: number;
}

export interface PayrollExportArchive {
  id: string;
  tenantId: string;
  runId: string;
  period: string;
  type: 'DAMANCOM';
  generatedBy: string;
  generatedAt: string;
  checksum: string;
  fileName: string;
}

export interface TraceabilityLot {
  id: string;
  tenantId: string;
  productId: string;
  lotNumber?: string;
  serialNumber?: string;
  quantity: number;
  expiryDate?: string;
  warehouseId: string;
  status: 'ACTIVE' | 'QUARANTINED' | 'CONSUMED';
  createdAt: string;
}

export interface UserInvitation {
  id: string;
  tenantId: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  expiresAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED';
  createdAt: string;
}

export interface KpiTarget {
  id: string;
  tenantId: string;
  module: ErpModuleKey;
  owner: string;
  metric: string;
  target: number;
  actual: number;
  period: string;
}

export interface WebhookRetryLog {
  id: string;
  tenantId: string;
  webhookEventId: string;
  attempt: number;
  status: 'SCHEDULED' | 'DELIVERED' | 'FAILED';
  nextRetryAt?: string;
  signedPayloadPreview: string;
  createdAt: string;
}

export interface StructuredLogEntry {
  id: string;
  tenantId: string;
  requestId: string;
  userId?: string;
  module: string;
  action: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  at: string;
  metadata: Record<string, unknown>;
}

export interface MetricSample {
  id: string;
  tenantId: string;
  name: 'api_latency_ms' | 'api_error_total' | 'job_failure_total' | 'queue_depth';
  value: number;
  module: string;
  labels: Record<string, string>;
  capturedAt: string;
}

export interface BackgroundJob {
  id: string;
  tenantId: string;
  kind: BackgroundJobKind;
  queue: string;
  reference: string;
  status: BackgroundJobStatus;
  attempts: number;
  payload: Record<string, unknown>;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  error?: string;
}

export interface FeatureFlag {
  id: string;
  tenantId: string;
  key: ErpModuleKey;
  enabled: boolean;
  rollout: 'OFF' | 'TENANT' | 'GLOBAL';
  reason: string;
  updatedAt: string;
  updatedBy: string;
}

export interface PosTransaction {
  id: string;
  tenantId: string;
  number: string;
  sessionId?: string;
  cashierId: string;
  date: string;
  lines: DocumentLine[];
  totals: DocumentTotals;
  paymentMethod: 'CASH' | 'CARD' | 'BANK';
  refundedTransactionId?: string;
}

export interface PosSession {
  id: string;
  tenantId: string;
  number: string;
  cashierId: string;
  openedAt: string;
  closedAt?: string;
  status: PosSessionStatus;
  openingCash: number;
  expectedCash: number;
  countedCash?: number;
  variance: number;
}

export interface CashDrawerMovement {
  id: string;
  tenantId: string;
  sessionId: string;
  type: 'CASH_IN' | 'CASH_OUT' | 'EXPENSE';
  amount: number;
  reason: string;
  createdAt: string;
}

export interface PosOfflineQueueItem {
  id: string;
  tenantId: string;
  payload: Record<string, unknown>;
  status: PosOfflineQueueStatus;
  conflictReason?: string;
  syncedTransactionId?: string;
  createdAt: string;
  syncedAt?: string;
}

export interface ProductionOrder {
  id: string;
  tenantId: string;
  number: string;
  billOfMaterialId?: string;
  finishedProductId: string;
  quantity: number;
  status: 'PLANNED' | 'COMPLETED';
  consumedValue: number;
  outputValue?: number;
  createdAt: string;
}

export interface BillOfMaterial {
  id: string;
  tenantId: string;
  finishedProductId: string;
  version: string;
  components: Array<{ productId: string; quantity: number; unitCost: number }>;
  active: boolean;
  createdAt: string;
}

export interface MaintenanceAsset {
  id: string;
  tenantId: string;
  name: string;
  category: string;
  location?: string;
  active: boolean;
  createdAt: string;
}

export interface MaintenanceWorkOrder {
  id: string;
  tenantId: string;
  assetId: string;
  technician: string;
  status: WorkOrderStatus;
  cost: number;
  description: string;
  createdAt: string;
  completedAt?: string;
}

export interface FleetVehicle {
  id: string;
  tenantId: string;
  plate: string;
  driver?: string;
  documentExpiry?: string;
  active: boolean;
}

export interface FleetLog {
  id: string;
  tenantId: string;
  vehicleId: string;
  type: 'FUEL' | 'MAINTENANCE';
  amount: number;
  odometer?: number;
  date: string;
}

export interface ProjectRecord {
  id: string;
  tenantId: string;
  customerId: string;
  name: string;
  budget: number;
  status: ProjectStatus;
  tasks: Array<{ title: string; status: 'OPEN' | 'DONE' }>;
  expenses: Array<{ label: string; amount: number }>;
  timesheets: Array<{ employeeId: string; hours: number; costRate: number }>;
  invoiceMilestones: Array<{ label: string; amount: number; invoiced: boolean }>;
  createdAt: string;
}

export interface ComplianceRuleSet {
  id: string;
  jurisdiction: 'MA';
  effectiveFrom: string;
  vatRates: VatRate[];
  invoiceMentions: string[];
  irBrackets: Array<{ upperBound: number; rate: number; deduction: number }>;
  cnss: {
    cap: number;
    employeeRate: number;
    employerRate: number;
    amoEmployeeRate: number;
    amoEmployerRate: number;
    familyAllocationRate: number;
    vocationalTrainingRate: number;
  };
}

export interface AuditLog {
  id: string;
  tenantId: string;
  action: string;
  entity: string;
  entityId: string;
  at: string;
  payload: unknown;
}

export interface CompanyProfileChange {
  id: string;
  tenantId: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  approvedAt?: string;
  reviewer?: string;
  before: {
    legalEntity: LegalEntity;
    settings: TenantSettings;
  };
  after: {
    legalEntity: LegalEntity;
    settings: TenantSettings;
  };
}

export interface InternalNote {
  id: string;
  tenantId: string;
  entityType: CollaborationEntityType;
  entityId: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface InternalTask {
  id: string;
  tenantId: string;
  entityType: CollaborationEntityType;
  entityId: string;
  title: string;
  assignedTo: string;
  dueDate?: string;
  status: InternalTaskStatus;
  createdAt: string;
  closedAt?: string;
}

export interface TenantWorkspace {
  tenant: Tenant;
  users: ErpUser[];
  sessions: AuthSession[];
  passwordResetTokens: PasswordResetToken[];
  deviceLoginEvents: DeviceLoginEvent[];
  securityNotifications: SecurityNotification[];
  customers: Customer[];
  suppliers: Supplier[];
  employees: Employee[];
  leads: Lead[];
  products: Product[];
  warehouses: Warehouse[];
  warehouseStocks: WarehouseStock[];
  chartOfAccounts: ChartAccount[];
  quotes: Quote[];
  salesOrders: SalesOrder[];
  deliveryNotes: DeliveryNote[];
  invoices: Invoice[];
  creditNotes: CreditNote[];
  payments: Payment[];
  purchaseOrders: PurchaseOrder[];
  stockMoves: StockMove[];
  purchaseReceipts: PurchaseReceipt[];
  supplierInvoices: SupplierInvoice[];
  stockTransfers: StockTransfer[];
  inventoryCounts: InventoryCountSheet[];
  journalEntries: JournalEntry[];
  fiscalPeriods: FiscalPeriod[];
  employmentContracts: EmploymentContract[];
  payrollRuns: PayrollRun[];
  leaveBalances: LeaveBalance[];
  leaveRequests: LeaveRequest[];
  employeePortalAccesses: EmployeePortalAccess[];
  legalEvidences: LegalEvidence[];
  storedFiles: StoredFile[];
  documentTemplates: DocumentTemplateSetting[];
  partnerApiKeys: PartnerApiKey[];
  webhookEvents: WebhookEvent[];
  emailDeliveries: EmailDelivery[];
  adapterSubmissions: AdapterSubmission[];
  cheques: ChequeTracking[];
  depositBatches: DepositBatch[];
  cashboxTransfers: CashboxTransfer[];
  purchaseRequests: PurchaseRequest[];
  supplierQuoteComparisons: SupplierQuoteComparison[];
  payrollExportArchives: PayrollExportArchive[];
  traceabilityLots: TraceabilityLot[];
  userInvitations: UserInvitation[];
  kpiTargets: KpiTarget[];
  webhookRetryLogs: WebhookRetryLog[];
  structuredLogs: StructuredLogEntry[];
  metricSamples: MetricSample[];
  backgroundJobs: BackgroundJob[];
  featureFlags: FeatureFlag[];
  posSessions: PosSession[];
  cashDrawerMovements: CashDrawerMovement[];
  posOfflineQueue: PosOfflineQueueItem[];
  posTransactions: PosTransaction[];
  billsOfMaterial: BillOfMaterial[];
  productionOrders: ProductionOrder[];
  maintenanceAssets: MaintenanceAsset[];
  maintenanceWorkOrders: MaintenanceWorkOrder[];
  fleetVehicles: FleetVehicle[];
  fleetLogs: FleetLog[];
  projects: ProjectRecord[];
  auditLogs: AuditLog[];
  profileChanges: CompanyProfileChange[];
  internalNotes: InternalNote[];
  internalTasks: InternalTask[];
  sequences: Record<string, number>;
}
