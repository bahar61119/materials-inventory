import { UserRole } from '../constants/userRoles';

export class AuthorizedUser implements AuthorizedUserInterface {
    email: string;
    role: UserRole;

    constructor() {
        this.email = '';
        this.role = UserRole.BASIC;
    }
}