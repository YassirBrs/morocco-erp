import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PayrollService } from '../services/payroll.service';
import { PayrollInput, PayrollResult } from '../dto/payroll.dto';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get('payslips') list() { return this.payrollService.listPayslips(); }

  @Get('employees') employees() { return this.payrollService.listEmployees(); }
  @Get('employees/import-template.csv') employeeImportTemplateCsv() { return this.payrollService.employeeImportTemplateCsv(); }
  @Post('employees') addEmployee(@Body() body: any) { return this.payrollService.addEmployee(body); }

  @Get('runs/:id/timeline') payrollRunTimeline(@Param('id') id: string) { return this.payrollService.payrollRunTimeline(id); }
  @Post('runs/:id/notes') addPayrollRunNote(@Param('id') id: string, @Body() body: any) { return this.payrollService.addPayrollRunNote(id, body); }
  @Post('runs/:id/tasks') addPayrollRunTask(@Param('id') id: string, @Body() body: any) { return this.payrollService.addPayrollRunTask(id, body); }

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
