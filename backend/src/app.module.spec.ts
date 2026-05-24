import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { SalesService } from './sales/services/sales.service';
import { InventoryService } from './inventory/services/inventory.service';
import { ComplianceService } from './compliance/services/compliance.service';
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
    });
  });
});
