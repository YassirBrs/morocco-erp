import { Module } from '@nestjs/common';
import { TenantService } from './services/tenant.service';
import { TenantController } from './controllers/tenant.controller';

@Module({ controllers: [TenantController], providers: [TenantService], exports: [TenantService] })
export class TenantModule {}
