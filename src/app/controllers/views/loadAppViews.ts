import { ViewFileNames } from "../../constants/fileNames";
import { loadView } from './loadView';

export function loadAppView() {
    return loadView(ViewFileNames.APP);
}