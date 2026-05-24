import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class InventoryService {
  constructor(private readonly store: ErpStoreService) {}

  listStock() { return this.store.listStock(); }
  listProducts() { return this.store.listProducts(); }
  getProduct(id: string) { return this.store.getProduct(id); }
  createProduct(data: any) { return this.store.addProduct(data); }
  updateProduct(id: string, data: any) { return this.store.updateProduct(id, data); }
  archiveProduct(id: string) { return this.store.archiveProduct(id); }
  listSuppliers() { return this.store.listSuppliers(); }
  getSupplier(id: string) { return this.store.getSupplier(id); }
  createSupplier(data: any) { return this.store.addSupplier(data); }
  updateSupplier(id: string, data: any) { return this.store.updateSupplier(id, data); }
  archiveSupplier(id: string) { return this.store.archiveSupplier(id); }
  listWarehouses() { return this.store.listWarehouses(); }
  adjustStock(productId: string, qty: number, reason?: string) { return this.store.adjustStock(productId, qty, reason); }
  receivePurchase(data: any) { return this.store.createPurchaseReceipt(data); }
}
