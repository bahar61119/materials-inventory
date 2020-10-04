import { SheetMetaDataInterface } from "../types/sheetMetadataInterface";
import { ErrorMessage } from "../constants/errorMessagesEnum";

export class DB {
    static getSheetData(metaData: SheetMetaDataInterface): Array<any> {
        const supplierDataSheet = DB.getSheet(metaData.sheetName);
        if(supplierDataSheet === null) {
            throw new Error(ErrorMessage.sheetNotFound(metaData.sheetName))
        }
        const suppliersRawDataList: Array<any> = supplierDataSheet.getRange(
            metaData.startRow,
            metaData.startColumn,
            supplierDataSheet.getLastRow()-metaData.startRow,
            metaData.totalColumn
        ).getValues();
        return suppliersRawDataList;
    }

    static getSheet(sheetName: string) {
        return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    }
}