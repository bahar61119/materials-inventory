import { SettingsErrorMessage } from '../constants/errorMessages';
import { SettingsError } from '../errors/settingsError';
import { UserDBService } from './userDBService';

export class SettingsService {
    static addAuthorizeUser(authorizeUser: string) {
        if( authorizeUser === UserDBService.getAdminUserEmail() ||
            UserDBService.doesWhiteListedUser(authorizeUser)) {
            throw new SettingsError(SettingsErrorMessage.emailExists);
        } 

        UserDBService.addToWhiteList(authorizeUser);

        return authorizeUser;
    }

    static deleteAuthorizeUser(authorizeUser: string) {
        if(authorizeUser === UserDBService.getAdminUserEmail()) {
            throw new SettingsError(SettingsErrorMessage.adminDeleteError);
        }

        if(!UserDBService.doesWhiteListedUser(authorizeUser)) {
            throw new SettingsError(SettingsErrorMessage.emailNotFound);
        }

        UserDBService.removeFromWhiteList(authorizeUser);

        return authorizeUser;
    }
}