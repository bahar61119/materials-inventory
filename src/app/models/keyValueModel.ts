export class KeyValue {
    key: string;
    value: any;

    constructor(key: string, value: any) {
        this.key = key;
        this.value = value;
    }

    static from(data: object): KeyValue {
        let keyValue = new KeyValue("", null);
        return Object.assign(keyValue, data);
    }
}