import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class InventoryService {
  constructor(private readonly store: ErpStoreService) {}

  listStock() { return this.store.listStock(); }
  valuationReport() { return this.store.inventoryValuationReport(); }
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
  supplierStatement(id: string) { return this.store.supplierStatement(id); }
  supplierReliabilityScores() { return this.store.supplierReliabilityScores(); }
  listSupplierContracts() { return this.store.listSupplierContracts(); }
  createSupplierContract(data: any) { return this.store.createSupplierContract(data); }
  addSupplierDocumentPlaceholder(id: string, data: any) { return this.store.addSupplierDocumentPlaceholder(id, data); }
  listWarehouses() { return this.store.listWarehouses(); }
  createWarehouse(data: any) { return this.store.createWarehouse(data); }
  updateWarehouse(id: string, data: any) { return this.store.updateWarehouse(id, data); }
  warehouseStock() { return this.store.listWarehouseStock(); }
  barcodeLookup(code: string) { return this.store.barcodeLookup(code); }
  stockAlerts() { return this.store.stockAlerts(); }
  reservationVisibility() { return this.store.stockReservationVisibility(); }
  landedCostAllocation(data: any) { return this.store.landedCostAllocation(data); }
  listTraceabilityLots() { return this.store.listTraceabilityLots(); }
  createTraceabilityLot(data: any) { return this.store.createTraceabilityLot(data); }
  stockExpiryAlerts() { return this.store.stockExpiryAlerts(); }
  movementAudit() { return this.store.inventoryMovementAudit(); }
  lifecycleBoard() { return this.store.productLifecycleBoard(); }
  setProductLifecycleState(id: string, data: any) { return this.store.setProductLifecycleState(id, data.state); }
  listStockQuarantines() { return this.store.listStockQuarantines(); }
  createStockQuarantine(data: any) { return this.store.createStockQuarantine(data); }
  releaseStockQuarantine(id: string) { return this.store.releaseStockQuarantine(id); }
  releaseExpiredReservations(data: any) { return this.store.releaseExpiredStockReservations(data); }
  adjustStock(productId: string, qty: number, reason?: string) { return this.store.adjustStock(productId, qty, reason); }
  approveStockMove(id: string) { return this.store.approveStockMove(id); }
  listPurchaseRequests() { return this.store.listPurchaseRequests(); }
  createPurchaseRequest(data: any) { return this.store.createPurchaseRequest(data); }
  approvePurchaseRequest(id: string) { return this.store.approvePurchaseRequest(id); }
  convertPurchaseRequestToOrder(id: string, data: any) { return this.store.convertPurchaseRequestToOrder(id, data); }
  addSupplierQuoteComparison(data: any) { return this.store.addSupplierQuoteComparison(data); }
  supplierQuoteMatrix(id: string) { return this.store.supplierQuoteMatrix(id); }
  listRecurringPurchaseSchedules() { return this.store.listRecurringPurchaseSchedules(); }
  createRecurringPurchaseSchedule(data: any) { return this.store.createRecurringPurchaseSchedule(data); }
  runRecurringPurchaseSchedule(id: string) { return this.store.runRecurringPurchaseSchedule(id); }
  createProcurementBudget(data: any) { return this.store.createProcurementBudget(data); }
  procurementBudgetControls() { return this.store.procurementBudgetControls(); }
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
