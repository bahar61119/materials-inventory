import { SheetMetaDataInterface } from "../types/sheetMetadataInterface";
import { SheetErrorMessage } from "../constants/errorMessages";
import { DBError } from '../errors/dbError';
import { DB } from './db';
import { ApplicationDBKeys } from '../constants/applicationDBKeys';

export class SheetDB {
    static createSpreadsheet(name: string): GoogleAppsScript.Spreadsheet.Spreadsheet {
        return SpreadsheetApp.create(name);
    }

    static getSpreadsheet() : GoogleAppsScript.Spreadsheet.Spreadsheet {
        const id = SheetDB.getSpreadsheetId();
        const spreadsheet = SpreadsheetApp.openById(id);
        if(spreadsheet === null) {
            throw new DBError(SheetErrorMessage.spreadSheetNotFound(id))
        }
        return spreadsheet;
    }

    static getFile(id: string) {
        return DriveApp.getFileById(id);
    }

    static doesSpreadsheetExist(): boolean {
        let id: string = SheetDB.getSpreadsheet().getId();
        if(!id) return false;
        let file = SheetDB.getFile(id);
        if(file.isTrashed()) return false;
        return true;
    }

    static getSpreadsheetId(): string {
        return DB.getApplicationDB().get(ApplicationDBKeys.SPREADSHEET_ID);
    }

    static deleteSpreadsheetId() {
        DB.getApplicationDB().delete(ApplicationDBKeys.SPREADSHEET_ID);
    }

    static saveSpreadsheetId(id: string) {
        DB.getApplicationDB().put(ApplicationDBKeys.SPREADSHEET_ID, id);
    }

    static addSheet(sheetName: string): GoogleAppsScript.Spreadsheet.Sheet {
        return SheetDB.getSpreadsheet().insertSheet(sheetName);
    }

    static doesSheetExist(sheetName: string): boolean {
        return SheetDB.getSpreadsheet().getSheetByName(sheetName)? true: false;
    }

    static getSheet(sheetName: string): GoogleAppsScript.Spreadsheet.Sheet {
        const supplierDataSheet = SheetDB.getSpreadsheet().getSheetByName(sheetName);
        if(supplierDataSheet === null) {
            throw new DBError(SheetErrorMessage.sheetNotFound(sheetName))
        }
        return supplierDataSheet;
    }

    private static isSheetEmpty(sheet: GoogleAppsScript.Spreadsheet.Sheet): boolean {
        let lastRow = sheet.getLastRow();
        let lastColumn = sheet.getLastColumn();
        if(lastRow === 0 || lastRow < 2 || lastColumn === 0) return true;
        return false;
    }

    static getSheetData(metaData: SheetMetaDataInterface): Array<any> {
        const supplierDataSheet = SheetDB.getSheet(metaData.sheetName);
        if(this.isSheetEmpty(supplierDataSheet)) {
            return [];
        }
        const totalRow = metaData.totalRow > 0? metaData.totalRow: supplierDataSheet.getLastRow()-metaData.startRow+1;
        const suppliersRawDataList: Array<any> = supplierDataSheet.getRange(
            metaData.startRow,
            metaData.startColumn,
            totalRow,
            metaData.totalColumn
        ).getValues();
        return suppliersRawDataList;
    }

    static updateRow(metaData: SheetMetaDataInterface, data: Array<Array<any>>): void {
        const supplierDataSheet = SheetDB.getSheet(metaData.sheetName);
        const startRow = metaData.startRow > 0? metaData.startRow: supplierDataSheet.getLastRow()+1;
        const totalRow = metaData.totalRow > 0? metaData.totalRow: supplierDataSheet.getLastRow()-metaData.startRow+1;
        supplierDataSheet.getRange(
            startRow,
            metaData.startColumn,
            totalRow,
            metaData.totalColumn
        ).setValues(data);
    }

    static deleteRow(metaData: SheetMetaDataInterface): void {
        const supplierDataSheet = SheetDB.getSheet(metaData.sheetName);
        supplierDataSheet.deleteRow(metaData.startRow);
    }
}