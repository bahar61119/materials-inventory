export class SettingValue {
    tab: string;
    value: any;

    constructor(tab: string, value: any) {
        this.tab = tab;
        this.value = value;
    }

    static from(data: object): SettingValue {
        let keyValue = new SettingValue("", null);
        return Object.assign(keyValue, data);
    }
}