import { ApplicationDBKeys } from '../constants/applicationDBKeys';
import { SettingsErrorMessage } from '../constants/errorMessages';
import { DB } from '../db/db';
import { SettingsError } from '../errors/settingsError';
import { SettingValue } from '../models/keyValueModel';
import { UserDBService } from './userDBService';

export class SettingsService {
    static getAuthorizedUserList() {
        return UserDBService.getWhiteListUsers();
    }

    static addAuthorizeUser(authorizeUser: string) {
        if( authorizeUser === UserDBService.getAdminUserEmail() ||
            UserDBService.doesWhiteListedUser(authorizeUser)) {
            throw new SettingsError(SettingsErrorMessage.emailExists);
        } 

        UserDBService.addToWhiteList(authorizeUser);

        return authorizeUser;
    }

    static deleteAuthorizeUser(authorizeUser: string) {
        if(authorizeUser === UserDBService.getAdminUserEmail()) {
            throw new SettingsError(SettingsErrorMessage.adminDeleteError);
        }

        if(!UserDBService.doesWhiteListedUser(authorizeUser)) {
            throw new SettingsError(SettingsErrorMessage.emailNotFound);
        }

        UserDBService.removeFromWhiteList(authorizeUser);

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