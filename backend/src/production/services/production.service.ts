import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class ProductionService {
  constructor(private readonly store: ErpStoreService) {}

  listOrders() { return this.store.listProductionOrders(); }
  createOrder(data: any) { return this.store.createProductionOrder(data); }
}
