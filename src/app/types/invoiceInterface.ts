interface InvoiceInterface extends EntityInterface {
    invoiceId: string;
    invoiceName: string;
    invoiceReferenceNumber: string;
    invoiceSupplierId: string;
    invoiceTotalAmount: number;
    invoiceIssueDate: string;
    invoiceReceivedDate: string;
    invoiceRemark: string;
    invoiceFile: string;
}