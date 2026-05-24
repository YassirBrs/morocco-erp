import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import {
  AuditLog,
  BusinessSearchInput,
  BusinessSearchResult,
  BusinessSearchType,
  CompanyProfileChange,
  ComplianceRuleSet,
  CreditNote,
  Customer,
  DeliveryNote,
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
  SalesOrder,
  Quote,
  StockMove,
  Supplier,
  Tenant,
  TenantSettings,
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
        fiscalYearStartMonth: 1,
        vatStatus: 'ENABLED',
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
          addresses: [{ label: 'Siège', line1: 'Avenue Mohammed V', city: 'Rabat' }],
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
          ifNumber: '445566',
          rc: 'CASA-99001',
          email: 'sales@casa-import.ma',
          phone: '+212522111111',
          address: 'Zone industrielle Ain Sebaa',
          city: 'Casablanca',
          paymentTermsDays: 45,
          contacts: [{ name: 'Samir Achat', role: 'Commercial', email: 'sales@casa-import.ma', phone: '+212522111111' }],
          bankDetails: [{ bankName: 'Attijariwafa bank', rib: '007780000000000000000123' }],
          active: true,
          createdAt: today(),
          updatedAt: today(),
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
          name: 'Installation sur site',
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
          name: 'Bois traité',
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
          name: 'Table assemblée',
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
      warehouses: [{ id: 'wh-1', tenantId: tenant.id, name: 'Dépôt Casablanca', city: 'Casablanca' }],
      quotes: [],
      salesOrders: [],
      deliveryNotes: [],
      invoices: [],
      creditNotes: [],
      payments: [],
      stockMoves: [],
      purchaseReceipts: [],
      journalEntries: [],
      fiscalPeriods: [],
      posTransactions: [],
      productionOrders: [],
      auditLogs: [],
      profileChanges: [],
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
      profileApprovalStatus: 'APPROVED',
      createdAt: today(),
    };

    this.workspaces.set(tenantId, {
      tenant,
      users: [],
      customers: [],
      suppliers: [],
      leads: [],
      products: [],
      warehouses: [{ id: this.id('wh'), tenantId, name: 'Dépôt principal', city: tenant.legalEntity.city }],
      quotes: [],
      salesOrders: [],
      deliveryNotes: [],
      invoices: [],
      creditNotes: [],
      payments: [],
      stockMoves: [],
      purchaseReceipts: [],
      journalEntries: [],
      fiscalPeriods: [],
      posTransactions: [],
      productionOrders: [],
      auditLogs: [],
      profileChanges: [],
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
      const user = workspace.users.find((candidate) => candidate.email === email && candidate.password === password);
      if (user && user.active) {
        const { password: _password, ...safeUser } = user;
        return { ...safeUser, tenant: workspace.tenant };
      }
    }
    throw new ForbiddenException('Identifiants invalides');
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

    workspace.tenant.settings = {
      ...workspace.tenant.settings,
      invoiceSeries: this.nonEmpty(input.invoiceSeries ?? workspace.tenant.settings.invoiceSeries, 'La série de facturation est obligatoire').toUpperCase(),
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
      name: this.nonEmpty(input.name, 'Le nom du client est obligatoire'),
      ice: this.clean(input.ice),
      ifNumber: this.clean(input.ifNumber),
      rc: this.clean(input.rc),
      email: this.clean(input.email),
      phone: this.clean(input.phone),
      address: this.clean(input.address),
      city: this.clean(input.city),
      paymentTermsDays: this.nonNegative(input.paymentTermsDays ?? 30, 'Le délai de paiement doit être nul ou positif'),
      creditLimit: this.nonNegative(input.creditLimit ?? 0, 'Le plafond de crédit doit être nul ou positif'),
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
      customer.name = this.nonEmpty(input.name, 'Le nom du client est obligatoire');
    }
    if (input.ice !== undefined) customer.ice = this.clean(input.ice);
    if (input.ifNumber !== undefined) customer.ifNumber = this.clean(input.ifNumber);
    if (input.rc !== undefined) customer.rc = this.clean(input.rc);
    if (input.email !== undefined) customer.email = this.clean(input.email);
    if (input.phone !== undefined) customer.phone = this.clean(input.phone);
    if (input.address !== undefined) customer.address = this.clean(input.address);
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
      name: this.nonEmpty(input.name, 'Le nom du fournisseur est obligatoire'),
      ice: this.clean(input.ice),
      ifNumber: this.clean(input.ifNumber),
      rc: this.clean(input.rc),
      email: this.clean(input.email),
      phone: this.clean(input.phone),
      address: this.clean(input.address),
      city: this.clean(input.city),
      paymentTermsDays: this.nonNegative(input.paymentTermsDays ?? 30, 'Le délai de paiement fournisseur doit être nul ou positif'),
      contacts: input.contacts ?? [],
      bankDetails: input.bankDetails ?? [],
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
    const supplier = this.supplier(workspace, supplierId);
    if (input.name !== undefined) supplier.name = this.nonEmpty(input.name, 'Le nom du fournisseur est obligatoire');
    if (input.ice !== undefined) supplier.ice = this.clean(input.ice);
    if (input.ifNumber !== undefined) supplier.ifNumber = this.clean(input.ifNumber);
    if (input.rc !== undefined) supplier.rc = this.clean(input.rc);
    if (input.email !== undefined) supplier.email = this.clean(input.email);
    if (input.phone !== undefined) supplier.phone = this.clean(input.phone);
    if (input.address !== undefined) supplier.address = this.clean(input.address);
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
    if (input.active !== undefined) supplier.active = input.active;
    supplier.duplicateWarnings = this.supplierDuplicateWarnings(workspace, supplier);
    supplier.updatedAt = today();
    this.audit(workspace, 'supplier.updated', 'Supplier', supplier.id, supplier);
    return supplier;
  }

  archiveSupplier(supplierId: string, tenantId?: string): Supplier {
    const workspace = this.workspace(tenantId);
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

  addLead(input: Partial<Lead> & { customerName: string; value?: number }, tenantId?: string): Lead {
    const workspace = this.workspace(tenantId);
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
      name: this.nonEmpty(input.name, 'Le nom de l’article est obligatoire'),
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
      const sku = this.nonEmpty(input.sku, 'Le SKU est obligatoire').toUpperCase();
      if (workspace.products.some((candidate) => candidate.id !== product.id && candidate.sku.toUpperCase() === sku)) {
        throw new BadRequestException('Le SKU article existe déjà');
      }
      product.sku = sku;
    }
    if (input.name !== undefined) product.name = this.nonEmpty(input.name, 'Le nom de l’article est obligatoire');
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
      reservedStock: product.reservedStock,
      availableStock: this.availableStock(product),
      weightedAverageCost: product.weightedAverageCost,
      stockValue: r2(product.stockOnHand * product.weightedAverageCost),
    }));
  }

  adjustStock(productId: string, quantity: number, reason = 'Ajustement manuel', tenantId?: string): StockMove {
    const workspace = this.workspace(tenantId);
    const product = this.product(workspace, productId);
    if (!product.trackStock) {
      throw new BadRequestException('Cet article n’est pas suivi en stock');
    }
    product.stockOnHand = r2(product.stockOnHand + quantity);
    if (product.stockOnHand < 0) {
      throw new BadRequestException('Le stock ne peut pas devenir négatif');
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
    this.postJournal(workspace, `Réception achat ${number}`, number, [
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
      revision: 1,
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

  getQuote(quoteId: string, tenantId?: string): Quote {
    return this.quote(this.workspace(tenantId), quoteId);
  }

  reviseQuote(quoteId: string, input: { lines?: DocumentLineInput[]; validUntil?: string }, tenantId?: string): Quote {
    const workspace = this.workspace(tenantId);
    const quote = this.quote(workspace, quoteId);
    if (quote.status === 'CONVERTED' || quote.status === 'VOID') {
      throw new BadRequestException('Les devis convertis ou annulés ne peuvent pas être révisés');
    }
    if (input.lines) {
      quote.lines = this.documentLines(workspace, input.lines);
      quote.totals = this.totals(quote.lines);
    }
    if (input.validUntil) {
      quote.validUntil = input.validUntil;
    }
    quote.status = 'DRAFT';
    quote.approvedAt = undefined;
    quote.revision += 1;
    this.audit(workspace, 'quote.revised', 'Quote', quote.id, quote);
    return quote;
  }

  approveQuote(quoteId: string, tenantId?: string): Quote {
    const workspace = this.workspace(tenantId);
    const quote = this.quote(workspace, quoteId);
    if (quote.status === 'CONVERTED' || quote.status === 'VOID') {
      throw new BadRequestException('Le devis ne peut pas être approuvé');
    }
    quote.status = 'APPROVED';
    quote.approvedAt = today();
    this.audit(workspace, 'quote.approved', 'Quote', quote.id, quote);
    return quote;
  }

  exportQuotePdf(quoteId: string, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const quote = this.quote(workspace, quoteId);
    const customer = this.customer(workspace, quote.customerId);
    const lines = [
      `Devis ${quote.number} révision ${quote.revision}`,
      `Entreprise ${workspace.tenant.legalEntity.tradeName}`,
      `Client ${customer.name}`,
      `Total HT ${quote.totals.subtotal.toFixed(2)} MAD`,
      `TVA ${quote.totals.vatTotal.toFixed(2)} MAD`,
      `Total TTC ${quote.totals.total.toFixed(2)} MAD`,
      ...quote.lines.map((line) => `${line.sku} ${line.description} x${line.quantity} = ${line.total.toFixed(2)} MAD`),
    ];
    const contentBase64 = Buffer.from(this.simplePdf(lines), 'binary').toString('base64');
    this.audit(workspace, 'quote.pdf.exported', 'Quote', quote.id, { quoteId, fileName: `${quote.number}.pdf` });
    return {
      quoteId: quote.id,
      quoteNumber: quote.number,
      fileName: `${quote.number}.pdf`,
      mimeType: 'application/pdf',
      contentBase64,
      status: 'PREPARED',
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
    quote.status = 'CONVERTED';
    return this.createInvoice({ customerId: quote.customerId, lines: quote.lines, sourceQuoteId: quote.id }, workspace.tenant.id);
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
      number: this.nextNumber(workspace, 'BC'),
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
      product.stockOnHand = r2(product.stockOnHand - line.quantity);
      this.stockMove(workspace, product, -line.quantity, product.weightedAverageCost, 'DELIVERY', order.number);
    }
    const deliveryNote: DeliveryNote = {
      id: this.id('bl'),
      tenantId: workspace.tenant.id,
      number: this.nextNumber(workspace, 'BL'),
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
    this.customer(workspace, input.customerId);
    this.assertPeriodOpen(workspace, today());
    this.assertInvoiceLegalIdentity(workspace.tenant.legalEntity);
    const lines = this.documentLines(workspace, input.lines);
    const invoice: Invoice = {
      id: this.id('fac'),
      tenantId: workspace.tenant.id,
      number: this.nextNumber(workspace, workspace.tenant.settings.invoiceSeries),
      customerId: input.customerId,
      status: 'POSTED',
      date: today(),
      dueDate: input.dueDate ?? today(),
      sourceQuoteId: input.sourceQuoteId,
      sourceOrderId: input.sourceOrderId,
      sourceDeliveryNoteId: input.sourceDeliveryNoteId,
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
      number: this.nextNumber(workspace, 'NC'),
      invoiceId: invoice.id,
      customerId: invoice.customerId,
      status: 'POSTED',
      date: today(),
      reason: this.nonEmpty(input.reason ?? 'Avoir client', 'Le motif de l’avoir est obligatoire'),
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

  createProductionOrder(input: { finishedProductId: string; quantity: number; components?: Array<{ productId: string; quantity: number }> }, tenantId?: string): ProductionOrder {
    const workspace = this.workspace(tenantId);
    const finished = this.product(workspace, input.finishedProductId);
    if (input.quantity <= 0) {
      throw new BadRequestException('La quantité de production doit être positive');
    }
    let consumedValue = 0;
    for (const component of input.components ?? [{ productId: 'prd-raw', quantity: input.quantity * 2 }]) {
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
    const vatReversed = workspace.creditNotes.reduce((sum, creditNote) => sum + creditNote.totals.vatTotal, 0);
    return {
      tenantId: workspace.tenant.id,
      period: today().slice(0, 7),
      vatCollected: r2(vatCollected),
      vatReversed: r2(vatReversed),
      netVatCollected: r2(vatCollected - vatReversed),
      invoiceCount: workspace.invoices.length,
      creditNoteCount: workspace.creditNotes.length,
      status: 'PREPARED',
    };
  }

  prepareDgiInvoiceEnvelope(invoiceId: string, tenantId?: string) {
    const workspace = this.workspace(tenantId);
    const invoice = workspace.invoices.find((candidate) => candidate.id === invoiceId);
    if (!invoice) {
      throw new NotFoundException('Facture introuvable');
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

  private supplier(workspace: TenantWorkspace, supplierId: string): Supplier {
    const supplier = workspace.suppliers.find((candidate) => candidate.id === supplierId);
    if (!supplier) {
      throw new NotFoundException('Fournisseur introuvable');
    }
    return supplier;
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

  private invoiceCreditTotal(workspace: TenantWorkspace, invoiceId: string): number {
    return r2(workspace.creditNotes
      .filter((creditNote) => creditNote.invoiceId === invoiceId && creditNote.status === 'POSTED')
      .reduce((sum, creditNote) => sum + creditNote.totals.total, 0));
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
    };
    workspace.journalEntries.push(entry);
    return entry;
  }

  private assertInvoiceLegalIdentity(entity: LegalEntity): void {
    const required = [entity.tradeName, entity.ice, entity.ifNumber, entity.rc, entity.patente, entity.address];
    if (required.some((value) => !value)) {
      throw new BadRequestException('L’identité légale du tenant est incomplète pour la facturation marocaine');
    }
  }

  private assertPeriodOpen(workspace: TenantWorkspace, date: string): void {
    const year = Number(date.slice(0, 4));
    const month = Number(date.slice(5, 7));
    const period = workspace.fiscalPeriods.find((candidate) => candidate.year === year && candidate.month === month);
    if (period?.locked) {
      throw new ForbiddenException('La période fiscale est verrouillée');
    }
  }

  private assertCanWrite(workspace: TenantWorkspace): void {
    if (workspace.tenant.status !== 'ACTIVE') {
      throw new ForbiddenException('L’abonnement est en lecture seule');
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
