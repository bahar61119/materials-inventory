import { ViewFileNames } from "../constants/fileNames";
import { Supplier } from '../models/supplierModel';
import { SupplierService } from '../services/supplierService';

function loadAppView_(contentHtmlFile: string, data: any = "") {
  const htmlService = HtmlService.createTemplateFromFile(contentHtmlFile);
  htmlService.data = data;
  return htmlService.evaluate().getContent();
}

function loadHomeView() {
  return loadAppView_(ViewFileNames.HOME);
}

function loadSupplierListView() {
  return loadAppView_(ViewFileNames.SUPPLIER_LIST);
}

function loadAddSupplierView() {
  let data = {
    supplier: Supplier.of(),
    isEdit: false
  }
  return loadAppView_(ViewFileNames.UPDATE_SUPPLIER, data);
}

function loadEditSupplierView(supplierId: string) {
  let supplier = SupplierService.getSupplier(supplierId);
  let data = {
    supplier,
    isEdit: true
  }
  return loadAppView_(ViewFileNames.UPDATE_SUPPLIER, data);
}

export {
  loadHomeView,
  loadSupplierListView, 
  loadAddSupplierView, 
  loadEditSupplierView
}
