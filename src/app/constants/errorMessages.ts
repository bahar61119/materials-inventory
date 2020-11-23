export class ErrorMessage {
    static get internalError(): Readonly<string> {
        return "We're sorry, a server error occurred. Please wait a bit and try again.";
    }

    static get entityNotFound() {
        return (entityName: string) => `${entityName} not found`;
    }

    static get entityDeleteError() {
        return (entityName: string) => `${entityName} delete failed`;
    }
}

export class SheetErrorMessage extends ErrorMessage {
    static get sheetNotFound() {
        return (sheetName: string) => `Sheet(${sheetName}) not found`;
    }

    static get spreadSheetNotFound() {
        return (id: string) => `SpreadSheet(${id}) not found`;
    }
}

export class SupplierErrorMessage extends ErrorMessage {
    static get supplierIdNotFound() {
        return (supplierId: string) => `Supplier id(${supplierId}) not found`;
    }

    static get supplierDeleteError() {
        return (supplierId: string) => `Deleting supplier with id(${supplierId}) failed`;
    }
}

export class UserErrorMessage extends ErrorMessage {
    static get userNotFound() {
        return `User Not Found`
    }

    static get userAlreadyExists() {
        return `User Already Exists`
    }

    static get userAlreadyAuthorized() {
        return `User Already Authorized`
    }

    static get userNotAuthorized() {
        return `User Is No Authorized`
    }

    static get systemUserUpdatedError() {
        return `System user cannot be updated`
    }

    static get systemUserRemoveError() {
        return `System user cannot be removed`
    }

    static get validationError() {
        return (value: String) => `${value} is required`;
    }
}

export class ProfileErrorMessage extends ErrorMessage {
    static get notAuthorized() {
        return `You are not authorized. Please contact with administrator.`
    }

    static get profileNotFound() {
        return `Profile not found. Please update your profile.`
    }

    static get emailExists() {
        return `Email is registered with another user`;
    }

    static get systemUserProfile() {
        return `System user cannot delete profile`
    }

    static get adminProfileRequired() {
        return `Only admin can access this information`
    }
}

export class SettingsErrorMessage extends ErrorMessage {
    static get adminDeleteError() {
        return `Admin cannot be removed.`
    }

    static get emailNotFound() {
        return `Email not found`
    }

    static get emailExists() {
        return `Email is already authorized`;
    }

    static get invalidSettingsKey() {
        return `Invalid settings key`;
    }
    
    static get invalidSettingsValue() {
        return `Invalid settings value`;
    }
}

export class ItemsErrorMessage extends ErrorMessage {
    static get itemNotFound() {
        return `Item not found`;
    }

    static get itemDeleteError() {
        return `Deleting item failed`;
    }
}

export class DriveErrorMessage extends ErrorMessage {
    static get invalidFolder() {
        return "Invalid Folder";
    }

    static get folderNotFound() {
        return "Folder not found";
    }

    static folderNotFoundWith(folderId: string) {
        return `Folder with id ${folderId} not found`;
    }
}