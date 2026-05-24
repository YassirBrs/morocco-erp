import { Module } from '@nestjs/common';
import { ProductionService } from './services/production.service';
import { ProductionController } from './controllers/production.controller';

@Module({ controllers: [ProductionController], providers: [ProductionService], exports: [ProductionService] })
export class ProductionModule {}
