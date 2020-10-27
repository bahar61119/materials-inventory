import { ViewFileNames } from '../../constants/fileNames';
import { User } from '../../models/userModel';
import { ProfileService } from '../../services/profileService';
import { UserDBService } from '../../services/userDBService';
import { loadView } from './loadView';

export function loadProfileUpdateView() {
    let user: User = User.of();
    if(UserDBService.doesCurrentUserExist()) {
        user = UserDBService.getCurrentUser();
    }
    let isAdmin = ProfileService.isAdminProfile();
    return loadView(ViewFileNames.PROFILE_UPDATE, {user, isAdmin});
}