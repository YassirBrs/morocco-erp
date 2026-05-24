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
  '../app/workflows/page.tsx',
  '../app/contrats-ux/page.tsx',
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
const enterpriseExpansionConfig = readFileSync(new URL('../features/enterprise-expansion/enterprise-expansion-feature-config.ts', import.meta.url), 'utf8');
const enterpriseExpansionFeaturePage = readFileSync(new URL('../features/enterprise-expansion/enterprise-expansion-feature-page.tsx', import.meta.url), 'utf8');
const enterpriseExpansionPageFiles = readdirSync(new URL('../pages/enterprise-expansion', import.meta.url));
const enterpriseAccelerationConfig = readFileSync(new URL('../features/enterprise-acceleration/enterprise-acceleration-feature-config.ts', import.meta.url), 'utf8');
const enterpriseAccelerationFeaturePage = readFileSync(new URL('../features/enterprise-acceleration/enterprise-acceleration-feature-page.tsx', import.meta.url), 'utf8');
const enterpriseAccelerationPageFiles = readdirSync(new URL('../pages/enterprise-acceleration', import.meta.url));
const enterpriseIntelligenceConfig = readFileSync(new URL('../features/enterprise-intelligence/enterprise-intelligence-feature-config.ts', import.meta.url), 'utf8');
const enterpriseIntelligenceFeaturePage = readFileSync(new URL('../features/enterprise-intelligence/enterprise-intelligence-feature-page.tsx', import.meta.url), 'utf8');
const enterpriseIntelligencePageFiles = readdirSync(new URL('../pages/enterprise-intelligence', import.meta.url));
const enterpriseAutomationConfig = readFileSync(new URL('../features/enterprise-automation/enterprise-automation-feature-config.ts', import.meta.url), 'utf8');
const enterpriseAutomationFeaturePage = readFileSync(new URL('../features/enterprise-automation/enterprise-automation-feature-page.tsx', import.meta.url), 'utf8');
const enterpriseAutomationPageFiles = readdirSync(new URL('../pages/enterprise-automation', import.meta.url));
const enterpriseAssuranceConfig = readFileSync(new URL('../features/enterprise-assurance/enterprise-assurance-feature-config.ts', import.meta.url), 'utf8');
const enterpriseAssuranceFeaturePage = readFileSync(new URL('../features/enterprise-assurance/enterprise-assurance-feature-page.tsx', import.meta.url), 'utf8');
const enterpriseAssurancePageFiles = readdirSync(new URL('../pages/enterprise-assurance', import.meta.url));
const enterpriseResilienceConfig = readFileSync(new URL('../features/enterprise-resilience/enterprise-resilience-feature-config.ts', import.meta.url), 'utf8');
const enterpriseResilienceFeaturePage = readFileSync(new URL('../features/enterprise-resilience/enterprise-resilience-feature-page.tsx', import.meta.url), 'utf8');
const enterpriseResiliencePageFiles = readdirSync(new URL('../pages/enterprise-resilience', import.meta.url));
const uxShellWorkspace = readFileSync(new URL('../features/ux-organization/erp-shell-workspace.tsx', import.meta.url), 'utf8');
const uxWorkspacePatterns = readFileSync(new URL('../features/ux-organization/erp-workspace-patterns.tsx', import.meta.url), 'utf8');
const uxWorkspaceFixtures = readFileSync(new URL('../features/ux-organization/erp-workspace-fixtures.ts', import.meta.url), 'utf8');
const erpOperationsFixtures = readFileSync(new URL('../features/ux-organization/erp-operations-fixtures.ts', import.meta.url), 'utf8');
const salesWorkspacePage = readFileSync(new URL('../features/ux-organization/sales-workspace-page.tsx', import.meta.url), 'utf8');
const purchasesInventoryWorkspacePage = readFileSync(new URL('../features/ux-organization/purchases-inventory-workspace-page.tsx', import.meta.url), 'utf8');
const accountingWorkspacePage = readFileSync(new URL('../features/ux-organization/accounting-workspace-page.tsx', import.meta.url), 'utf8');
const payrollWorkspacePage = readFileSync(new URL('../features/ux-organization/payroll-hr-workspace-page.tsx', import.meta.url), 'utf8');
const posWorkspacePage = readFileSync(new URL('../features/ux-organization/pos-workspace-page.tsx', import.meta.url), 'utf8');
const adminComplianceWorkspacePage = readFileSync(new URL('../features/ux-organization/admin-compliance-workspace-page.tsx', import.meta.url), 'utf8');
const workflowProductizationFixtures = readFileSync(new URL('../features/ux-organization/workflow-productization-fixtures.ts', import.meta.url), 'utf8');
const operationalWorkflowCenterPage = readFileSync(new URL('../features/ux-organization/operational-workflow-center-page.tsx', import.meta.url), 'utf8');
const erpContractWorkspacePage = readFileSync(new URL('../features/ux-organization/erp-contract-workspace-page.tsx', import.meta.url), 'utf8');
const erpContractFixtures = readFileSync(new URL('../features/ux-organization/erp-contract-fixtures.ts', import.meta.url), 'utf8');
const workspaceUiStateStore = readFileSync(new URL('../features/ux-organization/workspace-ui-state-store.ts', import.meta.url), 'utf8');
const workspaceRouteState = readFileSync(new URL('../features/ux-organization/workspace-route-state.tsx', import.meta.url), 'utf8');

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
  for (const href of ["'/ventes'", "'/achats-stock'", "'/comptabilite'", "'/paie'", "'/admin'"]) {
    assert.ok(page.includes(href), `${href} module navigation link exists`);
  }
  for (const [index, component] of [[3, 'AccountingWorkspacePage'], [4, 'PayrollHrWorkspacePage'], [5, 'PosWorkspacePage'], [6, 'AdminComplianceWorkspacePage'], [7, 'AdminComplianceWorkspacePage']]) {
    assert.ok(modulePages[index].includes(component), `${component} route delegates to a dedicated workspace view`);
  }
  assert.ok(modulePages[0].includes('SalesWorkspacePage'), 'Ventes route delegates to the dedicated Sales workspace view');
  assert.ok(modulePages[1].includes('SalesWorkspacePage'), 'CRM route delegates to the Sales/CRM workspace language');
  assert.ok(modulePages[2].includes('PurchasesInventoryWorkspacePage'), 'Stock route delegates to the dedicated Achats/Stock workspace view');
  assert.ok(salesWorkspacePage.includes('className="modulePage uxRoutePage"'), 'Sales workspace view owns the route layout');
  assert.ok(purchasesInventoryWorkspacePage.includes('className="modulePage uxRoutePage"'), 'Purchases/Inventory workspace view owns the route layout');
  assert.ok(accountingWorkspacePage.includes('className="modulePage uxRoutePage"'), 'Accounting workspace view owns the route layout');
  assert.ok(payrollWorkspacePage.includes('className="modulePage uxRoutePage"'), 'Payroll workspace view owns the route layout');
  assert.ok(posWorkspacePage.includes('className="modulePage uxRoutePage uxPosMode"'), 'POS workspace view owns the route layout');
  assert.ok(adminComplianceWorkspacePage.includes('className="modulePage uxRoutePage"'), 'Admin/Compliance workspace view owns the route layout');
  assert.ok(css.includes('.modulePage'));
});

test('UX organization batch renders an Odoo Sage grade ERP shell with French controls', () => {
  for (const text of ['ERP Maroc organisé par espaces de travail', 'Ventes', 'Achats/Stock', 'Comptabilité', 'Paie/RH', 'Admin/Conformité', 'Commande universelle', "Fil d'Ariane", 'Centre notifications', 'Presets de navigation par rôle', 'Centre de progression configuration Maroc']) {
    assert.ok(uxShellWorkspace.includes(text) || uxWorkspaceFixtures.includes(text), `${text} UX shell label exists`);
  }
  for (const text of ['Recherche, filtres, tri, pagination, colonnes, export et actions groupées', 'États UX normalisés', 'Validation DTO', 'Panneaux de prévisualisation', 'Création rapide liée', 'Accessibilité ERP']) {
    assert.ok(uxWorkspacePatterns.includes(text), `${text} shared UX pattern exists`);
  }
  for (const cssToken of ['.uxDesktopFrame', '.uxLauncher', '.uxCommandPalette', '.uxDenseTable', '.uxPipeline', '.uxStatus-warning', '.uxMobileFallback', 'focus-visible']) {
    assert.ok(css.includes(cssToken), `${cssToken} UX style exists`);
  }
});

test('Sales workspace covers CRM, document flow, customer 360, invoice preview, and credit notes', () => {
  for (const text of ['Kanban pipeline CRM', 'Documents commerciaux', 'Devis vers encaissement en un clic', 'Client 360', 'Suivi des impayés', 'Aperçu facture conforme Maroc', 'Avoir avec impact comptable']) {
    assert.ok(salesWorkspacePage.includes(text), `${text} Sales workspace section exists`);
  }
  for (const text of ['Approuver devis', 'Convertir en commande', 'Créer BL', 'Créer facture', 'Capturer paiement', 'ICE 001525874000033', 'TVA 20 %', 'Blocage crédit']) {
    assert.ok(salesWorkspacePage.includes(text) || uxWorkspaceFixtures.includes(text), `${text} Sales workflow label exists`);
  }
});

test('Purchases and inventory workspace covers supplier 360, receipt, matching, product 360, and warehouses', () => {
  for (const text of ['Fournisseurs 360', 'Demandes et commandes achat', 'Flux achat et réception', 'Réception magasin optimisée', 'Rapprochement facture fournisseur', 'Inventaire et stock par dépôt', 'Article 360', 'Carte des dépôts', 'Réservations stock à libérer', 'Assistant ajustement stock', 'Workflow inventaire mobile']) {
    assert.ok(purchasesInventoryWorkspacePage.includes(text), `${text} Purchases/Inventory workspace section exists`);
  }
  for (const text of ['Fournitures Nord', 'BC-2026-018', 'CUMP', 'Code-barres', 'Quarantaine', 'Créer dépôt']) {
    assert.ok(purchasesInventoryWorkspacePage.includes(text) || uxWorkspaceFixtures.includes(text) || erpOperationsFixtures.includes(text), `${text} Purchases/Inventory workflow label exists`);
  }
});

test('Accounting, Payroll, POS, and Admin workspaces render French ERP controls', () => {
  for (const text of ['Sélecteur PCGE', 'Journaux et écritures', 'Cockpit TVA', 'Centre de clôture fiscale', 'Rapprochement bancaire', 'Mode revue comptable']) {
    assert.ok(accountingWorkspacePage.includes(text), `${text} accounting section exists`);
  }
  for (const text of ['Salarié 360', 'Assistant run paie', 'Explication de calcul paie', 'Validation Damancom', 'Calendrier congés', 'Centre documents RH']) {
    assert.ok(payrollWorkspacePage.includes(text), `${text} payroll section exists`);
  }
  for (const text of ['Écran caisse tactile', 'Tickets et paiements', 'Clôture session POS', 'Aperçu reçu et Z report', 'Remboursements autorisés', 'Offline sync review']) {
    assert.ok(posWorkspacePage.includes(text), `${text} POS section exists`);
  }
  for (const text of ['Utilisateurs, rôles et permissions', 'Paramètres de numérotation', 'Rule packs conformité Maroc', 'Centre adaptateurs', 'Archive légale et preuves', 'Explorateur audit', 'Diagnostics support et feature gates']) {
    assert.ok(adminComplianceWorkspacePage.includes(text), `${text} admin/compliance section exists`);
  }
});

test('Design-system catalog covers tokens, glossary, Arabic-ready fields, help, and onboarding journeys', () => {
  for (const text of ['Catalogue design system ERP', 'Tokens', 'Composants', 'Icônes badges', 'Glossaire FR', 'Arabic-ready', 'Parcours guidés', 'Tiroir d’aide contextuelle']) {
    assert.ok(adminComplianceWorkspacePage.includes(text), `${text} design-system panel exists`);
  }
  for (const text of ['Couleur primaire', 'Bouton icône', 'Télédéclaration', 'Nom arabe', 'Société de négoce', 'Retail/POS', 'PME forte paie']) {
    assert.ok(erpOperationsFixtures.includes(text), `${text} design-system fixture exists`);
  }
  for (const cssToken of ['.uxPosGrid', '.uxDesignCatalog', '.uxPosMode button', '.uxDesignCatalog span']) {
    assert.ok(css.includes(cssToken), `${cssToken} responsive design style exists`);
  }
});

test('Operational workflow center covers import, export, documents, tasks, approvals, and productivity UX', () => {
  assert.ok(modulePages[8].includes('OperationalWorkflowCenterPage'), 'Workflows route delegates to the operational workflow center');
  for (const text of ['Assistant import CSV', 'Centre exports', 'Aperçus PDF', 'Workflow email et envoi', 'Pièces jointes et preuves', 'Timeline activité', 'Tiroir tâches', 'Boîte d’approbation', 'Détail approbation manager', 'Liens records transverses']) {
    assert.ok(operationalWorkflowCenterPage.includes(text), `${text} workflow section exists`);
  }
  for (const text of ['Widgets personnalisables', 'Kanban opérationnels', 'Calendriers métier', 'Grilles éditables', 'Suggestions IA auditables', 'Scorecard Odoo/Sage', 'Cartes de parcours utilisateurs', 'Architecture informationnelle']) {
    assert.ok(operationalWorkflowCenterPage.includes(text), `${text} productization section exists`);
  }
  for (const text of ['Téléverser CSV', 'Pack TVA mai', 'FAC-2026-014', 'Damancom mai', 'module_open', 'Négoce marocain', 'Comparable Odoo']) {
    assert.ok(workflowProductizationFixtures.includes(text), `${text} workflow fixture exists`);
  }
  for (const cssToken of ['.uxWorkflowCenter textarea', '.uxWizardSteps', '.uxDropzone', '.uxApprovalDetail', '.uxWorkflowCards']) {
    assert.ok(css.includes(cssToken), `${cssToken} workflow style exists`);
  }
});

test('Frontend wires UX-support backend contracts for role-aware workspace APIs', () => {
  for (const endpoint of ['/tenant/ux/recent-records?role=OWNER', '/tenant/ux/favorites', '/tenant/ux/pinned-modules?role=ACCOUNTANT', '/tenant/ux/notification-counts', '/tenant/ux/command-palette?q=facture', '/tenant/ux/next-actions?entity=invoice&status=DRAFT', '/tenant/ux/relationship-graph?entityId=FAC-2026-014', '/tenant/ux/activity-timeline?entityId=FAC-2026-014', '/tenant/ux/task-summary', '/tenant/ux/workspace-health', '/tenant/ux/contracts/validate']) {
    assert.ok(api.includes(endpoint), `${endpoint} UX support API route is wired`);
  }
  for (const typeToken of ['recentRecords', 'favorites', 'pinnedModules', 'notificationCounts', 'commandPalette', 'nextActions', 'relationshipGraph', 'activityTimeline', 'taskSummary', 'workspaceHealth', 'validationContract']) {
    assert.ok(api.includes(typeToken), `${typeToken} UX support contract is represented`);
  }
});

test('UX contract workspace covers API contracts, saved views, jobs, permissions, and smoke flows', () => {
  assert.ok(modulePages[9].includes('ErpContractWorkspacePage'), 'Contrats UX route delegates to the contract workspace');
  assert.ok(page.includes("'/contrats-ux'"), 'Main navigation links to Contrats UX');
  for (const text of ['Contrats API et composants workspace', 'UI state store tenant/role/workspace', 'Workspace route structure descriptive', 'Contrat list-view', 'Contrat detail-view', 'Form page dynamique', 'Validation-error contract', 'Export job status API', 'Import preview table', 'Document send-status API', 'PDF render-status API', 'Permission matrix API', 'Smoke tests workspace', 'Action-result, saved filters et saved columns']) {
    assert.ok(erpContractWorkspacePage.includes(text), `${text} contract workspace label exists`);
  }
  for (const text of ['ReusableWorkspaceHeader', 'ReusableListPage', 'ReusableRecordPage', 'ReusableFormPage', 'ApprovalBanner', 'FinancialTotalsPanel', 'LegalIdentityPanel', 'DocumentEvidencePanel', 'MoroccanValidationPanel', 'AuditDrawer', 'TimelineComposer', 'QuickActionMenu', 'PdfPreviewDrawer', 'ShortcutCheatSheet', 'NotificationItem', 'EnhancedKpiCard', 'UxStatusPill']) {
    assert.ok(uxWorkspacePatterns.includes(text) || erpContractWorkspacePage.includes(text), `${text} reusable component exists`);
  }
  for (const text of ['ICE_15_DIGITS', 'VAT_ALLOWED_RATE', 'Période fiscale verrouillée', 'exp-vat-2026-05', 'Portail fournisseur', 'Sales', 'Purchases', 'Inventory', 'Accounting', 'Payroll']) {
    assert.ok(erpContractFixtures.includes(text), `${text} fixture exists`);
  }
  for (const text of ['currentTenant', 'pinnedModules', 'notifications', 'recentRecords', 'workspaceRouteStructure', "'/sales'", "'/purchases'", "'/inventory'", "'/accounting'", "'/payroll'", "'/cashier'", "'/settings'", 'keyboardShortcutRegistry']) {
    assert.ok(workspaceUiStateStore.includes(text), `${text} UI state or route structure exists`);
  }
});

test('Frontend wires UX contract API endpoints and route-level loading/error states', () => {
  for (const endpoint of ['/tenant/ux/contracts/hub', '/tenant/ux/contracts/list-view?module=sales', '/tenant/ux/contracts/detail-view?module=sales&entityId=FAC-2026-014', '/tenant/ux/contracts/form-schema?module=sales', '/tenant/ux/contracts/action-result', '/tenant/ux/contracts/validation-errors?module=sales', '/tenant/ux/saved-filters', '/tenant/ux/saved-columns', '/tenant/ux/export-jobs', '/tenant/ux/import-jobs', '/tenant/ux/document-send-status', '/tenant/ux/pdf-render-status', '/tenant/ux/approval-policy?module=sales&amount=64000', '/tenant/ux/permission-matrix?role=ACCOUNTANT', '/tenant/ux/ui-state?role=OWNER', '/tenant/ux/smoke-flows']) {
    assert.ok(api.includes(endpoint), `${endpoint} UX contract API route is wired`);
  }
  for (const typeToken of ['UxWorkspaceContractHub', 'getUxWorkspaceContractHub', 'listView', 'detailView', 'formSchema', 'actionResult', 'validationErrors', 'savedFilters', 'savedColumns', 'exportJobs', 'importJobs', 'documentSendStatus', 'pdfRenderStatus', 'approvalPolicy', 'permissionMatrix', 'uiState', 'smokeFlows']) {
    assert.ok(api.includes(typeToken), `${typeToken} contract type is represented`);
  }
  for (const cssToken of ['.uxContractWorkspace', '.uxStateStoreGrid', '.uxRouteMatrix', '.uxPermissionGrid', '.uxContractCards', '.uxRouteList', '.uxApprovalBanner', '.uxShortcutSheet', '.uxNotificationItem', '.uxRouteState']) {
    assert.ok(css.includes(cssToken), `${cssToken} contract workspace style exists`);
  }
  assert.ok(workspaceRouteState.includes('WorkspaceRouteLoading'));
  assert.ok(workspaceRouteState.includes('WorkspaceRouteError'));
  for (const route of ['ventes', 'achats-stock', 'stock', 'comptabilite', 'paie', 'pos', 'admin', 'workflows', 'contrats-ux', 'crm', 'conformite']) {
    const loadingOrError = readFileSync(new URL(`../app/${route}/loading.tsx`, import.meta.url), 'utf8') + readFileSync(new URL(`../app/${route}/error.tsx`, import.meta.url), 'utf8');
    assert.ok(loadingOrError.includes('WorkspaceRouteLoading'), `${route} loading boundary exists`);
    assert.ok(loadingOrError.includes('WorkspaceRouteError'), `${route} error boundary exists`);
  }
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

test('Next primary workspace exposes 40-task Morocco enterprise expansion controls batch', () => {
  for (const text of ['Expansion entreprise Maroc', 'Succès tenant', 'Cash stress', 'Marge transfert', 'Réserve fidélité', 'Croissance, onboarding et risque tiers', 'Verticales métier Maroc', 'Production, services et SaaS', 'Automatisation, conformité et finance', 'Dépenses, contrats et stock']) {
    assert.ok(page.includes(text), `${text} enterprise expansion label is present`);
  }
  for (const marker of ['getEnterpriseExpansionReadiness', 'enterpriseExpansion.tenantSuccess', 'enterpriseExpansion.cashflowStress', 'enterpriseExpansion.branchTransferImpact', 'enterpriseExpansion.reservationExpiry']) {
    assert.ok(page.includes(marker), `${marker} enterprise expansion helper is present`);
  }
  assert.ok(api.includes('/tenant/enterprise-expansion-readiness'), 'enterprise expansion endpoint is wired');
  for (const token of ['supplierProfitabilityRisk', 'onboardingWizard', 'trainingChecklist', 'tenantSuccess', 'migrationRoi', 'cashflowStress', 'accountantTimeline', 'creditCommittee', 'supplierRenewal', 'branchTransferImpact', 'hospitalityServiceCharge', 'loyaltyLiability', 'educationBilling', 'clinicInvoicing', 'constructionProgress', 'landedCostVariance', 'exporterCurrencyPack', 'agriPurchaseIntake', 'scrapRecovery', 'retainerRevenue', 'downgradeRisk', 'legalIdentityChange', 'dataResidency', 'incidentResponse', 'releaseReadiness', 'aiBookkeeping', 'ocrBenchmark', 'bankFeedConsent', 'eInvoicingGaps', 'payrollRuleDiff', 'vatAuditTrail', 'fixedAssetDepreciation', 'leasingTracker', 'insuranceRegister', 'pettyCashReplenishment', 'corporateCardImport', 'travelMission', 'slaPenalty', 'supplierRebate', 'reservationExpiry']) {
    assert.ok(api.includes(token), `${token} enterprise expansion data key is represented`);
  }
});

test('Enterprise expansion batch has one descriptive dedicated frontend page per feature', () => {
  const expectedFiles = [
    'supplier-profitability-risk-report-page.tsx',
    'saas-onboarding-wizard-state-page.tsx',
    'role-training-checklist-page.tsx',
    'tenant-success-score-page.tsx',
    'competitor-migration-roi-calculator-page.tsx',
    'moroccan-sme-cashflow-stress-test-page.tsx',
    'certified-accountant-collaboration-timeline-page.tsx',
    'customer-credit-committee-pack-page.tsx',
    'supplier-renewal-scorecard-page.tsx',
    'branch-stock-transfer-profitability-page.tsx',
    'hospitality-pos-service-charge-page.tsx',
    'retail-loyalty-liability-ledger-page.tsx',
    'private-education-billing-cycle-page.tsx',
    'clinic-service-invoicing-compliance-page.tsx',
    'construction-progress-billing-certificate-page.tsx',
    'importer-landed-cost-variance-page.tsx',
    'exporter-foreign-currency-invoice-pack-page.tsx',
    'cooperative-agri-purchase-intake-page.tsx',
    'manufacturing-scrap-cost-recovery-page.tsx',
    'service-retainer-revenue-recognition-page.tsx',
    'saas-plan-downgrade-risk-simulator-page.tsx',
    'tenant-legal-identity-change-page.tsx',
    'data-residency-checklist-page.tsx',
    'incident-response-report-builder-page.tsx',
    'release-readiness-gate-page.tsx',
    'ai-bookkeeping-suggestion-queue-page.tsx',
    'ocr-vendor-benchmark-dashboard-page.tsx',
    'bank-feed-consent-lifecycle-page.tsx',
    'e-invoicing-readiness-gap-tracker-page.tsx',
    'payroll-rule-pack-version-diff-page.tsx',
    'vat-audit-trail-explorer-page.tsx',
    'fixed-asset-depreciation-module-page.tsx',
    'leasing-contract-tracker-page.tsx',
    'insurance-policy-register-page.tsx',
    'petty-cash-replenishment-workflow-page.tsx',
    'corporate-card-expense-import-page.tsx',
    'employee-travel-mission-workflow-page.tsx',
    'customer-contract-sla-penalty-tracker-page.tsx',
    'supplier-rebate-accrual-tracker-page.tsx',
    'inventory-reservation-expiry-workflow-page.tsx',
  ];
  assert.equal(enterpriseExpansionPageFiles.filter((file) => file.endsWith('-page.tsx')).length, 40);
  for (const file of expectedFiles) {
    assert.ok(enterpriseExpansionPageFiles.includes(file), `${file} dedicated page exists`);
    const source = readFileSync(new URL(`../pages/enterprise-expansion/${file}`, import.meta.url), 'utf8');
    assert.ok(source.includes('makeEnterpriseExpansionServerSideProps'), `${file} has server-side data wiring`);
  }
  assert.ok(enterpriseExpansionFeaturePage.includes('EnterpriseExpansionFeaturePage'), 'shared expansion feature page component exists');
  assert.ok(enterpriseExpansionConfig.includes('enterpriseExpansionFeatureDefinitions'), 'expansion feature definitions are centralized');
  assert.ok(page.includes('enterpriseExpansionFeatureDefinitions'), 'dashboard links to dedicated expansion feature pages');
});

test('Next primary workspace exposes 45-task Morocco enterprise acceleration controls batch', () => {
  for (const text of ['Accélération entreprise Maroc', 'Réserve garantie', 'E-commerce', 'Route marge', 'API contrats', 'Churn client', 'Templates verticales', 'Commerce, garanties et abonnements', 'Verticales Maroc et logistique', 'Paiements, flotte et projets', 'RH, support et pilotage SaaS', 'Fiscal, exports et intégrations', 'Expérimentation et rétention']) {
    assert.ok(page.includes(text), `${text} enterprise acceleration label is present`);
  }
  for (const marker of ['getEnterpriseAccelerationReadiness', 'enterpriseAcceleration.warrantyReserve', 'enterpriseAcceleration.ecommerceReconciliation', 'enterpriseAcceleration.routeProfitability', 'enterpriseAcceleration.webhookReplay', 'enterpriseAcceleration.customerChurnRisk', 'enterpriseAcceleration.verticalTemplateSelector']) {
    assert.ok(page.includes(marker), `${marker} enterprise acceleration helper is present`);
  }
  assert.ok(api.includes('/tenant/enterprise-acceleration-readiness'), 'enterprise acceleration endpoint is wired');
  for (const token of ['consignmentStock', 'warrantyReserve', 'afterSalesRma', 'subscriptionProration', 'competitorBattlecard', 'ecommerceReconciliation', 'marketplaceSettlement', 'wholesaleRebate', 'retailCashAudit', 'pharmaLotExpiry', 'foodRecallDrill', 'hotelOccupancy', 'spaPackageLiability', 'routeProfitability', 'brokerFeeReconciliation', 'fxExposure', 'bouncedPaymentRecovery', 'blockedPaymentRelease', 'warrantyClaimReserve', 'fleetClaimSettlement', 'maintenanceCompliance', 'projectCloseout', 'consultantUtilization', 'certificationRegister', 'payrollLoanCompliance', 'hrOnboardingPack', 'executiveDigest', 'supportEscalation', 'partnerCapacity', 'sandboxResetAudit', 'invoiceMentionValidator', 'bilingualPdfQueue', 'vatCarryforward', 'isForecast', 'professionalTaxCalendar', 'cnssAnomalyHeatmap', 'amoReimbursements', 'dataExportApproval', 'apiContractDashboard', 'webhookReplay', 'featureAdoptionExperiment', 'priceIncreaseCommunication', 'customerChurnRisk', 'supplierDependency', 'verticalTemplateSelector']) {
    assert.ok(api.includes(token), `${token} enterprise acceleration data key is represented`);
  }
});

test('Enterprise acceleration batch has one descriptive dedicated frontend page per feature', () => {
  const expectedFiles = [
    'consignment-stock-workflow-page.tsx',
    'warranty-reserve-calculation-page.tsx',
    'after-sales-rma-workflow-page.tsx',
    'subscription-billing-proration-page.tsx',
    'moroccan-competitor-battlecard-page.tsx',
    'ecommerce-order-reconciliation-page.tsx',
    'marketplace-seller-settlement-page.tsx',
    'wholesale-customer-rebate-contract-page.tsx',
    'retail-store-daily-cash-audit-page.tsx',
    'pharmaceutical-lot-expiry-compliance-page.tsx',
    'food-traceability-recall-drill-page.tsx',
    'hotel-occupancy-revenue-dashboard-page.tsx',
    'salon-spa-package-liability-ledger-page.tsx',
    'logistics-route-profitability-dashboard-page.tsx',
    'customs-broker-fee-reconciliation-page.tsx',
    'international-supplier-fx-exposure-page.tsx',
    'customer-bounced-payment-recovery-page.tsx',
    'supplier-blocked-payment-release-page.tsx',
    'customer-warranty-claim-reserve-page.tsx',
    'fleet-insurance-claim-settlement-page.tsx',
    'maintenance-preventive-compliance-score-page.tsx',
    'project-profitability-closeout-checklist-page.tsx',
    'consultant-utilization-dashboard-page.tsx',
    'employee-certification-register-page.tsx',
    'payroll-loan-compliance-dashboard-page.tsx',
    'hr-onboarding-document-pack-page.tsx',
    'executive-kpi-subscription-digest-page.tsx',
    'support-sla-escalation-matrix-page.tsx',
    'implementation-partner-capacity-planning-page.tsx',
    'tenant-sandbox-reset-audit-page.tsx',
    'moroccan-invoice-legal-mention-validator-page.tsx',
    'bilingual-pdf-quality-queue-page.tsx',
    'vat-credit-carryforward-tracker-page.tsx',
    'is-installment-forecast-page.tsx',
    'professional-tax-due-calendar-page.tsx',
    'cnss-payroll-anomaly-heatmap-page.tsx',
    'amo-reimbursement-tracking-page.tsx',
    'data-export-approval-workflow-page.tsx',
    'api-integration-contract-dashboard-page.tsx',
    'webhook-incident-replay-workflow-page.tsx',
    'tenant-feature-adoption-experiment-dashboard-page.tsx',
    'price-increase-communication-workflow-page.tsx',
    'customer-churn-risk-predictor-page.tsx',
    'supplier-dependency-concentration-report-page.tsx',
    'moroccan-vertical-template-selector-page.tsx',
  ];
  assert.equal(enterpriseAccelerationPageFiles.filter((file) => file.endsWith('-page.tsx')).length, 45);
  for (const file of expectedFiles) {
    assert.ok(enterpriseAccelerationPageFiles.includes(file), `${file} dedicated page exists`);
    const source = readFileSync(new URL(`../pages/enterprise-acceleration/${file}`, import.meta.url), 'utf8');
    assert.ok(source.includes('makeEnterpriseAccelerationServerSideProps'), `${file} has server-side data wiring`);
  }
  assert.ok(enterpriseAccelerationFeaturePage.includes('EnterpriseAccelerationFeaturePage'), 'shared acceleration feature page component exists');
  assert.ok(enterpriseAccelerationConfig.includes('enterpriseAccelerationFeatureDefinitions'), 'acceleration feature definitions are centralized');
  assert.ok(page.includes('enterpriseAccelerationFeatureDefinitions'), 'dashboard links to dedicated acceleration feature pages');
});

test('Next primary workspace exposes 40-task Morocco enterprise intelligence controls batch', () => {
  for (const text of ['Intelligence entreprise Maroc', 'Pipeline pondéré', 'DSO prévu', 'Runway cash', 'Régions rentables', 'Ventes, pricing et cash', 'Achats, stock et production', 'RH, paie, support et plateforme', 'Fiscal, audit et conformité', 'Commerce, POS et partenaires']) {
    assert.ok(page.includes(text), `${text} enterprise intelligence label is present`);
  }
  for (const marker of ['getEnterpriseIntelligenceReadiness', 'enterpriseIntelligence.salesPipelineForecast', 'enterpriseIntelligence.cashRunway', 'enterpriseIntelligence.regionalProfitability', 'enterpriseIntelligence.accountantWorkloadBalancing']) {
    assert.ok(page.includes(marker), `${marker} enterprise intelligence helper is present`);
  }
  assert.ok(api.includes('/tenant/enterprise-intelligence-readiness'), 'enterprise intelligence endpoint is wired');
  for (const token of ['salesPipelineForecast', 'customerLifetimeValue', 'renewalRevenueCalendar', 'pricingElasticity', 'dsoForecast', 'supplierPriceVariance', 'purchaseBudgetBurn', 'stockServiceLevel', 'demandForecast', 'warehouseSlotting', 'productionYield', 'qualityNonconformance', 'fleetCo2Fuel', 'maintenanceCostTrend', 'projectMilestoneBillingRisk', 'consultantStaffingForecast', 'payrollOvertimeRisk', 'leaveLiability', 'trainingRoi', 'cnssDueReminder', 'vatSensitivity', 'iceIfDataQuality', 'auditSampling', 'bankCovenant', 'cashRunway', 'creditInsurance', 'ecommerceReturnReasons', 'posFraudAnomaly', 'loyaltyCohorts', 'supportDeflectionKb', 'onboardingTimeToValue', 'featureEntitlementAudit', 'apiErrorBudget', 'webhookDeliverySlo', 'dataRetentionPurge', 'backupRestoreSla', 'regionalProfitability', 'branchExpansionReadiness', 'partnerReferralPipeline', 'accountantWorkloadBalancing']) {
    assert.ok(api.includes(token), `${token} enterprise intelligence data key is represented`);
  }
});

test('Enterprise intelligence batch has one descriptive dedicated frontend page per feature', () => {
  const expectedFiles = [
    'sales-pipeline-forecast-page.tsx',
    'customer-lifetime-value-dashboard-page.tsx',
    'renewal-revenue-calendar-page.tsx',
    'pricing-elasticity-simulator-page.tsx',
    'dso-forecast-control-page.tsx',
    'supplier-price-variance-monitor-page.tsx',
    'purchase-budget-burn-dashboard-page.tsx',
    'stock-service-level-dashboard-page.tsx',
    'demand-forecast-review-page.tsx',
    'warehouse-slotting-optimizer-page.tsx',
    'production-yield-analytics-page.tsx',
    'quality-nonconformance-workflow-page.tsx',
    'fleet-co2-fuel-dashboard-page.tsx',
    'maintenance-cost-trend-page.tsx',
    'project-milestone-billing-risk-page.tsx',
    'consultant-staffing-forecast-page.tsx',
    'payroll-overtime-risk-forecast-page.tsx',
    'leave-liability-report-page.tsx',
    'training-roi-tracker-page.tsx',
    'cnss-due-reminder-page.tsx',
    'vat-sensitivity-analysis-page.tsx',
    'ice-if-data-quality-queue-page.tsx',
    'audit-sampling-engine-page.tsx',
    'bank-covenant-monitor-page.tsx',
    'cash-runway-dashboard-page.tsx',
    'credit-insurance-register-page.tsx',
    'ecommerce-return-reason-analytics-page.tsx',
    'pos-fraud-anomaly-dashboard-page.tsx',
    'loyalty-cohort-analytics-page.tsx',
    'support-deflection-knowledge-base-dashboard-page.tsx',
    'onboarding-time-to-value-tracker-page.tsx',
    'feature-entitlement-audit-page.tsx',
    'api-error-budget-dashboard-page.tsx',
    'webhook-delivery-slo-dashboard-page.tsx',
    'data-retention-purge-simulator-page.tsx',
    'backup-restore-sla-dashboard-page.tsx',
    'moroccan-regional-profitability-dashboard-page.tsx',
    'branch-expansion-readiness-page.tsx',
    'partner-referral-pipeline-page.tsx',
    'accountant-workload-balancing-page.tsx',
  ];
  assert.equal(enterpriseIntelligencePageFiles.filter((file) => file.endsWith('-page.tsx')).length, 40);
  for (const file of expectedFiles) {
    assert.ok(enterpriseIntelligencePageFiles.includes(file), `${file} dedicated page exists`);
    const source = readFileSync(new URL(`../pages/enterprise-intelligence/${file}`, import.meta.url), 'utf8');
    assert.ok(source.includes('makeEnterpriseIntelligenceServerSideProps'), `${file} has server-side data wiring`);
  }
  assert.ok(enterpriseIntelligenceFeaturePage.includes('EnterpriseIntelligenceFeaturePage'), 'shared intelligence feature page component exists');
  assert.ok(enterpriseIntelligenceConfig.includes('enterpriseIntelligenceFeatureDefinitions'), 'intelligence feature definitions are centralized');
  assert.ok(page.includes('enterpriseIntelligenceFeatureDefinitions'), 'dashboard links to dedicated intelligence feature pages');
});

test('Next primary workspace exposes 40-task Morocco enterprise automation controls batch', () => {
  for (const text of ['Automatisation entreprise Maroc', 'Score clôture', 'Paiements proposés', 'Readiness DGI', 'Santé tenant', 'Finance, fiscalité et banque', 'Achats, stock, production et service', 'RH, portails, sécurité et plateforme']) {
    assert.ok(page.includes(text), `${text} enterprise automation label is present`);
  }
  for (const marker of ['getEnterpriseAutomationReadiness', 'enterpriseAutomation.closeChecklistScoring', 'enterpriseAutomation.paymentRunOptimization', 'enterpriseAutomation.dgiReadinessScore', 'enterpriseAutomation.tenantHealthForecast', 'enterpriseAutomationFeatureDefinitions']) {
    assert.ok(page.includes(marker), `${marker} enterprise automation helper is present`);
  }
  assert.ok(api.includes('/tenant/enterprise-automation-readiness'), 'enterprise automation endpoint is wired');
  for (const token of ['closeChecklistScoring', 'invoiceMatchingAssistant', 'supplierInvoiceOcrTriage', 'paymentRunOptimization', 'promiseReliabilityScore', 'salesTaxAnomalyDetector', 'payrollVarianceExplainability', 'hrDocumentExpiryBoard', 'purchaseRequestPolicy', 'replenishmentAutopilot', 'serializedTraceability', 'recallCommunicationCenter', 'productionFeasibility', 'maintenancePrioritizer', 'fleetRouteCompliance', 'projectMarginWarning', 'serviceContractProfitability', 'customerPortalAdoption', 'supplierPortalAdoption', 'accountantPortalSla', 'dgiReadinessScore', 'cnssReadinessScore', 'amoReconciliationInsight', 'professionalTaxVault', 'legalArchiveCompleteness', 'bankImportDuplicateGuard', 'cashboxRootCause', 'posOfflineRisk', 'branchStockBalancing', 'landedCostAutomation', 'fxRevaluation', 'recurringInvoiceMonitor', 'usageBillingAudit', 'tenantHealthForecast', 'migrationReadiness', 'releaseImpactSimulator', 'accessReviewCampaign', 'apiKeyRotationCampaign', 'webhookContractTesting', 'biExportCatalog']) {
    assert.ok(api.includes(token), `${token} enterprise automation data key is represented`);
  }
});

test('Enterprise automation batch has one descriptive dedicated frontend page per feature', () => {
  const expectedFiles = [
    'automated-close-checklist-scoring-page.tsx',
    'intelligent-invoice-matching-assistant-page.tsx',
    'supplier-invoice-ocr-triage-page.tsx',
    'payment-run-optimization-page.tsx',
    'receivable-promise-reliability-score-page.tsx',
    'sales-tax-anomaly-detector-page.tsx',
    'payroll-variance-explainability-page.tsx',
    'hr-compliance-document-expiry-board-page.tsx',
    'purchase-request-policy-engine-page.tsx',
    'inventory-replenishment-autopilot-page.tsx',
    'serialized-asset-traceability-dashboard-page.tsx',
    'batch-recall-communication-center-page.tsx',
    'production-plan-feasibility-checker-page.tsx',
    'maintenance-work-order-prioritizer-page.tsx',
    'fleet-route-compliance-monitor-page.tsx',
    'project-margin-early-warning-page.tsx',
    'service-contract-profitability-monitor-page.tsx',
    'customer-portal-adoption-tracker-page.tsx',
    'supplier-portal-adoption-tracker-page.tsx',
    'accountant-portal-sla-board-page.tsx',
    'dgi-declaration-readiness-score-page.tsx',
    'cnss-declaration-readiness-score-page.tsx',
    'amo-payroll-reconciliation-insight-page.tsx',
    'professional-tax-evidence-vault-page.tsx',
    'legal-archive-completeness-dashboard-page.tsx',
    'bank-import-duplicate-guard-page.tsx',
    'cashbox-variance-root-cause-assistant-page.tsx',
    'pos-offline-risk-monitor-page.tsx',
    'multi-branch-stock-balancing-assistant-page.tsx',
    'landed-cost-automation-queue-page.tsx',
    'foreign-currency-revaluation-dashboard-page.tsx',
    'recurring-invoice-automation-monitor-page.tsx',
    'subscription-usage-billing-audit-page.tsx',
    'tenant-health-incident-forecast-page.tsx',
    'implementation-migration-readiness-page.tsx',
    'release-impact-simulator-page.tsx',
    'security-access-review-campaign-page.tsx',
    'api-key-rotation-campaign-page.tsx',
    'webhook-contract-testing-dashboard-page.tsx',
    'bi-export-catalog-page.tsx',
  ];
  assert.equal(enterpriseAutomationPageFiles.filter((file) => file.endsWith('-page.tsx')).length, 40);
  for (const file of expectedFiles) {
    assert.ok(enterpriseAutomationPageFiles.includes(file), `${file} dedicated page exists`);
    const source = readFileSync(new URL(`../pages/enterprise-automation/${file}`, import.meta.url), 'utf8');
    assert.ok(source.includes('makeEnterpriseAutomationServerSideProps'), `${file} has server-side data wiring`);
  }
  assert.ok(enterpriseAutomationFeaturePage.includes('EnterpriseAutomationFeaturePage'), 'shared automation feature page component exists');
  assert.ok(enterpriseAutomationConfig.includes('enterpriseAutomationFeatureDefinitions'), 'automation feature definitions are centralized');
  assert.ok(page.includes('enterpriseAutomationFeatureDefinitions'), 'dashboard links to dedicated automation feature pages');
});

test('Next primary workspace exposes 40-task Morocco enterprise assurance controls batch', () => {
  for (const text of ['Assurance entreprise Maroc', 'Risques assurance', 'Couverture contrôles', 'Preuves en retard', 'Readiness release', 'Données, fiscalité et comptabilité', 'Master data, stock et achats', 'Sécurité, opérations et intégrations']) {
    assert.ok(page.includes(text), `${text} enterprise assurance label is present`);
  }
  for (const marker of ['getEnterpriseAssuranceReadiness', 'enterpriseAssurance.executiveAssuranceDigest', 'enterpriseAssurance.dataResidencyEvidence', 'enterpriseAssurance.roleSegregationMatrix', 'enterpriseAssuranceFeatureDefinitions']) {
    assert.ok(page.includes(marker), `${marker} enterprise assurance helper is present`);
  }
  assert.ok(api.includes('/tenant/enterprise-assurance-readiness'), 'enterprise assurance endpoint is wired');
  for (const token of ['dataResidencyEvidence', 'privacyConsentAudit', 'chartAccountAnomalyGuard', 'journalDuplicateDetection', 'fiscalLockImpact', 'taxCalendarEvidenceSla', 'cnssIdentityReadiness', 'payrollBankApprovalQueue', 'expensePolicyExceptions', 'vendorDuplicateDetector', 'customerDuplicateDetector', 'productCompletenessScore', 'warehouseCapacityHeatmap', 'stockAgingLiquidation', 'countVarianceApproval', 'purchaseLeadTimeReliability', 'supplierOnboardingRisk', 'customerCreditRenewal', 'quoteMarginApproval', 'contractRenewalObligations', 'deliveryPromiseAdherence', 'returnsRootCause', 'posCashierPerformance', 'cashForecastVariance', 'bankReconciliationAging', 'assetInsuranceEvidence', 'sparePartsAvailability', 'fleetDocumentCompliance', 'projectDeliveryRisk', 'materialShortageBridge', 'serviceTicketSlaHealth', 'portalNotificationAudit', 'apiUsageAnomaly', 'webhookSchemaDrift', 'backupEvidenceFreshness', 'roleSegregationMatrix', 'auditEvidenceRequests', 'releaseRollbackChecklist', 'configurationDriftMonitor', 'executiveAssuranceDigest']) {
    assert.ok(api.includes(token), `${token} enterprise assurance data key is represented`);
  }
});

test('Enterprise assurance batch has one descriptive dedicated frontend page per feature', () => {
  const expectedFiles = [
    'data-residency-evidence-register-page.tsx',
    'privacy-consent-audit-page.tsx',
    'chart-account-anomaly-guard-page.tsx',
    'journal-duplicate-detection-page.tsx',
    'fiscal-lock-impact-preview-page.tsx',
    'tax-calendar-evidence-sla-page.tsx',
    'cnss-employee-identity-readiness-board-page.tsx',
    'payroll-bank-file-approval-queue-page.tsx',
    'expense-policy-exception-monitor-page.tsx',
    'vendor-master-duplicate-detector-page.tsx',
    'customer-master-duplicate-detector-page.tsx',
    'product-master-completeness-score-page.tsx',
    'warehouse-capacity-heatmap-page.tsx',
    'stock-aging-liquidation-planner-page.tsx',
    'inventory-count-variance-approval-board-page.tsx',
    'purchase-lead-time-reliability-dashboard-page.tsx',
    'supplier-onboarding-risk-pack-page.tsx',
    'customer-credit-renewal-campaign-page.tsx',
    'quote-margin-approval-simulator-page.tsx',
    'contract-renewal-obligation-board-page.tsx',
    'delivery-promise-adherence-monitor-page.tsx',
    'returns-root-cause-board-page.tsx',
    'pos-cashier-performance-scorecard-page.tsx',
    'cash-forecast-variance-monitor-page.tsx',
    'bank-reconciliation-aging-queue-page.tsx',
    'fixed-asset-insurance-evidence-board-page.tsx',
    'maintenance-spare-parts-availability-page.tsx',
    'fleet-document-compliance-score-page.tsx',
    'project-delivery-risk-radar-page.tsx',
    'production-material-shortage-bridge-page.tsx',
    'service-ticket-sla-health-board-page.tsx',
    'portal-notification-delivery-audit-page.tsx',
    'api-client-usage-anomaly-monitor-page.tsx',
    'webhook-schema-drift-detector-page.tsx',
    'backup-evidence-freshness-monitor-page.tsx',
    'role-segregation-of-duties-matrix-page.tsx',
    'audit-evidence-request-tracker-page.tsx',
    'release-rollback-rehearsal-checklist-page.tsx',
    'tenant-configuration-drift-monitor-page.tsx',
    'executive-assurance-digest-page.tsx',
  ];
  assert.equal(enterpriseAssurancePageFiles.filter((file) => file.endsWith('-page.tsx')).length, 40);
  for (const file of expectedFiles) {
    assert.ok(enterpriseAssurancePageFiles.includes(file), `${file} dedicated page exists`);
    const source = readFileSync(new URL(`../pages/enterprise-assurance/${file}`, import.meta.url), 'utf8');
    assert.ok(source.includes('makeEnterpriseAssuranceServerSideProps'), `${file} has server-side data wiring`);
  }
  assert.ok(enterpriseAssuranceFeaturePage.includes('EnterpriseAssuranceFeaturePage'), 'shared assurance feature page component exists');
  assert.ok(enterpriseAssuranceConfig.includes('enterpriseAssuranceFeatureDefinitions'), 'assurance feature definitions are centralized');
  assert.ok(page.includes('enterpriseAssuranceFeatureDefinitions'), 'dashboard links to dedicated assurance feature pages');
});

test('Next primary workspace exposes 40-task Morocco enterprise resilience controls batch', () => {
  for (const text of ['Résilience entreprise Maroc', 'Score continuité', 'Incidents ouverts', 'Gaps preuves', 'Blockers conformité', 'Continuité, incidents et preuves', 'Achats, stock et finance', 'Opérations, portails et data']) {
    assert.ok(page.includes(text), `${text} enterprise resilience label is present`);
  }
  for (const marker of ['getEnterpriseResilienceReadiness', 'enterpriseResilience.executiveResilienceScorecard', 'enterpriseResilience.businessContinuityCenter', 'enterpriseResilience.apiConsentLedger', 'enterpriseResilienceFeatureDefinitions']) {
    assert.ok(page.includes(marker), `${marker} enterprise resilience helper is present`);
  }
  assert.ok(api.includes('/tenant/enterprise-resilience-readiness'), 'enterprise resilience endpoint is wired');
  for (const token of ['businessContinuityCenter', 'incidentEscalationBoard', 'disasterRecoveryEvidence', 'legalHoldRegister', 'dataSubjectRequestQueue', 'vendorSanctionsScreening', 'procurementContractCompliance', 'purchasePriceExceptions', 'stockWriteOffQueue', 'inventoryInsuranceExposure', 'expiryColdChainRisk', 'eInvoiceRolloutReadiness', 'disputeReserveForecast', 'badDebtProvisionReview', 'cashConcentrationPlanner', 'bankFeeAnomalyReview', 'leaveAccrualProvisioning', 'employeePrivacyAccessAudit', 'healthSafetyIncidentTracker', 'workforceCapacityRota', 'posRefundAuthorization', 'ecommercePayoutEvidence', 'branchOpeningCompliance', 'fleetFuelFraudControls', 'maintenanceDowntimeSla', 'productionBatchCosting', 'qualityCertificateVault', 'projectDeliverableAcceptance', 'servicePenaltyEscalations', 'customerPortalAccessReview', 'supplierPortalSecurityReview', 'apiConsentLedger', 'webhookDeadLetterQueue', 'dataWarehouseExportApproval', 'biKpiCatalog', 'aiSuggestionGovernance', 'accountantEvidenceSla', 'taxAuditReadinessBinder', 'boardPackFinancialControls', 'executiveResilienceScorecard']) {
    assert.ok(api.includes(token), `${token} enterprise resilience data key is represented`);
  }
});

test('Enterprise resilience batch has one descriptive dedicated frontend page per feature', () => {
  const expectedFiles = [
    'business-continuity-command-center-page.tsx',
    'incident-escalation-board-page.tsx',
    'disaster-recovery-evidence-pack-page.tsx',
    'legal-hold-case-register-page.tsx',
    'customer-data-subject-request-queue-page.tsx',
    'vendor-sanctions-screening-page.tsx',
    'procurement-contract-compliance-board-page.tsx',
    'purchase-price-approval-exceptions-page.tsx',
    'stock-write-off-authorization-queue-page.tsx',
    'inventory-insurance-exposure-report-page.tsx',
    'expiry-cold-chain-risk-board-page.tsx',
    'e-invoice-rollout-readiness-controls-page.tsx',
    'customer-dispute-reserve-forecast-page.tsx',
    'bad-debt-provision-review-page.tsx',
    'cash-concentration-transfer-planner-page.tsx',
    'bank-fee-anomaly-review-page.tsx',
    'payroll-leave-accrual-provisioning-page.tsx',
    'employee-document-privacy-access-audit-page.tsx',
    'health-and-safety-incident-tracker-page.tsx',
    'workforce-capacity-rota-planner-page.tsx',
    'pos-refund-authorization-matrix-page.tsx',
    'ecommerce-payout-reconciliation-evidence-page.tsx',
    'branch-opening-compliance-checklist-page.tsx',
    'fleet-fuel-fraud-controls-page.tsx',
    'maintenance-downtime-sla-dashboard-page.tsx',
    'production-batch-costing-audit-page.tsx',
    'quality-certificate-evidence-vault-page.tsx',
    'project-contract-deliverable-acceptance-page.tsx',
    'service-contract-escalation-penalties-page.tsx',
    'customer-portal-access-review-page.tsx',
    'supplier-portal-security-review-page.tsx',
    'api-consent-ledger-page.tsx',
    'webhook-dead-letter-queue-page.tsx',
    'data-warehouse-export-approval-page.tsx',
    'bi-kpi-definition-catalog-page.tsx',
    'ai-suggestion-governance-queue-page.tsx',
    'accountant-evidence-request-sla-page.tsx',
    'tax-audit-readiness-binder-page.tsx',
    'board-pack-financial-controls-page.tsx',
    'executive-resilience-scorecard-page.tsx',
  ];
  assert.equal(enterpriseResiliencePageFiles.filter((file) => file.endsWith('-page.tsx')).length, 40);
  for (const file of expectedFiles) {
    assert.ok(enterpriseResiliencePageFiles.includes(file), `${file} dedicated page exists`);
    const source = readFileSync(new URL(`../pages/enterprise-resilience/${file}`, import.meta.url), 'utf8');
    assert.ok(source.includes('makeEnterpriseResilienceServerSideProps'), `${file} has server-side data wiring`);
  }
  assert.ok(enterpriseResilienceFeaturePage.includes('EnterpriseResilienceFeaturePage'), 'shared resilience feature page component exists');
  assert.ok(enterpriseResilienceConfig.includes('enterpriseResilienceFeatureDefinitions'), 'resilience feature definitions are centralized');
  assert.ok(page.includes('enterpriseResilienceFeatureDefinitions'), 'dashboard links to dedicated resilience feature pages');
});
