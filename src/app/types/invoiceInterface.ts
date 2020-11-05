interface InvoiceInterface extends EntityInterface {
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
}