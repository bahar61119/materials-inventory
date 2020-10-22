import { ViewFileNames } from "../../constants/fileNames";
import { Supplier } from '../../models/supplierModel';
import { SupplierService } from '../../services/supplierService';
import { loadView } from './loadView';

function loadSupplierListView() {
  return loadView(ViewFileNames.SUPPLIER_LIST);
}

function loadAddSupplierView() {
  let data = {
    supplier: Supplier.of(),
    isEdit: false
  }
  return loadView(ViewFileNames.UPDATE_SUPPLIER, data);
}

function loadEditSupplierView(supplierId: string) {
  let supplier = SupplierService.getSupplier(supplierId);
  let data = {
    supplier,
    isEdit: true
  }
  return loadView(ViewFileNames.UPDATE_SUPPLIER, data);
}

export {
  loadSupplierListView, 
  loadAddSupplierView, 
  loadEditSupplierView
}
