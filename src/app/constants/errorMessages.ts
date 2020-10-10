export class ErrorMessage {
    static get internalError(): Readonly<string> {
        return "We're sorry, a server error occurred. Please wait a bit and try again.";
    }
}

export class SheetErrorMessage extends ErrorMessage {
    static get sheetNotFound() {
        return (sheetName: string) => `Sheet(${sheetName}) not found`;
    }
}

export class SupplierErrorMessage extends ErrorMessage {
    static get supplierIdNotFound() {
        return (supplierId: string) => `Supplier id(${supplierId}) not found`;
    }

    static get supplierDeleteError() {
        return (supplierId: string) => `Deleting supplier with id(${supplierId}) failed`;
    }
}