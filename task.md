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
- [x] T006 P1 - Add Arabic-ready customer, supplier, employee, and document fields without forcing Arabic UI yet.
- [x] T007 P1 - Add import templates for customers, suppliers, products, employees, and chart of accounts.
- [x] T008 P2 - Add an implementation partner workspace to help onboard multiple client tenants.

## Auth, Tenanting, And Security

- [x] T009 P0 - Replace demo auth with password login, refresh tokens, password reset, and secure session storage.
- [x] T010 P0 - Add role-based navigation and route guards for owner, admin, accountant, sales, stock, HR, cashier, and read-only roles.
- [x] T011 P0 - Add server-side permission checks on every write endpoint.
- [x] T012 P0 - Add tenant isolation tests for every module controller and repository.
- [x] T013 P0 - Add audit log entries for login, configuration changes, invoice posting, payment posting, payroll run, and period locking.
- [x] T014 P1 - Add two-factor authentication for admin and accountant roles.
- [x] T015 P1 - Add IP/device history and suspicious login notifications.
- [x] T016 P1 - Add subscription feature gates that lock writes while keeping read/export access.
- [x] T017 P2 - Add data retention policies and tenant export/delete workflows.

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
- [x] T029 P0 - Add purchase order workflow with draft, approved, partially received, received, cancelled states.
- [x] T030 P0 - Add purchase receipt posting that updates stock and CUMP valuation.
- [x] T031 P0 - Add supplier invoice posting and payable balance update.
- [x] T032 P0 - Add stock adjustment workflow with reason codes and accounting entries.
- [x] T033 P0 - Add warehouse CRUD and stock per warehouse.
- [x] T034 P1 - Add stock transfer between warehouses with in-transit state.
- [x] T035 P1 - Add minimum stock alerts and replenishment suggestions.
- [x] T036 P1 - Add inventory count sheets with variance approval.
- [x] T037 P2 - Add barcode fields and scan-friendly product lookup.

## Accounting And Morocco Compliance

- [x] T038 P0 - Persist the PCGE chart of accounts and expose a searchable account selector.
- [x] T039 P0 - Add journal entry CRUD with balanced debit/credit validation.
- [x] T040 P0 - Add fiscal periods with open, soft-locked, locked, and closed states.
- [x] T041 P0 - Reject postings into locked periods across sales, purchases, stock, and payroll.
- [x] T042 P0 - Generate automatic entries for invoices, credit notes, payments, purchase receipts, supplier invoices, and stock adjustments.
- [x] T043 P0 - Add VAT report by period, rate, collected VAT, deductible VAT, and net payable/refundable amount.
- [x] T044 P0 - Version Moroccan tax and payroll rule packs in the database with effective dates.
- [x] T045 P0 - Add compliance rule validation before invoice and payroll posting.
- [x] T046 P1 - Add accounting export formats for accountant review and external tools.
- [x] T047 P1 - Add account reconciliation for bank, cash, receivables, and payables.
- [x] T048 P1 - Add period close checklist with unresolved documents, unposted drafts, and imbalance checks.
- [x] T049 P2 - Add legal evidence archive for generated declarations, exports, and submission statuses.

## Payroll And HR

- [x] T050 P0 - Add employee CRUD with CIN, CNSS number, contract type, hire date, salary, dependents, and address.
- [x] T051 P0 - Add employment contract records with start date, end date, salary history, and document attachments.
- [x] T052 P0 - Add monthly payroll run creation with draft, calculated, approved, posted, and cancelled states.
- [x] T053 P0 - Calculate gross salary, CNSS, AMO, IR, net salary, employer charges, and taxable base from versioned rules.
- [x] T054 P0 - Generate payslip PDF per employee and payroll summary per run.
- [x] T055 P0 - Generate Damancom export files and validate line length/format in tests.
- [x] T056 P1 - Add leave balance tracking, leave requests, approvals, and payroll impact.
- [x] T057 P1 - Add payroll accounting entries and reject posting to locked periods.
- [x] T058 P1 - Add employee portal access for payslips and leave requests.
- [x] T059 P2 - Add HR document expiry alerts for contracts, IDs, residence permits, and certifications.

## POS And Cash Operations

- [x] T060 P0 - Add cashier session open/close with expected cash and variance.
- [x] T061 P0 - Add POS ticket creation with stock deduction and payment capture.
- [x] T062 P0 - Add POS refund flow linked to original ticket and stock return.
- [x] T063 P1 - Add cash drawer movements for cash in, cash out, and expense payout.
- [x] T064 P1 - Add daily Z report with sales, VAT, payment methods, refunds, and cash variance.
- [x] T065 P2 - Add offline-ready POS queue with later sync and conflict handling.

## Production, Maintenance, Fleet, And Projects

- [x] T066 P1 - Add bill of materials for manufactured products.
- [x] T067 P1 - Add production order workflow with component issue, finished goods receipt, and cost rollup.
- [x] T068 P1 - Add maintenance asset registry, work orders, technician assignment, and cost tracking.
- [x] T069 P1 - Add fleet vehicle registry with documents, fuel logs, maintenance, and driver assignment.
- [x] T070 P1 - Add project CRUD with customer, budget, tasks, expenses, timesheets, and invoice milestones.
- [x] T071 P2 - Add profitability view across production orders, assets, vehicles, and projects.

## Documents, PDFs, And Exports

- [x] T072 P0 - Generate compliant invoice PDFs with tenant legal identifiers, customer identifiers, line VAT, totals, and numbering.
- [x] T073 P0 - Add PDF generation tests that assert required invoice mentions are present.
- [x] T074 P1 - Add quote, delivery note, credit note, purchase order, receipt, and payslip PDFs.
- [x] T075 P1 - Add document numbering settings per type and fiscal year.
- [x] T076 P1 - Add file storage abstraction with local storage for dev and object storage adapter for production.
- [x] T077 P2 - Add document templates with tenant logo, legal footer, and bilingual-ready fields.

## Frontend UX And Design

- [x] T078 P0 - Replace static dashboard data flow with the Next.js app as the primary browser entry point.
- [x] T079 P0 - Add module-specific list/detail/create/edit screens for sales, stock, accounting, payroll, POS, and CRM.
- [x] T080 P0 - Add consistent empty, loading, error, success, and forbidden states.
- [x] T081 P0 - Add form validation messages mapped to backend DTO validation.
- [x] T082 P1 - Add global command/search for customers, invoices, products, suppliers, employees, and journal entries.
- [x] T083 P1 - Add saved filters, column visibility, and export buttons on dense tables.
- [x] T084 P1 - Add responsive tablet/mobile layouts for approval, lookup, and POS workflows.
- [x] T085 P1 - Add keyboard-friendly data entry for invoice lines, payment lines, and journal lines.
- [x] T086 P2 - Add dashboard personalization by role and tenant plan.

## Reporting And Analytics

- [x] T087 P0 - Add sales dashboard by period, customer, product, VAT rate, and unpaid balance.
- [x] T088 P0 - Add inventory valuation report by warehouse and product.
- [x] T089 P0 - Add receivables and payables aging reports.
- [x] T090 P1 - Add profit and loss report from journal entries.
- [x] T091 P1 - Add balance sheet report from journal entries.
- [x] T092 P1 - Add payroll cost report by period, employee, department, and employer charges.
- [x] T093 P2 - Add cohort metrics for SaaS usage, activation, retention, and module adoption.

## Integrations And Adapters

- [x] T094 P0 - Define DGI adapter interface for validate, render, submit, poll status, and archive evidence.
- [x] T095 P0 - Define CNSS adapter interface for validate, render, submit, poll status, and archive evidence.
- [x] T096 P1 - Add bank import adapter for CSV/OFX-style statements and reconciliation.
- [x] T097 P1 - Add email delivery adapter for invoices, statements, payslips, and reminders.
- [x] T098 P1 - Add webhook events for invoice posted, payment received, payroll posted, and stock low.
- [x] T099 P2 - Add API keys and scoped partner API access.

## Testing And Quality

- [x] T100 P0 - Add integration tests for every controller with success, validation error, RBAC, and tenant isolation cases.
- [x] T101 P0 - Add service tests for invoice numbering, VAT totals, stock CUMP, period locks, and payroll calculations.
- [x] T102 P0 - Add Playwright smoke tests for onboarding, customer creation, product creation, invoice creation, payment capture, and payroll run.
- [x] T103 P0 - Add seed-based acceptance scenarios for a trading company, a service company, and a payroll-heavy company.
- [x] T104 P1 - Add mutation-safe tests for rollback when accounting entries fail after inventory or sales operations.
- [x] T105 P1 - Add frontend component tests for forms, tables, navigation, and error states.
- [x] T106 P1 - Add accessibility checks for navigation, dialogs, forms, tables, and keyboard flows.
- [x] T107 P2 - Add performance tests for large tenants with many invoices, journal lines, employees, and stock moves.

## Infrastructure, Deployment, And Operations

- [x] T108 P0 - Add production PostgreSQL configuration and Prisma migration workflow.
- [x] T109 P0 - Add environment validation for API URLs, database URL, auth secrets, storage config, and allowed origins.
- [x] T110 P0 - Add Docker compose profiles for dev, test, and local production simulation.
- [x] T111 P0 - Add CI pipeline for install, lint, build, backend tests, frontend tests, and Playwright smoke tests.
- [x] T112 P1 - Add structured logging with tenant ID, request ID, user ID, module, and action.
- [x] T113 P1 - Add metrics for API latency, error rates, job failures, and queue depth.
- [x] T114 P1 - Add backup and restore procedure for tenant data.
- [x] T115 P1 - Add staging deployment with seeded demo tenant and protected admin access.
- [x] T116 P2 - Add background job queue for PDFs, exports, emails, declarations, and imports.
- [x] T117 P2 - Add feature flag system for phased module rollout.

## Commercial Readiness

- [x] T118 P0 - Add pricing plans and map each plan to enabled modules and limits.
- [x] T119 P0 - Add tenant billing status screens and admin write-lock controls.
- [x] T120 P1 - Add accountant workspace for managing multiple client tenants.
- [x] T121 P1 - Add super-admin workspace for tenant support, subscription management, and compliance rule management.
- [x] T122 P1 - Add customer support diagnostics view with audit logs, recent errors, and module usage.
- [x] T123 P2 - Add in-app upgrade prompts tied to real feature gates instead of generic marketing.

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
- [x] T1351 P2 - each module should have it's own page not everything in index.html

## Additional Morocco ERP Hardening

- [x] T136 P1 - Add supplier risk reminder filters for expired, expiring, preferred, and noted suppliers.
- [x] T137 P1 - Add supplier document upload placeholders linked to each expiry reminder.
- [x] T138 P1 - Add customer document expiry reminders for ICE, RC, contracts, and payment guarantees.
- [x] T139 P1 - Add product margin alerts when sale price drops below purchase cost plus VAT.
- [x] T140 P1 - Add customer credit-control holds that block new invoices when limits are exceeded.
- [x] T141 P1 - Add configurable approval limits for quotes, credit notes, purchases, and stock adjustments.
- [x] T142 P1 - Add per-role dashboard widgets for sales, stock, accounting, HR, and owner views.
- [x] T143 P1 - Add payment reminder scheduling for overdue Moroccan customer invoices.
- [x] T144 P1 - Add supplier payment calendar by due date, preferred status, and risk flags.
- [x] T145 P1 - Add VAT declaration review checklist with supporting invoice counts and exceptions.
- [x] T146 P1 - Add fiscal document completeness checks before period close.
- [x] T147 P1 - Add duplicate customer detection by ICE, IF, phone, and email.
- [x] T148 P1 - Add duplicate product detection by SKU, barcode, and normalized name.
- [x] T149 P1 - Add customer and supplier timeline views for quotes, invoices, payments, notes, and documents.
- [x] T150 P1 - Add internal notes and task assignments on customers, suppliers, invoices, and payroll runs.
- [x] T151 P1 - Add bulk archive and restore flows for inactive customers, suppliers, and products.
- [x] T152 P1 - Add stock reservation visibility from orders and POS tickets.
- [x] T153 P1 - Add delivery route planning fields for Moroccan cities and delivery zones.
- [x] T154 P1 - Add invoice email preview with French subject, legal footer, and attachment summary.
- [x] T155 P1 - Add quote approval email preview and acceptance tracking.
- [x] T156 P1 - Add customer statement aging PDF export with Moroccan legal identifiers.
- [x] T157 P1 - Add supplier account statement export with purchase, payment, and balance lines.
- [x] T158 P1 - Add payment method reconciliation views for cash, bank transfer, cheque, card, and mobile money.
- [x] T159 P1 - Add cheque tracking with due date, bank, drawer, status, and deposit batch.
- [x] T160 P1 - Add bank deposit batch workflow for cash and cheques.
- [x] T161 P1 - Add cashbox transfer workflow between POS sessions and treasury accounts.
- [x] T162 P1 - Add employee document reminders for CIN, CNSS card, contract, diploma, and medical visits.
- [x] T163 P1 - Add payroll approval comments and rejection reasons.
- [x] T164 P1 - Add payroll export archive with generated-by, generated-at, checksum, and period.
- [x] T165 P1 - Add CNSS/Damancom preflight report for missing employee identifiers.
- [x] T166 P1 - Add IR calculation explanation lines on payslips for accountant review.
- [x] T167 P1 - Add leave calendar by department, employee, and approval status.
- [x] T168 P1 - Add probation period reminders and contract renewal reminders.
- [x] T169 P1 - Add purchase request workflow before purchase order approval.
- [x] T170 P1 - Add supplier quote comparison matrix by price, delay, risk, and preferred flag.
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

## Competitive SaaS Depth

- [ ] T186 P1 - Add tenant-specific KPI targets and variance tracking by module owner.
- [ ] T187 P1 - Add executive daily digest for cash, overdue invoices, stock alerts, payroll, and approvals.
- [ ] T188 P1 - Add accountant evidence binder generation per fiscal period.
- [ ] T189 P1 - Add Moroccan city and region reference data for addresses, delivery, and reporting.
- [ ] T190 P1 - Add customer risk scoring using overdue balance, document age, and credit-limit usage.
- [ ] T191 P1 - Add supplier reliability scoring using delivery delays, document status, and purchase volume.
- [ ] T192 P1 - Add product lifecycle states for draft, active, blocked, discontinued, and archived.
- [ ] T193 P1 - Add stock quarantine workflow for damaged, returned, or compliance-held goods.
- [ ] T194 P1 - Add delivery proof capture placeholders with signer, timestamp, and document reference.
- [ ] T195 P1 - Add sales commission report by salesperson, margin, payment status, and period.
- [ ] T196 P1 - Add customer contract register with renewal, price list, and credit-term reminders.
- [ ] T197 P1 - Add supplier contract register with renewal, SLA, payment terms, and document checks.
- [ ] T198 P1 - Add pricing rules by customer segment, product family, date range, and quantity break.
- [ ] T199 P1 - Add discount approval workflow by threshold, role, and margin impact.
- [ ] T200 P1 - Add stock reservation expiry and automatic release for stale sales orders.
- [ ] T201 P1 - Add batch invoice generation for recurring services and subscriptions.
- [ ] T202 P1 - Add recurring purchase schedule for rent, utilities, insurance, and service contracts.
- [ ] T203 P1 - Add expense claim workflow with categories, receipts, approval, and accounting export.
- [ ] T204 P1 - Add petty cash journal with opening balance, movements, attachments, and variance.
- [ ] T205 P1 - Add bank statement matching suggestions by amount, date, customer, supplier, and reference.
- [ ] T206 P1 - Add VAT exception drilldown by invoice, customer, product rate, and missing identifier.
- [ ] T207 P1 - Add CNSS employee anomaly drilldown for missing identifiers and inconsistent salary bases.
- [ ] T208 P1 - Add payroll variance report compared with previous month and contract salary.
- [ ] T209 P1 - Add employee onboarding checklist with documents, contract, payroll identifiers, and equipment.
- [ ] T210 P1 - Add employee offboarding checklist with final payroll, asset return, and document archive.
- [ ] T211 P1 - Add HR disciplinary and performance note register with role-restricted visibility.
- [ ] T212 P1 - Add asset assignment tracking for laptops, phones, vehicles, tools, and return status.
- [ ] T213 P1 - Add fleet fuel efficiency report by vehicle, driver, route, and month.
- [ ] T214 P1 - Add maintenance preventive schedule with recurrence, parts, labor, and downtime.
- [ ] T215 P1 - Add project WIP report with costs, billings, milestones, and margin forecast.
- [ ] T216 P1 - Add production variance report for planned versus actual component usage and cost.
- [ ] T217 P1 - Add procurement budget controls by department, supplier, category, and period.
- [ ] T218 P1 - Add multi-branch support with branch-specific stock, sales, POS, and cash accounts.
- [ ] T219 P1 - Add tenant localization settings for French, Arabic-ready labels, date formats, and currencies.
- [ ] T220 P1 - Add document template preview before activation with sample Moroccan invoice data.
- [ ] T221 P1 - Add outgoing email audit trail with recipient, document, status, and retry history.
- [ ] T222 P1 - Add customer portal invoice payment status and statement download workflow.
- [ ] T223 P1 - Add supplier portal quote request, document upload, and payment status workflow.
- [ ] T224 P1 - Add accountant portal period review comments and approval checklist.
- [ ] T225 P1 - Add partner implementation checklist with tenant health, open blockers, and go-live readiness.
- [ ] T226 P1 - Add super-admin compliance rule rollout workflow with effective dates and tenant impact.
- [ ] T227 P1 - Add feature flag audit history with actor, reason, tenant, and rollback data.
- [ ] T228 P1 - Add API integration health dashboard with latency, failures, retries, and last success.
- [ ] T229 P1 - Add webhook signature verification examples and replay protection tests.
- [ ] T230 P1 - Add export checksum verification and tamper-evidence report for archived files.
- [ ] T231 P1 - Add database restore rehearsal checklist and tenant-level restore validation.
- [ ] T232 P1 - Add support impersonation approval workflow with time limit and audit evidence.
- [ ] T233 P1 - Add in-app release notes targeted by role, module, and tenant plan.
- [ ] T234 P1 - Add usage-based onboarding nudges from real module adoption signals.
- [ ] T235 P1 - Add competitive readiness scorecard comparing ERP module depth, compliance, and onboarding risk.

## Enterprise Expansion Backlog

- [ ] T236 P1 - Add workflow SLA timers for quotes, deliveries, invoices, purchases, payroll approvals, and support tickets.
- [ ] T237 P1 - Add configurable escalation rules by tenant role, amount, customer risk, supplier risk, and overdue days.
- [ ] T238 P1 - Add multi-currency quote and invoice preparation with MAD accounting base and FX revaluation evidence.
- [ ] T239 P1 - Add branch-level invoice numbering policies with Moroccan legal identifier validation.
- [ ] T240 P1 - Add regional sales heatmap by Moroccan city, region, product family, and salesperson.
- [ ] T241 P1 - Add customer onboarding KYC checklist for ICE, IF, RC, address, bank references, and signed terms.
- [ ] T242 P1 - Add supplier onboarding KYS checklist for tax certificate, CNSS certificate, RIB, contracts, and risk approvals.
- [ ] T243 P1 - Add customer dispute case tracking linked to invoices, credit notes, documents, and collection status.
- [ ] T244 P1 - Add supplier dispute case tracking linked to receipts, invoices, payments, and blocked purchase approvals.
- [ ] T245 P1 - Add collection promise-to-pay tracking with commitments, reminders, broken promises, and next action owners.
- [ ] T246 P1 - Add payment allocation rules for partial payments across oldest invoice, selected invoice, or manual split.
- [ ] T247 P1 - Add customer dunning levels with French email templates, legal footer, and account hold policy.
- [ ] T248 P1 - Add supplier payment proposal run with due-date cutoffs, risk flags, cash balance, and approval status.
- [ ] T249 P1 - Add cheque lifecycle audit from receipt to deposit, clearing, rejection, and customer notification.
- [ ] T250 P1 - Add bank fee and withholding tax handling on payments with accounting entry suggestions.
- [ ] T251 P1 - Add stock reservation aging report by order, customer, product, warehouse, and expiry policy.
- [ ] T252 P1 - Add customer-specific delivery instructions and route constraints for Moroccan cities.
- [ ] T253 P1 - Add transporter registry with vehicle, driver, license, insurance, and delivery performance metrics.
- [ ] T254 P1 - Add delivered-not-invoiced and invoiced-not-delivered exception reports.
- [ ] T255 P1 - Add procurement requisition approval matrix by department, budget owner, amount, and category.
- [ ] T256 P1 - Add supplier price history per product with last price, average price, delay, and variance alerts.
- [ ] T257 P1 - Add substitute product recommendations for stockouts using margin, availability, and customer segment.
- [ ] T258 P1 - Add inventory dead-stock report by last sale date, stock value, and recommended action.
- [ ] T259 P1 - Add CUMP recalculation rehearsal report with before/after valuation and locked-period protection.
- [ ] T260 P1 - Add accounting attachment requirements by journal type, amount threshold, and Moroccan evidence category.
- [ ] T261 P1 - Add pre-closing accrual suggestions for rent, utilities, salaries, purchases, and recurring services.
- [ ] T262 P1 - Add tax calendar with VAT, IR, CNSS, IS, and payroll declaration deadlines for Moroccan SMEs.
- [ ] T263 P1 - Add compliance owner assignments and reminders for tax declarations, payroll exports, and evidence archives.
- [ ] T264 P1 - Add payroll loan and advance tracking with monthly deduction limits and approval evidence.
- [ ] T265 P1 - Add employee expense reimbursement through payroll or accounts payable with journal linkage.
- [ ] T266 P1 - Add overtime approval workflow with department, reason, rate, and payroll impact.
- [ ] T267 P1 - Add employee contract amendment workflow with salary history, effective dates, and signed document evidence.
- [ ] T268 P1 - Add payroll social declaration reconciliation between payslips, Damancom exports, and accounting entries.
- [ ] T269 P1 - Add role-restricted HR audit trail for salary, disciplinary, medical, and identity document changes.
- [ ] T270 P1 - Add project retainer and milestone billing with revenue recognition notes for accountant review.
- [ ] T271 P1 - Add service contract recurring billing with automatic draft invoices and renewal reminders.
- [ ] T272 P1 - Add warranty and after-sales service cases linked to products, serials, invoices, and stock replacements.
- [ ] T273 P1 - Add production quality checks with pass/fail, scrap quantity, rework cost, and traceability evidence.
- [ ] T274 P1 - Add maintenance spare-parts reservation and consumption with CUMP valuation.
- [ ] T275 P1 - Add fleet fines, tolls, insurance renewals, and accident case tracking.
- [ ] T276 P1 - Add tenant-specific approval delegation during absences with date range and audit trail.
- [ ] T277 P1 - Add granular API keys by module scope, tenant, expiry, IP allowlist, and last-used evidence.
- [ ] T278 P1 - Add import validation sandbox that previews customer, supplier, product, payroll, and accounting CSV errors.
- [ ] T279 P1 - Add export center filters by period, module, status, checksum, requester, and evidence archive.
- [ ] T280 P1 - Add automatic data quality score for tenant identifiers, duplicate records, missing documents, and stale actions.
- [ ] T281 P1 - Add guided accountant handoff pack with trial balance, VAT review, payroll exports, and unresolved blockers.
- [ ] T282 P1 - Add implementation partner margin and workload dashboard by tenant, phase, blocker, and go-live date.
- [ ] T283 P1 - Add support ticket intake from tenant users with module context, screenshots, severity, and SLA.
- [ ] T284 P1 - Add admin health checks for queues, scheduled jobs, exports, email delivery, and adapter availability.
- [ ] T285 P1 - Add tenant resilience runbook status covering backups, restore rehearsal, legal archive, and incident contacts.

## Morocco Competitive Edge Backlog

- [ ] T286 P1 - Add Moroccan VAT prorata management for partially deductible purchases and mixed activity tenants.
- [ ] T287 P1 - Add simplified IS estimate dashboard with installments, taxable result adjustments, and evidence notes.
- [ ] T288 P1 - Add professional tax tracking by establishment, city, rental value, and due date.
- [ ] T289 P1 - Add tenant-level DGI declaration calendar with VAT, IS, IR salaries, and supporting evidence.
- [ ] T290 P1 - Add CNSS anomaly detector for missing affiliation, duplicate CNSS numbers, and invalid salary bases.
- [ ] T291 P1 - Add AMO reconciliation between payroll slips, employer charges, and Damancom export totals.
- [ ] T292 P1 - Add Moroccan public holiday calendar with payroll, leave, and delivery planning impact.
- [ ] T293 P1 - Add Moroccan city and region reference data for customers, suppliers, deliveries, and analytics.
- [ ] T294 P1 - Add Arabic invoice rendering QA with RTL fields, legal footer, and PDF snapshot tests.
- [ ] T295 P1 - Add bilingual customer statement PDF with aging, payment promises, and legal identifiers.
- [ ] T296 P1 - Add supplier statement reconciliation PDF with receipts, invoices, payments, and disputed lines.
- [ ] T297 P1 - Add bank RIB ownership verification workflow with document evidence and approval history.
- [ ] T298 P1 - Add cheque portfolio dashboard with deposit slips, due dates, bounced cheques, and alerts.
- [ ] T299 P1 - Add cash box daily approval workflow with cashier, supervisor, variance, and accounting entry.
- [ ] T300 P1 - Add POS receipt legal footer templates for Morocco with ICE, IF, RC, and VAT display.
- [ ] T301 P1 - Add stock lot and expiry tracking for food, cosmetics, pharma-like goods, and traceability exports.
- [ ] T302 P1 - Add serial number tracking for electronics, warranties, repairs, and after-sales cases.
- [ ] T303 P1 - Add landed cost allocation for imports by customs duty, freight, transit, insurance, and CUMP impact.
- [ ] T304 P1 - Add import declaration evidence archive with DUM reference, supplier, shipment, and customs documents.
- [ ] T305 P1 - Add supplier risk score using expired documents, payment incidents, lead time variance, and disputes.
- [ ] T306 P1 - Add customer credit score using aging, broken promises, disputes, returned cheques, and concentration risk.
- [ ] T307 P1 - Add approval matrix simulator for Moroccan SME roles, amount thresholds, module, and branch.
- [ ] T308 P1 - Add accountant workspace review mode with comments per journal, invoice, payroll run, and period.
- [ ] T309 P1 - Add fiscal lock exception workflow with reason, approver, time limit, and reverse audit evidence.
- [ ] T310 P1 - Add accounting trial balance report by PCGE class, period, debit, credit, and balance.
- [ ] T311 P1 - Add general ledger report with account drilldown, source document links, and export checksum.
- [ ] T312 P1 - Add auxiliary customer ledger with invoice, credit note, payment, and residual balance per customer.
- [ ] T313 P1 - Add auxiliary supplier ledger with receipt, supplier invoice, payment, and residual balance per supplier.
- [ ] T314 P1 - Add Moroccan invoice numbering audit report for gaps, duplicates, cancelled documents, and fiscal year.
- [ ] T315 P1 - Add document cancellation workflow with reason, reversal entries, stock rollback, and legal archive.
- [ ] T316 P1 - Add warehouse transfer approval for controlled products, high value moves, and branch restrictions.
- [ ] T317 P1 - Add inventory valuation snapshots at period close with CUMP, quantity, value, and lock evidence.
- [ ] T318 P1 - Add stock negative prevention report by module, user, product, and attempted transaction.
- [ ] T319 P1 - Add payroll variance report comparing current month with previous month by employee and contribution.
- [ ] T320 P1 - Add employee contract renewal workflow with alerts, signed documents, salary change, and audit.
- [ ] T321 P1 - Add employee absence import sandbox with validation, payroll impact preview, and approval.
- [ ] T322 P1 - Add payroll journal preview before posting with PCGE accounts and lock-period validation.
- [ ] T323 P1 - Add payroll evidence pack per month with payslips, Damancom file, journal, and checksums.
- [ ] T324 P1 - Add DGI adapter sandbox log with payload rendering, validation errors, submission state, and archive.
- [ ] T325 P1 - Add CNSS adapter sandbox log with Damancom validation, line errors, submission state, and archive.
- [ ] T326 P1 - Add bank statement import preview with duplicates, unknown counterparties, and suggested matches.
- [ ] T327 P1 - Add automated payment matching for invoices using amount, reference, customer RIB, and date window.
- [ ] T328 P1 - Add payment allocation audit with before/after residuals and reviewer approval for manual overrides.
- [ ] T329 P1 - Add SaaS plan comparison enforcement with module limits, record limits, and export permissions.
- [ ] T330 P1 - Add tenant billing usage meter for invoices, payslips, storage, exports, and active users.
- [ ] T331 P1 - Add implementation go-live risk radar by missing legal IDs, stock quality, payroll readiness, and integrations.
- [ ] T332 P1 - Add guided demo scenarios for trading, services, payroll-heavy, POS retail, and production tenants.
- [ ] T333 P1 - Add competitive migration importer for common Moroccan Excel templates and legacy ERP exports.
- [ ] T334 P1 - Add data quality auto-fix suggestions for duplicate tiers, missing ICE, invalid RIB, and inactive products.
- [ ] T335 P1 - Add executive compliance cockpit with tax calendar, pending evidence, locked periods, and risk alerts.

## Morocco Scale-Up Backlog

- [ ] T336 P1 - Add branch and establishment registry with IF/RC/patente references, city, manager, and invoice series policy.
- [ ] T337 P1 - Add multi-branch stock visibility with transfer lead times, branch reorder thresholds, and exception alerts.
- [ ] T338 P1 - Add Moroccan delivery zone pricing by city, route, weight band, delivery promise, and transporter.
- [ ] T339 P1 - Add customer sector classification for Moroccan SME analytics, risk scoring, and benchmark dashboards.
- [ ] T340 P1 - Add supplier compliance vault with tax certificate, CNSS certificate, RIB, contract, and renewal workflow.
- [ ] T341 P1 - Add delegated approval chains for branch managers, accountants, HR managers, and substitute approvers.
- [ ] T342 P1 - Add role-based document redaction for salary, tax ID, bank RIB, and private HR evidence.
- [ ] T343 P1 - Add accounting attachment OCR queue with manual verification, confidence score, and journal linking.
- [ ] T344 P1 - Add cash collection route planning with collector assignment, receipt numbers, and variance review.
- [ ] T345 P1 - Add customer credit insurance fields with insurer, covered amount, expiry date, and blocked exposure.
- [ ] T346 P1 - Add customer guarantee register for deposits, bank guarantees, signed contracts, and release dates.
- [ ] T347 P1 - Add supplier advance payment tracking with PO linkage, residual balance, and approval evidence.
- [ ] T348 P1 - Add purchase landed-cost simulation before receipt with customs, freight, transit, insurance, and VAT treatment.
- [ ] T349 P1 - Add inventory ABC classification by value, margin, velocity, and Moroccan warehouse location.
- [ ] T350 P1 - Add cycle count schedule by warehouse, family, risk level, and last count variance.
- [ ] T351 P1 - Add stock damage claim workflow with photo evidence placeholder, root cause, and accounting impact.
- [ ] T352 P1 - Add product substitute mapping with stockout recommendation, margin comparison, and customer restrictions.
- [ ] T353 P1 - Add customer price list import with date ranges, quantity breaks, and approval audit.
- [ ] T354 P1 - Add margin guardrails for quotes, orders, POS sales, and project milestones.
- [ ] T355 P1 - Add sales target dashboard by branch, salesperson, product family, and Moroccan region.
- [ ] T356 P1 - Add sales commission accrual workflow with invoice payment dependency and accountant approval.
- [ ] T357 P1 - Add receivable collection queue with promised date, dispute status, dunning level, and next owner.
- [ ] T358 P1 - Add customer dispute resolution SLA with root cause, credit note decision, and legal evidence.
- [ ] T359 P1 - Add supplier dispute resolution SLA with blocked payments, receipt exceptions, and settlement notes.
- [ ] T360 P1 - Add treasury cash position dashboard combining banks, cashboxes, cheques, and planned payments.
- [ ] T361 P1 - Add cheque deposit slip generation with bank, agency, cheque list, and reconciliation status.
- [ ] T362 P1 - Add bounced cheque workflow with fees, customer notification, hold policy, and accounting proposal.
- [ ] T363 P1 - Add bank statement categorization rules by wording, amount, counterparty RIB, and tenant branch.
- [ ] T364 P1 - Add recurring expense calendar for rent, telecom, insurance, leasing, utilities, and tax installments.
- [ ] T365 P1 - Add expense approval matrix by category, project, branch, amount, and budget owner.
- [ ] T366 P1 - Add employee advance request workflow with repayment plan, payroll deduction, and approval evidence.
- [ ] T367 P1 - Add employee loan ledger with outstanding balance, monthly deduction cap, and payslip explanation.
- [ ] T368 P1 - Add overtime planning and approval with department budget, rate multiplier, and payroll impact preview.
- [ ] T369 P1 - Add attendance import validation for biometric devices with anomaly flags and payroll impact.
- [ ] T370 P1 - Add leave calendar conflict detection for departments, public holidays, and critical roles.
- [ ] T371 P1 - Add CNSS registration checklist for new hires with missing identifier and contract evidence.
- [ ] T372 P1 - Add employee offboarding workflow with final payroll, asset return, document archive, and access revocation.
- [ ] T373 P1 - Add maintenance spare part consumption with warehouse deduction, CUMP valuation, and work order cost rollup.
- [ ] T374 P1 - Add fleet document alerts for insurance, vignette, technical inspection, authorization, and driver license.
- [ ] T375 P1 - Add fleet accident case workflow with photos placeholder, insurance claim, repair order, and cost tracking.
- [ ] T376 P1 - Add production quality checklist with scrap, rework, pass/fail result, and finished-goods hold.
- [ ] T377 P1 - Add production capacity planning by workstation, operator, shift, and component availability.
- [ ] T378 P1 - Add project change request workflow with budget delta, deadline impact, customer approval, and invoice effect.
- [ ] T379 P1 - Add project WIP dashboard with earned value, unbilled costs, milestone risk, and accountant notes.
- [ ] T380 P1 - Add customer portal invoice view with statement, payment promises, dispute messages, and file evidence.
- [ ] T381 P1 - Add supplier portal document upload placeholder with validation status and renewal reminders.
- [ ] T382 P1 - Add tenant data room for accountant handoff with period packs, evidence checklists, and checksums.
- [ ] T383 P1 - Add implementation checklist templates by industry: retail, wholesale, services, manufacturing, and construction.
- [ ] T384 P1 - Add usage telemetry dashboard for module adoption, dormant users, failed actions, and training needs.
- [ ] T385 P1 - Add competitive gap heatmap against Odoo, Sage, Cegid, Zoho, and local Moroccan ERP alternatives.
