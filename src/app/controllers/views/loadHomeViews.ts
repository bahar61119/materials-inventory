import { ViewFileNames } from '../../constants/fileNames';
import { loadAppView } from './loadAppView';

function loadHomeView() {
  return loadAppView(ViewFileNames.HOME);
}

export {
  loadHomeView
}
