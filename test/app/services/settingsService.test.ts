
import { SettingsErrorMessage } from '../../../src/app/constants/errorMessages';
import { SettingsError } from '../../../src/app/errors/settingsError';
import { SettingsService } from '../../../src/app/services/settingsService';
import { UserService } from "../../../src/app/services/userService";

describe("SettingsService", ()=>{
    describe("addAuthorizeUser", ()=>{
        beforeEach(()=>{
            UserService.getAdminUserEmail = jest.fn().mockReturnValue("admin");
            UserService.doesWhiteListedUser = jest.fn().mockReturnValue(false);
            UserService.addToWhiteList = jest.fn();
        });

        test("success", ()=>{
            SettingsService.addAuthorizeUser("email@user.com");
            expect(UserService.getAdminUserEmail).toBeCalledTimes(1);
            expect(UserService.doesWhiteListedUser).toBeCalledTimes(1);
            expect(UserService.addToWhiteList).toBeCalledTimes(1);
        });

        test("throw error, when user is admin", ()=>{
            expect(() => {
                SettingsService.addAuthorizeUser("admin");
            })
            .toThrowError(new SettingsError(SettingsErrorMessage.emailExists));
        });

        test("throw error, when user is already authorized", ()=>{
            UserService.doesWhiteListedUser = jest.fn().mockReturnValue(true);
            expect(() => {
                SettingsService.addAuthorizeUser("user");
            })
            .toThrowError(new SettingsError(SettingsErrorMessage.emailExists));
        });
    });
    describe("deleteAuthorizeUser", ()=>{
        beforeEach(()=>{
            UserService.getAdminUserEmail = jest.fn().mockReturnValue("admin");
            UserService.doesWhiteListedUser = jest.fn().mockReturnValue(true);
            UserService.removeFromWhiteList = jest.fn();
        });

        test("success", ()=>{
            SettingsService.deleteAuthorizeUser("email@user.com");
            expect(UserService.getAdminUserEmail).toBeCalledTimes(1);
            expect(UserService.doesWhiteListedUser).toBeCalledTimes(1);
            expect(UserService.removeFromWhiteList).toBeCalledTimes(1);
        });

        test("throw error, when user is admin", ()=>{
            expect(() => {
                SettingsService.deleteAuthorizeUser("admin");
            })
            .toThrowError(new SettingsError(SettingsErrorMessage.adminDeleteError));
        });

        test("throw error, when user is not authorized", ()=>{
            UserService.doesWhiteListedUser = jest.fn().mockReturnValue(false);
            expect(() => {
                SettingsService.deleteAuthorizeUser("user");
            })
            .toThrowError(new SettingsError(SettingsErrorMessage.emailNotFound));
        });
    });
});