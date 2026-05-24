import { Module } from '@nestjs/common';
import { CrmService } from './services/crm.service';
import { CrmController } from './controllers/crm.controller';

@Module({ controllers: [CrmController], providers: [CrmService], exports: [CrmService] })
export class CrmModule {}
