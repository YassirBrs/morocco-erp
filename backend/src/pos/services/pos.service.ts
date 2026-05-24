import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class PosService {
  constructor(private readonly store: ErpStoreService) {}

  listTransactions() { return this.store.listPosTransactions(); }
  createTransaction(data: any) { return this.store.createPosTransaction(data); }
}
