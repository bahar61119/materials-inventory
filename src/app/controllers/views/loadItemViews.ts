import { ApplicationDBKeys } from '../../constants/applicationDBKeys';
import { ViewFileNames } from "../../constants/fileNames";
import { Item } from '../../models/itemModel';
import { ItemsService } from '../../services/itemsService';
import { ProfileService } from '../../services/profileService';
import { SettingsService } from '../../services/settingsService';
import { loadView } from './loadView';

function loadItemListView() {
  ProfileService.validateProfile();
  return loadView(ViewFileNames.ITEM_LIST);
}

function loadAddItemView() {
  ProfileService.validateProfile();
  let itemTypes = SettingsService.getList(ApplicationDBKeys.ITEM_TYPES);
  let unitOfMeasures = SettingsService.getList(ApplicationDBKeys.UNIT_OF_MEASURES);
  let data = {
    item: Item.of(),
    itemTypes,
    unitOfMeasures,
    isEdit: false
  }
  return loadView(ViewFileNames.UPDATE_ITEM, data);
}

function loadEditItemView(itemId: string) {
  ProfileService.validateProfile();
  let item = ItemsService.getItem(String(itemId));
  let itemTypes = SettingsService.getList(ApplicationDBKeys.ITEM_TYPES);
  let unitOfMeasures = SettingsService.getList(ApplicationDBKeys.UNIT_OF_MEASURES);
  let data = {
    item,
    itemTypes,
    unitOfMeasures,
    isEdit: true
  }
  return loadView(ViewFileNames.UPDATE_ITEM, data);
}

export {
  loadItemListView,
  loadAddItemView,
  loadEditItemView
}
