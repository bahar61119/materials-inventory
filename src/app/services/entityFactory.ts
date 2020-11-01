import { ErrorMessage } from '../constants/errorMessages';
import { Entity } from '../models/entityModel';
import { Item } from '../models/itemModel';
import { Supplier } from '../models/supplierModel';

export class EntityFactory {
    public static getEntity(entityName: string): Entity {
        switch(entityName) {
            case Item.name:
                return Item.of();
            case Supplier.name:
                return Supplier.of();
            default:
                console.error("Entity class not found");
                throw new Error(ErrorMessage.internalError);
        }
    }
}