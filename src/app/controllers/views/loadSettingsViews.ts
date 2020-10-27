import { ViewFileNames } from '../../constants/fileNames';
import { ProfileService } from "../../services/profileService";
import { UserDBService } from '../../services/userDBService';
import { loadView } from './loadView';

function loadSettingsView() {
    ProfileService.validateProfile(true);
    let authorizationContents = loadSettingsAuthorizationView();
    return loadView(ViewFileNames.SETTINGS, {authorizationContents});
}

function loadSettingsAuthorizationView() {
    ProfileService.validateProfile(true);
    let authorizedUsers = UserDBService.getWhiteListUsers();
    let adminUser = UserDBService.getAdminUserEmail();
    return loadView(ViewFileNames.SETTINGS_AUTHORIZATION, {authorizedUsers, adminUser});
}

export {
    loadSettingsView,
    loadSettingsAuthorizationView
}