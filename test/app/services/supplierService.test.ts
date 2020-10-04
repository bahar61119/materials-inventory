import { ErrorMessage } from '../../../src/app/constants/errorMessages';
import { DB } from '../../../src/app/db/db';
import { Supplier } from '../../../src/app/models/supplierModel';
import { SupplierService } from "../../../src/app/services/supplierService";

describe("SupplierService Test", ()=>{
    test('when getSupplier returns with valid supplierRawData', () => {
        const supplierRawData = [1,"2", "3", "4", "5", "6", "7", "8"];
        const supplier = SupplierService.getSupplier(supplierRawData);
        expect(supplier.supplierId).toBe("1");
        expect(supplier.supplierName).toBe("2");
        expect(supplier.supplierType).toBe("3");
        expect(supplier.supplierCompany).toBe("4");
        expect(supplier.supplierDesignation).toBe("5");
        expect(supplier.supplierContactNumber).toBe("6");
        expect(supplier.supplierEmail).toBe("7");
        expect(supplier.supplierAddress).toBe("8");
    });

    test('when getSupplierList returns with data', ()=>{
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
    });

    test('when getSupplierList throws error', ()=>{
        console.error = console.log;
        DB.getSheetData = jest.fn().mockImplementation(() => {
            throw new Error("Error thrown");
        });
        expect(() => {
            SupplierService.getSupplierList();
        }).toThrowError(new Error(ErrorMessage.internalError));
    });
})
