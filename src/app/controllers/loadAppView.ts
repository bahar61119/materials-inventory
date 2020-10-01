import { ViewFileNames } from "../enums/fileNamesEnum";

function loadAppView_(contentHtmlFile: string) {
  const htmlService = HtmlService.createTemplateFromFile(contentHtmlFile);
  return htmlService.evaluate().getContent();
}

function loadSupplierListView() {
  return loadAppView_(ViewFileNames.SUPPLIER_LIST);
}

function loadAddSupplierView() {
  return loadAppView_(ViewFileNames.ADD_SUPPLIER);
}

function loadEditSupplierView() {
  return loadAppView_(ViewFileNames.EDIT_SUPPLIER);
}

export {
  loadSupplierListView, 
  loadAddSupplierView, 
  loadEditSupplierView
}
