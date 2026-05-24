import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

// ══════════════════════════════════════════════════════════════════════════════
//  INPUT / OUTPUT TYPES
// ══════════════════════════════════════════════════════════════════════════════
export type MaritalStatus = 'CELIBATAIRE' | 'MARIE' | 'DIVORCE' | 'VEUF';
export type EmployeeCategory = 'CADRE' | 'NON_CADRE';

export interface PayrollInput {
  employeeId:       string;
  employeeName:     string;
  cin:              string;
  cnssNumber:       string;
  employerName:     string;
  employerCnss:     string;
  planCode:         string;
  year:             number;
  month:            number;
  maritalStatus:    MaritalStatus;
  dependents:       number;
  category:         EmployeeCategory;
  baseSalary:       number;
  seniorityBonus:   number;
  overtimePay:      number;
  transportAllow:   number;
  bonus:            number;
  otherIncome:      number;
  employerAdvance:  number;
  otherDeduction:   number;
}

export interface PayrollResult {
  input: PayrollInput;

  // Capped CNSS
  cnssBase:         number;
  cnssEmployeeRate: number;
  cnssEmployee:      number;
  cnssEmployerRate: number;
  cnssEmployer:      number;

  // Uncapped contributions
  amoEmployeeRate:  number;
  amoEmployee:       number;
  amoEmployerRate:  number;
  amoEmployer:       number;
  familyAllocRate:  number;
  familyAlloc:       number;
  profTrainingRate: number;
  profTraining:      number;

  // Professional expenses
  annualGrossTaxable:    number;
  professionalExpRate:   number;
  professionalExpCap:    number;
  professionalExpAmount: number;
  seniorityExemption:    number;
  netTaxableSalary:      number;

  // IR scale
  irBracket:          number;
  irRate:             number;
  irGrossAmount:      number;
  irDeduction:        number;
  familyAbatementAmount: number;
  irFinal:            number;

  // Take-home pay
  allowancesToPay:         number;
  grossToPay:              number;
  totalEmployeeDeductions: number;
  netToPay:                number;

  // Employer cost
  totalEmployerContrib: number;
  employerCost:         number;
}

// ══════════════════════════════════════════════════════════════════════════════
//  CONSTANTS
// ══════════════════════════════════════════════════════════════════════════════
const CNSS_EMPLOYEE_RATE:  number = 0.0448;
const CNSS_EMPLOYER_RATE:  number = 0.0898;
const CNSS_CAP:            number = 6_000;

const AMO_EMPLOYEE_RATE:   number = 0.0226;
const AMO_EMPLOYER_RATE:   number = 0.0411;
const FAMILY_ALLOC_RATE:   number = 0.0640;
const PROF_TRAINING_RATE:  number = 0.0160;

const PROF_EXP_THRESHOLD:  number = 78_000;
const PROF_EXP_RATIO_LOW:  number = 0.35;
const PROF_EXP_RATIO_HIGH: number = 0.20;
const PROF_EXP_CAP:        number = 30_000;

const FAMILY_ABATEMENT_PER_DEP: number = 50;
const FAMILY_ABATEMENT_MAX_DEPS: number = 6;

const IR_BRACKETS: ReadonlyArray<{ upperBound: number; rate: number; deduction: number }> = [
  { upperBound: 3_333.33,   rate: 0.00,   deduction: 0.00     },
  { upperBound: 5_000.00,   rate: 0.10,   deduction: 333.33   },
  { upperBound: 6_666.67,   rate: 0.20,   deduction: 833.33   },
  { upperBound: 8_333.33,   rate: 0.30,   deduction: 1_500.00 },
  { upperBound: 15_000.00,  rate: 0.34,   deduction: 1_833.33 },
  { upperBound: Infinity,   rate: 0.37,   deduction: 2_283.33 },
];

const r2 = (v: number): number => parseFloat(v.toFixed(2));

// ══════════════════════════════════════════════════════════════════════════════
//  SERVICE
// ══════════════════════════════════════════════════════════════════════════════
@Injectable()
export class PayrollService {
  constructor(private readonly store: ErpStoreService) {}

  listPayslips(_employeeId?: string): unknown {
    return this.store.listPayrollRuns().flatMap((run) => run.payslips);
  }

  listEmployees() { return this.store.listEmployees(); }
  getEmployee(id: string) { return this.store.getEmployee(id); }
  addEmployee(data: any) { return this.store.addEmployee(data); }
  updateEmployee(id: string, data: any) { return this.store.updateEmployee(id, data); }
  archiveEmployee(id: string) { return this.store.archiveEmployee(id); }
  listContracts() { return this.store.listEmploymentContracts(); }
  addContract(data: any) { return this.store.addEmploymentContract(data); }
  costReport() { return this.store.payrollCostReport(); }
  listRuns() { return this.store.listPayrollRuns(); }
  createRun(data: any) { return this.store.createPayrollRun(data); }
  calculateRun(id: string) { return this.store.calculatePayrollRun(id); }
  approveRun(id: string, data?: any) { return this.store.approvePayrollRun(id, data); }
  rejectRun(id: string, data?: any) { return this.store.rejectPayrollRun(id, data); }
  postRun(id: string) { return this.store.postPayrollRun(id); }
  cancelRun(id: string) { return this.store.cancelPayrollRun(id); }
  runSummary(id: string) { return this.store.payrollRunSummary(id); }
  runPayslipPdf(runId: string, payslipId: string) { return this.store.generatePayslipPdf(runId, payslipId); }
  runDamancom(id: string) { return this.store.exportPayrollRunDamancom(id); }
  exportArchives() { return this.store.listPayrollExportArchives(); }
  damancomPreflight(id?: string) { return this.store.payrollDamancomPreflight(id); }
  leaveCalendar() { return this.store.leaveCalendar(); }
  contractLifecycleReminders() { return this.store.contractLifecycleReminders(); }
  leaveBalances() { return this.store.listLeaveBalances(); }
  leaveRequests() { return this.store.listLeaveRequests(); }
  createLeaveRequest(data: any) { return this.store.createLeaveRequest(data); }
  approveLeaveRequest(id: string) { return this.store.approveLeaveRequest(id); }
  rejectLeaveRequest(id: string, data: any) { return this.store.rejectLeaveRequest(id, data?.reason); }
  portalAccesses() { return this.store.listEmployeePortalAccesses(); }
  grantPortalAccess(data: any) { return this.store.grantEmployeePortalAccess(data); }
  portalDashboard(employeeId: string) { return this.store.employeePortalDashboard(employeeId); }
  employeeDocumentReminders() { return this.store.employeeDocumentReminders(); }
  employeeImportTemplateCsv() { return this.store.importTemplateCsv('employees'); }
  payrollRunTimeline(id: string) { return this.store.entityTimeline('PAYROLL_RUN', id); }
  addPayrollRunNote(id: string, data: any) { return this.store.addInternalNote({ entityType: 'PAYROLL_RUN', entityId: id, ...data }); }
  addPayrollRunTask(id: string, data: any) { return this.store.addInternalTask({ entityType: 'PAYROLL_RUN', entityId: id, ...data }); }

  generatePayslip(input: PayrollInput): PayrollResult {

    // ── 1. Gross taxable income (SBI) ──────────────────────────────────────────
    const grossTaxable: number = r2(
      input.baseSalary
      + input.seniorityBonus
      + input.overtimePay
      + input.bonus
      + input.otherIncome,
    );

    // ── 2. Capped CNSS imputed base ────────────────────────────────────────────
    const cnssBase: number = Math.min(grossTaxable, CNSS_CAP);

    // ── 3. Capped CNSS employee + employer ─────────────────────────────────────
    const cnssEmployeeRate: number = CNSS_EMPLOYEE_RATE;
    const cnssEmployee:      number = r2(cnssBase * cnssEmployeeRate);
    const cnssEmployerRate:  number = CNSS_EMPLOYER_RATE;
    const cnssEmployer:      number = r2(cnssBase * cnssEmployerRate);

    // ── 4. Uncapped mandatory contributions ────────────────────────────────────
    const amoEmployeeRate:  number = AMO_EMPLOYEE_RATE;
    const amoEmployee:       number = r2(grossTaxable * amoEmployeeRate);
    const amoEmployerRate:  number = AMO_EMPLOYER_RATE;
    const amoEmployer:       number = r2(grossTaxable * amoEmployerRate);
    const familyAllocRate:  number = FAMILY_ALLOC_RATE;
    const familyAlloc:       number = r2(grossTaxable * familyAllocRate);
    const profTrainingRate: number = PROF_TRAINING_RATE;
    const profTraining:      number = r2(grossTaxable * profTrainingRate);

    // ── 5. Professional expenses (Frais Professionnels) ─────────────────────────
    const annualGrossTaxable: number  = r2(grossTaxable * 12);
    const professionalExpRate: number =
      annualGrossTaxable <= PROF_EXP_THRESHOLD ? PROF_EXP_RATIO_LOW : PROF_EXP_RATIO_HIGH;
    const professionalExpCap:    number = r2(PROF_EXP_CAP / 12);
    const professionalExpAmount: number = r2(Math.min(grossTaxable * professionalExpRate, professionalExpCap));

    // ── 6. Seniority exemption (IRIG logic) ────────────────────────────────────
    // Seniority bonus on top of base is reduced by the CNSS ceiling gap:
    const seniorityExemption: number = Math.min(
      input.seniorityBonus,
      Math.max(0, CNSS_CAP - cnssBase),
    );

    // ── 7. Gross to pay ────────────────────────────────────────────────────────
    const allowancesToPay: number = r2(
      input.baseSalary + input.transportAllow + input.otherIncome,
    );
    const grossToPay: number = r2(
      allowancesToPay + input.overtimePay + input.seniorityBonus,
    );

    // ── 8. Net taxable salary (RNI) ────────────────────────────────────────────
    const grossToPayBeforeIR: number = r2(grossToPay - cnssEmployee - amoEmployee);
    const netTaxableSalary: number = r2(
      Math.max(0, grossToPayBeforeIR - professionalExpAmount - seniorityExemption),
    );

    // ── 9. Progressive IR ──────────────────────────────────────────────────────
    const matchedBracket: { upperBound: number; rate: number; deduction: number } =
      IR_BRACKETS.find(b => netTaxableSalary <= b.upperBound)!;
    const irBracket:     number = IR_BRACKETS.indexOf(matchedBracket);
    const irRate:        number = matchedBracket.rate;
    const irGrossAmount: number = r2(netTaxableSalary * irRate);
    const irDeduction:   number = matchedBracket.deduction;

    // ── 10. Family abatement ───────────────────────────────────────────────────
    const cappedDeps:      number = Math.min(input.dependents, FAMILY_ABATEMENT_MAX_DEPS);
    const familyAbatement: number = r2(cappedDeps * FAMILY_ABATEMENT_PER_DEP);

    // ── 11. Final IR ───────────────────────────────────────────────────────────
    const irFinal: number = r2(
      Math.max(0, irGrossAmount - irDeduction - familyAbatement),
    );

    // ── 12. Deductions & net to pay ─────────────────────────────────────────────
    const totalEmployeeDeductions: number = r2(
      cnssEmployee + amoEmployee + irFinal + input.employerAdvance + input.otherDeduction,
    );
    const netToPay: number = r2(grossToPay - totalEmployeeDeductions);

    // ── 13. Employer total cost ─────────────────────────────────────────────────
    const totalEmployerContrib: number = r2(
      cnssEmployer + amoEmployer + familyAlloc + profTraining,
    );
    const employerCost: number = r2(netToPay + totalEmployerContrib);

    // ── 14. Immutable result ───────────────────────────────────────────────────
    return Object.freeze({
      input: Object.freeze({ ...input, grossTaxable, netTaxableSalary }),

      cnssBase, cnssEmployeeRate, cnssEmployee, cnssEmployerRate, cnssEmployer,

      amoEmployeeRate, amoEmployee, amoEmployerRate, amoEmployer,
      familyAllocRate, familyAlloc, profTrainingRate, profTraining,

      annualGrossTaxable, professionalExpRate, professionalExpCap,
      professionalExpAmount, seniorityExemption, netTaxableSalary,

      irBracket, irRate, irGrossAmount, irDeduction, familyAbatementAmount: familyAbatement,
      irFinal,

      allowancesToPay, grossToPay, totalEmployeeDeductions, netToPay,

      totalEmployerContrib, employerCost,
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  DAMANCOM ASCII EXPORT
  //
  //  Each row represents one payslip and is padded with spaces to the
  //  mandatory 260-character column width, terminated by \n.
  //  Field positions map to Damancom's upload-layout specification.
  // ════════════════════════════════════════════════════════════════════════════

  private padRight(text: string, width: number): string {
    return text.padEnd(width, ' ');
  }

  private padLeft(value: number, width: number): string {
    return String(Math.trunc(value)).padStart(width, ' ');
  }

  private fixedText(text: string, width: number): string {
    return text.slice(0, width).padEnd(width, ' ');
  }

  private toDamancomRow(record: PayrollResult): string {
    const i  = record.input;
    const yr = String(i.year);
    const mo = String(i.month).padStart(2, '0');

    // Field positions correspond to Damancom column spec (0-indexed lengths):
    const cols: string[] = [
      // ── Identification ───────────────────────────────────────────────────────
      yr,                                    // 04  exercise year
      mo,                                    // 02  month
      this.fixedText(i.planCode, 4),          // 04  plan / regime code
      i.cnssNumber.slice(0, 10).padStart(10, '0'), // 10  CNSS affiliation number
      this.fixedText(i.employeeId, 20),       // 20  internal employee ref
      this.fixedText(i.employerName, 32),     // 32  company name
      i.employerCnss.slice(0, 7).padStart(7, '0'), // 07  employer CNSS
      this.fixedText(i.employeeName, 40),     // 40  employee name
      this.fixedText(i.cin, 12),              // 12  identity card ref

      // ── Income & professional expenses ────────────────────────────────────────
      this.padLeft(record.grossToPay, 15),               // 15  gross remuneration
      this.padLeft(record.seniorityExemption, 15),        // 15  seniority exemption
      this.padLeft(record.professionalExpAmount, 15),     // 15  professional expenses
      this.padLeft(record.annualGrossTaxable, 15),        // 15  annual gross taxable
      this.padLeft(record.netTaxableSalary, 15),          // 15  RNI (net taxable)

      // ── IRIG contribution ────────────────────────────────────────────────────
      this.padLeft(record.irGrossAmount, 15),             // 15  gross IR
      this.padLeft(record.irFinal, 15),                   // 15  net IR after abatement

      // ── Net to pay ───────────────────────────────────────────────────────────
      this.padLeft(record.netToPay, 15),      // 15  net to pay
    ];
    return cols.join('');
  }

  /** Render an array of computed payslips as a single DAMANCOM flat-file string. */
  exportToDamancom(records: PayrollResult[]): string {
    const rows = records.map(rec => {
      const row = this.toDamancomRow(rec);
      return this.padRight(row, 260);
    });
    return rows.join('\n') + '\n';
  }
}
