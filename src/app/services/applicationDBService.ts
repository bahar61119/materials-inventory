import { SheetConstants } from '../constants/sheetConstants';
import { SheetDB } from '../db/sheetDB';
import { Supplier } from '../models/supplierModel';
import { SheetMetadata } from '../utils/sheetMetadata';

export class ApplicationDBService {
    static prepareDatabase() {
        ApplicationDBService.prepareSpreadsheet();
        ApplicationDBService.prepareSuppliersSheet();
    }

    static prepareSpreadsheet() {
        if(!SheetDB.doesSpreadsheetExist()) {
            console.log('Spreadsheet not found, creating new spreadsheet');
            const spreadSheet = SheetDB.createSpreadsheet(SheetConstants.SPREADSHEET_NAME);
            SheetDB.saveSpreadsheetId(spreadSheet.getId());
            SheetDB.getSpreadsheetId();
        } else {
            console.log('Spreadsheet found');
            console.log(SheetDB.getSpreadsheet().getId());
        }
    }

    static prepareSuppliersSheet() {
        if(!SheetDB.doesSheetExist(SheetConstants.SUPPLIER_SHEET_NAME)) {
            console.log('Suppliers Sheet not found, creating new sheet');
            SheetDB.addSheet(SheetConstants.SUPPLIER_SHEET_NAME);
            let headers: Array<string> = Object.keys(Supplier.of());
            let sheetMetadata = SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME)
                .withStartRow(1)
                .withTotalRow(1)
                .withStartColumn(1)
                .withTotalColumn(headers.length)
            SheetDB.updateRow(sheetMetadata, [headers]);
        }
    }
}