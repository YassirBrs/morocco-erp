import { expect, type Page } from '@playwright/test';
import { BasePage, latest } from './base-page';

const selectors = {
  payrollNavigation: '[data-view="payroll"]',
  employeeNumber: '#employeeForm [name="employeeNumber"]',
  fullName: '#employeeForm [name="fullName"]',
  arabicName: '#employeeForm [name="arabicName"]',
  cin: '#employeeForm [name="cin"]',
  cnssNumber: '#employeeForm [name="cnssNumber"]',
  contractType: '#employeeForm [name="contractType"]',
  hireDate: '#employeeForm [name="hireDate"]',
  baseSalary: '#employeeForm [name="baseSalary"]',
  dependents: '#employeeForm [name="dependents"]',
  preferredLanguage: '#employeeForm [name="preferredLanguage"]',
  employeeSubmit: '#employeeForm button[type="submit"]',
  employeeRows: '#employeeRows',
  createPayrollRun: '#createPayrollRun',
  calculatePayrollRun: '#calculatePayrollRun',
  exportDamancomRun: '#exportDamancomRun',
  payrollGrossSummary: '#payrollGrossSummary',
  payrollNetSummary: '#payrollNetSummary',
  damancomSummary: '#damancomSummary',
};

type Employee = { id: string; employeeNumber: string; fullName: string; cin: string; cnssNumber: string };
type PayrollRun = {
  id: string;
  number: string;
  period: string;
  status: string;
  payslips: Array<{ employeeId: string; grossSalary: number; netSalary: number; cnssEmployee: number; amoEmployee: number; ir: number }>;
  totals: { grossSalary: number; netSalary: number; employerCost: number };
};

export class PayrollPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openPayrollWorkspace() {
    await this.click(selectors.payrollNavigation);
    await expect(this.locator(selectors.employeeRows)).toBeVisible();
  }

  async createEmployee(data: {
    employeeNumber: string;
    fullName: string;
    arabicName: string;
    cin: string;
    cnssNumber: string;
    baseSalary: string;
    dependents: string;
  }): Promise<Employee> {
    await this.fill(selectors.employeeNumber, data.employeeNumber);
    await this.fill(selectors.fullName, data.fullName);
    await this.fill(selectors.arabicName, data.arabicName);
    await this.fill(selectors.cin, data.cin);
    await this.fill(selectors.cnssNumber, data.cnssNumber);
    await this.select(selectors.contractType, 'CDI');
    await this.fill(selectors.hireDate, '2026-05-01');
    await this.fill(selectors.baseSalary, data.baseSalary);
    await this.fill(selectors.dependents, data.dependents);
    await this.select(selectors.preferredLanguage, 'FR');
    await this.click(selectors.employeeSubmit);
    await this.waitForSuccessMessage(`Salarié ${data.fullName} ajouté`);
    await expect(this.locator(selectors.employeeRows)).toContainText(data.cin);

    const employees = await this.apiGet<Employee[]>('/payroll/employees');
    const employee = employees.find((candidate) => candidate.employeeNumber === data.employeeNumber);
    expect(employee).toBeTruthy();
    expect(employee!.cnssNumber).toBe(data.cnssNumber);
    return employee!;
  }

  async runMonthlyPayrollAndValidateDamancom(employee: Employee): Promise<PayrollRun> {
    await this.click(selectors.createPayrollRun);
    await this.waitForSuccessMessage(/Run de paie .* créé/);
    await this.click(selectors.calculatePayrollRun);
    await this.waitForSuccessMessage(/Paie .* calculée/);

    const run = latest(await this.apiGet<PayrollRun[]>('/payroll/runs'));
    expect(run.status).toBe('CALCULATED');
    expect(run.payslips.some((payslip) => payslip.employeeId === employee.id && payslip.grossSalary > payslip.netSalary)).toBeTruthy();
    expect(run.totals.grossSalary).toBeGreaterThan(run.totals.netSalary);
    await expect(this.locator(selectors.payrollGrossSummary)).not.toHaveText(/^0/);
    await expect(this.locator(selectors.payrollNetSummary)).not.toHaveText(/^0/);

    const preflight = await this.apiGet<{ status: string; checkedEmployees: number; rows: unknown[] }>(`/payroll/runs/${run.id}/damancom/preflight`);
    expect(preflight.status).toBe('READY');
    expect(preflight.rows).toHaveLength(0);
    expect(preflight.checkedEmployees).toBeGreaterThan(0);

    await this.click(selectors.exportDamancomRun);
    await this.waitForSuccessMessage(/Export Damancom prêt/);
    const exportFile = await this.apiGet<{ rowCount: number; rowLength: number; content: string; checksum: string }>(`/payroll/runs/${run.id}/damancom`);
    expect(exportFile.rowCount).toBe(run.payslips.length);
    expect(exportFile.rowLength).toBe(260);
    const rows = exportFile.content.endsWith('\n') ? exportFile.content.slice(0, -1).split('\n') : exportFile.content.split('\n');
    expect(rows.every((row) => row.length === 260)).toBeTruthy();
    expect(exportFile.checksum).toBeTruthy();
    await expect(this.locator(selectors.damancomSummary)).toContainText('260 caractères');
    return run;
  }
}
