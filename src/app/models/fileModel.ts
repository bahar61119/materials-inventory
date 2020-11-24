export class File implements FileInterface {
    fileName: string;
    fileSize: number;
    fileType: string;
    fileData: any;

    constructor() {
        this.fileName = '';
        this.fileSize = 0;
        this.fileType = '';
        this.fileData = '';
    }

    static of() {
        return new File();
    }

    static from(file: object): File {
        return Object.assign(new File, file);
    }
}