import {
  SupplierMetadata
} from "../utils/sheetMetadata";

import { Supplier } from "../models/supplierModel";

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
    const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    const supplierDataSheet = spreadSheet.getSheetByName(SupplierMetadata.sheetName);
    const suppliersRawDataList: Array<any> = supplierDataSheet === null? []: supplierDataSheet.getRange(
      SupplierMetadata.startRow,
      SupplierMetadata.startColumn,
      supplierDataSheet.getLastRow()-SupplierMetadata.startRow,
      SupplierMetadata.totalColumn
    ).getValues();
    return suppliersRawDataList;
  }
}

export {
  SupplierService
}