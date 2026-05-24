import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClsModule } from 'nestjs-cls';
import { PrismaModule } from './common/prisma/prisma.module';
import { ErpDataModule } from './common/erp/erp.module';
import { TenantInterceptor } from './common/interceptors/tenant.interceptor';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { BillingModule } from './billing/billing.module';
import { CrmModule } from './crm/crm.module';
import { SalesModule } from './sales/sales.module';
import { InventoryModule } from './inventory/inventory.module';
import { LedgerModule } from './ledger/ledger.module';
import { PayrollModule } from './payroll/payroll.module';
import { ProductionModule } from './production/production.module';
import { PosModule } from './pos/pos.module';
import { ComplianceModule } from './compliance/compliance.module';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    PrismaModule,
    ErpDataModule,
    AuthModule,
    TenantModule,
    BillingModule,
    CrmModule,
    SalesModule,
    InventoryModule,
    LedgerModule,
    PayrollModule,
    ProductionModule,
    PosModule,
    ComplianceModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
  ],
  exports: [ClsModule, PrismaModule],
})
export class AppModule {}
