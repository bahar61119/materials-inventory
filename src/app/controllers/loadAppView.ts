import { FileNames } from "../enums/fileNamesEnum";

function loadAppView_(contentHtmlFile: string) {
  const htmlService = HtmlService.createTemplateFromFile(contentHtmlFile);
  return htmlService.evaluate().getContent();
}

function loadSupplierListView() {
  return loadAppView_(FileNames.SUPPLIER_LIST);
}

function loadAddSupplierView() {
  return loadAppView_(FileNames.ADD_SUPPLIER);
}

function loadEditSupplierView() {
  return loadAppView_(FileNames.EDIT_SUPPLIER);
}

export {
  loadSupplierListView, 
  loadAddSupplierView, 
  loadEditSupplierView
}
