interface PaymentInterface extends EntityInterface {
    paymentId: string;
    paymentInvoice: string;
    paymentSupplier: string;
    paymentMethod: string;
    paymentAmount: number;
    paymentStatus: string;
    paymentDueDate: string;
    paymentDate: string;
    paymentDescription: string;
}