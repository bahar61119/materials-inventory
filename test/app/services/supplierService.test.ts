import { ErrorMessage, SupplierErrorMessage } from '../../../src/app/constants/errorMessages';
import { SheetName } from '../../../src/app/constants/sheetNames';
import { DB } from '../../../src/app/db/db';
import { DBError } from '../../../src/app/errors/dbError';
import { SupplierError } from '../../../src/app/errors/supplierError';
import { Supplier } from '../../../src/app/models/supplierModel';
import { SupplierService } from "../../../src/app/services/supplierService";
import { SheetMetadata } from '../../../src/app/utils/sheetMetadata';

describe("SupplierService Test", ()=>{
    console.error = jest.fn();
    describe("getSupplierFromRawData", ()=>{
        test('returns with valid supplierRawData', () => {
            const supplierRawData = [1,"2", "3", "4", "5", "6", "7", "8"];
            const supplier = SupplierService.getSupplierFromRawData(supplierRawData);
            expect(supplier.supplierId).toBe("1");
            expect(supplier.supplierName).toBe("2");
            expect(supplier.supplierType).toBe("3");
            expect(supplier.supplierCompany).toBe("4");
            expect(supplier.supplierDesignation).toBe("5");
            expect(supplier.supplierContactNumber).toBe("6");
            expect(supplier.supplierEmail).toBe("7");
            expect(supplier.supplierAddress).toBe("8");
        });
    });

    describe("getSupplierList", ()=>{
        test('returns with data', ()=>{
            const supplierRawDataList = [
                [11,"12", "13", "14", "15", "16", "17", "18"]
            ];
            DB.getSheetData = jest.fn().mockReturnValue(supplierRawDataList);
            const expectedResults = [
                Supplier.of()
                    .withSupplierId("11")
                    .withSupplierName("12")
                    .withSupplierType("13")
                    .withSupplierCompany("14")
                    .withSupplierDesignation("15")
                    .withSupplierContactNumber("16")
                    .withSupplierEmail("17")
                    .withSupplierAddress("18")
            ];
            const actualResults = SupplierService.getSupplierList();
            expect(actualResults).toStrictEqual(expectedResults);
            expect(DB.getSheetData).toBeCalledTimes(1);
            expect(DB.getSheetData).toBeCalledWith(SheetMetadata.of(SheetName.SUPPLIER).withTotalColumn(8));
        });

        test('throws error when db throws error', ()=>{
            DB.getSheetData = jest.fn().mockImplementation(() => {
                throw new DBError("Error thrown at getSheetData");
            });
            expect(() => {
                SupplierService.getSupplierList();
            })
            .toThrowError(new Error(ErrorMessage.internalError));
            expect(DB.getSheetData).toBeCalledTimes(1);
            expect(DB.getSheetData).toBeCalledWith(SheetMetadata.of(SheetName.SUPPLIER).withTotalColumn(8));
        });
    });

    describe("deleteSupplier", ()=>{
        test("throws error when db throws error", ()=>{
            DB.getSheetData = jest.fn().mockImplementation(() => {
                throw new DBError("Error thrown at getSheetData");
            });
            DB.deleteRow = jest.fn();
            expect(() => {
                SupplierService.deleteSupplier("1");
            })
            .toThrowError(new Error(ErrorMessage.internalError));
            expect(DB.getSheetData).toBeCalledTimes(1);
            expect(DB.getSheetData).toBeCalledWith(SheetMetadata.of(SheetName.SUPPLIER));
            expect(DB.deleteRow).toBeCalledTimes(0);
        });

        test(`throws ${SupplierError.name} when supplier id not found`, ()=>{
            DB.getSheetData = jest.fn()
                .mockReturnValue(
                    [[1], [2], [3], [4], [6], [7]]
                );
            expect(() => {
                SupplierService.deleteSupplier("10");
            })
            .toThrowError(new SupplierError(SupplierErrorMessage.supplierIdNotFound("10")));
            expect(DB.getSheetData).toBeCalledTimes(1);
            expect(DB.getSheetData).toBeCalledWith(SheetMetadata.of(SheetName.SUPPLIER));
            expect(DB.deleteRow).toBeCalledTimes(0);
        });

        test(`throws ${SupplierError.name} when errors in deleting supplier id`, ()=>{
            DB.getSheetData = jest.fn()
                .mockReturnValue(
                    [[1], [2], [3], [4], [6], [7]]
                );
            DB.deleteRow = jest.fn().mockImplementation(()=>{
                throw new Error("Unknown Error");
            });
            expect(() => {
                SupplierService.deleteSupplier("1");
            })
            .toThrowError(new SupplierError(SupplierErrorMessage.supplierDeleteError("1")));

            expect(DB.getSheetData).toBeCalledTimes(1);
            expect(DB.getSheetData).toBeCalledWith(SheetMetadata.of(SheetName.SUPPLIER));
        });
        
        test(`delete supplier`, ()=>{
            let getSheetData = jest.fn()
                .mockReturnValue(
                    [[1], [2], [3], [4], [5], [6]]
                );
            let deleteRow = jest.fn();
            DB.getSheetData = getSheetData;
            DB.deleteRow = deleteRow;
            SupplierService.deleteSupplier("5");
            expect(getSheetData).toBeCalledTimes(1);
            expect(getSheetData).toBeCalledWith(SheetMetadata.of(SheetName.SUPPLIER));
            expect(deleteRow).toBeCalledTimes(1);
            expect(deleteRow).toBeCalledWith(SheetMetadata.of(SheetName.SUPPLIER).withStartRow(6));
        });
    });

    describe("getSupplier", ()=>{
        test('returns with data', ()=>{
            const supplierRawDataList = [
                [11,"12", "13", "14", "15", "16", "17", "18"]
            ];
            DB.getSheetData = jest.fn().mockReturnValue(supplierRawDataList);
            const expectedResult = Supplier.of()
                .withSupplierId("11")
                .withSupplierName("12")
                .withSupplierType("13")
                .withSupplierCompany("14")
                .withSupplierDesignation("15")
                .withSupplierContactNumber("16")
                .withSupplierEmail("17")
                .withSupplierAddress("18")
            ;
            const actualResult = SupplierService.getSupplier("11");
            expect(actualResult).toStrictEqual(expectedResult);
            expect(DB.getSheetData).toBeCalledTimes(2);
            expect(DB.getSheetData).toBeCalledWith(
                SheetMetadata.of(SheetName.SUPPLIER).withTotalColumn(1)
            );
            expect(DB.getSheetData).toBeCalledWith(
                SheetMetadata.of(SheetName.SUPPLIER).withStartRow(2).withTotalColumn(8).withTotalRow(1)
            );
        });

        test(`throws ${SupplierError.name} when supplier id not found`, ()=>{
            DB.getSheetData = jest.fn()
                .mockReturnValue(
                    [[1], [2], [3], [4], [6], [7]]
                );
            expect(() => {
                SupplierService.getSupplier("10");
            })
            .toThrowError(new SupplierError(SupplierErrorMessage.supplierIdNotFound("10")));
            expect(DB.getSheetData).toBeCalledTimes(1);
            expect(DB.getSheetData).toBeCalledWith(SheetMetadata.of(SheetName.SUPPLIER));
        });

        test(`throws ${SupplierError.name}  when db throws error`, ()=>{
            DB.getSheetData = jest.fn().mockImplementation(() => {
                throw new DBError("Error thrown at getSheetData");
            });
            expect(() => {
                SupplierService.getSupplier("11");
            })
            .toThrowError(new SupplierError(ErrorMessage.internalError));
            expect(DB.getSheetData).toBeCalledTimes(1);
            expect(DB.getSheetData).toBeCalledWith(SheetMetadata.of(SheetName.SUPPLIER).withTotalColumn(1));
        });
    });
});
