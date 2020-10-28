export class Item implements ItemInterface {
    itemId: string;
    itemName: string;
    itemType: string;
    itemUnitOfMeasure: string;
    itemDescription: string;
    latestUpdateByUser: string;
    latestUpdateTime: string;

    constructor() {
        this.itemId = "";
        this.itemName = "";
        this.itemType = "";
        this.itemUnitOfMeasure = "";
        this.itemDescription = "";
        this.latestUpdateByUser = "";
        this.latestUpdateTime = "";
    }

    static of() {
        return new Item();
    }

    static from(itemData: object) {
        return Object.assign(new Item, itemData);
    }

    withItemId(itemId: string) {
        this.itemId = itemId;
        return this;
    }

    withItemName(itemName: string) {
        this.itemName = itemName;
        return this;
    }

    withItemType(itemType: string) {
        this.itemType = itemType;
        return this;
    }

    withItemUnitOfMeasure(itemUnitOfMeasure: string) {
        this.itemUnitOfMeasure = itemUnitOfMeasure;
        return this;
    }

    withItemDescription(itemDescription: string) {
        this.itemDescription = itemDescription;
        return this;
    }

    withLatestUpdateByUser(latestUpdateByUser: string) {
        this.latestUpdateByUser = latestUpdateByUser;
        return this;
    }

    withLatestUpdateTime(latestUpdateTime: string) {
        this.latestUpdateTime = latestUpdateTime;
        return this;
    }
}