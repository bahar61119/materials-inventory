import { Entry } from './entryModel';
import { Invoice } from './invoiceModel'
import { Item } from './itemModel'
import { Payment } from './paymentModel';
import { Supplier } from "./supplierModel"

export type Entity = Supplier|Item|Invoice|Entry|Payment;