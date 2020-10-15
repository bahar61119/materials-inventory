import { ViewFileNames } from "../../constants/fileNames";
import { Supplier } from '../../models/supplierModel';
import { SupplierService } from '../../services/supplierService';
import { loadAppView } from './loadAppView';

function loadSupplierListView() {
  return loadAppView(ViewFileNames.SUPPLIER_LIST);
}

function loadAddSupplierView() {
  let data = {
    supplier: Supplier.of(),
    isEdit: false
  }
  return loadAppView(ViewFileNames.UPDATE_SUPPLIER, data);
}

function loadEditSupplierView(supplierId: string) {
  let supplier = SupplierService.getSupplier(supplierId);
  let data = {
    supplier,
    isEdit: true
  }
  return loadAppView(ViewFileNames.UPDATE_SUPPLIER, data);
}

export {
  loadSupplierListView, 
  loadAddSupplierView, 
  loadEditSupplierView
}
