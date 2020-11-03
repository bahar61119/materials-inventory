import { SheetConstants } from '../constants/sheetConstants';
import { Invoice } from '../models/invoiceModel';
import { EntityService } from './entityService';

export class InvoiceService extends EntityService{
    private static DATE_FORMAT = "yyyy-MM-dd";
    static getInvoiceList() {
        let invoiceList: Array<Invoice> = InvoiceService.getEntityList(SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
        return invoiceList.map((invoice: Invoice) => {
            invoice.withInvoiceIssueDate(InvoiceService.convertDateString(invoice.invoiceIssueDate, InvoiceService.DATE_FORMAT));
            invoice.withInvoiceReceivedDate(InvoiceService.convertDateString(invoice.invoiceReceivedDate, InvoiceService.DATE_FORMAT));
            return invoice;
        });
    }

    static getInvoice(invoiceId: string): Invoice {
        let invoice: Invoice = InvoiceService.getEntity(invoiceId, SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
        invoice.withInvoiceIssueDate(InvoiceService.convertDateString(invoice.invoiceIssueDate, InvoiceService.DATE_FORMAT));
        invoice.withInvoiceReceivedDate(InvoiceService.convertDateString(invoice.invoiceReceivedDate, InvoiceService.DATE_FORMAT));
        return invoice;
    }

    static updateInvoice(invoice: Invoice): string {
        return InvoiceService.updateEntity(invoice, "invoiceId", SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
    }

    static deleteInvoice(itemId: string): string {
        return InvoiceService.deleteEntity(itemId, SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
    }
}