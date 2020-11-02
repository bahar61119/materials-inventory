import { Supplier } from "../models/supplierModel";
import { SheetConstants } from '../constants/sheetConstants';
import { EntityService } from './entityService';

export class SupplierService extends EntityService {
  static getSupplierList(): Array<Supplier> {
    return this.getEntityList(SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
  }

  static getSupplier(supplierId: string): Supplier {
    return this.getEntity(supplierId, SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
  }

  static updateSupplier(supplier: Supplier): string {
    return this.updateEntity(supplier, "supplierId", SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
  }

  static deleteSupplier(supplierId: string): string {
    return this.deleteEntity(supplierId, SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
  }
}