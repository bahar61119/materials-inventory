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
            UserDBService.addUser = jest.fn().mockReturnValue(user);
            UserDBService.addCurrentUser = jest.fn();
            UserDBService.updateUser = jest.fn().mockReturnValue(user);
            UserDBService.updateCurrentUser = jest.fn();
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
});