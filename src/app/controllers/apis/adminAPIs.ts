import { UserDBService } from '../../services/userDBService';

export function addEmailToWhiteList(email: string): string {
    return UserDBService.addToWhiteList(email);
}

export function removeEmailFromWhiteList(email: string): string {
    return UserDBService.removeFromWhiteList(email);
}

export function getWhiteListedEmails(): Array<string> {
    return UserDBService.getWhiteListUsers();
}