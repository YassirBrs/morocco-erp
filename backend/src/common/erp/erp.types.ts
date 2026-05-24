export type SubscriptionPlan = 'INTILAQ' | 'NUMOW' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
export type UserRole = 'OWNER' | 'ADMIN' | 'ACCOUNTANT' | 'SALES' | 'WAREHOUSE' | 'PAYROLL' | 'CASHIER';
export type VatRate = 0 | 0.07 | 0.1 | 0.14 | 0.2;
export type DocumentStatus = 'DRAFT' | 'POSTED' | 'PAID' | 'VOID';
export type QuoteStatus = 'DRAFT' | 'APPROVED' | 'CONVERTED' | 'VOID';
export type SalesOrderStatus = 'CONFIRMED' | 'DELIVERED' | 'INVOICED' | 'CANCELLED';
export type DeliveryNoteStatus = 'POSTED' | 'CANCELLED';
export type StockMoveType = 'RECEIPT' | 'DELIVERY' | 'DELIVERY_REVERSAL' | 'ADJUSTMENT' | 'PRODUCTION_CONSUME' | 'PRODUCTION_OUTPUT' | 'POS_SALE' | 'RESERVATION' | 'RESERVATION_RELEASE';
export type BusinessSearchType = 'customers' | 'leads' | 'suppliers' | 'products' | 'invoices' | 'orders';

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
  fiscalYearStartMonth: number;
  vatStatus: 'ENABLED' | 'EXEMPT';
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
  active: boolean;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  ice?: string;
  ifNumber?: string;
  rc?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  paymentTermsDays: number;
  creditLimit: number;
  contacts: Array<{ name: string; role?: string; email?: string; phone?: string }>;
  addresses: Array<{ label: string; line1: string; city: string }>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  tenantId: string;
  name: string;
  ice?: string;
  ifNumber?: string;
  rc?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  paymentTermsDays: number;
  contacts: Array<{ name: string; role?: string; email?: string; phone?: string }>;
  bankDetails: Array<{ bankName: string; rib: string; iban?: string }>;
  duplicateWarnings?: string[];
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
  name: string;
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
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  tenantId: string;
  name: string;
  city: string;
}

export interface DocumentLineInput {
  productId: string;
  description?: string;
  quantity: number;
  unitPrice?: number;
  vatRate?: VatRate;
}

export interface DocumentLine {
  productId: string;
  sku: string;
  description: string;
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
  lines: DocumentLine[];
  totals: DocumentTotals;
}

export interface Payment {
  id: string;
  tenantId: string;
  invoiceId: string;
  amount: number;
  method: 'BANK' | 'CASH' | 'CARD' | 'CHEQUE';
  date: string;
}

export interface StockMove {
  id: string;
  tenantId: string;
  productId: string;
  warehouseId: string;
  type: StockMoveType;
  quantity: number;
  unitCost: number;
  value: number;
  reference: string;
  createdAt: string;
}

export interface PurchaseReceipt {
  id: string;
  tenantId: string;
  supplierId: string;
  number: string;
  date: string;
  lines: Array<{ productId: string; quantity: number; unitCost: number; value: number }>;
  total: number;
}

export interface JournalEntry {
  id: string;
  tenantId: string;
  date: string;
  source: string;
  description: string;
  lines: Array<{ account: string; label: string; debit: number; credit: number }>;
  posted: boolean;
}

export interface FiscalPeriod {
  id: string;
  tenantId: string;
  year: number;
  month: number;
  locked: boolean;
}

export interface PosTransaction {
  id: string;
  tenantId: string;
  number: string;
  cashierId: string;
  date: string;
  lines: DocumentLine[];
  totals: DocumentTotals;
  paymentMethod: 'CASH' | 'CARD';
}

export interface ProductionOrder {
  id: string;
  tenantId: string;
  number: string;
  finishedProductId: string;
  quantity: number;
  status: 'PLANNED' | 'COMPLETED';
  consumedValue: number;
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

export interface TenantWorkspace {
  tenant: Tenant;
  users: ErpUser[];
  customers: Customer[];
  suppliers: Supplier[];
  leads: Lead[];
  products: Product[];
  warehouses: Warehouse[];
  quotes: Quote[];
  salesOrders: SalesOrder[];
  deliveryNotes: DeliveryNote[];
  invoices: Invoice[];
  creditNotes: CreditNote[];
  payments: Payment[];
  stockMoves: StockMove[];
  purchaseReceipts: PurchaseReceipt[];
  journalEntries: JournalEntry[];
  fiscalPeriods: FiscalPeriod[];
  posTransactions: PosTransaction[];
  productionOrders: ProductionOrder[];
  auditLogs: AuditLog[];
  profileChanges: CompanyProfileChange[];
  sequences: Record<string, number>;
}
