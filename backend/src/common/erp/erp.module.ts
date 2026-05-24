import { Global, Module } from '@nestjs/common';
import { ErpStoreService } from './erp-store.service';

@Global()
@Module({
  providers: [ErpStoreService],
  exports: [ErpStoreService],
})
export class ErpDataModule {}
