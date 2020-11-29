import { SettingsErrorMessage } from '../../../src/app/constants/errorMessages';
import { DB } from '../../../src/app/db/db';
import { SettingsError } from '../../../src/app/errors/settingsError';
import { KeyValue } from '../../../src/app/models/keyValueModel';
import { SettingsService } from '../../../src/app/services/settingsService';

describe("SettingsService", ()=>{
    describe("getList", ()=> {
        beforeEach(()=>{
            let get = jest.fn().mockReturnValue(["value"]);
            // DB.getApplicationDB = jest.fn().mockReturnValue({get});
            DB.getUserDB = jest.fn().mockReturnValue({get});
            SettingsService.validateSettingsKey = jest.fn();
        });

        test("success", ()=>{
            let settings = SettingsService.getList("key");
            expect(settings).toStrictEqual(["value"]);
            expect(SettingsService.validateSettingsKey).toBeCalledWith("key");
        });

        test("throws validateSettingsKey error", ()=>{
            SettingsService.validateSettingsKey = jest.fn().mockImplementation(()=>{
                throw new SettingsError(SettingsErrorMessage.invalidSettingsKey);
            });

            expect(() => {
                SettingsService.getList("key");
            })
            .toThrowError(new SettingsError(SettingsErrorMessage.invalidSettingsKey));
        });
    });

    describe("update", ()=> {
        beforeEach(()=>{
            let put = jest.fn();
            // DB.getApplicationDB = jest.fn().mockReturnValue({put});
            DB.getUserDB = jest.fn().mockReturnValue({put});
            SettingsService.validateSettingsKey = jest.fn();
            SettingsService.getList = jest.fn().mockReturnValue(["value"]);
        });

        test("success", ()=>{
            let settingsValue = new KeyValue("key", "newValue");
            SettingsService.update(settingsValue);
            // expect(DB.getApplicationDB().put).toBeCalledWith("key",["value", "newValue"]);
            expect(DB.getUserDB().put).toBeCalledWith("key",["value", "newValue"]);
        });

        test("throws setting value null", ()=>{
            let settingsValue = new KeyValue("key", null);
            expect(() => {
                SettingsService.update(settingsValue);
            })
            .toThrowError(new SettingsError(SettingsErrorMessage.invalidSettingsValue));
        });

        test("throws setting value not string", ()=>{
            let settingsValue = new KeyValue("key", 1);
            expect(() => {
                SettingsService.update(settingsValue);
            })
            .toThrowError(new SettingsError(SettingsErrorMessage.invalidSettingsValue));
        });

        test("throws validateSettingsKey error", ()=>{
            SettingsService.validateSettingsKey = jest.fn().mockImplementation(()=>{
                throw new SettingsError(SettingsErrorMessage.invalidSettingsKey);
            });

            let settingsValue = new KeyValue("key", "newValue");
            expect(() => {
                SettingsService.update(settingsValue);
            })
            .toThrowError(new SettingsError(SettingsErrorMessage.invalidSettingsKey));
        });
    });

    describe("delete", ()=> {
        beforeEach(()=>{
            let put = jest.fn();
            // DB.getApplicationDB = jest.fn().mockReturnValue({put});
            DB.getUserDB = jest.fn().mockReturnValue({put});
            SettingsService.validateSettingsKey = jest.fn();
            SettingsService.getList = jest.fn().mockReturnValue(["value", "oldValue"]);
        });

        test("success", ()=>{
            let settingsValue = new KeyValue("key", "oldValue");
            SettingsService.delete(settingsValue);
            // expect(DB.getApplicationDB().put).toBeCalledWith("key",["value"]);
            expect(DB.getUserDB().put).toBeCalledWith("key",["value"]);
        });

        test("throws setting value null", ()=>{
            let settingsValue = new KeyValue("key", null);
            expect(() => {
                SettingsService.delete(settingsValue);
            })
            .toThrowError(new SettingsError(SettingsErrorMessage.invalidSettingsValue));
        });

        test("throws setting value not string", ()=>{
            let settingsValue = new KeyValue("key", 1);
            expect(() => {
                SettingsService.delete(settingsValue);
            })
            .toThrowError(new SettingsError(SettingsErrorMessage.invalidSettingsValue));
        });

        test("throws validateSettingsKey error", ()=>{
            SettingsService.validateSettingsKey = jest.fn().mockImplementation(()=>{
                throw new SettingsError(SettingsErrorMessage.invalidSettingsKey);
            });

            let settingsValue = new KeyValue("key", "newValue");
            expect(() => {
                SettingsService.delete(settingsValue);
            })
            .toThrowError(new SettingsError(SettingsErrorMessage.invalidSettingsKey));
        });
    });
});