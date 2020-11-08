import { SettingValue } from '../../models/keyValueModel';
import { SettingsService } from '../../services/settingsService';

export function addAuthorizeUser(authorizeUser: string) {
    return SettingsService.addAuthorizeUser(authorizeUser);
}

export function deleteAuthorizeUser(authorizeUser: string) {
    return SettingsService.deleteAuthorizeUser(authorizeUser);
}

export function updateSetting(setting: any) {
    return SettingsService.update(SettingValue.from(setting));
}

export function deleteSetting(setting: any) {
    return SettingsService.delete(SettingValue.from(setting));
}