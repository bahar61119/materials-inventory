import { ViewFileNames } from '../../constants/fileNames';
import { ProfileService } from "../../services/profileService";
import { UserDBService } from '../../services/userDBService';
import { loadView } from './loadView';

function loadSettingsView() {
    ProfileService.validateProfile();
    let authorizationContents = loadSettingsAuthorizationView();
    return loadView(ViewFileNames.SETTINGS, {authorizationContents});
}

function loadSettingsAuthorizationView() {
    ProfileService.validateProfile();
    let authorizedUsers = UserDBService.getWhiteListUsers();
    console.log(JSON.stringify(authorizedUsers));
    return loadView(ViewFileNames.SETTINGS_AUTHORIZATION, {authorizedUsers});
}

export {
    loadSettingsView,
    loadSettingsAuthorizationView
}