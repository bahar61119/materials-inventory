import { AppConstant } from './appConstants';

export class SheetConstants {
    static get SPREADSHEET_NAME() {
        return `${AppConstant.APP_NAME}(DO NOT DELETE THIS FILE)`;
    }

    static get SUPPLIER_SHEET_NAME() {
        return `Suppliers`;
    }

    static get ITEMS_SHEET_NAME() {
        return `Items`;
    }

    static get INVOICES_SHEET_NAME() {
        return `Invoices`;
    }

    static get ENTRIES_SHEET_NAME() {
        return `Entries`;
    }
}