import { ViewFileNames } from '../../constants/fileNames';
import { Invoice } from '../../models/invoiceModel';
import { InvoiceService } from '../../services/invoiceService';
import { ProfileService } from '../../services/profileService';
import { SupplierService } from '../../services/supplierService';
import { loadView } from './loadView';

function loadInvoiceListView() {
    ProfileService.validateProfile();
    let suppliers = SupplierService.getSupplierList();
    let data = {
        suppliers
    }
    return loadView(ViewFileNames.INVOICE_LIST, data);
}

function loadAddInvoiceView() {
    ProfileService.validateProfile();
    let suppliers = SupplierService.getSupplierList();
    let data = {
        invoice: Invoice.of(),
        suppliers,
        isEdit: false
    }
    return loadView(ViewFileNames.UPDATE_INVOICE, data);
}
  
function loadEditInvoiceView(invoiceId: string) {
    ProfileService.validateProfile();
    let invoice = InvoiceService.getInvoice(String(invoiceId));
    let suppliers = SupplierService.getSupplierList();
    let data = {
        invoice,
        suppliers,
        isEdit: true
    }
    return loadView(ViewFileNames.UPDATE_INVOICE, data);
}

export {
    loadInvoiceListView,
    loadAddInvoiceView,
    loadEditInvoiceView
}