export class SupplierError extends Error {
    constructor(message: string) {
        super(message);
        this.name = SupplierError.name;
    }
}