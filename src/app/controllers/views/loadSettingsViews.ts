import { SettingsTabs } from '../../constants/appConstants';
import { ViewFileNames } from '../../constants/fileNames';
import { ProfileService } from "../../services/profileService";
import { SettingsService } from '../../services/settingsService';
import { UserDBService } from '../../services/userDBService';
import { loadView } from './loadView';

export function loadSettingsView() {
    ProfileService.validateProfile(true);
    let authorizationContents = loadSettingsAuthorizationView();
    let settingsTabs = SettingsTabs;
    return loadView(ViewFileNames.SETTINGS, {authorizationContents, settingsTabs});
}

export function loadSettingsAuthorizationView() {
    ProfileService.validateProfile(true);
    let authorizedUsers = SettingsService.getAuthorizedUserList();
    let adminUser = UserDBService.getAdminUserEmail();
    return loadView(ViewFileNames.SETTINGS_AUTHORIZATION, {authorizedUsers, adminUser});
}

export function loadSettingsTabView(key: string) {
    ProfileService.validateProfile(true);
    let settingsTabValues = SettingsService.getList(key);
    let settingsTabTitle = SettingsTabs[key];
    let settingsTabKey = key;
    return loadView(ViewFileNames.SETTINGS_TAB, 
        {
            settingsTabKey, 
            settingsTabTitle, 
            settingsTabValues
        }
    );
}