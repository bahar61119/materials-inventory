import { Entry } from '../../models/entryModel';
import { EntryService } from '../../services/entryService';

export function getEntryList() {
    return EntryService.getEntryList();
}

export function deleteEntry(entryId: string) {
    return EntryService.deleteEntry(String(entryId));
}

export function updateEntry(entryData: any) {
    console.log(entryData);
    return EntryService.updateEntry(Entry.from(entryData));
}