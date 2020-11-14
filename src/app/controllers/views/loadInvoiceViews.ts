import { ApplicationDBKeys } from '../../constants/applicationDBKeys';
import { ViewFileNames } from '../../constants/fileNames';
import { Invoice } from '../../models/invoiceModel';
import { InvoiceService } from '../../services/invoiceService';
import { ProfileService } from '../../services/profileService';
import { SettingsService } from '../../services/settingsService';
import { SupplierService } from '../../services/supplierService';
import { loadView } from './loadView';

function loadInvoiceListView() {
    ProfileService.validateProfile();
    return loadView(ViewFileNames.INVOICE_LIST);
}

function loadAddInvoiceView() {
    ProfileService.validateProfile();
    let suppliers = SupplierService.getSupplierList();
    let currencies = SettingsService.getList(ApplicationDBKeys.CURRENCIES);
    let data = {
        invoice: Invoice.of(),
        suppliers,
        currencies,
        isEdit: false
    }
    return loadView(ViewFileNames.UPDATE_INVOICE, data);
}
  
function loadEditInvoiceView(invoiceId: string) {
    ProfileService.validateProfile();
    let invoice = InvoiceService.getInvoice(String(invoiceId));
    let suppliers = SupplierService.getSupplierList();
    let currencies = SettingsService.getList(ApplicationDBKeys.CURRENCIES);
    let data = {
        invoice,
        suppliers,
        currencies,
        isEdit: true
    }
    return loadView(ViewFileNames.UPDATE_INVOICE, data);
}

export {
    loadInvoiceListView,
    loadAddInvoiceView,
    loadEditInvoiceView
}