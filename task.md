# Morocco ERP SaaS Improvement Backlog

This backlog contains concrete tasks to improve the app from the current working baseline into a stronger Morocco-focused ERP SaaS. Each task should ship with tenant isolation, role checks, validation, audit logging where relevant, and automated tests.

## Priority Legend

- P0: Required before serious customer pilots.
- P1: Strong product improvement for paid customers.
- P2: Competitive differentiator or scale hardening.

## Product And Onboarding

- [x] T001 P0 - Build a guided company onboarding wizard for ICE, IF, RC, Patente, CNSS number, VAT status, fiscal year, address, and invoice series.
- [x] T002 P0 - Add a tenant setup checklist that shows missing legal, accounting, payroll, and invoice configuration.
- [ ] T003 P0 - Add a first-run demo data reset action for local and staging environments only.
- [ ] T004 P1 - Add company profile editing with full audit history and approval state.
- [ ] T005 P1 - Add French-first copy review across all screens and keep labels consistent with Moroccan business usage.
- [ ] T006 P1 - Add Arabic-ready customer, supplier, employee, and document fields without forcing Arabic UI yet.
- [ ] T007 P1 - Add import templates for customers, suppliers, products, employees, and chart of accounts.
- [ ] T008 P2 - Add an implementation partner workspace to help onboard multiple client tenants.

## Auth, Tenanting, And Security

- [ ] T009 P0 - Replace demo auth with password login, refresh tokens, password reset, and secure session storage.
- [ ] T010 P0 - Add role-based navigation and route guards for owner, admin, accountant, sales, stock, HR, cashier, and read-only roles.
- [ ] T011 P0 - Add server-side permission checks on every write endpoint.
- [ ] T012 P0 - Add tenant isolation tests for every module controller and repository.
- [ ] T013 P0 - Add audit log entries for login, configuration changes, invoice posting, payment posting, payroll run, and period locking.
- [ ] T014 P1 - Add two-factor authentication for admin and accountant roles.
- [ ] T015 P1 - Add IP/device history and suspicious login notifications.
- [ ] T016 P1 - Add subscription feature gates that lock writes while keeping read/export access.
- [ ] T017 P2 - Add data retention policies and tenant export/delete workflows.

## Sales And CRM

- [x] T018 P0 - Add full customer CRUD with ICE, IF, payment terms, credit limit, contacts, and addresses.
- [x] T019 P0 - Add product/service catalog screens with VAT rate, SKU, unit, selling price, and stock behavior.
- [x] T020 P0 - Add quote creation, revision, approval, PDF export, and conversion to order.
- [x] T021 P0 - Add order creation and conversion to delivery note and invoice.
- [x] T022 P0 - Add delivery note creation with stock reservation and stock release on cancellation.
- [x] T023 P0 - Add invoice posting rules with continuous numbering per fiscal year and series.
- [x] T024 P0 - Add credit notes with invoice references and automatic accounting reversal entries.
- [x] T025 P0 - Add payment capture with partial payments, overpayment rejection, and customer balance update.
- [ ] T026 P1 - Add lead pipeline with stages, next action date, owner, source, and expected value.
- [x] T027 P1 - Add customer statement export with invoices, payments, credit notes, and aging.

## Purchases, Suppliers, And Inventory

- [ ] T028 P0 - Add supplier CRUD with ICE/IF, payment terms, contacts, and bank details.
- [ ] T029 P0 - Add purchase order workflow with draft, approved, partially received, received, cancelled states.
- [ ] T030 P0 - Add purchase receipt posting that updates stock and CUMP valuation.
- [ ] T031 P0 - Add supplier invoice posting and payable balance update.
- [ ] T032 P0 - Add stock adjustment workflow with reason codes and accounting entries.
- [ ] T033 P0 - Add warehouse CRUD and stock per warehouse.
- [ ] T034 P1 - Add stock transfer between warehouses with in-transit state.
- [ ] T035 P1 - Add minimum stock alerts and replenishment suggestions.
- [ ] T036 P1 - Add inventory count sheets with variance approval.
- [ ] T037 P2 - Add barcode fields and scan-friendly product lookup.

## Accounting And Morocco Compliance

- [ ] T038 P0 - Persist the PCGE chart of accounts and expose a searchable account selector.
- [ ] T039 P0 - Add journal entry CRUD with balanced debit/credit validation.
- [ ] T040 P0 - Add fiscal periods with open, soft-locked, locked, and closed states.
- [ ] T041 P0 - Reject postings into locked periods across sales, purchases, stock, and payroll.
- [ ] T042 P0 - Generate automatic entries for invoices, credit notes, payments, purchase receipts, supplier invoices, and stock adjustments.
- [ ] T043 P0 - Add VAT report by period, rate, collected VAT, deductible VAT, and net payable/refundable amount.
- [ ] T044 P0 - Version Moroccan tax and payroll rule packs in the database with effective dates.
- [ ] T045 P0 - Add compliance rule validation before invoice and payroll posting.
- [ ] T046 P1 - Add accounting export formats for accountant review and external tools.
- [ ] T047 P1 - Add account reconciliation for bank, cash, receivables, and payables.
- [ ] T048 P1 - Add period close checklist with unresolved documents, unposted drafts, and imbalance checks.
- [ ] T049 P2 - Add legal evidence archive for generated declarations, exports, and submission statuses.

## Payroll And HR

- [ ] T050 P0 - Add employee CRUD with CIN, CNSS number, contract type, hire date, salary, dependents, and address.
- [ ] T051 P0 - Add employment contract records with start date, end date, salary history, and document attachments.
- [ ] T052 P0 - Add monthly payroll run creation with draft, calculated, approved, posted, and cancelled states.
- [ ] T053 P0 - Calculate gross salary, CNSS, AMO, IR, net salary, employer charges, and taxable base from versioned rules.
- [ ] T054 P0 - Generate payslip PDF per employee and payroll summary per run.
- [ ] T055 P0 - Generate Damancom export files and validate line length/format in tests.
- [ ] T056 P1 - Add leave balance tracking, leave requests, approvals, and payroll impact.
- [ ] T057 P1 - Add payroll accounting entries and reject posting to locked periods.
- [ ] T058 P1 - Add employee portal access for payslips and leave requests.
- [ ] T059 P2 - Add HR document expiry alerts for contracts, IDs, residence permits, and certifications.

## POS And Cash Operations

- [ ] T060 P0 - Add cashier session open/close with expected cash and variance.
- [ ] T061 P0 - Add POS ticket creation with stock deduction and payment capture.
- [ ] T062 P0 - Add POS refund flow linked to original ticket and stock return.
- [ ] T063 P1 - Add cash drawer movements for cash in, cash out, and expense payout.
- [ ] T064 P1 - Add daily Z report with sales, VAT, payment methods, refunds, and cash variance.
- [ ] T065 P2 - Add offline-ready POS queue with later sync and conflict handling.

## Production, Maintenance, Fleet, And Projects

- [ ] T066 P1 - Add bill of materials for manufactured products.
- [ ] T067 P1 - Add production order workflow with component issue, finished goods receipt, and cost rollup.
- [ ] T068 P1 - Add maintenance asset registry, work orders, technician assignment, and cost tracking.
- [ ] T069 P1 - Add fleet vehicle registry with documents, fuel logs, maintenance, and driver assignment.
- [ ] T070 P1 - Add project CRUD with customer, budget, tasks, expenses, timesheets, and invoice milestones.
- [ ] T071 P2 - Add profitability view across production orders, assets, vehicles, and projects.

## Documents, PDFs, And Exports

- [ ] T072 P0 - Generate compliant invoice PDFs with tenant legal identifiers, customer identifiers, line VAT, totals, and numbering.
- [ ] T073 P0 - Add PDF generation tests that assert required invoice mentions are present.
- [ ] T074 P1 - Add quote, delivery note, credit note, purchase order, receipt, and payslip PDFs.
- [ ] T075 P1 - Add document numbering settings per type and fiscal year.
- [ ] T076 P1 - Add file storage abstraction with local storage for dev and object storage adapter for production.
- [ ] T077 P2 - Add document templates with tenant logo, legal footer, and bilingual-ready fields.

## Frontend UX And Design

- [ ] T078 P0 - Replace static dashboard data flow with the Next.js app as the primary browser entry point.
- [ ] T079 P0 - Add module-specific list/detail/create/edit screens for sales, stock, accounting, payroll, POS, and CRM.
- [ ] T080 P0 - Add consistent empty, loading, error, success, and forbidden states.
- [ ] T081 P0 - Add form validation messages mapped to backend DTO validation.
- [ ] T082 P1 - Add global command/search for customers, invoices, products, suppliers, employees, and journal entries.
- [ ] T083 P1 - Add saved filters, column visibility, and export buttons on dense tables.
- [ ] T084 P1 - Add responsive tablet/mobile layouts for approval, lookup, and POS workflows.
- [ ] T085 P1 - Add keyboard-friendly data entry for invoice lines, payment lines, and journal lines.
- [ ] T086 P2 - Add dashboard personalization by role and tenant plan.

## Reporting And Analytics

- [ ] T087 P0 - Add sales dashboard by period, customer, product, VAT rate, and unpaid balance.
- [ ] T088 P0 - Add inventory valuation report by warehouse and product.
- [ ] T089 P0 - Add receivables and payables aging reports.
- [ ] T090 P1 - Add profit and loss report from journal entries.
- [ ] T091 P1 - Add balance sheet report from journal entries.
- [ ] T092 P1 - Add payroll cost report by period, employee, department, and employer charges.
- [ ] T093 P2 - Add cohort metrics for SaaS usage, activation, retention, and module adoption.

## Integrations And Adapters

- [ ] T094 P0 - Define DGI adapter interface for validate, render, submit, poll status, and archive evidence.
- [ ] T095 P0 - Define CNSS adapter interface for validate, render, submit, poll status, and archive evidence.
- [ ] T096 P1 - Add bank import adapter for CSV/OFX-style statements and reconciliation.
- [ ] T097 P1 - Add email delivery adapter for invoices, statements, payslips, and reminders.
- [ ] T098 P1 - Add webhook events for invoice posted, payment received, payroll posted, and stock low.
- [ ] T099 P2 - Add API keys and scoped partner API access.

## Testing And Quality

- [ ] T100 P0 - Add integration tests for every controller with success, validation error, RBAC, and tenant isolation cases.
- [ ] T101 P0 - Add service tests for invoice numbering, VAT totals, stock CUMP, period locks, and payroll calculations.
- [ ] T102 P0 - Add Playwright smoke tests for onboarding, customer creation, product creation, invoice creation, payment capture, and payroll run.
- [ ] T103 P0 - Add seed-based acceptance scenarios for a trading company, a service company, and a payroll-heavy company.
- [ ] T104 P1 - Add mutation-safe tests for rollback when accounting entries fail after inventory or sales operations.
- [ ] T105 P1 - Add frontend component tests for forms, tables, navigation, and error states.
- [ ] T106 P1 - Add accessibility checks for navigation, dialogs, forms, tables, and keyboard flows.
- [ ] T107 P2 - Add performance tests for large tenants with many invoices, journal lines, employees, and stock moves.

## Infrastructure, Deployment, And Operations

- [ ] T108 P0 - Add production PostgreSQL configuration and Prisma migration workflow.
- [ ] T109 P0 - Add environment validation for API URLs, database URL, auth secrets, storage config, and allowed origins.
- [ ] T110 P0 - Add Docker compose profiles for dev, test, and local production simulation.
- [ ] T111 P0 - Add CI pipeline for install, lint, build, backend tests, frontend tests, and Playwright smoke tests.
- [ ] T112 P1 - Add structured logging with tenant ID, request ID, user ID, module, and action.
- [ ] T113 P1 - Add metrics for API latency, error rates, job failures, and queue depth.
- [ ] T114 P1 - Add backup and restore procedure for tenant data.
- [ ] T115 P1 - Add staging deployment with seeded demo tenant and protected admin access.
- [ ] T116 P2 - Add background job queue for PDFs, exports, emails, declarations, and imports.
- [ ] T117 P2 - Add feature flag system for phased module rollout.

## Commercial Readiness

- [ ] T118 P0 - Add pricing plans and map each plan to enabled modules and limits.
- [ ] T119 P0 - Add tenant billing status screens and admin write-lock controls.
- [ ] T120 P1 - Add accountant workspace for managing multiple client tenants.
- [ ] T121 P1 - Add super-admin workspace for tenant support, subscription management, and compliance rule management.
- [ ] T122 P1 - Add customer support diagnostics view with audit logs, recent errors, and module usage.
- [ ] T123 P2 - Add in-app upgrade prompts tied to real feature gates instead of generic marketing.
