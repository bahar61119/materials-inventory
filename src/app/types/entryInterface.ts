interface EntryInterface extends EntityInterface {
    entryId: string;
    entryItem: string;
    entryInvoice: string;
    entrySupplier: string;
    entryQuantity: string;
    entryUnit: string;
    entryUnitPrice: number;
    entryAmount: number;
    entryStatus: string;
    entryExpectedDeliveryDate: string;
    entryDeliveryDate: string;
    entryDescription: string;
}