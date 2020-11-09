import { UserRole } from '../constants/userRoles';

export class AuthorizedUser implements AuthorizedUserInterface {
    email: string;
    role: UserRole;

    constructor() {
        this.email = '';
        this.role = UserRole.EDITOR;
    }

    static of(): AuthorizedUser {
        return new AuthorizedUser();
    }

    static from(authorizeUserData: object): AuthorizedUser {
        return Object.assign(new AuthorizedUser, authorizeUserData);
    }
}