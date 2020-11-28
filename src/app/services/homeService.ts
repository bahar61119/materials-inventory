import { SheetConstants } from '../constants/sheetConstants';
import { Entry } from '../models/entryModel';
import { HomeFilter } from '../models/homeFilterModel';
import { Invoice } from '../models/invoiceModel';
import { Payment } from '../models/paymentModel';
import { Supplier } from '../models/supplierModel';
import { EntryService } from './entryService';
import { PaymentService } from './paymentService';
import { SupplierService } from './supplierService';

export class HomeService {
    static getDashboard(homeFilter: HomeFilter) {
        let invoiceList: Array<Invoice> = SupplierService.getEntityList(SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
        let paymentList: Array<Payment> = PaymentService.getEntityList(SheetConstants.PAYMENTS_SHEET_NAME, Payment.name);
        let entryList: Array<Entry> = EntryService.getEntityList(SheetConstants.ENTRIES_SHEET_NAME, Entry.name);
        let supplierList: Array<Supplier> = SupplierService.getEntityList(SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
        let supplierListWithInvoiceData = SupplierService.getSupplierWithInvoicesData(supplierList, invoiceList, paymentList);
        let amountByPaymentStatus = HomeService.getAmountByPaymentStatus(paymentList);
        let entriesByDeliveryStatus = HomeService.getEntriesByDeliveryStatus(entryList);
        let supplierSummary = HomeService.getSuppliersPaymentSummary(supplierListWithInvoiceData);
        return {
            amountByPaymentStatus,
            entriesByDeliveryStatus,
            ...supplierSummary
        }
    }

    private static getAmountByPaymentStatus(paymentList: any []) {
        let amountByStatus = {}
            paymentList.forEach(payment => {
                if (!amountByStatus[payment.paymentStatus]) {
                    amountByStatus[payment.paymentStatus] = 0;
                }
                amountByStatus[payment.paymentStatus] += payment.paymentAmount;
        });
        return amountByStatus;
    }

    private static getEntriesByDeliveryStatus(entryList: any []) {
        let entriesByStatus = {}
        entryList.forEach(entry => {
            if (!entriesByStatus[entry.entryStatus]) {
                entriesByStatus[entry.entryStatus] = 0;
            }
            entriesByStatus[entry.entryStatus] += 1;
        });
        return entriesByStatus;
    }

    private static getSuppliersPaymentSummary(supplierList: any []) {
        let totalInvoiceAmount = 0;
        let totalPaidAmount = 0;
        let totalPayable = 0;
        let totalReceivable = 0;
        supplierList.forEach(supplier => {
            totalInvoiceAmount += supplier.supplierTotalInvoicesAmount;
            totalPaidAmount += supplier.supplierTotalPaidAmount;
            totalPayable += supplier.supplierPayable
            totalReceivable += supplier.supplierReceivable
        });
        return {
            totalInvoiceAmount,
            totalPaidAmount,
            totalPayable,
            totalReceivable
        }
    }
}