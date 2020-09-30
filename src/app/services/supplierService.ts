import {
  getSupplierDataSheetInfo
} from "../utils/supplierSheetInfo";

import { Supplier } from "../models/supplierModel";

class SupplierService {
  static getSupplierList() {
    const supplierDataSheetInfo = getSupplierDataSheetInfo();
    const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    const supplierDataSheet = spreadSheet.getSheetByName(supplierDataSheetInfo.sheetName);
    const suppliersRawDataList: Array<any> = supplierDataSheet === null? []: supplierDataSheet.getRange(
      supplierDataSheetInfo.startRow,
      supplierDataSheetInfo.startColumn,
      supplierDataSheet.getLastRow()-supplierDataSheetInfo.startRow,
      supplierDataSheetInfo.totalColumn
    ).getValues();
    SupplierService.getSupplier([]);
    return suppliersRawDataList;

  }

  static getSupplier(suppliersRawData: Array<any>) {
    let supplier = new Supplier();
    let supplierKeys = Object.keys(supplier);
    suppliersRawData.forEach( (element: any, index) => {
      supplier[supplierKeys[index]] = String(element);
    });
    return supplier;
  }
}

export {
  SupplierService
}