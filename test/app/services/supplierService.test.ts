import { SupplierService } from "../../../src/app/services/supplierService";

describe("SupplierService Test", ()=>{
    test('when getSupplier returns with valid supplierRawData', () => {
        const supplierRawData = [1,"2", "3", "4", "5", "6", "7", "8"];
        const supplier = SupplierService.getSupplier(supplierRawData);
        console.log(supplier);
        expect(supplier.supplierId).toBe("1");
        expect(supplier.supplierName).toBe("2");
        expect(supplier.supplierType).toBe("3");
        expect(supplier.supplierCompany).toBe("4");
        expect(supplier.supplierDesignation).toBe("5");
        expect(supplier.supplierContactNumber).toBe("6");
        expect(supplier.supplierEmail).toBe("7");
        expect(supplier.supplierAddress).toBe("8");
    });
})
