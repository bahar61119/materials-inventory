import { ViewFileNames } from '../../constants/fileNames';
import { Invoice } from '../../models/invoiceModel';
import { InvoiceService } from '../../services/invoiceService';
import { ProfileService } from '../../services/profileService';
import { loadView } from './loadView';

function loadInvoiceListView() {
    ProfileService.validateProfile();
    return loadView(ViewFileNames.INVOICE_LIST);
}

function loadAddInvoiceView() {
    ProfileService.validateProfile();
    let data = {
        invoice: Invoice.of(),
        isEdit: false
    }
    return loadView(ViewFileNames.UPDATE_INVOICE, data);
}
  
function loadEditInvoiceView(invoiceId: string) {
    ProfileService.validateProfile();
    let invoice = InvoiceService.getInvoice(String(invoiceId));
    let data = {
        invoice,
        isEdit: true
    }
    return loadView(ViewFileNames.UPDATE_INVOICE, data);
}

export {
    loadInvoiceListView,
    loadAddInvoiceView,
    loadEditInvoiceView
}