import { ViewFileNames } from "../../constants/fileNames";
import { loadHomeView } from './loadHomeViews';
import { loadNavbarView } from './loadNavbarViews';
import { loadProfileUpdateView } from './loadProfileViews';
import { loadView } from './loadView';

export function loadAppView(appContentFileName: string) {
    let appContents: string;

    switch(appContentFileName) {
        case ViewFileNames.PROFILE_UPDATE:
            appContents = loadProfileUpdateView();
            break;
        default:
            appContents = loadHomeView();
    }

    let navbarContents = loadNavbarView();
    return loadView(ViewFileNames.APP, {appContents, navbarContents});
}