import { ViewFileNames } from '../../constants/fileNames';
import { Payment } from '../../models/paymentModel';
import { PaymentService } from '../../services/paymentService';
import { ProfileService } from '../../services/profileService';
import { loadView } from './loadView';

export function loadPaymentListView() {
    ProfileService.validateProfile();
    return loadView(ViewFileNames.PAYMENT_LIST);
}

export function loadAddPaymentView() {
    ProfileService.validateProfile();
    let data = {
        payment: Payment.of(),
        isEdit: false
    }
    return loadView(ViewFileNames.UPDATE_PAYMENT, data);
}
  
export function loadEditPaymentView(paymentId: string) {
    ProfileService.validateProfile();
    let payment = PaymentService.getPayment(String(paymentId));
    let data = {
        payment,
        isEdit: true
    }
    return loadView(ViewFileNames.UPDATE_PAYMENT, data);
}