import { DB } from "../../../src/app/db/db";
import { SheetMetadata } from "../../../src/app/utils/sheetMetadata";
import { SheetErrorMessage } from "../../../src/app/constants/errorMessages";
import { DBError } from '../../../src/app/errors/dbError';

describe("DB Tests", () =>{
    console.error = jest.fn();
    describe("getSheetData", () =>{
        test(`throws ${DBError.name} when sheet not found`, ()=>{
            let getSheet = jest.fn().mockImplementation(()=>{
                throw new DBError(SheetErrorMessage.sheetNotFound("Sheet Data"));
            });
            DB.getSheet = getSheet;
            const metadata = SheetMetadata.of("Sheet Data").withTotalColumn(8);
            expect(()=> {
                DB.getSheetData(metadata);
            }).toThrowError(new DBError(SheetErrorMessage.sheetNotFound("Sheet Data")));
            expect(getSheet).toBeCalledTimes(1);
            expect(getSheet).toBeCalledWith("Sheet Data");
        });

        test("returns data", ()=>{
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
            expect(getSheet).toBeCalledTimes(1);
            expect(getSheet).toBeCalledWith("Sheet Data");
        });
    });

    describe("deleteRow", ()=>{
        test(`throws ${DBError.name} when sheet not found`, ()=>{
            let getSheet = jest.fn().mockImplementation(()=>{
                throw new DBError(SheetErrorMessage.sheetNotFound("Sheet Data"));
            });
            DB.getSheet = getSheet;
            const metadata = SheetMetadata.of("Sheet Data").withStartRow(3);
            expect(()=> {
                DB.deleteRow(metadata);
            }).toThrowError(new DBError(SheetErrorMessage.sheetNotFound("Sheet Data")));
            expect(getSheet).toBeCalledTimes(1);
            expect(getSheet).toBeCalledWith("Sheet Data");
        });

        test(`delete data`, ()=>{
            let deleteRow = jest.fn();
            let getSheet = jest.fn().mockReturnValue({deleteRow});
            DB.getSheet = getSheet;
            const metadata = SheetMetadata.of("Sheet Data").withStartRow(3);
            DB.deleteRow(metadata);
            expect(getSheet).toBeCalledTimes(1);
            expect(getSheet).toBeCalledWith("Sheet Data");
            expect(deleteRow).toBeCalledWith(3);
            expect(deleteRow).toBeCalledTimes(1);
        });
    });

    describe(`updateRow`, ()=>{
        test(`update data when start row present`, () =>{
            // mock
            let setValues = jest.fn();
            let getRange = jest.fn().mockReturnValue({ setValues });
            let getLastRow = jest.fn().mockReturnValue(1);
            let getSheet = jest.fn().mockReturnValue({ getRange, getLastRow });
            DB.getSheet = getSheet;

            // given
            const metadata = SheetMetadata.of("Sheet Data")
                .withStartColumn(2)
                .withStartRow(4)
                .withTotalRow(1)
                .withTotalColumn(4);
            const data = [["1","2","3","4"]];

            // when
            DB.updateRow(metadata, data);

            // then
            expect(getSheet).toBeCalledTimes(1);
            expect(getSheet).toBeCalledWith("Sheet Data");
            expect(getLastRow).toBeCalledTimes(0);
            expect(getRange).toBeCalledTimes(1);
            expect(getRange).toBeCalledWith(
                metadata.startRow, 
                metadata.startColumn, 
                metadata.totalRow, 
                metadata.totalColumn
            );
            expect(setValues).toBeCalledTimes(1);
            expect(setValues).toBeCalledWith(data);
        });

        test(`update data when start row not present`, () =>{
            // mock
            let setValues = jest.fn();
            let getRange = jest.fn().mockReturnValue({ setValues });
            let getLastRow = jest.fn().mockReturnValue(5);
            let getSheet = jest.fn().mockReturnValue({ getRange, getLastRow });
            DB.getSheet = getSheet;

            // given
            const metadata = SheetMetadata.of("Sheet Data")
                .withStartColumn(2)
                .withStartRow(0)
                .withTotalRow(1)
                .withTotalColumn(4);
            const data = [["1","2","3","4"]];

            // when
            DB.updateRow(metadata, data);

            // then
            expect(getSheet).toBeCalledTimes(1);
            expect(getSheet).toBeCalledWith("Sheet Data");
            expect(getLastRow).toBeCalledTimes(1);
            expect(getRange).toBeCalledTimes(1);
            expect(getRange).toBeCalledWith(
                6, 
                metadata.startColumn, 
                metadata.totalRow, 
                metadata.totalColumn
            );
            expect(setValues).toBeCalledTimes(1);
            expect(setValues).toBeCalledWith(data);
        });
    });
});