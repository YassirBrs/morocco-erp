import { Module } from '@nestjs/common';
import { ComplianceController } from './controllers/compliance.controller';
import { ComplianceService } from './services/compliance.service';

@Module({
  controllers: [ComplianceController],
  providers: [ComplianceService],
  exports: [ComplianceService],
})
export class ComplianceModule {}
