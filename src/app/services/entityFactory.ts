import { ErrorMessage } from '../constants/errorMessages';
import { Entity } from '../models/entityModel';
import { Entry } from '../models/entryModel';
import { Invoice } from '../models/invoiceModel';
import { Item } from '../models/itemModel';
import { Payment } from '../models/paymentModel';
import { Supplier } from '../models/supplierModel';

export class EntityFactory {
    public static getEntity(entityName: string): Entity {
        switch(entityName) {
            case Item.name:
                return Item.of();
            case Supplier.name:
                return Supplier.of();
            case Invoice.name:
                return Invoice.of();
            case Entry.name:
                return Entry.of();
            case Payment.name:
                return Payment.of();
            default:
                console.error("Entity class not found");
                throw new Error(ErrorMessage.internalError);
        }
    }
}