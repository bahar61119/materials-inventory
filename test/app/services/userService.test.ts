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
            UserService.getUsers = jest.fn().mockReturnValue({});
            UserService.getUuid = jest.fn().mockReturnValue("uuid");
            let put = jest.fn();
            DB.getApplicationDB = jest.fn().mockReturnValue({put});
        });

        test("success", ()=>{
            let user = User.of()
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");
            let addedUser = UserService.addUser(user);
            expect(addedUser.uuid).toBe("uuid");

            let put = DB.getApplicationDB().put;
            expect(put).toBeCalledTimes(1);
            expect(put).toBeCalledWith("users", {"Email": user});
        });

        test("throws error when user exists", ()=>{
            let user = User.of()
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");

            UserService.getUsers = jest.fn().mockReturnValue({"Email": user});

            expect(() => {
                UserService.addUser(user);
            })
            .toThrowError(new UserError(UserErrorMessage.userAlreadyExists));
        });
    });

    describe("addCurrentUser", ()=>{
        beforeEach(()=>{
            let user = User.of()
                .withUUID("uuid")
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");
            UserService.getUsers = jest.fn().mockReturnValue({"Email": user});
            UserService.doesCurrentUserExist = jest.fn().mockReturnValue(false);
            let put = jest.fn();
            DB.getUserDB = jest.fn().mockReturnValue({put});
        });

        test("success", ()=>{
            let user = User.of()
                .withUUID("uuid")
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");
            UserService.addCurrentUser("Email");

            let put = DB.getUserDB().put;
            expect(put).toBeCalledTimes(1);
            expect(put).toBeCalledWith("user", user);
        });

        test("throws error when user exists", ()=>{
            expect(() => {
                UserService.addCurrentUser("NotFoundEmail");
            })
            .toThrowError(new UserError(UserErrorMessage.userNotFound));
        });
    });

    describe("updateUser", ()=>{
        beforeEach(()=>{
            UserService.validateUser = jest.fn();
            let put = jest.fn();
            DB.getApplicationDB = jest.fn().mockReturnValue({put});

            let user = User.of()
                .withUUID("uuid")
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");

            let anotherUser = User.of()
                .withUUID("uuid")
                .withFirstName("FirstNameUpdate")
                .withLastName("LastNameUpdate")
                .withEmail("AnotherUserEmail");
            UserService.getUsers = jest.fn().mockReturnValue({"Email": user, "AnotherUserEmail": anotherUser});
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

            let put = DB.getApplicationDB().put;
            expect(put).toBeCalledTimes(1);
        });

        test("success with new email", ()=>{
            let oldEmail = "Email";
            let user = User.of()
                .withUUID("uuid")
                .withFirstName("FirstNameUpdate")
                .withLastName("LastNameUpdate")
                .withEmail("NewEmail");
            let updatedUser = UserService.updateUser(user, oldEmail);
            expect(updatedUser.uuid).toBe("uuid");
            expect(updatedUser.firstName).toBe("FirstNameUpdate");
            expect(updatedUser.lastName).toBe("LastNameUpdate");
            expect(updatedUser.email).toBe("NewEmail");

            let put = DB.getApplicationDB().put;
            expect(put).toBeCalledTimes(1);
        });

        test("throws error when user don't exists", ()=>{
            let user = User.of()
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("NotExistEmail");

            expect(() => {
                UserService.updateUser(user);
            })
            .toThrowError(new UserError(UserErrorMessage.userNotFound));
        });

        test("throws error, when new email exists", ()=>{
            let user = User.of()
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("AnotherUserEmail");

            expect(() => {
                UserService.updateUser(user, "Email");
            })
            .toThrowError(new UserError(UserErrorMessage.userAlreadyExists));
        });
    });

    describe("updateCurrentUser", ()=>{
        beforeEach(()=>{
            let user = User.of()
                .withUUID("uuid")
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");
            UserService.getUsers = jest.fn().mockReturnValue({"Email": user});
            let get = jest.fn().mockReturnValue(user);
            let put = jest.fn();
            DB.getUserDB = jest.fn().mockReturnValue({get, put});
        });

        test("success", ()=>{
            let updatedUser = UserService.updateCurrentUser();
            expect(updatedUser.uuid).toBe("uuid");
            expect(updatedUser.firstName).toBe("FirstName");
            expect(updatedUser.lastName).toBe("LastName");
            expect(updatedUser.email).toBe("Email");
            let put = DB.getUserDB().put;
            expect(put).toBeCalledTimes(1);
            expect(put).toBeCalledWith("user", updatedUser);
        });

        test("throws error when user don't exists", ()=>{
            let get = jest.fn().mockReturnValue(null);
            DB.getUserDB = jest.fn().mockReturnValue({get});
            expect(() => {
                UserService.updateCurrentUser();
            })
            .toThrowError(new UserError(UserErrorMessage.userNotFound));
        });
    });

    describe("deleteUser", ()=>{
        beforeEach(()=>{
            let put = jest.fn();
            DB.getUserDB = jest.fn().mockReturnValue({put});
            let user = User.of()
                .withUUID("uuid")
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");
            UserService.getUsers = jest.fn().mockReturnValue({"Email": user});
        });

        test("success", ()=>{
            let email = "Email";
            UserService.deleteUser(email);

            let put = DB.getApplicationDB().put;
            expect(put).toBeCalledTimes(1);
            expect(put).toBeCalledWith("users", {});
        });

        test("throws error when user don't exists", ()=>{
            expect(() => {
                UserService.deleteUser("NotFoundEmail");
            })
            .toThrowError(new UserError(UserErrorMessage.userNotFound));
        });
    });

    describe("deleteCurrentUser", ()=>{
        beforeEach(()=>{
            let put = jest.fn();
            DB.getUserDB = jest.fn().mockReturnValue({put});
            let user = User.of()
                .withUUID("uuid")
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");
            UserService.getUsers = jest.fn().mockReturnValue({});
            
            let get = jest.fn().mockReturnValue(user);
            let deleteAll = jest.fn();
            DB.getUserDB = jest.fn().mockReturnValue({get, deleteAll});
        });

        test("success", ()=>{
            UserService.deleteCurrentUser();
            let deleteAll = DB.getUserDB().deleteAll;
            expect(deleteAll).toBeCalledTimes(1);
        });

        test("throws error when user don't exists", ()=>{
            expect(() => {
                UserService.deleteUser("NotFoundEmail");
            })
            .toThrowError(new UserError(UserErrorMessage.userNotFound));
        });
    });

    describe("getUser", ()=>{
        beforeEach(()=>{
            let put = jest.fn();
            DB.getApplicationDB = jest.fn().mockReturnValue({put});
            let user = User.of()
                .withUUID("uuid")
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");
            UserService.getUsers = jest.fn().mockReturnValue({"Email": user});
        });

        test("success", ()=>{
            let user = UserService.getUser("Email");
            expect(user.uuid).toBe("uuid");
            expect(user.firstName).toBe("FirstName");
            expect(user.lastName).toBe("LastName");
            expect(user.email).toBe("Email");
        });

        test("throws error when user don't exists", ()=>{
            UserService.getUsers = jest.fn().mockReturnValue({});
            expect(() => {
                UserService.getUser("Email");
            })
            .toThrowError(new UserError(UserErrorMessage.userNotFound));
        });
    });

    describe("getCurrentUser", ()=>{
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
            let user = UserService.getCurrentUser();
            expect(user.uuid).toBe("uuid");
            expect(user.firstName).toBe("FirstName");
            expect(user.lastName).toBe("LastName");
            expect(user.email).toBe("Email");
        });

        test("throws error when user don't exists", ()=>{
            DB.getUserDB().get = jest.fn().mockReturnValue(null);
            expect(() => {
                UserService.getCurrentUser();
            })
            .toThrowError(new UserError(UserErrorMessage.userNotFound));
        });
    });

    describe("addToWhiteList", ()=>{
        beforeEach(()=>{
            let put = jest.fn();
            DB.getApplicationDB = jest.fn().mockReturnValue({put});
            UserService.getWhiteListUsers = jest.fn().mockReturnValue([]);
        });

        test("success", ()=>{
            let userEmail = UserService.addToWhiteList("email");
            expect(userEmail).toBe("email");
            expect(DB.getApplicationDB().put).toBeCalledTimes(1);
        });

        test("throws error when user exists", ()=>{
            UserService.getWhiteListUsers = jest.fn().mockReturnValue(["email"]);
            expect(() => {
                UserService.addToWhiteList("email");
            })
            .toThrowError(new UserError(UserErrorMessage.userAlreadyExists));
        });
    });

    describe("removeFromWhiteList", ()=>{
        beforeEach(()=>{
            let put = jest.fn();
            DB.getApplicationDB = jest.fn().mockReturnValue({put});
            UserService.getWhiteListUsers = jest.fn().mockReturnValue(new Set(["email"]));
        });

        test("success", ()=>{
            let userEmail = UserService.removeFromWhiteList("email");
            expect(userEmail).toBe("email");
            expect(DB.getApplicationDB().put).toBeCalledTimes(1);
        });

        test("throws error when user don't exists", ()=>{
            UserService.getWhiteListUsers = jest.fn().mockReturnValue(new Set());
            expect(() => {
                UserService.removeFromWhiteList("email");
            })
            .toThrowError(new UserError(UserErrorMessage.userNotFound));
        });
    });
});