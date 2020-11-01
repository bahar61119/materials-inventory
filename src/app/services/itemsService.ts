import { SheetConstants } from '../constants/sheetConstants';
import { Item } from '../models/itemModel';
import { BaseService } from './BaseService';

export class ItemsService extends BaseService {
  static getItemList(): Array<Item> {
    return ItemsService.getEntityList(SheetConstants.ITEMS_SHEET_NAME, Item.name);
  }

  static getItem(itemId: string): Item {
    return ItemsService.getEntity(itemId, SheetConstants.ITEMS_SHEET_NAME, Item.name);
  }

  static deleteItem(itemId: string): string {
    return ItemsService.deleteEntity(itemId, SheetConstants.ITEMS_SHEET_NAME, Item.name);
  }

  static updateItem(item: Item): string {
    return ItemsService.updateEntity(item, "itemId", SheetConstants.ITEMS_SHEET_NAME, Item.name);
  }
}