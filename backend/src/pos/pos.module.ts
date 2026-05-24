import { Module } from '@nestjs/common';
import { PosService } from './services/pos.service';
import { PosController } from './controllers/pos.controller';

@Module({ controllers: [PosController], providers: [PosService], exports: [PosService] })
export class PosModule {}
