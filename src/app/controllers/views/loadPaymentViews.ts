import { ApplicationDBKeys } from '../../constants/applicationDBKeys';
import { ViewFileNames } from '../../constants/fileNames';
import { SheetConstants } from '../../constants/sheetConstants';
import { Invoice } from '../../models/invoiceModel';
import { Payment } from '../../models/paymentModel';
import { Supplier } from '../../models/supplierModel';
import { InvoiceService } from '../../services/invoiceService';
import { PaymentService } from '../../services/paymentService';
import { ProfileService } from '../../services/profileService';
import { SettingsService } from '../../services/settingsService';
import { SupplierService } from '../../services/supplierService';
import { loadView } from './loadView';

export function loadPaymentListView() {
    ProfileService.validateProfile();
    let invoices: Array<Invoice> = InvoiceService.getEntityList(SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
    let suppliers: Array<Supplier> = SupplierService.getEntityList(SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
    let paymentStatusList = SettingsService.getList(ApplicationDBKeys.PAYMENT_STATUS);
    let data = {
        invoices,
        suppliers,
        paymentStatusList
    }
    return loadView(ViewFileNames.PAYMENT_LIST, data);
}

export function loadAddPaymentView() {
    ProfileService.validateProfile();
    let invoices: Array<Invoice> = InvoiceService.getEntityList(SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
    let suppliers: Array<Supplier> = SupplierService.getEntityList(SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
    let paymentMethods = SettingsService.getList(ApplicationDBKeys.PAYMENT_METHODS);
    let paymentStatuses = SettingsService.getList(ApplicationDBKeys.PAYMENT_STATUS);
    let data = {
        payment: Payment.of(),
        isEdit: false,
        invoices,
        suppliers,
        paymentMethods,
        paymentStatuses
    }
    return loadView(ViewFileNames.UPDATE_PAYMENT, data);
}
  
export function loadEditPaymentView(paymentId: string) {
    ProfileService.validateProfile();
    let payment = PaymentService.getPayment(String(paymentId));
    let invoices: Array<Invoice> = SupplierService.getEntityList(SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
    let suppliers: Array<Supplier> = SupplierService.getEntityList(SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
    let paymentMethods = SettingsService.getList(ApplicationDBKeys.PAYMENT_METHODS);
    let paymentStatuses = SettingsService.getList(ApplicationDBKeys.PAYMENT_STATUS);
    let data = {
        payment,
        isEdit: true,
        invoices,
        suppliers,
        paymentMethods,
        paymentStatuses
    }
    return loadView(ViewFileNames.UPDATE_PAYMENT, data);
}