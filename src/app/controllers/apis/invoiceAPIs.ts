import { Invoice } from '../../models/invoiceModel';
import { InvoiceService } from '../../services/invoiceService';


export function getInvoiceList() {
    return InvoiceService.getInvoiceList();
}

export function deleteInvoice(invoiceId: string) {
    return InvoiceService.deleteInvoice(String(invoiceId));
}

export function updateInvoice(invoiceData: any) {
    return InvoiceService.updateInvoice(Invoice.from(invoiceData));
}