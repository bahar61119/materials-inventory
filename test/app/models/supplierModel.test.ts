import { Supplier } from "../../../src/app/models/supplierModel";

describe("supplierModel", ()=>{
    describe("Supplier.from", ()=>{
        test("success", ()=>{
            let supplierData = {
                supplierId: "supplierId",
                supplierName: "supplierName",
                supplierType: "supplierType",
                supplierCompany: "supplierCompany",
                supplierDesignation: "supplierDesignation",
                supplierContactNumber: "supplierContactNumber",
                supplierEmail: "supplierEmail",
                supplierAddress: "supplierAddress"
            }

            let supplier = Supplier.from(supplierData);
            
            expect(supplier instanceof Supplier).toBe(true);
            expect(supplier.supplierId).toBe(supplierData.supplierId);
            expect(supplier.supplierName).toBe(supplierData.supplierName);
            expect(supplier.supplierType).toBe(supplierData.supplierType);
            expect(supplier.supplierCompany).toBe(supplierData.supplierCompany);
            expect(supplier.supplierDesignation).toBe(supplierData.supplierDesignation);
            expect(supplier.supplierContactNumber).toBe(supplierData.supplierContactNumber);
            expect(supplier.supplierEmail).toBe(supplierData.supplierEmail);
            expect(supplier.supplierAddress).toBe(supplierData.supplierAddress);
        });
    });
});