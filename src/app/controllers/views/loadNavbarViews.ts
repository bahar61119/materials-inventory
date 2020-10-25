import { ViewFileNames } from '../../constants/fileNames';
import { ProfileService } from '../../services/profileService';
import { UserDBService } from '../../services/userDBService';
import { loadView } from "./loadView";

export function loadNavbarView() {
    let data: {[key: string]: any} = {};
    if(UserDBService.doesCurrentUserExist()){
        data.user = UserDBService.getCurrentUser();
        data.isAdmin = ProfileService.isAdminProfile();
    }
    return loadView(ViewFileNames.NAV_BAR, data);
}