import { ApplicationDBKeys } from '../constants/applicationDBKeys';
import { SettingsErrorMessage } from '../constants/errorMessages';
import { UserRole } from '../constants/userRoles';
import { DB } from '../db/db';
import { SettingsError } from '../errors/settingsError';
import { AuthorizedUser } from '../models/authorizedUser';
import { SettingValue } from '../models/keyValueModel';
import { UserService } from './userService';

export class SettingsService {
    static getUserRoleList() {
        return [UserRole.ADMIN, UserRole.EDITOR];
    }

    static getAuthorizedUserList() {
        return UserService.getAuthorizeUserList();
    }

    static addAuthorizeUser(authorizeUser: AuthorizedUser): AuthorizedUser {
        UserService.addAuthorizeUser(authorizeUser);
        return authorizeUser;
    }

    static updateAuthorizeUser(authorizeUser: AuthorizedUser): AuthorizedUser {
        UserService.updateAuthorizeUser(authorizeUser);
        return authorizeUser;
    }

    static deleteAuthorizeUser(authorizeUser: string): string {
        UserService.removeAuthorizeUser(authorizeUser);
        return authorizeUser;
    }

    static getList(key: string): Array<string> {
        this.validateSettingsKey(key);
        let values = DB.getApplicationDB().get(key, new Array<string>());
        return values? values: new Array<string>();
    }

    static update(setting: SettingValue): SettingValue {
        this.validateSettingsKey(setting.tab);
        if(!setting.value || (typeof setting.value !== "string")) {
            throw new SettingsError(SettingsErrorMessage.invalidSettingsValue);
        }

        let values: Set<string> = new Set<string>(this.getList(setting.tab));
        values.add(setting.value);
        DB.getApplicationDB().put(setting.tab, Array.from(values));
        return setting;
    }

    static delete(setting: SettingValue): SettingValue {
        this.validateSettingsKey(setting.tab);
        if(!setting.value || (typeof setting.value !== "string")) {
            throw new SettingsError(SettingsErrorMessage.invalidSettingsValue);
        }

        let values: Set<string> = new Set<string>(this.getList(setting.tab));
        values.delete(setting.value);
        DB.getApplicationDB().put(setting.tab, Array.from(values));
        return setting;
    }

    static validateSettingsKey(key: string) {
        let settingsKeys: Set<string> = new Set<string>([
            ApplicationDBKeys.CURRENCIES,
            ApplicationDBKeys.PRODUCT_STATUS,
            ApplicationDBKeys.PAYMENT_METHODS,
            ApplicationDBKeys.PAYMENT_STATUS,
            ApplicationDBKeys.SUPPLIER_TYPES,
            ApplicationDBKeys.ITEM_TYPES,
            ApplicationDBKeys.UNIT_OF_MEASURES
        ]);

        if(!key || !settingsKeys.has(key)) {
            throw new SettingsError(SettingsErrorMessage.invalidSettingsKey);
        }
    }
}