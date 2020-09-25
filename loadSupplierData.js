function getSupplierDataForSearch() {
  const supplierDataSheetInfo = getSupplierDataSheetInfo();
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const supplierDataSheet = spreadSheet.getSheetByName(supplierDataSheetInfo.sheetName);
  return supplierDataSheet.getRange(
    supplierDataSheetInfo.startRow,
    supplierDataSheetInfo.startColumn,
    supplierDataSheet.getLastRow()-supplierDataSheetInfo.startRow,
    supplierDataSheetInfo.totalColumn
  ).getValues();
}
