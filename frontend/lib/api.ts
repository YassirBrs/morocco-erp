const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID ?? 'tenant-demo';

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
