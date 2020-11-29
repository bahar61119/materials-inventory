import { SettingsTabs } from '../../constants/appConstants';
import { ApplicationDBKeys } from '../../constants/applicationDBKeys';
import { ViewFileNames } from '../../constants/fileNames';
import { ProfileService } from "../../services/profileService";
import { SettingsService } from '../../services/settingsService';
import { UserService } from '../../services/userService';
import { loadView } from './loadView';

// TODO: Closing authorization user feature until come up with a solution for logged in users.
export function loadSettingsView() {
    ProfileService.validateProfile(true);
    // let authorizationContents = loadSettingsTabView(ApplicationDBKeys.AUTHORIZED_USERS);
    let authorizationContents = loadSettingsTabView(ApplicationDBKeys.CURRENCIES);
    let settingsTabs = SettingsTabs;
    // let settingsActiveTab = ApplicationDBKeys.AUTHORIZED_USERS;
    let settingsActiveTab = ApplicationDBKeys.CURRENCIES;
    return loadView(ViewFileNames.SETTINGS, {authorizationContents, settingsTabs, settingsActiveTab});
}

export function loadSettingsAuthorizationView() {
    ProfileService.validateProfile(true);
    let authorizedUsers = SettingsService.getAuthorizedUserList();
    console.log(authorizedUsers);
    let systemUser = UserService.getSystemUserEmail();
    let userRoles = SettingsService.getUserRoleList();
    return loadView(ViewFileNames.SETTINGS_AUTHORIZATION, {authorizedUsers, systemUser, userRoles});
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