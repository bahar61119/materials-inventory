import { UserErrorMessage } from '../../../src/app/constants/errorMessages';
import { DB } from '../../../src/app/db/db';
import { UserError } from "../../../src/app/errors/userError";
import { User } from '../../../src/app/models/userModel';
import { UserDBService } from '../../../src/app/services/userDBService';

describe("UserDBService Test", ()=>{
    describe("validateUser", ()=>{
        test("throw error for new user",()=>{
            let user = new User();
            
            let validateErrorMessage = [
                UserErrorMessage.validationError("FirstName"),
                UserErrorMessage.validationError("LastName"),
                UserErrorMessage.validationError("Email")
            ].join(", ");
            expect(() => {
                UserDBService.validateUser(user, true);
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
                UserDBService.validateUser(user, false);
            })
            .toThrowError(new UserError(validateErrorMessage));
        });

        test("no error", ()=>{
            let user = User.of()
                .withUUID("UUID")
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");
            UserDBService.validateUser(user, false);          
        });
    });

    describe("addUser", ()=>{
        beforeEach(()=>{
            UserDBService.validateUser = jest.fn();
            UserDBService.getUsers = jest.fn().mockReturnValue({});
            UserDBService.getUuid = jest.fn().mockReturnValue("uuid");
            let put = jest.fn();
            DB.getApplicationDB = jest.fn().mockReturnValue({put});
        });

        test("success", ()=>{
            let user = User.of()
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");
            let addedUser = UserDBService.addUser(user);
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

            UserDBService.getUsers = jest.fn().mockReturnValue({"Email": user});

            expect(() => {
                UserDBService.addUser(user);
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
            UserDBService.getUsers = jest.fn().mockReturnValue({"Email": user});
            UserDBService.doesCurrentUserExist = jest.fn().mockReturnValue(false);
            let put = jest.fn();
            DB.getUserDB = jest.fn().mockReturnValue({put});
        });

        test("success", ()=>{
            let user = User.of()
                .withUUID("uuid")
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");
            UserDBService.addCurrentUser("Email");

            let put = DB.getUserDB().put;
            expect(put).toBeCalledTimes(1);
            expect(put).toBeCalledWith("user", user);
        });

        test("throws error when user exists", ()=>{
            expect(() => {
                UserDBService.addCurrentUser("NotFoundEmail");
            })
            .toThrowError(new UserError(UserErrorMessage.userNotFound));
        });
    });

    describe("updateUser", ()=>{
        beforeEach(()=>{
            UserDBService.validateUser = jest.fn();
            let put = jest.fn();
            DB.getApplicationDB = jest.fn().mockReturnValue({put});

            let user = User.of()
                .withUUID("uuid")
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");
            UserDBService.getUsers = jest.fn().mockReturnValue({"Email": user});
        });

        test("success", ()=>{
            let user = User.of()
                .withUUID("uuid")
                .withFirstName("FirstNameUpdate")
                .withLastName("LastNameUpdate")
                .withEmail("Email");
            let updatedUser = UserDBService.updateUser(user);
            expect(updatedUser.uuid).toBe("uuid");
            expect(updatedUser.firstName).toBe("FirstNameUpdate");
            expect(updatedUser.lastName).toBe("LastNameUpdate");

            let put = DB.getApplicationDB().put;
            expect(put).toBeCalledTimes(1);
            expect(put).toBeCalledWith("users", {"Email": user});
        });

        test("success with new email", ()=>{
            let oldEmail = "Email";
            let user = User.of()
                .withUUID("uuid")
                .withFirstName("FirstNameUpdate")
                .withLastName("LastNameUpdate")
                .withEmail("NewEmail");
            let updatedUser = UserDBService.updateUser(user, oldEmail);
            expect(updatedUser.uuid).toBe("uuid");
            expect(updatedUser.firstName).toBe("FirstNameUpdate");
            expect(updatedUser.lastName).toBe("LastNameUpdate");
            expect(updatedUser.email).toBe("NewEmail");

            let put = DB.getApplicationDB().put;
            expect(put).toBeCalledTimes(1);
            expect(put).toBeCalledWith("users", {"NewEmail": user});
        });

        test("throws error when user don't exists", ()=>{
            let user = User.of()
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("NotExistEmail");

            expect(() => {
                UserDBService.updateUser(user);
            })
            .toThrowError(new UserError(UserErrorMessage.userNotFound));
        });
    });


    describe("updateCurrentUser", ()=>{
        beforeEach(()=>{
            let user = User.of()
                .withUUID("uuid")
                .withFirstName("FirstName")
                .withLastName("LastName")
                .withEmail("Email");
            UserDBService.getUsers = jest.fn().mockReturnValue({"Email": user});
            let get = jest.fn().mockReturnValue(user);
            let put = jest.fn();
            DB.getUserDB = jest.fn().mockReturnValue({get, put});
        });

        test("success", ()=>{
            let updatedUser = UserDBService.updateCurrentUser();
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
                UserDBService.updateCurrentUser();
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
            UserDBService.getUsers = jest.fn().mockReturnValue({"Email": user});
        });

        test("success", ()=>{
            let email = "Email";
            UserDBService.deleteUser(email);

            let put = DB.getApplicationDB().put;
            expect(put).toBeCalledTimes(1);
            expect(put).toBeCalledWith("users", {});
        });

        test("throws error when user don't exists", ()=>{
            expect(() => {
                UserDBService.deleteUser("NotFoundEmail");
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
            UserDBService.getUsers = jest.fn().mockReturnValue({"Email": user});
            
            let get = jest.fn().mockReturnValue(user);
            let deleteAll = jest.fn();
            DB.getUserDB = jest.fn().mockReturnValue({get, deleteAll});
        });

        test("success", ()=>{
            UserDBService.deleteCurrentUser();
            let deleteAll = DB.getUserDB().deleteAll;
            expect(deleteAll).toBeCalledTimes(1);
        });

        test("throws error when user don't exists", ()=>{
            expect(() => {
                UserDBService.deleteUser("NotFoundEmail");
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
            UserDBService.getUsers = jest.fn().mockReturnValue({"Email": user});
        });

        test("success", ()=>{
            let user = UserDBService.getUser("Email");
            expect(user.uuid).toBe("uuid");
            expect(user.firstName).toBe("FirstName");
            expect(user.lastName).toBe("LastName");
            expect(user.email).toBe("Email");
        });

        test("throws error when user don't exists", ()=>{
            UserDBService.getUsers = jest.fn().mockReturnValue({});
            expect(() => {
                UserDBService.getUser("Email");
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
            let user = UserDBService.getCurrentUser();
            expect(user.uuid).toBe("uuid");
            expect(user.firstName).toBe("FirstName");
            expect(user.lastName).toBe("LastName");
            expect(user.email).toBe("Email");
        });

        test("throws error when user don't exists", ()=>{
            DB.getUserDB().get = jest.fn().mockReturnValue(null);
            expect(() => {
                UserDBService.getCurrentUser();
            })
            .toThrowError(new UserError(UserErrorMessage.userNotFound));
        });
    });

    describe("addToWhiteList", ()=>{
        beforeEach(()=>{
            let put = jest.fn();
            DB.getApplicationDB = jest.fn().mockReturnValue({put});
            UserDBService.getWhiteListUsers = jest.fn().mockReturnValue([]);
        });

        test("success", ()=>{
            let userEmail = UserDBService.addToWhiteList("email");
            expect(userEmail).toBe("email");
            expect(DB.getApplicationDB().put).toBeCalledTimes(1);
        });

        test("throws error when user exists", ()=>{
            UserDBService.getWhiteListUsers = jest.fn().mockReturnValue(["email"]);
            expect(() => {
                UserDBService.addToWhiteList("email");
            })
            .toThrowError(new UserError(UserErrorMessage.userAlreadyExists));
        });
    });

    describe("removeFromWhiteList", ()=>{
        beforeEach(()=>{
            let put = jest.fn();
            DB.getApplicationDB = jest.fn().mockReturnValue({put});
            UserDBService.getWhiteListUsers = jest.fn().mockReturnValue(new Set(["email"]));
        });

        test("success", ()=>{
            let userEmail = UserDBService.removeFromWhiteList("email");
            expect(userEmail).toBe("email");
            expect(DB.getApplicationDB().put).toBeCalledTimes(1);
        });

        test("throws error when user don't exists", ()=>{
            UserDBService.getWhiteListUsers = jest.fn().mockReturnValue(new Set());
            expect(() => {
                UserDBService.removeFromWhiteList("email");
            })
            .toThrowError(new UserError(UserErrorMessage.userNotFound));
        });
    });
});