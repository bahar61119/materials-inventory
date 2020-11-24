import { ApplicationDBKeys } from '../constants/applicationDBKeys';
import { FolderNames } from '../constants/driveConstants';
import { DriveErrorMessage } from '../constants/errorMessages';
import { DriveError } from '../errors/driveError';
import { File } from '../models/fileModel';
import { DB } from './db';

export class Drive {
    static getFolderId(folder: FolderNames): string {
        return DB.getApplicationDB().get(Drive.getKey(folder));
    }

    static doesFolderExist(folder: FolderNames): boolean {
        let folderId = Drive.getFolderId(folder);
        if(folderId) {
            let folder = DriveApp.getFolderById(folderId);
            return folder && !folder.isTrashed()? true: false;
        }
        return false;
    }

    static deleteFolderId(folder: FolderNames) {
        DB.getApplicationDB().delete(Drive.getKey(folder));
    }

    static saveFolderId(id: string, folder: FolderNames) {
        DB.getApplicationDB().put(Drive.getKey(folder), id);
    }

    static createFolder(folderName: FolderNames, parentFolderName: FolderNames | null = null): string {
        let driveFolder: GoogleAppsScript.Drive.Folder;
        if (parentFolderName) {
            let parentFolderId = Drive.getFolderId(parentFolderName);
            let parentFolder = DriveApp.getFolderById(parentFolderId);
            if (!parentFolder) {
                throw new DriveError(DriveErrorMessage.folderNotFoundWith(parentFolderId));
            }
            driveFolder = parentFolder.createFolder(folderName);
        } else {
            driveFolder = DriveApp.createFolder(folderName);
        }
        return driveFolder.getId();
    }

    static saveFile(file: File, folder: FolderNames): string {
        try {
            let folderId = Drive.getFolderId(folder);
            let driveFolder = DriveApp.getFolderById(folderId);
            let contentType = file.fileData.substring(5, file.fileData.indexOf(';'));
            let bytes = Utilities.base64Decode(file.fileData.substr(file.fileData.indexOf('base64,') + 7));
            let blob = Utilities.newBlob(bytes, contentType, file.fileName);
            let driveFile = driveFolder.createFile(blob);
            return driveFile.getId();
        } catch (error) {
            console.error(error);
            throw new DriveError(error.toString());
        }
    }

    private static getKey(folder: FolderNames): string {
        let folderKey: string;
        switch (folder) {
            case FolderNames.ROOT:
                folderKey = ApplicationDBKeys.ROOT_FOLDER_ID;
                break;
            case FolderNames.INVOICES:
                folderKey = ApplicationDBKeys.INVOICES_FOLDER_ID;
                break;
            case FolderNames.PAYMENTS:
                folderKey = ApplicationDBKeys.PAYMENTS_FOLDER_ID;
                break;
            case FolderNames.TEMP:
                folderKey = ApplicationDBKeys.TEMP_FOLDER_ID;
                break;
            default:
                throw new DriveError(DriveErrorMessage.invalidFolder);
        }
        return folderKey;
    }
}