export type MaritalStatus = 'CELIBATAIRE' | 'MARIE' | 'DIVORCE' | 'VEUF';
export type EmployeeCategory = 'CADRE' | 'NON_CADRE';

export interface PayrollInput {
  employeeId: string;
  employeeName: string;
  cin: string;
  cnssNumber: string;
  employerName: string;
  employerCnss: string;
  planCode: string;
  year: number;
  month: number;
  maritalStatus: MaritalStatus;
  dependents: number;
  category: EmployeeCategory;
  baseSalary: number;
  seniorityBonus: number;
  overtimePay: number;
  transportAllow: number;
  bonus: number;
  otherIncome: number;
  employerAdvance: number;
  otherDeduction: number;
}

export interface PayrollResult {
  input: PayrollInput;

  cnssBase: number;
  cnssEmployeeRate: number;
  cnssEmployee: number;
  cnssEmployerRate: number;
  cnssEmployer: number;

  amoEmployeeRate: number;
  amoEmployee: number;
  amoEmployerRate: number;
  amoEmployer: number;
  familyAllocRate: number;
  familyAlloc: number;
  profTrainingRate: number;
  profTraining: number;

  annualGrossTaxable: number;
  professionalExpRate: number;
  professionalExpCap: number;
  professionalExpAmount: number;
  seniorityExemption: number;
  netTaxableSalary: number;

  irBracket: number;
  irRate: number;
  irGrossAmount: number;
  irDeduction: number;
  familyAbatementAmount: number;
  irFinal: number;

  allowancesToPay: number;
  grossToPay: number;
  totalEmployeeDeductions: number;
  netToPay: number;

  totalEmployerContrib: number;
  employerCost: number;
}
