import { UserErrorMessage } from '../constants/errorMessages';
import { DB } from "../db/db";
import { UserError } from '../errors/userError';
import { User } from '../models/userModel';

type Users = { [key: string]: User };
export class UserService {
    private static USER_DB_USER_KEY = "user";
    private static APPLICATION_DB_USERS_KEY = "users";

    static addUser(user: User): User {
        UserService.validateUser(user, true);
        let users: Users = UserService.getUsers();
        users = users? users: {};
        
        if(users[user.email]) {
            throw new UserError(UserErrorMessage.userAlreadyExists);
        }

        user.withUUID(UserService.getUuid());
        users[user.email] = user;

        DB.getApplicationDB().put(UserService.APPLICATION_DB_USERS_KEY, users);

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

        DB.getUserDB().put(UserService.USER_DB_USER_KEY, users[email]);
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

        users[user.email] = user;
        if(oldEmail) delete users[oldEmail];

        DB.getApplicationDB().put(UserService.APPLICATION_DB_USERS_KEY, users);

        return user;
    }

    static updateCurrentUser(): User {
        let currentUser = UserService.getCurrentUser();

        let users = UserService.getUsers();
        if(!users[currentUser.email]) {
            throw new UserError(UserErrorMessage.userNotFound);
        }

        DB.getUserDB().put(UserService.USER_DB_USER_KEY, users[currentUser.email]);
        return users[currentUser.email];
    }

    static deleteUser(email: string): User {
        let users: Users = UserService.getUsers();
        users = users? users: {};
        
        if(!users[email]) {
            throw new UserError(UserErrorMessage.userNotFound);
        }

        let user = users[email];
        delete users[email];

        DB.getApplicationDB().put(UserService.APPLICATION_DB_USERS_KEY, users);

        return user;
    }

    static deleteCurrentUser(): void {
        let currentUser = UserService.getCurrentUser();
        let users: Users = UserService.getUsers();
        users = users? users: {};
        
        if(!users[currentUser.email]) {
            throw new UserError(UserErrorMessage.userNotFound);
        }
        
        DB.getUserDB().deleteAll();
    }

    static getUser(email: string): User {
        let users = UserService.getUsers();
        if(!users || !users[email]) {
            throw new UserError(UserErrorMessage.userNotFound);
        }
        return users[email];
    }

    static getUsers(): Users {
        return DB.getApplicationDB().get(UserService.APPLICATION_DB_USERS_KEY, <Users>{}); 
    }

    static getCurrentUser(): User {
        let user = DB.getUserDB().get(UserService.USER_DB_USER_KEY, new User);
        if(!user) {
            throw new UserError(UserErrorMessage.userNotFound);
        }
        return user;
    }

    static doesUserExist(email: string): boolean {
        let users = UserService.getUsers();
        return users && users[email]? true: false;
    }

    static doesCurrentUserExist(): boolean {
        let user = DB.getUserDB().get(UserService.USER_DB_USER_KEY);
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
}