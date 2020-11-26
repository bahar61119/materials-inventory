import { File } from '../../models/fileModel';
import { FileService } from '../../services/fileService';

export function uploadFile(file: any) {
    return FileService.uploadFile(File.from(file));
}