export class Invoice implements InvoiceInterface {
    invoiceId: string;
    invoiceName: string;
    invoiceReferenceNumber: string;
    invoiceSupplier: string;
    invoiceAmount: number;
    invoiceIssueDate: string;
    invoiceReceivedDate: string;
    invoiceDescription: string;
    invoiceFile: string;
    latestUpdateByUser: string;
    latestUpdateTime: string;

    constructor() {
        this.invoiceId = '';
        this.invoiceName = '';
        this.invoiceReferenceNumber = '';
        this.invoiceSupplier = '';
        this.invoiceAmount = 0;
        this.invoiceIssueDate = '';
        this.invoiceReceivedDate = '';
        this.invoiceDescription = '';
        this.invoiceFile = '';
        this.latestUpdateByUser = '';
        this.latestUpdateTime = '';
    }

    static of(): Invoice {
        return new Invoice();
    }

    static from(invoiceData: object) {
        return Object.assign(new Invoice, invoiceData);
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