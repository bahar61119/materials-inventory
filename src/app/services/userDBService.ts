import { UserErrorMessage } from '../constants/errorMessages';
import { DB } from "../db/db";
import { UserError } from '../errors/userError';
import { User } from '../models/userModel';

type Users = { [key: string]: User };
export class UserDBService {
    private static USER_DB_USER_KEY = "user";
    private static APPLICATION_DB_USERS_KEY = "users";
    private static APPLICATION_DB_WHITELIST_USERS_KEY = "whiteListedUsers";

    static addToWhiteList(userEmail: string): string {
        let whiteListUsers: Set<string> = new Set<string>(UserDBService.getWhiteListUsers());
        if(whiteListUsers.has(userEmail)) {
            throw new UserError(UserErrorMessage.userAlreadyExists);
        }
        whiteListUsers.add(userEmail);
        DB.getApplicationDB().put(UserDBService.APPLICATION_DB_WHITELIST_USERS_KEY, Array.from(whiteListUsers));
        return userEmail;
    }

    static removeFromWhiteList(userEmail: string): string {
        let whiteListUsers: Set<string> = new Set<string>(UserDBService.getWhiteListUsers());
        if(!whiteListUsers.has(userEmail)) {
            throw new UserError(UserErrorMessage.userNotFound);
        }
        whiteListUsers.delete(userEmail);
        DB.getApplicationDB().put(UserDBService.APPLICATION_DB_WHITELIST_USERS_KEY, Array.from(whiteListUsers));
        return userEmail;
    }

    static doesWhiteListedUser(userEmail: string) {
        let whiteListUsers: Set<string> = new Set<string>(UserDBService.getWhiteListUsers());
        return whiteListUsers.has(userEmail);
    }

    static addUser(user: User): User {
        UserDBService.validateUser(user, true);
        let users: Users = UserDBService.getUsers();
        if(users[user.email]) {
            throw new UserError(UserErrorMessage.userAlreadyExists);
        }

        user.withUUID(UserDBService.getUuid());
        users[user.email] = user;

        DB.getApplicationDB().put(UserDBService.APPLICATION_DB_USERS_KEY, users);

        return user;
    }

    static addCurrentUser(email: string) {
        let users = UserDBService.getUsers();
        if(!users[email]) {
            throw new UserError(UserErrorMessage.userNotFound);
        }

        let currentUserExists = UserDBService.doesCurrentUserExist();
        if(currentUserExists) {
            throw new UserError(UserErrorMessage.userAlreadyExists);
        }

        DB.getUserDB().put(UserDBService.USER_DB_USER_KEY, users[email]);
        return users[email];
    }

    static updateUser(user: User, oldEmail?: string): User {
        UserDBService.validateUser(user, false);
        let email = oldEmail? oldEmail: user.email;
        let users: Users = UserDBService.getUsers();
        users = users? users: {};
        
        if(!users[email]) {
            throw new UserError(UserErrorMessage.userNotFound);
        }

        users[user.email] = user;
        if(oldEmail) delete users[oldEmail];

        DB.getApplicationDB().put(UserDBService.APPLICATION_DB_USERS_KEY, users);

        return user;
    }

    static updateCurrentUser(): User {
        let currentUser = UserDBService.getCurrentUser();

        let users = UserDBService.getUsers();
        if(!users[currentUser.email]) {
            throw new UserError(UserErrorMessage.userNotFound);
        }

        DB.getUserDB().put(UserDBService.USER_DB_USER_KEY, users[currentUser.email]);
        return users[currentUser.email];
    }

    static deleteUser(email: string): User {
        let users: Users = UserDBService.getUsers();
        if(!users[email]) {
            throw new UserError(UserErrorMessage.userNotFound);
        }

        let user = users[email];
        delete users[email];

        DB.getApplicationDB().put(UserDBService.APPLICATION_DB_USERS_KEY, users);

        return user;
    }

    static deleteCurrentUser(): void {
        let currentUser = UserDBService.getCurrentUser();
        let users: Users = UserDBService.getUsers();
        if(!users[currentUser.email]) {
            throw new UserError(UserErrorMessage.userNotFound);
        }
        
        DB.getUserDB().deleteAll();
    }

    static getUser(email: string): User {
        let users = UserDBService.getUsers();
        if(!users[email]) {
            throw new UserError(UserErrorMessage.userNotFound);
        }
        return users[email];
    }

    static getCurrentUser(): User {
        let user = DB.getUserDB().get(UserDBService.USER_DB_USER_KEY, new User);
        if(!user) {
            throw new UserError(UserErrorMessage.userNotFound);
        }
        return user;
    }

    static doesUserExist(email: string): boolean {
        let users = UserDBService.getUsers();
        return users[email]? true: false;
    }

    static doesCurrentUserExist(): boolean {
        let user = DB.getUserDB().get(UserDBService.USER_DB_USER_KEY);
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

    static getUsers(): Users {
        let users = DB.getApplicationDB().get(UserDBService.APPLICATION_DB_USERS_KEY, <Users>{}); 
        return users? users: {};
    }

    static getWhiteListUsers(): Array<string> {
        let whiteListUsers = DB.getApplicationDB().get(UserDBService.APPLICATION_DB_WHITELIST_USERS_KEY, new Array<string>());
        return whiteListUsers? whiteListUsers: new Array<string>();
    }

    static getAdminUserEmail(): string {
        return Session.getEffectiveUser().getEmail();
    }
}