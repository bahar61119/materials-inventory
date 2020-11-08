import { ErrorMessage } from '../constants/errorMessages';
import { DBError } from '../errors/dbError';

export class DB {
    private dbService: GoogleAppsScript.Properties.Properties;

    constructor(dbService: GoogleAppsScript.Properties.Properties) {
        this.dbService = dbService;
        JSON.parse
    }

    static getUserDB(): DB {
        return new DB(DB.getUserProperties());
    }

    static getApplicationDB(): DB {
        return new DB(DB.getScriptProperties());
    }

    put<T>(key: string, value: T): void {
        try {
            let stringValue = JSON.stringify(value);
            this.dbService.setProperty(key, stringValue);
        } catch(error) {
            console.error(error);
            throw new DBError(ErrorMessage.internalError);
        }
    }
    
    get<T>(key: string, target?: T): T {
        try {
            let value = this.dbService.getProperty(key);
            if(target) {
                return value? Object.assign(target, JSON.parse(value)): null;
            } else {
                return value? JSON.parse(value): null;
            }
        } catch(error) {
            console.error(error);
            throw new DBError(ErrorMessage.internalError);
        }
    }
    
    getKeys(): string [] {
        try {
            return this.dbService.getKeys();
        } catch(error) {
            console.error(error);
            throw new DBError(ErrorMessage.internalError);
        }
    }

    exists(key: string): boolean {
        let keys: Set<string> = new Set<string>(this.dbService.getKeys());
        return keys.has(key);
    }
    
    delete(key: string): void {
        try {
            this.dbService.deleteProperty(key);
        } catch(error) {
            console.error(error);
            throw new DBError(ErrorMessage.internalError);
        }
    }
    
    deleteAll(): void {
        try {
            this.dbService.deleteAllProperties();
        } catch(error) {
            console.error(error);
            throw new DBError(ErrorMessage.internalError);
        }
    }

    static getScriptProperties() {
        try {
            return PropertiesService.getScriptProperties();
        } catch(error) {
            console.error(error);
            throw new DBError(ErrorMessage.internalError);
        }
    }

    static getUserProperties() {
        try {
            return PropertiesService.getUserProperties();
        } catch(error) {
            console.error(error);
            throw new DBError(ErrorMessage.internalError);
        }
    }
}