export class Invoice implements InvoiceInterface {
    invoiceId: string;
    invoiceName: string;
    invoiceReferenceNumber: string;
    invoiceSupplierId: string;
    invoiceCurrency: string;
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
        this.invoiceSupplierId = '';
        this.invoiceCurrency = '';
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

    withInvoiceId(invoiceId: string) {
        this.invoiceId = invoiceId;
        return this;
    }

    withInvoiceName(invoiceName: string) {
        this.invoiceName = invoiceName;
        return this;
    }

    withInvoiceReferenceNumber(invoiceReferenceNumber: string) {
        this.invoiceReferenceNumber = invoiceReferenceNumber;
        return this;
    }

    withInvoiceSupplierId(invoiceSupplierId: string) {
        this.invoiceSupplierId = invoiceSupplierId;
        return this;
    }

    withInvoiceCurrency(invoiceCurrency: string) {
        this.invoiceCurrency = invoiceCurrency;
        return this;
    }

    withInvoiceAmount(invoiceAmount: number) {
        this.invoiceAmount = invoiceAmount;
        return this;
    }

    withInvoiceIssueDate(invoiceIssueDate: string) {
        this.invoiceIssueDate = invoiceIssueDate;
        return this;
    }

    withInvoiceReceivedDate(invoiceReceivedDate: string) {
        this.invoiceReceivedDate = invoiceReceivedDate;
        return this;
    }

    withInvoiceDescription(invoiceDescription: string) {
        this.invoiceDescription = invoiceDescription;
        return this;
    }

    withInvoiceFile(invoiceFile: string) {
        this.invoiceFile = invoiceFile;
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