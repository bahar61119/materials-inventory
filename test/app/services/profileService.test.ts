import { ProfileErrorMessage } from '../../../src/app/constants/errorMessages';
import { ProfileError } from '../../../src/app/errors/profileError';
import { User } from '../../../src/app/models/userModel';
import { ProfileService } from '../../../src/app/services/profileService';
import { UserService } from "../../../src/app/services/userService";

describe("ProfileService", ()=>{
    describe("updateProfile", ()=>{
        beforeEach(()=> {
            let user = User.of()
                .withUUID('uuid')
                .withFirstName('firstName')
                .withLastName('lastName')
                .withEmail('email');
            UserService.validateUser = jest.fn();
            UserService.doesCurrentUserExist = jest.fn().mockReturnValue(false);
            UserService.getAdminUserEmail = jest.fn().mockReturnValue('admin');
            UserService.doesWhiteListedUser = jest.fn().mockReturnValue(true);
            UserService.doesUserExist = jest.fn().mockReturnValue(false);
            UserService.addUser = jest.fn().mockReturnValue(User.of().withUUID('uuid'));
            UserService.addCurrentUser = jest.fn();
            UserService.updateUser = jest.fn().mockReturnValue(User.of().withUUID('uuid'));
            UserService.updateCurrentUser = jest.fn();
            UserService.getCurrentUser = jest.fn().mockReturnValue(user);
        });

        test("success, when current user doesn't exists", ()=>{
            let user = User.of()
                .withUUID('uuid')
                .withFirstName('firstName')
                .withLastName('lastName')
                .withEmail('email');

            let returnedUser = ProfileService.updateProfile(user);
            expect(returnedUser.uuid).toBe('uuid');
            expect(UserService.addUser).toBeCalledTimes(1);
            expect(UserService.addCurrentUser).toBeCalledTimes(1);
            expect(UserService.updateUser).toBeCalledTimes(0);
            expect(UserService.updateCurrentUser).toBeCalledTimes(0);
        });

        test("success, when current user does exists", ()=>{
            UserService.doesCurrentUserExist = jest.fn().mockReturnValue(true);
            let user = User.of()
                .withUUID('uuid')
                .withFirstName('firstName')
                .withLastName('lastName')
                .withEmail('email');

            let returnedUser = ProfileService.updateProfile(user);
            expect(returnedUser.uuid).toBe('uuid');
            expect(UserService.addUser).toBeCalledTimes(0);
            expect(UserService.addCurrentUser).toBeCalledTimes(0);
            expect(UserService.updateUser).toBeCalledTimes(1);
            expect(UserService.updateCurrentUser).toBeCalledTimes(1);
        });

        test("success, when current user is admin user", ()=>{
            let user = User.of()
                .withUUID('uuid')
                .withFirstName('firstName')
                .withLastName('lastName')
                .withEmail('admin');

            let returnedUser = ProfileService.updateProfile(user);
            expect(returnedUser.uuid).toBe('uuid');
            expect(UserService.addUser).toBeCalledTimes(1);
            expect(UserService.addCurrentUser).toBeCalledTimes(1);
            expect(UserService.updateUser).toBeCalledTimes(0);
            expect(UserService.updateCurrentUser).toBeCalledTimes(0);
        });
        
        test("throws error, when user is not whitelisted", ()=>{
            UserService.doesWhiteListedUser = jest.fn().mockReturnValue(false);
            let user = User.of()
                .withUUID('uuid')
                .withFirstName('firstName')
                .withLastName('lastName')
                .withEmail('email');

            expect(() => {
                ProfileService.updateProfile(user);
            })
            .toThrowError(new ProfileError(ProfileErrorMessage.notAuthorized));
            expect(UserService.addUser).toBeCalledTimes(0);
            expect(UserService.addCurrentUser).toBeCalledTimes(0);
            expect(UserService.updateUser).toBeCalledTimes(0);
            expect(UserService.updateCurrentUser).toBeCalledTimes(0);
        });

        test("throws error, when email is registered with another user", ()=>{
            UserService.doesUserExist = jest.fn().mockReturnValue(true);
            let user = User.of()
                .withUUID('uuid')
                .withFirstName('firstName')
                .withLastName('lastName')
                .withEmail('email');

            expect(() => {
                ProfileService.updateProfile(user);
            })
            .toThrowError(new ProfileError(ProfileErrorMessage.emailExists));
            expect(UserService.addUser).toBeCalledTimes(0);
            expect(UserService.addCurrentUser).toBeCalledTimes(0);
            expect(UserService.updateUser).toBeCalledTimes(0);
            expect(UserService.updateCurrentUser).toBeCalledTimes(0);
        });
    });

    describe("validateProfile", ()=>{
        beforeEach(()=>{
            let user = User.of()
                .withUUID('uuid')
                .withFirstName('firstName')
                .withLastName('lastName')
                .withEmail('email');
            UserService.doesCurrentUserExist = jest.fn().mockReturnValue(true);
            UserService.getCurrentUser = jest.fn().mockReturnValue(user);
            UserService.doesWhiteListedUser = jest.fn().mockReturnValue(true);
            UserService.getAdminUserEmail = jest.fn().mockReturnValue("admin");
        });

        test("success", ()=>{
            ProfileService.validateProfile();
            expect(UserService.getCurrentUser).toBeCalledTimes(1);
            expect(UserService.doesWhiteListedUser).toBeCalledTimes(1);
        });

        test("success, when user is admin", ()=>{
            UserService.doesWhiteListedUser = jest.fn().mockReturnValue(false);
            UserService.getAdminUserEmail = jest.fn().mockReturnValue("email");
            ProfileService.validateProfile();
            expect(UserService.getCurrentUser).toBeCalledTimes(1);
            expect(UserService.doesWhiteListedUser).toBeCalledTimes(1);
        });

        test("throw error, when user not exists", ()=>{
            UserService.doesCurrentUserExist = jest.fn().mockReturnValue(false);
            expect(() => {
                ProfileService.validateProfile();
            })
            .toThrowError(new ProfileError(ProfileErrorMessage.profileNotFound));
        });

        test("throw error, when user is not whitelisted", ()=>{
            UserService.getCurrentUser = jest.fn().mockImplementation(()=>{
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
            UserService.getCurrentUser = jest.fn().mockReturnValue(user);
            UserService.getAdminUserEmail = jest.fn().mockReturnValue("admin");
            UserService.deleteUser = jest.fn();
            UserService.deleteCurrentUser = jest.fn();
        });

        test("success", ()=>{
            ProfileService.deleteProfile();
            expect(UserService.getCurrentUser).toBeCalledTimes(1);
            expect(UserService.getAdminUserEmail).toBeCalledTimes(1);
            expect(UserService.deleteUser).toBeCalledTimes(1);
            expect(UserService.deleteUser).toBeCalledWith("email");
            expect(UserService.deleteCurrentUser).toBeCalledTimes(1);
        });

        test("throw error, when user is admin", ()=>{
            UserService.getAdminUserEmail = jest.fn().mockReturnValue("email");
            expect(() => {
                ProfileService.deleteProfile();
            })
            .toThrowError(new ProfileError(ProfileErrorMessage.adminProfile));
            expect(UserService.getCurrentUser).toBeCalledTimes(1);
            expect(UserService.getAdminUserEmail).toBeCalledTimes(1);
            expect(UserService.deleteUser).toBeCalledTimes(0);
            expect(UserService.deleteCurrentUser).toBeCalledTimes(0);
        });
    });
});