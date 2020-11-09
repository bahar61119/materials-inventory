import { UserErrorMessage } from '../constants/errorMessages';
import { DB } from "../db/db";
import { UserError } from '../errors/userError';
import { User } from '../models/userModel';
import { ApplicationDBKeys } from '../constants/applicationDBKeys';
import { UserDBKeys } from '../constants/userDBKeys';
import { AuthorizedUser } from '../models/authorizedUser';
import { UserRole } from '../constants/userRoles';

type Users = { [key: string]: User };
type AuthorizedUsers = { [key: string]: AuthorizedUser };
export class UserService {
    private static getAuthorizedUsers(): AuthorizedUsers {
        let authorizeUsers = DB.getApplicationDB().get(ApplicationDBKeys.AUTHORIZED_USERS, <AuthorizedUsers>{});
        return authorizeUsers? authorizeUsers: {};
    }

    static isAdminUser() {
        let systemUser = UserService.getSystemUserEmail();
        let user = UserService.getCurrentUser();
        if(user.email === systemUser) return true;
        let authorizeUsers: AuthorizedUsers = UserService.getAuthorizedUsers();
        let adminUsers: Array<string> = Object.values(authorizeUsers)
            .filter(authorizeUser => authorizeUser.role === UserRole.ADMIN)
            .map(authorizeUser => authorizeUser.email);
        return adminUsers[user.email]? true: false;
    }

    static getAuthorizeUserList(): Array<AuthorizedUser> {
        let authorizeUsers: AuthorizedUsers = UserService.getAuthorizedUsers();
        return Object.values(authorizeUsers);
    }

    static addAuthorizeUser(authorizeUser: AuthorizedUser): AuthorizedUser {
        UserService.validateAuthorizeUser(authorizeUser);
        let authorizeUsers = UserService.getAuthorizedUsers();
        let systemUser = UserService.getSystemUserEmail();
        if(authorizeUser.email === systemUser || authorizeUsers[authorizeUser.email]) {
            throw new UserError(UserErrorMessage.userAlreadyAuthorized);
        }
        authorizeUsers[authorizeUser.email] = authorizeUser;
        DB.getApplicationDB().put(ApplicationDBKeys.AUTHORIZED_USERS, authorizeUsers);
        return authorizeUser;
    }

    static updateAuthorizeUser(authorizeUser: AuthorizedUser): AuthorizedUser {
        UserService.validateAuthorizeUser(authorizeUser);
        let authorizeUsers = UserService.getAuthorizedUsers();
        let systemUser = UserService.getSystemUserEmail();
        
        if(authorizeUser.email === systemUser) {
            throw new UserError(UserErrorMessage.systemUserUpdatedError);
        } else if(!authorizeUsers[authorizeUser.email]) {
            throw new UserError(UserErrorMessage.userNotAuthorized);
        }

        authorizeUsers[authorizeUser.email] = authorizeUser;
        DB.getApplicationDB().put(ApplicationDBKeys.AUTHORIZED_USERS, authorizeUsers);
        return authorizeUser;
    }

    static removeAuthorizeUser(userEmail: string): string {
        let authorizeUsers = UserService.getAuthorizedUsers();
        let systemUser = UserService.getSystemUserEmail();
        
        if (!userEmail) {
            throw new UserError(UserErrorMessage.validationError("Email"));
        } else if (userEmail === systemUser) {
            throw new UserError(UserErrorMessage.systemUserRemoveError);
        } else if (!authorizeUsers[userEmail]) {
            throw new UserError(UserErrorMessage.userNotAuthorized);
        }

        delete authorizeUsers[userEmail];
        DB.getApplicationDB().put(ApplicationDBKeys.AUTHORIZED_USERS, authorizeUsers);
        return userEmail;
    }

    static doesAuthorizeUser(userEmail: string) {
        let authorizeUsers = UserService.getAuthorizedUsers();
        return authorizeUsers[userEmail]? true: false;
    }

    static validateAuthorizeUser(authorizedUser: AuthorizedUser) {
        let errors: string [] = [];
        if(!authorizedUser.email) {
            errors.push(UserErrorMessage.validationError("Email"));
        }
        if(!authorizedUser.role) {
            errors.push(UserErrorMessage.validationError("Role"));
        }
        if(errors.length > 0) {
            throw new UserError(errors.join(', '))
        }
    }

    static addUser(user: User): User {
        UserService.validateUser(user, true);
        let users: Users = UserService.getUsers();
        if(users[user.email]) {
            throw new UserError(UserErrorMessage.userAlreadyExists);
        }

        user.withUUID(UserService.getUuid());
        users[user.email] = user;

        DB.getApplicationDB().put(ApplicationDBKeys.USERS, users);

        return user;
    }

    static addCurrentUser(email: string) {
        let users = UserService.getUsers();
        if(!users[email]) {
            throw new UserError(UserErrorMessage.userNotFound);
        }

        let currentUserExists = UserService.doesCurrentUserExist();
        if(currentUserExists) {
            throw new UserError(UserErrorMessage.userAlreadyExists);
        }

        DB.getUserDB().put(UserDBKeys.USER, users[email]);
        return users[email];
    }

    static updateUser(user: User, oldEmail?: string): User {
        UserService.validateUser(user, false);
        let email = oldEmail? oldEmail: user.email;
        let users: Users = UserService.getUsers();
        users = users? users: {};
        
        if(!users[email]) {
            throw new UserError(UserErrorMessage.userNotFound);
        }

        if(oldEmail && oldEmail !== user.email && users[user.email]) {
            throw new UserError(UserErrorMessage.userAlreadyExists);
        }

        if(oldEmail) delete users[oldEmail];
        users[user.email] = user;

        DB.getApplicationDB().put(ApplicationDBKeys.USERS, users);

        return user;
    }

    static updateCurrentUser(): User {
        let currentUser = UserService.getCurrentUser();

        let users = UserService.getUsers();
        if(!users[currentUser.email]) {
            throw new UserError(UserErrorMessage.userNotFound);
        }

        DB.getUserDB().put(UserDBKeys.USER, users[currentUser.email]);
        return users[currentUser.email];
    }

    static deleteUser(email: string): User {
        let users: Users = UserService.getUsers();
        if(!users[email]) {
            throw new UserError(UserErrorMessage.userNotFound);
        }

        let user = users[email];
        delete users[email];

        DB.getApplicationDB().put(ApplicationDBKeys.USERS, users);

        return user;
    }

    static deleteCurrentUser(): void {
        let currentUser = UserService.getCurrentUser();
        let users: Users = UserService.getUsers();
        if(users[currentUser.email]) {
            console.error(`Please delete from application db first`);
            throw new UserError(UserErrorMessage.internalError);
        }
        
        DB.getUserDB().deleteAll();
    }

    static getUser(email: string): User {
        let users = UserService.getUsers();
        if(!users[email]) {
            throw new UserError(UserErrorMessage.userNotFound);
        }
        return users[email];
    }

    static getCurrentUser(): User {
        let user = DB.getUserDB().get(UserDBKeys.USER, new User);
        if(!user) {
            throw new UserError(UserErrorMessage.userNotFound);
        }
        return user;
    }

    static doesUserExist(email: string): boolean {
        let users = UserService.getUsers();
        return users[email]? true: false;
    }

    static doesCurrentUserExist(): boolean {
        let user = DB.getUserDB().get(UserDBKeys.USER);
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

    private static getUsers(): Users {
        let users = DB.getApplicationDB().get(ApplicationDBKeys.USERS, <Users>{}); 
        return users? users: {};
    }

    static getSystemUserEmail(): string {
        return Session.getEffectiveUser().getEmail();
    }
}