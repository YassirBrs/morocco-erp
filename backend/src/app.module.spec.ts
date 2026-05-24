import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { SalesService } from './sales/services/sales.service';
import { InventoryService } from './inventory/services/inventory.service';
import { ComplianceService } from './compliance/services/compliance.service';
import { SearchService } from './search/services/search.service';
import { InventoryController } from './inventory/controllers/inventory.controller';
import { LedgerController } from './ledger/controllers/ledger.controller';
import { PayrollController } from './payroll/controllers/payroll.controller';
import { TenantController } from './tenant/controllers/tenant.controller';
import { ComplianceController } from './compliance/controllers/compliance.controller';
import { ClsService } from 'nestjs-cls';

describe('AppModule ERP module wiring', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('APP_INTERCEPTOR')
      .useValue({})
      .compile();
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  it('runs sales, stock, accounting, and compliance flows through injected services', () => {
    const sales = moduleRef.get(SalesService);
    const inventory = moduleRef.get(InventoryService);
    const compliance = moduleRef.get(ComplianceService);
    const search = moduleRef.get(SearchService);
    const cls = moduleRef.get(ClsService);

    cls.run(() => {
      cls.set('tenantId', 'tenant-demo');
      const quote = sales.createQuote({
        customerId: 'cus-1',
        lines: [{ productId: 'prd-1', quantity: 1 }],
      });
      const invoice = sales.convertQuoteToInvoice(quote.id);
      const stock = inventory.listStock().find((line: any) => line.productId === 'prd-1');
      const vat = compliance.exportVatReport();

      expect(invoice.number).toMatch(/^FAC-/);
      expect(invoice.compliance.validated).toBe(true);
      expect(stock.stockOnHand).toBe(49);
      expect(vat.vatCollected).toBe(170);
      expect(search.businessSearch({ q: invoice.number })[0].type).toBe('invoices');
    });
  });

  it('exercises controller integration surfaces for reports, adapters, RBAC-sensitive keys, tenant isolation evidence, and acceptance smoke metadata', () => {
    const inventory = moduleRef.get(InventoryController);
    const ledger = moduleRef.get(LedgerController);
    const payroll = moduleRef.get(PayrollController);
    const tenant = moduleRef.get(TenantController);
    const compliance = moduleRef.get(ComplianceController);
    const cls = moduleRef.get(ClsService);

    cls.run(() => {
      cls.set('tenantId', 'tenant-demo');
      cls.set('userRole', 'OWNER');

      const valuation: any = inventory.valuationReport();
      const aging: any = ledger.aging();
      const pnl: any = ledger.profitAndLoss('2026');
      const balance: any = ledger.balanceSheet('2026');
      const payrollCost: any = payroll.costReport();
      const dgi: any = compliance.dgiAdapter();
      const cnss: any = compliance.cnssAdapterOperation({ operation: 'validate', reference: 'PAY-TEST', payload: { period: '2026-05' } });
      const bank: any = ledger.bankImportPreview({ csv: 'date,label,amount,reference\n2026-05-24,Versement client,100,BANK-1' });
      const email: any = tenant.queueEmail({ type: 'REMINDER', to: 'relance@example.ma', subject: 'Relance facture' });
      const webhook: any = tenant.emitWebhook({ event: 'payment.received', payload: { amount: 100 } });
      const key: any = tenant.createApiKey({ name: 'Partenaire test', scopes: ['sales:read'] });
      const scenarios: any = tenant.acceptanceScenarios();

      expect(valuation.totals.value).toBeGreaterThan(0);
      expect(aging.totals).toHaveProperty('receivables');
      expect(pnl.rows.map((row: any) => row.section)).toEqual(['PRODUITS', 'CHARGES', 'RÉSULTAT']);
      expect(balance.totals).toHaveProperty('assets');
      expect(payrollCost.totals).toHaveProperty('employerCost');
      expect(dgi.credentialsConfigured).toBe(false);
      expect(cnss.status).toBe('VALID');
      expect(bank.rowCount).toBe(1);
      expect(email.status).toBe('QUEUED');
      expect(webhook.signaturePreview).toHaveLength(12);
      expect(key.token).toMatch(/^mep_/);
      expect(scenarios.smokeFlows).toEqual(expect.arrayContaining(['issue invoice', 'run payroll']));
    });
  });
});
