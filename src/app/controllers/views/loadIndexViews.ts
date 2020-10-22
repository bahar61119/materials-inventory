import { AppConstant } from '../../constants/appConstants';
import { ViewFileNames } from "../../constants/fileNames";
import { User } from '../../models/userModel';
import { loadAppView } from './loadAppViews';

export function loadIndexView(profileUpdate: boolean = false) {
    const htmlService = HtmlService.createTemplateFromFile(ViewFileNames.INDEX);
    let data: {[key: string]: any} = {}
    if(profileUpdate) {
        data.user = User.of();
        htmlService.bodyContent = loadAppView(ViewFileNames.PROFILE_UPDATE, data);
    } else {
        htmlService.bodyContent = loadAppView(ViewFileNames.HOME, data);
    }
    return htmlService.evaluate().setTitle(AppConstant.APP_NAME);
}