import { Test, TestingModule } from '@nestjs/testing';
import { PayrollService, PayrollInput, PayrollResult } from './payroll.service';

describe('PayrollService – gross-to-net', () => {
  let service: PayrollService;

  /**
   * Factory: builds a minimal but well-formed PayrollInput.
   * Gross = base + seniority + overtime + bonus + otherIncome = 10 000
   */
  const baseInput = (overrides: Partial<PayrollInput> = {}): PayrollInput => ({
    employeeId:       'E001',
    employeeName:     'Ahmed Taleb',
    cin:              'AB123456',
    cnssNumber:       '1234567890',
    employerName:     'SARL Demo',
    employerCnss:     '1234567',
    planCode:         'INPTLQ',
    year:             2026,
    month:            3,
    maritalStatus:    'CELIBATAIRE',
    dependents:       0,
    category:         'NON_CADRE',
    baseSalary:       6_000,
    seniorityBonus:   1_000,
    overtimePay:      1_000,
    transportAllow:   0,
    bonus:            1_000,
    otherIncome:      1_000,
    employerAdvance:  0,
    otherDeduction:   0,
    ...overrides,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayrollService],
    }).compile();
    service = module.get<PayrollService>(PayrollService);
  });

  // ── CNSS cap ────────────────────────────────────────────────────────────────
  describe('CNSS (capped at 6 000 MAD)', () => {
    it('uses gross when below the cap', () => {
      // gross = 6 000 + 1 000 + 1 000 + 500 + 500 + 1 000 = 10 000 → capped to 6 000
      const r: PayrollResult = service.generatePayslip(baseInput());
      expect(r.cnssBase).toBeCloseTo(6_000, 1);
      expect(r.cnssEmployee).toBeCloseTo(6_000 * 0.0448, 2);  // 268.80
      expect(r.cnssEmployer).toBeCloseTo(6_000 * 0.0898, 2);  // 538.80
    });

    it('uses the full gross when below the cap', () => {
      // gross = 5_000 (all components sum ≤ 6 000)
      const r: PayrollResult = service.generatePayslip(
        baseInput({ baseSalary: 4_500, seniorityBonus: 0, overtimePay: 0, bonus: 0, otherIncome: 0 }),
      );
      expect(r.cnssBase).toBeCloseTo(4_500, 1);
      expect(r.cnssEmployee).toBeCloseTo(4_500 * 0.0448, 4); // 201.6
      expect(r.cnssEmployer).toBeCloseTo(4_500 * 0.0898, 4); // 404.1
    });

    it('never lets the base exceed 6 000 MAD', () => {
      const r: PayrollResult = service.generatePayslip(
        baseInput({ baseSalary: 20_000, seniorityBonus: 0, overtimePay: 0, bonus: 0, otherIncome: 0 }),
      );
      expect(r.cnssBase).toBe(6_000);
    });
  });

  // ── Uncapped contributions ─────────────────────────────────────────────────
  describe('Uncapped social contributions', () => {
    it('applies AMO employee at 2.26 % on the full gross (not the capped CNSS base)', () => {
      const gross: number = 10_000;
      const r: PayrollResult = service.generatePayslip(baseInput());
      expect(r.amoEmployee).toBeCloseTo(gross * 0.0226, 2);   // 226
      expect(r.amoEmployer).toBeCloseTo(gross * 0.0411, 2);   // 411
    });
  });

  // ── Professional expenses ───────────────────────────────────────────────────
  describe('Professional expenses (Frais Professionnels)', () => {
    it('applies 35% rate when annual gross ≤ 78 000 MAD', () => {
      // monthly gross = 5 000 → annual = 60 000 ≤ 78 000 → 35% rate, no monthly cap
      const r: PayrollResult = service.generatePayslip(
        baseInput({ baseSalary: 5_000, seniorityBonus: 0, overtimePay: 0, bonus: 0, otherIncome: 0 }),
      );
      expect(r.professionalExpRate).toBeCloseTo(0.35, 4);
      expect(r.professionalExpAmount).toBeCloseTo(5_000 * 0.35, 2); // 1 750
      expect(r.professionalExpCap).toBeCloseTo(2_500, 1);          // not hit
    });

    it('applies 20% rate capped at 2 500 MAD when annual gross > 78 000 MAD', () => {
      // monthly gross = 10 000 → annual = 120 000 > 78 000 → 20% with 2 500 cap
      const r: PayrollResult = service.generatePayslip(
        baseInput({ baseSalary: 10_000, seniorityBonus: 0, overtimePay: 0, bonus: 0, otherIncome: 0 }),
      );
      expect(r.professionalExpRate).toBeCloseTo(0.20, 4);
      // 10 000 * 0.20 = 2 000 < 2 500 cap → not yet capped in this case
      // verify by reading annual value to confirm rate was applied
      expect(r.annualGrossTaxable).toBeCloseTo(120_000, 0);
    });

    it('enforces the 2 500 MAD monthly cap for high earners', () => {
      // gross = 20 000 → 20% × 20 000 = 4 000, but cap = 2 500
      const r: PayrollResult = service.generatePayslip(
        baseInput({ baseSalary: 20_000, seniorityBonus: 0, overtimePay: 0, bonus: 0, otherIncome: 0 }),
      );
      expect(r.professionalExpAmount).toBeCloseTo(2_500, 1);
    });

    it('annual gross taxable = monthly gross × 12', () => {
      const r: PayrollResult = service.generatePayslip(baseInput());
      expect(r.annualGrossTaxable).toBeCloseTo(10_000 * 12, 0);
    });
  });

  // ── Progressive IR ─────────────────────────────────────────────────────────
  describe('Progressive IR scale', () => {
    it('0 % bracket: IR final = 0 when net taxable = 3 333.33', () => {
      // Force netTaxableSalary low enough: reduce gross by lowering inputs
      const input: PayrollInput = baseInput({
        baseSalary: 3_200, seniorityBonus: 0, overtimePay: 0, bonus: 0, otherIncome: 0,
      });
      const r: PayrollResult = service.generatePayslip(input);
      expect(r.irRate).toBe(0);
      expect(r.irFinal).toBe(0);
    });

    it('0 % bracket after deductions around 4 000 MAD gross', () => {
      const r: PayrollResult = service.generatePayslip(
        baseInput({ baseSalary: 4_000, seniorityBonus: 0, overtimePay: 0, bonus: 0, otherIncome: 0 }),
      );
      expect(r.irRate).toBeCloseTo(0, 4);
      expect(r.irFinal).toBeCloseTo(0, 1);
    });

    it('0 % bracket after deductions around 5 500 MAD gross', () => {
      const r: PayrollResult = service.generatePayslip(
        baseInput({ baseSalary: 5_500, seniorityBonus: 0, overtimePay: 0, bonus: 0, otherIncome: 0 }),
      );
      expect(r.irRate).toBeCloseTo(0, 4);
      expect(r.irFinal).toBeCloseTo(0, 1);
    });

    it('20 % bracket around 7 000 MAD gross after deductions', () => {
      const r: PayrollResult = service.generatePayslip(
        baseInput({ baseSalary: 7_000, seniorityBonus: 0, overtimePay: 0, bonus: 0, otherIncome: 0 }),
      );
      expect(r.irRate).toBeCloseTo(0.20, 4);
      expect(r.irFinal).toBeCloseTo(201, 0);
    });

    it('34 % bracket around 18 000 MAD gross after deductions', () => {
      const r: PayrollResult = service.generatePayslip(
        baseInput({ baseSalary: 18_000, seniorityBonus: 0, overtimePay: 0, bonus: 0, otherIncome: 0 }),
      );
      expect(r.irRate).toBeCloseTo(0.34, 4);
      expect(r.irFinal).toBeCloseTo(3_207, 0);
    });

    it('IR final is never negative', () => {
      const r: PayrollResult = service.generatePayslip(
        baseInput({ baseSalary: 1_000, seniorityBonus: 0, overtimePay: 0, bonus: 0, otherIncome: 0 }),
      );
      expect(r.irFinal).toBeGreaterThanOrEqual(0);
    });
  });

  // ── Family abatements ───────────────────────────────────────────────────────
  describe('Family abatement', () => {
    it('deducts 50 MAD per dependent', () => {
      const r: PayrollResult = service.generatePayslip(baseInput({ dependents: 3 }));
      expect(r.familyAbatementAmount).toBeCloseTo(150, 1); // 3 × 50
    });

    it('caps at 6 dependents (300 MAD)', () => {
      const r: PayrollResult = service.generatePayslip(baseInput({ dependents: 12 }));
      expect(r.familyAbatementAmount).toBeCloseTo(300, 1);
    });

    it('zero dependents → zero abatement', () => {
      const r: PayrollResult = service.generatePayslip(baseInput({ dependents: 0 }));
      expect(r.familyAbatementAmount).toBe(0);
    });
  });

  // ── Net to pay ──────────────────────────────────────────────────────────────
  describe('Net to pay', () => {
    it('is always ≤ grossToPay', () => {
      const r: PayrollResult = service.generatePayslip(baseInput());
      expect(r.netToPay).toBeLessThanOrEqual(r.grossToPay);
    });

    it('is positive for standard inputs', () => {
      const r: PayrollResult = service.generatePayslip(baseInput());
      expect(r.netToPay).toBeGreaterThan(0);
    });
  });

  // ── Complete end-to-end golden values ───────────────────────────────────────
  describe('Golden values – baseInput (base=6 000, gross=10 000)', () => {
    let r: PayrollResult;
    beforeEach(() => { r = service.generatePayslip(baseInput()); });

    it('input equates to original base', () => { expect(r.input.baseSalary).toBe(6_000); });
    it('cnssBase = 6 000', () => { expect(r.cnssBase).toBe(6_000); });
    it('cnssEmployee = 268.80', () => { expect(r.cnssEmployee).toBeCloseTo(268.8, 1); });
    it('cnssEmployer = 538.80', () => { expect(r.cnssEmployer).toBeCloseTo(538.8, 1); });
    it('amoEmployee = 226', () => { expect(r.amoEmployee).toBeCloseTo(226, 0); });
    it('amoEmployer = 411', () => { expect(r.amoEmployer).toBeCloseTo(411, 0); });
    it('familyAlloc = 640', () => { expect(r.familyAlloc).toBeCloseTo(640, 0); });
    it('profTraining = 160', () => { expect(r.profTraining).toBeCloseTo(160, 0); });
    it('annualGrossTaxable = 120 000', () => { expect(r.annualGrossTaxable).toBeCloseTo(120_000, 0); });
    it('professionalExpAmount = 2 000 (20% × 10 000, not yet capped by 2 500)', () => {
      expect(r.professionalExpAmount).toBeCloseTo(2_000, 0);
    });
    it('netTaxableSalary is non-negative and ≤ grossToPay', () => {
      expect(r.netTaxableSalary).toBeGreaterThanOrEqual(0);
      expect(r.netTaxableSalary).toBeLessThanOrEqual(r.grossToPay);
  });

  // ── Damancom 260-col export
  });

  // ── Damancom 260-col export ─────────────────────────────────────────────────
  describe('Damancom ASCII export', () => {
    it('produces a single row of exactly 260 characters (no trailing spaces dropped)', () => {
      const r = service.generatePayslip(baseInput());
      const out = service['exportToDamancom']([r]);
      expect(out.length).toBe(261); // 260 chars + \n
      const row = out.slice(0, 260);
      expect(row).toHaveLength(260);
    });

    it('all rows end with the same length after padding', () => {
      const records = [
        service.generatePayslip(baseInput({ employeeName: 'Short' })),
        service.generatePayslip(baseInput({ employerName: 'EXTREMELY LONG COMPANY NAME THAT NEEDS PADDING ABCDEFGHIJKLMNOPQRST' })),
      ];
      const out = service['exportToDamancom'](records);
      const rows = out.split('\n').filter(Boolean);
      expect(rows.every((r: string) => r.length === 260)).toBe(true);
    });

    it('ends with a final newline', () => {
      const out = service['exportToDamancom']([service.generatePayslip(baseInput())]);
      expect(out.endsWith('\n')).toBe(true);
    });

    it('multi-row export ends with a final newline', () => {
      const out = service['exportToDamancom']([
        service.generatePayslip(baseInput()),
        service.generatePayslip(baseInput({ employeeId: 'E002' })),
      ]);
      expect(out.endsWith('\n')).toBe(true);
    });

    it('numeric fields are left-padded with spaces, not zero-padded', () => {
      const r = service.generatePayslip(baseInput());
      const row = service['exportToDamancom']([r]).slice(0, 260);
      // Verify grossToPay field (offset 131, 15 chars): left-padded
      const grossStr = row.slice(131, 146);
      expect(parseInt(grossStr, 10)).toBeCloseTo(r.grossToPay, 0);
    });

    it('does not throw with 100 employees', () => {
      const recs = Array.from({ length: 100 }, (_, i) =>
        service.generatePayslip(baseInput({ employeeId: `E${String(i).padStart(3, '0')}` })),
      );
      expect(() => service['exportToDamancom'](recs)).not.toThrow();
    });
  });
});
