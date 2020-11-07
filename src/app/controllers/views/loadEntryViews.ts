import { ViewFileNames } from '../../constants/fileNames';
import { Entry } from '../../models/entryModel';
import { EntryService } from '../../services/entryService';
import { ProfileService } from '../../services/profileService';
import { loadView } from './loadView';

export function loadEntryListView() {
    ProfileService.validateProfile();
    return loadView(ViewFileNames.ENTRY_LIST);
}

export function loadAddEntryView() {
    ProfileService.validateProfile();
    let data = {
        entry: Entry.of(),
        isEdit: false
    }
    return loadView(ViewFileNames.UPDATE_ENTRY, data);
}
  
export function loadEditEntryView(entryId: string) {
    ProfileService.validateProfile();
    let entry = EntryService.getEntry(String(entryId));
    let data = {
        entry,
        isEdit: true
    }
    return loadView(ViewFileNames.UPDATE_ENTRY, data);
}