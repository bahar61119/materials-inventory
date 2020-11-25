import { FolderNames } from '../constants/driveConstants';
import { SheetConstants } from '../constants/sheetConstants';
import { Drive } from '../db/drive';
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
            let invoiceFileName = "";
            if (invoice.invoiceFile) {
                let file = DriveApp.getFileById(invoice.invoiceFile);
                invoiceFileName = file.getName();
            }
            return {
                ...invoice,
                invoiceSupplierName: supplier? supplier.supplierName: '',
                invoiceFileName
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
        let currentInvoiceFile = "";
        if (invoice.invoiceId) {
            let currentInvoice: Invoice = InvoiceService.getEntity(invoice.invoiceId, SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
            currentInvoiceFile = currentInvoice.invoiceFile;
        }

        if( !currentInvoiceFile && invoice.invoiceFile) {
            let fileId = Drive.copyAndRemove(invoice.invoiceFile, FolderNames.INVOICES);
            invoice.invoiceFile = fileId;
        } else if(currentInvoiceFile && !invoice.invoiceFile) {
            Drive.removeFile(currentInvoiceFile);
            invoice.invoiceFile = "";
        } else if(currentInvoiceFile !== invoice.invoiceFile) {
            let fileId = Drive.copyAndRemove(invoice.invoiceFile, FolderNames.INVOICES);
            invoice.invoiceFile = fileId;
            Drive.removeFile(currentInvoiceFile);
        }

        return InvoiceService.updateEntity(invoice, "invoiceId", SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
    }

    static deleteInvoice(invoiceId: string): string {
        let currentInvoice: Invoice = InvoiceService.getEntity(invoiceId, SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
        InvoiceService.deleteEntity(invoiceId, SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
        if(currentInvoice.invoiceFile) {
            Drive.removeFile(currentInvoice.invoiceFile);
        }
        return invoiceId
    }
}