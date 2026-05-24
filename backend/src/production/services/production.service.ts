import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class ProductionService {
  constructor(private readonly store: ErpStoreService) {}

  listBoms() { return this.store.listBillsOfMaterial(); }
  createBom(data: any) { return this.store.createBillOfMaterial(data); }
  listOrders() { return this.store.listProductionOrders(); }
  createOrder(data: any) { return this.store.createProductionOrder(data); }
  listMaintenance() { return this.store.listMaintenance(); }
  createMaintenanceAsset(data: any) { return this.store.createMaintenanceAsset(data); }
  createMaintenanceWorkOrder(data: any) { return this.store.createMaintenanceWorkOrder(data); }
  completeMaintenanceWorkOrder(id: string) { return this.store.completeMaintenanceWorkOrder(id); }
  listFleet() { return this.store.listFleet(); }
  createFleetVehicle(data: any) { return this.store.createFleetVehicle(data); }
  addFleetLog(data: any) { return this.store.addFleetLog(data); }
  listProjects() { return this.store.listProjects(); }
  createProject(data: any) { return this.store.createProject(data); }
  updateProject(id: string, data: any) { return this.store.updateProject(id, data); }
  profitability() { return this.store.profitabilityView(); }
}
