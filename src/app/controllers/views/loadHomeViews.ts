import { ViewFileNames } from '../../constants/fileNames';
import { loadView } from './loadView';

function loadHomeView() {
  return loadView(ViewFileNames.HOME);
}

export {
  loadHomeView
}
