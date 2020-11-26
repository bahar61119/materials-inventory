interface EntryInterface extends EntityInterface {
    entryId: string;
    entryItem: string;
    entryInvoice: string;
    entrySupplier: string;
    entryUnitPrice: number;
    entryQuantity: number;
    entryAmount: number;
    entryStatus: string;
    entryExpectedDeliveryDate: string;
    entryDeliveryDate: string;
    entryDescription: string;
}