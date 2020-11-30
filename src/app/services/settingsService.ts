import { DBKeys } from '../constants/dbKeys';
import { SettingsErrorMessage } from '../constants/errorMessages';
import { DB } from '../db/db';
import { SettingsError } from '../errors/settingsError';
import { KeyValue } from '../models/keyValueModel';

export class SettingsService {
    static getList(key: string): Array<string> {
        this.validateSettingsKey(key);
        let values = DB.getUserDB().get(key, new Array<string>());
        return values? values: new Array<string>();
    }

    static update(setting: KeyValue): KeyValue {
        this.validateSettingsKey(setting.key);
        if(!setting.value || (typeof setting.value !== "string")) {
            throw new SettingsError(SettingsErrorMessage.invalidSettingsValue);
        }

        let values: Set<string> = new Set<string>(this.getList(setting.key));
        values.add(setting.value);
        DB.getUserDB().put(setting.key, Array.from(values));
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
        DB.getUserDB().put(setting.key, Array.from(values));
        return setting;
    }

    static validateSettingsKey(key: string) {
        let settingsKeys: Set<string> = new Set<string>([
            DBKeys.CURRENCIES,
            DBKeys.PRODUCT_STATUS,
            DBKeys.PAYMENT_METHODS,
            DBKeys.PAYMENT_STATUS,
            DBKeys.SUPPLIER_TYPES,
            DBKeys.ITEM_TYPES,
            DBKeys.UNIT_OF_MEASURES
        ]);

        if(!key || !settingsKeys.has(key)) {
            throw new SettingsError(SettingsErrorMessage.invalidSettingsKey);
        }
    }

    static addDefaultValues() {
        Object.values(DefaultValues.Currency).forEach(value => {
            SettingsService.update(new KeyValue(DBKeys.CURRENCIES, value));
        });
        Object.values(DefaultValues.ProductStatus).forEach(value => {
            SettingsService.update(new KeyValue(DBKeys.PRODUCT_STATUS, value));
        });
        Object.values(DefaultValues.PaymentStatus).forEach(value => {
            SettingsService.update(new KeyValue(DBKeys.PAYMENT_STATUS, value));
        });
        Object.values(DefaultValues.PaymentMethod).forEach(value => {
            SettingsService.update(new KeyValue(DBKeys.PAYMENT_METHODS, value));
        });
    }

    static isDefaultValue(setting: KeyValue) {
        let values: Set<string> = new Set();
        if(DBKeys.CURRENCIES === setting.key) {
            values = new Set(Object.values(DefaultValues.Currency));
        } else if(DBKeys.PRODUCT_STATUS === setting.key) {
            values = new Set(Object.values(DefaultValues.ProductStatus));
        } else if(DBKeys.PAYMENT_STATUS === setting.key) {
            values = new Set(Object.values(DefaultValues.PaymentStatus));
        } else if(DBKeys.PAYMENT_METHODS === setting.key) {
            values = new Set(Object.values(DefaultValues.PaymentMethod));
        }
        return values.has(setting.value);
    }
}