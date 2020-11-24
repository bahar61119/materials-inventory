import { FolderNames } from '../constants/driveConstants';
import { Drive } from '../db/drive';
import { File } from '../models/fileModel';

export class FileService {
    static uploadFile(file: File): string {
        return Drive.saveFile(File.from(file), FolderNames.TEMP);
    }
}