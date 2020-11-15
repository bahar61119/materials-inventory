import { SheetConstants } from '../constants/sheetConstants';
import { Invoice } from '../models/invoiceModel';
import { Supplier } from '../models/supplierModel';
import { Utils } from '../utils/utils';
import { EntityService } from './entityService';
import { SupplierService } from './supplierService';

export class InvoiceService extends EntityService{
    private static DATE_FORMAT = "yyyy-MM-dd";
    static getInvoiceList() {
        let invoiceList: Array<Invoice> = InvoiceService.getEntityList(SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
        let supplierList: Array<Supplier> = SupplierService.getSupplierList();
        let supplierMap = Utils.arrayToObject(supplierList, "supplierId"); 
        return invoiceList.map((invoice: Invoice) => {
            invoice.invoiceIssueDate = InvoiceService.convertDateString(invoice.invoiceIssueDate, InvoiceService.DATE_FORMAT);
            invoice.invoiceReceivedDate = InvoiceService.convertDateString(invoice.invoiceReceivedDate, InvoiceService.DATE_FORMAT);
            let supplier: Supplier = supplierMap[invoice.invoiceSupplier];
            return {
                ...invoice,
                invoiceSupplierName: supplier.supplierName
            }
        });
    }

    static getInvoice(invoiceId: string) {
        let invoice: Invoice = InvoiceService.getEntity(invoiceId, SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
        invoice.invoiceIssueDate = InvoiceService.convertDateString(invoice.invoiceIssueDate, InvoiceService.DATE_FORMAT);
        invoice.invoiceReceivedDate = InvoiceService.convertDateString(invoice.invoiceReceivedDate, InvoiceService.DATE_FORMAT);
        return invoice;
    }

    static updateInvoice(invoice: Invoice): string {
        return InvoiceService.updateEntity(invoice, "invoiceId", SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
    }

    static deleteInvoice(itemId: string): string {
        return InvoiceService.deleteEntity(itemId, SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
    }
}