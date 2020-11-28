import { SheetConstants } from '../constants/sheetConstants';
import { Entry } from '../models/entryModel';
import { HomeFilter } from '../models/homeFilterModel';
import { Invoice } from '../models/invoiceModel';
import { Payment } from '../models/paymentModel';
import { Supplier } from '../models/supplierModel';
import { EntryService } from './entryService';
import { InvoiceService } from './invoiceService';
import { PaymentService } from './paymentService';
import { SupplierService } from './supplierService';

export class HomeService {
    static getDashboard(filter: HomeFilter) {
        console.log(filter);
        let invoiceList: Array<Invoice> = HomeService.getFilteredInvoiceList(filter);
        console.log("invoiceList: " + invoiceList.length);
        let paymentList: Array<Payment> = HomeService.getFilteredPaymentList(filter);
        console.log("paymentList: " + paymentList.length);
        let entryList: Array<Entry> = HomeService.getFilteredEntryList(filter);
        console.log("entryList: " + entryList.length);
        let supplierList: Array<Supplier> = HomeService.getFilteredSupplierList(filter);
        console.log("supplierList: " + supplierList.length);
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

    private static getFilteredPaymentList(filter: HomeFilter) {
        let paymentList: Array<Payment> = PaymentService.getEntityList(SheetConstants.PAYMENTS_SHEET_NAME, Payment.name);
        if(filter.supplier && filter.supplier !== 'all') {
            paymentList = paymentList.filter(payment => payment.paymentSupplier === filter.supplier);
        }
        return paymentList;
    }

    private static getFilteredInvoiceList(filter: HomeFilter) {
        let invoiceList: Array<Invoice> = InvoiceService.getEntityList(SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
        if(filter.supplier && filter.supplier !== 'all') {
            invoiceList = invoiceList.filter(invoice => invoice.invoiceSupplier === filter.supplier);
        }
        return invoiceList;
    }

    private static getFilteredEntryList(filter: HomeFilter) {
        let entryList: Array<Entry> = EntryService.getEntityList(SheetConstants.ENTRIES_SHEET_NAME, Entry.name);
        if(filter.supplier && filter.supplier !== 'all') {
            entryList = entryList.filter(entry => entry.entrySupplier === filter.supplier);
        }
        return entryList;
    }

    private static getFilteredSupplierList(filter: HomeFilter): Array<Supplier> {
        if(filter.supplier && filter.supplier !== 'all') {
            let supplier: Supplier = SupplierService.getEntity(filter.supplier, SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
            return supplier? [supplier]: [];
        } else {
            return SupplierService.getEntityList(SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
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