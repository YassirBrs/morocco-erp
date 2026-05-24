import { Module } from '@nestjs/common';
import { PayrollService } from './services/payroll.service';
import { PayrollController } from './controllers/payroll.controller';

@Module({ controllers: [PayrollController], providers: [PayrollService], exports: [PayrollService] })
export class PayrollModule {}
