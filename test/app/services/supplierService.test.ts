import { ErrorMessage, SupplierErrorMessage } from '../../../src/app/constants/errorMessages';
import { SheetConstants } from '../../../src/app/constants/sheetConstants';
import { SheetDB } from '../../../src/app/db/sheetDB';
import { DBError } from '../../../src/app/errors/dbError';
import { SupplierError } from '../../../src/app/errors/supplierError';
import { Supplier } from '../../../src/app/models/supplierModel';
import { SupplierService } from "../../../src/app/services/supplierService";
import { GenerateId } from '../../../src/app/utils/generateId';
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
            SheetDB.getSheetData = jest.fn().mockReturnValue(supplierRawDataList);
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
            expect(SheetDB.getSheetData).toBeCalledTimes(1);
            expect(SheetDB.getSheetData).toBeCalledWith(SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME).withTotalColumn(8));
        });

        test('throws error when db throws error', ()=>{
            SheetDB.getSheetData = jest.fn().mockImplementation(() => {
                throw new DBError("Error thrown at getSheetData");
            });
            expect(() => {
                SupplierService.getSupplierList();
            })
            .toThrowError(new Error(ErrorMessage.internalError));
            expect(SheetDB.getSheetData).toBeCalledTimes(1);
            expect(SheetDB.getSheetData).toBeCalledWith(SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME).withTotalColumn(8));
        });
    });

    describe("deleteSupplier", ()=>{
        test("throws error when db throws error", ()=>{
            SheetDB.getSheetData = jest.fn().mockImplementation(() => {
                throw new DBError("Error thrown at getSheetData");
            });
            SheetDB.deleteRow = jest.fn();
            expect(() => {
                SupplierService.deleteSupplier("1");
            })
            .toThrowError(new Error(ErrorMessage.internalError));
            expect(SheetDB.getSheetData).toBeCalledTimes(1);
            expect(SheetDB.getSheetData).toBeCalledWith(SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME));
            expect(SheetDB.deleteRow).toBeCalledTimes(0);
        });

        test(`throws ${SupplierError.name} when supplier id not found`, ()=>{
            SheetDB.getSheetData = jest.fn()
                .mockReturnValue(
                    [[1], [2], [3], [4], [6], [7]]
                );
            expect(() => {
                SupplierService.deleteSupplier("10");
            })
            .toThrowError(new SupplierError(SupplierErrorMessage.supplierIdNotFound("10")));
            expect(SheetDB.getSheetData).toBeCalledTimes(1);
            expect(SheetDB.getSheetData).toBeCalledWith(SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME));
            expect(SheetDB.deleteRow).toBeCalledTimes(0);
        });

        test(`throws ${SupplierError.name} when errors in deleting supplier id`, ()=>{
            SheetDB.getSheetData = jest.fn()
                .mockReturnValue(
                    [[1], [2], [3], [4], [6], [7]]
                );
            SheetDB.deleteRow = jest.fn().mockImplementation(()=>{
                throw new Error("Unknown Error");
            });
            expect(() => {
                SupplierService.deleteSupplier("1");
            })
            .toThrowError(new SupplierError(SupplierErrorMessage.supplierDeleteError("1")));

            expect(SheetDB.getSheetData).toBeCalledTimes(1);
            expect(SheetDB.getSheetData).toBeCalledWith(SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME));
        });
        
        test(`delete supplier`, ()=>{
            let getSheetData = jest.fn()
                .mockReturnValue(
                    [[1], [2], [3], [4], [5], [6]]
                );
            let deleteRow = jest.fn();
            SheetDB.getSheetData = getSheetData;
            SheetDB.deleteRow = deleteRow;
            SupplierService.deleteSupplier("5");
            expect(getSheetData).toBeCalledTimes(1);
            expect(getSheetData).toBeCalledWith(SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME));
            expect(deleteRow).toBeCalledTimes(1);
            expect(deleteRow).toBeCalledWith(SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME).withStartRow(6));
        });
    });

    describe("getSupplier", ()=>{
        test('returns with data', ()=>{
            const supplierRawDataList = [
                [11,"12", "13", "14", "15", "16", "17", "18"]
            ];
            SheetDB.getSheetData = jest.fn().mockReturnValue(supplierRawDataList);
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
            expect(SheetDB.getSheetData).toBeCalledTimes(2);
            expect(SheetDB.getSheetData).toBeCalledWith(
                SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME).withTotalColumn(1)
            );
            expect(SheetDB.getSheetData).toBeCalledWith(
                SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME).withStartRow(2).withTotalColumn(8).withTotalRow(1)
            );
        });

        test(`throws ${SupplierError.name} when supplier id not found`, ()=>{
            SheetDB.getSheetData = jest.fn()
                .mockReturnValue(
                    [[1], [2], [3], [4], [6], [7]]
                );
            expect(() => {
                SupplierService.getSupplier("10");
            })
            .toThrowError(new SupplierError(SupplierErrorMessage.supplierIdNotFound("10")));
            expect(SheetDB.getSheetData).toBeCalledTimes(1);
            expect(SheetDB.getSheetData).toBeCalledWith(SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME));
        });

        test(`throws ${SupplierError.name}  when db throws error`, ()=>{
            SheetDB.getSheetData = jest.fn().mockImplementation(() => {
                throw new DBError("Error thrown at getSheetData");
            });
            expect(() => {
                SupplierService.getSupplier("11");
            })
            .toThrowError(new SupplierError(ErrorMessage.internalError));
            expect(SheetDB.getSheetData).toBeCalledTimes(1);
            expect(SheetDB.getSheetData).toBeCalledWith(SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME).withTotalColumn(1));
        });
    });

    describe(`getRowDataFromSupplier`, ()=>{
        test(`returns raw data from supplier`, ()=>{
            // given
            let supplier = Supplier.of()
                .withSupplierId("id")
                .withSupplierName("name")
                .withSupplierType("type")
                .withSupplierAddress("address")
                .withSupplierCompany("company")
                .withSupplierContactNumber("contact_number")
                .withSupplierEmail("email@email")
                .withSupplierDesignation("designation");
            
            // when
            let results = SupplierService.getRowDataFromSupplier(supplier, true);
            let expectedResult = ["id", "name", "type", "company", 
                "designation", "contact_number", "email@email", "address"];
            expect(results).toStrictEqual(expectedResult);
        });

        test(`returns raw data from supplier without supplier id`, ()=>{
            // given
            let supplier = Supplier.of()
                .withSupplierId("id")
                .withSupplierName("name")
                .withSupplierType("type")
                .withSupplierAddress("address")
                .withSupplierCompany("company")
                .withSupplierContactNumber("contact_number")
                .withSupplierEmail("email@email")
                .withSupplierDesignation("designation");
            
            // when
            let results = SupplierService.getRowDataFromSupplier(supplier);
            let expectedResult = ["name", "type", "company", 
                "designation", "contact_number", "email@email", "address"];
            expect(results).toStrictEqual(expectedResult);
        });
    });

    describe(`updateSupplier`, ()=>{
        test(`edit supplier`, ()=>{
            let getSheetData = jest.fn().mockReturnValue([["1"],["2"],["3"]]);
            let updateRow = jest.fn();
            SheetDB.updateRow = updateRow;
            SheetDB.getSheetData = getSheetData;

            // given
            let supplier = Supplier.of()
                .withSupplierId("2")
                .withSupplierName("name")
                .withSupplierType("type")
                .withSupplierAddress("address")
                .withSupplierCompany("company")
                .withSupplierContactNumber("contact_number")
                .withSupplierEmail("email@email")
                .withSupplierDesignation("designation");

            // when
            let supplierId = SupplierService.updateSupplier(supplier);

            // then
            let dbData = ["name", "type", "company", 
                "designation", "contact_number", "email@email", "address"];
            let metaData = SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME)
                .withStartRow(3)
                .withStartColumn(2)
                .withTotalColumn(7)
                .withTotalRow(1);

            expect(supplierId).toStrictEqual("2");
            expect(updateRow).toBeCalledTimes(1);
            expect(updateRow).toBeCalledWith(metaData, [dbData]);
            
        });

        test(`add supplier`, ()=>{
            let getSheetData = jest.fn().mockReturnValue([["1"],["2"],["3"]]);
            let updateRow = jest.fn();
            let uniqueId = "unique_id";
            SheetDB.updateRow = updateRow;
            SheetDB.getSheetData = getSheetData;
            GenerateId.getUniqueId = jest.fn().mockReturnValue(uniqueId);

            // given
            let supplier = Supplier.of()
                .withSupplierName("name")
                .withSupplierType("type")
                .withSupplierAddress("address")
                .withSupplierCompany("company")
                .withSupplierContactNumber("contact_number")
                .withSupplierEmail("email@email")
                .withSupplierDesignation("designation");

            // when
            let supplierId = SupplierService.updateSupplier(supplier);

            // then
            let dbData = [uniqueId, "name", "type", "company", 
                "designation", "contact_number", "email@email", "address"];
            let metaData = SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME)
                .withStartRow(0)
                .withStartColumn(1)
                .withTotalColumn(8)
                .withTotalRow(1);

            expect(supplierId).toStrictEqual(uniqueId);
            expect(updateRow).toBeCalledTimes(1);
            expect(updateRow).toBeCalledWith(metaData, [dbData]);
        });
    });
});
