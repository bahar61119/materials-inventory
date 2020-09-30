import {
    SupplierService
  } from "../services/supplierService";
  
export function getSupplierDataForSearch() {
    return SupplierService.getSupplierList();
}