import { SettingsTabs } from '../../constants/appConstants';
import { DBKeys } from '../../constants/dbKeys';
import { ViewFileNames } from '../../constants/fileNames';
import { ProfileService } from "../../services/profileService";
import { SettingsService } from '../../services/settingsService';
import { loadView } from './loadView';

export function loadSettingsView() {
    ProfileService.validateProfile();
    let authorizationContents = loadSettingsTabView(DBKeys.CURRENCIES);
    let settingsTabs = SettingsTabs;
    let settingsActiveTab = DBKeys.CURRENCIES;
    return loadView(ViewFileNames.SETTINGS, {authorizationContents, settingsTabs, settingsActiveTab});
}

export function loadSettingsTabView(key: string) {
    ProfileService.validateProfile();
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