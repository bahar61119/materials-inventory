/*
Do not change the fields order
*/
export class Supplier implements SupplierInterface {
    supplierId: string;
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
        this.supplierId = '';
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
    
    withLatestUpdateByUser(latestUpdateByUser: string) {
        this.latestUpdateByUser = latestUpdateByUser;
        return this;
    }
    withLatestUpdateTime(latestUpdateTime: string) {
        this.latestUpdateTime = latestUpdateTime;
        return this;
    }

}