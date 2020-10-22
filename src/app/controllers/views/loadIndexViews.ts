import { AppConstant } from '../../constants/appConstants';
import { ViewFileNames } from "../../constants/fileNames";
import { loadAppView } from './loadAppViews';
import { loadProfileUpdateView } from './loadProfileViews';

export function loadIndexView(profileUpdate: boolean = false) {
    const htmlService = HtmlService.createTemplateFromFile(ViewFileNames.INDEX);
    if(profileUpdate) {
        htmlService.bodyContent = loadProfileUpdateView();
    } else {
        htmlService.bodyContent = loadAppView();
    }
    return htmlService.evaluate().setTitle(AppConstant.APP_NAME);
}