import { FolderNames } from '../constants/driveConstants';
import { SheetConstants } from '../constants/sheetConstants';
import { Drive } from '../db/drive';
import { Invoice } from '../models/invoiceModel';
import { Payment } from '../models/paymentModel';
import { Supplier } from '../models/supplierModel';
import { Utils } from '../utils/utils';
import { EntityService } from './entityService';
import { InvoiceService } from './invoiceService';

export class PaymentService extends EntityService {
    private static DATE_FORMAT = "yyyy-MM-dd";
    static getPaymentList() {
        let paymentList: Array<Payment> = PaymentService.getEntityList(SheetConstants.PAYMENTS_SHEET_NAME, Payment.name);
        let supplierList: Array<Supplier> = PaymentService.getEntityList(SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
        let supplierMap = Utils.arrayToObject(supplierList, "supplierId");
        let invoiceList: Array<Invoice> = PaymentService.getEntityList(SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
        let invoiceMap = Utils.arrayToObject(invoiceList, "invoiceId");
        return paymentList.map((payment: Payment) => {
            payment.paymentDueDate = PaymentService.convertDateString(payment.paymentDueDate, PaymentService.DATE_FORMAT);
            payment.paymentDate = PaymentService.convertDateString(payment.paymentDate, PaymentService.DATE_FORMAT);
            let supplier: Supplier = supplierMap[payment.paymentSupplier];
            let invoice: Invoice = invoiceMap[payment.paymentInvoice];
            let paymentFileName = "";
            if (payment.paymentFile) {
                let file = DriveApp.getFileById(payment.paymentFile);
                paymentFileName = file.getName();
            }
            return {
                ...payment,
                paymentSupplierName: supplier? supplier.supplierName: '',
                paymentInvoiceName: invoice? invoice.invoiceName: '',
                paymentFileName
            }
        });
    }

    static getPayment(paymentId: string): Payment {
        let payment: Payment = PaymentService.getEntity(paymentId, SheetConstants.PAYMENTS_SHEET_NAME, Payment.name);
        payment.paymentDueDate = PaymentService.convertDateString(payment.paymentDueDate, PaymentService.DATE_FORMAT);
        payment.paymentDate = PaymentService.convertDateString(payment.paymentDate, PaymentService.DATE_FORMAT);
        return payment;
    }

    static updatePayment(payment: Payment): string {
        let currentPaymentFile = "";
        if (payment.paymentId) {
            let currentInvoice: Invoice = InvoiceService.getEntity(payment.paymentId, SheetConstants.PAYMENTS_SHEET_NAME, Payment.name);
            currentPaymentFile = currentInvoice.invoiceFile;
        }
        console.log("File: " + payment.paymentFile);
        if( !currentPaymentFile && payment.paymentFile) {
            let fileId = Drive.copyAndRemove(payment.paymentFile, FolderNames.PAYMENTS);
            payment.paymentFile = fileId;
        } else if(currentPaymentFile && !payment.paymentFile) {
            Drive.removeFile(currentPaymentFile);
            payment.paymentFile = "";
        } else if(currentPaymentFile && payment.paymentFile && currentPaymentFile !== payment.paymentFile) {
            let fileId = Drive.copyAndRemove(payment.paymentFile, FolderNames.PAYMENTS);
            payment.paymentFile = fileId;
            Drive.removeFile(currentPaymentFile);
        }

        return PaymentService.updateEntity(payment, "paymentId", SheetConstants.PAYMENTS_SHEET_NAME, Payment.name);
    }

    static deletePayment(paymentId: string): string {
        let currentPayment: Payment = InvoiceService.getEntity(paymentId, SheetConstants.PAYMENTS_SHEET_NAME, Payment.name);
        PaymentService.deleteEntity(paymentId, SheetConstants.PAYMENTS_SHEET_NAME, Payment.name);
        if(currentPayment.paymentFile) {
            Drive.removeFile(currentPayment.paymentFile);
        }
        return paymentId;
    }
}