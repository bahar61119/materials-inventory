import { ViewFileNames } from '../../constants/fileNames';
import { ProfileService } from '../../services/profileService';
import { UserService } from '../../services/userService';
import { loadView } from "./loadView";

export function loadNavbarView() {
    let data: {[key: string]: any} = {};
    if(UserService.doesCurrentUserExist()){
        data.user = UserService.getCurrentUser();
        data.isAdmin = ProfileService.isAdminProfile();
    }
    return loadView(ViewFileNames.NAV_BAR, data);
}