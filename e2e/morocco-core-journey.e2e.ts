import { expect, test } from '@playwright/test';
import { AccountingPage } from './pages/accounting-page';
import { CrmSalesPage } from './pages/crm-sales-page';
import { LoginPage } from './pages/login-page';
import { PayrollPage } from './pages/payroll-page';
import { TenantOnboardingPage } from './pages/tenant-onboarding-page';

test('Moroccan tenant completes core ERP journey from onboarding to sales, accounting, payment, and payroll', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const onboardingPage = new TenantOnboardingPage(page);
  const crmSalesPage = new CrmSalesPage(page);
  const accountingPage = new AccountingPage(page);
  const payrollPage = new PayrollPage(page);

  await loginPage.resetDemoData();
  await loginPage.open();
  await loginPage.signInAsTenantOwner();

  const tenantIdentity = {
    tradeName: 'Sahara Atlas Test SARL',
    ice: '003456789000071',
    ifNumber: '45871236',
    rc: 'CASA-998877',
    patente: '40881234',
    cnssNumber: '9876543',
    address: '120 Boulevard Zerktouni',
    city: 'Casablanca',
    invoiceSeries: 'SAT',
    vatStatus: 'ENABLED' as const,
    fiscalYearStartMonth: '1',
  };
  await onboardingPage.completeWizard(tenantIdentity);

  await crmSalesPage.openSalesWorkspace();
  const customer = await crmSalesPage.createCustomerWithMoroccanIce({
    name: 'Client E2E Casablanca SARL',
    arabicName: 'شركة الدار البيضاء للاختبار',
    ice: '009876543210123',
    ifNumber: '88776655',
    email: 'finance.e2e@example.ma',
    phone: '+212522123456',
    creditLimit: '200000',
  });
  const { invoice } = await crmSalesPage.createApproveConvertDeliverAndInvoice(customer);
  await accountingPage.expectCompliantPostedInvoice(invoice, tenantIdentity.invoiceSeries);

  const partiallyPaidInvoice = await crmSalesPage.recordPartialBankTransfer(invoice);
  await accountingPage.expectPartialPaymentAccounting(partiallyPaidInvoice);

  await payrollPage.openPayrollWorkspace();
  const employee = await payrollPage.createEmployee({
    employeeNumber: 'EMP-E2E-001',
    fullName: 'Sara El Mansouri',
    arabicName: 'سارة المنصوري',
    cin: 'BK123456',
    cnssNumber: '1122334455',
    baseSalary: '9200',
    dependents: '1',
  });
  await payrollPage.runMonthlyPayrollAndValidateDamancom(employee);
});

test('workspace smoke coverage exposes sales, purchases, inventory, accounting, and payroll journeys', async ({ page }) => {
  await page.goto('/index.html');
  const html = await page.content();
  for (const label of [
    'Ajouter client',
    'Créer devis',
    'Bon de livraison',
    'Payer solde',
    'Lancer achat démo',
    'Commandes, réceptions, factures et dépôts',
    'Transfert dépôt',
    'Comptage inventaire',
    'Écriture manuelle',
    'Déclaration TVA',
    'Lettrage',
    'Archiver preuve',
    'Créer paie mensuelle',
    'PDF bulletin',
    'Export Damancom',
    'CNSS',
  ]) {
    expect(html).toContain(label);
  }
});
