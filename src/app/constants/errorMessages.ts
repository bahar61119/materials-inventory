export class ErrorMessage {
    static get internalError(): Readonly<string> {
        return "Internal Error. Please contact with administrator";
    }
}

export class SheetErrorMessage extends ErrorMessage {
    static get sheetNotFound() {
        return (sheetName: string) => `Error: Sheet(${sheetName}) not found`;
    }
}

export class SupplierErrorMessage extends ErrorMessage {
    static get supplierIdNotFound() {
        return (supplierId: string) => `Error: Supplier id(${supplierId}) not found`;
    }

    static get supplierDeleteError() {
        return (supplierId: string) => `Error: Deleting supplier with id(${supplierId}) failed`;
    }
}