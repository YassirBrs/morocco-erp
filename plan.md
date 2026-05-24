┌──────────────────────────────────────┐
                          │    NESTJS MULTI-TENANT BACKEND CORE  │
                          └──────────────────────────────────────┘
                                              │
     ┌────────────────────────────────────────┼────────────────────────────────────────┐
     ▼                                        ▼                                        ▼
┌─────────────────────────────────┐    ┌─────────────────────────────────┐    ┌─────────────────────────────────┐
│     1. PUBLIC STOREFRONT        │    │     2. CENTRAL SUPER-ADMIN      │    │     3. TENANT PORTAL (ERP)      │
│  - B2B Public Landing Page      │    │  - Global Client Registry Grid  │    │  - Modular Tenant Settings      │
│  - Automated SaaS Subscription  │    │  - Subscription Lifecycle State │    │  - Competitor Feature Alignment │
│  - Upload Corporate Branding    │    │  - Macro Platform Analytics Dashboard│  - White-Label Logo Injections │
└─────────────────────────────────┘    └─────────────────────────────────┘    └─────────────────────────────────┘


---

## 2. Decoupled Interface & Module Specifications

### 2.1 Sub-Frontend 1: Public Storefront & B2B Onboarding
*   **The Landing Engine:** An optimized corporate-facing landing layout showcasing subscription options over standard local computer software installs.
*   **Dynamic Packaging Pipeline:** Maps incoming accounts directly to automated billing layers: `INTILAQ`, `NUMOW`, or `ENTERPRISE`.
*   **B2B Self-Registration Wizard:** Captures corporate data inputs: Trade Name, 15-digit **ICE (Identifiant Commun de l'Entreprise)**, **IF**, **RC**, and **Patente**.
*   **Brand Asset Intake Node:** An asynchronous client-side file upload block accepting `.png` / `.svg` formats. It pushes corporate brand image assets to an S3 Object Storage bucket. This asset maps dynamically onto the active layout elements within the company’s isolated workspace.

### 2.2 Sub-Frontend 2: SaaS Platform Central Super-Admin Control Panel
*   **Tenant Core Index:** Provides a master overview grid tracking every registered corporate tenant entity across Morocco.
*   **Subscription Status Tracker:** Real-time visibility into active billing cycle states: `ACTIVE`, `PAST_DUE`, or `CANCELED`.
*   **Macro Revenue Dashboard:** Calculates platform performance metrics: Monthly Recurring Revenue (MRR), database storage space allocation per tenant, user registration numbers, and total daily invoice generation volume.

### 2.3 Sub-Frontend 3: Company Isolated Workspace (The Multi-Module ERP Core)
When an authenticated corporate user initializes their workspace context, the application loads their custom company logo across all headers and unlocks the core business features:

#### Module 1: Corporate Profile Settings & Workspace Calibration
*   **Branding Configuration Panel:** Allows enterprise admins to view or update corporate address records, registry numbers, and their white-label company logo.
*   **White-Label Report Builder:** Injects the active corporate logo directly into layout titles, invoice headers, payslips, and exported data grids.

#### Module 2: Commercial Operations & Customer Relations (CRM & Ventes)
*   **CRM & Pipeline Tracker:** Manages customer records, business opportunities, and lead conversion workflows.
*   **Sales Pipeline Core (Ventes):** Generates official quotations (*Devis*), tracks orders (*Commandes*), and processes customer invoice operations (*Facturation*).
*   **Marketing Engine:** Simple email orchestration module to manage automated communication rules and client messaging logs.
*   **After-Sales Service Core (SAV):** Logs support tickets, customer service requests, and maintenance schedules.

#### Module 3: Supply Chain, Procurement & Storage (Achats & Stocks)
*   **Procurement Module (Achats):** Coordinates supplier records, purchase orders, and material sourcing pipelines.
*   **Warehouse Operations (Inventaire):** Monitors inventory states across multiple distinct physical storage locations. Includes tracking mechanisms for shipping logs and incoming *Bons de Réception*.

#### Module 4: Finance, Fiscal Auditing & Ledger Hooks (Comptabilité & Facturation)
*   **Document Aggregator Flow:** Allows accounting operators to view open **Bons de Livraison (BL / Delivery Notes)**, check them off, and combine them into a single summary **Facture Définitive** (Invoice).
*   **Multi-Rate VAT Segmenter:** Automatically parses product lines across statutory local VAT scales (20%, 14%, 10%, 7%, 0%), populating compliant tax subtotal grids dynamically.
*   **DGI Electronic Billing Engine:** Serializes verified invoices into structured XML files complying with the UBL 2.1 standard required for electronic compliance.
*   **Double-Entry PCGE Journal Generator:** When a delivery note drops inventory out of a warehouse, an internal system event uses an asset cost calculator (Weighted Average Cost / CUMP) to post an entry to the general ledger:
    *   **Debit Account:** `61241` (Achats de marchandises revendues)
    *   **Credit Account:** `3111` (Marchandises au magasin)
*   **Atomic Cloud Transactions:** Wraps operations inside an interactive database transaction boundary. If the accounting write step fails, the inventory deduction rolls back to preserve data integrity.

#### Module 5: Industrial Management & Equipment Tracking (GPAO & Maintenance)
*   **Manufacturing Operations (Fabrication / GPAO):** Coordinates multi-level Bill of Materials (BOM), production planning workflows, and material consumption tracking.
*   **Asset Maintenance Engine:** Tracks internal hardware conditions, registers unexpected downtime events, and automates preventative maintenance schedules.

#### Module 6: Human Resources & Compliant Payroll Engineering (RH & Paie)
*   **Core HR Hub:** Coordinates employment details, recruitment pipelines, paid leave balances (*Congés*), and daily attendance logs.
*   **CNSS Allocation Core:** Calculates social security deductions. It splits employee shares (4.48%) and employer shares (8.98%) across gross pay, enforcing a monthly cap ceiling of exactly **6,000 MAD**.
*   **Uncapped Social Allocation Module:** Computes insurance parameters over total gross earnings without upper caps, processing AMO (2.26% Employee / 4.11% Employer), Family Allocations (6.40%), and Vocational Training Tax (1.60%).
*   **Taxable Income Definition Logic:** Calculates the baseline for Net Taxable Income (RNI) using the progressive Professional Expenses (*Frais Professionnels*) rules:
    *   If annual gross taxable income is `≤ 78,000 MAD` (Monthly `≤ 6,500 MAD`), apply a **35%** deduction rate.
    *   If annual gross taxable income is `> 78,000 MAD`, apply a **20%** deduction rate, capped at exactly **30,000 MAD per year** (Monthly cap limit of **2,500 MAD**).
*   **Progressive Monthly IR Scale Engine:** Processes net taxable balances against the official progressive income tax brackets:
    *   0.00 to 3,333.33 MAD: 0% | Deduction: 0.00 MAD
    *   3,333.34 to 5,000.00 MAD: 10% | Deduction: 333.33 MAD
    *   5,000.01 to 6,666.67 MAD: 20% | Deduction: 833.33 MAD
    *   6,666.68 to 8,333.33 MAD: 30% | Deduction: 1,500.00 MAD
    *   8,333.34 to 15,000.00 MAD: 34% | Deduction: 1,833.33 MAD
    *   Above 15,000.00 MAD: 37% | Deduction: 2,283.33 MAD
*   **Family Expense Abatements:** Subtracts family dependent deductions from the gross IR position at exactly **50 MAD/month per dependent**, up to a strict maximum of 6 dependents (**300 MAD/month** absolute ceiling).
*   **Damancom Portal Integration Pipeline:** Generates fixed-width flat ASCII text strings matching social security portal upload specs. Rows must contain exactly 260 character columns, terminating with a clean Line Feed (`\n`).

#### Module 7: Logistics & Fleet Management (Parc Automobile)
*   **Vehicle Tracking Hub:** Monitors asset utilization logs, registers lease contracts, and tracks individual maintenance schedules.
*   **Operational Cost Ledger:** Tracks fuel logs, highway tolls, insurance renewals, and corporate transport card allocations.

#### Module 8: Unified Digital Presence & Portals (Web, E-Commerce & E-Learning)
*   **Storefront & E-Commerce Synchronizer:** Integrated e-commerce engine that feeds external online orders directly into your core supply chain and accounting ledger modules.
*   **External Portals Hub:** Hosts dedicated modules for customer self-service billing records, supplier portal management, corporate training platforms (E-Learning), and public job boards.

#### Module 9: Collaborative Planning & Project Management (Projets & Tâches)
*   **Project Delivery Hub:** Organizes client deliveries using modern planning matrices, task delegation layers, and resource allocation boards.
*   **Time Allocation Logs:** Automated internal time tracking sheets linked straight to project task components.

#### Module 10: Retail Operations & Point of Sale (POS)
*   **Point of Sale (POS) Terminal Interface:** Fast retail logging screen equipped to process physical transactions, synchronize cash registries, and update central product inventory indices instantly.

#### Module 11: Revenue Guardrails & Graceful Interceptor Lockouts
*   **API Write Gatekeeper:** Middleware layers intercept structural operations (like creating a user or a warehouse) to verify metrics against subscription tier ceilings (`INTILAQ` or `NUMOW`), throwing HTTP 403 blocks if exceeded.
*   **Read-Only Account Degrader:** Interceptors catch incoming request headers for past-due accounts. They block database mutations (`POST`, `PUT`, `PATCH`, `DELETE`) while keeping the interface active as a read-only historical lookup tool.

---

## 3. Technology Stack & Production Infrastructure

| Infrastructure Layer | Selected Technology | Operational Performance Benefit |
| :--- | :--- | :--- |
| **Backend API Core** | **NestJS & TypeScript** | Architecture-enforced modular design, built-in asynchronous event brokers, and strict compile-time type safety. |
| **Database Engine** | **PostgreSQL** | Relational consistency. Implements shared database multi-tenancy through indexed tenant columns. |
| **Data Access Layer** | **Prisma ORM** | Extends database queries via middleware hooks to automatically inject mandatory `where: { tenantId }` filtering. |
| **Context Isolation** | **nestjs-cls** | Continuation Local Storage maps specific corporate tenant identifiers across active processing blocks based on HTTP header metadata. |
| **Client Frontend** | **Next.js (React)** | Server-side rendering (SSR) optimizes page initialization speeds over mobile 4G/5G layers inside corporate zones. |
| **UI Design Tokens** | **TailwindCSS + shadcn/ui**| Accessible component primitives used to assemble responsive dashboards. |
| **Task Queue Broker** | **Celery + Redis** | Offloads complex backend pipelines (like compiling PDF books or parsing UBL XML data) without blocking the API thread. |

---

## 4. Engineering Execution Plan for Kilo CLI

Launch the Kilo console to coordinate automated code generation within your empty project workspace:

### Step 4.1: Establish the Project Layout Tree