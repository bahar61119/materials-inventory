import { ViewFileNames } from "../../constants/fileNames";
import { ProfileService } from '../../services/profileService';
import { loadView } from './loadView';

function loadItemListView() {
  ProfileService.validateProfile();
  return loadView(ViewFileNames.ITEM_LIST);
}

export {
  loadItemListView
}
