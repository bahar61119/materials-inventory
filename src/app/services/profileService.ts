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

    static validateProfile() {
        if(!UserDBService.doesCurrentUserExist()){
            throw new ProfileError(ProfileErrorMessage.profileNotFound);
        }

        let user = UserDBService.getCurrentUser();
        let userWhitelisted = UserDBService.doesWhiteListedUser(user.email);
        if(!userWhitelisted) {
            throw new ProfileError(ProfileErrorMessage.notAuthorized);
        }
    }
}