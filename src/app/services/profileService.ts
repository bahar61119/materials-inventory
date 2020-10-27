import { ProfileErrorMessage } from '../constants/errorMessages';
import { ProfileError } from '../errors/profileError';
import { User } from '../models/userModel';
import { UserDBService } from './userDBService';

export class ProfileService {
    static updateProfile(user: User): User {
        let userExits = UserDBService.doesCurrentUserExist();
        UserDBService.validateUser(user, !userExits);
        let isAdminUser = user.email === UserDBService.getAdminUserEmail();

        if(!isAdminUser) {
            if(!UserDBService.doesWhiteListedUser(user.email)) {
                throw new ProfileError(ProfileErrorMessage.notAuthorized);
            }
    
            if(!userExits && UserDBService.doesUserExist(user.email)) {
                throw new ProfileError(ProfileErrorMessage.emailExists);
            }
        }

        if(!userExits) {
            user = UserDBService.addUser(user);
            UserDBService.addCurrentUser(user.email);
        } else {
            user = UserDBService.updateUser(user);
            UserDBService.updateCurrentUser();
        }
        
        return user;
    }

    static deleteProfile(): User {
        let user = UserDBService.getCurrentUser();
        if(user.email === UserDBService.getAdminUserEmail()) {
            throw new ProfileError(ProfileErrorMessage.adminProfile);
        }
        UserDBService.deleteUser(user.email);
        UserDBService.deleteCurrentUser();
        return user;
    }

    static validateProfile(adminRequired = false) {
        if(!UserDBService.doesCurrentUserExist()){
            throw new ProfileError(ProfileErrorMessage.profileNotFound);
        }

        let user = UserDBService.getCurrentUser();
        let isAdmin = user.email === UserDBService.getAdminUserEmail();

        if(adminRequired) {
            if(!isAdmin) {
                throw new ProfileError(ProfileErrorMessage.adminProfileRequired);
            }
        } else {
            let userWhitelisted = UserDBService.doesWhiteListedUser(user.email);
            if(!isAdmin && !userWhitelisted) {
                throw new ProfileError(ProfileErrorMessage.notAuthorized);
            }
        }
    }

    static isAdminProfile() {
        if(!UserDBService.doesCurrentUserExist()) {
            return false;
        }
        let user = UserDBService.getCurrentUser();
        return user.email === UserDBService.getAdminUserEmail();
    }
}