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
            UserService.getUsers = jest.fn().mockReturnValue(null);
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
});