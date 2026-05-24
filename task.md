# Morocco ERP SaaS Improvement Backlog

This backlog contains concrete tasks to improve the app from the current working baseline into a stronger Morocco-focused ERP SaaS. Each task should ship with tenant isolation, role checks, validation, audit logging where relevant, and automated tests.

## Priority Legend

- P0: Required before serious customer pilots.
- P1: Strong product improvement for paid customers.
- P2: Competitive differentiator or scale hardening.

## Product And Onboarding

- [x] T001 P0 - Build a guided company onboarding wizard for ICE, IF, RC, Patente, CNSS number, VAT status, fiscal year, address, and invoice series.
- [x] T002 P0 - Add a tenant setup checklist that shows missing legal, accounting, payroll, and invoice configuration.
- [x] T003 P0 - Add a first-run demo data reset action for local and staging environments only.
- [x] T004 P1 - Add company profile editing with full audit history and approval state.
- [x] T005 P1 - Add French-first copy review across all screens and keep labels consistent with Moroccan business usage.
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
- [x] T026 P1 - Add lead pipeline with stages, next action date, owner, source, and expected value.
- [x] T027 P1 - Add customer statement export with invoices, payments, credit notes, and aging.

## Purchases, Suppliers, And Inventory

- [x] T028 P0 - Add supplier CRUD with ICE/IF, payment terms, contacts, and bank details.
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

## Customer Pilot Hardening

- [x] T124 P0 - Add a French CRM lead pipeline panel to the dashboard with stage, owner, source, next action, and expected value.
- [x] T125 P0 - Add a French supplier directory panel to the dashboard with ICE, IF, payment terms, and bank details.
- [x] T126 P0 - Add lead-to-quote conversion that creates or links the customer before issuing a quote.
- [x] T127 P0 - Add supplier duplicate detection by ICE/IF and warning states in the supplier form.
- [x] T128 P1 - Add Moroccan RIB format validation and bank-name normalization for suppliers.
- [x] T129 P1 - Add a unified business search across customers, prospects, suppliers, products, invoices, and orders.
- [x] T130 P1 - Add dashboard filters for overdue next actions, unpaid customer balances, and supplier payment terms.
- [x] T131 P1 - Add CSV import/export for leads and suppliers with validation summaries.
- [x] T132 P2 - Add lead source analytics by owner, expected value, won/lost rate, and month.
- [x] T133 P2 - Add supplier risk notes, preferred supplier flags, and document expiry reminders.
- [x] T134 P2 - Scan the codebase, locate the global style configuration file (e.g., tailwind.config.js, global.css, theme provider, or constants file), and        automatically update the colors to match this professional ERP palette.

                Color Specification:

                primary (Actions/CTA): #1E3A8A (Hover: #3B82F6)

                background-main: #F8FAFC

                background-surface (Cards/Tables): #FFFFFF

                border: #E2E8F0

                text-primary: #0F172A

                text-secondary (Labels/Placeholders): #475569

                status-success: Text #16A34A / Bg #DCFCE7

                status-warning: Text #D97706 / Bg #FEF3C7

                status-danger: Text #DC2626 / Bg #FEE2E2

                status-info: Text #2563EB / Bg #DBEAFE

                Execution Rules:

                Do not break existing layout structures or utility classes. Only replace or extend the color variables.

                Map these colors using clean, semantic names so they cascade correctly across the application (especially on tables, sidebar navigation, buttons, and form inputs).

                Modify the files directly. Once done, reply with a brief summary of the modified files and a diff of the changes.
- [x] T135 P2 - don't campact every module in one page . use sidebar to navigate between modules

## Additional Morocco ERP Hardening

- [x] T136 P1 - Add supplier risk reminder filters for expired, expiring, preferred, and noted suppliers.
- [x] T137 P1 - Add supplier document upload placeholders linked to each expiry reminder.
- [x] T138 P1 - Add customer document expiry reminders for ICE, RC, contracts, and payment guarantees.
- [x] T139 P1 - Add product margin alerts when sale price drops below purchase cost plus VAT.
- [ ] T140 P1 - Add customer credit-control holds that block new invoices when limits are exceeded.
- [ ] T141 P1 - Add configurable approval limits for quotes, credit notes, purchases, and stock adjustments.
- [ ] T142 P1 - Add per-role dashboard widgets for sales, stock, accounting, HR, and owner views.
- [ ] T143 P1 - Add payment reminder scheduling for overdue Moroccan customer invoices.
- [ ] T144 P1 - Add supplier payment calendar by due date, preferred status, and risk flags.
- [ ] T145 P1 - Add VAT declaration review checklist with supporting invoice counts and exceptions.
- [ ] T146 P1 - Add fiscal document completeness checks before period close.
- [ ] T147 P1 - Add duplicate customer detection by ICE, IF, phone, and email.
- [ ] T148 P1 - Add duplicate product detection by SKU, barcode, and normalized name.
- [ ] T149 P1 - Add customer and supplier timeline views for quotes, invoices, payments, notes, and documents.
- [ ] T150 P1 - Add internal notes and task assignments on customers, suppliers, invoices, and payroll runs.
- [ ] T151 P1 - Add bulk archive and restore flows for inactive customers, suppliers, and products.
- [ ] T152 P1 - Add stock reservation visibility from orders and POS tickets.
- [ ] T153 P1 - Add delivery route planning fields for Moroccan cities and delivery zones.
- [ ] T154 P1 - Add invoice email preview with French subject, legal footer, and attachment summary.
- [ ] T155 P1 - Add quote approval email preview and acceptance tracking.
- [ ] T156 P1 - Add customer statement aging PDF export with Moroccan legal identifiers.
- [ ] T157 P1 - Add supplier account statement export with purchase, payment, and balance lines.
- [ ] T158 P1 - Add payment method reconciliation views for cash, bank transfer, cheque, card, and mobile money.
- [ ] T159 P1 - Add cheque tracking with due date, bank, drawer, status, and deposit batch.
- [ ] T160 P1 - Add bank deposit batch workflow for cash and cheques.
- [ ] T161 P1 - Add cashbox transfer workflow between POS sessions and treasury accounts.
- [ ] T162 P1 - Add employee document reminders for CIN, CNSS card, contract, diploma, and medical visits.
- [ ] T163 P1 - Add payroll approval comments and rejection reasons.
- [ ] T164 P1 - Add payroll export archive with generated-by, generated-at, checksum, and period.
- [ ] T165 P1 - Add CNSS/Damancom preflight report for missing employee identifiers.
- [ ] T166 P1 - Add IR calculation explanation lines on payslips for accountant review.
- [ ] T167 P1 - Add leave calendar by department, employee, and approval status.
- [ ] T168 P1 - Add probation period reminders and contract renewal reminders.
- [ ] T169 P1 - Add purchase request workflow before purchase order approval.
- [ ] T170 P1 - Add supplier quote comparison matrix by price, delay, risk, and preferred flag.
- [ ] T171 P1 - Add landed cost allocation for import purchases and inventory valuation.
- [ ] T172 P1 - Add serial and lot tracking for inventory items that require traceability.
- [ ] T173 P1 - Add stock expiry date alerts for perishable or regulated goods.
- [ ] T174 P1 - Add inventory movement audit view with before and after quantities.
- [ ] T175 P1 - Add accounting anomaly checks for unbalanced journals and suspicious VAT rates.
- [ ] T176 P1 - Add accountant review queue for draft invoices, credit notes, payments, and payroll entries.
- [ ] T177 P1 - Add immutable numbering audit for invoices, credit notes, delivery notes, and receipts.
- [ ] T178 P1 - Add tenant data export manifest with files, checksums, and generated evidence.
- [ ] T179 P1 - Add user invitation workflow with role, tenant, expiry, and audit trail.
- [ ] T180 P1 - Add session revocation from admin security settings.
- [ ] T181 P1 - Add API rate limiting per tenant and per integration key.
- [ ] T182 P1 - Add webhook retry log with delivery attempts and signed payload previews.
- [ ] T183 P1 - Add background export status center for CSV, PDF, payroll, and declaration files.
- [ ] T184 P1 - Add guided onboarding progress by company type: trading, services, retail, payroll-heavy.
- [ ] T185 P1 - Add sample data reset options by module without deleting tenant legal configuration.
