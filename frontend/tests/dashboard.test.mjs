import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
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
const enterpriseDepthConfig = readFileSync(new URL('../features/enterprise-depth/enterprise-depth-feature-config.ts', import.meta.url), 'utf8');
const enterpriseDepthFeaturePage = readFileSync(new URL('../features/enterprise-depth/enterprise-depth-feature-page.tsx', import.meta.url), 'utf8');
const enterpriseDepthPageFiles = readdirSync(new URL('../pages/enterprise-depth', import.meta.url));
const enterpriseOperationsConfig = readFileSync(new URL('../features/enterprise-operations/enterprise-operations-feature-config.ts', import.meta.url), 'utf8');
const enterpriseOperationsFeaturePage = readFileSync(new URL('../features/enterprise-operations/enterprise-operations-feature-page.tsx', import.meta.url), 'utf8');
const enterpriseOperationsPageFiles = readdirSync(new URL('../pages/enterprise-operations', import.meta.url));

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

test('Next primary workspace exposes extended enterprise controls for portals, rollout, integrations, and evidence', () => {
  for (const text of ['Contrôles entreprise étendus', 'Agences', 'Localisation', 'Intégrations', 'Archive vérifiée', 'RH, actifs et flotte', 'Production, projets, achats', 'Portails et conformité', 'Signature webhooks replay']) {
    assert.ok(page.includes(text), `${text} enterprise control label is present`);
  }
  for (const marker of ['getEnterpriseControlReadiness', 'enterpriseControls.branches', 'enterpriseControls.integrationHealth', 'enterpriseControls.webhookSignature', 'enterpriseControls.exportTamperEvidence']) {
    assert.ok(page.includes(marker), `${marker} enterprise control helper is present`);
  }
  for (const endpoint of ['/payroll/hr-notes?role=OWNER', '/payroll/asset-assignments', '/production/fleet/fuel-efficiency', '/production/maintenance/preventive-schedules', '/production/projects-wip', '/production/variance-report', '/inventory/procurement-budgets', '/tenant/branches', '/tenant/localization-settings', '/tenant/document-templates/preview', '/tenant/emails/audit-trail', '/tenant/customer-portal/cus-1', '/tenant/supplier-portal/sup-1', '/tenant/accountant-portal/reviews', '/tenant/partner-implementation-checklist', '/tenant/compliance-rule-rollout', '/tenant/feature-flags/audit-history', '/tenant/integration-health', '/tenant/webhooks/signature-verification', '/tenant/export-tamper-evidence']) {
    assert.ok(api.includes(endpoint), `${endpoint} enterprise control API route is wired`);
  }
});

test('Next primary workspace exposes growth, restore, SLA, KYC, dispute, collection, and payment control batch', () => {
  for (const text of ['Accélération croissance et recouvrement', 'Score compétitif', 'SLA dépassés', 'KYC client', 'KYS fournisseur', 'Support, release, onboarding', 'SLA, FX et agences', 'Litiges et paiements', 'Concurrents suivis']) {
    assert.ok(page.includes(text), `${text} growth control label is present`);
  }
  for (const marker of ['getGrowthControlReadiness', 'growthControls.restoreChecklist', 'growthControls.competitiveScorecard', 'growthControls.slaTimers', 'growthControls.paymentAllocationPreview']) {
    assert.ok(page.includes(marker), `${marker} growth control helper is present`);
  }
  for (const endpoint of ['/tenant/operations/restore-rehearsal/checklist', '/tenant/support-impersonations', '/tenant/release-notes?role=OWNER&module=tenant', '/tenant/onboarding-nudges', '/tenant/competitive-scorecard', '/tenant/workflow-sla-timers', '/tenant/escalation-rules', '/tenant/currency-preparations', '/tenant/branch-numbering-policies', '/crm/regional-sales-heatmap', '/crm/customers/cus-1/kyc-checklist', '/inventory/suppliers/sup-1/kys-checklist', '/crm/customer-disputes', '/inventory/supplier-disputes', '/crm/promises-to-pay', '/ledger/payments/allocation-preview', '/crm/dunning-policies', '/inventory/supplier-payment-proposals', '/ledger/cheques/lifecycle-audit', '/ledger/payments/adjustment-suggestions']) {
    assert.ok(api.includes(endpoint), `${endpoint} growth control API route is wired`);
  }
});

test('Next primary workspace exposes logistics, close, compliance, payroll, HR audit, and project billing batch', () => {
  for (const text of ['Logistique clôture et paie', 'Réservations âgées', 'Exceptions BL/facture', 'Calendrier fiscal', 'Social paie', 'Stock et transport', 'Clôture comptable', 'Paie et projets', 'Avenants, overtime et remboursements reliés aux journaux']) {
    assert.ok(page.includes(text), `${text} logistics/close label is present`);
  }
  for (const marker of ['getLogisticsCloseReadiness', 'logisticsClose.reservationAging', 'logisticsClose.taxCalendar', 'logisticsClose.socialReconciliation', 'logisticsClose.projectBillingPlans']) {
    assert.ok(page.includes(marker), `${marker} logistics/close helper is present`);
  }
  for (const endpoint of ['/inventory/reservations/aging', '/sales/delivery-instructions', '/sales/transporters', '/sales/delivery-invoice-exceptions', '/inventory/procurement-approval-matrices', '/inventory/supplier-price-history', '/inventory/substitute-recommendations', '/inventory/dead-stock', '/inventory/cump-recalculation-rehearsal', '/ledger/attachment-requirements', '/ledger/pre-closing-accruals', '/ledger/tax-calendar', '/ledger/compliance-owner-reminders', '/payroll/loans', '/payroll/social-declaration-reconciliation', '/payroll/hr-audit-trail?role=OWNER', '/production/project-billing-plans']) {
    assert.ok(api.includes(endpoint), `${endpoint} logistics/close API route is wired`);
  }
});

test('Next primary workspace exposes regulated service, admin, tax, support, and CNSS control batch', () => {
  for (const text of ['Contrôles réglementaires et service client', 'Contrats service', 'Score qualité données', 'Prorata TVA', 'Anomalies CNSS', 'Service client et opérations', 'Admin SaaS et support', 'Fiscal Maroc', 'Clés API granulaires', 'Sandbox import', 'Centre exports filtres', 'Calendrier DGI preuves manquantes']) {
    assert.ok(page.includes(text), `${text} regulated service label is present`);
  }
  for (const endpoint of ['/sales/service-contracts', '/sales/service-contracts/draft-invoices', '/sales/service-contracts/renewal-reminders', '/sales/warranty-cases', '/production/quality-checks', '/production/maintenance/spare-parts', '/production/fleet/compliance-cases', '/tenant/approval-delegations', '/tenant/import-validation-sandbox', '/tenant/data-quality-score', '/tenant/accountant-handoff-pack', '/tenant/implementation-partner/margin-workload', '/tenant/support-tickets', '/tenant/admin-health-checks', '/tenant/resilience-runbook', '/ledger/vat-prorata-rules', '/ledger/vat-prorata-report', '/ledger/is-estimate', '/ledger/professional-tax-records', '/ledger/dgi-declaration-calendar', '/payroll/employees/cnss-anomalies']) {
    assert.ok(api.includes(endpoint), `${endpoint} regulated service endpoint is wired`);
  }
  assert.ok(api.includes('getRegulatedServiceReadiness'));
  assert.ok(api.includes("moduleScopes: ['inventory']"));
  assert.ok(api.includes("kind: 'customers'"));
});

test('Next primary workspace exposes Morocco accounting risk, bilingual documents, references, treasury, stock traceability, and fiscal lock batch', () => {
  for (const text of ['Audit fiscal, risques et références Maroc', 'AMO', 'Jours fériés', 'Villes / régions', 'Documents bilingues', 'Trésorerie et caisse', 'Stock importé', 'Scores et approbations', 'Verrous fiscaux', 'Référentiel Maroc', 'Contrôles alignés PME marocaines']) {
    assert.ok(page.includes(text), `${text} accounting risk label is present`);
  }
  for (const marker of ['getAccountingRiskReadiness', 'accountingRisk.amoReconciliation', 'accountingRisk.arabicInvoiceQa', 'accountingRisk.chequePortfolio', 'accountingRisk.trialBalance']) {
    assert.ok(page.includes(marker), `${marker} accounting risk helper is present`);
  }
  for (const endpoint of ['/payroll/amo-reconciliation', '/tenant/moroccan-public-holidays?year=2026', '/tenant/moroccan-city-regions', '/sales/invoices/${invoice.id}/arabic-rendering-qa', '/sales/customers/cus-1/statement-bilingual.pdf', '/inventory/suppliers/sup-1/statement.pdf', '/ledger/rib-verifications', '/ledger/rib-verifications/${ribVerification.id', '/ledger/cheques/portfolio', '/pos/cashbox-daily-approvals', '/pos/receipt-templates', '/inventory/traceability/export', '/inventory/serial-numbers', '/inventory/landed-cost-allocation', '/ledger/import-declarations', '/inventory/suppliers/risk-score-dashboard', '/tenant/customer-credit-scores', '/tenant/approval-matrix-simulator', '/tenant/accountant-review-mode?period=2026-05', '/tenant/accountant-review-comments', '/ledger/fiscal-lock-exceptions', '/ledger/trial-balance?year=2026&month=5']) {
    assert.ok(api.includes(endpoint), `${endpoint} accounting risk endpoint is wired`);
  }
});

test('Next primary workspace exposes 40-task Morocco scale-up controls batch', () => {
  for (const text of ['Scale-up Maroc: contrôles batch', 'Grand livre', 'Usage SaaS', 'Go-live', 'Cycle count', 'Comptabilité et banques', 'Stock, branches et livraison', 'Paie et conformité', 'SaaS, migration et qualité', 'Approbations et documents', 'Crédit, garanties et achats']) {
    assert.ok(page.includes(text), `${text} scale-up batch label is present`);
  }
  for (const marker of ['getScaleControlsReadiness', 'scaleControls.generalLedger', 'scaleControls.usageMeter', 'scaleControls.goLiveRisk', 'scaleControls.cycleCount']) {
    assert.ok(page.includes(marker), `${marker} scale-up helper is present`);
  }
  assert.ok(api.includes('/tenant/scale-controls-readiness'), 'scale-up batch endpoint is wired');
  for (const token of ['generalLedger', 'customerLedger', 'supplierLedger', 'numberingAudit', 'cancellation', 'transferApproval', 'inventorySnapshot', 'negativePrevention', 'payrollVariance', 'contractRenewal', 'absenceSandbox', 'payrollJournalPreview', 'payrollEvidencePack', 'dgiSandbox', 'cnssSandbox', 'bankImportPreview', 'automatedPaymentMatching', 'paymentAllocationAudit', 'planEnforcement', 'usageMeter', 'goLiveRisk', 'demoScenarios', 'migrationImporter', 'autoFixSuggestions', 'complianceCockpit', 'branchRegistry', 'multiBranchStock', 'deliveryZonePricing', 'customerSectors', 'supplierVault', 'delegatedApprovals', 'documentRedaction', 'ocrQueue', 'cashCollection', 'creditInsurance', 'guaranteeRegister', 'supplierAdvance', 'landedCostSimulation', 'abcClassification', 'cycleCount']) {
    assert.ok(api.includes(token), `${token} scale-up data key is represented`);
  }
});

test('Next primary workspace exposes 40-task Morocco enterprise depth controls batch', () => {
  for (const text of ['Profondeur entreprise Maroc', 'Trésorerie nette', 'Recouvrement', 'Rétention légale', 'OCR livraison', 'Ventes, crédit et prix', 'Recouvrement et trésorerie', 'RH, paie et gouvernance', 'Opérations, flotte et production', 'Portails et data room', 'Archive, signature et onboarding']) {
    assert.ok(page.includes(text), `${text} enterprise depth label is present`);
  }
  for (const marker of ['getEnterpriseDepthReadiness', 'enterpriseDepth.treasury', 'enterpriseDepth.collectionQueue', 'enterpriseDepth.retentionPolicy', 'enterpriseDepth.deliveryOcr']) {
    assert.ok(page.includes(marker), `${marker} enterprise depth helper is present`);
  }
  assert.ok(api.includes('/tenant/enterprise-depth-readiness'), 'enterprise depth endpoint is wired');
  for (const token of ['stockDamage', 'substituteMapping', 'priceListImport', 'marginGuardrails', 'salesTargets', 'commissionAccrual', 'collectionQueue', 'customerDispute', 'supplierDispute', 'treasury', 'chequeDepositSlip', 'bouncedCheque', 'bankCategorization', 'recurringExpenses', 'expenseMatrix', 'employeeAdvance', 'employeeLoans', 'overtime', 'attendance', 'leaveConflicts', 'cnssRegistration', 'offboarding', 'maintenanceConsumption', 'fleetAlerts', 'fleetAccident', 'productionQuality', 'productionCapacity', 'projectChange', 'projectWip', 'customerPortalInvoices', 'supplierPortalUpload', 'dataRoom', 'checklistTemplates', 'telemetry', 'competitiveHeatmap', 'retentionPolicy', 'eSignature', 'customerRiskQuestionnaire', 'supplierRiskQuestionnaire', 'deliveryOcr']) {
    assert.ok(api.includes(token), `${token} enterprise depth data key is represented`);
  }
});

test('Enterprise depth batch has one descriptive dedicated frontend page per feature', () => {
  const expectedFiles = [
    'stock-damage-claim-page.tsx',
    'product-substitute-mapping-page.tsx',
    'customer-price-list-import-page.tsx',
    'margin-guardrails-page.tsx',
    'sales-target-dashboard-page.tsx',
    'sales-commission-accrual-page.tsx',
    'receivable-collection-queue-page.tsx',
    'customer-dispute-resolution-page.tsx',
    'supplier-dispute-resolution-page.tsx',
    'treasury-cash-position-page.tsx',
    'cheque-deposit-slip-page.tsx',
    'bounced-cheque-workflow-page.tsx',
    'bank-statement-categorization-page.tsx',
    'recurring-expense-calendar-page.tsx',
    'expense-approval-matrix-page.tsx',
    'employee-advance-request-page.tsx',
    'employee-loan-ledger-page.tsx',
    'overtime-planning-approval-page.tsx',
    'attendance-import-validation-page.tsx',
    'leave-calendar-conflicts-page.tsx',
    'cnss-registration-checklist-page.tsx',
    'employee-offboarding-workflow-page.tsx',
    'maintenance-spare-part-consumption-page.tsx',
    'fleet-document-alerts-page.tsx',
    'fleet-accident-case-page.tsx',
    'production-quality-checklist-page.tsx',
    'production-capacity-planning-page.tsx',
    'project-change-request-page.tsx',
    'project-wip-dashboard-page.tsx',
    'customer-portal-invoice-view-page.tsx',
    'supplier-portal-document-upload-page.tsx',
    'tenant-data-room-page.tsx',
    'implementation-checklist-templates-page.tsx',
    'usage-telemetry-dashboard-page.tsx',
    'competitive-gap-heatmap-page.tsx',
    'electronic-document-retention-page.tsx',
    'invoice-e-signature-readiness-page.tsx',
    'customer-onboarding-risk-questionnaire-page.tsx',
    'supplier-onboarding-risk-questionnaire-page.tsx',
    'delivery-proof-photo-ocr-page.tsx',
  ];
  assert.equal(enterpriseDepthPageFiles.filter((file) => file.endsWith('-page.tsx')).length, 40);
  for (const file of expectedFiles) {
    assert.ok(enterpriseDepthPageFiles.includes(file), `${file} dedicated page exists`);
    const source = readFileSync(new URL(`../pages/enterprise-depth/${file}`, import.meta.url), 'utf8');
    assert.ok(source.includes('makeEnterpriseDepthServerSideProps'), `${file} has server-side data wiring`);
  }
  assert.ok(enterpriseDepthFeaturePage.includes('EnterpriseDepthFeaturePage'), 'shared feature page component exists');
  assert.ok(enterpriseDepthConfig.includes('enterpriseDepthFeatureDefinitions'), 'feature definitions are centralized');
  assert.ok(page.includes('enterpriseDepthFeatureDefinitions'), 'dashboard links to dedicated feature pages');
});

test('Next primary workspace exposes 40-task Morocco enterprise operations controls batch', () => {
  for (const text of ['Opérations entreprise Maroc', 'Transport', 'Provision stock', 'Paie banque', 'P&L agence', 'Achats, stock et transport', 'Recouvrement, POS et banque', 'RH, paie et conformité sociale', 'Production, flotte et projets', 'Portails, archives et déclarations', 'Pilotage, sécurité et marge']) {
    assert.ok(page.includes(text), `${text} enterprise operations label is present`);
  }
  for (const marker of ['getEnterpriseOperationsReadiness', 'enterpriseOperations.transporterReconciliation', 'enterpriseOperations.payrollBankTransfer', 'enterpriseOperations.branchPnl', 'enterpriseOperations.auditAnomalies']) {
    assert.ok(page.includes(marker), `${marker} enterprise operations helper is present`);
  }
  assert.ok(api.includes('/tenant/enterprise-operations-readiness'), 'enterprise operations endpoint is wired');
  for (const token of ['transporterReconciliation', 'securityIncident', 'obsolescenceProvision', 'importVatRecovery', 'threeWayMatch', 'supplierPaymentRun', 'dunningTemplates', 'collectionCallLog', 'cashReceiptAudit', 'posZReport', 'bankReconciliationPdf', 'bankTransferAdapter', 'payrollBankTransfer', 'benefitInKind', 'endOfContract', 'occupationalHealth', 'disciplinaryWorkflow', 'headcountDashboard', 'componentShortage', 'subcontracting', 'downtimeAnalytics', 'mileageReimbursement', 'fuelCardImport', 'projectCommitments', 'timesheetApproval', 'portalPaymentPromise', 'supplierCertificateRenewal', 'accountantAnnotations', 'legalArchiveBundle', 'dgiVatPayload', 'irSalaryPayload', 'cnssAmendment', 'publicProcurement', 'retentionGuarantee', 'branchPnl', 'multiCompanyDashboard', 'securityChecklist', 'permissionSimulator', 'auditAnomalies', 'customerProfitability']) {
    assert.ok(api.includes(token), `${token} enterprise operations data key is represented`);
  }
});

test('Enterprise operations batch has one descriptive dedicated frontend page per feature', () => {
  const expectedFiles = [
    'transporter-invoice-reconciliation-page.tsx',
    'warehouse-security-incident-log-page.tsx',
    'inventory-obsolescence-provision-page.tsx',
    'moroccan-import-vat-recovery-page.tsx',
    'purchase-three-way-match-page.tsx',
    'supplier-payment-run-approval-page.tsx',
    'customer-dunning-email-templates-page.tsx',
    'collection-call-log-page.tsx',
    'cash-receipt-numbering-audit-page.tsx',
    'pos-z-report-closure-page.tsx',
    'bank-reconciliation-statement-pdf-page.tsx',
    'bank-transfer-payment-file-adapter-page.tsx',
    'payroll-bank-transfer-export-page.tsx',
    'payroll-benefit-in-kind-tracking-page.tsx',
    'payroll-end-of-contract-settlement-page.tsx',
    'occupational-health-reminders-page.tsx',
    'employee-disciplinary-workflow-page.tsx',
    'hr-headcount-dashboard-page.tsx',
    'production-component-shortage-forecast-page.tsx',
    'production-subcontracting-workflow-page.tsx',
    'maintenance-downtime-analytics-page.tsx',
    'fleet-mileage-reimbursement-page.tsx',
    'fleet-fuel-card-import-sandbox-page.tsx',
    'project-procurement-commitment-report-page.tsx',
    'project-timesheet-approval-workflow-page.tsx',
    'customer-portal-payment-promise-page.tsx',
    'supplier-portal-certificate-renewal-page.tsx',
    'accountant-review-annotations-page.tsx',
    'legal-archive-export-bundle-page.tsx',
    'dgi-vat-declaration-payload-page.tsx',
    'ir-salary-declaration-payload-page.tsx',
    'cnss-declaration-amendment-workflow-page.tsx',
    'moroccan-public-procurement-customer-page.tsx',
    'construction-retention-guarantee-tracking-page.tsx',
    'branch-profit-center-pnl-page.tsx',
    'multi-company-accountant-dashboard-page.tsx',
    'tenant-security-review-checklist-page.tsx',
    'role-permission-simulator-page.tsx',
    'audit-anomaly-detector-page.tsx',
    'customer-profitability-report-page.tsx',
  ];
  assert.equal(enterpriseOperationsPageFiles.filter((file) => file.endsWith('-page.tsx')).length, 40);
  for (const file of expectedFiles) {
    assert.ok(enterpriseOperationsPageFiles.includes(file), `${file} dedicated page exists`);
    const source = readFileSync(new URL(`../pages/enterprise-operations/${file}`, import.meta.url), 'utf8');
    assert.ok(source.includes('makeEnterpriseOperationsServerSideProps'), `${file} has server-side data wiring`);
  }
  assert.ok(enterpriseOperationsFeaturePage.includes('EnterpriseOperationsFeaturePage'), 'shared operations feature page component exists');
  assert.ok(enterpriseOperationsConfig.includes('enterpriseOperationsFeatureDefinitions'), 'operations feature definitions are centralized');
  assert.ok(page.includes('enterpriseOperationsFeatureDefinitions'), 'dashboard links to dedicated operations feature pages');
});
