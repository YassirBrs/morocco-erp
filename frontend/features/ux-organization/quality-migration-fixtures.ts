export const qualityMigrationShowcase = {
  kpis: [
    { label: 'Qualité Playwright', value: '7 suites', trend: 'Visuel, a11y, clavier, rôles', status: 'ok' as const },
    { label: 'Migration', value: '2 sources', trend: 'Sage 100 + Odoo', status: 'info' as const },
    { label: 'Portails', value: '4 espaces', trend: 'Client, fournisseur, comptable, partenaire', status: 'ok' as const },
    { label: 'Release gate', value: 'PASS', trend: 'Core journeys + E2E verts', status: 'ok' as const },
  ],
  posAdminSmoke: [
    ['POS', 'open session -> sell ticket -> refund -> offline sync -> Z close', 'Couvert'],
    ['Admin', 'users -> roles -> numbering -> adapters -> rule packs -> audit explorer', 'Couvert'],
  ],
  playwrightRows: [
    ['Visual regression snapshots', 'Desktop + tablette', '/, /ventes, /achats-stock, /comptabilite, /paie, /pos, /admin, /workflows, /contrats-ux'],
    ['Accessibility checks', 'Navigation, forms, modals, tables', 'Command palette + notification center'],
    ['Keyboard-only workflow', 'Quote creation, invoice payment', 'Payroll run calculation'],
    ['Role-switch tests', 'OWNER, SALES, WAREHOUSE, ACCOUNTANT, PAYROLL, CASHIER, READ_ONLY', 'Actions désactivées expliquées'],
    ['Localization tests', 'Français principal', 'Champs Arabic-ready visibles'],
    ['Unsaved changes', 'Client, facture, journal, paie', 'Garde-fou avant sortie'],
    ['Import/export tests', 'CSV templates, import preview, PDF download', 'Evidence archive'],
  ],
  frontendUnitRows: [
    ['Shared layout', 'Workspace header, list page, record page, form page, status pipeline', 'Testé'],
    ['Validateurs Maroc', 'ICE, IF, RC, Patente, CNSS, CIN, RIB, TVA, période fiscale', 'Messages FR'],
    ['Commande et état', 'Ranking, raccourcis, vues sauvegardées, modules épinglés', 'Testé'],
    ['Notifications', 'Grouping, counts, snooze, entity links', 'Testé'],
    ['Documents', 'PDF preview, legal identity, evidence, audit drawer', 'Testé'],
  ],
  migrationRows: [
    ['Sage 100', 'customers, suppliers, accounts, products, journals, balances', 'Mapping guidé'],
    ['Odoo', 'partners, products, invoices, stock moves, journals, employees', 'Mapping guidé'],
    ['Réconciliation migration', 'opening balances, stock valuation, receivables, payables', 'Écarts expliqués'],
  ],
  setupRows: [
    ['Comptabilité', 'PCGE chart, opening balances, fiscal periods, VAT status, bank accounts', 'Assistant prêt'],
    ['Stock', 'warehouses, products, stock opening, CUMP values, reorder rules', 'Assistant prêt'],
    ['Paie', 'employer CNSS, employees, contracts, salary rules, dependents, leave balances', 'Assistant prêt'],
    ['POS', 'stores, cashiers, products, receipt template, payment methods, cash controls', 'Assistant prêt'],
  ],
  portalRows: [
    ['Customer portal', 'invoice list, payment promises, statement download, messages, access controls', 'Poli'],
    ['Supplier portal', 'document upload, RFQ response, statement view, disputes, security review', 'Poli'],
    ['Accountant portal', 'client list, evidence requests, review comments, period close, tax deadlines', 'Poli'],
    ['Implementation partner portal', 'tenant progress, blockers, go-live checklist, migration status', 'Poli'],
  ],
  mobileRows: [
    ['Executive mobile summary', 'cash, sales, stock alerts, approvals, payroll blockers, tax deadlines', 'Mobile'],
    ['Warehouse mobile scan', 'receiving, picking, transfer, inventory count, stock lookup', 'Scan'],
    ['Cashier tablet mode', 'large touch targets, quick products, payment buttons, receipt preview, offline banner', 'Tablet'],
    ['Accountant dense mode', 'compact tables, keyboard shortcuts, batch posting, export-focused actions', 'Dense'],
    ['Manager approval mobile', 'financial summary, risk reason, comment, approve, reject, audit', 'Mobile'],
  ],
  controlRows: [
    ['Advanced search syntax', 'invoice numbers, ICE, SKU, amount ranges, dates, statuses, module filters', 'FAC-2026-* ICE:0015* amount:1000..5000'],
    ['Duplicate resolution workbench', 'customers, suppliers, products, invoices, payments, employees', 'Fusion auditée'],
    ['Data quality dashboard', 'missing identifiers, invalid VAT rates, stale records, duplicates, owner assignments', 'Responsables assignés'],
    ['Monthly product usability review', 'screenshots, task-completion metrics, bugs, user feedback', 'Cadence mensuelle'],
    ['In-app feedback capture', 'workspace, record, screenshot, user role, browser metadata', 'Lié au support'],
    ['Release readiness UX gate', 'core journeys, accessibility, visual checks, E2E tests', 'Bloque release si rouge'],
  ],
};

