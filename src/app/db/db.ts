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

    put(key: string, value: any): void {
        let stringValue = JSON.stringify(value);
        this.dbService.setProperty(key, stringValue);
    }
    
    get(key: string, target: any = new Object): any {
        let value = this.dbService.getProperty(key);
        return value? Object.assign(target, JSON.parse(value)): null;
    }
    
    getKeys(): string [] {
        return this.dbService.getKeys();
    }
    
    delete(key: string): void {
        this.dbService.deleteProperty(key);
    }

    static getScriptProperties() {
        return PropertiesService.getScriptProperties()
    }

    static getUserProperties() {
        return PropertiesService.getUserProperties()
    }
}