import { AuthorizedUser } from '../../models/authorizedUser';
import { UserService } from '../../services/userService';

export function addAuthorizeUser(email: string, role: string): AuthorizedUser {
    return UserService.addAuthorizeUser(AuthorizedUser.from({email, role}));
}

export function removeEmailFromWhiteList(email: string): string {
    return UserService.removeAuthorizeUser(email);
}

export function getWhiteListedEmails(): Array<AuthorizedUser> {
    return UserService.getAuthorizeUserList();
}