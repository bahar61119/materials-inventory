import { ProfileErrorMessage } from '../constants/errorMessages';
import { ProfileError } from '../errors/profileError';
import { User } from '../models/userModel';
import { UserService } from './userService';

export class ProfileService {
    static updateProfile(user: User): User {
        let userExits = UserService.doesCurrentUserExist();
        UserService.validateUser(user, !userExits);
        let isSystemUser = user.email === UserService.getSystemUserEmail();

        if(!isSystemUser) {
            if(!UserService.doesAuthorizeUser(user.email)) {
                throw new ProfileError(ProfileErrorMessage.notAuthorized);
            }
    
            if(!userExits && UserService.doesUserExist(user.email)) {
                throw new ProfileError(ProfileErrorMessage.emailExists);
            }
        }

        if(!userExits) {
            user = UserService.addUser(user);
            UserService.addCurrentUser(user.email);
        } else {
            let currentUserInformation = UserService.getCurrentUser();
            user = UserService.updateUser(user,currentUserInformation.email);
            UserService.updateCurrentUser();
        }
        
        return user;
    }

    static deleteProfile(): User {
        let user = UserService.getCurrentUser();
        if(user.email === UserService.getSystemUserEmail()) {
            throw new ProfileError(ProfileErrorMessage.systemUserProfile);
        }
        UserService.deleteUser(user.email);
        UserService.deleteCurrentUser();
        return user;
    }

    static validateProfile(adminRequired = false) {
        if(!UserService.doesCurrentUserExist()){
            throw new ProfileError(ProfileErrorMessage.profileNotFound);
        }

        let user = UserService.getCurrentUser();
        let isAdmin = UserService.isAdminUser();

        if(adminRequired) {
            if(!isAdmin) {
                throw new ProfileError(ProfileErrorMessage.adminProfileRequired);
            }
        } else {
            let authorizedUser = UserService.doesAuthorizeUser(user.email);
            if(!isAdmin && !authorizedUser) {
                throw new ProfileError(ProfileErrorMessage.notAuthorized);
            }
        }
    }

    static isAdminProfile() {
        if(!UserService.doesCurrentUserExist()) {
            return false;
        }
        return UserService.isAdminUser();
    }
}