import { ErrorMessage } from '../../../src/app/constants/errorMessages';
import { SheetConstants } from '../../../src/app/constants/sheetConstants';
import { SheetDB } from '../../../src/app/db/sheetDB';
import { DBError } from '../../../src/app/errors/dbError';
import { SupplierError } from '../../../src/app/errors/supplierError';
import { Supplier } from '../../../src/app/models/supplierModel';
import { UserDBService } from '../../../src/app/services/userDBService';
import { GenerateId } from '../../../src/app/utils/generateId';
import { SheetMetadata } from '../../../src/app/models/sheetMetadata';
import { EntityService } from '../../../src/app/services/entityService';

describe("EntityService Test", ()=>{
    console.error = jest.fn();
    describe("getEntityFromRawData", ()=>{
        test('returns with valid rawData', () => {
            const supplierRawDataList = [1,"2", "3", "4", "5", "6", "7", "8", "9", "10"];
            const supplier = EntityService.getEntityFromRawData(supplierRawDataList, Supplier.name);
            expect(supplier.supplierId).toBe("1");
            expect(supplier.supplierName).toBe("2");
            expect(supplier.supplierType).toBe("3");
            expect(supplier.supplierCompany).toBe("4");
            expect(supplier.supplierDesignation).toBe("5");
            expect(supplier.supplierContactNumber).toBe("6");
            expect(supplier.supplierEmail).toBe("7");
            expect(supplier.supplierAddress).toBe("8");
            expect(supplier.latestUpdateByUser).toBe("9");
            expect(supplier.latestUpdateTime).toBe("10");
        });
    });

    describe("getEntityList", ()=>{
        test('returns with data', ()=>{
            const supplierRawDataList = [
                [11,"12", "13", "14", "15", "16", "17", "18", "19", "10"]
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
                    .withLatestUpdateByUser("19")
                    .withLatestUpdateTime("10")
            ];
            const actualResults = EntityService.getEntityList(SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
            expect(actualResults).toStrictEqual(expectedResults);
            expect(SheetDB.getSheetData).toBeCalledTimes(1);
            expect(SheetDB.getSheetData).toBeCalledWith(SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME).withTotalColumn(10));
        });

        test('throws error when db throws error', ()=>{
            SheetDB.getSheetData = jest.fn().mockImplementation(() => {
                throw new DBError("Error thrown at getSheetData");
            });
            expect(() => {
                EntityService.getEntityList(SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
            })
            .toThrowError(new Error(ErrorMessage.internalError));
            expect(SheetDB.getSheetData).toBeCalledTimes(1);
            expect(SheetDB.getSheetData).toBeCalledWith(SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME).withTotalColumn(10));
        });
    });

    describe("deleteEntity", ()=>{
        test("throws error when db throws error", ()=>{
            SheetDB.getSheetData = jest.fn().mockImplementation(() => {
                throw new DBError("Error thrown at getSheetData");
            });
            SheetDB.deleteRow = jest.fn();
            expect(() => {
                EntityService.deleteEntity("1", SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
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
                EntityService.deleteEntity("0", SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
            })
            .toThrowError(new Error(ErrorMessage.entityNotFound(Supplier.name)));
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
                EntityService.deleteEntity("1", SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
            })
            .toThrowError(new Error(ErrorMessage.entityDeleteError(Supplier.name)));

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
            EntityService.deleteEntity("5", SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
            expect(getSheetData).toBeCalledTimes(1);
            expect(getSheetData).toBeCalledWith(SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME));
            expect(deleteRow).toBeCalledTimes(1);
            expect(deleteRow).toBeCalledWith(SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME).withStartRow(6));
        });
    });

    describe("getEntity", ()=>{
        test('returns with data', ()=>{
            const supplierRawDataList = [
                [11,"12", "13", "14", "15", "16", "17", "18", "19", "10"]
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
                .withLatestUpdateByUser("19")
                .withLatestUpdateTime("10")
            ;
            const actualResult = EntityService.getEntity("11", SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
            expect(actualResult).toStrictEqual(expectedResult);
            expect(SheetDB.getSheetData).toBeCalledTimes(2);
            expect(SheetDB.getSheetData).toBeCalledWith(
                SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME).withTotalColumn(1)
            );
            expect(SheetDB.getSheetData).toBeCalledWith(
                SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME).withStartRow(2).withTotalColumn(10).withTotalRow(1)
            );
        });

        test(`throws ${SupplierError.name} when supplier id not found`, ()=>{
            SheetDB.getSheetData = jest.fn()
                .mockReturnValue(
                    [[1], [2], [3], [4], [6], [7]]
                );
            expect(() => {
                EntityService.getEntity("10", SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
            })
            .toThrowError(new Error(ErrorMessage.entityNotFound(Supplier.name)));
            expect(SheetDB.getSheetData).toBeCalledTimes(1);
            expect(SheetDB.getSheetData).toBeCalledWith(SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME));
        });

        test(`throws ${SupplierError.name}  when db throws error`, ()=>{
            SheetDB.getSheetData = jest.fn().mockImplementation(() => {
                throw new DBError("Error thrown at getSheetData");
            });
            expect(() => {
                EntityService.getEntity("11", SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
            })
            .toThrowError(new SupplierError(ErrorMessage.internalError));
            expect(SheetDB.getSheetData).toBeCalledTimes(1);
            expect(SheetDB.getSheetData).toBeCalledWith(SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME).withTotalColumn(1));
        });
    });

    describe(`getRawDataFromEntity`, ()=>{
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
                .withSupplierDesignation("designation")
                .withLatestUpdateByUser("user")
                .withLatestUpdateTime("time");
            
            // when
            let results = EntityService.getRawDataFromEntity(supplier, "supplierId", true);
            let expectedResult = ["id", "name", "type", "company", 
                "designation", "contact_number", "email@email", "address", "user", "time"];
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
                .withSupplierDesignation("designation")
                .withLatestUpdateByUser("user")
                .withLatestUpdateTime("time");
            
            // when
            let results = EntityService.getRawDataFromEntity(supplier, "supplierId", false);
            let expectedResult = ["name", "type", "company", 
                "designation", "contact_number", "email@email", "address", "user", "time"];
            expect(results).toStrictEqual(expectedResult);
        });
    });

    describe(`updateEntity`, ()=>{
        test(`edit supplier`, ()=>{
            let getSheetData = jest.fn().mockReturnValue([["1"],["2"],["3"]]);
            let updateRow = jest.fn();
            SheetDB.updateRow = updateRow;
            SheetDB.getSheetData = getSheetData;
            UserDBService.getCurrentUser = jest.fn().mockReturnValue({email: "email"});
            Date.now = jest.fn().mockReturnValue(123);

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
            let supplierId = EntityService.updateEntity(supplier, "supplierId", SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);

            // then
            let dbData = ["name", "type", "company", 
                "designation", "contact_number", "email@email", "address", "email", "123"];
            let metaData = SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME)
                .withStartRow(3)
                .withStartColumn(2)
                .withTotalColumn(9)
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
            UserDBService.getCurrentUser = jest.fn().mockReturnValue({email: "email"});
            Date.now = jest.fn().mockReturnValue(123);

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
            let supplierId = EntityService.updateEntity(supplier, "supplierId", SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);

            // then
            let dbData = [uniqueId, "name", "type", "company", 
                "designation", "contact_number", "email@email", "address", "email", "123"];
            let metaData = SheetMetadata.of(SheetConstants.SUPPLIER_SHEET_NAME)
                .withStartRow(0)
                .withStartColumn(1)
                .withTotalColumn(10)
                .withTotalRow(1);

            expect(supplierId).toStrictEqual(uniqueId);
            expect(updateRow).toBeCalledTimes(1);
            expect(updateRow).toBeCalledWith(metaData, [dbData]);
        });
    });
});
