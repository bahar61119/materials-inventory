import { SheetMetadata } from "../utils/sheetMetadata";
import { Supplier } from "../models/supplierModel";
import { SheetName } from "../constants/sheetNames";
import { SupplierErrorMessage } from '../constants/errorMessages';
import { DB } from '../db/db';
import { SupplierError } from '../errors/supplierError';

class SupplierService {
  static getSupplierList(): Array<Supplier> {
    let sheetMetaData = SheetMetadata.of(SheetName.SUPPLIER).withTotalColumn(8);
    const suppliersRawDataList = SupplierService.getSupplierRawDataList(sheetMetaData);
    let supplierList = new Array<Supplier>();
    suppliersRawDataList.forEach(supplierRawData => {
      supplierList.push(SupplierService.getSupplier(supplierRawData));
    })
    return supplierList;
  }

  static getSupplier(suppliersRawData: Array<any>): Supplier {
    let supplier = new Supplier();
    let supplierKeys = Object.keys(supplier);
    supplierKeys.forEach( (key: any, index: number) => {
      supplier[key] = String(suppliersRawData[index]);
    });
    return supplier;
  }

  static deleteSupplier(deleteSupplierId: string): string {
    deleteSupplierId = deleteSupplierId.toLowerCase();
    let condition = (supplierId: string) => supplierId === deleteSupplierId;
    let index = SupplierService.getSupplierRawDataList(SheetMetadata.of(SheetName.SUPPLIER))
      .flatMap(supplierId => supplierId)
      .map(supplierId => String(supplierId).toLowerCase())
      .findIndex(condition);
    
    if(index === -1) {
      throw new SupplierError(SupplierErrorMessage.supplierIdNotFound(deleteSupplierId));
    }

    try {
      DB.deleteRow(
        SheetMetadata.of(SheetName.SUPPLIER).withStartRow(index+2)
      );
    } catch(error) {
      console.error(error);
      throw new SupplierError(SupplierErrorMessage.supplierDeleteError(deleteSupplierId));
    }
    return deleteSupplierId;
  }

  private static getSupplierRawDataList(sheetMetaData: SheetMetadata): Array<any> {
    try {
      return DB.getSheetData(sheetMetaData);
    } catch(error) {
      console.error(error);
      throw new SupplierError(SupplierErrorMessage.internalError);
    }
  }
}

export {
  SupplierService
}