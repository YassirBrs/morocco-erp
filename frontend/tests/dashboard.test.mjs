import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

const rootPage = read('../app/page.tsx');
const landingPage = read('../app/marketing/landing-page.tsx');
const loginPage = read('../app/auth/login-page.tsx');
const loginRoute = read('../app/auth/login/page.tsx');
const workspaceLayout = read('../app/layouts/workspace-layout.tsx');
const crmPage = read('../app/crm/crm-pipeline-page.tsx');
const supplierPage = read('../app/purchases/supplier-directory-page.tsx');
const invoicePage = read('../app/sales/invoice-management-page.tsx');
const payrollPage = read('../app/payroll/payroll-processing-page.tsx');
const workspaceComponents = read('../app/components/workspace-components.tsx');
const css = read('../app/globals.css');
const tasks = read('../../task.md');

const routeFiles = [
  '../app/crm/page.tsx',
  '../app/ventes/page.tsx',
  '../app/achats-stock/page.tsx',
  '../app/paie/page.tsx',
  '../app/sales/page.tsx',
  '../app/purchases/page.tsx',
  '../app/payroll/page.tsx',
].map(read);

test('root page is a public marketing entry point, not the internal ERP dashboard', () => {
  assert.ok(rootPage.includes('MarketingLandingPage'));
  for (const forbidden of ['getDashboardSummary', 'getEnterpriseDepthReadiness', 'ErpShellWorkspace', 'getPayrollSnapshot']) {
    assert.ok(!rootPage.includes(forbidden), `${forbidden} must not be imported by the public root page`);
  }
  assert.ok(rootPage.split('\n').length < 10, 'root page remains a thin public entry point');
});

test('public SaaS landing page includes modules, Moroccan compliance, pricing, and auth CTA', () => {
  for (const text of ['ERP SaaS pour entreprises marocaines', 'CRM et ventes', 'Achats et stock', 'Comptabilité Maroc', 'Paie et RH', 'ICE, IF, RC, Patente et CNSS', 'Starter', 'Professional', 'Enterprise', '490 MAD', '1 490 MAD', '/auth/login']) {
    assert.ok(landingPage.includes(text), `${text} exists on public landing`);
  }
  assert.ok(landingPage.includes('publicSection'));
  assert.ok(landingPage.includes('pricingGrid'));
});

test('auth gate supports login/register validation and simulated secure session', () => {
  for (const text of ['Connexion', 'Inscription', 'Adresse e-mail invalide', 'Mot de passe trop court', 'Raison sociale obligatoire', 'morocco-erp-session', "router.push('/crm')"]) {
    assert.ok(loginPage.includes(text), `${text} exists in auth flow`);
  }
  assert.ok(loginRoute.includes('LoginPage'));
});

test('workspace layout hides internal content until a session exists', () => {
  for (const text of ['Session requise', 'localStorage.getItem', 'morocco-erp-session', 'Ouvrir une session', 'workspaceSidebar', 'Réduire la barre latérale']) {
    assert.ok(workspaceLayout.includes(text), `${text} exists in guarded workspace layout`);
  }
  assert.ok(workspaceLayout.includes('setCollapsed'));
  assert.ok(workspaceLayout.includes('activeModule'));
});

test('required decoupled domain page files exist', () => {
  for (const file of [
    '../app/marketing/landing-page.tsx',
    '../app/auth/login-page.tsx',
    '../app/layouts/workspace-layout.tsx',
    '../app/crm/crm-pipeline-page.tsx',
    '../app/purchases/supplier-directory-page.tsx',
    '../app/sales/invoice-management-page.tsx',
    '../app/payroll/payroll-processing-page.tsx',
  ]) {
    assert.equal(existsSync(new URL(file, import.meta.url)), true, `${file} exists`);
  }
});

test('domain route files delegate to isolated pages instead of one shared dashboard', () => {
  for (const [content, component] of [
    [routeFiles[0], 'CrmPipelinePage'],
    [routeFiles[1], 'InvoiceManagementPage'],
    [routeFiles[2], 'SupplierDirectoryPage'],
    [routeFiles[3], 'PayrollProcessingPage'],
    [routeFiles[4], 'InvoiceManagementPage'],
    [routeFiles[5], 'SupplierDirectoryPage'],
    [routeFiles[6], 'PayrollProcessingPage'],
  ]) {
    assert.ok(content.includes(component), `${component} is used by route`);
    assert.ok(!content.includes('ErpShellWorkspace'), 'route does not delegate to the old bloated shell');
  }
});

test('CRM page owns pipeline behavior and actionable validation', () => {
  for (const text of ['Pipeline commercial', 'Ajouter au pipeline', 'Nom prospect obligatoire', 'Valeur attendue invalide', 'setLeads', 'ActionToast']) {
    assert.ok(crmPage.includes(text), `${text} exists in CRM page`);
  }
  assert.ok(crmPage.includes('<WorkspaceLayout activeModule="CRM">'));
});

test('supplier page owns registry behavior and Moroccan supplier validation', () => {
  for (const text of ['Annuaire fournisseurs', 'Enregistrer fournisseur', 'ICE fournisseur invalide', 'RIB marocain invalide', 'setSuppliers', 'Doublons ICE/IF']) {
    assert.ok(supplierPage.includes(text), `${text} exists in supplier page`);
  }
  assert.ok(supplierPage.includes('<WorkspaceLayout activeModule="Fournisseurs">'));
});

test('invoice page owns invoice workflow and Moroccan VAT validation', () => {
  for (const text of ['Gestion des factures', 'Préparer facture', 'Client obligatoire', 'Montant HT invalide', 'Taux TVA non autorisé', 'FAC-2026', 'setInvoices']) {
    assert.ok(invoicePage.includes(text), `${text} exists in invoice page`);
  }
  for (const vat of ['20', '14', '10', '7', '0']) {
    assert.ok(invoicePage.includes(`value="${vat}"`), `VAT ${vat}% option exists`);
  }
});

test('payroll page owns payroll workflow and Moroccan payroll jargon', () => {
  for (const text of ['Traitement de la paie', 'Créer run paie', 'Bulletins de paie', 'Damancom', 'CNSS', 'AMO', 'IR', 'Période paie obligatoire', 'setRuns']) {
    assert.ok(payrollPage.includes(text), `${text} exists in payroll page`);
  }
  assert.ok(payrollPage.includes('<WorkspaceLayout activeModule="Paie">'));
});

test('shared workspace components provide reusable SOLID UI primitives', () => {
  for (const component of ['SectionHeader', 'WorkspacePanel', 'DataTable', 'FormField', 'ActionToast', 'StatusBadge', 'formatMad']) {
    assert.ok(workspaceComponents.includes(`function ${component}`), `${component} reusable component exists`);
  }
});

test('French ERP terminology is consistent across reconstructed views', () => {
  const combined = [landingPage, loginPage, workspaceLayout, crmPage, supplierPage, invoicePage, payrollPage].join('\n');
  for (const text of ['Journal Comptable', 'Bulletins de paie', 'Clôture de période', 'Comptabilité Maroc', 'factures', 'fournisseurs', 'Paie/RH']) {
    assert.ok(combined.includes(text), `${text} French ERP wording exists`);
  }
});

test('responsive professional SaaS styles cover public, auth, shell, forms, and domain screens', () => {
  for (const token of ['.marketingPage', '.marketingHero', '.pricingGrid', '.authPage', '.workspaceShell', '.workspaceSidebar', '.workspacePanel', '.domainForm', '.actionToast', '@media (max-width: 980px)', '@media (max-width: 640px)']) {
    assert.ok(css.includes(token), `${token} style exists`);
  }
  for (const existingToken of ['--color-primary: #1E3A8A', '--background-main: #F8FAFC', '--status-success-text: #16A34A']) {
    assert.ok(css.includes(existingToken), `${existingToken} design token is preserved`);
  }
});

test('architectural decoupling pass is logged as a structured 40-task chunk', () => {
  for (const taskId of ['T150', 'T160', 'T170', 'T180', 'T189']) {
    assert.ok(tasks.includes(taskId), `${taskId} is logged`);
  }
  const passTasks = tasks.match(/T1(5[0-9]|6[0-9]|7[0-9]|8[0-9])/g) ?? [];
  assert.ok(passTasks.length >= 40, 'first reconstruction pass contains at least 40 tasks');
});
