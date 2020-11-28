import { ErrorMessage } from '../constants/errorMessages';
import { SheetConstants } from '../constants/sheetConstants';
import { Entry } from '../models/entryModel';
import { Item } from '../models/itemModel';
import { EntityService } from './entityService';
import { EntryService } from './entryService';

export class ItemsService extends EntityService {
  static getItemList(): Array<Item> {
    return ItemsService.getEntityList(SheetConstants.ITEMS_SHEET_NAME, Item.name);
  }

  static getItem(itemId: string): Item {
    return ItemsService.getEntity(itemId, SheetConstants.ITEMS_SHEET_NAME, Item.name);
  }

  static updateItem(item: Item): string {
    return ItemsService.updateEntity(item, "itemId", SheetConstants.ITEMS_SHEET_NAME, Item.name);
  }

  static deleteItem(itemId: string): string {
    ItemsService.checkIfItemInUse(itemId);
    return ItemsService.deleteEntity(itemId, SheetConstants.ITEMS_SHEET_NAME, Item.name);
  }

  static checkIfItemInUse(itemId: string) {
    let entryList: Array<Entry> = EntryService.getEntityList(SheetConstants.ENTRIES_SHEET_NAME, Entry.name);
    entryList = entryList.filter(entry => entry.entryItem === itemId);
    if(entryList.length) {
        throw new Error(ErrorMessage.entityInUse("Item"));
    }
}
}