import { AppConstant } from '../../constants/appConstants';
import { ViewFileNames } from "../../constants/fileNames";
import { User } from '../../models/userModel';
import { UserDBService } from '../../services/userDBService';
import { loadAppView } from './loadAppViews';

export function loadIndexView() {
    const htmlService = HtmlService.createTemplateFromFile(ViewFileNames.INDEX);
    let data: {[key: string]: any} = {}
    if(!UserDBService.doesCurrentUserExist()) {
        data.user = User.of();
        htmlService.bodyContent = loadAppView(ViewFileNames.PROFILE_UPDATE, data);
    } else {
        htmlService.bodyContent = loadAppView(ViewFileNames.HOME, data);
    }
    return htmlService.evaluate().setTitle(AppConstant.APP_NAME);
}