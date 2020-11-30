import { ProfileErrorMessage } from '../constants/errorMessages';
import { ProfileError } from '../errors/profileError';
import { User } from '../models/userModel';
import { UserService } from './userService';

export class ProfileService {
    static updateProfile(user: User): User {
        let userExits = UserService.doesUserExist();
        UserService.validateUser(user, !userExits);

        if(!userExits) {
            user = UserService.addUser(user);
        } else {
            user = UserService.updateUser(user);
        }
        
        return user;
    }

    static deleteProfile(): User {
        let user = UserService.getUser();
        if(user.email === UserService.getSystemUserEmail()) {
            throw new ProfileError(ProfileErrorMessage.systemUserProfile);
        }
        UserService.deleteUser();
        return user;
    }

    static validateProfile() {
        if(!UserService.doesUserExist()){
            throw new ProfileError(ProfileErrorMessage.profileNotFound);
        }
    }
}