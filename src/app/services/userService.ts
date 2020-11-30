import { UserErrorMessage } from '../constants/errorMessages';
import { DB } from "../db/db";
import { UserError } from '../errors/userError';
import { User } from '../models/userModel';
import { DBKeys } from '../constants/dbKeys';
export class UserService {
    static addUser(user: User): User {
        UserService.validateUser(user, true);
        
        let currentUser: User = DB.getUserDB().get(DBKeys.USER, new User);
        
        if(currentUser) {
            throw new UserError(UserErrorMessage.userAlreadyExists);
        }

        if(user.email !== UserService.getSystemUserEmail()) {
            throw new UserError(UserErrorMessage.userEmailNotAuthorized)
        }

        user.withUUID(UserService.getUuid());

        DB.getUserDB().put(DBKeys.USER, user);

        return user;
    }

    static updateUser(user: User): User {
        UserService.validateUser(user, false);
        let currentUser: User = DB.getUserDB().get(DBKeys.USER, new User);
        
        if(!currentUser) {
            throw new UserError(UserErrorMessage.userNotFound);
        }

        if(user.email !== UserService.getSystemUserEmail()) {
            throw new UserError(UserErrorMessage.userEmailNotAuthorized)
        }

        DB.getUserDB().put(DBKeys.USER, user);

        return user;
    }

    static deleteUser(): User {
        let user = DB.getUserDB().get(DBKeys.USER, new User);
        if(!user) {
            throw new UserError(UserErrorMessage.userNotFound);
        }
        DB.getUserDB().delete(DBKeys.USER);
        return user;
    }

    static getUser(): User {
        let user = DB.getUserDB().get(DBKeys.USER, new User);
        if(!user) {
            throw new UserError(UserErrorMessage.userNotFound);
        }
        return user;
    }

    static doesUserExist(): boolean {
        let user = DB.getUserDB().get(DBKeys.USER, new User);
        return user? true: false;
    }

    static validateUser(user: User, newUser: boolean) {
        let errors: string [] = [];

        if(!newUser && !user.uuid) {
            errors.push(UserErrorMessage.validationError("UUID"));
        }
        if(!user.firstName) {
            errors.push(UserErrorMessage.validationError("FirstName"));
        }
        if(!user.lastName) {
            errors.push(UserErrorMessage.validationError("LastName"));
        }
        if(!user.email) {
            errors.push(UserErrorMessage.validationError("Email"));
        }

        if(errors.length > 0) {
            throw new UserError(errors.join(', '))
        }
    }

    static getUuid() {
        return Utilities.getUuid();
    }

    static getSystemUserEmail(): string {
        return Session.getEffectiveUser().getEmail();
    }
}