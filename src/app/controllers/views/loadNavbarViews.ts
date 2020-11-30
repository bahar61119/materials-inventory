import { ViewFileNames } from '../../constants/fileNames';
import { UserService } from '../../services/userService';
import { loadView } from "./loadView";

export function loadNavbarView() {
    let data: {[key: string]: any} = {};
    if(UserService.doesUserExist()){
        data.user = UserService.getUser();
    }
    data.showSettings = UserService.doesUserExist();
    return loadView(ViewFileNames.NAV_BAR, data);
}