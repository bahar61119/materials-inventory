function loadAppView_(contentHtmlFile) {
  const htmlService = HtmlService.createTemplateFromFile(contentHtmlFile);
  return htmlService.evaluate().getContent();
}

function loadSupplierListView() {
  return loadAppView_("supplierList");
}

function loadAddSupplierView() {
  return loadAppView_("addSupplier");
}

function loadEditSupplierView() {
  return loadAppView_("editSupplier");
}
