import { AppConstant } from '../../constants/appConstants';
import { ViewFileNames } from "../../constants/fileNames";
import { UserService } from '../../services/userService';
import { loadAppView } from './loadAppViews';

export function loadIndexView() {
    const htmlService = HtmlService.createTemplateFromFile(ViewFileNames.INDEX);
    if(!UserService.doesUserExist()) {
        htmlService.bodyContent = loadAppView(ViewFileNames.PROFILE_UPDATE);
    } else {
        htmlService.bodyContent = loadAppView(ViewFileNames.HOME);
    }
    return htmlService.evaluate().setTitle(AppConstant.APP_NAME);
}