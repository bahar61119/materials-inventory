export class DriveError extends Error {
    constructor(message: string) {
        super(message);
        this.name = DriveError.name;
    }
}