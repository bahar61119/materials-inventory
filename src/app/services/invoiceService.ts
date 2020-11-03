import { SheetConstants } from '../constants/sheetConstants';
import { Invoice } from '../models/invoiceModel';
import { EntityService } from './entityService';

export class InvoiceService extends EntityService{
    static getInvoiceList() {
        return InvoiceService.getEntityList(SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
    }

    static getInvoice(invoiceId: string): Invoice {
        return InvoiceService.getEntity(invoiceId, SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
    }

    static updateInvoice(invoice: Invoice): string {
        return InvoiceService.updateEntity(invoice, "invoiceId", SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
    }

    static deleteInvoice(itemId: string): string {
        return InvoiceService.deleteEntity(itemId, SheetConstants.INVOICES_SHEET_NAME, Invoice.name);
    }
}