import { SheetMetadata } from "../utils/sheetMetadata";
import { ItemsErrorMessage } from '../constants/errorMessages';
import { SheetDB } from '../db/sheetDB';
import { SheetConstants } from '../constants/sheetConstants';
import { Item } from '../models/itemModel';
import { ItemsError } from '../errors/itemsError';
import { UserDBService } from './userDBService';
import { GenerateId } from '../utils/generateId';

export class ItemsService {

  static getItemList(): Array<Item> {
    let sheetMetaData = SheetMetadata.of(SheetConstants.ITEMS_SHEET_NAME)
                          .withTotalColumn(ItemsService.getNumberOfFields(Item.of()));
    const itemRawDataList = ItemsService.getRawDataList(sheetMetaData);
    let itemList = new Array<Item>();
    itemRawDataList.forEach(rawData => {
      itemList.push(ItemsService.getEntityFromRawData(rawData));
    })
    return itemList;
  }

  static getItem(itemId: string): Item {
    let index = ItemsService.getIndex(itemId, SheetConstants.ITEMS_SHEET_NAME);
    let sheetMetaData = SheetMetadata.of(SheetConstants.ITEMS_SHEET_NAME)
                                .withStartRow(index+2)
                                .withTotalRow(1)
                                .withTotalColumn(ItemsService.getNumberOfFields(Item.of()));
    const rawData = ItemsService.getRawDataList(sheetMetaData).flatMap(data => data);
    return ItemsService.getEntityFromRawData(rawData);
  }

  static deleteItem(itemId: string): string {
    let index = ItemsService.getIndex(itemId, SheetConstants.ITEMS_SHEET_NAME);
    try {
        SheetDB.deleteRow(
        SheetMetadata.of(SheetConstants.ITEMS_SHEET_NAME).withStartRow(index+2)
      );
      return itemId;
    } catch(error) {
      console.error(error);
      throw new ItemsError(ItemsErrorMessage.itemDeleteError);
    }
  }

  static updateItem(item: Item): string {
    item.withLatestUpdateByUser(UserDBService.getCurrentUser().email);
    item.withLatestUpdateTime(Date.now().toString());
    let numberOfFields = ItemsService.getNumberOfFields(Item.of());
    let isEdit = item.itemId? true: false;
    let startRow = item.itemId? ItemsService.getIndex(item.itemId, SheetConstants.ITEMS_SHEET_NAME) + 2: 0;
    let startColumn = isEdit? 2: 1;
    let totalColumn = isEdit? numberOfFields-1: numberOfFields;
    let sheetMetaData = SheetMetadata.of(SheetConstants.ITEMS_SHEET_NAME)
        .withStartRow(startRow)
        .withStartColumn(startColumn)
        .withTotalRow(1)
        .withTotalColumn(totalColumn);
    let itemId = item.itemId? item.itemId: GenerateId.getUniqueId();
    item.withItemId(itemId); 
    let data = ItemsService.getRowDataFromEntity(item, !isEdit);
    SheetDB.updateRow(sheetMetaData, [data]);
    return itemId;
  }

  static getRowDataFromEntity(item: Item, withId: boolean = false): Array<any> {
    let data: Array<any> = [];
    let supplierKeys = Object.keys(item);
    supplierKeys.forEach( (key: any) => {
      if(!(key === "itemId" && !withId)) {
        data.push(item[key]);
      }
    });
    return data;
  }

  private static getEntityFromRawData(rawData: Array<any>): Item {
    let item = new Item();
    let keys = Object.keys(item);
    keys.forEach( (key: any, index: number) => {
      item[key] = String(rawData[index]);
    });
    return item;
  }

  private static getRawDataList(sheetMetaData: SheetMetadata): Array<any> {
    try {
      return SheetDB.getSheetData(sheetMetaData);
    } catch(error) {
      console.error(error);
      throw new ItemsError(ItemsErrorMessage.internalError);
    }
  }

  private static getIndex(entityId: string, sheetName: string): number {
    entityId = entityId.toLowerCase();
    let condition = (id: string) => id === entityId;
    let index = ItemsService.getRawDataList(SheetMetadata.of(sheetName))
      .flatMap(itemId => itemId)
      .map(itemId => String(itemId).toLowerCase())
      .findIndex(condition);
    
    if(index === -1) {
      throw new ItemsError(ItemsErrorMessage.itemNotFound);
    }

    return index;
  }

  private static getNumberOfFields(entity: any) {
    return Object.keys(entity).length;
  }
}