import { SettingsTabs } from '../../constants/appConstants';
import { ApplicationDBKeys } from '../../constants/applicationDBKeys';
import { ViewFileNames } from '../../constants/fileNames';
import { ProfileService } from "../../services/profileService";
import { SettingsService } from '../../services/settingsService';
import { UserDBService } from '../../services/userDBService';
import { loadView } from './loadView';

export function loadSettingsView() {
    ProfileService.validateProfile(true);
    let authorizationContents = loadSettingsTabView(ApplicationDBKeys.AUTHORIZED_USERS);
    let settingsTabs = SettingsTabs;
    let settingsActiveTab = ApplicationDBKeys.AUTHORIZED_USERS;
    return loadView(ViewFileNames.SETTINGS, {authorizationContents, settingsTabs, settingsActiveTab});
}

export function loadSettingsAuthorizationView() {
    ProfileService.validateProfile(true);
    let authorizedUsers = SettingsService.getAuthorizedUserList();
    let adminUser = UserDBService.getAdminUserEmail();
    return loadView(ViewFileNames.SETTINGS_AUTHORIZATION, {authorizedUsers, adminUser});
}

export function loadSettingsTabView(key: string) {
    ProfileService.validateProfile(true);
    if(key === ApplicationDBKeys.AUTHORIZED_USERS) {
        return loadSettingsAuthorizationView();
    }
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