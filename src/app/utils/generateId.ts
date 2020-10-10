export class GenerateId {
    static getUniqueId(): string {
        return Math.random().toString(36).substr(2, 9).toUpperCase();
    }
}