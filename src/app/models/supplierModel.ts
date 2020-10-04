class Supplier implements SupplierInterface {
    supplierId: string;
    supplierName: string;
    supplierType: string;
    supplierCompany: string;
    supplierDesignation: string;
    supplierContactNumber: string;
    supplierEmail: string;
    supplierAddress: string;

    constructor() {
        this.supplierId = '';
        this.supplierName = '';
        this.supplierType = '';
        this.supplierCompany = '';
        this.supplierDesignation = '';
        this.supplierContactNumber = '';
        this.supplierEmail = '';
        this.supplierAddress = '';
    }

    static of() {
        return new Supplier();
    }

    withSupplierId(supplierId: string) {
        this.supplierId = supplierId;
        return this;
    }
    withSupplierName(supplierName: string) {
        this.supplierName = supplierName;
        return this;
    }
    withSupplierType(supplierType: string) {
        this.supplierType = supplierType;
        return this;
    }
    withSupplierCompany(supplierCompany: string) {
        this.supplierCompany = supplierCompany;
        return this;
    }
    withSupplierDesignation(supplierDesignation: string) {
        this.supplierDesignation = supplierDesignation;
        return this;
    }
    withSupplierContactNumber(supplierContactNumber: string) {
        this.supplierContactNumber = supplierContactNumber;
        return this;
    }
    withSupplierEmail(supplierEmail: string) {
        this.supplierEmail = supplierEmail;
        return this;
    }
    withSupplierAddress(supplierAddress: string) {
        this.supplierAddress = supplierAddress;
        return this;
    }

}

export {
    Supplier
}