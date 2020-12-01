import { DBKeys } from '../../constants/dbKeys';
import { ViewFileNames } from '../../constants/fileNames';
import { User } from '../../models/userModel';
import { SettingsService } from '../../services/settingsService';
import { UserService } from '../../services/userService';
import { loadView } from './loadView';

export function loadProfileUpdateView() {
    let user: User = User.of();
    if(UserService.doesUserExist()) {
        user = UserService.getUser();
    } else {
        user.email = UserService.getSystemUserEmail();
    }
    let currencies = SettingsService.getList(DBKeys.CURRENCIES);
    let showSettings = UserService.doesUserExist();
    return loadView(ViewFileNames.PROFILE_UPDATE, {user, showSettings, currencies});
}