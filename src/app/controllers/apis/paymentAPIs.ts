import { Payment } from '../../models/paymentModel';
import { PaymentService } from '../../services/paymentService';

export function getPaymentList() {
    return PaymentService.getPaymentList();
}

export function deletePayment(paymentId: string) {
    return PaymentService.deletePayment(String(paymentId));
}

export function updatePayment(paymentData: any) {
    return PaymentService.updatePayment(Payment.from(paymentData));
}