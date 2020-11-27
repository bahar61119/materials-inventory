import { SheetConstants } from '../constants/sheetConstants';
import { Entry } from '../models/entryModel';
import { Invoice } from '../models/invoiceModel';
import { Item } from '../models/itemModel';
import { Supplier } from '../models/supplierModel';
import { Utils } from '../utils/utils';
import { EntityService } from './entityService';

export class EntryService extends EntityService {
    private static DATE_FORMAT = "yyyy-MM-dd";
    static getEntryList() {
        let entryList: Array<Entry> = EntryService.getEntityList(SheetConstants.ENTRIES_SHEET_NAME, Entry.name);
        let supplierList: Array<Supplier> = EntryService.getEntityList(SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
        let supplierMap = Utils.arrayToObject(supplierList, "supplierId");
        let invoiceList: Array<Invoice> = EntryService.getEntityList(SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
        let invoiceMap = Utils.arrayToObject(invoiceList, "invoiceId");
        let itemList: Array<Item> = EntryService.getEntityList(SheetConstants.ITEMS_SHEET_NAME, Item.name);
        let itemMap = Utils.arrayToObject(itemList, "itemId");
        return entryList.map((entry: Entry) => {
            entry.entryExpectedDeliveryDate = EntryService.convertDateString(entry.entryExpectedDeliveryDate, EntryService.DATE_FORMAT);
            entry.entryDeliveryDate = EntryService.convertDateString(entry.entryDeliveryDate, EntryService.DATE_FORMAT);
            let supplier: Supplier = supplierMap[entry.entrySupplier];
            let invoice: Invoice = invoiceMap[entry.entryInvoice];
            let item: Item = itemMap[entry.entryItem];
            return {
                ...entry,
                entrySupplierName: supplier? supplier.supplierName: '',
                entryInvoiceName: invoice? invoice.invoiceName: '',
                entryItemName: item? item.itemName: '',
                entryUnit: item? item.itemUnitOfMeasure: ''
            }
        });
    }

    static getEntry(entryId: string): Entry {
        let entry: Entry = EntryService.getEntity(entryId, SheetConstants.ENTRIES_SHEET_NAME, Entry.name);
        entry.entryExpectedDeliveryDate = EntryService.convertDateString(entry.entryExpectedDeliveryDate, EntryService.DATE_FORMAT);
        entry.entryDeliveryDate = EntryService.convertDateString(entry.entryDeliveryDate, EntryService.DATE_FORMAT);
        return entry;
    }

    static updateEntry(entry: Entry): string {
        entry.entryAmount = entry.entryUnitPrice * entry.entryQuantity;
        return EntryService.updateEntity(entry, "entryId", SheetConstants.ENTRIES_SHEET_NAME, Entry.name);
    }

    static deleteEntry(entryId: string): string {
        return EntryService.deleteEntity(entryId, SheetConstants.ENTRIES_SHEET_NAME, Entry.name);
    }
}