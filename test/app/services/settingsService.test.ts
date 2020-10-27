
import { SettingsErrorMessage } from '../../../src/app/constants/errorMessages';
import { SettingsError } from '../../../src/app/errors/settingsError';
import { SettingsService } from '../../../src/app/services/settingsService';
import { UserDBService } from "../../../src/app/services/userDBService";

describe("SettingsService", ()=>{
    describe("addAuthorizeUser", ()=>{
        beforeEach(()=>{
            UserDBService.getAdminUserEmail = jest.fn().mockReturnValue("admin");
            UserDBService.doesWhiteListedUser = jest.fn().mockReturnValue(false);
            UserDBService.addToWhiteList = jest.fn();
        });

        test("success", ()=>{
            SettingsService.addAuthorizeUser("email@user.com");
            expect(UserDBService.getAdminUserEmail).toBeCalledTimes(1);
            expect(UserDBService.doesWhiteListedUser).toBeCalledTimes(1);
            expect(UserDBService.addToWhiteList).toBeCalledTimes(1);
        });

        test("throw error, when user is admin", ()=>{
            expect(() => {
                SettingsService.addAuthorizeUser("admin");
            })
            .toThrowError(new SettingsError(SettingsErrorMessage.emailExists));
        });

        test("throw error, when user is already authorized", ()=>{
            UserDBService.doesWhiteListedUser = jest.fn().mockReturnValue(true);
            expect(() => {
                SettingsService.addAuthorizeUser("user");
            })
            .toThrowError(new SettingsError(SettingsErrorMessage.emailExists));
        });
    });
    describe("deleteAuthorizeUser", ()=>{
        beforeEach(()=>{
            UserDBService.getAdminUserEmail = jest.fn().mockReturnValue("admin");
            UserDBService.doesWhiteListedUser = jest.fn().mockReturnValue(true);
            UserDBService.removeFromWhiteList = jest.fn();
        });

        test("success", ()=>{
            SettingsService.deleteAuthorizeUser("email@user.com");
            expect(UserDBService.getAdminUserEmail).toBeCalledTimes(1);
            expect(UserDBService.doesWhiteListedUser).toBeCalledTimes(1);
            expect(UserDBService.removeFromWhiteList).toBeCalledTimes(1);
        });

        test("throw error, when user is admin", ()=>{
            expect(() => {
                SettingsService.deleteAuthorizeUser("admin");
            })
            .toThrowError(new SettingsError(SettingsErrorMessage.adminDeleteError));
        });

        test("throw error, when user is not authorized", ()=>{
            UserDBService.doesWhiteListedUser = jest.fn().mockReturnValue(false);
            expect(() => {
                SettingsService.deleteAuthorizeUser("user");
            })
            .toThrowError(new SettingsError(SettingsErrorMessage.emailNotFound));
        });
    });
});