import { ViewFileNames } from '../../constants/fileNames';
import { User } from '../../models/userModel';
import { UserDBService } from '../../services/userDBService';
import { loadView } from './loadView';

export function loadProfileUpdateView() {
    let user: User = User.of();
    if(UserDBService.doesCurrentUserExist()) {
        user = UserDBService.getCurrentUser();
    }
    return loadView(ViewFileNames.PROFILE_UPDATE, {user});
}