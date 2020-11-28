import { FolderNames } from '../constants/driveConstants';
import { ErrorMessage } from '../constants/errorMessages';
import { SheetConstants } from '../constants/sheetConstants';
import { Drive } from '../db/drive';
import { Entry } from '../models/entryModel';
import { Invoice } from '../models/invoiceModel';
import { Payment } from '../models/paymentModel';
import { Supplier } from '../models/supplierModel';
import { Utils } from '../utils/utils';
import { EntityService } from './entityService';
import { EntryService } from './entryService';
import { PaymentService } from './paymentService';

export class InvoiceService extends EntityService{
    private static DATE_FORMAT = "yyyy-MM-dd";
    static getInvoiceList() {
        let invoiceList: Array<Invoice> = InvoiceService.getEntityList(SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
        let supplierList: Array<Supplier> = InvoiceService.getEntityList(SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
        let paymentList: Array<Payment> = InvoiceService.getEntityList(SheetConstants.PAYMENTS_SHEET_NAME, Payment.name);
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

            let invoicePaidPayment = InvoiceService.getInvoiceTotalPayment(invoice.invoiceId, paymentList);
            let balance = invoice.invoiceAmount - invoicePaidPayment.totalPaidAmount;
            let payable = 0;
            let receivable = 0;
            if (balance > 0) {
                payable = Math.abs(balance);
            } else {
                receivable = Math.abs(balance);
            }
            
            return {
                ...invoice,
                invoiceSupplierName: supplier? supplier.supplierName: '',
                invoiceFileName,
                invoiceTotalPaidPayments: invoicePaidPayment.totalPaidPayments,
                invoiceTotalPaidAmount: invoicePaidPayment.totalPaidAmount,
                invoicePayable: payable,
                invoiceReceivable: receivable
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
        } else if(currentInvoiceFile && invoice.invoiceFile && currentInvoiceFile !== invoice.invoiceFile) {
            let fileId = Drive.copyAndRemove(invoice.invoiceFile, FolderNames.INVOICES);
            invoice.invoiceFile = fileId;
            Drive.removeFile(currentInvoiceFile);
        }

        return InvoiceService.updateEntity(invoice, "invoiceId", SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
    }

    static deleteInvoice(invoiceId: string): string {
        InvoiceService.checkIfInvoiceInUse(invoiceId);
        let currentInvoice: Invoice = InvoiceService.getEntity(invoiceId, SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
        InvoiceService.deleteEntity(invoiceId, SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
        if(currentInvoice.invoiceFile) {
            Drive.removeFile(currentInvoice.invoiceFile);
        }
        return invoiceId
    }

    static checkIfInvoiceInUse(invoiceId: string) {
        let paymentList: Array<Payment> = PaymentService.getEntityList(SheetConstants.PAYMENTS_SHEET_NAME, Payment.name);
        paymentList = paymentList.filter(payment => payment.paymentInvoice === invoiceId);
        if(paymentList.length) {
            throw new Error(ErrorMessage.entityInUse("Invoice"));
        }
        let entryList: Array<Entry> = EntryService.getEntityList(SheetConstants.ENTRIES_SHEET_NAME, Entry.name);
        entryList = entryList.filter(entry => entry.entryInvoice === invoiceId);
        if(entryList.length) {
            throw new Error(ErrorMessage.entityInUse("Invoice"));
        }
    }

    private static getInvoiceTotalPayment(invoiceId: string, paymentList: Array<Payment>) {
        let totalPaidPayments = 0;
        let totalPaidAmount = 0.0;
        paymentList.forEach(payment => {
            if (payment.paymentInvoice === invoiceId && payment.paymentStatus === DefaultValues.PaymentStatus.PAID) {
                totalPaidPayments++;
                totalPaidAmount = totalPaidAmount + payment.paymentAmount;
            }
        });
        return {
            totalPaidPayments,
            totalPaidAmount
        }
    }
}