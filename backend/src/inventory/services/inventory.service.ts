import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class InventoryService {
  constructor(private readonly store: ErpStoreService) {}

  listStock() { return this.store.listStock(); }
  listProducts() { return this.store.listProducts(); }
  productImportTemplateCsv() { return this.store.importTemplateCsv('products'); }
  productMarginAlerts() { return this.store.productMarginAlerts(); }
  productDuplicateReview() { return this.store.productDuplicateReview(); }
  getProduct(id: string) { return this.store.getProduct(id); }
  createProduct(data: any) { return this.store.addProduct(data); }
  updateProduct(id: string, data: any) { return this.store.updateProduct(id, data); }
  archiveProduct(id: string) { return this.store.archiveProduct(id); }
  bulkProductStatus(data: any) { return this.store.bulkArchiveRestore({ entity: 'PRODUCT', ids: data.ids ?? [], action: data.action }); }
  listSuppliers() { return this.store.listSuppliers(); }
  supplierImportTemplateCsv() { return this.store.importTemplateCsv('suppliers'); }
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
  createWarehouse(data: any) { return this.store.createWarehouse(data); }
  updateWarehouse(id: string, data: any) { return this.store.updateWarehouse(id, data); }
  warehouseStock() { return this.store.listWarehouseStock(); }
  barcodeLookup(code: string) { return this.store.barcodeLookup(code); }
  stockAlerts() { return this.store.stockAlerts(); }
  reservationVisibility() { return this.store.stockReservationVisibility(); }
  adjustStock(productId: string, qty: number, reason?: string) { return this.store.adjustStock(productId, qty, reason); }
  approveStockMove(id: string) { return this.store.approveStockMove(id); }
  listPurchaseOrders() { return this.store.listPurchaseOrders(); }
  createPurchaseOrder(data: any) { return this.store.createPurchaseOrder(data); }
  purchaseOrderPdf(id: string) { return this.store.exportPurchaseOrderPdf(id); }
  approvePurchaseOrder(id: string) { return this.store.approvePurchaseOrder(id); }
  cancelPurchaseOrder(id: string) { return this.store.cancelPurchaseOrder(id); }
  receivePurchase(data: any) { return this.store.createPurchaseReceipt(data); }
  listPurchaseReceipts() { return this.store.listPurchaseReceipts(); }
  purchaseReceiptPdf(id: string) { return this.store.exportPurchaseReceiptPdf(id); }
  approvePurchaseReceipt(id: string) { return this.store.approvePurchaseReceipt(id); }
  listSupplierInvoices() { return this.store.listSupplierInvoices(); }
  createSupplierInvoice(data: any) { return this.store.createSupplierInvoice(data); }
  listStockTransfers() { return this.store.listStockTransfers(); }
  transferStock(data: any) { return this.store.transferStock(data); }
  receiveTransfer(id: string) { return this.store.receiveStockTransfer(id); }
  listInventoryCounts() { return this.store.listInventoryCounts(); }
  createInventoryCount(data: any) { return this.store.createInventoryCount(data); }
  approveInventoryCount(id: string) { return this.store.approveInventoryCount(id); }
}
