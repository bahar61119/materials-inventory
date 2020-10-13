import { SheetDB } from "../../../src/app/db/sheetDB";
import { SheetMetadata } from "../../../src/app/utils/sheetMetadata";
import { SheetErrorMessage } from "../../../src/app/constants/errorMessages";
import { DBError } from '../../../src/app/errors/dbError';

describe("sheetDB Tests", () =>{
    console.error = jest.fn();
    describe("getSheetData", () =>{
        test(`returns empty array when sheet is empty`, ()=>{
            let getLastRow = jest.fn().mockReturnValue(1);
            let getLastColumn = jest.fn().mockReturnValue(1);
            let getSheet = jest.fn().mockReturnValue({
                getLastColumn,
                getLastRow
            });
            SheetDB.getSheet = getSheet;
            const metadata = SheetMetadata.of("Sheet Data").withTotalColumn(8);
            const results = SheetDB.getSheetData(metadata);
            expect(results).toStrictEqual([]);
            expect(getSheet).toBeCalledTimes(1);
            expect(getSheet).toBeCalledWith("Sheet Data");
        });

        test(`throws ${DBError.name} when sheet not found`, ()=>{
            let getSheet = jest.fn().mockImplementation(()=>{
                throw new DBError(SheetErrorMessage.sheetNotFound("Sheet Data"));
            });
            SheetDB.getSheet = getSheet;
            const metadata = SheetMetadata.of("Sheet Data").withTotalColumn(8);
            expect(()=> {
                SheetDB.getSheetData(metadata);
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
            let getLastRow = jest.fn().mockReturnValue(2);
            let getLastColumn = jest.fn().mockReturnValue(3);
            let getSheet = jest.fn().mockReturnValue({
                getRange,
                getLastRow,
                getLastColumn
            });
            SheetDB.getSheet = getSheet;
            const metadata = SheetMetadata.of("Sheet Data");
            expect(SheetDB.getSheetData(metadata)).toBe(mockData);
            expect(getSheet).toBeCalledTimes(1);
            expect(getSheet).toBeCalledWith("Sheet Data");
        });
    });

    describe("deleteRow", ()=>{
        test(`throws ${DBError.name} when sheet not found`, ()=>{
            let getSheet = jest.fn().mockImplementation(()=>{
                throw new DBError(SheetErrorMessage.sheetNotFound("Sheet Data"));
            });
            SheetDB.getSheet = getSheet;
            const metadata = SheetMetadata.of("Sheet Data").withStartRow(3);
            expect(()=> {
                SheetDB.deleteRow(metadata);
            }).toThrowError(new DBError(SheetErrorMessage.sheetNotFound("Sheet Data")));
            expect(getSheet).toBeCalledTimes(1);
            expect(getSheet).toBeCalledWith("Sheet Data");
        });

        test(`delete data`, ()=>{
            let deleteRow = jest.fn();
            let getSheet = jest.fn().mockReturnValue({deleteRow});
            SheetDB.getSheet = getSheet;
            const metadata = SheetMetadata.of("Sheet Data").withStartRow(3);
            SheetDB.deleteRow(metadata);
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
            SheetDB.getSheet = getSheet;

            // given
            const metadata = SheetMetadata.of("Sheet Data")
                .withStartColumn(2)
                .withStartRow(4)
                .withTotalRow(1)
                .withTotalColumn(4);
            const data = [["1","2","3","4"]];

            // when
            SheetDB.updateRow(metadata, data);

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
            SheetDB.getSheet = getSheet;

            // given
            const metadata = SheetMetadata.of("Sheet Data")
                .withStartColumn(2)
                .withStartRow(0)
                .withTotalRow(1)
                .withTotalColumn(4);
            const data = [["1","2","3","4"]];

            // when
            SheetDB.updateRow(metadata, data);

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