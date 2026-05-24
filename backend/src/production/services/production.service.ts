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
  createProductionQualityCheck(data: any) { return this.store.createProductionQualityCheck(data); }
  listProductionQualityChecks() { return this.store.listProductionQualityChecks(); }
  reserveMaintenanceSparePart(data: any) { return this.store.reserveMaintenanceSparePart(data); }
  consumeMaintenanceSparePart(id: string) { return this.store.consumeMaintenanceSparePart(id); }
  listMaintenanceSpareParts() { return this.store.listMaintenanceSpareParts(); }
  listFleet() { return this.store.listFleet(); }
  createFleetVehicle(data: any) { return this.store.createFleetVehicle(data); }
  addFleetLog(data: any) { return this.store.addFleetLog(data); }
  fleetFuelEfficiencyReport(month?: string) { return this.store.fleetFuelEfficiencyReport({ month }); }
  createFleetComplianceCase(data: any) { return this.store.createFleetComplianceCase(data); }
  listFleetComplianceCases() { return this.store.listFleetComplianceCases(); }
  listProjects() { return this.store.listProjects(); }
  createProject(data: any) { return this.store.createProject(data); }
  updateProject(id: string, data: any) { return this.store.updateProject(id, data); }
  projectWipReport() { return this.store.projectWipReport(); }
  createProjectBillingPlan(data: any) { return this.store.createProjectBillingPlan(data); }
  projectBillingPlans() { return this.store.projectBillingPlans(); }
  profitability() { return this.store.profitabilityView(); }
}
