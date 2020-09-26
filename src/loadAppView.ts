function loadAppView_(contentHtmlFile) {
  const htmlService = HtmlService.createTemplateFromFile(contentHtmlFile);
  return htmlService.evaluate().getContent();
}

function loadSupplierListView() {
  return loadAppView_("src/supplierList");
}

function loadAddSupplierView() {
  return loadAppView_("src/addSupplier");
}

function loadEditSupplierView() {
  return loadAppView_("src/editSupplier");
}
