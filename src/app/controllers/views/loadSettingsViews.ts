import { ViewFileNames } from '../../constants/fileNames';
import { ProfileService } from "../../services/profileService";
import { loadView } from './loadView';

export function loadSettingsView() {
    ProfileService.validateProfile();
    return loadView(ViewFileNames.SETTINGS);
}