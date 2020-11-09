import { ViewFileNames } from '../../constants/fileNames';
import { User } from '../../models/userModel';
import { ProfileService } from '../../services/profileService';
import { UserService } from '../../services/userService';
import { loadView } from './loadView';

export function loadProfileUpdateView() {
    let user: User = User.of();
    if(UserService.doesCurrentUserExist()) {
        user = UserService.getCurrentUser();
    }
    let isAdmin = ProfileService.isAdminProfile();
    return loadView(ViewFileNames.PROFILE_UPDATE, {user, isAdmin});
}