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
- [x] T171 P1 - Add landed cost allocation for import purchases and inventory valuation.
- [x] T172 P1 - Add serial and lot tracking for inventory items that require traceability.
- [x] T173 P1 - Add stock expiry date alerts for perishable or regulated goods.
- [x] T174 P1 - Add inventory movement audit view with before and after quantities.
- [x] T175 P1 - Add accounting anomaly checks for unbalanced journals and suspicious VAT rates.
- [x] T176 P1 - Add accountant review queue for draft invoices, credit notes, payments, and payroll entries.
- [x] T177 P1 - Add immutable numbering audit for invoices, credit notes, delivery notes, and receipts.
- [x] T178 P1 - Add tenant data export manifest with files, checksums, and generated evidence.
- [x] T179 P1 - Add user invitation workflow with role, tenant, expiry, and audit trail.
- [x] T180 P1 - Add session revocation from admin security settings.
- [x] T181 P1 - Add API rate limiting per tenant and per integration key.
- [x] T182 P1 - Add webhook retry log with delivery attempts and signed payload previews.
- [x] T183 P1 - Add background export status center for CSV, PDF, payroll, and declaration files.
- [x] T184 P1 - Add guided onboarding progress by company type: trading, services, retail, payroll-heavy.
- [x] T185 P1 - Add sample data reset options by module without deleting tenant legal configuration.

## Competitive SaaS Depth

- [x] T186 P1 - Add tenant-specific KPI targets and variance tracking by module owner.
- [x] T187 P1 - Add executive daily digest for cash, overdue invoices, stock alerts, payroll, and approvals.
- [x] T188 P1 - Add accountant evidence binder generation per fiscal period.
- [x] T189 P1 - Add Moroccan city and region reference data for addresses, delivery, and reporting.
- [x] T190 P1 - Add customer risk scoring using overdue balance, document age, and credit-limit usage.
- [x] T191 P1 - Add supplier reliability scoring using delivery delays, document status, and purchase volume.
- [x] T192 P1 - Add product lifecycle states for draft, active, blocked, discontinued, and archived.
- [x] T193 P1 - Add stock quarantine workflow for damaged, returned, or compliance-held goods.
- [x] T194 P1 - Add delivery proof capture placeholders with signer, timestamp, and document reference.
- [x] T195 P1 - Add sales commission report by salesperson, margin, payment status, and period.
- [x] T196 P1 - Add customer contract register with renewal, price list, and credit-term reminders.
- [x] T197 P1 - Add supplier contract register with renewal, SLA, payment terms, and document checks.
- [x] T198 P1 - Add pricing rules by customer segment, product family, date range, and quantity break.
- [x] T199 P1 - Add discount approval workflow by threshold, role, and margin impact.
- [x] T200 P1 - Add stock reservation expiry and automatic release for stale sales orders.
- [x] T201 P1 - Add batch invoice generation for recurring services and subscriptions.
- [x] T202 P1 - Add recurring purchase schedule for rent, utilities, insurance, and service contracts.
- [x] T203 P1 - Add expense claim workflow with categories, receipts, approval, and accounting export.
- [x] T204 P1 - Add petty cash journal with opening balance, movements, attachments, and variance.
- [x] T205 P1 - Add bank statement matching suggestions by amount, date, customer, supplier, and reference.
- [x] T206 P1 - Add VAT exception drilldown by invoice, customer, product rate, and missing identifier.
- [x] T207 P1 - Add CNSS employee anomaly drilldown for missing identifiers and inconsistent salary bases.
- [x] T208 P1 - Add payroll variance report compared with previous month and contract salary.
- [x] T209 P1 - Add employee onboarding checklist with documents, contract, payroll identifiers, and equipment.
- [x] T210 P1 - Add employee offboarding checklist with final payroll, asset return, and document archive.
- [x] T211 P1 - Add HR disciplinary and performance note register with role-restricted visibility.
- [x] T212 P1 - Add asset assignment tracking for laptops, phones, vehicles, tools, and return status.
- [x] T213 P1 - Add fleet fuel efficiency report by vehicle, driver, route, and month.
- [x] T214 P1 - Add maintenance preventive schedule with recurrence, parts, labor, and downtime.
- [x] T215 P1 - Add project WIP report with costs, billings, milestones, and margin forecast.
- [x] T216 P1 - Add production variance report for planned versus actual component usage and cost.
- [x] T217 P1 - Add procurement budget controls by department, supplier, category, and period.
- [x] T218 P1 - Add multi-branch support with branch-specific stock, sales, POS, and cash accounts.
- [x] T219 P1 - Add tenant localization settings for French, Arabic-ready labels, date formats, and currencies.
- [x] T220 P1 - Add document template preview before activation with sample Moroccan invoice data.
- [x] T221 P1 - Add outgoing email audit trail with recipient, document, status, and retry history.
- [x] T222 P1 - Add customer portal invoice payment status and statement download workflow.
- [x] T223 P1 - Add supplier portal quote request, document upload, and payment status workflow.
- [x] T224 P1 - Add accountant portal period review comments and approval checklist.
- [x] T225 P1 - Add partner implementation checklist with tenant health, open blockers, and go-live readiness.
- [x] T226 P1 - Add super-admin compliance rule rollout workflow with effective dates and tenant impact.
- [x] T227 P1 - Add feature flag audit history with actor, reason, tenant, and rollback data.
- [x] T228 P1 - Add API integration health dashboard with latency, failures, retries, and last success.
- [x] T229 P1 - Add webhook signature verification examples and replay protection tests.
- [x] T230 P1 - Add export checksum verification and tamper-evidence report for archived files.
- [x] T231 P1 - Add database restore rehearsal checklist and tenant-level restore validation.
- [x] T232 P1 - Add support impersonation approval workflow with time limit and audit evidence.
- [x] T233 P1 - Add in-app release notes targeted by role, module, and tenant plan.
- [x] T234 P1 - Add usage-based onboarding nudges from real module adoption signals.
- [x] T235 P1 - Add competitive readiness scorecard comparing ERP module depth, compliance, and onboarding risk.

## Enterprise Expansion Backlog

- [x] T236 P1 - Add workflow SLA timers for quotes, deliveries, invoices, purchases, payroll approvals, and support tickets.
- [x] T237 P1 - Add configurable escalation rules by tenant role, amount, customer risk, supplier risk, and overdue days.
- [x] T238 P1 - Add multi-currency quote and invoice preparation with MAD accounting base and FX revaluation evidence.
- [x] T239 P1 - Add branch-level invoice numbering policies with Moroccan legal identifier validation.
- [x] T240 P1 - Add regional sales heatmap by Moroccan city, region, product family, and salesperson.
- [x] T241 P1 - Add customer onboarding KYC checklist for ICE, IF, RC, address, bank references, and signed terms.
- [x] T242 P1 - Add supplier onboarding KYS checklist for tax certificate, CNSS certificate, RIB, contracts, and risk approvals.
- [x] T243 P1 - Add customer dispute case tracking linked to invoices, credit notes, documents, and collection status.
- [x] T244 P1 - Add supplier dispute case tracking linked to receipts, invoices, payments, and blocked purchase approvals.
- [x] T245 P1 - Add collection promise-to-pay tracking with commitments, reminders, broken promises, and next action owners.
- [x] T246 P1 - Add payment allocation rules for partial payments across oldest invoice, selected invoice, or manual split.
- [x] T247 P1 - Add customer dunning levels with French email templates, legal footer, and account hold policy.
- [x] T248 P1 - Add supplier payment proposal run with due-date cutoffs, risk flags, cash balance, and approval status.
- [x] T249 P1 - Add cheque lifecycle audit from receipt to deposit, clearing, rejection, and customer notification.
- [x] T250 P1 - Add bank fee and withholding tax handling on payments with accounting entry suggestions.
- [x] T251 P1 - Add stock reservation aging report by order, customer, product, warehouse, and expiry policy.
- [x] T252 P1 - Add customer-specific delivery instructions and route constraints for Moroccan cities.
- [x] T253 P1 - Add transporter registry with vehicle, driver, license, insurance, and delivery performance metrics.
- [x] T254 P1 - Add delivered-not-invoiced and invoiced-not-delivered exception reports.
- [x] T255 P1 - Add procurement requisition approval matrix by department, budget owner, amount, and category.
- [x] T256 P1 - Add supplier price history per product with last price, average price, delay, and variance alerts.
- [x] T257 P1 - Add substitute product recommendations for stockouts using margin, availability, and customer segment.
- [x] T258 P1 - Add inventory dead-stock report by last sale date, stock value, and recommended action.
- [x] T259 P1 - Add CUMP recalculation rehearsal report with before/after valuation and locked-period protection.
- [x] T260 P1 - Add accounting attachment requirements by journal type, amount threshold, and Moroccan evidence category.
- [x] T261 P1 - Add pre-closing accrual suggestions for rent, utilities, salaries, purchases, and recurring services.
- [x] T262 P1 - Add tax calendar with VAT, IR, CNSS, IS, and payroll declaration deadlines for Moroccan SMEs.
- [x] T263 P1 - Add compliance owner assignments and reminders for tax declarations, payroll exports, and evidence archives.
- [x] T264 P1 - Add payroll loan and advance tracking with monthly deduction limits and approval evidence.
- [x] T265 P1 - Add employee expense reimbursement through payroll or accounts payable with journal linkage.
- [x] T266 P1 - Add overtime approval workflow with department, reason, rate, and payroll impact.
- [x] T267 P1 - Add employee contract amendment workflow with salary history, effective dates, and signed document evidence.
- [x] T268 P1 - Add payroll social declaration reconciliation between payslips, Damancom exports, and accounting entries.
- [x] T269 P1 - Add role-restricted HR audit trail for salary, disciplinary, medical, and identity document changes.
- [x] T270 P1 - Add project retainer and milestone billing with revenue recognition notes for accountant review.
- [x] T271 P1 - Add service contract recurring billing with automatic draft invoices and renewal reminders.
- [x] T272 P1 - Add warranty and after-sales service cases linked to products, serials, invoices, and stock replacements.
- [x] T273 P1 - Add production quality checks with pass/fail, scrap quantity, rework cost, and traceability evidence.
- [x] T274 P1 - Add maintenance spare-parts reservation and consumption with CUMP valuation.
- [x] T275 P1 - Add fleet fines, tolls, insurance renewals, and accident case tracking.
- [x] T276 P1 - Add tenant-specific approval delegation during absences with date range and audit trail.
- [x] T277 P1 - Add granular API keys by module scope, tenant, expiry, IP allowlist, and last-used evidence.
- [x] T278 P1 - Add import validation sandbox that previews customer, supplier, product, payroll, and accounting CSV errors.
- [x] T279 P1 - Add export center filters by period, module, status, checksum, requester, and evidence archive.
- [x] T280 P1 - Add automatic data quality score for tenant identifiers, duplicate records, missing documents, and stale actions.
- [x] T281 P1 - Add guided accountant handoff pack with trial balance, VAT review, payroll exports, and unresolved blockers.
- [x] T282 P1 - Add implementation partner margin and workload dashboard by tenant, phase, blocker, and go-live date.
- [x] T283 P1 - Add support ticket intake from tenant users with module context, screenshots, severity, and SLA.
- [x] T284 P1 - Add admin health checks for queues, scheduled jobs, exports, email delivery, and adapter availability.
- [x] T285 P1 - Add tenant resilience runbook status covering backups, restore rehearsal, legal archive, and incident contacts.

## Morocco Competitive Edge Backlog

- [x] T286 P1 - Add Moroccan VAT prorata management for partially deductible purchases and mixed activity tenants.
- [x] T287 P1 - Add simplified IS estimate dashboard with installments, taxable result adjustments, and evidence notes.
- [x] T288 P1 - Add professional tax tracking by establishment, city, rental value, and due date.
- [x] T289 P1 - Add tenant-level DGI declaration calendar with VAT, IS, IR salaries, and supporting evidence.
- [x] T290 P1 - Add CNSS anomaly detector for missing affiliation, duplicate CNSS numbers, and invalid salary bases.
- [x] T291 P1 - Add AMO reconciliation between payroll slips, employer charges, and Damancom export totals.
- [x] T292 P1 - Add Moroccan public holiday calendar with payroll, leave, and delivery planning impact.
- [x] T293 P1 - Add Moroccan city and region reference data for customers, suppliers, deliveries, and analytics.
- [x] T294 P1 - Add Arabic invoice rendering QA with RTL fields, legal footer, and PDF snapshot tests.
- [x] T295 P1 - Add bilingual customer statement PDF with aging, payment promises, and legal identifiers.
- [x] T296 P1 - Add supplier statement reconciliation PDF with receipts, invoices, payments, and disputed lines.
- [x] T297 P1 - Add bank RIB ownership verification workflow with document evidence and approval history.
- [x] T298 P1 - Add cheque portfolio dashboard with deposit slips, due dates, bounced cheques, and alerts.
- [x] T299 P1 - Add cash box daily approval workflow with cashier, supervisor, variance, and accounting entry.
- [x] T300 P1 - Add POS receipt legal footer templates for Morocco with ICE, IF, RC, and VAT display.
- [x] T301 P1 - Add stock lot and expiry tracking for food, cosmetics, pharma-like goods, and traceability exports.
- [x] T302 P1 - Add serial number tracking for electronics, warranties, repairs, and after-sales cases.
- [x] T303 P1 - Add landed cost allocation for imports by customs duty, freight, transit, insurance, and CUMP impact.
- [x] T304 P1 - Add import declaration evidence archive with DUM reference, supplier, shipment, and customs documents.
- [x] T305 P1 - Add supplier risk score using expired documents, payment incidents, lead time variance, and disputes.
- [x] T306 P1 - Add customer credit score using aging, broken promises, disputes, returned cheques, and concentration risk.
- [x] T307 P1 - Add approval matrix simulator for Moroccan SME roles, amount thresholds, module, and branch.
- [x] T308 P1 - Add accountant workspace review mode with comments per journal, invoice, payroll run, and period.
- [x] T309 P1 - Add fiscal lock exception workflow with reason, approver, time limit, and reverse audit evidence.
- [x] T310 P1 - Add accounting trial balance report by PCGE class, period, debit, credit, and balance.
- [x] T311 P1 - Add general ledger report with account drilldown, source document links, and export checksum.
- [x] T312 P1 - Add auxiliary customer ledger with invoice, credit note, payment, and residual balance per customer.
- [x] T313 P1 - Add auxiliary supplier ledger with receipt, supplier invoice, payment, and residual balance per supplier.
- [x] T314 P1 - Add Moroccan invoice numbering audit report for gaps, duplicates, cancelled documents, and fiscal year.
- [x] T315 P1 - Add document cancellation workflow with reason, reversal entries, stock rollback, and legal archive.
- [x] T316 P1 - Add warehouse transfer approval for controlled products, high value moves, and branch restrictions.
- [x] T317 P1 - Add inventory valuation snapshots at period close with CUMP, quantity, value, and lock evidence.
- [x] T318 P1 - Add stock negative prevention report by module, user, product, and attempted transaction.
- [x] T319 P1 - Add payroll variance report comparing current month with previous month by employee and contribution.
- [x] T320 P1 - Add employee contract renewal workflow with alerts, signed documents, salary change, and audit.
- [x] T321 P1 - Add employee absence import sandbox with validation, payroll impact preview, and approval.
- [x] T322 P1 - Add payroll journal preview before posting with PCGE accounts and lock-period validation.
- [x] T323 P1 - Add payroll evidence pack per month with payslips, Damancom file, journal, and checksums.
- [x] T324 P1 - Add DGI adapter sandbox log with payload rendering, validation errors, submission state, and archive.
- [x] T325 P1 - Add CNSS adapter sandbox log with Damancom validation, line errors, submission state, and archive.
- [x] T326 P1 - Add bank statement import preview with duplicates, unknown counterparties, and suggested matches.
- [x] T327 P1 - Add automated payment matching for invoices using amount, reference, customer RIB, and date window.
- [x] T328 P1 - Add payment allocation audit with before/after residuals and reviewer approval for manual overrides.
- [x] T329 P1 - Add SaaS plan comparison enforcement with module limits, record limits, and export permissions.
- [x] T330 P1 - Add tenant billing usage meter for invoices, payslips, storage, exports, and active users.
- [x] T331 P1 - Add implementation go-live risk radar by missing legal IDs, stock quality, payroll readiness, and integrations.
- [x] T332 P1 - Add guided demo scenarios for trading, services, payroll-heavy, POS retail, and production tenants.
- [x] T333 P1 - Add competitive migration importer for common Moroccan Excel templates and legacy ERP exports.
- [x] T334 P1 - Add data quality auto-fix suggestions for duplicate tiers, missing ICE, invalid RIB, and inactive products.
- [x] T335 P1 - Add executive compliance cockpit with tax calendar, pending evidence, locked periods, and risk alerts.

## Morocco Scale-Up Backlog

- [x] T336 P1 - Add branch and establishment registry with IF/RC/patente references, city, manager, and invoice series policy.
- [x] T337 P1 - Add multi-branch stock visibility with transfer lead times, branch reorder thresholds, and exception alerts.
- [x] T338 P1 - Add Moroccan delivery zone pricing by city, route, weight band, delivery promise, and transporter.
- [x] T339 P1 - Add customer sector classification for Moroccan SME analytics, risk scoring, and benchmark dashboards.
- [x] T340 P1 - Add supplier compliance vault with tax certificate, CNSS certificate, RIB, contract, and renewal workflow.
- [x] T341 P1 - Add delegated approval chains for branch managers, accountants, HR managers, and substitute approvers.
- [x] T342 P1 - Add role-based document redaction for salary, tax ID, bank RIB, and private HR evidence.
- [x] T343 P1 - Add accounting attachment OCR queue with manual verification, confidence score, and journal linking.
- [x] T344 P1 - Add cash collection route planning with collector assignment, receipt numbers, and variance review.
- [x] T345 P1 - Add customer credit insurance fields with insurer, covered amount, expiry date, and blocked exposure.
- [x] T346 P1 - Add customer guarantee register for deposits, bank guarantees, signed contracts, and release dates.
- [x] T347 P1 - Add supplier advance payment tracking with PO linkage, residual balance, and approval evidence.
- [x] T348 P1 - Add purchase landed-cost simulation before receipt with customs, freight, transit, insurance, and VAT treatment.
- [x] T349 P1 - Add inventory ABC classification by value, margin, velocity, and Moroccan warehouse location.
- [x] T350 P1 - Add cycle count schedule by warehouse, family, risk level, and last count variance.
- [x] T351 P1 - Add stock damage claim workflow with photo evidence placeholder, root cause, and accounting impact.
- [x] T352 P1 - Add product substitute mapping with stockout recommendation, margin comparison, and customer restrictions.
- [x] T353 P1 - Add customer price list import with date ranges, quantity breaks, and approval audit.
- [x] T354 P1 - Add margin guardrails for quotes, orders, POS sales, and project milestones.
- [x] T355 P1 - Add sales target dashboard by branch, salesperson, product family, and Moroccan region.
- [x] T356 P1 - Add sales commission accrual workflow with invoice payment dependency and accountant approval.
- [x] T357 P1 - Add receivable collection queue with promised date, dispute status, dunning level, and next owner.
- [x] T358 P1 - Add customer dispute resolution SLA with root cause, credit note decision, and legal evidence.
- [x] T359 P1 - Add supplier dispute resolution SLA with blocked payments, receipt exceptions, and settlement notes.
- [x] T360 P1 - Add treasury cash position dashboard combining banks, cashboxes, cheques, and planned payments.
- [x] T361 P1 - Add cheque deposit slip generation with bank, agency, cheque list, and reconciliation status.
- [x] T362 P1 - Add bounced cheque workflow with fees, customer notification, hold policy, and accounting proposal.
- [x] T363 P1 - Add bank statement categorization rules by wording, amount, counterparty RIB, and tenant branch.
- [x] T364 P1 - Add recurring expense calendar for rent, telecom, insurance, leasing, utilities, and tax installments.
- [x] T365 P1 - Add expense approval matrix by category, project, branch, amount, and budget owner.
- [x] T366 P1 - Add employee advance request workflow with repayment plan, payroll deduction, and approval evidence.
- [x] T367 P1 - Add employee loan ledger with outstanding balance, monthly deduction cap, and payslip explanation.
- [x] T368 P1 - Add overtime planning and approval with department budget, rate multiplier, and payroll impact preview.
- [x] T369 P1 - Add attendance import validation for biometric devices with anomaly flags and payroll impact.
- [x] T370 P1 - Add leave calendar conflict detection for departments, public holidays, and critical roles.
- [x] T371 P1 - Add CNSS registration checklist for new hires with missing identifier and contract evidence.
- [x] T372 P1 - Add employee offboarding workflow with final payroll, asset return, document archive, and access revocation.
- [x] T373 P1 - Add maintenance spare part consumption with warehouse deduction, CUMP valuation, and work order cost rollup.
- [x] T374 P1 - Add fleet document alerts for insurance, vignette, technical inspection, authorization, and driver license.
- [x] T375 P1 - Add fleet accident case workflow with photos placeholder, insurance claim, repair order, and cost tracking.
- [x] T376 P1 - Add production quality checklist with scrap, rework, pass/fail result, and finished-goods hold.
- [x] T377 P1 - Add production capacity planning by workstation, operator, shift, and component availability.
- [x] T378 P1 - Add project change request workflow with budget delta, deadline impact, customer approval, and invoice effect.
- [x] T379 P1 - Add project WIP dashboard with earned value, unbilled costs, milestone risk, and accountant notes.
- [x] T380 P1 - Add customer portal invoice view with statement, payment promises, dispute messages, and file evidence.
- [x] T381 P1 - Add supplier portal document upload placeholder with validation status and renewal reminders.
- [x] T382 P1 - Add tenant data room for accountant handoff with period packs, evidence checklists, and checksums.
- [x] T383 P1 - Add implementation checklist templates by industry: retail, wholesale, services, manufacturing, and construction.
- [x] T384 P1 - Add usage telemetry dashboard for module adoption, dormant users, failed actions, and training needs.
- [x] T385 P1 - Add competitive gap heatmap against Odoo, Sage, Cegid, Zoho, and local Moroccan ERP alternatives.

## Morocco Enterprise Depth Backlog

- [x] T386 P1 - Add electronic document retention policy by Moroccan fiscal period, document type, checksum, and legal hold.
- [x] T387 P1 - Add invoice e-signature readiness with certificate metadata, signer workflow, and immutable archive status.
- [x] T388 P1 - Add customer onboarding risk questionnaire for ICE/IF/RC validation, sector, credit terms, and sanctions notes.
- [x] T389 P1 - Add supplier onboarding risk questionnaire for tax status, CNSS certificate, RIB ownership, and contract evidence.
- [x] T390 P1 - Add delivery proof photo OCR placeholder with manual validation, geotag, timestamp, and driver signature.
- [x] T391 P1 - Add transporter invoice reconciliation against route pricing, delivery proofs, penalties, and fuel surcharge.
- [x] T392 P1 - Add warehouse security incident log with product, quantity, CCTV reference, insurance claim, and stock adjustment proposal.
- [x] T393 P1 - Add inventory obsolescence provision proposal by age bucket, family, CUMP value, and accountant approval.
- [x] T394 P1 - Add Moroccan import VAT recovery tracker by DUM, customs receipt, supplier invoice, and deductible period.
- [x] T395 P1 - Add purchase three-way match between PO, receipt, supplier invoice, landed costs, and approval exceptions.
- [x] T396 P1 - Add supplier payment run approval with bank balance, due invoices, blocked disputes, and treasury forecast.
- [x] T397 P1 - Add customer dunning email template variants by French/Arabic preference, dunning level, and legal identifiers.
- [x] T398 P1 - Add collection call log with promise tracking, dispute escalation, next owner, and evidence attachments.
- [x] T399 P1 - Add cash receipt numbering audit for gaps, duplicates, branch series, and cashier accountability.
- [x] T400 P1 - Add POS Z-report closure with tax totals, cash/card split, refunds, and supervisor signature.
- [x] T401 P1 - Add bank reconciliation statement PDF with matched/unmatched lines, balances, and reviewer sign-off.
- [x] T402 P1 - Add bank transfer payment file adapter interface with bank format, approval chain, and status polling.
- [x] T403 P1 - Add payroll bank transfer export with employee RIB validation, net salary totals, and approval evidence.
- [x] T404 P1 - Add payroll benefit-in-kind tracking for car, housing, phone, and taxable base preview.
- [x] T405 P1 - Add payroll end-of-contract settlement with leave balance, indemnity placeholders, final payslip, and archive.
- [x] T406 P1 - Add occupational health document reminders with restricted access, renewal date, and HR evidence vault.
- [x] T407 P1 - Add employee disciplinary workflow with restricted notes, decision, appeal status, and legal evidence.
- [x] T408 P1 - Add HR headcount dashboard by contract type, city, department, salary band, and CNSS readiness.
- [x] T409 P1 - Add production component shortage forecast by BOM, open orders, reservations, and purchase lead time.
- [x] T410 P1 - Add production subcontracting workflow with supplier, components issued, receipt, quality check, and cost rollup.
- [x] T411 P1 - Add maintenance downtime analytics by asset, cause, spare parts, technician, and lost production estimate.
- [x] T412 P1 - Add fleet mileage reimbursement workflow with route, driver, rate, approval, and payroll/accounting linkage.
- [x] T413 P1 - Add fleet fuel card import sandbox with card number, vehicle, duplicate transaction, and exception preview.
- [x] T414 P1 - Add project procurement commitment report by budget, PO, receipt, supplier invoice, and remaining forecast.
- [x] T415 P1 - Add project timesheet approval workflow with employee, rate, billable flag, customer approval, and WIP impact.
- [x] T416 P1 - Add customer portal payment promise workflow with secure token, message thread, due date, and audit trail.
- [x] T417 P1 - Add supplier portal certificate renewal workflow with upload placeholder, validation status, and blocker alerts.
- [x] T418 P1 - Add accountant review annotations on invoices, journals, payroll runs, and tax declarations with resolution status.
- [x] T419 P1 - Add legal archive export bundle by fiscal year with manifest, evidence checksums, and restore verification.
- [x] T420 P1 - Add DGI VAT declaration sandbox payload builder with line totals, prorata, validation messages, and archive.
- [x] T421 P1 - Add IR salary declaration sandbox payload builder with payslip totals, employee identifiers, and validation messages.
- [x] T422 P1 - Add CNSS declaration amendment workflow with corrected lines, reason, approval, and Damancom archive.
- [x] T423 P1 - Add Moroccan public procurement customer flag with withholding/payment terms, documents, and exposure reporting.
- [x] T424 P1 - Add construction retention guarantee tracking with invoice holdback, release milestone, and accounting proposal.
- [x] T425 P1 - Add branch profit center P&L by sales, COGS, payroll allocation, rent, and shared overhead.
- [x] T426 P1 - Add multi-company accountant dashboard with compliance status, blockers, due declarations, and workload scoring.
- [x] T427 P1 - Add tenant security review checklist with MFA, API keys, inactive users, data exports, and admin actions.
- [x] T428 P1 - Add role permission simulator with module, action, branch, amount, and expected allow/deny explanation.
- [x] T429 P1 - Add audit anomaly detector for after-hours changes, large discounts, manual journals, and payroll edits.
- [x] T430 P1 - Add customer profitability report by invoice margin, support tickets, delivery cost, discounts, and payment delay.
- [x] T431 P1 - Add supplier profitability and risk report by purchase volume, disputes, lead time, price variance, and documents.
- [x] T432 P1 - Add SaaS onboarding wizard state persistence with completed steps, owner, deadline, and blocker escalation.
- [x] T433 P1 - Add training checklist by role with completed lessons, failed actions, module adoption, and support nudges.
- [x] T434 P1 - Add tenant success score combining activation, data quality, compliance, support SLA, and payment status.
- [x] T435 P1 - Add competitor migration ROI calculator comparing license cost, implementation time, feature gaps, and local compliance fit.
- [x] T436 P1 - Add Moroccan SME cashflow stress test by VAT due date, payroll due date, supplier aging, and bank balance.
- [x] T437 P1 - Add certified accountant collaboration timeline with document requests, answers, blockers, and sign-off trail.
- [x] T438 P1 - Add customer credit committee pack with exposure, guarantees, payment history, litigation, and proposed limit.
- [x] T439 P1 - Add supplier renewal scorecard with documents, pricing trend, delivery SLA, disputes, and negotiated terms.
- [x] T440 P1 - Add branch stock transfer profitability impact with freight, shrinkage, destination margin, and approval route.
- [x] T441 P1 - Add restaurant/hospitality POS service charge workflow with VAT split, cashier close, and tip accounting proposal.
- [x] T442 P1 - Add retail loyalty liability ledger with earned points, redemption, expiry, and accounting provision preview.
- [x] T443 P1 - Add school/private education billing cycle with registration fees, monthly invoices, discounts, and parent portal promises.
- [x] T444 P1 - Add clinic service invoicing compliance with practitioner, acte, insurance share, patient share, and archive evidence.
- [x] T445 P1 - Add construction progress billing certificate workflow with BOQ line, retention, tax, and client approval.
- [x] T446 P1 - Add importer landed cost variance analysis by DUM, exchange rate, transit invoice, and stock valuation delta.
- [x] T447 P1 - Add exporter foreign currency invoice pack with exchange rate, customs proof, VAT exemption note, and bank repatriation.
- [x] T448 P1 - Add cooperative/agri purchase intake workflow with producer identity, weighing, quality grade, and withholding note.
- [x] T449 P1 - Add manufacturing scrap cost recovery workflow with reason, responsible center, rework, and accounting recovery proposal.
- [x] T450 P1 - Add service company retainer revenue recognition schedule with contract, consumed hours, deferred revenue, and invoice trigger.
- [x] T451 P1 - Add SaaS plan downgrade risk simulator with module locks, data limits, exports, and customer communication.
- [x] T452 P1 - Add tenant legal identity change workflow with RC/ICE/IF proof, approval, historical invoice protection, and audit.
- [x] T453 P1 - Add data residency checklist for Moroccan customers with storage region, backups, access logs, and subcontractor register.
- [x] T454 P1 - Add incident response report builder with impact, timeline, affected tenants, remediation, and customer notices.
- [x] T455 P1 - Add release readiness gate with migrations, tests, rollback plan, support notes, and customer-visible changes.
- [x] T456 P1 - Add AI bookkeeping suggestion queue with source document, proposed journal, confidence, reviewer decision, and audit.
- [x] T457 P1 - Add OCR vendor benchmark dashboard with accuracy, cost, latency, Arabic/French support, and fallback rule.
- [x] T458 P1 - Add bank feed consent lifecycle with mandate, expiration, refresh, revoked state, and evidence archive.
- [x] T459 P1 - Add e-invoicing readiness gap tracker with legal mentions, signature, archiving, numbering, and adapter status.
- [x] T460 P1 - Add payroll rule pack version diff viewer with old/new CNSS, AMO, IR, effective date, and impacted employees.
- [x] T461 P1 - Add VAT audit trail explorer from invoice line to declaration line, payment, archive, and accountant note.
- [x] T462 P1 - Add fixed asset depreciation module with acquisition, component split, fiscal method, disposal, and journal proposal.
- [x] T463 P1 - Add leasing contract tracker with payment schedule, option value, VAT treatment, and accounting classification.
- [x] T464 P1 - Add insurance policy register with covered assets, premiums, claims, expiry alerts, and document vault.
- [x] T465 P1 - Add petty cash replenishment workflow with receipts, caps, reviewer, journal preview, and cashbox impact.
- [x] T466 P1 - Add corporate card expense import with cardholder, merchant, VAT eligibility, duplicate detection, and approval.
- [x] T467 P1 - Add employee travel mission workflow with per diem, transport, lodging, client billable flag, and settlement.
- [x] T468 P1 - Add customer contract SLA penalty tracker with breach evidence, invoice adjustment, approval, and legal note.
- [x] T469 P1 - Add supplier rebate accrual tracker with purchase thresholds, credit note expectation, period close, and evidence.
- [x] T470 P1 - Add inventory reservation expiry workflow with sales order, customer priority, release date, and stock availability.
- [x] T471 P1 - Add consignment stock workflow with owner, receipt, consumption, supplier invoice trigger, and valuation exclusion.
- [x] T472 P1 - Add warranty reserve calculation with sales family, claim rate, repair cost, and accounting provision.
- [x] T473 P1 - Add after-sales RMA workflow with customer proof, serial/lot, repair decision, credit note link, and stock movement.
- [x] T474 P1 - Add subscription billing proration for SaaS customers with plan change, period split, VAT, and invoice note.
- [x] T475 P1 - Add Moroccan competitor battlecard dashboard by vertical, feature gap, price objection, compliance proof, and win/loss reason.
- [x] T476 P1 - Add Moroccan e-commerce order reconciliation with marketplace payout, shipping fee, return, VAT, and customer invoice.
- [x] T477 P1 - Add marketplace seller settlement workflow with commission, withholding, payment batch, and dispute reserve.
- [x] T478 P1 - Add wholesale customer rebate contract with tier thresholds, monthly accrual, credit note, and approval evidence.
- [x] T479 P1 - Add retail store daily cash audit by branch, cashier, POS Z-report, deposit slip, and variance owner.
- [x] T480 P1 - Add pharmaceutical lot expiry compliance with product, batch, expiry, quarantine, supplier recall, and destruction evidence.
- [x] T481 P1 - Add food traceability recall drill with supplier lot, customer deliveries, notification status, and stock hold.
- [x] T482 P1 - Add hotel occupancy revenue dashboard with rooms, nights, city tax placeholder, VAT, and payment mix.
- [x] T483 P1 - Add salon/spa package liability ledger with prepaid sessions, consumption, expiry, and revenue recognition.
- [x] T484 P1 - Add logistics route profitability dashboard with vehicle, driver, fuel, tolls, delivery revenue, and margin.
- [x] T485 P1 - Add customs broker fee reconciliation with DUM, invoice, disbursements, VAT, and landed cost allocation.
- [x] T486 P1 - Add international supplier FX exposure report with currency, invoice due date, rate scenario, and gain/loss preview.
- [x] T487 P1 - Add customer bounced payment recovery workflow with fees, dunning, promise, legal note, and account hold.
- [x] T488 P1 - Add supplier blocked payment release workflow with dispute resolution, document validation, approval, and bank file update.
- [x] T489 P1 - Add customer warranty claim reserve by product family, claim age, repair cost, replacement probability, and accounting proposal.
- [x] T490 P1 - Add fleet insurance claim settlement workflow with accident, repair invoice, insurer payment, deductible, and journal proposal.
- [x] T491 P1 - Add maintenance preventive compliance score with planned jobs, overdue assets, spare availability, downtime risk, and owner.
- [x] T492 P1 - Add project profitability closeout checklist with revenue, WIP reversal, retention, lessons learned, and archive bundle.
- [x] T493 P1 - Add consultant utilization dashboard with billable hours, bench time, retainer consumption, travel, and gross margin.
- [x] T494 P1 - Add employee certification register with certificate, expiry, training cost, role requirement, and renewal workflow.
- [x] T495 P1 - Add payroll loan compliance dashboard with outstanding balance, deduction cap, employee consent, and payslip disclosure.
- [x] T496 P1 - Add HR onboarding document pack with contract, CNSS, CIN, bank RIB, medical visit, and restricted archive.
- [x] T497 P1 - Add executive KPI subscription digest with usage, revenue, churn risk, compliance blockers, and support backlog.
- [x] T498 P1 - Add support SLA escalation matrix with severity, deadline, assigned team, customer notice, and breach report.
- [x] T499 P1 - Add implementation partner capacity planning with consultants, client workload, deadlines, risk score, and margin.
- [x] T500 P1 - Add tenant sandbox reset audit with modules reset, preserved legal archives, actor, timestamp, and restore point.
- [x] T501 P1 - Add Moroccan invoice legal mention validator with ICE, IF, RC, CNSS, Arabic label readiness, and numbering rule.
- [x] T502 P1 - Add bilingual PDF quality queue with document type, RTL fields, missing Arabic labels, reviewer, and status.
- [x] T503 P1 - Add VAT credit carryforward tracker with period, source declaration, offset, refund request, and evidence.
- [x] T504 P1 - Add IS installment forecast with taxable profit estimate, prior year basis, due dates, and cash impact.
- [x] T505 P1 - Add professional tax due calendar with municipality, rental value, rate placeholder, due date, and archive.
- [x] T506 P1 - Add CNSS payroll anomaly heatmap by branch, contract type, missing identifiers, duplicate CNSS, and correction owner.
- [x] T507 P1 - Add AMO reimbursement tracking placeholder with employee, claim date, amount, status, and document vault.
- [x] T508 P1 - Add data export approval workflow with requester, dataset, legal basis, approver, checksum, and expiry.
- [x] T509 P1 - Add API integration contract dashboard with partner, scopes, rate limits, webhook status, and key rotation.
- [x] T510 P1 - Add webhook incident replay workflow with event, signature validation, retry count, target response, and audit.
- [x] T511 P1 - Add tenant feature adoption experiment dashboard with cohort, feature flag, activation metric, retention, and rollback.
- [x] T512 P1 - Add price increase communication workflow with segment, effective date, template FR/AR, approval, and customer impact.
- [x] T513 P1 - Add customer churn risk predictor with overdue balance, support tickets, adoption, renewal date, and action plan.
- [x] T514 P1 - Add supplier dependency concentration report with spend share, alternative supplier, risk note, and mitigation owner.
- [x] T515 P1 - Add Moroccan vertical template selector with industry, default chart mapping, workflows, document pack, and demo data.
- [x] T516 P1 - Add sales pipeline forecast with weighted leads, expected close date, VAT impact, owner, and confidence band.
- [x] T517 P1 - Add customer lifetime value dashboard with recurring spend, margin, payment behavior, support cost, and retention action.
- [x] T518 P1 - Add renewal revenue calendar with contract, renewal date, notice period, uplift, and owner.
- [x] T519 P1 - Add pricing elasticity simulator with product family, discount range, margin guardrail, approval, and forecast impact.
- [x] T520 P1 - Add DSO forecast control with receivables aging, promised payments, dispute exclusions, target days, and escalation.
- [x] T521 P1 - Add supplier price variance monitor with last purchase, current quote, variance, approval threshold, and alternative.
- [x] T522 P1 - Add purchase budget burn dashboard with department, committed orders, received spend, remaining budget, and blocker.
- [x] T523 P1 - Add stock service level dashboard with demand, available stock, reorder point, fill rate, and shortage owner.
- [x] T524 P1 - Add demand forecast review with sales history, seasonal factor, safety stock, suggested PO, and validation status.
- [x] T525 P1 - Add warehouse slotting optimizer with product velocity, bin zone, picking distance, replenishment frequency, and move plan.
- [x] T526 P1 - Add production yield analytics with BOM, produced quantity, scrap, variance cost, and corrective owner.
- [x] T527 P1 - Add quality nonconformance workflow with issue type, affected batch, containment, supplier/customer notice, and CAPA.
- [x] T528 P1 - Add fleet CO2 and fuel dashboard with vehicle, mileage, fuel liters, emission factor, and reduction plan.
- [x] T529 P1 - Add maintenance cost trend with asset, preventive spend, corrective spend, downtime, and replacement signal.
- [x] T530 P1 - Add project milestone billing risk with milestone, deliverable evidence, invoice readiness, retention, and delay owner.
- [x] T531 P1 - Add consultant staffing forecast with pipeline demand, available capacity, role gap, hiring trigger, and margin impact.
- [x] T532 P1 - Add payroll overtime risk forecast with team, planned hours, legal cap, approval status, and cost impact.
- [x] T533 P1 - Add leave liability report with employee balance, daily rate, liability, expiry policy, and approval owner.
- [x] T534 P1 - Add training ROI tracker with training, participants, cost, productivity gain, certificate, and renewal date.
- [x] T535 P1 - Add CNSS due reminder with payroll period, declaration deadline, payment deadline, responsible user, and evidence.
- [x] T536 P1 - Add VAT sensitivity analysis with taxable sales, deductible purchases, exempt sales, credit carryforward, and cash scenario.
- [x] T537 P1 - Add ICE/IF data quality queue with customer/supplier, missing field, blocking document, owner, and due date.
- [x] T538 P1 - Add audit sampling engine with journal, risk score, selected entries, evidence request, and reviewer.
- [x] T539 P1 - Add bank covenant monitor with bank balance, debt service, ratio, threshold, and alert.
- [x] T540 P1 - Add cash runway dashboard with opening balance, inflows, outflows, payroll, VAT/IS, and runway days.
- [x] T541 P1 - Add credit insurance register with customer, insured amount, deductible, expiry, claim status, and evidence.
- [x] T542 P1 - Add e-commerce return reason analytics with SKU, reason, refund amount, restockability, and corrective action.
- [x] T543 P1 - Add POS fraud anomaly dashboard with cashier, voids, refunds, cash variance, shift, and escalation.
- [x] T544 P1 - Add loyalty cohort analytics with cohort month, earned points, redemptions, breakage, and liability.
- [x] T545 P1 - Add support deflection knowledge base dashboard with ticket themes, article coverage, unresolved rate, and owner.
- [x] T546 P1 - Add onboarding time-to-value tracker with tenant, milestones, days elapsed, blocker, and success manager.
- [x] T547 P1 - Add feature entitlement audit with plan, enabled modules, overage, downgrade risk, and remediation.
- [x] T548 P1 - Add API error budget dashboard with endpoint, request volume, failure rate, SLO, and incident owner.
- [x] T549 P1 - Add webhook delivery SLO dashboard with event type, latency, retry rate, failed targets, and replay status.
- [x] T550 P1 - Add data retention purge simulator with dataset, legal hold, retention deadline, purge count, and approval.
- [x] T551 P1 - Add backup restore SLA dashboard with backup age, restore test, RTO, RPO, and evidence.
- [x] T552 P1 - Add Moroccan regional profitability dashboard with region, revenue, gross margin, logistics cost, and tax note.
- [x] T553 P1 - Add branch expansion readiness with city, demand signal, staffing, legal documents, and launch checklist.
- [x] T554 P1 - Add partner referral pipeline with partner, referred tenant, stage, expected MRR, and commission.
- [x] T555 P1 - Add accountant workload balancing with accountant, clients, deadlines, blockers, and reassignment proposal.
- [x] T556 P1 - Add automated close checklist scoring with journals, reconciliations, taxes, payroll, evidence, and blocker owner.
- [x] T557 P1 - Add intelligent invoice matching assistant with customer statement, bank line, confidence, exception reason, and reviewer.
- [x] T558 P1 - Add supplier invoice OCR triage with document source, extracted totals, VAT confidence, duplicate risk, and approval route.
- [x] T559 P1 - Add payment run optimization with cash limit, supplier priority, due dates, discounts, and deferral proposal.
- [x] T560 P1 - Add receivable promise reliability score with customer, promise history, kept rate, next action, and credit impact.
- [x] T561 P1 - Add sales tax anomaly detector with invoice, VAT rate, exemption reason, expected rate, and correction workflow.
- [x] T562 P1 - Add payroll variance explainability with employee, prior net, current net, drivers, and approval note.
- [x] T563 P1 - Add HR compliance document expiry board with employee, document, expiry, severity, and restricted evidence.
- [x] T564 P1 - Add purchase request policy engine with requester, budget, approval path, blocked reason, and audit status.
- [x] T565 P1 - Add inventory replenishment autopilot with item, forecast, supplier lead time, suggested quantity, and approval status.
- [x] T566 P1 - Add serialized asset traceability dashboard with serial, customer/site, warranty, service history, and evidence.
- [x] T567 P1 - Add batch recall communication center with lot, affected customers, message status, response rate, and archive.
- [x] T568 P1 - Add production plan feasibility checker with BOM availability, labor capacity, machine readiness, and constraint reason.
- [x] T569 P1 - Add maintenance work order prioritizer with asset criticality, downtime risk, part availability, SLA, and technician.
- [x] T570 P1 - Add fleet route compliance monitor with vehicle, driver, route proof, fuel anomaly, and manager sign-off.
- [x] T571 P1 - Add project margin early warning with budget, committed cost, timesheets, billed amount, and corrective action.
- [x] T572 P1 - Add service contract profitability monitor with contract, SLA effort, support hours, revenue, and renewal recommendation.
- [x] T573 P1 - Add customer portal adoption tracker with invitations, logins, invoice views, payments, and nudge plan.
- [x] T574 P1 - Add supplier portal adoption tracker with invitations, document uploads, quote responses, disputes, and onboarding owner.
- [x] T575 P1 - Add accountant portal SLA board with client, pending documents, review age, deadline, and escalation.
- [x] T576 P1 - Add DGI declaration readiness score with VAT report, invoice mentions, evidence, adapter status, and blocker.
- [x] T577 P1 - Add CNSS declaration readiness score with payroll run, employee identifiers, contribution totals, Damancom preflight, and blocker.
- [x] T578 P1 - Add AMO payroll reconciliation insight with gross payroll, AMO base, employee/employer shares, variance, and note.
- [x] T579 P1 - Add professional tax evidence vault with branch, commune, rental value, declaration archive, and renewal reminder.
- [x] T580 P1 - Add legal archive completeness dashboard with document type, retention period, checksum, missing evidence, and owner.
- [x] T581 P1 - Add bank import duplicate guard with statement reference, hash, matched imports, reviewer, and prevention status.
- [x] T582 P1 - Add cashbox variance root-cause assistant with session, expected cash, counted cash, variance, likely reason, and action.
- [x] T583 P1 - Add POS offline risk monitor with device, pending queue, age, conflict rate, and sync priority.
- [x] T584 P1 - Add multi-branch stock balancing assistant with source branch, target branch, demand, transfer cost, and approval.
- [x] T585 P1 - Add landed cost automation queue with import declaration, freight, duty, allocation base, and accounting preview.
- [x] T586 P1 - Add foreign currency revaluation dashboard with currency, open balance, closing rate, unrealized gain/loss, and journal preview.
- [x] T587 P1 - Add recurring invoice automation monitor with contract, next run, failure reason, revenue, and retry owner.
- [x] T588 P1 - Add subscription usage billing audit with tenant, usage metric, included quota, overage, and invoice impact.
- [x] T589 P1 - Add tenant health incident forecast with adoption, support load, billing status, compliance blockers, and risk level.
- [x] T590 P1 - Add implementation migration readiness with source system, mapped entities, validation errors, cutover date, and owner.
- [x] T591 P1 - Add release impact simulator with module, tenants affected, migration risk, rollback checklist, and support load.
- [x] T592 P1 - Add security access review campaign with role, inactive users, privileged permissions, reviewer, and revocation plan.
- [x] T593 P1 - Add API key rotation campaign with partner, scopes, age, expiry, owner, and rotation status.
- [x] T594 P1 - Add webhook contract testing dashboard with event, schema version, consumer status, failures, and replay sample.
- [x] T595 P1 - Add BI export catalog with dataset, fields, refresh cadence, legal basis, and approval status.
- [x] T596 P1 - Add data residency evidence register with dataset, storage provider, Morocco scope, legal owner, and evidence checksum.
- [x] T597 P1 - Add privacy consent audit with party, language, purpose, collection source, and retention status.
- [x] T598 P1 - Add chart account anomaly guard with PCGE account, label, activity, risk reason, and reviewer.
- [x] T599 P1 - Add journal duplicate detection with date, source, amount fingerprint, duplicate risk, and resolution owner.
- [x] T600 P1 - Add fiscal lock impact preview with period, affected modules, pending drafts, unlock exception, and risk level.
- [x] T601 P1 - Add tax calendar evidence SLA with declaration, due date, evidence age, owner, and escalation status.
- [x] T602 P1 - Add CNSS employee identity readiness board with employee, CIN, CNSS number, contract type, and blocker.
- [x] T603 P1 - Add payroll bank file approval queue with run, employee count, net total, approver, and release status.
- [x] T604 P1 - Add expense policy exception monitor with claimant, category, amount, policy rule, and decision route.
- [x] T605 P1 - Add vendor master duplicate detector with supplier, ICE, RIB, duplicate reason, and merge proposal.
- [x] T606 P1 - Add customer master duplicate detector with customer, ICE, city, duplicate reason, and merge proposal.
- [x] T607 P1 - Add product master completeness score with SKU, barcode, Arabic description, VAT rate, and score.
- [x] T608 P1 - Add warehouse capacity heatmap with warehouse, stock lines, reserved quantity, utilization, and action.
- [x] T609 P1 - Add stock aging liquidation planner with SKU, age bucket, quantity, value, and liquidation action.
- [x] T610 P1 - Add inventory count variance approval board with sheet, warehouse, variance value, approver, and status.
- [x] T611 P1 - Add purchase lead time reliability dashboard with supplier, expected date, receipt performance, delay score, and action.
- [x] T612 P1 - Add supplier onboarding risk pack with supplier, documents, bank details, KYS status, and risk note.
- [x] T613 P1 - Add customer credit renewal campaign with customer, exposure, credit limit, renewal date, and recommendation.
- [x] T614 P1 - Add quote margin approval simulator with quote, gross margin, discount, required role, and approval status.
- [x] T615 P1 - Add contract renewal obligation board with contract, renewal date, notice window, owner, and obligation status.
- [x] T616 P1 - Add delivery promise adherence monitor with delivery note, city, promised date, route status, and breach reason.
- [x] T617 P1 - Add returns root cause board with credit note, product, reason, value, and corrective owner.
- [x] T618 P1 - Add POS cashier performance scorecard with cashier, session count, variance, payments, and coaching note.
- [x] T619 P1 - Add cash forecast variance monitor with opening cash, expected inflow, expected outflow, variance, and action.
- [x] T620 P1 - Add bank reconciliation aging queue with account, unmatched lines, oldest age, balance, and owner.
- [x] T621 P1 - Add fixed asset insurance evidence board with asset, policy evidence, renewal date, coverage status, and owner.
- [x] T622 P1 - Add maintenance spare parts availability with work order, part, required quantity, stock coverage, and blocker.
- [x] T623 P1 - Add fleet document compliance score with vehicle, document type, due date, evidence, and score.
- [x] T624 P1 - Add project delivery risk radar with project, budget burn, billing progress, timesheet load, and risk signal.
- [x] T625 P1 - Add production material shortage bridge with production order, component, required quantity, available stock, and decision.
- [x] T626 P1 - Add service ticket SLA health board with ticket, severity, due time, status, and escalation.
- [x] T627 P1 - Add portal notification delivery audit with channel, recipient, document type, delivery status, and retry.
- [x] T628 P1 - Add API client usage anomaly monitor with client, scope, last used date, request pattern, and action.
- [x] T629 P1 - Add webhook schema drift detector with event, expected version, payload keys, drift risk, and replay action.
- [x] T630 P1 - Add backup evidence freshness monitor with evidence type, last archive date, checksum, age, and status.
- [x] T631 P1 - Add role segregation of duties matrix with role, conflicting permission, module, reviewer, and mitigation.
- [x] T632 P1 - Add audit evidence request tracker with request, entity, due date, evidence status, and reviewer.
- [x] T633 P1 - Add release rollback rehearsal checklist with module, backup status, smoke suite, rollback owner, and readiness.
- [x] T634 P1 - Add tenant configuration drift monitor with setting, expected value, current value, drift severity, and fix owner.
- [x] T635 P1 - Add executive assurance digest with risk count, control coverage, overdue evidence, release readiness, and next action.
- [x] T636 P1 - Add business continuity command center with process, RTO, RPO, dependency, owner, and drill status.
- [x] T637 P1 - Add incident escalation board with incident type, severity, detection source, escalation owner, and SLA timer.
- [x] T638 P1 - Add disaster recovery evidence pack with backup set, restore test, checksum, evidence owner, and readiness.
- [x] T639 P1 - Add legal hold case register with case, affected dataset, hold reason, reviewer, and release status.
- [x] T640 P1 - Add customer data subject request queue with requester, channel, due date, dataset scope, and action status.
- [x] T641 P1 - Add vendor sanctions screening with supplier, ICE, country, screening result, and review owner.
- [x] T642 P1 - Add procurement contract compliance board with contract, clause, renewal obligation, spend exposure, and blocker.
- [x] T643 P1 - Add purchase price approval exceptions with item, supplier, variance, threshold, and approver.
- [x] T644 P1 - Add stock write-off authorization queue with SKU, warehouse, reason, value, and approval path.
- [x] T645 P1 - Add inventory insurance exposure report with warehouse, stock value, coverage cap, gap, and action.
- [x] T646 P1 - Add expiry and cold-chain risk board with product, lot, expiry date, temperature status, and disposition.
- [x] T647 P1 - Add e-invoice rollout readiness controls with tenant, invoice series, legal mentions, adapter mode, and blockers.
- [x] T648 P1 - Add customer dispute reserve forecast with customer, disputed amount, probability, reserve, and next review.
- [x] T649 P1 - Add bad debt provision review with customer, aging bucket, exposure, provision rate, and journal preview.
- [x] T650 P1 - Add cash concentration transfer planner with source account, target account, available balance, threshold, and proposal.
- [x] T651 P1 - Add bank fee anomaly review with bank, fee type, expected fee, charged fee, and resolution.
- [x] T652 P1 - Add payroll leave accrual provisioning with employee, balance, daily rate, provision, and accounting period.
- [x] T653 P1 - Add employee document privacy access audit with employee, document, role, access reason, and redaction status.
- [x] T654 P1 - Add health and safety incident tracker with site, incident, severity, corrective action, and evidence.
- [x] T655 P1 - Add workforce capacity rota planner with team, planned hours, available hours, gap, and mitigation.
- [x] T656 P1 - Add POS refund authorization matrix with cashier, refund amount, reason, role required, and approval result.
- [x] T657 P1 - Add ecommerce payout reconciliation evidence with marketplace, payout, orders matched, variance, and archive.
- [x] T658 P1 - Add branch opening compliance checklist with city, lease, tax registration, staffing, and launch blocker.
- [x] T659 P1 - Add fleet fuel fraud controls with vehicle, driver, fuel spend, mileage, anomaly score, and action.
- [x] T660 P1 - Add maintenance downtime SLA dashboard with asset, work order, downtime, SLA breach, and owner.
- [x] T661 P1 - Add production batch costing audit with production order, materials, labor, overhead, variance, and reviewer.
- [x] T662 P1 - Add quality certificate evidence vault with supplier, certificate, expiry, linked lots, and approval status.
- [x] T663 P1 - Add project contract deliverable acceptance with project, deliverable, client sign-off, billing impact, and risk.
- [x] T664 P1 - Add service contract escalation penalties with contract, SLA breach, penalty estimate, owner, and recovery plan.
- [x] T665 P1 - Add customer portal access review with customer, users, last login, permission risk, and revocation plan.
- [x] T666 P1 - Add supplier portal security review with supplier, users, document access, stale accounts, and remediation.
- [x] T667 P1 - Add API consent ledger with client, scope, legal basis, expiry, and renewal owner.
- [x] T668 P1 - Add webhook dead-letter queue with event, target, attempts, last error, and replay decision.
- [x] T669 P1 - Add data warehouse export approval with dataset, fields, legal basis, approver, and export status.
- [x] T670 P1 - Add BI KPI definition catalog with KPI, formula, owner, source dataset, and validation status.
- [x] T671 P1 - Add AI suggestion governance queue with suggestion type, source module, confidence, reviewer, and decision.
- [x] T672 P1 - Add accountant evidence request SLA with client, request, age, due date, escalation, and evidence status.
- [x] T673 P1 - Add tax audit readiness binder with section, required evidence, checksum, reviewer, and gap.
- [x] T674 P1 - Add board pack financial controls with report, period, preparer, reviewer, and sign-off status.
- [x] T675 P1 - Add executive resilience scorecard with continuity score, open incidents, evidence gaps, compliance blockers, and next action.

## UX Organization And Odoo/Sage-Grade Usability

- [x] T676 P0 - Redesign the primary shell around five clear workspaces: Ventes, Achats/Stock, Comptabilite, Paie/RH, and Admin/Conformite.
- [x] T677 P0 - Add a persistent left app launcher with module icons, French labels, pinned modules, and role-aware visibility.
- [x] T678 P0 - Add workspace home pages that show only the most important actions, KPIs, alerts, and recent documents for each role.
- [x] T679 P0 - Replace long dashboard scrolling with workspace tabs, saved filters, and contextual shortcuts.
- [x] T680 P0 - Add a universal command palette for creating documents, searching records, switching modules, and opening recent items.
- [x] T681 P0 - Add global breadcrumbs that show workspace, module, record type, and current document number.
- [x] T682 P0 - Standardize all list pages with search, filters, sort, pagination, column visibility, export, and bulk actions.
- [x] T683 P0 - Standardize all record detail pages with header status, primary action button, secondary actions, activity timeline, and audit drawer.
- [x] T684 P0 - Standardize create/edit forms with grouped sections, inline validation, save/cancel behavior, dirty-state warning, and keyboard submission.
- [x] T685 P0 - Add a reusable status pipeline component for devis, commandes, BL, factures, paiements, achats, paie, and tickets.
- [x] T686 P0 - Add contextual next-step actions after every major document transition such as approve, deliver, invoice, pay, export, and send.
- [x] T687 P0 - Add record preview side panels so users can inspect customers, suppliers, invoices, and products without leaving lists.
- [x] T688 P0 - Add quick-create modals for customer, supplier, product, employee, warehouse, and journal account from related forms.
- [x] T689 P0 - Add empty states with useful primary actions for every module instead of generic blank tables.
- [x] T690 P0 - Add loading skeletons for every workspace, list, form, KPI panel, and document preview.
- [x] T691 P0 - Add error states that translate backend validation into clear French business messages and recovery actions.
- [x] T692 P0 - Add success toasts with document number, next step, and undo/open actions where safe.
- [x] T693 P0 - Add role-specific navigation presets for Direction, Commercial, Comptable, Magasinier, RH, Caissier, and Admin.
- [x] T694 P0 - Add a first-run guided tour for Moroccan SME users that explains the core flow without marketing copy.
- [x] T695 P0 - Add a setup progress center that links missing ICE, IF, RC, Patente, CNSS, VAT, fiscal period, numbering, and bank settings to exact screens.
- [x] T696 P0 - Add a clean tenant/account switcher for accountant and implementation-partner users with client health indicators.
- [x] T697 P0 - Add a notification center for approvals, overdue payments, stock alerts, payroll blockers, tax dates, and import errors.
- [x] T698 P0 - Add saved views per module with owner, shared/private state, default view, and role restrictions.
- [x] T699 P0 - Add consistent keyboard shortcuts for search, save, new document, command palette, and module switching.
- [x] T700 P0 - Add accessibility labels, focus states, tab order, and screen-reader names for all primary ERP controls.
- [x] T701 P1 - Build a dedicated Sales workspace with kanban pipeline, quote list, order list, delivery list, invoice list, and payment follow-up.
- [x] T702 P1 - Build a Sales document detail screen that shows quote/order/invoice lines, totals, VAT, customer credit, timeline, and legal mentions.
- [x] T703 P1 - Add one-click quote to order to delivery to invoice workflow with visible progress and disabled invalid actions.
- [x] T704 P1 - Add customer 360 page with identity, ICE, balances, documents, timeline, quotes, invoices, payments, disputes, and credit risk.
- [x] T705 P1 - Add sales follow-up board for unpaid invoices with aging buckets, reminder stage, promised payment, and next action.
- [x] T706 P1 - Add invoice preview panel with French/Moroccan legal mentions, VAT breakdown, numbering series, and PDF export status.
- [x] T707 P1 - Add credit note workflow screen with reason, line selection, approval requirement, VAT reversal, and accounting impact preview.
- [x] T708 P1 - Build a dedicated Purchases workspace with supplier list, purchase requests, purchase orders, receipts, supplier invoices, and payments.
- [x] T709 P1 - Add supplier 360 page with ICE, IF, RIB, KYS documents, purchases, disputes, payment calendar, and reliability score.
- [x] T710 P1 - Add purchase order detail screen with approval path, supplier terms, expected receipt, landed cost, and budget impact.
- [x] T711 P1 - Add receipt screen optimized for warehouse users with barcode lookup, quantity received, variance, CUMP impact, and photo evidence.
- [x] T712 P1 - Add supplier invoice matching screen that compares order, receipt, invoice, VAT, due date, and exceptions.
- [x] T713 P1 - Build a dedicated Inventory workspace with stock overview, warehouses, stock moves, reservations, transfers, adjustments, and counts.
- [x] T714 P1 - Add product 360 page with SKU, barcode, VAT, prices, CUMP, warehouse stock, reservations, sales history, and purchase history.
- [x] T715 P1 - Add warehouse map/list page with available, reserved, blocked, quarantine, valuation, and reorder alerts.
- [x] T716 P1 - Add stock reservation board showing source document, customer, product, reserved quantity, age, and release action.
- [x] T717 P1 - Add stock adjustment wizard with reason codes, approval threshold, valuation effect, and accounting preview.
- [x] T718 P1 - Add inventory count workflow with sheet creation, mobile-friendly count entry, variance approval, and posting summary.
- [x] T719 P1 - Build a dedicated Accounting workspace with PCGE accounts, journals, VAT, periods, bank reconciliation, exports, and evidence.
- [x] T720 P1 - Add journal entry detail screen with balanced debit/credit indicator, source document link, attachments, and posting controls.
- [x] T721 P1 - Add VAT cockpit with collected/deductible VAT by rate, invoice drilldown, exceptions, declaration calendar, and export pack.
- [x] T722 P1 - Add fiscal period close center with blockers, pending drafts, missing evidence, lock status, and accountant sign-off.
- [x] T723 P1 - Add bank reconciliation workspace with bank import preview, matching suggestions, unmatched items, and payment allocation.
- [x] T724 P1 - Add PCGE account selector with search by number/label, favorite accounts, and validation against Moroccan chart rules.
- [x] T725 P1 - Add accountant review mode with comments, requested evidence, status, owner, and due date on every accounting document.
- [x] T726 P1 - Build a dedicated Payroll/RH workspace with employees, contracts, payroll runs, payslips, leave, CNSS/AMO/IR, and Damancom.
- [x] T727 P1 - Add employee 360 page with CIN, CNSS, contract, salary, dependents, documents, payslips, leave, loans, and audit access.
- [x] T728 P1 - Add payroll run wizard with employee preflight, gross-to-net preview, exceptions, approval, posting, payslip PDFs, and Damancom export.
- [x] T729 P1 - Add payroll calculation explanation panel for CNSS cap, AMO, IR bracket, dependents, employer charges, and net pay.
- [x] T730 P1 - Add Damancom validation workspace with row length, missing identifiers, contribution totals, checksum, and archive evidence.
- [x] T731 P1 - Add leave calendar with monthly view, team conflicts, remaining balances, approval flow, and payroll impact.
- [x] T732 P1 - Add HR document center for CIN, CNSS, contracts, medical visits, expiries, restricted access, and redaction.
- [x] T733 P1 - Build a dedicated POS workspace with cashier sessions, tickets, refunds, Z report, offline queue, and cash movements.
- [x] T734 P1 - Add cashier-friendly POS screen with product search, barcode input, cart, VAT totals, payment capture, and receipt preview.
- [x] T735 P1 - Add POS session close wizard with expected cash, counted cash, variance reason, manager approval, and journal posting.
- [x] T736 P1 - Add refund workflow with original ticket lookup, line selection, reason, authorization, stock return, and accounting reversal.
- [x] T737 P1 - Add offline POS sync review with queue items, conflicts, duplicate detection, replay, and audit trail.
- [x] T738 P1 - Build a dedicated Admin/Conformite workspace with tenant settings, users, roles, numbering, documents, adapters, and audit.
- [x] T739 P1 - Add user and role management screen with module permissions, segregation-of-duties warnings, invitations, and revocation.
- [x] T740 P1 - Add document numbering settings screen with series by type, next number preview, lock rules, and change audit.
- [x] T741 P1 - Add compliance rule pack screen with active Morocco rules, version history, effective dates, and impacted modules.
- [x] T742 P1 - Add adapter status center for DGI, CNSS, banks, email, webhooks, object storage, and credentials readiness.
- [x] T743 P1 - Add legal archive screen with evidence type, source document, checksum, retention, export bundle, and tamper status.
- [x] T744 P1 - Add audit explorer with filters by user, module, entity, action, date, IP, and export.
- [x] T745 P1 - Add subscription and feature gate screen with plan, usage, write lock state, allowed modules, and upgrade prompts.
- [x] T746 P1 - Add support/admin diagnostics screen with API health, job queues, errors, backups, and recent user activity.
- [x] T747 P1 - Add responsive desktop layout rules so ERP tables remain dense and readable on laptop screens.
- [x] T748 P1 - Add responsive tablet/mobile rules for cashier, warehouse receipt, stock count, and manager approval flows.
- [x] T749 P1 - Add a design token system for spacing, typography, colors, borders, focus, status pills, and table density.
- [x] T750 P1 - Add a component library for buttons, icon buttons, inputs, selects, date pickers, tables, tabs, drawers, modals, and timelines.
- [x] T751 P1 - Add icon system with consistent lucide icons for modules, actions, statuses, file types, and alerts.
- [x] T752 P1 - Add French terminology glossary for all modules so labels stay consistent across UI, PDFs, emails, and tests.
- [x] T753 P1 - Add Arabic-ready display rules for names, addresses, PDFs, and bilingual document previews.
- [x] T754 P1 - Add contextual help drawer per workspace with short operational explanations, not marketing text.
- [x] T755 P1 - Add onboarding sample journeys for trading company, services company, retail/POS, and payroll-heavy SME.
- [x] T756 P1 - Add import assistant with CSV upload, field mapping, validation preview, duplicate detection, and import report.
- [x] T757 P1 - Add export center with saved export templates, permissions, filters, file history, and checksums.
- [x] T758 P1 - Add PDF preview UX for invoices, delivery notes, credit notes, purchase orders, payslips, and statements.
- [x] T759 P1 - Add email/send workflow with recipient preview, template selection, attachments, delivery status, and audit.
- [x] T760 P1 - Add attachment upload UX with drag-drop, file type validation, evidence classification, checksum, and retention tag.
- [x] T761 P1 - Add activity timeline component for notes, tasks, status changes, emails, payments, journals, and document exports.
- [x] T762 P1 - Add task management drawer with assigned user, due date, priority, entity link, completion, and reminders.
- [x] T763 P1 - Add approval inbox for quotes, discounts, purchases, stock write-offs, payroll, refunds, and fiscal exceptions.
- [x] T764 P1 - Add manager approval detail view with requested change, financial impact, policy rule, comments, approve, and reject.
- [x] T765 P1 - Add cross-module related-record links so users can jump from invoice to customer, delivery note, journal, payment, and PDF.
- [x] T766 P1 - Add optimistic UI refresh pattern after create/update/post actions with clear rollback on backend validation failure.
- [x] T767 P1 - Add unsaved changes guard for all forms, including browser navigation and workspace switching.
- [x] T768 P1 - Add multi-step wizard pattern for onboarding, payroll run, VAT declaration, inventory count, and bank import.
- [x] T769 P1 - Add page-level performance budgets for dashboard, list pages, record pages, and search.
- [x] T770 P1 - Add frontend telemetry events for module open, create action, validation error, export, and completed workflow.
- [x] T771 P2 - Add customizable dashboard widgets per role with drag ordering, visibility toggles, saved layout, and reset to default.
- [x] T772 P2 - Add Kanban board for CRM leads, support tickets, project tasks, and internal tasks with drag/drop status changes.
- [x] T773 P2 - Add calendar views for deliveries, tax deadlines, payroll dates, employee leave, maintenance, and contract renewals.
- [x] T774 P2 - Add spreadsheet-like editable grids for quote lines, invoice lines, purchase lines, stock count lines, and journal lines.
- [x] T775 P2 - Add AI-assisted navigation suggestions that recommend the next best action while preserving auditability and human approval.
- [x] T876 P1 - Add shared ERP workspace fixtures for Moroccan demo records, role presets, saved views, notifications, and validation examples.
- [x] T877 P1 - Add a reusable dense table interaction contract that covers sortable headers, pagination copy, visible columns, export, and bulk actions.
- [x] T878 P1 - Add a reusable workspace feedback pattern for empty, loading, error, success, forbidden, and validation summary states.
- [x] T879 P1 - Add a mobile-friendly workspace navigation fallback with accessible labels, persistent focus states, and no horizontal scroll.
- [x] T880 P1 - Add a route compatibility map so legacy CRM, Stock, Accounting, Payroll, POS, Compliance, and Admin pages share the new shell language.
- [x] T881 P1 - Add UX verification tests that prove the Odoo/Sage-grade shell, Sales workspace, Purchases workspace, and Inventory workspace render French ERP controls.
- [x] T882 P1 - Add shared fixtures for accounting, payroll, POS, admin, compliance, inventory reservations, adjustments, and count workflows.
- [x] T883 P1 - Add a reusable admin/compliance control pattern for roles, numbering, adapters, archives, audit, feature gates, and diagnostics.
- [x] T884 P1 - Add a French ERP design-system catalog page covering tokens, component states, icon badges, glossary, and Arabic-ready fields.
- [x] T885 P1 - Add contextual help and onboarding journey panels for trading, services, retail/POS, and payroll-heavy Moroccan SMEs.
- [x] T886 P1 - Add route-level verification tests for Accounting, Payroll, POS, Admin/Conformité, and design-system responsiveness.
- [x] T887 P1 - Add shared workflow-productization fixtures for imports, exports, PDFs, emails, attachments, timelines, approvals, and related records.
- [x] T888 P1 - Add a dedicated operational workflow center view that exposes import/export, document, task, approval, and productivity UX in French.
- [x] T889 P1 - Add tenant UX-support API contract endpoints for recents, favorites, pins, notifications, command palette, next actions, graph, timeline, tasks, health, and validation.
- [x] T890 P1 - Add backend tests proving UX-support endpoints return tenant-scoped French contract payloads and validation errors.
- [x] T891 P1 - Add frontend verification tests covering the operational workflow center and UX-support API route wiring.

## Competitive UX Execution And Productization

- [x] T776 P0 - Define the Odoo/Sage comparison scorecard with navigation, workflow speed, data density, document quality, and accounting confidence criteria.
- [x] T777 P0 - Add a UX baseline audit test that screenshots each major workspace and flags missing headings, primary actions, and empty states.
- [x] T778 P0 - Create a user journey map for Moroccan trading SMEs from onboarding to first invoice to first VAT report.
- [x] T779 P0 - Create a user journey map for Moroccan service companies from contract to recurring invoice to accountant handoff.
- [x] T780 P0 - Create a user journey map for Moroccan retailers from POS session to stock deduction to Z report.
- [x] T781 P0 - Create a user journey map for payroll-heavy SMEs from employee onboarding to CNSS/Damancom export.
- [x] T782 P0 - Add workspace information architecture docs that define menus, submenus, record types, and primary user goals.
- [x] T783 P0 - Add navigation acceptance tests that verify every role sees only relevant workspaces and actions.
- [x] T784 P0 - Add a home dashboard decision tree that routes users to Sales, Stock, Accounting, Payroll, POS, or Compliance based on urgent work.
- [x] T785 P0 - Add backend endpoints for recent records per tenant, grouped by module and user role.
- [x] T786 P0 - Add backend endpoints for user favorites including records, reports, dashboards, and saved views.
- [x] T787 P0 - Add backend endpoints for per-user pinned modules and default landing workspace.
- [x] T788 P0 - Add backend endpoints for notification counts by severity, module, due date, and assigned user.
- [x] T789 P0 - Add backend endpoints for command palette search with actions, records, reports, and shortcuts in one response.
- [x] T790 P0 - Add backend endpoints for contextual next actions on quotes, orders, deliveries, invoices, payments, payroll runs, and stock moves.
- [x] T791 P0 - Add backend endpoints for record relationship graphs across customer, supplier, invoice, journal, payment, stock, and payroll entities.
- [x] T792 P0 - Add backend endpoints for activity timelines with consistent event types, actors, timestamps, and linked evidence.
- [x] T793 P0 - Add backend endpoints for user task counts and overdue task summaries by workspace.
- [x] T794 P0 - Add backend endpoints for workspace health cards with blockers, pending approvals, exceptions, and next deadline.
- [x] T795 P0 - Add backend DTO validation for all UX-support endpoints with tenant isolation tests.
- [ ] T796 P1 - Add list-view API contracts with filtering, sorting, pagination, search, column metadata, and totals.
- [ ] T797 P1 - Add detail-view API contracts that return header fields, status, allowed actions, tabs, timeline, and audit summary.
- [ ] T798 P1 - Add form-schema API contracts for dynamic required fields, Moroccan validation rules, defaults, and help text.
- [ ] T799 P1 - Add action-result API contracts with success message, next suggested action, affected records, and audit reference.
- [ ] T800 P1 - Add validation-error API contracts with field path, French message, severity, and suggested correction.
- [ ] T801 P1 - Add saved-filter persistence with owner, shared roles, query definition, and default state.
- [ ] T802 P1 - Add saved-column persistence with visible columns, order, widths, density, and role defaults.
- [ ] T803 P1 - Add export job status API with queued, running, done, failed, checksum, file name, and retention date.
- [ ] T804 P1 - Add import job status API with mapping, preview errors, duplicate warnings, created rows, and failed rows.
- [ ] T805 P1 - Add document send-status API for email, customer portal, supplier portal, and manual download.
- [ ] T806 P1 - Add PDF render-status API with template version, language, checksum, storage key, and legal mention coverage.
- [ ] T807 P1 - Add approval-policy API that returns required role, threshold, reason, current reviewer, and SLA.
- [ ] T808 P1 - Add permission matrix API for frontend route guarding and disabled action explanations.
- [ ] T809 P1 - Add UI state store for current tenant, role, workspace, pinned modules, notifications, and recent records.
- [ ] T810 P1 - Add workspace route structure using descriptive paths for sales, purchases, inventory, accounting, payroll, pos, and admin.
- [ ] T811 P1 - Add route-level loading and error boundaries for every workspace.
- [ ] T812 P1 - Add shared layout component with app launcher, topbar, breadcrumbs, notification center, tenant switcher, and command palette.
- [ ] T813 P1 - Add reusable workspace header component with title, subtitle, KPIs, primary action, and secondary menu.
- [ ] T814 P1 - Add reusable list page component with toolbar, filters, table, pagination, empty state, and bulk action bar.
- [ ] T815 P1 - Add reusable record page component with header, status pipeline, tabs, side drawer, and activity timeline.
- [ ] T816 P1 - Add reusable form page component with section cards, sticky footer, validation summary, and save/cancel controls.
- [ ] T817 P1 - Add reusable approval banner component for records requiring manager, accountant, or admin review.
- [ ] T818 P1 - Add reusable financial totals component for subtotal, VAT by rate, total TTC, paid, balance, and currency.
- [ ] T819 P1 - Add reusable legal identity component for ICE, IF, RC, Patente, CNSS, address, and VAT status.
- [ ] T820 P1 - Add reusable document evidence component for files, PDFs, checksums, retention, and archive status.
- [ ] T821 P1 - Add reusable Moroccan validation component for ICE, IF, RC, Patente, CNSS, CIN, RIB, VAT rate, and fiscal period.
- [ ] T822 P1 - Add reusable audit drawer component with filters, changed fields, actor, timestamp, and source IP.
- [ ] T823 P1 - Add reusable timeline composer for notes, tasks, comments, document sends, and evidence requests.
- [ ] T824 P1 - Add reusable quick action menu with role-gated actions and disabled-state reasons.
- [ ] T825 P1 - Add reusable import preview table with row status, field errors, duplicates, and correction hints.
- [ ] T826 P1 - Add reusable PDF preview drawer with zoom, download, send, archive, and bilingual metadata.
- [ ] T827 P1 - Add reusable keyboard shortcut registry with visible cheat sheet and conflict tests.
- [ ] T828 P1 - Add reusable notification item component with severity, due date, entity link, action button, and snooze.
- [ ] T829 P1 - Add reusable KPI card component with trend, target, tooltip, drilldown link, and loading state.
- [ ] T830 P1 - Add reusable status pill system with consistent colors for draft, approved, posted, paid, blocked, overdue, and failed states.
- [ ] T831 P1 - Add Sales workspace smoke tests for create customer, create quote, approve quote, convert order, deliver, invoice, and partial payment.
- [ ] T832 P1 - Add Purchases workspace smoke tests for supplier, purchase order, receipt, supplier invoice, and payment calendar.
- [ ] T833 P1 - Add Inventory workspace smoke tests for product, warehouse stock, reservation, transfer, adjustment, and count.
- [ ] T834 P1 - Add Accounting workspace smoke tests for journal, VAT report, period lock, bank reconciliation, and legal evidence.
- [ ] T835 P1 - Add Payroll workspace smoke tests for employee, contract, payroll run, payslip, Damancom, and CNSS preflight.
- [ ] T836 P1 - Add POS workspace smoke tests for opening session, selling ticket, refund, offline sync, and Z close.
- [ ] T837 P1 - Add Admin workspace smoke tests for users, roles, numbering, adapters, rule packs, and audit explorer.
- [ ] T838 P1 - Add Playwright visual regression snapshots for all major workspaces at desktop and tablet widths.
- [ ] T839 P1 - Add Playwright accessibility checks for navigation, forms, modals, tables, command palette, and notification center.
- [ ] T840 P1 - Add Playwright keyboard-only workflow test for quote creation, invoice payment, and payroll run calculation.
- [ ] T841 P1 - Add Playwright role-switch tests for owner, sales, warehouse, accountant, payroll, cashier, and read-only users.
- [ ] T842 P1 - Add Playwright localization tests to ensure French remains primary and Arabic-ready fields render correctly.
- [ ] T843 P1 - Add Playwright unsaved-changes tests for customer, invoice, journal, and payroll forms.
- [ ] T844 P1 - Add Playwright import/export tests for CSV templates, import preview, PDF download, and evidence archive.
- [ ] T845 P1 - Add backend contract tests for list metadata, detail metadata, allowed actions, and validation-error payloads.
- [ ] T846 P1 - Add frontend unit tests for shared layout, workspace header, list page, record page, form page, and status pipeline.
- [ ] T847 P1 - Add frontend unit tests for Moroccan identifier validators and French validation messages.
- [ ] T848 P1 - Add frontend unit tests for command palette ranking, keyboard shortcuts, saved views, and pinned modules.
- [ ] T849 P1 - Add frontend unit tests for notification center grouping, counts, snooze, and entity links.
- [ ] T850 P1 - Add frontend unit tests for PDF preview, legal identity, document evidence, and audit drawer components.
- [ ] T851 P2 - Add guided implementation checklist that tracks user readiness against Odoo/Sage replacement criteria.
- [ ] T852 P2 - Add data migration wizard from Sage 100 exports for customers, suppliers, accounts, products, journals, and balances.
- [ ] T853 P2 - Add data migration wizard from Odoo exports for partners, products, invoices, stock moves, journals, and employees.
- [ ] T854 P2 - Add migration reconciliation report comparing imported opening balances, stock valuation, receivables, and payables.
- [ ] T855 P2 - Add competitor-style module app grid with favorites, search, categories, recently used modules, and admin-controlled visibility.
- [ ] T856 P2 - Add natural-language help search over local documentation, module help, glossary, and Moroccan compliance notes.
- [ ] T857 P2 - Add guided accounting setup wizard for PCGE chart, opening balances, fiscal periods, VAT status, and bank accounts.
- [ ] T858 P2 - Add guided inventory setup wizard for warehouses, products, stock opening, CUMP values, and reorder rules.
- [ ] T859 P2 - Add guided payroll setup wizard for employer CNSS, employees, contracts, salary rules, dependents, and leave balances.
- [ ] T860 P2 - Add guided POS setup wizard for stores, cashiers, products, receipt template, payment methods, and cash controls.
- [ ] T861 P2 - Add customer portal UX polish with invoice list, payment promises, statement download, messages, and access controls.
- [ ] T862 P2 - Add supplier portal UX polish with document upload, RFQ response, statement view, disputes, and security review.
- [ ] T863 P2 - Add accountant portal UX polish with client list, evidence requests, review comments, period close, and tax deadlines.
- [ ] T864 P2 - Add implementation partner portal UX polish with tenant progress, blockers, go-live checklist, and migration status.
- [ ] T865 P2 - Add executive mobile summary with cash, sales, stock alerts, approvals, payroll blockers, and tax deadlines.
- [ ] T866 P2 - Add warehouse mobile scan flow for receiving, picking, transfer, inventory count, and stock lookup.
- [ ] T867 P2 - Add cashier tablet mode with large touch targets, quick products, payment buttons, receipt preview, and offline banner.
- [ ] T868 P2 - Add accountant dense mode with compact tables, keyboard shortcuts, batch posting, and export-focused actions.
- [ ] T869 P2 - Add manager approval mobile flow with financial summary, risk reason, comment, approve, reject, and audit.
- [ ] T870 P2 - Add advanced search syntax for invoice numbers, ICE, SKU, amount ranges, dates, statuses, and module filters.
- [ ] T871 P2 - Add duplicate resolution workbench for customers, suppliers, products, invoices, payments, and employees.
- [ ] T872 P2 - Add data quality dashboard with missing identifiers, invalid VAT rates, stale records, duplicates, and owner assignments.
- [ ] T873 P2 - Add monthly product usability review checklist with screenshots, task-completion metrics, bugs, and user feedback.
- [ ] T874 P2 - Add in-app feedback capture linked to workspace, record, screenshot, user role, and browser metadata.
- [ ] T875 P2 - Add release readiness UX gate that blocks release until core journeys, accessibility, visual checks, and E2E tests pass.
