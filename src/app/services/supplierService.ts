import { SheetMetadata } from "../utils/sheetMetadata";
import { Supplier } from "../models/supplierModel";
import { SheetName } from "../constants/sheetNames";
import { SupplierErrorMessage } from '../constants/errorMessages';
import { DB } from '../db/db';
import { SupplierError } from '../errors/supplierError';
import { GenerateId } from '../utils/generateId';

class SupplierService {
  static readonly TOTAL_COLUMN: number = 8;

  static getSupplierList(): Array<Supplier> {
    let sheetMetaData = SheetMetadata.of(SheetName.SUPPLIER).withTotalColumn(SupplierService.TOTAL_COLUMN);
    const suppliersRawDataList = SupplierService.getSupplierRawDataList(sheetMetaData);
    let supplierList = new Array<Supplier>();
    suppliersRawDataList.forEach(supplierRawData => {
      supplierList.push(SupplierService.getSupplierFromRawData(supplierRawData));
    })
    return supplierList;
  }

  static getSupplier(supplierId: string): Supplier {
    let index = SupplierService.getSupplierIndex(supplierId);
    let sheetMetaData = SheetMetadata.of(SheetName.SUPPLIER)
                                .withStartRow(index+2)
                                .withTotalRow(1)
                                .withTotalColumn(SupplierService.TOTAL_COLUMN);
    const supplierRawData = SupplierService.getSupplierRawDataList(sheetMetaData).flatMap(data => data);
    return SupplierService.getSupplierFromRawData(supplierRawData);
  }

  static updateSupplier(supplierData: any): string {
    let supplier = Supplier.from(supplierData);
    let isEditSupplier = supplier.supplierId? true: false;
    let startRow = supplier.supplierId? SupplierService.getSupplierIndex(supplier.supplierId) + 2: 0;
    let startColumn = isEditSupplier? 2: 1;
    let totalColumn = isEditSupplier? SupplierService.TOTAL_COLUMN-1: SupplierService.TOTAL_COLUMN;
    let sheetMetaData = SheetMetadata.of(SheetName.SUPPLIER)
        .withStartRow(startRow)
        .withStartColumn(startColumn)
        .withTotalRow(1)
        .withTotalColumn(totalColumn);
    let supplierId = supplier.supplierId? supplier.supplierId: GenerateId.getUniqueId();
    supplier.withSupplierId(supplierId); 
    let data = SupplierService.getRowDataFromSupplier(supplier, !isEditSupplier);
    DB.updateRow(sheetMetaData, [data]);
    return supplierId;
  }

  static deleteSupplier(supplierId: string): string {
    let index = SupplierService.getSupplierIndex(supplierId);
    try {
      DB.deleteRow(
        SheetMetadata.of(SheetName.SUPPLIER).withStartRow(index+2)
      );
      return supplierId;
    } catch(error) {
      console.error(error);
      throw new SupplierError(SupplierErrorMessage.supplierDeleteError(supplierId));
    }
  }

  static getSupplierFromRawData(suppliersRawData: Array<any>): Supplier {
    let supplier = new Supplier();
    let supplierKeys = Object.keys(supplier);
    supplierKeys.forEach( (key: any, index: number) => {
      supplier[key] = String(suppliersRawData[index]);
    });
    return supplier;
  }

  static getRowDataFromSupplier(supplier: Supplier, withSupplierId: boolean = false): Array<any> {
    let data: Array<any> = [];
    let supplierKeys = Object.keys(supplier);
    supplierKeys.forEach( (key: any) => {
      if(!(key === "supplierId" && !withSupplierId)) {
        data.push(supplier[key]);
      }
    });
    return data;
  }

  private static getSupplierIndex(supplierId: string): number {
    supplierId = supplierId.toLowerCase();
    let condition = (id: string) => id === supplierId;
    let index = SupplierService.getSupplierRawDataList(SheetMetadata.of(SheetName.SUPPLIER))
      .flatMap(supplierId => supplierId)
      .map(supplierId => String(supplierId).toLowerCase())
      .findIndex(condition);
    
    if(index === -1) {
      throw new SupplierError(SupplierErrorMessage.supplierIdNotFound(supplierId));
    }

    return index;
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