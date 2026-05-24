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
