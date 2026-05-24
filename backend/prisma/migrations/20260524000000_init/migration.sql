-- Initial production PostgreSQL migration for the Morocco ERP tenant schema.
-- The Prisma schema is the source of truth; this migration mirrors its core tables
-- so `prisma migrate deploy` has a tracked starting point for staging/prod.

CREATE TYPE "SubscriptionPlan" AS ENUM ('INTILAQ', 'NUMOW', 'ENTERPRISE');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED');
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'ACCOUNTANT', 'SALES', 'WAREHOUSE', 'PAYROLL', 'CASHIER');
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'POSTED', 'PAID', 'VOID');

CREATE TABLE "Tenant" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "tradeName" TEXT NOT NULL,
  "ice" TEXT NOT NULL,
  "ifNumber" TEXT NOT NULL,
  "rc" TEXT NOT NULL,
  "patente" TEXT NOT NULL,
  "cnssNumber" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "country" TEXT NOT NULL DEFAULT 'MA',
  "vatEnabled" BOOLEAN NOT NULL DEFAULT true,
  "plan" "SubscriptionPlan" NOT NULL DEFAULT 'INTILAQ',
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL REFERENCES "Tenant"("id"),
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "role" "UserRole" NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_tenantId_email_key" UNIQUE ("tenantId", "email")
);

CREATE TABLE "Customer" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL REFERENCES "Tenant"("id"),
  "name" TEXT NOT NULL,
  "ice" TEXT,
  "ifNumber" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Supplier" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL REFERENCES "Tenant"("id"),
  "name" TEXT NOT NULL,
  "ice" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Product" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL REFERENCES "Tenant"("id"),
  "sku" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "salePrice" DECIMAL(14,2) NOT NULL,
  "purchaseCost" DECIMAL(14,2) NOT NULL,
  "vatRate" DECIMAL(5,4) NOT NULL,
  "stockOnHand" DECIMAL(14,3) NOT NULL,
  "weightedAverageCost" DECIMAL(14,2) NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "Product_tenantId_sku_key" UNIQUE ("tenantId", "sku")
);

CREATE TABLE "Invoice" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL REFERENCES "Tenant"("id"),
  "customerId" TEXT NOT NULL REFERENCES "Customer"("id"),
  "number" TEXT NOT NULL,
  "status" "DocumentStatus" NOT NULL DEFAULT 'POSTED',
  "date" TIMESTAMP(3) NOT NULL,
  "dueDate" TIMESTAMP(3) NOT NULL,
  "subtotal" DECIMAL(14,2) NOT NULL,
  "vatTotal" DECIMAL(14,2) NOT NULL,
  "total" DECIMAL(14,2) NOT NULL,
  "paidAmount" DECIMAL(14,2) NOT NULL,
  "adapterStatus" TEXT NOT NULL DEFAULT 'READY_FOR_EXPORT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Invoice_tenantId_number_key" UNIQUE ("tenantId", "number")
);

CREATE TABLE "InvoiceLine" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "invoiceId" TEXT NOT NULL REFERENCES "Invoice"("id"),
  "productId" TEXT NOT NULL REFERENCES "Product"("id"),
  "description" TEXT NOT NULL,
  "quantity" DECIMAL(14,3) NOT NULL,
  "unitPrice" DECIMAL(14,2) NOT NULL,
  "vatRate" DECIMAL(5,4) NOT NULL,
  "subtotal" DECIMAL(14,2) NOT NULL,
  "vatAmount" DECIMAL(14,2) NOT NULL,
  "total" DECIMAL(14,2) NOT NULL
);

CREATE TABLE "Payment" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "invoiceId" TEXT NOT NULL REFERENCES "Invoice"("id"),
  "amount" DECIMAL(14,2) NOT NULL,
  "method" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "StockMove" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL REFERENCES "Tenant"("id"),
  "productId" TEXT NOT NULL REFERENCES "Product"("id"),
  "warehouseId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "quantity" DECIMAL(14,3) NOT NULL,
  "unitCost" DECIMAL(14,2) NOT NULL,
  "value" DECIMAL(14,2) NOT NULL,
  "reference" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "JournalEntry" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL REFERENCES "Tenant"("id"),
  "date" TIMESTAMP(3) NOT NULL,
  "source" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "posted" BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE "JournalEntryLine" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL,
  "journalEntryId" TEXT NOT NULL REFERENCES "JournalEntry"("id"),
  "account" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "debit" DECIMAL(14,2) NOT NULL,
  "credit" DECIMAL(14,2) NOT NULL
);

CREATE TABLE "FiscalPeriod" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL REFERENCES "Tenant"("id"),
  "year" INTEGER NOT NULL,
  "month" INTEGER NOT NULL,
  "locked" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "FiscalPeriod_tenantId_year_month_key" UNIQUE ("tenantId", "year", "month")
);

CREATE TABLE "ComplianceRuleSet" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT REFERENCES "Tenant"("id"),
  "jurisdiction" TEXT NOT NULL DEFAULT 'MA',
  "effectiveFrom" TIMESTAMP(3) NOT NULL,
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AuditLog" (
  "id" TEXT PRIMARY KEY,
  "tenantId" TEXT NOT NULL REFERENCES "Tenant"("id"),
  "action" TEXT NOT NULL,
  "entity" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Tenant_status_idx" ON "Tenant"("status");
CREATE INDEX "User_tenantId_idx" ON "User"("tenantId");
CREATE INDEX "Customer_tenantId_idx" ON "Customer"("tenantId");
CREATE INDEX "Supplier_tenantId_idx" ON "Supplier"("tenantId");
CREATE INDEX "Product_tenantId_idx" ON "Product"("tenantId");
CREATE INDEX "Invoice_tenantId_idx" ON "Invoice"("tenantId");
CREATE INDEX "InvoiceLine_tenantId_idx" ON "InvoiceLine"("tenantId");
CREATE INDEX "Payment_tenantId_idx" ON "Payment"("tenantId");
CREATE INDEX "StockMove_tenantId_idx" ON "StockMove"("tenantId");
CREATE INDEX "JournalEntry_tenantId_idx" ON "JournalEntry"("tenantId");
CREATE INDEX "JournalEntryLine_tenantId_idx" ON "JournalEntryLine"("tenantId");
CREATE INDEX "ComplianceRuleSet_tenantId_idx" ON "ComplianceRuleSet"("tenantId");
CREATE INDEX "AuditLog_tenantId_idx" ON "AuditLog"("tenantId");
