import { KeyValue } from '../../models/keyValueModel';
import { SettingsService } from '../../services/settingsService';

export function addAuthorizeUser(authorizeUser: string) {
    return SettingsService.addAuthorizeUser(authorizeUser);
}

export function deleteAuthorizeUser(authorizeUser: string) {
    return SettingsService.deleteAuthorizeUser(authorizeUser);
}

export function updateSetting(setting: any) {
    return SettingsService.update(KeyValue.from(setting));
}

export function deleteSetting(setting: any) {
    return SettingsService.delete(KeyValue.from(setting));
}