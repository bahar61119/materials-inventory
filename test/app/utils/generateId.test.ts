import { GenerateId } from "../../../src/app/utils/generateId";

describe("GenerateId", ()=>{
    test("getUniqueId", ()=>{
        let id: string = GenerateId.getUniqueId();
        expect(id).toHaveLength(9);
    });
});