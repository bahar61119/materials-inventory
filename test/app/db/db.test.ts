import { DB } from "../../../src/app/db/db";
import { SheetMetadata } from "../../../src/app/utils/sheetMetadata";
import { ErrorMessage } from "../../../src/app/constants/errorMessages";

describe("DB Tests", () =>{
    test("when sheet not found", ()=>{
        let getSheet = jest.fn().mockReturnValue(null);
        DB.getSheet = getSheet;
        const metadata = SheetMetadata.of("Sheet Data").withTotalColumn(8);
        expect(()=> {
            DB.getSheetData(metadata);
        }).toThrowError(new Error(ErrorMessage.sheetNotFound("Sheet Data")));
    });

    test("when sheet returns data", ()=>{
        let mockData = [[1],[2],[3]];
        let getValues = jest.fn().mockReturnValue(mockData);
        let getRange = jest.fn().mockReturnValue({
            getValues
        });
        let getLastRow = jest.fn().mockReturnValue(1);
        let getSheet = jest.fn().mockReturnValue({
            getRange,
            getLastRow
        });
        DB.getSheet = getSheet;
        const metadata = SheetMetadata.of("Sheet Data");
        expect(DB.getSheetData(metadata)).toBe(mockData);
    });
});