import { ViewFileNames } from '../../constants/fileNames';
import { User } from '../../models/userModel';
import { loadView } from './loadView';

export function loadProfileUpdateView(user: User = User.of()) {
    return loadView(ViewFileNames.PROFILE_UPDATE, {user});
}