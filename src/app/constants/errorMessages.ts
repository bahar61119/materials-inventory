export class ErrorMessage {
    static get internalError(): Readonly<string> {
        return "We're sorry, a server error occurred. Please wait a bit and try again.";
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

    static get adminProfile() {
        return `Admin user cannot delete profile`
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
}

export class ItemsErrorMessage extends ErrorMessage {
    static get itemNotFound() {
        return `Item not found`;
    }

    static get itemDeleteError() {
        return `Deleting supplier failed`;
    }
}