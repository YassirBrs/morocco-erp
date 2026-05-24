import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
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
  assert.ok(staticPage.includes('/crm/customers/document-reminders'));
  assert.ok(staticPage.includes('/crm/leads'));
  assert.ok(staticPage.includes('/crm/leads/analytics'));
  assert.ok(staticPage.includes('/crm/leads/export.csv'));
  assert.ok(staticPage.includes('/crm/leads/import'));
  assert.ok(staticPage.includes('/crm/leads/${lead.id}/quote'));
  assert.ok(staticPage.includes('/inventory/suppliers'));
  assert.ok(staticPage.includes('/inventory/suppliers/risk-reminders'));
  assert.ok(staticPage.includes('/inventory/suppliers/${supplier.id}/document-placeholders'));
  assert.ok(staticPage.includes('/inventory/suppliers/export.csv'));
  assert.ok(staticPage.includes('/inventory/suppliers/import'));
  assert.ok(staticPage.includes('duplicateWarnings'));
  assert.ok(staticPage.includes('/tenant/setup-checklist'));
  assert.ok(staticPage.includes('/tenant/dashboard-filters'));
  assert.ok(staticPage.includes('/tenant/company-profile'));
  assert.ok(staticPage.includes('/tenant/company-profile/approve'));
  assert.ok(staticPage.includes('/tenant/demo-reset'));
  assert.ok(staticPage.includes('/ledger/audit'));
  assert.ok(staticPage.includes('/search?q='));
  assert.ok(staticPage.includes("method: 'PATCH'"));
  assert.ok(staticPage.includes('/crm/customers'));
  assert.ok(staticPage.includes('/inventory/products'));
});

test('static dashboard uses sidebar module navigation instead of showing one compacted page', () => {
  for (const view of ['dashboard', 'sales', 'crm', 'stock', 'accounting', 'payroll', 'compliance']) {
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
  for (const text of ['Liste de mise en service', 'Ajouter client', 'Ajouter article', 'Ajouter prospect', 'Ajouter fournisseur', 'Nom client', 'Prix vente', 'RIB marocain', 'Document client', 'Expiration document client', 'Alertes documents clients', 'Garantie paiement', 'Fournisseur préféré', 'Notes risque', 'Expiration document', 'Alertes fournisseurs', 'Placeholder document', 'Dossier:', 'Expirés', 'À renouveler', 'Préférés', 'Créer devis', 'Convertir en devis', 'Exporter CSV prospects', 'Exporter CSV fournisseurs', 'Importer CSV démo', 'Analytics sources prospects', 'Avoir', 'Relevé client', 'Payer solde']) {
    assert.ok(staticPage.includes(text), `${text} workflow is present`);
  }
  for (const text of ['Comptabilisée', 'Payée', 'Facture', 'Paiement', 'Marchandise', 'Pipeline prospects', 'Fournisseurs', 'Profil entreprise', 'Réinitialiser démo', 'En attente revue', 'Approuver', 'alerte doublon', 'Banque normalisée', 'Import CSV prospects', 'Import CSV fournisseurs']) {
    assert.ok(staticPage.includes(text), `${text} French label is present`);
  }
  assert.ok(staticPage.includes('pattern="[0-9\\\\s-]{24,}"'));
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
  assert.ok(staticCss.includes('.message.warning'));
  assert.ok(staticCss.includes('.warningText'));
});
