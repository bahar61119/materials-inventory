import { ApplicationDBKeys } from '../../constants/applicationDBKeys';
import { ViewFileNames } from '../../constants/fileNames';
import { Entry } from '../../models/entryModel';
import { EntryService } from '../../services/entryService';
import { InvoiceService } from '../../services/invoiceService';
import { ItemsService } from '../../services/itemsService';
import { ProfileService } from '../../services/profileService';
import { SettingsService } from '../../services/settingsService';
import { SupplierService } from '../../services/supplierService';
import { loadView } from './loadView';

export function loadEntryListView() {
    ProfileService.validateProfile();
    let suppliers = SupplierService.getSupplierList();
    let invoices = InvoiceService.getInvoiceList();
    let items = ItemsService.getItemList();
    let productStatusList = SettingsService.getList(ApplicationDBKeys.PRODUCT_STATUS);
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
    let data = {
        entry: Entry.of(),
        isEdit: false
    }
    return loadView(ViewFileNames.UPDATE_ENTRY, data);
}
  
export function loadEditEntryView(entryId: string) {
    ProfileService.validateProfile();
    let entry = EntryService.getEntry(String(entryId));
    let data = {
        entry,
        isEdit: true
    }
    return loadView(ViewFileNames.UPDATE_ENTRY, data);
}