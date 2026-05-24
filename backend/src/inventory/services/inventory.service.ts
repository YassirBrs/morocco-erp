import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class InventoryService {
  constructor(private readonly store: ErpStoreService) {}

  listStock() { return this.store.listStock(); }
  listProducts() { return this.store.listProducts(); }
  productMarginAlerts() { return this.store.productMarginAlerts(); }
  productDuplicateReview() { return this.store.productDuplicateReview(); }
  getProduct(id: string) { return this.store.getProduct(id); }
  createProduct(data: any) { return this.store.addProduct(data); }
  updateProduct(id: string, data: any) { return this.store.updateProduct(id, data); }
  archiveProduct(id: string) { return this.store.archiveProduct(id); }
  bulkProductStatus(data: any) { return this.store.bulkArchiveRestore({ entity: 'PRODUCT', ids: data.ids ?? [], action: data.action }); }
  listSuppliers() { return this.store.listSuppliers(); }
  getSupplier(id: string) { return this.store.getSupplier(id); }
  createSupplier(data: any) { return this.store.addSupplier(data); }
  updateSupplier(id: string, data: any) { return this.store.updateSupplier(id, data); }
  archiveSupplier(id: string) { return this.store.archiveSupplier(id); }
  supplierTimeline(id: string) { return this.store.entityTimeline('SUPPLIER', id); }
  addSupplierNote(id: string, data: any) { return this.store.addInternalNote({ entityType: 'SUPPLIER', entityId: id, ...data }); }
  addSupplierTask(id: string, data: any) { return this.store.addInternalTask({ entityType: 'SUPPLIER', entityId: id, ...data }); }
  bulkSupplierStatus(data: any) { return this.store.bulkArchiveRestore({ entity: 'SUPPLIER', ids: data.ids ?? [], action: data.action }); }
  exportSuppliersCsv() { return this.store.exportSuppliersCsv(); }
  importSuppliersCsv(data: { csv?: string }) { return this.store.importSuppliersCsv(data.csv ?? ''); }
  supplierRiskReminders(filter?: string) { return this.store.supplierRiskReminders({ filter }); }
  supplierPaymentCalendar() { return this.store.supplierPaymentCalendar(); }
  addSupplierDocumentPlaceholder(id: string, data: any) { return this.store.addSupplierDocumentPlaceholder(id, data); }
  listWarehouses() { return this.store.listWarehouses(); }
  adjustStock(productId: string, qty: number, reason?: string) { return this.store.adjustStock(productId, qty, reason); }
  approveStockMove(id: string) { return this.store.approveStockMove(id); }
  receivePurchase(data: any) { return this.store.createPurchaseReceipt(data); }
  approvePurchaseReceipt(id: string) { return this.store.approvePurchaseReceipt(id); }
}
