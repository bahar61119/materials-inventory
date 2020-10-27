import { SettingsService } from '../../services/settingsService';

export function addAuthorizeUser(authorizeUser: string) {
    return SettingsService.addAuthorizeUser(authorizeUser);
}

export function deleteAuthorizeUser(authorizeUser: string) {
    return SettingsService.deleteAuthorizeUser(authorizeUser);
}