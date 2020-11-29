import { DB } from "../../../src/app/db/db";

class TestObject {
    id: number| null;
    name: string | null;
    flag: boolean | null;
    object: { [key: string]: any } | null;

    constructor() {
        this.id = null;
        this.name = null;
        this.flag = null;
        this.object = null;
    }

    static of() {
        return new TestObject();
    }

    withId(id: number) {
        this.id = id;
        return this;
    }

    withName(name: string) {
        this.name = name;
        return this;
    }

    withFlag(flag: boolean) {
        this.flag = flag;
        return this;
    }

    withObject(object: { [key: string]: any }) {
        this.object = object;
        return this;
    }
}

describe("DB Tests", ()=>{
    console.error = console.log;
    describe("getUserDB", ()=>{
        test("returns user db", ()=>{
            DB.getUserProperties = jest.fn();
            DB.getUserDB();
            expect(DB.getUserProperties).toBeCalledTimes(1);
        });
    });

    // describe("getApplicationDB", ()=>{
    //     DB.getScriptProperties = jest.fn();
    //     test("returns application db", ()=>{
    //         DB.getApplicationDB();
    //         DB.getUserDB();
    //         expect(DB.getScriptProperties).toBeCalledTimes(1);
    //     });
    // });

    describe("put", ()=>{
        test("success", ()=>{
            let setProperty = jest.fn();
            let dbService = jest.fn().mockReturnValue({setProperty});
    
            DB.getUserProperties = dbService;

            let db = DB.getUserDB();

            let value = TestObject.of()
                    .withId(1)
                    .withName("name")
                    .withFlag(true)
                    .withObject({
                        object1: "1",
                        object2: 2
                    });
            db.put("key", value);
            expect(setProperty).toBeCalledTimes(1);
            expect(setProperty).toBeCalledWith("key", JSON.stringify(value));
        });
    });

    describe("get", ()=>{
        test("success, returns with TestObject", ()=>{
            let value = TestObject.of()
                    .withId(1)
                    .withName("name")
                    .withFlag(true)
                    .withObject({
                        object1: "1",
                        object2: 2
                    });
            let getProperty = jest.fn().mockReturnValue(JSON.stringify(value));
            let dbService = jest.fn().mockReturnValue({getProperty});
    
            DB.getUserProperties = dbService;

            let actualValue = DB.getUserDB().get("key", new TestObject);
            expect(actualValue instanceof TestObject).toBe(true);
            expect(actualValue).toStrictEqual(value);
            expect(getProperty).toBeCalledTimes(1);
            expect(getProperty).toBeCalledWith("key");
        });

        test("success, returns with json object", ()=>{
            let value = {
                id: 1,
                name: "name",
                flag: false,
                object: {
                    object1: "1",
                    object2: "2"
                }
            }
            let getProperty = jest.fn().mockReturnValue(JSON.stringify(value));
            let dbService = jest.fn().mockReturnValue({getProperty});
    
            DB.getUserProperties = dbService;

            let actualValue = DB.getUserDB().get("key");
            expect(actualValue instanceof Object).toBe(true);
            expect(actualValue).toStrictEqual(value);
            expect(getProperty).toBeCalledTimes(1);
            expect(getProperty).toBeCalledWith("key");
        });
    });

    describe("getKeys", ()=>{
        test("success", ()=>{
            let getKeys = jest.fn().mockReturnValue(["key"]);
            let dbService = jest.fn().mockReturnValue({getKeys});
    
            DB.getUserProperties = dbService;

            let actualKeys = DB.getUserDB().getKeys();
            expect(actualKeys).toStrictEqual(["key"]);
            expect(getKeys).toBeCalledTimes(1);
        });
    });

    describe("delete", ()=>{
        test("success", ()=>{
            let deleteProperty = jest.fn();
            let dbService = jest.fn().mockReturnValue({deleteProperty});
    
            DB.getUserProperties = dbService;

            DB.getUserDB().delete("key");
            expect(deleteProperty).toBeCalledTimes(1);
            expect(deleteProperty).toBeCalledWith("key");
        });
    });

    describe("deleteAll", ()=>{
        test("success", ()=>{
            let deleteAllProperties = jest.fn();
            let dbService = jest.fn().mockReturnValue({deleteAllProperties});
    
            DB.getUserProperties = dbService;

            DB.getUserDB().deleteAll();
            expect(deleteAllProperties).toBeCalledTimes(1);
        });
    });
}); 
