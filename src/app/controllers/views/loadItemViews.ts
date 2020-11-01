import { ViewFileNames } from "../../constants/fileNames";
import { Item } from '../../models/itemModel';
import { ItemsService } from '../../services/itemsService';
import { ProfileService } from '../../services/profileService';
import { loadView } from './loadView';

function loadItemListView() {
  ProfileService.validateProfile();
  return loadView(ViewFileNames.ITEM_LIST);
}

function loadAddItemView() {
  ProfileService.validateProfile();
  let data = {
    item: Item.of(),
    isEdit: false
  }
  return loadView(ViewFileNames.UPDATE_ITEM, data);
}

function loadEditItemView(itemId: string) {
  ProfileService.validateProfile();
  let item = ItemsService.getItem(String(itemId));
  let data = {
    item,
    isEdit: true
  }
  return loadView(ViewFileNames.UPDATE_ITEM, data);
}

export {
  loadItemListView,
  loadAddItemView,
  loadEditItemView
}
