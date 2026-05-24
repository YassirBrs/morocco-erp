import { Controller, Get, Post, Body } from '@nestjs/common';
import { PayrollService } from '../services/payroll.service';
import { PayrollInput, PayrollResult } from '../dto/payroll.dto';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get('payslips') list() { return this.payrollService.listPayslips(); }

  @Post('payslips')
  generate(@Body() input: PayrollInput): PayrollResult {
    return this.payrollService.generatePayslip(input);
  }

  @Post('damancom')
  exportDamancom(@Body() body: { records: PayrollInput[] }): { content: string; rowCount: number } {
    const records = body.records.map((input) => this.payrollService.generatePayslip(input));
    return {
      content: this.payrollService.exportToDamancom(records),
      rowCount: records.length,
    };
  }
}
