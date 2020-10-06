import { ViewFileNames } from "../constants/fileNames";
import { SupplierService } from '../services/supplierService';

function loadAppView_(contentHtmlFile: string, data: any = "") {
  const htmlService = HtmlService.createTemplateFromFile(contentHtmlFile);
  htmlService.data = data;
  return htmlService.evaluate().getContent();
}

function loadSupplierListView() {
  return loadAppView_(ViewFileNames.SUPPLIER_LIST);
}

function loadAddSupplierView() {
  return loadAppView_(ViewFileNames.ADD_SUPPLIER);
}

function loadEditSupplierView(supplierId: string) {
  let data = SupplierService.getSupplier(supplierId);
  return loadAppView_(ViewFileNames.EDIT_SUPPLIER, data);
}

export {
  loadSupplierListView, 
  loadAddSupplierView, 
  loadEditSupplierView
}
