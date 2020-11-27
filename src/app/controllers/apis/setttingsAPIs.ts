import { AuthorizedUser } from '../../models/authorizedUser';
import { KeyValue } from '../../models/keyValueModel';
import { SettingsService } from '../../services/settingsService';

export function addAuthorizeUser(authorizeUserData: any) {
    return SettingsService.addAuthorizeUser(AuthorizedUser.from(authorizeUserData));
}

export function updateAuthorizeUser(authorizeUserData: any) {
    return SettingsService.updateAuthorizeUser(AuthorizedUser.from(authorizeUserData));
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