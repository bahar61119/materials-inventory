import { SheetMetadata } from "../utils/sheetMetadata";
import { ItemsErrorMessage } from '../constants/errorMessages';
import { SheetDB } from '../db/sheetDB';
import { SheetConstants } from '../constants/sheetConstants';
import { Item } from '../models/itemModel';
import { ItemsError } from '../errors/itemsError';

export class ItemsService {

  static getItemList(): Array<Item> {
    let sheetMetaData = SheetMetadata.of(SheetConstants.ITEMS_SHEET_NAME)
                          .withTotalColumn(ItemsService.getNumberOfFields());
    const itemRawDataList = ItemsService.getItemsRawDataList(sheetMetaData);
    let itemList = new Array<Item>();
    itemRawDataList.forEach(rawData => {
      itemList.push(ItemsService.getItemFromRawData(rawData));
    })
    return itemList;
  }

  private static getItemFromRawData(rawData: Array<any>): Item {
    let item = new Item();
    let keys = Object.keys(item);
    keys.forEach( (key: any, index: number) => {
      item[key] = String(rawData[index]);
    });
    return item;
  }

  private static getItemsRawDataList(sheetMetaData: SheetMetadata): Array<any> {
    try {
      return SheetDB.getSheetData(sheetMetaData);
    } catch(error) {
      console.error(error);
      throw new ItemsError(ItemsErrorMessage.internalError);
    }
  }

  private static getNumberOfFields() {
    return Object.keys(Item.of()).length;
  }
}