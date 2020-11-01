import { Item } from '../../models/itemModel';
import { ItemsService } from '../../services/itemsService';

export function getItemList() {
    return ItemsService.getItemList();
}

export function deleteItem(itemId: string) {
    return ItemsService.deleteItem(String(itemId));
}

export function updateItem(itemData: any) {
    return ItemsService.updateItem(Item.from(itemData));
}