export class HomeFilter {
    supplier: string;
    fromDate: string;
    toDate: string;

    constructor() {
        this.supplier = '';
        this.fromDate = '';
        this.toDate = '';
    }

    static of() {
        return new HomeFilter();
    }

    static from(filterData: object) {
        return Object.assign(new HomeFilter, filterData);
    } 
}