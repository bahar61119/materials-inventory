/*
Do not change the fields order
*/
export class Supplier implements SupplierInterface {
    supplierId: string | undefined;
    supplierName: string;
    supplierType: string;
    supplierCompany: string;
    supplierDesignation: string;
    supplierContactNumber: string;
    supplierEmail: string;
    supplierAddress: string;
    latestUpdateByUser: string;
    latestUpdateTime: string;

    constructor() {
        this.supplierId = undefined;
        this.supplierName = '';
        this.supplierType = '';
        this.supplierCompany = '';
        this.supplierDesignation = '';
        this.supplierContactNumber = '';
        this.supplierEmail = '';
        this.supplierAddress = '';
        this.latestUpdateByUser = '';
        this.latestUpdateTime = '';
    }

    static of(): Supplier {
        return new Supplier();
    }

    static from(supplierData: any): Supplier {
        return Object.assign(new Supplier, supplierData);
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
    withLatestUpdateByUser(latestUpdateByUser: string) {
        this.latestUpdateByUser = latestUpdateByUser;
        return this;
    }
    withLatestUpdateTime(latestUpdateTime: string) {
        this.latestUpdateTime = latestUpdateTime;
        return this;
    }

}