export class HomeFilter {
    supplier: string;

    constructor() {
        this.supplier = 'all';
    }

    static of() {
        return new HomeFilter();
    }

    static from(filterData: object) {
        return Object.assign(new HomeFilter, filterData);
    } 
}