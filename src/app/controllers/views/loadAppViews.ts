import { ViewFileNames } from "../../constants/fileNames";
import { loadHomeView } from './loadHomeViews';
import { loadProfileUpdateView } from './loadProfileViews';
import { loadView } from './loadView';

export function loadAppView(appContentFileName: string, data: {[key: string]: any} = {}) {
    let appContents: string;

    switch(appContentFileName) {
        case ViewFileNames.PROFILE_UPDATE:
            appContents = loadProfileUpdateView(data.user);
            break;
        default:
            appContents = loadHomeView();
    }
    return loadView(ViewFileNames.APP, {appContents});
}