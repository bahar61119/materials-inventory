import { SheetConstants } from '../constants/sheetConstants';
import { SheetDB } from '../db/sheetDB';
import { Item } from '../models/itemModel';
import { Supplier } from '../models/supplierModel';
import { SheetMetadata } from '../utils/sheetMetadata';

export class ApplicationDBService {
    static prepareDatabase() {
        ApplicationDBService.prepareSpreadsheet();
        ApplicationDBService.prepareSuppliersSheet();
        ApplicationDBService.prepareItemsSheet();
    }

    static prepareSpreadsheet() {
        if(!SheetDB.doesSpreadsheetExist()) {
            console.log('Spreadsheet not found, creating new spreadsheet');
            const spreadSheet = SheetDB.createSpreadsheet(SheetConstants.SPREADSHEET_NAME);
            SheetDB.saveSpreadsheetId(spreadSheet.getId());
            SheetDB.getSpreadsheetId();
        }
    }

    static prepareSuppliersSheet() {
        ApplicationDBService.prepareSheet(SheetConstants.SUPPLIER_SHEET_NAME, Supplier.of());
    }

    static prepareItemsSheet() {
        ApplicationDBService.prepareSheet(SheetConstants.ITEMS_SHEET_NAME, Item.of());
    }

    private static prepareSheet(sheetName: string, modelObject: any) {
        if(!SheetDB.doesSheetExist(sheetName)) {
            console.log(`${sheetName} Sheet not found, creating new sheet`);
            SheetDB.addSheet(sheetName);
            let headers: Array<string> = Object.keys(modelObject);
            let metadata = SheetMetadata.of(sheetName)
                .withStartRow(1)
                .withTotalRow(1)
                .withStartColumn(1)
                .withTotalColumn(headers.length)
            SheetDB.updateRow(metadata, [headers]);
        }
    }
}