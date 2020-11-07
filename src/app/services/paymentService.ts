import { SheetConstants } from '../constants/sheetConstants';
import { Payment } from '../models/paymentModel';
import { EntityService } from './entityService';

export class PaymentService extends EntityService {
    private static DATE_FORMAT = "yyyy-MM-dd";
    static getPaymentList() {
        let paymentList: Array<Payment> = PaymentService.getEntityList(SheetConstants.PAYMENTS_SHEET_NAME, Payment.name);
        return paymentList.map((payment: Payment) => {
            payment.paymentDueDate = PaymentService.convertDateString(payment.paymentDueDate, PaymentService.DATE_FORMAT);
            payment.paymentDate = PaymentService.convertDateString(payment.paymentDate, PaymentService.DATE_FORMAT);
            return payment;
        });
    }

    static getPayment(paymentId: string): Payment {
        let payment: Payment = PaymentService.getEntity(paymentId, SheetConstants.PAYMENTS_SHEET_NAME, Payment.name);
        payment.paymentDueDate = PaymentService.convertDateString(payment.paymentDueDate, PaymentService.DATE_FORMAT);
        payment.paymentDate = PaymentService.convertDateString(payment.paymentDate, PaymentService.DATE_FORMAT);
        return payment;
    }

    static updatePayment(payment: Payment): string {
        return PaymentService.updateEntity(payment, "paymentId", SheetConstants.PAYMENTS_SHEET_NAME, Payment.name);
    }

    static deletePayment(paymentId: string): string {
        return PaymentService.deleteEntity(paymentId, SheetConstants.PAYMENTS_SHEET_NAME, Payment.name);
    }
}