import { Injectable } from '@nestjs/common';
import { ErpStoreService } from '../../common/erp/erp-store.service';

@Injectable()
export class ProductionService {
  constructor(private readonly store: ErpStoreService) {}

  listBoms() { return this.store.listBillsOfMaterial(); }
  createBom(data: any) { return this.store.createBillOfMaterial(data); }
  listOrders() { return this.store.listProductionOrders(); }
  createOrder(data: any) { return this.store.createProductionOrder(data); }
  productionVarianceReport() { return this.store.productionVarianceReport(); }
  listMaintenance() { return this.store.listMaintenance(); }
  createMaintenanceAsset(data: any) { return this.store.createMaintenanceAsset(data); }
  createMaintenanceWorkOrder(data: any) { return this.store.createMaintenanceWorkOrder(data); }
  completeMaintenanceWorkOrder(id: string) { return this.store.completeMaintenanceWorkOrder(id); }
  createPreventiveMaintenanceSchedule(data: any) { return this.store.createPreventiveMaintenanceSchedule(data); }
  listPreventiveMaintenanceSchedules() { return this.store.listPreventiveMaintenanceSchedules(); }
  listFleet() { return this.store.listFleet(); }
  createFleetVehicle(data: any) { return this.store.createFleetVehicle(data); }
  addFleetLog(data: any) { return this.store.addFleetLog(data); }
  fleetFuelEfficiencyReport(month?: string) { return this.store.fleetFuelEfficiencyReport({ month }); }
  listProjects() { return this.store.listProjects(); }
  createProject(data: any) { return this.store.createProject(data); }
  updateProject(id: string, data: any) { return this.store.updateProject(id, data); }
  projectWipReport() { return this.store.projectWipReport(); }
  profitability() { return this.store.profitabilityView(); }
}
