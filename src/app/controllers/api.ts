import {
    SupplierService
  } from "../services/supplierService";
  
export function getSupplierList() {
    return SupplierService.getSupplierList();
}