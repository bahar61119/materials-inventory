import { SheetMetadata } from "../utils/sheetMetadata";
import { Supplier } from "../models/supplierModel";
import { SheetName } from "../constants/sheetNames";
import { ErrorMessage } from '../constants/errorMessages';
import { DB } from '../db/db';

class SupplierService {
  static getSupplierList(): Array<Supplier> {
    const suppliersRawDataList = SupplierService.getSupplierRawDataList();
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

  private static getSupplierRawDataList(): Array<any> {
    try {
      let sheetMetaData = SheetMetadata.of(SheetName.SUPPLIER).withTotalColumn(8);
      return DB.getSheetData(sheetMetaData);
    } catch(error) {
      console.error(error);
      throw new Error(ErrorMessage.internalError);
    }
  }
}

export {
  SupplierService
}