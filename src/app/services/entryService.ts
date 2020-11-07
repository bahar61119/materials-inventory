import { SheetConstants } from '../constants/sheetConstants';
import { Entry } from '../models/entryModel';
import { EntityService } from './entityService';

export class EntryService extends EntityService {
    private static DATE_FORMAT = "yyyy-MM-dd";
    static getEntryList() {
        let entryList: Array<Entry> = EntryService.getEntityList(SheetConstants.ENTRIES_SHEET_NAME, Entry.name);
        return entryList.map((entry: Entry) => {
            entry.entryExpectedDeliveryDate = EntryService.convertDateString(entry.entryExpectedDeliveryDate, EntryService.DATE_FORMAT);
            entry.entryDeliveryDate = EntryService.convertDateString(entry.entryDeliveryDate, EntryService.DATE_FORMAT);
            return entry;
        });
    }

    static getEntry(entryId: string): Entry {
        let entry: Entry = EntryService.getEntity(entryId, SheetConstants.ENTRIES_SHEET_NAME, Entry.name);
        entry.entryExpectedDeliveryDate = EntryService.convertDateString(entry.entryExpectedDeliveryDate, EntryService.DATE_FORMAT);
        entry.entryDeliveryDate = EntryService.convertDateString(entry.entryDeliveryDate, EntryService.DATE_FORMAT);
        return entry;
    }

    static updateEntry(entry: Entry): string {
        return EntryService.updateEntity(entry, "entryId", SheetConstants.ENTRIES_SHEET_NAME, Entry.name);
    }

    static deleteEntry(entryId: string): string {
        return EntryService.deleteEntity(entryId, SheetConstants.ENTRIES_SHEET_NAME, Entry.name);
    }
}