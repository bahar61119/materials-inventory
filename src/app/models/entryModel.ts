export class Entry implements EntryInterface {
    entryId: string;
    entryItem: string;
    entryInvoice: string;
    entrySupplier: string;
    entryUnitPrice: number;
    entryQuantity: number;
    entryAmount: number;
    entryStatus: string;
    entryExpectedDeliveryDate: string;
    entryDeliveryDate: string;
    entryDescription: string;
    latestUpdateByUser: string;
    latestUpdateTime: string;

    constructor() {
        this.entryId = '';
        this.entryItem = '';
        this.entryInvoice = '';
        this.entrySupplier = '';
        this.entryUnitPrice = 0;
        this.entryQuantity = 0;
        this.entryAmount = 0;
        this.entryStatus = '';
        this.entryExpectedDeliveryDate = '';
        this.entryDeliveryDate = '';
        this.entryDescription = '';
        this.latestUpdateByUser = '';
        this.latestUpdateTime = '';
    }

    public static of(): Entry {
        return new Entry();
    }

    public static from(entryData: object) {
        return Object.assign(new Entry, entryData)
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