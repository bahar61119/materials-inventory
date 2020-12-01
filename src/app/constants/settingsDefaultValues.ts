module DefaultValues {
    export enum Currency {
        AED = "AED",
        AUD = "AUD",
        BDT = "BDT",
        CAD = "CAD",
        EUR = "EUR",
        GBP = "GBP",
        JPY = "JPY",
        SAR = "SAR",
        SGD = "SGD",
        USD = "USD"
    }

    export enum ProductStatus {
        PENDING = "Pending",
        IN_PROGRESS = "In Progress",
        DELIVERED = "Delivered"
    }

    export enum PaymentStatus {
        PENDING = "Pending",
        PAID = "Paid"
    }

    export enum PaymentMethod {
        CASH = "Cash",
        CHEQUE = "Cheque",
        CARD = "Card"
    }
}
