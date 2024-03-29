import { SheetConstants } from '../constants/sheetConstants';
import { SheetDB } from '../db/sheetDB';
import { Entry } from '../models/entryModel';
import { Invoice } from '../models/invoiceModel';
import { Item } from '../models/itemModel';
import { Payment } from '../models/paymentModel';
import { Supplier } from '../models/supplierModel';
import { SheetMetadata } from '../models/sheetMetadata';
import { FolderNames } from '../constants/driveConstants';
import { Drive } from '../db/drive';
import { SettingsService } from './settingsService';

export class ApplicationDBService {
    static prepareDatabase() {
        ApplicationDBService.prepareSpreadsheet();
        ApplicationDBService.prepareSuppliersSheet();
        ApplicationDBService.prepareItemsSheet();
        ApplicationDBService.prepareInvoicesSheet();
        ApplicationDBService.prepareEntriesSheet();
        ApplicationDBService.preparePaymentsSheet();
        ApplicationDBService.prepareFolders();
        SettingsService.addDefaultValues();
    }

    private static prepareFolders() {
        ApplicationDBService.prepareFolder(FolderNames.ROOT);
        ApplicationDBService.prepareFolder(FolderNames.INVOICES, FolderNames.ROOT);
        ApplicationDBService.prepareFolder(FolderNames.PAYMENTS, FolderNames.ROOT);
        ApplicationDBService.prepareFolder(FolderNames.TEMP, FolderNames.ROOT);
    }

    private static prepareFolder(folder: FolderNames, parentFolder: FolderNames | null = null) {
        if(!Drive.doesFolderExist(folder)) {
            let folderId = Drive.createFolder(folder, parentFolder);
            Drive.saveFolderId(folderId, folder);
        }
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

    static prepareInvoicesSheet() {
        ApplicationDBService.prepareSheet(SheetConstants.INVOICES_SHEET_NAME, Invoice.of());
    }

    static prepareEntriesSheet() {
        ApplicationDBService.prepareSheet(SheetConstants.ENTRIES_SHEET_NAME, Entry.of());
    }

    static preparePaymentsSheet() {
        ApplicationDBService.prepareSheet(SheetConstants.PAYMENTS_SHEET_NAME, Payment.of());
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