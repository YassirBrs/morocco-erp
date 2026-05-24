import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class InventoryService {
  constructor(private readonly store: ErpStoreService) {}

  listStock() { return this.store.listStock(); }
  listProducts() { return this.store.listProducts(); }
  createProduct(data: any) { return this.store.addProduct(data); }
  listSuppliers() { return this.store.listSuppliers(); }
  createSupplier(data: any) { return this.store.addSupplier(data); }
  listWarehouses() { return this.store.listWarehouses(); }
  adjustStock(productId: string, qty: number, reason?: string) { return this.store.adjustStock(productId, qty, reason); }
  receivePurchase(data: any) { return this.store.createPurchaseReceipt(data); }
}
