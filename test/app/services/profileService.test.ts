import { ProfileErrorMessage } from '../../../src/app/constants/errorMessages';
import { ProfileError } from '../../../src/app/errors/profileError';
import { User } from '../../../src/app/models/userModel';
import { ProfileService } from '../../../src/app/services/profileService';
import { UserDBService } from "../../../src/app/services/userDBService";

describe("ProfileService", ()=>{
    describe("updateProfile", ()=>{
        beforeEach(()=> {
            let user = User.of()
                .withUUID('uuid')
                .withFirstName('firstName')
                .withLastName('lastName')
                .withEmail('email');
            UserDBService.validateUser = jest.fn();
            UserDBService.doesCurrentUserExist = jest.fn().mockReturnValue(false);
            UserDBService.getAdminUserEmail = jest.fn().mockReturnValue('admin');
            UserDBService.doesWhiteListedUser = jest.fn().mockReturnValue(true);
            UserDBService.doesUserExist = jest.fn().mockReturnValue(false);
            UserDBService.addUser = jest.fn().mockReturnValue(User.of().withUUID('uuid'));
            UserDBService.addCurrentUser = jest.fn();
            UserDBService.updateUser = jest.fn().mockReturnValue(User.of().withUUID('uuid'));
            UserDBService.updateCurrentUser = jest.fn();
            UserDBService.getCurrentUser = jest.fn().mockReturnValue(user);
        });

        test("success, when current user doesn't exists", ()=>{
            let user = User.of()
                .withUUID('uuid')
                .withFirstName('firstName')
                .withLastName('lastName')
                .withEmail('email');

            let returnedUser = ProfileService.updateProfile(user);
            expect(returnedUser.uuid).toBe('uuid');
            expect(UserDBService.addUser).toBeCalledTimes(1);
            expect(UserDBService.addCurrentUser).toBeCalledTimes(1);
            expect(UserDBService.updateUser).toBeCalledTimes(0);
            expect(UserDBService.updateCurrentUser).toBeCalledTimes(0);
        });

        test("success, when current user does exists", ()=>{
            UserDBService.doesCurrentUserExist = jest.fn().mockReturnValue(true);
            let user = User.of()
                .withUUID('uuid')
                .withFirstName('firstName')
                .withLastName('lastName')
                .withEmail('email');

            let returnedUser = ProfileService.updateProfile(user);
            expect(returnedUser.uuid).toBe('uuid');
            expect(UserDBService.addUser).toBeCalledTimes(0);
            expect(UserDBService.addCurrentUser).toBeCalledTimes(0);
            expect(UserDBService.updateUser).toBeCalledTimes(1);
            expect(UserDBService.updateCurrentUser).toBeCalledTimes(1);
        });

        test("success, when current user is admin user", ()=>{
            let user = User.of()
                .withUUID('uuid')
                .withFirstName('firstName')
                .withLastName('lastName')
                .withEmail('admin');

            let returnedUser = ProfileService.updateProfile(user);
            expect(returnedUser.uuid).toBe('uuid');
            expect(UserDBService.addUser).toBeCalledTimes(1);
            expect(UserDBService.addCurrentUser).toBeCalledTimes(1);
            expect(UserDBService.updateUser).toBeCalledTimes(0);
            expect(UserDBService.updateCurrentUser).toBeCalledTimes(0);
        });
        
        test("throws error, when user is not whitelisted", ()=>{
            UserDBService.doesWhiteListedUser = jest.fn().mockReturnValue(false);
            let user = User.of()
                .withUUID('uuid')
                .withFirstName('firstName')
                .withLastName('lastName')
                .withEmail('email');

            expect(() => {
                ProfileService.updateProfile(user);
            })
            .toThrowError(new ProfileError(ProfileErrorMessage.notAuthorized));
            expect(UserDBService.addUser).toBeCalledTimes(0);
            expect(UserDBService.addCurrentUser).toBeCalledTimes(0);
            expect(UserDBService.updateUser).toBeCalledTimes(0);
            expect(UserDBService.updateCurrentUser).toBeCalledTimes(0);
        });

        test("throws error, when email is registered with another user", ()=>{
            UserDBService.doesUserExist = jest.fn().mockReturnValue(true);
            let user = User.of()
                .withUUID('uuid')
                .withFirstName('firstName')
                .withLastName('lastName')
                .withEmail('email');

            expect(() => {
                ProfileService.updateProfile(user);
            })
            .toThrowError(new ProfileError(ProfileErrorMessage.emailExists));
            expect(UserDBService.addUser).toBeCalledTimes(0);
            expect(UserDBService.addCurrentUser).toBeCalledTimes(0);
            expect(UserDBService.updateUser).toBeCalledTimes(0);
            expect(UserDBService.updateCurrentUser).toBeCalledTimes(0);
        });
    });

    describe("validateProfile", ()=>{
        beforeEach(()=>{
            let user = User.of()
                .withUUID('uuid')
                .withFirstName('firstName')
                .withLastName('lastName')
                .withEmail('email');
            UserDBService.doesCurrentUserExist = jest.fn().mockReturnValue(true);
            UserDBService.getCurrentUser = jest.fn().mockReturnValue(user);
            UserDBService.doesWhiteListedUser = jest.fn().mockReturnValue(true);
            UserDBService.getAdminUserEmail = jest.fn().mockReturnValue("admin");
        });

        test("success", ()=>{
            ProfileService.validateProfile();
            expect(UserDBService.getCurrentUser).toBeCalledTimes(1);
            expect(UserDBService.doesWhiteListedUser).toBeCalledTimes(1);
        });

        test("success, when user is admin", ()=>{
            UserDBService.doesWhiteListedUser = jest.fn().mockReturnValue(false);
            UserDBService.getAdminUserEmail = jest.fn().mockReturnValue("email");
            ProfileService.validateProfile();
            expect(UserDBService.getCurrentUser).toBeCalledTimes(1);
            expect(UserDBService.doesWhiteListedUser).toBeCalledTimes(1);
        });

        test("throw error, when user not exists", ()=>{
            UserDBService.doesCurrentUserExist = jest.fn().mockReturnValue(false);
            expect(() => {
                ProfileService.validateProfile();
            })
            .toThrowError(new ProfileError(ProfileErrorMessage.profileNotFound));
        });

        test("throw error, when user is not whitelisted", ()=>{
            UserDBService.getCurrentUser = jest.fn().mockImplementation(()=>{
                throw new ProfileError(ProfileErrorMessage.notAuthorized);
            });
            expect(() => {
                ProfileService.validateProfile();
            })
            .toThrowError(new ProfileError(ProfileErrorMessage.notAuthorized));
        });

        test("throw error, when user is not admin", ()=>{
            expect(() => {
                ProfileService.validateProfile(true);
            })
            .toThrowError(new ProfileError(ProfileErrorMessage.adminProfileRequired));
        });
    });

    describe("deleteProfile", ()=>{
        beforeEach(()=>{
            let user = User.of()
                .withUUID('uuid')
                .withFirstName('firstName')
                .withLastName('lastName')
                .withEmail('email');
            UserDBService.getCurrentUser = jest.fn().mockReturnValue(user);
            UserDBService.getAdminUserEmail = jest.fn().mockReturnValue("admin");
            UserDBService.deleteUser = jest.fn();
            UserDBService.deleteCurrentUser = jest.fn();
        });

        test("success", ()=>{
            ProfileService.deleteProfile();
            expect(UserDBService.getCurrentUser).toBeCalledTimes(1);
            expect(UserDBService.getAdminUserEmail).toBeCalledTimes(1);
            expect(UserDBService.deleteUser).toBeCalledTimes(1);
            expect(UserDBService.deleteUser).toBeCalledWith("email");
            expect(UserDBService.deleteCurrentUser).toBeCalledTimes(1);
        });

        test("throw error, when user is admin", ()=>{
            UserDBService.getAdminUserEmail = jest.fn().mockReturnValue("email");
            expect(() => {
                ProfileService.deleteProfile();
            })
            .toThrowError(new ProfileError(ProfileErrorMessage.adminProfile));
            expect(UserDBService.getCurrentUser).toBeCalledTimes(1);
            expect(UserDBService.getAdminUserEmail).toBeCalledTimes(1);
            expect(UserDBService.deleteUser).toBeCalledTimes(0);
            expect(UserDBService.deleteCurrentUser).toBeCalledTimes(0);
        });
    });
});