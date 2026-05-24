import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import {
  AuditLog,
  ComplianceRuleSet,
  Customer,
  DocumentLine,
  DocumentLineInput,
  DocumentTotals,
  ErpUser,
  FiscalPeriod,
  Invoice,
  JournalEntry,
  Lead,
  LegalEntity,
  Payment,
  PosTransaction,
  Product,
  ProductionOrder,
  PurchaseReceipt,
  Quote,
  StockMove,
  Supplier,
  Tenant,
  TenantWorkspace,
  VatRate,
  Warehouse,
} from './erp.types';

const r2 = (value: number): number => Math.round(value * 100) / 100;
const today = (): string => new Date().toISOString().slice(0, 10);
const allowedVatRates: VatRate[] = [0, 0.07, 0.1, 0.14, 0.2];

@Injectable()
export class ErpStoreService {
  private workspaces = new Map<string, TenantWorkspace>();

  readonly morocco2026Rules: ComplianceRuleSet = {
    id: 'MA-2026',
    jurisdiction: 'MA',
    effectiveFrom: '2026-01-01',
    vatRates: [0, 0.07, 0.1, 0.14, 0.2],
    invoiceMentions: [
      'Identifiant Commun de l Entreprise (ICE)',
      'Identifiant Fiscal (IF)',
      'Registre de Commerce (RC)',
      'Taxe Professionnelle / Patente',
      'Numero sequentiel de facture',
      'Taux et montant de TVA ou mention exoneree',
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
        fiscalYearStartMonth: 1,
        vatStatus: 'ENABLED',
      },
      plan: 'ENTERPRISE',
      status: 'ACTIVE',
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
          active: true,
        },
        {
          id: 'usr-accountant',
          tenantId: tenant.id,
          email: 'accountant@atlas.ma',
          name: 'Cabinet Fiduciaire Casa',
          role: 'ACCOUNTANT',
          password: 'demo1234',
          active: true,
        },
      ],
      customers: [
        {
          id: 'cus-1',
          tenantId: tenant.id,
          name: 'Rabat Retail SARL',
          ice: '001111222333444',
          ifNumber: '778899',
          rc: 'RABAT-112233',
          email: 'finance@rabretail.ma',
          phone: '+212522000000',
          address: 'Avenue Mohammed V, Rabat',
          city: 'Rabat',
          paymentTermsDays: 30,
          creditLimit: 100000,
          contacts: [{ name: 'Youssef Amrani', role: 'Finance', email: 'finance@rabretail.ma', phone: '+212522000000' }],
          addresses: [{ label: 'Siege', line1: 'Avenue Mohammed V', city: 'Rabat' }],
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
          ice: '009998887776665',
          email: 'sales@casa-import.ma',
          phone: '+212522111111',
          address: 'Zone industrielle Ain Sebaa',
          createdAt: today(),
        },
      ],
      leads: [],
      products: [
        {
          id: 'prd-1',
          tenantId: tenant.id,
          sku: 'SKU-CHAIR',
          name: 'Chaise bureau',
          type: 'GOODS',
          unit: 'unite',
          trackStock: true,
          reorderPoint: 10,
          salePrice: 850,
          purchaseCost: 520,
          vatRate: 0.2,
          stockOnHand: 50,
          weightedAverageCost: 520,
          active: true,
          createdAt: today(),
          updatedAt: today(),
        },
        {
          id: 'prd-2',
          tenantId: tenant.id,
          sku: 'SVC-INSTALL',
          name: 'Installation sur site',
          type: 'SERVICE',
          unit: 'forfait',
          trackStock: false,
          reorderPoint: 0,
          salePrice: 1200,
          purchaseCost: 0,
          vatRate: 0.2,
          stockOnHand: 0,
          weightedAverageCost: 0,
          active: true,
          createdAt: today(),
          updatedAt: today(),
        },
        {
          id: 'prd-raw',
          tenantId: tenant.id,
          sku: 'RAW-BOIS',
          name: 'Bois traite',
          type: 'RAW_MATERIAL',
          unit: 'm',
          trackStock: true,
          reorderPoint: 40,
          salePrice: 0,
          purchaseCost: 90,
          vatRate: 0.2,
          stockOnHand: 200,
          weightedAverageCost: 90,
          active: true,
          createdAt: today(),
          updatedAt: today(),
        },
        {
          id: 'prd-fg',
          tenantId: tenant.id,
          sku: 'FG-TABLE',
          name: 'Table assemblee',
          type: 'FINISHED_GOOD',
          unit: 'unite',
          trackStock: true,
          reorderPoint: 4,
          salePrice: 1400,
          purchaseCost: 300,
          vatRate: 0.2,
          stockOnHand: 8,
          weightedAverageCost: 300,
          active: true,
          createdAt: today(),
          updatedAt: today(),
        },
      ],
      warehouses: [{ id: 'wh-1', tenantId: tenant.id, name: 'Depot Casablanca', city: 'Casablanca' }],
      quotes: [],
      invoices: [],
      payments: [],
      stockMoves: [],
      purchaseReceipts: [],
      journalEntries: [],
      fiscalPeriods: [],
      posTransactions: [],
      productionOrders: [],
      auditLogs: [],
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
        fiscalYearStartMonth: 1,
        vatStatus: input.vatEnabled === false ? 'EXEMPT' : 'ENABLED',
      },
      plan: input.plan ?? 'INTILAQ',
      status: 'ACTIVE',
      createdAt: today(),
    };

    this.workspaces.set(tenantId, {
      tenant,
      users: [],
      customers: [],
      suppliers: [],
      leads: [],
      products: [],
      warehouses: [{ id: this.id('wh'), tenantId, name: 'Depot principal', city: tenant.legalEntity.city }],
      quotes: [],
      invoices: [],
      payments: [],
      stockMoves: [],
      purchaseReceipts: [],
      journalEntries: [],
      fiscalPeriods: [],
      posTransactions: [],
      productionOrders: [],
      auditLogs: [],
      sequences: {},
    });

    return tenant;
  }

  authenticate(email: string, password: string): Omit<ErpUser, 'password'> & { tenant: Tenant } {
    for (const workspace of this.workspaces.values()) {
      const user = workspace.users.find((candidate) => candidate.email === email && candidate.password === password);
      if (user && user.active) {
        const { password: _password, ...safeUser } = user;
        return { ...safeUser, tenant: workspace.tenant };
      }
    }
    throw new ForbiddenException('Invalid credentials');
  }

  summary(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const revenue = r2(workspace.invoices.reduce((sum, invoice) => sum + invoice.totals.total, 0));
    const receivables = r2(workspace.invoices.reduce((sum, invoice) => sum + invoice.totals.total - invoice.paidAmount, 0));
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

  setupChecklist(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const entity = workspace.tenant.legalEntity;
    const settings = workspace.tenant.settings;
    const checks = [
      {
        id: 'legal-identity',
        label: 'Identite legale complete',
        complete: Boolean(entity.tradeName && entity.ice && entity.ifNumber && entity.rc && entity.patente && entity.address && entity.city),
      },
      {
        id: 'tax-settings',
        label: 'TVA et serie de facturation configurees',
        complete: Boolean(settings.invoiceSeries && settings.fiscalYearStartMonth >= 1 && settings.fiscalYearStartMonth <= 12 && settings.vatStatus),
      },
      {
        id: 'payroll-identity',
        label: 'Numero CNSS employeur renseigne',
        complete: Boolean(entity.cnssNumber),
      },
      {
        id: 'customers',
        label: 'Au moins un client cree',
        complete: workspace.customers.some((customer) => customer.active),
      },
      {
        id: 'catalog',
        label: 'Catalogue articles/services pret',
        complete: workspace.products.some((product) => product.active),
      },
      {
        id: 'warehouse',
        label: 'Depot principal configure',
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
      tradeName: this.nonEmpty(input.tradeName ?? entity.tradeName, 'Trade name is required'),
      ice: this.nonEmpty(input.ice ?? entity.ice, 'ICE is required'),
      ifNumber: this.nonEmpty(input.ifNumber ?? entity.ifNumber, 'IF is required'),
      rc: this.nonEmpty(input.rc ?? entity.rc, 'RC is required'),
      patente: this.nonEmpty(input.patente ?? entity.patente, 'Patente is required'),
      cnssNumber: this.nonEmpty(input.cnssNumber ?? entity.cnssNumber, 'CNSS number is required'),
      address: this.nonEmpty(input.address ?? entity.address, 'Legal address is required'),
      city: this.nonEmpty(input.city ?? entity.city, 'Fiscal city is required'),
      country: 'MA',
      vatEnabled: input.vatEnabled ?? entity.vatEnabled,
    };

    workspace.tenant.settings = {
      ...workspace.tenant.settings,
      invoiceSeries: this.nonEmpty(input.invoiceSeries ?? workspace.tenant.settings.invoiceSeries, 'Invoice series is required').toUpperCase(),
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
    const customer: Customer = {
      id: this.id('cus'),
      tenantId: workspace.tenant.id,
      name: this.nonEmpty(input.name, 'Customer name is required'),
      ice: this.clean(input.ice),
      ifNumber: this.clean(input.ifNumber),
      rc: this.clean(input.rc),
      email: this.clean(input.email),
      phone: this.clean(input.phone),
      address: this.clean(input.address),
      city: this.clean(input.city),
      paymentTermsDays: this.nonNegative(input.paymentTermsDays ?? 30, 'Payment terms must be zero or positive'),
      creditLimit: this.nonNegative(input.creditLimit ?? 0, 'Credit limit must be zero or positive'),
      contacts: input.contacts ?? [],
      addresses: input.addresses ?? [],
      active: input.active ?? true,
      createdAt: today(),
      updatedAt: today(),
    };
    this.validateContacts(customer.contacts);
    this.validateAddresses(customer.addresses);
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
    const customer = this.customer(workspace, customerId);
    if (input.name !== undefined) {
      customer.name = this.nonEmpty(input.name, 'Customer name is required');
    }
    if (input.ice !== undefined) customer.ice = this.clean(input.ice);
    if (input.ifNumber !== undefined) customer.ifNumber = this.clean(input.ifNumber);
    if (input.rc !== undefined) customer.rc = this.clean(input.rc);
    if (input.email !== undefined) customer.email = this.clean(input.email);
    if (input.phone !== undefined) customer.phone = this.clean(input.phone);
    if (input.address !== undefined) customer.address = this.clean(input.address);
    if (input.city !== undefined) customer.city = this.clean(input.city);
    if (input.paymentTermsDays !== undefined) {
      customer.paymentTermsDays = this.nonNegative(input.paymentTermsDays, 'Payment terms must be zero or positive');
    }
    if (input.creditLimit !== undefined) {
      customer.creditLimit = this.nonNegative(input.creditLimit, 'Credit limit must be zero or positive');
    }
    if (input.contacts !== undefined) {
      this.validateContacts(input.contacts);
      customer.contacts = input.contacts;
    }
    if (input.addresses !== undefined) {
      this.validateAddresses(input.addresses);
      customer.addresses = input.addresses;
    }
    if (input.active !== undefined) customer.active = input.active;
    customer.updatedAt = today();
    this.audit(workspace, 'customer.updated', 'Customer', customer.id, customer);
    return customer;
  }

  archiveCustomer(customerId: string, tenantId?: string): Customer {
    const workspace = this.workspace(tenantId);
    const customer = this.customer(workspace, customerId);
    customer.active = false;
    customer.updatedAt = today();
    this.audit(workspace, 'customer.archived', 'Customer', customer.id, customer);
    return customer;
  }

  addSupplier(input: Partial<Supplier> & { name: string }, tenantId?: string): Supplier {
    const workspace = this.workspace(tenantId);
    const supplier: Supplier = {
      id: this.id('sup'),
      tenantId: workspace.tenant.id,
      name: input.name,
      ice: input.ice,
      email: input.email,
      phone: input.phone,
      address: input.address,
      createdAt: today(),
    };
    workspace.suppliers.push(supplier);
    this.audit(workspace, 'supplier.created', 'Supplier', supplier.id, supplier);
    return supplier;
  }

  listSuppliers(tenantId?: string): Supplier[] {
    return this.workspace(tenantId).suppliers;
  }

  addLead(input: Partial<Lead> & { customerName: string; value?: number }, tenantId?: string): Lead {
    const workspace = this.workspace(tenantId);
    const lead: Lead = {
      id: this.id('lead'),
      tenantId: workspace.tenant.id,
      customerName: input.customerName,
      stage: input.stage ?? 'NEW',
      value: input.value ?? 0,
      owner: input.owner,
      createdAt: today(),
    };
    workspace.leads.push(lead);
    this.audit(workspace, 'lead.created', 'Lead', lead.id, lead);
    return lead;
  }

  listLeads(tenantId?: string): Lead[] {
    return this.workspace(tenantId).leads;
  }

  addProduct(input: Partial<Product> & { sku: string; name: string; salePrice: number }, tenantId?: string): Product {
    const workspace = this.workspace(tenantId);
    const sku = this.nonEmpty(input.sku, 'SKU is required').toUpperCase();
    if (workspace.products.some((candidate) => candidate.sku.toUpperCase() === sku)) {
      throw new BadRequestException('Product SKU already exists');
    }
    const cost = this.nonNegative(input.purchaseCost ?? 0, 'Purchase cost must be zero or positive');
    const type = input.type ?? 'GOODS';
    const trackStock = type === 'SERVICE' ? false : input.trackStock ?? true;
    const stockOnHand = trackStock ? this.nonNegative(input.stockOnHand ?? 0, 'Stock on hand must be zero or positive') : 0;
    const product: Product = {
      id: this.id('prd'),
      tenantId: workspace.tenant.id,
      sku,
      name: this.nonEmpty(input.name, 'Product name is required'),
      type,
      unit: this.nonEmpty(input.unit ?? (type === 'SERVICE' ? 'forfait' : 'unite'), 'Product unit is required'),
      trackStock,
      reorderPoint: this.nonNegative(input.reorderPoint ?? 0, 'Reorder point must be zero or positive'),
      salePrice: this.nonNegative(input.salePrice, 'Sale price must be zero or positive'),
      purchaseCost: cost,
      vatRate: this.vatRate(input.vatRate ?? 0.2),
      stockOnHand,
      weightedAverageCost: trackStock ? this.nonNegative(input.weightedAverageCost ?? cost, 'CUMP must be zero or positive') : 0,
      active: input.active ?? true,
      createdAt: today(),
      updatedAt: today(),
    };
    workspace.products.push(product);
    this.audit(workspace, 'product.created', 'Product', product.id, product);
    return product;
  }

  listProducts(tenantId?: string): Product[] {
    return this.workspace(tenantId).products;
  }

  getProduct(productId: string, tenantId?: string): Product {
    return this.product(this.workspace(tenantId), productId);
  }

  updateProduct(productId: string, input: Partial<Product>, tenantId?: string): Product {
    const workspace = this.workspace(tenantId);
    const product = this.product(workspace, productId);
    if (input.sku !== undefined) {
      const sku = this.nonEmpty(input.sku, 'SKU is required').toUpperCase();
      if (workspace.products.some((candidate) => candidate.id !== product.id && candidate.sku.toUpperCase() === sku)) {
        throw new BadRequestException('Product SKU already exists');
      }
      product.sku = sku;
    }
    if (input.name !== undefined) product.name = this.nonEmpty(input.name, 'Product name is required');
    if (input.type !== undefined) product.type = input.type;
    if (input.unit !== undefined) product.unit = this.nonEmpty(input.unit, 'Product unit is required');
    if (input.trackStock !== undefined) product.trackStock = input.trackStock;
    if (input.reorderPoint !== undefined) product.reorderPoint = this.nonNegative(input.reorderPoint, 'Reorder point must be zero or positive');
    if (input.salePrice !== undefined) product.salePrice = this.nonNegative(input.salePrice, 'Sale price must be zero or positive');
    if (input.purchaseCost !== undefined) product.purchaseCost = this.nonNegative(input.purchaseCost, 'Purchase cost must be zero or positive');
    if (input.vatRate !== undefined) product.vatRate = this.vatRate(input.vatRate);
    if (input.stockOnHand !== undefined) {
      product.stockOnHand = product.trackStock ? this.nonNegative(input.stockOnHand, 'Stock on hand must be zero or positive') : 0;
    }
    if (input.weightedAverageCost !== undefined) {
      product.weightedAverageCost = product.trackStock ? this.nonNegative(input.weightedAverageCost, 'CUMP must be zero or positive') : 0;
    }
    if (!product.trackStock || product.type === 'SERVICE') {
      product.stockOnHand = 0;
      product.weightedAverageCost = 0;
    }
    if (input.active !== undefined) product.active = input.active;
    product.updatedAt = today();
    this.audit(workspace, 'product.updated', 'Product', product.id, product);
    return product;
  }

  archiveProduct(productId: string, tenantId?: string): Product {
    const workspace = this.workspace(tenantId);
    const product = this.product(workspace, productId);
    product.active = false;
    product.updatedAt = today();
    this.audit(workspace, 'product.archived', 'Product', product.id, product);
    return product;
  }

  listWarehouses(tenantId?: string): Warehouse[] {
    return this.workspace(tenantId).warehouses;
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
      weightedAverageCost: product.weightedAverageCost,
      stockValue: r2(product.stockOnHand * product.weightedAverageCost),
    }));
  }

  adjustStock(productId: string, quantity: number, reason = 'Manual adjustment', tenantId?: string): StockMove {
    const workspace = this.workspace(tenantId);
    const product = this.product(workspace, productId);
    if (!product.trackStock) {
      throw new BadRequestException('Product does not track stock');
    }
    product.stockOnHand = r2(product.stockOnHand + quantity);
    if (product.stockOnHand < 0) {
      throw new BadRequestException('Stock cannot become negative');
    }
    const move = this.stockMove(workspace, product, quantity, product.weightedAverageCost, 'ADJUSTMENT', reason);
    this.audit(workspace, 'stock.adjusted', 'StockMove', move.id, move);
    return move;
  }

  createPurchaseReceipt(input: { supplierId: string; lines: Array<{ productId: string; quantity: number; unitCost: number }> }, tenantId?: string): PurchaseReceipt {
    const workspace = this.workspace(tenantId);
    this.supplier(workspace, input.supplierId);
    const number = this.nextNumber(workspace, 'BR');
    let total = 0;
    const lines = input.lines.map((line) => {
      if (line.quantity <= 0 || line.unitCost < 0) {
        throw new BadRequestException('Invalid purchase receipt line');
      }
      const product = this.product(workspace, line.productId);
      if (!product.trackStock) {
        throw new BadRequestException('Purchase receipt requires a stock-tracked product');
      }
      const oldValue = product.stockOnHand * product.weightedAverageCost;
      const newValue = line.quantity * line.unitCost;
      product.stockOnHand = r2(product.stockOnHand + line.quantity);
      product.weightedAverageCost = product.stockOnHand > 0 ? r2((oldValue + newValue) / product.stockOnHand) : line.unitCost;
      product.purchaseCost = line.unitCost;
      this.stockMove(workspace, product, line.quantity, line.unitCost, 'RECEIPT', number);
      total += newValue;
      return { ...line, value: r2(newValue) };
    });
    const receipt: PurchaseReceipt = {
      id: this.id('br'),
      tenantId: workspace.tenant.id,
      supplierId: input.supplierId,
      number,
      date: today(),
      lines,
      total: r2(total),
    };
    workspace.purchaseReceipts.push(receipt);
    this.postJournal(workspace, `Purchase receipt ${number}`, number, [
      { account: '3111', label: 'Marchandises au magasin', debit: receipt.total, credit: 0 },
      { account: '4411', label: 'Fournisseurs', debit: 0, credit: receipt.total },
    ]);
    this.audit(workspace, 'purchase.received', 'PurchaseReceipt', receipt.id, receipt);
    return receipt;
  }

  createQuote(input: { customerId: string; lines: DocumentLineInput[]; validUntil?: string }, tenantId?: string): Quote {
    const workspace = this.workspace(tenantId);
    this.customer(workspace, input.customerId);
    const lines = this.documentLines(workspace, input.lines);
    const quote: Quote = {
      id: this.id('quo'),
      tenantId: workspace.tenant.id,
      number: this.nextNumber(workspace, 'DV'),
      customerId: input.customerId,
      status: 'DRAFT',
      date: today(),
      validUntil: input.validUntil ?? today(),
      lines,
      totals: this.totals(lines),
    };
    workspace.quotes.push(quote);
    this.audit(workspace, 'quote.created', 'Quote', quote.id, quote);
    return quote;
  }

  listQuotes(tenantId?: string): Quote[] {
    return this.workspace(tenantId).quotes;
  }

  convertQuoteToInvoice(quoteId: string, tenantId?: string): Invoice {
    const workspace = this.workspace(tenantId);
    const quote = workspace.quotes.find((candidate) => candidate.id === quoteId);
    if (!quote) {
      throw new NotFoundException('Quote not found');
    }
    quote.status = 'POSTED';
    return this.createInvoice({ customerId: quote.customerId, lines: quote.lines, sourceQuoteId: quote.id }, workspace.tenant.id);
  }

  createInvoice(input: { customerId: string; lines: DocumentLineInput[]; sourceQuoteId?: string; dueDate?: string }, tenantId?: string): Invoice {
    const workspace = this.workspace(tenantId);
    this.assertCanWrite(workspace);
    this.customer(workspace, input.customerId);
    this.assertPeriodOpen(workspace, today());
    this.assertInvoiceLegalIdentity(workspace.tenant.legalEntity);
    const lines = this.documentLines(workspace, input.lines);
    const invoice: Invoice = {
      id: this.id('fac'),
      tenantId: workspace.tenant.id,
      number: this.nextNumber(workspace, 'FAC'),
      customerId: input.customerId,
      status: 'POSTED',
      date: today(),
      dueDate: input.dueDate ?? today(),
      sourceQuoteId: input.sourceQuoteId,
      lines,
      totals: this.totals(lines),
      paidAmount: 0,
      compliance: {
        legalMentions: this.morocco2026Rules.invoiceMentions,
        validated: true,
        adapterStatus: 'READY_FOR_EXPORT',
      },
    };
    workspace.invoices.push(invoice);
    this.consumeStockForSales(workspace, invoice.number, lines);
    this.postJournal(workspace, `Customer invoice ${invoice.number}`, invoice.number, [
      { account: '3421', label: 'Clients', debit: invoice.totals.total, credit: 0 },
      { account: '7111', label: 'Ventes de marchandises', debit: 0, credit: invoice.totals.subtotal },
      { account: '4455', label: 'TVA facturee', debit: 0, credit: invoice.totals.vatTotal },
    ]);
    this.audit(workspace, 'invoice.posted', 'Invoice', invoice.id, invoice);
    return invoice;
  }

  listInvoices(tenantId?: string): Invoice[] {
    return this.workspace(tenantId).invoices;
  }

  recordPayment(input: { invoiceId: string; amount: number; method?: Payment['method'] }, tenantId?: string): Payment {
    const workspace = this.workspace(tenantId);
    const invoice = workspace.invoices.find((candidate) => candidate.id === input.invoiceId);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    if (input.amount <= 0) {
      throw new BadRequestException('Payment amount must be positive');
    }
    invoice.paidAmount = r2(invoice.paidAmount + input.amount);
    if (invoice.paidAmount >= invoice.totals.total) {
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
    this.postJournal(workspace, `Payment ${invoice.number}`, payment.id, [
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

  lockFiscalPeriod(year: number, month: number, tenantId?: string): FiscalPeriod {
    const workspace = this.workspace(tenantId);
    let period = workspace.fiscalPeriods.find((candidate) => candidate.year === year && candidate.month === month);
    if (!period) {
      period = { id: this.id('fp'), tenantId: workspace.tenant.id, year, month, locked: false };
      workspace.fiscalPeriods.push(period);
    }
    period.locked = true;
    this.audit(workspace, 'fiscal-period.locked', 'FiscalPeriod', period.id, period);
    return period;
  }

  listFiscalPeriods(tenantId?: string): FiscalPeriod[] {
    return this.workspace(tenantId).fiscalPeriods;
  }

  createPosTransaction(input: { cashierId?: string; lines: DocumentLineInput[]; paymentMethod?: PosTransaction['paymentMethod'] }, tenantId?: string): PosTransaction {
    const workspace = this.workspace(tenantId);
    const lines = this.documentLines(workspace, input.lines);
    const transaction: PosTransaction = {
      id: this.id('pos'),
      tenantId: workspace.tenant.id,
      number: this.nextNumber(workspace, 'POS'),
      cashierId: input.cashierId ?? 'cashier',
      date: today(),
      lines,
      totals: this.totals(lines),
      paymentMethod: input.paymentMethod ?? 'CASH',
    };
    workspace.posTransactions.push(transaction);
    this.consumeStockForSales(workspace, transaction.number, lines, 'POS_SALE');
    this.postJournal(workspace, `POS ticket ${transaction.number}`, transaction.number, [
      { account: transaction.paymentMethod === 'CARD' ? '5141' : '5161', label: 'Encaisse POS', debit: transaction.totals.total, credit: 0 },
      { account: '7111', label: 'Ventes POS', debit: 0, credit: transaction.totals.subtotal },
      { account: '4455', label: 'TVA facturee', debit: 0, credit: transaction.totals.vatTotal },
    ]);
    this.audit(workspace, 'pos.sale', 'PosTransaction', transaction.id, transaction);
    return transaction;
  }

  listPosTransactions(tenantId?: string): PosTransaction[] {
    return this.workspace(tenantId).posTransactions;
  }

  createProductionOrder(input: { finishedProductId: string; quantity: number; components?: Array<{ productId: string; quantity: number }> }, tenantId?: string): ProductionOrder {
    const workspace = this.workspace(tenantId);
    const finished = this.product(workspace, input.finishedProductId);
    if (input.quantity <= 0) {
      throw new BadRequestException('Production quantity must be positive');
    }
    let consumedValue = 0;
    for (const component of input.components ?? [{ productId: 'prd-raw', quantity: input.quantity * 2 }]) {
      const raw = this.product(workspace, component.productId);
      const qty = component.quantity;
      if (raw.stockOnHand < qty) {
        throw new BadRequestException(`Insufficient stock for ${raw.sku}`);
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
      finishedProductId: finished.id,
      quantity: input.quantity,
      status: 'COMPLETED',
      consumedValue: r2(consumedValue),
      createdAt: today(),
    };
    workspace.productionOrders.push(order);
    this.audit(workspace, 'production.completed', 'ProductionOrder', order.id, order);
    return order;
  }

  listProductionOrders(tenantId?: string): ProductionOrder[] {
    return this.workspace(tenantId).productionOrders;
  }

  exportVatReport(tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const vatCollected = workspace.invoices.reduce((sum, invoice) => sum + invoice.totals.vatTotal, 0);
    return {
      tenantId: workspace.tenant.id,
      period: today().slice(0, 7),
      vatCollected: r2(vatCollected),
      invoiceCount: workspace.invoices.length,
      status: 'PREPARED',
    };
  }

  prepareDgiInvoiceEnvelope(invoiceId: string, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const invoice = workspace.invoices.find((candidate) => candidate.id === invoiceId);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }
    return {
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
  }

  auditLogs(tenantId?: string): AuditLog[] {
    return this.workspace(tenantId).auditLogs;
  }

  private workspace(tenantId?: string): TenantWorkspace {
    const id = tenantId ?? this.cls.get<string>('tenantId');
    if (!id) {
      throw new BadRequestException('Tenant context is required');
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
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  private supplier(workspace: TenantWorkspace, supplierId: string): Supplier {
    const supplier = workspace.suppliers.find((candidate) => candidate.id === supplierId);
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }
    return supplier;
  }

  private product(workspace: TenantWorkspace, productId: string): Product {
    const product = workspace.products.find((candidate) => candidate.id === productId || candidate.sku === productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  private documentLines(workspace: TenantWorkspace, inputLines: DocumentLineInput[] | DocumentLine[]): DocumentLine[] {
    if (!inputLines.length) {
      throw new BadRequestException('At least one line is required');
    }
    return inputLines.map((line) => {
      const product = this.product(workspace, line.productId);
      if (!product.active) {
        throw new BadRequestException(`Product ${product.sku} is archived`);
      }
      const quantity = Number(line.quantity);
      if (quantity <= 0) {
        throw new BadRequestException('Line quantity must be positive');
      }
      const unitPrice = line.unitPrice ?? product.salePrice;
      const vatRate = line.vatRate ?? product.vatRate;
      const subtotal = r2(quantity * unitPrice);
      const vatAmount = r2(subtotal * vatRate);
      return {
        productId: product.id,
        sku: product.sku,
        description: line.description ?? product.name,
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
      if (product.stockOnHand < line.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.sku}`);
      }
      product.stockOnHand = r2(product.stockOnHand - line.quantity);
      this.stockMove(workspace, product, -line.quantity, product.weightedAverageCost, type, reference);
    }
  }

  private stockMove(workspace: TenantWorkspace, product: Product, quantity: number, unitCost: number, type: StockMove['type'], reference: string): StockMove {
    const move: StockMove = {
      id: this.id('sm'),
      tenantId: workspace.tenant.id,
      productId: product.id,
      warehouseId: workspace.warehouses[0].id,
      type,
      quantity,
      unitCost,
      value: r2(quantity * unitCost),
      reference,
      createdAt: today(),
    };
    workspace.stockMoves.push(move);
    return move;
  }

  private postJournal(workspace: TenantWorkspace, description: string, source: string, lines: JournalEntry['lines']): JournalEntry {
    const debit = r2(lines.reduce((sum, line) => sum + line.debit, 0));
    const credit = r2(lines.reduce((sum, line) => sum + line.credit, 0));
    if (debit !== credit) {
      throw new BadRequestException(`Unbalanced journal entry ${description}`);
    }
    const entry: JournalEntry = {
      id: this.id('je'),
      tenantId: workspace.tenant.id,
      date: today(),
      source,
      description,
      lines,
      posted: true,
    };
    workspace.journalEntries.push(entry);
    return entry;
  }

  private assertInvoiceLegalIdentity(entity: LegalEntity): void {
    const required = [entity.tradeName, entity.ice, entity.ifNumber, entity.rc, entity.patente, entity.address];
    if (required.some((value) => !value)) {
      throw new BadRequestException('Tenant legal identity is incomplete for Moroccan invoicing');
    }
  }

  private assertPeriodOpen(workspace: TenantWorkspace, date: string): void {
    const year = Number(date.slice(0, 4));
    const month = Number(date.slice(5, 7));
    const period = workspace.fiscalPeriods.find((candidate) => candidate.year === year && candidate.month === month);
    if (period?.locked) {
      throw new ForbiddenException('Fiscal period is locked');
    }
  }

  private assertCanWrite(workspace: TenantWorkspace): void {
    if (workspace.tenant.status !== 'ACTIVE') {
      throw new ForbiddenException('Subscription is read-only');
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
      throw new BadRequestException('Fiscal year start month must be between 1 and 12');
    }
    return numeric;
  }

  private vatRate(value: number): VatRate {
    const numeric = Number(value);
    const rate = allowedVatRates.find((candidate) => candidate === numeric);
    if (rate === undefined) {
      throw new BadRequestException('VAT rate is not supported by the Morocco rule pack');
    }
    return rate;
  }

  private validateContacts(contacts: Customer['contacts']): void {
    for (const contact of contacts) {
      this.nonEmpty(contact.name, 'Contact name is required');
    }
  }

  private validateAddresses(addresses: Customer['addresses']): void {
    for (const address of addresses) {
      this.nonEmpty(address.label, 'Address label is required');
      this.nonEmpty(address.line1, 'Address line is required');
      this.nonEmpty(address.city, 'Address city is required');
    }
  }

  private id(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
