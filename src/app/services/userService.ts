import { UserErrorMessage } from '../constants/errorMessages';
import { DB } from "../db/db";
import { UserError } from '../errors/userError';

export class UserService {
    private static USER_DB_USER_KEY = "user";
    private static APPLICATION_DB_USERS_KEY = "users";

    private static userDB = DB.getUserDB();
    private static applicationDB = DB.getApplicationDB();

    static addUser(user: User): User {
        UserService.validateUser(user, true);
        let users: Users = UserService.getUsers();
        users = users? users: {};
        
        if(users[user.email]) {
            throw new UserError(UserErrorMessage.userAlreadyExists);
        }

        user.withUUID(Utilities.getUuid());
        users[user.email] = user;

        UserService.applicationDB.put(UserService.APPLICATION_DB_USERS_KEY, users);

        return user;
    }

    static updateUser(user: User, oldEmail?: string): void {
        UserService.validateUser(user, false);
        let email = oldEmail? oldEmail: user.email;
        let users: Users = UserService.getUsers();
        users = users? users: {};
        
        if(!users[email]) {
            throw new UserError(UserErrorMessage.userNotFound);
        }

        users[email] = user;
        if(oldEmail) delete users[oldEmail];

        UserService.applicationDB.put(UserService.APPLICATION_DB_USERS_KEY, users);
    }

    static updateCurrentUser(user: User): User {
        UserService.validateUser(user, true);
        if(!UserService.exists(user.email)) {
            throw new UserError(UserErrorMessage.userNotFound);
        }
        UserService.userDB.put(UserService.USER_DB_USER_KEY, user);
        return user;
    }

    static deleteUser(email: string): User {
        let users: Users = UserService.getUsers();
        users = users? users: {};
        
        if(!users[email]) {
            throw new UserError(UserErrorMessage.userNotFound);
        }

        let user = users[email];
        delete users[email];

        return user;
    }

    static deleteCurrentUser(): void {
        UserService.userDB.deleteAll();
    }

    static getUser(email: string): User {
        let users = UserService.getUsers();
        if(!users[email]) {
            throw new UserError(UserErrorMessage.userNotFound);
        }
        return users[email];
    }

    static getUsers(): Users {
        return UserService.applicationDB.get(UserService.APPLICATION_DB_USERS_KEY, <Users>{}); 
    }

    static getCurrentUser(): User {
        let user = UserService.userDB.get(UserService.USER_DB_USER_KEY, new User);
        if(!user) {
            throw new UserError(UserErrorMessage.userNotFound);
        }
        return user;
    }

    static exists(email: string): boolean {
        let users = UserService.getUsers();
        return users[email]? true: false;
    }

    static validateUser(user: User, newUser: boolean) {
        let errors: string [] = [];
        if(!user.email) {
            errors.push(UserErrorMessage.validationError("Email"));
        }
        if(!user.firstName) {
            errors.push(UserErrorMessage.validationError("FirstName"));
        }
        if(!user.lastName) {
            errors.push(UserErrorMessage.validationError("LastName"));
        }
        if(!newUser && user.uuid) {
            errors.push(UserErrorMessage.validationError("UUID"));
        }

        if(errors.length > 0) {
            throw new UserError(errors.join(', '))
        }
    }
}