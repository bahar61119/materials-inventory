import { SheetMetaDataInterface } from "../types/sheetMetadataInterface";
import { SheetErrorMessage } from "../constants/errorMessages";
import { DBError } from '../errors/dbError';

export class DB {
    static getSheetData(metaData: SheetMetaDataInterface): Array<any> {
        const supplierDataSheet = DB.getSheet(metaData.sheetName);
        const totalRow = metaData.totalRow > 0? metaData.totalRow: supplierDataSheet.getLastRow()-metaData.startRow+1;
        const suppliersRawDataList: Array<any> = supplierDataSheet.getRange(
            metaData.startRow,
            metaData.startColumn,
            totalRow,
            metaData.totalColumn
        ).getValues();
        return suppliersRawDataList;
    }

    static deleteRow(metaData: SheetMetaDataInterface): void {
        const supplierDataSheet = DB.getSheet(metaData.sheetName);
        supplierDataSheet.deleteRow(metaData.startRow);
    }

    static getSheet(sheetName: string): GoogleAppsScript.Spreadsheet.Sheet {
        const supplierDataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
        if(supplierDataSheet === null) {
            throw new DBError(SheetErrorMessage.sheetNotFound(sheetName))
        }
        return supplierDataSheet;
    }
}