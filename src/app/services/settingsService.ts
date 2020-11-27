import { ApplicationDBKeys } from '../constants/applicationDBKeys';
import { SettingsErrorMessage } from '../constants/errorMessages';
import { UserRole } from '../constants/userRoles';
import { DB } from '../db/db';
import { SettingsError } from '../errors/settingsError';
import { AuthorizedUser } from '../models/authorizedUser';
import { KeyValue } from '../models/keyValueModel';
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

    static update(setting: KeyValue): KeyValue {
        this.validateSettingsKey(setting.key);
        if(!setting.value || (typeof setting.value !== "string")) {
            throw new SettingsError(SettingsErrorMessage.invalidSettingsValue);
        }

        let values: Set<string> = new Set<string>(this.getList(setting.key));
        values.add(setting.value);
        DB.getApplicationDB().put(setting.key, Array.from(values));
        return setting;
    }

    static delete(setting: KeyValue): KeyValue {
        this.validateSettingsKey(setting.key);

        if(SettingsService.isDefaultValue(setting)) {
            throw new SettingsError(SettingsErrorMessage.defaultValueDelete);
        }

        if(!setting.value || (typeof setting.value !== "string")) {
            throw new SettingsError(SettingsErrorMessage.invalidSettingsValue);
        }

        let values: Set<string> = new Set<string>(this.getList(setting.key));
        values.delete(setting.value);
        DB.getApplicationDB().put(setting.key, Array.from(values));
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

    static addDefaultValues() {
        Object.values(DefaultValues.Currency).forEach(value => {
            SettingsService.update(new KeyValue(ApplicationDBKeys.CURRENCIES, value));
        });
        Object.values(DefaultValues.ProductStatus).forEach(value => {
            SettingsService.update(new KeyValue(ApplicationDBKeys.PRODUCT_STATUS, value));
        });
        Object.values(DefaultValues.PaymentStatus).forEach(value => {
            SettingsService.update(new KeyValue(ApplicationDBKeys.PAYMENT_STATUS, value));
        });
        Object.values(DefaultValues.PaymentMethod).forEach(value => {
            SettingsService.update(new KeyValue(ApplicationDBKeys.PAYMENT_METHODS, value));
        });
    }

    static isDefaultValue(setting: KeyValue) {
        let values: Set<string> = new Set();
        if(ApplicationDBKeys.CURRENCIES === setting.key) {
            values = new Set(Object.values(DefaultValues.Currency));
        } else if(ApplicationDBKeys.PRODUCT_STATUS === setting.key) {
            values = new Set(Object.values(DefaultValues.ProductStatus));
        } else if(ApplicationDBKeys.PAYMENT_STATUS === setting.key) {
            values = new Set(Object.values(DefaultValues.PaymentStatus));
        } else if(ApplicationDBKeys.PAYMENT_METHODS === setting.key) {
            values = new Set(Object.values(DefaultValues.PaymentMethod));
        }
        return values.has(setting.value);
    }
}