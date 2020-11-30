import { DBKeys } from '../../constants/dbKeys';
import { ViewFileNames } from '../../constants/fileNames';
import { SheetConstants } from '../../constants/sheetConstants';
import { Entry } from '../../models/entryModel';
import { Invoice } from '../../models/invoiceModel';
import { Item } from '../../models/itemModel';
import { Supplier } from '../../models/supplierModel';
import { EntryService } from '../../services/entryService';
import { InvoiceService } from '../../services/invoiceService';
import { ItemsService } from '../../services/itemsService';
import { ProfileService } from '../../services/profileService';
import { SettingsService } from '../../services/settingsService';
import { SupplierService } from '../../services/supplierService';
import { loadView } from './loadView';

export function loadEntryListView() {
    ProfileService.validateProfile();
    let suppliers: Array<Supplier> = SupplierService.getEntityList(SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
    let invoices: Array<Invoice> = InvoiceService.getEntityList(SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
    let items: Array<Item> = ItemsService.getEntityList(SheetConstants.ITEMS_SHEET_NAME, Item.name);
    let productStatusList = SettingsService.getList(DBKeys.PRODUCT_STATUS);
    let data = {
        suppliers,
        invoices,
        items,
        productStatusList
    }
    return loadView(ViewFileNames.ENTRY_LIST, data);
}

export function loadAddEntryView() {
    ProfileService.validateProfile();
    let invoices: Array<Invoice> = InvoiceService.getEntityList(SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
    let suppliers: Array<Supplier> = SupplierService.getEntityList(SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
    let items: Array<Item> = ItemsService.getEntityList(SheetConstants.ITEMS_SHEET_NAME, Item.name);
    let productStatuses = SettingsService.getList(DBKeys.PRODUCT_STATUS);
    let data = {
        entry: Entry.of(),
        isEdit: false,
        invoices,
        suppliers,
        items,
        productStatuses
    }
    return loadView(ViewFileNames.UPDATE_ENTRY, data);
}
  
export function loadEditEntryView(entryId: string) {
    ProfileService.validateProfile();
    let entry = EntryService.getEntry(String(entryId));
    let invoices: Array<Invoice> = InvoiceService.getEntityList(SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
    let suppliers: Array<Supplier> = SupplierService.getEntityList(SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
    let items: Array<Item> = ItemsService.getEntityList(SheetConstants.ITEMS_SHEET_NAME, Item.name);
    let productStatuses = SettingsService.getList(DBKeys.PRODUCT_STATUS);
    let data = {
        entry,
        isEdit: true,
        invoices,
        suppliers,
        items,
        productStatuses
    }
    return loadView(ViewFileNames.UPDATE_ENTRY, data);
}