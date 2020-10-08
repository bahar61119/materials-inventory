import { Supplier } from '../models/supplierModel';
import {
    SupplierService
  } from "../services/supplierService";
  
export function getSupplierList() {
    return SupplierService.getSupplierList();
}

export function deleteSupplier(supplierId: string) {
    return SupplierService.deleteSupplier(supplierId);
}

export function updateSupplier(supplier: Supplier) {
    return SupplierService.updateSupplier(supplier);
}