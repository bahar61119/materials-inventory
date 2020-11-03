export class Invoice implements InvoiceInterface {
    invoiceId: string;
    invoiceName: string;
    invoiceReferenceNumber: string;
    invoiceSupplierId: string;
    invoiceTotalAmount: number;
    invoiceIssueDate: string;
    invoiceReceivedDate: string;
    invoiceRemark: string;
    invoiceFile: string;
    latestUpdateByUser: string;
    latestUpdateTime: string;

    constructor() {
        this.invoiceId = '';
        this.invoiceName = '';
        this.invoiceReferenceNumber = '';
        this.invoiceSupplierId = '';
        this.invoiceTotalAmount = 0;
        this.invoiceIssueDate = '';
        this.invoiceReceivedDate = '';
        this.invoiceRemark = '';
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

    withInvoiceTotalAmount(invoiceTotalAmount: number) {
        this.invoiceTotalAmount = invoiceTotalAmount;
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

    withInvoiceRemark(invoiceRemark: string) {
        this.invoiceRemark = invoiceRemark;
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