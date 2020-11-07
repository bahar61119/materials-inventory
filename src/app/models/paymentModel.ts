export class Payment implements PaymentInterface {
    paymentId: string;
    paymentInvoice: string;
    paymentSupplier: string;
    paymentMethod: string;
    paymentAmount: number;
    paymentStatus: string;
    paymentDueDate: string;
    paymentDate: string;
    paymentDescription: string;
    paymentFile: string;
    latestUpdateByUser: string;
    latestUpdateTime: string;

    constructor() {
        this.paymentId = '';
        this.paymentInvoice = '';
        this.paymentSupplier = '';
        this.paymentMethod = '';
        this.paymentAmount = 0;
        this.paymentStatus = '';
        this.paymentDueDate = '';
        this.paymentDate = '';
        this.paymentDescription = '';
        this.paymentFile = '';
        this.latestUpdateByUser = '';
        this.latestUpdateTime = '';
    }


    public static of(): Payment {
        return new Payment();
    }

    public static from(entryData: object) {
        return Object.assign(new Payment, entryData)
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