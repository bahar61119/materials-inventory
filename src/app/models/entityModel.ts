import { Entry } from './entryModel';
import { Invoice } from './invoiceModel'
import { Item } from './itemModel'
import { Supplier } from "./supplierModel"

export type Entity = Supplier|Item|Invoice|Entry;