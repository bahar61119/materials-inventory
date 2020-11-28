import { Supplier } from "../models/supplierModel";
import { SheetConstants } from '../constants/sheetConstants';
import { EntityService } from './entityService';
import { Invoice } from '../models/invoiceModel';
import { Payment } from '../models/paymentModel';

export class SupplierService extends EntityService {
    static getSupplierList() {
        let invoiceList: Array<Invoice> = SupplierService.getEntityList(SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
        let paymentList: Array<Payment> = SupplierService.getEntityList(SheetConstants.PAYMENTS_SHEET_NAME, Payment.name);
        let supplierList: Array<Supplier> = SupplierService.getEntityList(SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
        return SupplierService.getSupplierWithInvoicesData(supplierList, invoiceList, paymentList);
    }

    static getSupplierWithInvoicesData(supplierList: Array<Supplier>, invoiceList: Array<Invoice>,  paymentList: Array<Payment>) {
        return supplierList.map((supplier: Supplier) => {
            let supplierBill = SupplierService.getSupplierTotalBill(supplier.supplierId, invoiceList);
            let supplierPaidPayment = SupplierService.getSupplierTotalPayment(supplier.supplierId, paymentList);
            let balance = supplierBill.totalAmount - supplierPaidPayment.totalPaidAmount;
            let payable = 0;
            let receivable = 0;
            if (balance > 0) {
                payable = Math.abs(balance);
            } else {
                receivable = Math.abs(balance);
            }
            return {
                ...supplier,
                supplierTotalInvoices: supplierBill.totalInvoices,
                supplierTotalInvoicesAmount: supplierBill.totalAmount,
                supplierTotalPaidPayments: supplierPaidPayment.totalPaidPayments,
                supplierTotalPaidAmount: supplierPaidPayment.totalPaidAmount,
                supplierPayable: payable,
                supplierReceivable: receivable
            }
        });
    }

    static getSupplier(supplierId: string): Supplier {
        return this.getEntity(supplierId, SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
    }

    static updateSupplier(supplier: Supplier): string {
        return this.updateEntity(supplier, "supplierId", SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
    }

    static deleteSupplier(supplierId: string): string {
        return this.deleteEntity(supplierId, SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
    }

    static getSupplierTotalBill(supplierId: string, invoiceList: Array<Invoice>) {
        let totalInvoices = 0;
        let totalAmount = 0.0;
        invoiceList.forEach(invoice => {
            if (invoice.invoiceSupplier === supplierId) {
                totalInvoices++;
                totalAmount = totalAmount + invoice.invoiceAmount;
            }
        });
        return {
            totalInvoices,
            totalAmount
        }
    }

    static getSupplierTotalPayment(supplierId: string, paymentList: Array<Payment>) {
        let totalPaidPayments = 0;
        let totalPaidAmount = 0.0;
        paymentList.forEach(payment => {
            if (payment.paymentSupplier === supplierId && payment.paymentStatus === DefaultValues.PaymentStatus.PAID) {
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