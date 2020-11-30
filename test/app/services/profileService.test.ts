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
            UserService.doesUserExist = jest.fn().mockReturnValue(false);
            UserService.getSystemUserEmail = jest.fn().mockReturnValue('admin');
            UserService.doesUserExist = jest.fn().mockReturnValue(false);
            UserService.addUser = jest.fn().mockReturnValue(User.of().withUUID('uuid'));
            UserService.updateUser = jest.fn().mockReturnValue(User.of().withUUID('uuid'));
            UserService.getUser = jest.fn().mockReturnValue(user);
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
            expect(UserService.updateUser).toBeCalledTimes(0);
        });

        test("success, when current user does exists", ()=>{
            UserService.doesUserExist = jest.fn().mockReturnValue(true);
            let user = User.of()
                .withUUID('uuid')
                .withFirstName('firstName')
                .withLastName('lastName')
                .withEmail('email');

            let returnedUser = ProfileService.updateProfile(user);
            expect(returnedUser.uuid).toBe('uuid');
            expect(UserService.addUser).toBeCalledTimes(0);
            expect(UserService.updateUser).toBeCalledTimes(1);
        });

        test("success, when current user is system user", ()=>{
            let user = User.of()
                .withUUID('uuid')
                .withFirstName('firstName')
                .withLastName('lastName')
                .withEmail('admin');

            let returnedUser = ProfileService.updateProfile(user);
            expect(returnedUser.uuid).toBe('uuid');
            expect(UserService.addUser).toBeCalledTimes(1);
            expect(UserService.updateUser).toBeCalledTimes(0);
        });
    });

    describe("validateProfile", ()=>{
        beforeEach(()=>{
            let user = User.of()
                .withUUID('uuid')
                .withFirstName('firstName')
                .withLastName('lastName')
                .withEmail('email');
            UserService.doesUserExist = jest.fn().mockReturnValue(true);
            UserService.getUser = jest.fn().mockReturnValue(user);
        });

        test("success", ()=>{
            ProfileService.validateProfile();
            expect(UserService.doesUserExist).toBeCalledTimes(1);
        });

        test("success, when user is admin", ()=>{
            ProfileService.validateProfile();
            expect(UserService.doesUserExist).toBeCalledTimes(1);
        });

        test("throw error, when user not exists", ()=>{
            UserService.doesUserExist = jest.fn().mockReturnValue(false);
            expect(() => {
                ProfileService.validateProfile();
            })
            .toThrowError(new ProfileError(ProfileErrorMessage.profileNotFound));
        });
    });

    describe("deleteProfile", ()=>{
        beforeEach(()=>{
            let user = User.of()
                .withUUID('uuid')
                .withFirstName('firstName')
                .withLastName('lastName')
                .withEmail('email');
            UserService.getUser = jest.fn().mockReturnValue(user);
            UserService.getSystemUserEmail = jest.fn().mockReturnValue("admin");
            UserService.deleteUser = jest.fn();
        });

        test("success", ()=>{
            ProfileService.deleteProfile();
            expect(UserService.getUser).toBeCalledTimes(1);
            expect(UserService.getSystemUserEmail).toBeCalledTimes(1);
            expect(UserService.deleteUser).toBeCalledTimes(1);
        });

        test("throw error, when user is admin", ()=>{
            UserService.getSystemUserEmail = jest.fn().mockReturnValue("email");
            expect(() => {
                ProfileService.deleteProfile();
            })
            .toThrowError(new ProfileError(ProfileErrorMessage.systemUserProfile));
            expect(UserService.getUser).toBeCalledTimes(1);
            expect(UserService.getSystemUserEmail).toBeCalledTimes(1);
            expect(UserService.deleteUser).toBeCalledTimes(0);
        });
    });
});