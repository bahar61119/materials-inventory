export class ItemsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = ItemsError.name;
    }
}