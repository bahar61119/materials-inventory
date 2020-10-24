import { ViewFileNames } from "../../constants/fileNames";
import { Supplier } from '../../models/supplierModel';
import { ProfileService } from '../../services/profileService';
import { SupplierService } from '../../services/supplierService';
import { loadView } from './loadView';

function loadSupplierListView() {
  ProfileService.validateProfile();
  return loadView(ViewFileNames.SUPPLIER_LIST);
}

function loadAddSupplierView() {
  ProfileService.validateProfile();
  let data = {
    supplier: Supplier.of(),
    isEdit: false
  }
  return loadView(ViewFileNames.UPDATE_SUPPLIER, data);
}

function loadEditSupplierView(supplierId: string) {
  ProfileService.validateProfile();
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
