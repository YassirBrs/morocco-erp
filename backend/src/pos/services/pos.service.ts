import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class PosService {
  constructor(private readonly store: ErpStoreService) {}

  listSessions() { return this.store.listPosSessions(); }
  openSession(data: any) { return this.store.openPosSession(data); }
  closeSession(id: string, data: any) { return this.store.closePosSession(id, data); }
  listTransactions() { return this.store.listPosTransactions(); }
  createTransaction(data: any) { return this.store.createPosTransaction(data); }
  refundTransaction(id: string, data: any) { return this.store.refundPosTransaction(id, data); }
  addCashMovement(data: any) { return this.store.addCashDrawerMovement(data); }
  createCashboxTransfer(data: any) { return this.store.createCashboxTransfer(data); }
  listCashboxTransfers() { return this.store.listCashboxTransfers(); }
  zReport(date?: string) { return this.store.dailyZReport(date); }
  queueOffline(data: any) { return this.store.queueOfflinePosSale(data); }
  syncOffline() { return this.store.syncOfflinePosQueue(); }
  offlineQueue() { return this.store.listPosOfflineQueue(); }
}
