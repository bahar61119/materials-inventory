function getSupplierDataSheetInfo(): SheetInfo {
  return { 
    sheetName: "Supplier Data",
    startRow: 6,
    startColumn: 2,
    totalColumn: 8
  };
}

function getSupplierColumns() {
  return [
    "supplierId",
    "supplierName",
    "supplierType",
    "supplierCompany",
    "supplierDesignation",
    "supplierContactNumber",
    "supplierEmail",
    "supplierAddress"
  ];
}

export {
  getSupplierDataSheetInfo,
  getSupplierColumns
};
