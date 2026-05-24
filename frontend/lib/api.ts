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
