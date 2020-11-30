import { UserErrorMessage } from '../../../src/app/constants/errorMessages';
import { DB } from '../../../src/app/db/db';
import { UserError } from "../../../src/app/errors/userError";
import { User } from '../../../src/app/models/userModel';
import { UserService } from '../../../src/app/services/userService';

describe("UserService Test", ()=>{
    describe("validateUser", ()=>{
        test("throw error for new user",()=>{
            let user = new User();
            
            let validateErrorMessage = [
                UserErrorMessage.validationError("FirstName"),
                UserErrorMessage.validationError("LastName"),
                UserErrorMessage.validationError("Email")
            ].join(", ");
            expect(() => {
                UserService.validateUser(user, true);
            })
            .toThrowError(new UserError(validateErrorMessage));
        });

        test("throw error for old user",()=>{
            let user = new User();
            let validateErrorMessage = [
                UserErrorMessage.validationError("UUID"),
                UserErrorMessage.validationError("FirstName"),
                UserErrorMessage.validationError("LastName"),
                UserErrorMessage.validationError("Email")
            ].join(", ");
            expect(() => {
                UserService.validateUser(user, false);
            })
            .toThrowError(new UserError(validateErrorMessage));
        });

        test("no error", ()=>{
            let user = User.of()
                .withUUID("UUID")
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");
            UserService.validateUser(user, false);          
        });
    });

    describe("addUser", ()=>{
        beforeEach(()=>{
            UserService.validateUser = jest.fn();
            UserService.getUuid = jest.fn().mockReturnValue("uuid");
            UserService.getSystemUserEmail = jest.fn().mockReturnValue("Email");
            let get = jest.fn().mockReturnValue(null);
            let put = jest.fn();
            DB.getUserDB = jest.fn().mockReturnValue({put, get});
        });

        test("success", ()=>{
            let user = User.of()
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");
            let addedUser = UserService.addUser(user);
            expect(addedUser.uuid).toBe("uuid");

            let put = DB.getUserDB().put;
            expect(put).toBeCalledTimes(1);
            expect(put).toBeCalledWith("user", user);
        });

        test("throws error when user exists", ()=>{
            let user = User.of()
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");

            let get = jest.fn().mockReturnValue(user);
            let put = jest.fn();
            DB.getUserDB = jest.fn().mockReturnValue({put, get});

            expect(() => {
                UserService.addUser(user);
            })
            .toThrowError(new UserError(UserErrorMessage.userAlreadyExists));
        });

        test("throws error when email is not system user email", ()=>{
            let user = User.of()
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("NewEmail");

            expect(() => {
                UserService.addUser(user);
            })
            .toThrowError(new UserError(UserErrorMessage.userEmailNotAuthorized));
        });
    });

    describe("updateUser", ()=>{
        beforeEach(()=>{
            UserService.validateUser = jest.fn();

            let user = User.of()
                .withUUID("uuid")
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");

            let get = jest.fn().mockReturnValue(user);
            let put = jest.fn();
            DB.getUserDB = jest.fn().mockReturnValue({put, get});
        });

        test("success", ()=>{
            let user = User.of()
                .withUUID("uuid")
                .withFirstName("FirstNameUpdate")
                .withLastName("LastNameUpdate")
                .withEmail("Email");
            let updatedUser = UserService.updateUser(user);
            expect(updatedUser.uuid).toBe("uuid");
            expect(updatedUser.firstName).toBe("FirstNameUpdate");
            expect(updatedUser.lastName).toBe("LastNameUpdate");

            let put = DB.getUserDB().put;
            expect(put).toBeCalledTimes(1);
        });

        test("throws error when user don't exists", ()=>{
            let get = jest.fn().mockReturnValue(null);
            let put = jest.fn();
            DB.getUserDB = jest.fn().mockReturnValue({put, get});
            let user = User.of()
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");

            expect(() => {
                UserService.updateUser(user);
            })
            .toThrowError(new UserError(UserErrorMessage.userNotFound));
        });

        test("throws error when email is not system user email", ()=>{
            let user = User.of()
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("NewEmail");

            expect(() => {
                UserService.updateUser(user);
            })
            .toThrowError(new UserError(UserErrorMessage.userEmailNotAuthorized));
        });
    });

    describe("deleteUser", ()=>{
        beforeEach(()=>{
            let user = User.of()
                .withUUID("uuid")
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");
            let get = jest.fn().mockReturnValue(user);
            let deleteMethod = jest.fn();
            DB.getUserDB = jest.fn().mockReturnValue({delete:deleteMethod, get});
        });

        test("success", ()=>{
            UserService.deleteUser();
            let deleteMethod = DB.getUserDB().delete;
            expect(deleteMethod).toBeCalledTimes(1);
        });

        test("throws error when user don't exists", ()=>{
            let get = jest.fn().mockReturnValue(null);
            let deleteMethod = jest.fn();
            DB.getUserDB = jest.fn().mockReturnValue({delete:deleteMethod, get});
            expect(() => {
                UserService.deleteUser();
            })
            .toThrowError(new UserError(UserErrorMessage.userNotFound));
        });
    });

    describe("getUser", ()=>{
        beforeEach(()=>{
            let user = User.of()
                .withUUID("uuid")
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");
            let get = jest.fn().mockReturnValue(user);
            DB.getUserDB = jest.fn().mockReturnValue({get});
        });

        test("success", ()=>{
            let user = UserService.getUser();
            expect(user.uuid).toBe("uuid");
            expect(user.firstName).toBe("FirstName");
            expect(user.lastName).toBe("LastName");
            expect(user.email).toBe("Email");
        });

        test("throws error when user don't exists", ()=>{
            let get = jest.fn().mockReturnValue(null);
            DB.getUserDB = jest.fn().mockReturnValue({get});
            expect(() => {
                UserService.getUser();
            })
            .toThrowError(new UserError(UserErrorMessage.userNotFound));
        });
    });
});