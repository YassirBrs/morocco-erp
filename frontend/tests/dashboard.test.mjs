import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const modulePages = [
  '../app/ventes/page.tsx',
  '../app/crm/page.tsx',
  '../app/stock/page.tsx',
  '../app/comptabilite/page.tsx',
  '../app/paie/page.tsx',
  '../app/pos/page.tsx',
  '../app/conformite/page.tsx',
  '../app/admin/page.tsx',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));
const staticPage = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
const staticCss = readFileSync(new URL('../static.css', import.meta.url), 'utf8');
const api = readFileSync(new URL('../lib/api.ts', import.meta.url), 'utf8');

test('dashboard renders Morocco ERP workspace sections', () => {
  for (const text of ['Ventes', 'Stock et CUMP', 'Comptabilité', 'Paie', 'Conformité Maroc']) {
    assert.ok(page.includes(text), `${text} section is present`);
  }
});

test('frontend is wired for tenant-scoped backend calls', () => {
  assert.ok(api.includes("'x-tenant-id': TENANT_ID"));
  assert.ok(api.includes('/tenant/current'));
  assert.ok(api.includes('/search?q='));
  assert.ok(api.includes('/sales/invoices'));
  assert.ok(api.includes('/inventory'));
  assert.ok(staticPage.includes("'x-tenant-id': 'tenant-demo'"));
  assert.ok(staticPage.includes('/sales/invoices'));
  assert.ok(staticPage.includes('/sales/orders'));
  assert.ok(staticPage.includes('/sales/delivery-notes'));
  assert.ok(staticPage.includes('/sales/credit-notes'));
  assert.ok(staticPage.includes('/sales/customers/cus-1/statement'));
  assert.ok(staticPage.includes('/crm/customers/credit-control'));
  assert.ok(staticPage.includes('/crm/customers/document-reminders'));
  assert.ok(staticPage.includes('/crm/customers/import-template.csv'));
  assert.ok(staticPage.includes('/crm/leads'));
  assert.ok(staticPage.includes('/crm/leads/analytics'));
  assert.ok(staticPage.includes('/crm/leads/export.csv'));
  assert.ok(staticPage.includes('/crm/leads/import'));
  assert.ok(staticPage.includes('/crm/leads/${lead.id}/quote'));
  assert.ok(staticPage.includes('/inventory/suppliers'));
  assert.ok(staticPage.includes('/inventory/suppliers/import-template.csv'));
  assert.ok(staticPage.includes('/inventory/products/margin-alerts'));
  assert.ok(staticPage.includes('/inventory/products/import-template.csv'));
  assert.ok(staticPage.includes('/inventory/purchase-orders'));
  assert.ok(staticPage.includes('/inventory/purchase-receipts'));
  assert.ok(staticPage.includes('/inventory/supplier-invoices'));
  assert.ok(staticPage.includes('/inventory/warehouses'));
  assert.ok(staticPage.includes('/inventory/warehouse-stock'));
  assert.ok(staticPage.includes('/inventory/stock-alerts'));
  assert.ok(staticPage.includes('/inventory/reservations'));
  assert.ok(staticPage.includes('/inventory/stock-transfers'));
  assert.ok(staticPage.includes('/inventory/inventory-counts'));
  assert.ok(staticPage.includes('/inventory/barcode/6111000000010'));
  assert.ok(staticPage.includes('/inventory/suppliers/risk-reminders'));
  assert.ok(staticPage.includes('/inventory/suppliers/${supplier.id}/document-placeholders'));
  assert.ok(staticPage.includes('/inventory/suppliers/export.csv'));
  assert.ok(staticPage.includes('/inventory/suppliers/import'));
  assert.ok(staticPage.includes('duplicateWarnings'));
  assert.ok(staticPage.includes('/tenant/setup-checklist'));
  assert.ok(staticPage.includes('/tenant/dashboard-filters'));
  assert.ok(staticPage.includes('/tenant/role-widgets'));
  assert.ok(staticPage.includes('/tenant/role-navigation/READ_ONLY'));
  assert.ok(staticPage.includes('/tenant/subscription-gate'));
  assert.ok(staticPage.includes('/tenant/retention-policy'));
  assert.ok(staticPage.includes('/tenant/data-export'));
  assert.ok(staticPage.includes('/tenant/import-templates'));
  assert.ok(staticPage.includes('/tenant/implementation-partner/workspace'));
  assert.ok(staticPage.includes('/tenant/implementation-partner/clients'));
  assert.ok(staticPage.includes('/tenant/approval-limits'));
  assert.ok(staticPage.includes('/tenant/company-profile'));
  assert.ok(staticPage.includes('/tenant/company-profile/approve'));
  assert.ok(staticPage.includes('/tenant/demo-reset'));
  assert.ok(staticPage.includes('/sales/payment-reminders'));
  assert.ok(staticPage.includes('/inventory/suppliers/payment-calendar'));
  assert.ok(staticPage.includes('/compliance/vat-declaration-checklist'));
  assert.ok(staticPage.includes('/ledger/periods/close-checklist'));
  assert.ok(staticPage.includes('/ledger/accounts'));
  assert.ok(staticPage.includes('/ledger/accounts?q=client'));
  assert.ok(staticPage.includes('/ledger/journal'));
  assert.ok(staticPage.includes('/ledger/journal/${draft.id}/post'));
  assert.ok(staticPage.includes('/ledger/vat-report'));
  assert.ok(staticPage.includes('/ledger/export?format=CSV'));
  assert.ok(staticPage.includes('/ledger/reconciliation'));
  assert.ok(staticPage.includes('/ledger/evidence'));
  assert.ok(staticPage.includes('/payroll/contracts'));
  assert.ok(staticPage.includes('/payroll/runs'));
  assert.ok(staticPage.includes('/payroll/runs/${run.id}/calculate'));
  assert.ok(staticPage.includes('/payroll/runs/${run.id}/approve'));
  assert.ok(staticPage.includes('/payroll/runs/${run.id}/post'));
  assert.ok(staticPage.includes('/payroll/runs/${run.id}/damancom'));
  assert.ok(staticPage.includes('/payroll/runs/${run.id}/payslips/${payslip.id}/pdf'));
  assert.ok(staticPage.includes('/crm/customers/duplicates'));
  assert.ok(staticPage.includes('/inventory/products/duplicates'));
  assert.ok(staticPage.includes('/ledger/audit'));
  assert.ok(staticPage.includes('/ledger/chart-of-accounts/import-template.csv'));
  assert.ok(staticPage.includes('/search?q='));
  assert.ok(staticPage.includes("method: 'PATCH'"));
  assert.ok(staticPage.includes('/crm/customers'));
  assert.ok(staticPage.includes('/inventory/products'));
  assert.ok(staticPage.includes('/payroll/employees'));
  assert.ok(staticPage.includes('/payroll/employees/import-template.csv'));
  assert.ok(staticPage.includes('/auth/login'));
  assert.ok(staticPage.includes('/auth/refresh'));
  assert.ok(staticPage.includes('/auth/2fa/verify'));
  assert.ok(staticPage.includes('/auth/device-history'));
});

test('static dashboard uses sidebar module navigation instead of showing one compacted page', () => {
  for (const view of ['dashboard', 'sales', 'crm', 'stock', 'accounting', 'payroll', 'pos', 'production', 'compliance', 'implementation']) {
    assert.ok(staticPage.includes(`data-view="${view}"`), `${view} navigation item exists`);
  }
  for (const marker of ['data-view-section="dashboard"', 'data-view-section="sales stock"', 'data-view-section="crm stock"', 'data-view-section="sales accounting compliance"']) {
    assert.ok(staticPage.includes(marker), `${marker} section marker exists`);
  }
  assert.ok(staticPage.includes('switchModuleView(state.activeView)'));
  assert.ok(staticPage.includes("section.classList.toggle('viewHidden'"));
  assert.ok(staticCss.includes('.viewHidden'));
  assert.ok(staticCss.includes('.navItem.active'));
});

test('static dashboard exposes unified business search', () => {
  for (const text of ['Recherche', 'Client', 'Prospect', 'Fournisseur', 'Article', 'Facture', 'Commande']) {
    assert.ok(staticPage.includes(text), `${text} search label is present`);
  }
  assert.ok(staticPage.includes('renderBusinessSearch'));
  assert.ok(staticPage.includes('switchModuleView(item.dataset.viewTarget)'));
  assert.ok(staticCss.includes('.businessSearch'));
  assert.ok(staticCss.includes('.searchResults'));
  assert.ok(staticCss.includes('.searchResult'));
});

test('static dashboard exposes operational filter cards', () => {
  for (const text of ['Filtres tableau de bord', 'Actions en retard', 'Soldes impayés', 'Délais fournisseurs']) {
    assert.ok(staticPage.includes(text), `${text} dashboard filter is present`);
  }
  assert.ok(staticPage.includes('renderDashboardFilters'));
  assert.ok(staticPage.includes("Filtre appliqué: actions en retard."));
  assert.ok(staticPage.includes("Filtre appliqué: soldes impayés."));
  assert.ok(staticPage.includes("Filtre appliqué: délais fournisseurs."));
  assert.ok(staticCss.includes('.filterCards'));
  assert.ok(staticCss.includes('.filterCard'));
});

test('static dashboard exposes role widgets and compliance planning panels', () => {
  for (const text of ['Widgets par rôle', 'Direction', 'Ventes', 'RH / Paie', 'Relances de paiement', 'Calendrier paiements', 'Checklist de revue', 'Déclaration TVA', 'Complétude documents fiscaux', 'Clôture période', 'Prêt clôture', 'Prochaine relance', 'Risque']) {
    assert.ok(staticPage.includes(text), `${text} planning label is present`);
  }
  for (const marker of ['renderRoleWidgets', 'renderPaymentReminders', 'renderSupplierCalendar', 'renderVatChecklist', 'renderFiscalCloseChecklist', 'data-role-widget', 'data-role-widget-view']) {
    assert.ok(staticPage.includes(marker), `${marker} renderer or marker is present`);
  }
  assert.ok(staticCss.includes('.roleWidgetGrid'));
  assert.ok(staticCss.includes('.roleWidgetCard'));
  assert.ok(staticCss.includes('.opsGrid'));
  assert.ok(staticCss.includes('.vatReviewGrid'));
});

test('layout uses dense ERP panels instead of a marketing hero', () => {
  assert.ok(css.includes('.shell'));
  assert.ok(css.includes('.gridTwo'));
  assert.ok(css.includes('grid-template-columns: 260px'));
});

test('global styles expose the professional ERP palette', () => {
  for (const token of ['--color-primary: #1E3A8A', '--color-primary-hover: #3B82F6', '--background-main: #F8FAFC', '--background-surface: #FFFFFF', '--color-border: #E2E8F0', '--text-primary: #0F172A', '--text-secondary: #475569']) {
    assert.ok(css.includes(token), `${token} exists in Next globals`);
    assert.ok(staticCss.includes(token), `${token} exists in static globals`);
  }
  for (const token of ['--status-success-text: #16A34A', '--status-warning-text: #D97706', '--status-danger-text: #DC2626', '--status-info-text: #2563EB']) {
    assert.ok(css.includes(token), `${token} status token exists in Next globals`);
    assert.ok(staticCss.includes(token), `${token} status token exists in static globals`);
  }
  assert.ok(staticCss.includes('background: var(--primary)'));
  assert.ok(staticCss.includes('background: var(--blue-soft)'));
  assert.ok(css.includes('background: var(--primary)'));
  assert.ok(css.includes('background: var(--blue-soft)'));
});

test('static dashboard exposes onboarding and master-data workflows', () => {
  for (const text of ['Liste de mise en service', 'Ajouter client', 'Ajouter article', 'Ajouter prospect', 'Ajouter fournisseur', 'Nom client', 'Prix vente', 'Code-barres', 'Téléphone', 'Doublons clients', 'Doublons articles', 'RIB marocain', 'Limites approbation', 'Limiter approbations démo', 'Approbation requise', 'Contrôle crédit clients', 'Blocage crédit', 'OK crédit', 'Document client', 'Expiration document client', 'Alertes documents clients', 'Garantie paiement', 'Alertes marge produits', 'Prix minimum TTC', 'Sous seuil', 'Fournisseur préféré', 'Notes risque', 'Expiration document', 'Alertes fournisseurs', 'Placeholder document', 'Dossier:', 'Expirés', 'À renouveler', 'Préférés', 'Créer devis', 'Convertir en devis', 'Exporter CSV prospects', 'Exporter CSV fournisseurs', 'Importer CSV démo', 'Analytics sources prospects', 'Avoir', 'Relevé client', 'Payer solde']) {
    assert.ok(staticPage.includes(text), `${text} workflow is present`);
  }
  for (const text of ['Comptabilisée', 'Payée', 'Facture', 'Paiement', 'Marchandise', 'Pipeline prospects', 'Fournisseurs', 'Profil entreprise', 'Réinitialiser démo', 'En attente revue', 'Approuver', 'alerte doublon', 'Banque normalisée', 'Import CSV prospects', 'Import CSV fournisseurs']) {
    assert.ok(staticPage.includes(text), `${text} French label is present`);
  }
  assert.ok(staticPage.includes('pattern="[0-9\\\\s-]{24,}"'));
  assert.ok(staticPage.includes('renderCustomerDuplicates'));
  assert.ok(staticPage.includes('renderProductDuplicates'));
  assert.ok(staticCss.includes('.compactForm'));
  assert.ok(staticCss.includes('.salesFlowActions'));
  assert.ok(staticCss.includes('.statementBox'));
  assert.ok(staticCss.includes('.miniTable small'));
  assert.ok(staticCss.includes('.message.success'));
  assert.ok(staticCss.includes('.message.error'));
  assert.ok(staticCss.includes('.profileGrid'));
  assert.ok(staticCss.includes('.profileActions'));
  assert.ok(staticCss.includes('.headerActions'));
  assert.ok(staticCss.includes('.analyticsBox'));
  assert.ok(staticCss.includes('.checkboxField'));
  assert.ok(staticCss.includes('.segmented'));
  assert.ok(staticCss.includes('.statusPill.warning'));
  assert.ok(staticCss.includes('.approvalLimits'));
  assert.ok(staticCss.includes('.message.warning'));
  assert.ok(staticCss.includes('.warningText'));
});

test('static dashboard exposes collaboration timelines, notes, tasks, and bulk archive workflows', () => {
  for (const text of ['Timelines et tâches', 'Timeline client', 'Timeline fournisseur', 'Timeline facture', 'Notes et tâches internes', 'Note client', 'Tâche client', 'Note fournisseur', 'Tâche fournisseur', 'Note facture', 'Tâche facture', 'Note paie', 'Tâche paie', 'Terminer tâche', 'Archiver clients inactifs', 'Restaurer clients', 'Archiver fournisseurs', 'Restaurer fournisseurs', 'Archiver articles', 'Restaurer articles']) {
    assert.ok(staticPage.includes(text), `${text} collaboration or bulk workflow is present`);
  }
  for (const endpoint of ['/tenant/collaboration-board', '/tenant/tasks/${task.id}', '/crm/customers/cus-1/timeline', '/crm/customers/cus-1/notes', '/crm/customers/cus-1/tasks', '/inventory/suppliers/sup-1/timeline', '/inventory/suppliers/sup-1/notes', '/inventory/suppliers/sup-1/tasks', '/sales/invoices/${latest(invoices).id}/timeline', '/sales/invoices/${invoice.id}/notes', '/sales/invoices/${invoice.id}/tasks', '/payroll/runs/PAY-2026-05/timeline', '/payroll/runs/PAY-2026-05/notes', '/payroll/runs/PAY-2026-05/tasks', '/crm/customers/bulk-status', '/inventory/suppliers/bulk-status', '/inventory/products/bulk-status']) {
    assert.ok(staticPage.includes(endpoint), `${endpoint} endpoint is wired`);
  }
  for (const marker of ['renderCollaboration', 'timelineRows', 'latestOrCreateInvoice', 'bulkStatus', "method: 'PATCH'"]) {
    assert.ok(staticPage.includes(marker), `${marker} collaboration helper is present`);
  }
  for (const cssToken of ['.collabActions', '.timelineGrid', '.timelineTable', '.taskBoard']) {
    assert.ok(staticCss.includes(cssToken), `${cssToken} style exists`);
  }
});

test('static dashboard exposes Arabic-ready fields, CSV templates, employees, and partner onboarding', () => {
  for (const text of ['Nom arabe', 'Adresse arabe', 'Langue document', 'Document arabe', 'Description arabe', 'Modèle CSV clients', 'Modèle CSV fournisseurs', 'Modèle CSV articles', 'Modèle CSV salariés', 'Modèles CSV avec champs Arabic-ready', 'Salariés', 'Portefeuille clients', 'Créer client démo', 'Accompagnement']) {
    assert.ok(staticPage.includes(text), `${text} Arabic-ready/template/partner label is present`);
  }
  for (const marker of ['renderImportTemplates', 'renderPartnerWorkspace', 'renderEmployees', 'downloadTemplate', 'data-template-kind', 'employeeForm']) {
    assert.ok(staticPage.includes(marker), `${marker} renderer or marker is present`);
  }
  for (const endpoint of ['/tenant/import-templates', '/tenant/implementation-partner/workspace', '/tenant/implementation-partner/clients', '/crm/customers/import-template.csv', '/inventory/suppliers/import-template.csv', '/inventory/products/import-template.csv', '/payroll/employees/import-template.csv', '/ledger/chart-of-accounts/import-template.csv']) {
    assert.ok(staticPage.includes(endpoint), `${endpoint} endpoint is wired`);
  }
  for (const cssToken of ['.templateGrid', '.templateCard']) {
    assert.ok(staticCss.includes(cssToken), `${cssToken} style exists`);
  }
});

test('static dashboard exposes security, subscription, retention, purchase, and inventory batch workflows', () => {
  for (const text of ['Sécurité et abonnement', 'Sessions, rôles et rétention', 'Tester connexion sécurisée', 'Exporter tenant', 'Navigation par rôle', 'Verrou écriture abonnement', 'Rétention données', 'Événement sécurité', 'Commandes, réceptions, factures et dépôts', 'Lancer achat démo', 'Transfert dépôt', 'Comptage inventaire', 'Alertes stock minimum', 'Réservations commandes et POS', 'Recherche code-barres']) {
    assert.ok(staticPage.includes(text), `${text} batch workflow label is present`);
  }
  for (const marker of ['renderSecurityAndProcurement', 'runSecurityDemo', 'runPurchaseBatch', 'runTransferBatch', 'runInventoryCount', 'purchaseWorkflowRows', 'warehouseStockRows']) {
    assert.ok(staticPage.includes(marker), `${marker} batch helper is present`);
  }
  for (const cssToken of ['.securityGrid', '.procurementGrid']) {
    assert.ok(staticCss.includes(cssToken), `${cssToken} style exists`);
  }
});

test('static dashboard exposes accounting compliance and payroll run workflows', () => {
  for (const text of ['Comptabilité PCGE', 'Journaux, périodes, TVA et preuves légales', 'Sélecteur PCGE', 'Période fiscale', 'TVA nette', 'Lettrage', 'Écriture manuelle', 'Comptabiliser brouillon', 'Export comptable', 'Archiver preuve', 'Paie Maroc', 'Runs, contrats, bulletins et Damancom', 'Créer paie mensuelle', 'Comptabiliser paie', 'Export Damancom', 'PDF bulletin', 'Contrats actifs', 'Brut période', 'Net à payer']) {
    assert.ok(staticPage.includes(text), `${text} accounting/payroll workflow label is present`);
  }
  for (const marker of ['renderAccountingControls', 'renderPayrollRuns', 'createManualJournal', 'postManualJournal', 'prepareAccountingExport', 'archiveAccountingEvidence', 'createPayrollRun', 'calculatePayrollRun', 'approvePayrollRun', 'postPayrollRun', 'exportDamancomRun', 'generatePayslipPdf']) {
    assert.ok(staticPage.includes(marker), `${marker} accounting/payroll helper is present`);
  }
  for (const cssToken of ['.accountingGrid', '.payrollRunGrid']) {
    assert.ok(staticCss.includes(cssToken), `${cssToken} style exists`);
  }
  for (const token of ['/ledger/accounts?q=client', '/ledger/export?format=CSV', '/ledger/reconciliation', '/payroll/contracts', '/payroll/runs']) {
    assert.ok(api.includes(token) || staticPage.includes(token), `${token} API route is wired`);
  }
});

test('static dashboard exposes HR, POS, production, fleet, project, and profitability workflows', () => {
  for (const text of ['Congés, portail salarié, sessions POS et Z caisse', 'Demande congé', 'Accès portail salarié', 'Session POS', 'Remboursement POS', 'Sync offline POS', 'Z caisse', 'Nomenclatures, maintenance, flotte, projets et rentabilité', 'OF avec nomenclature', 'Maintenance', 'Flotte', 'Projet', 'Rentabilité']) {
    assert.ok(staticPage.includes(text), `${text} HR/POS/operations label is present`);
  }
  for (const marker of ['renderHrPos', 'renderOperationsBackoffice', 'runLeaveFlow', 'grantPortalAccess', 'runPosSession', 'runPosRefund', 'runOfflinePosSync', 'runBomProduction', 'runMaintenanceFlow', 'runFleetFlow', 'runProjectFlow']) {
    assert.ok(staticPage.includes(marker), `${marker} helper or action is present`);
  }
  for (const endpoint of ['/payroll/leave-balances', '/payroll/leave-requests', '/payroll/portal-access', '/payroll/employees/document-reminders', '/pos/sessions', '/pos/transactions', '/pos/offline-queue', '/pos/z-report', '/production/boms', '/production/orders', '/production/maintenance', '/production/fleet', '/production/projects', '/production/profitability']) {
    assert.ok(staticPage.includes(endpoint), `${endpoint} endpoint is wired`);
  }
  for (const cssToken of ['.hrPosGrid', '.operationsBackofficeGrid']) {
    assert.ok(staticCss.includes(cssToken), `${cssToken} style exists`);
  }
});

test('Next primary workspace exposes document PDFs, module screens, UX states, filters, keyboard entry, personalization, and sales reporting', () => {
  for (const text of ['Application Next.js principale', 'Commande globale', 'Ventes et reporting', 'Par produit', 'Par TVA', 'Impayés', 'Documents, filtres et états UX', 'Numérotation', 'Modèles PDF', 'Stockage fichiers', 'États standard', 'Validation backend', 'Filtres sauvegardés', 'Écrans par module', 'liste / détail / créer / modifier']) {
    assert.ok(page.includes(text), `${text} Next primary label is present`);
  }
  for (const marker of ['getSalesDashboard', 'getDocumentOperations', 'getModuleData', 'searchBusiness', 'KeyboardLines', 'ModuleWorkflow', 'DataTable', 'MiniList']) {
    assert.ok(page.includes(marker), `${marker} Next helper is present`);
  }
  for (const endpoint of ['/sales/dashboard', '/tenant/document-numbering', '/tenant/document-templates', '/tenant/file-storage', '/pos/sessions', '/sales/quotes']) {
    assert.ok(api.includes(endpoint), `${endpoint} Next API route is wired`);
  }
  for (const cssToken of ['.commandBar', '.reportGrid', '.splitTables', '.denseControls', '.keyboardGrid', '.tableScroll', '.personalization']) {
    assert.ok(css.includes(cssToken), `${cssToken} Next style exists`);
  }
  for (const staticEndpoint of ['/sales/invoices/${invoice.id}/pdf', '/sales/delivery-notes/${delivery.id}/pdf', '/sales/credit-notes/${creditNote.id}/pdf', '/inventory/purchase-orders/${purchaseOrder.id}/pdf', '/inventory/purchase-receipts/${purchaseReceipt.id}/pdf', '/tenant/document-numbering', '/tenant/document-templates', '/tenant/file-storage', '/sales/dashboard']) {
    assert.ok(staticPage.includes(staticEndpoint) || api.includes(staticEndpoint) || page.includes(staticEndpoint), `${staticEndpoint} export or report route is represented`);
  }
});

test('Next primary workspace exposes reporting, adapter, API key, webhook, bank import, and smoke acceptance batch', () => {
  for (const text of ['Rapports et intégrations', 'Valorisation CUMP', 'Balance âgée clients', 'Résultat net', 'Coût paie', 'Bilan et cohorte', 'Adaptateurs Maroc', 'Banque CSV/OFX', 'Email: factures, relevés, bulletins, relances', 'Tests batch', 'Smoke Playwright', 'Webhooks/API keys', 'Rollback']) {
    assert.ok(page.includes(text), `${text} reporting/integration label is present`);
  }
  for (const marker of ['getOperationalReports', 'getIntegrationReadiness']) {
    assert.ok(page.includes(marker), `${marker} Next helper is present`);
  }
  for (const endpoint of ['/inventory/valuation-report', '/ledger/aging', '/ledger/profit-and-loss', '/ledger/balance-sheet', '/payroll/cost-report', '/tenant/cohort-metrics', '/tenant/acceptance-scenarios', '/compliance/dgi/adapter', '/compliance/cnss/adapter', '/tenant/emails', '/tenant/webhooks', '/tenant/api-keys']) {
    assert.ok(api.includes(endpoint), `${endpoint} reporting/integration API route is wired`);
  }
});

test('Next primary workspace has component coverage for forms, tables, navigation, actions, and error states', () => {
  for (const marker of ['function PanelHeader', 'function Metric', 'function DataTable', 'function MiniList', 'function ModuleWorkflow', 'function KeyboardLines', 'function WorkspaceTile']) {
    assert.ok(page.includes(marker), `${marker} component exists`);
  }
  for (const text of ['Navigation principale', 'Commande globale', 'Validation backend', 'Le client est obligatoire', 'La période fiscale est verrouillée', 'Aucune donnée disponible', 'Gérer abonnement']) {
    assert.ok(page.includes(text), `${text} form/table/navigation/error label is present`);
  }
  assert.ok(page.includes('<table>'));
  assert.ok(page.includes('<thead>'));
  assert.ok(page.includes('<tbody>'));
  assert.ok(page.includes('button type="button"'));
});

test('Next primary workspace includes accessibility checks for navigation, dialogs, forms, tables, and keyboard flows', () => {
  for (const text of ['aria-label="Navigation principale"', 'aria-label="Recherche globale"', 'aria-describedby="commandHelp"', 'aria-label="Saisie clavier lignes"', 'tabIndex={index + 1}', 'role="list"', 'role="listitem"', 'htmlFor="globalCommand"']) {
    assert.ok(page.includes(text), `${text} accessibility marker is present`);
  }
  for (const cssToken of ['letter-spacing: 0', 'white-space: nowrap', '@media (max-width: 980px)', 'min-height: 38px']) {
    assert.ok(css.includes(cssToken), `${cssToken} responsive/accessibility style exists`);
  }
});

test('Next primary workspace exposes production ops, pricing, billing, accountant, super-admin, support, and upgrade readiness', () => {
  for (const text of ['Opérations SaaS et commercialisation', 'Migrations Prisma', 'Observabilité', 'Staging et CI', 'Plans tarifaires', 'Feature flags', 'Upgrade prompts', 'Espace comptable', 'Super-admin', 'Support diagnostics']) {
    assert.ok(page.includes(text), `${text} platform readiness label is present`);
  }
  for (const marker of ['getPlatformReadiness', 'platformReadiness.persistence', 'platformReadiness.billing', 'platformReadiness.accountant', 'platformReadiness.superAdmin', 'platformReadiness.support', 'platformReadiness.upgrades']) {
    assert.ok(page.includes(marker), `${marker} platform helper is present`);
  }
  for (const endpoint of ['/tenant/production-persistence', '/tenant/environment-check', '/tenant/operations/logs', '/tenant/operations/metrics', '/tenant/operations/backup', '/tenant/staging-deployment', '/tenant/operations/jobs', '/tenant/feature-flags', '/tenant/pricing-plans', '/tenant/billing-status', '/tenant/accountant-workspace', '/tenant/super-admin-workspace', '/tenant/support-diagnostics', '/tenant/upgrade-prompts']) {
    assert.ok(api.includes(endpoint), `${endpoint} platform API route is wired`);
  }
  for (const cssToken of ['.opsReadiness', '.workspaceGrid', '.workspaceTile']) {
    assert.ok(css.includes(cssToken), `${cssToken} platform style exists`);
  }
});

test('Next app exposes separate module pages instead of keeping every module only on the dashboard', () => {
  for (const href of ["'/ventes'", "'/crm'", "'/stock'", "'/comptabilite'", "'/paie'", "'/pos'", "'/conformite'", "'/admin'"]) {
    assert.ok(page.includes(href), `${href} module navigation link exists`);
  }
  for (const [index, title] of ['Ventes', 'CRM', 'Stock', 'Comptabilité', 'Paie', 'POS', 'Conformité', 'Admin SaaS'].entries()) {
    assert.ok(modulePages[index].includes(title), `${title} module page has its own route`);
    assert.ok(modulePages[index].includes('className="modulePage"'), `${title} module page uses module layout`);
  }
  assert.ok(css.includes('.modulePage'));
});

test('Next primary workspace exposes advanced Morocco workflow readiness for logistics, treasury, HR, payroll, and procurement', () => {
  for (const text of ['Workflows Maroc avancés', 'Réservations', 'Villes livraison', 'Modes paiement', 'Préflight CNSS', 'Trésorerie', 'RH et paie', 'Achats', 'Espèces, banque, chèque, carte, mobile money', 'Comparaison fournisseurs']) {
    assert.ok(page.includes(text), `${text} advanced workflow label is present`);
  }
  for (const marker of ['getMoroccoWorkflowReadiness', 'moroccoWorkflows.reservations', 'moroccoWorkflows.deliveryRoutes', 'moroccoWorkflows.paymentMethods', 'moroccoWorkflows.damancomPreflight']) {
    assert.ok(page.includes(marker), `${marker} advanced workflow helper is present`);
  }
  for (const endpoint of ['/inventory/reservations', '/sales/delivery-route-plan', '/ledger/payments/reconciliation-by-method', '/ledger/cheques', '/ledger/deposit-batches', '/pos/cashbox-transfers', '/payroll/employees/document-reminders', '/payroll/employees/contract-reminders', '/payroll/leave-calendar', '/payroll/damancom/preflight', '/payroll/exports/archive', '/inventory/purchase-requests']) {
    assert.ok(api.includes(endpoint), `${endpoint} workflow API route is wired`);
  }
  for (const endpoint of ['/sales/invoices/${invoice.id}/email-preview', '/sales/quotes/${quote.id}/approval-email-preview', '/sales/quotes/${quote.id}/accept', '/sales/customers/${customer.id}/statement.pdf', '/inventory/suppliers/${supplier.id}/statement', '/inventory/purchase-requests/${request.id}/supplier-quotes']) {
    assert.ok(api.includes(endpoint), `${endpoint} workflow template route is represented`);
  }
});

test('Next primary workspace exposes governance, audit, export, onboarding, KPI, regional reference, and customer risk readiness', () => {
  for (const text of ['Gouvernance et pilotage', 'Anomalies comptables', 'Numérotation', 'Onboarding', 'Régions Maroc', 'Audit et preuves', 'Sécurité et intégrations', 'Pilotage risques', 'Rate limiting', 'Risque client']) {
    assert.ok(page.includes(text), `${text} governance label is present`);
  }
  for (const marker of ['getGovernanceReadiness', 'governanceReadiness.anomalyChecks', 'governanceReadiness.numberingAudit', 'governanceReadiness.exportManifest', 'governanceReadiness.customerRisk']) {
    assert.ok(page.includes(marker), `${marker} governance helper is present`);
  }
  for (const endpoint of ['/inventory/expiry-alerts', '/inventory/movement-audit', '/ledger/anomaly-checks', '/ledger/accountant-review-queue', '/ledger/numbering-audit', '/tenant/data-export-manifest', '/tenant/invitations', '/tenant/operations/rate-limits', '/tenant/operations/webhook-retries', '/tenant/operations/export-status-center', '/tenant/onboarding-progress?companyType=trading', '/tenant/kpi-targets/variance', '/tenant/executive-digest', '/tenant/evidence-binder', '/tenant/moroccan-regions', '/tenant/customer-risk-scores']) {
    assert.ok(api.includes(endpoint), `${endpoint} governance API route is wired`);
  }
});

test('Next primary workspace exposes operational control workflows for suppliers, stock, contracts, finance, payroll, and HR', () => {
  for (const text of ['Pilotage opérationnel avancé', 'Fiabilité fournisseurs', 'Cycle articles', 'TVA exceptions', 'CNSS anomalies', 'Stock et livraison', 'Contrats et pricing', 'Finance et RH', 'Réservations expirées avec libération automatique', 'États article: brouillon, actif, bloqué, discontinué, archivé']) {
    assert.ok(page.includes(text), `${text} operational control label is present`);
  }
  for (const marker of ['getOperationalControlReadiness', 'operationalControls.supplierReliability', 'operationalControls.lifecycleBoard', 'operationalControls.bankMatching', 'operationalControls.employeeChecklists']) {
    assert.ok(page.includes(marker), `${marker} operational control helper is present`);
  }
  for (const endpoint of ['/inventory/suppliers/reliability-scores', '/inventory/product-lifecycle-board', '/inventory/quarantines', '/sales/delivery-proofs', '/sales/commission-report', '/sales/customer-contracts', '/inventory/supplier-contracts', '/sales/pricing-rules', '/sales/discount-approvals', '/sales/recurring-invoices', '/inventory/recurring-purchases', '/ledger/expense-claims', '/ledger/petty-cash', '/ledger/bank-matching/suggestions', '/ledger/vat-exceptions', '/payroll/employees/cnss-anomalies', '/payroll/variance-report', '/payroll/employee-checklists']) {
    assert.ok(api.includes(endpoint), `${endpoint} operational control API route is wired`);
  }
});
