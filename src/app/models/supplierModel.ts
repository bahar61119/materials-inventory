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

    setSupplierId(supplierId: string) {
        this.supplierId = supplierId;
        return this;
    }
    setSupplierName(supplierName: string) {
        this.supplierName = supplierName;
        return this;
    }
    setSupplierType(supplierType: string) {
        this.supplierType = supplierType;
        return this;
    }
    setSupplierCompany(supplierCompany: string) {
        this.supplierCompany = supplierCompany;
        return this;
    }
    setSupplierDesignation(supplierDesignation: string) {
        this.supplierDesignation = supplierDesignation;
        return this;
    }
    setSupplierContactNumber(supplierContactNumber: string) {
        this.supplierContactNumber = supplierContactNumber;
        return this;
    }
    setSupplierEmail(supplierEmail: string) {
        this.supplierEmail = supplierEmail;
        return this;
    }
    setSupplierAddress(supplierAddress: string) {
        this.supplierAddress = supplierAddress;
        return this;
    }
}

export {
    Supplier
}