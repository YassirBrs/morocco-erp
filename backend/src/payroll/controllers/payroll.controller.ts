import { Controller, Delete, Get, Patch, Post, Body, Param } from '@nestjs/common';
import { PayrollService } from '../services/payroll.service';
import { PayrollInput, PayrollResult } from '../dto/payroll.dto';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get('payslips') list() { return this.payrollService.listPayslips(); }

  @Get('employees') employees() { return this.payrollService.listEmployees(); }
  @Get('employees/import-template.csv') employeeImportTemplateCsv() { return this.payrollService.employeeImportTemplateCsv(); }
  @Get('employees/:id') employee(@Param('id') id: string) { return this.payrollService.getEmployee(id); }
  @Post('employees') addEmployee(@Body() body: any) { return this.payrollService.addEmployee(body); }
  @Patch('employees/:id') updateEmployee(@Param('id') id: string, @Body() body: any) { return this.payrollService.updateEmployee(id, body); }
  @Delete('employees/:id') archiveEmployee(@Param('id') id: string) { return this.payrollService.archiveEmployee(id); }

  @Get('contracts') contracts() { return this.payrollService.listContracts(); }
  @Post('contracts') addContract(@Body() body: any) { return this.payrollService.addContract(body); }

  @Get('runs') runs() { return this.payrollService.listRuns(); }
  @Post('runs') createRun(@Body() body: any) { return this.payrollService.createRun(body); }
  @Post('runs/:id/calculate') calculateRun(@Param('id') id: string) { return this.payrollService.calculateRun(id); }
  @Post('runs/:id/approve') approveRun(@Param('id') id: string) { return this.payrollService.approveRun(id); }
  @Post('runs/:id/post') postRun(@Param('id') id: string) { return this.payrollService.postRun(id); }
  @Post('runs/:id/cancel') cancelRun(@Param('id') id: string) { return this.payrollService.cancelRun(id); }
  @Get('runs/:id/summary') runSummary(@Param('id') id: string) { return this.payrollService.runSummary(id); }
  @Get('runs/:id/damancom') runDamancom(@Param('id') id: string) { return this.payrollService.runDamancom(id); }
  @Get('runs/:id/payslips/:payslipId/pdf') runPayslipPdf(@Param('id') id: string, @Param('payslipId') payslipId: string) {
    return this.payrollService.runPayslipPdf(id, payslipId);
  }

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
