import { KeyValue } from '../../models/keyValueModel';
import { SettingsService } from '../../services/settingsService';

export function updateSetting(setting: any) {
    return SettingsService.update(KeyValue.from(setting));
}

export function deleteSetting(setting: any) {
    return SettingsService.delete(KeyValue.from(setting));
}