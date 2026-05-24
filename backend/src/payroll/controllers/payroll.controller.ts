import { Controller, Delete, Get, Patch, Post, Body, Param, Query } from '@nestjs/common';
import { PayrollService } from '../services/payroll.service';
import { PayrollInput, PayrollResult } from '../dto/payroll.dto';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get('payslips') list() { return this.payrollService.listPayslips(); }

  @Get('employees') employees() { return this.payrollService.listEmployees(); }
  @Get('employees/import-template.csv') employeeImportTemplateCsv() { return this.payrollService.employeeImportTemplateCsv(); }
  @Get('employees/document-reminders') employeeDocumentReminders() { return this.payrollService.employeeDocumentReminders(); }
  @Get('employees/contract-reminders') contractLifecycleReminders() { return this.payrollService.contractLifecycleReminders(); }
  @Get('employees/cnss-anomalies') cnssEmployeeAnomalies() { return this.payrollService.cnssEmployeeAnomalies(); }
  @Get('employee-checklists') employeeChecklists() { return this.payrollService.listEmployeeChecklists(); }
  @Post('employee-checklists') employeeChecklist(@Body() body: any) { return this.payrollService.employeeChecklist(body); }
  @Post('employee-checklists/:id/complete') completeEmployeeChecklistItem(@Param('id') id: string, @Body() body: any) {
    return this.payrollService.completeEmployeeChecklistItem(id, body);
  }
  @Get('hr-notes') hrNotes(@Query('role') role?: any) { return this.payrollService.listHrPrivateNotes(role); }
  @Post('hr-notes') createHrNote(@Body() body: any) { return this.payrollService.createHrPrivateNote(body); }
  @Get('asset-assignments') assetAssignments() { return this.payrollService.listAssetAssignments(); }
  @Post('asset-assignments') assignAsset(@Body() body: any) { return this.payrollService.assignAsset(body); }
  @Post('asset-assignments/:id/return') returnAsset(@Param('id') id: string) { return this.payrollService.returnAsset(id); }
  @Get('loans') payrollLoans() { return this.payrollService.listPayrollLoans(); }
  @Post('loans') createPayrollLoan(@Body() body: any) { return this.payrollService.createPayrollLoan(body); }
  @Post('reimbursements') createEmployeeReimbursement(@Body() body: any) { return this.payrollService.createEmployeeReimbursement(body); }
  @Post('overtime-approvals') createOvertimeApproval(@Body() body: any) { return this.payrollService.createOvertimeApproval(body); }
  @Post('contract-amendments') amendEmploymentContract(@Body() body: any) { return this.payrollService.amendEmploymentContract(body); }
  @Get('social-declaration-reconciliation') socialDeclarationReconciliation() { return this.payrollService.payrollSocialDeclarationReconciliation(); }
  @Get('hr-audit-trail') hrAuditTrail(@Query('role') role?: any) { return this.payrollService.hrAuditTrail(role); }
  @Post('hr-audit-trail') addHrAuditTrail(@Body() body: any) { return this.payrollService.addHrAuditTrail(body); }
  @Get('employees/:id') employee(@Param('id') id: string) { return this.payrollService.getEmployee(id); }
  @Post('employees') addEmployee(@Body() body: any) { return this.payrollService.addEmployee(body); }
  @Patch('employees/:id') updateEmployee(@Param('id') id: string, @Body() body: any) { return this.payrollService.updateEmployee(id, body); }
  @Delete('employees/:id') archiveEmployee(@Param('id') id: string) { return this.payrollService.archiveEmployee(id); }

  @Get('contracts') contracts() { return this.payrollService.listContracts(); }
  @Post('contracts') addContract(@Body() body: any) { return this.payrollService.addContract(body); }
  @Get('cost-report') costReport() { return this.payrollService.costReport(); }
  @Get('variance-report') varianceReport(@Query('period') period?: string) { return this.payrollService.payrollVarianceReport(period); }

  @Get('leave-balances') leaveBalances() { return this.payrollService.leaveBalances(); }
  @Get('leave-requests') leaveRequests() { return this.payrollService.leaveRequests(); }
  @Get('leave-calendar') leaveCalendar() { return this.payrollService.leaveCalendar(); }
  @Post('leave-requests') createLeaveRequest(@Body() body: any) { return this.payrollService.createLeaveRequest(body); }
  @Post('leave-requests/:id/approve') approveLeaveRequest(@Param('id') id: string) { return this.payrollService.approveLeaveRequest(id); }
  @Post('leave-requests/:id/reject') rejectLeaveRequest(@Param('id') id: string, @Body() body: any) { return this.payrollService.rejectLeaveRequest(id, body); }

  @Get('portal-access') portalAccesses() { return this.payrollService.portalAccesses(); }
  @Post('portal-access') grantPortalAccess(@Body() body: any) { return this.payrollService.grantPortalAccess(body); }
  @Get('portal/:employeeId') portalDashboard(@Param('employeeId') employeeId: string) { return this.payrollService.portalDashboard(employeeId); }

  @Get('runs') runs() { return this.payrollService.listRuns(); }
  @Post('runs') createRun(@Body() body: any) { return this.payrollService.createRun(body); }
  @Post('runs/:id/calculate') calculateRun(@Param('id') id: string) { return this.payrollService.calculateRun(id); }
  @Post('runs/:id/approve') approveRun(@Param('id') id: string, @Body() body: any) { return this.payrollService.approveRun(id, body); }
  @Post('runs/:id/reject') rejectRun(@Param('id') id: string, @Body() body: any) { return this.payrollService.rejectRun(id, body); }
  @Post('runs/:id/post') postRun(@Param('id') id: string) { return this.payrollService.postRun(id); }
  @Post('runs/:id/cancel') cancelRun(@Param('id') id: string) { return this.payrollService.cancelRun(id); }
  @Get('runs/:id/summary') runSummary(@Param('id') id: string) { return this.payrollService.runSummary(id); }
  @Get('runs/:id/damancom') runDamancom(@Param('id') id: string) { return this.payrollService.runDamancom(id); }
  @Get('runs/:id/damancom/preflight') runDamancomPreflight(@Param('id') id: string) { return this.payrollService.damancomPreflight(id); }
  @Get('damancom/preflight') damancomPreflight() { return this.payrollService.damancomPreflight(); }
  @Get('exports/archive') exportArchives() { return this.payrollService.exportArchives(); }
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
