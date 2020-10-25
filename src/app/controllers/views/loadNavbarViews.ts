import { ViewFileNames } from '../../constants/fileNames';
import { UserDBService } from '../../services/userDBService';
import { loadView } from "./loadView";

export function loadNavbarView() {
    let data: {[key: string]: any} = {};
    if(UserDBService.doesCurrentUserExist()){
        data.user = UserDBService.getCurrentUser();
    }
    return loadView(ViewFileNames.NAV_BAR, data);
}