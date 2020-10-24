import { ViewFileNames } from '../../constants/fileNames';
import { ProfileService } from '../../services/profileService';
import { loadView } from './loadView';

function loadHomeView() {
  ProfileService.validateProfile();
  return loadView(ViewFileNames.HOME);
}

export {
  loadHomeView
}
