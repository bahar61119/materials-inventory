import { ApplicationDBKeys } from '../../constants/applicationDBKeys';
import { ViewFileNames } from "../../constants/fileNames";
import { Supplier } from '../../models/supplierModel';
import { ProfileService } from '../../services/profileService';
import { SettingsService } from '../../services/settingsService';
import { SupplierService } from '../../services/supplierService';
import { loadView } from './loadView';

function loadSupplierListView() {
  ProfileService.validateProfile();
  return loadView(ViewFileNames.SUPPLIER_LIST);
}

function loadAddSupplierView() {
  ProfileService.validateProfile();
  let supplierTypes = SettingsService.getList(ApplicationDBKeys.SUPPLIER_TYPES);
  let data = {
    supplier: Supplier.of(),
    supplierTypes,
    isEdit: false
  }
  return loadView(ViewFileNames.UPDATE_SUPPLIER, data);
}

function loadEditSupplierView(supplierId: string) {
  ProfileService.validateProfile();
  let supplier = SupplierService.getSupplier(String(supplierId));
  let supplierTypes = SettingsService.getList(ApplicationDBKeys.SUPPLIER_TYPES);
  let data = {
    supplier,
    supplierTypes,
    isEdit: true
  }
  return loadView(ViewFileNames.UPDATE_SUPPLIER, data);
}

export {
  loadSupplierListView, 
  loadAddSupplierView, 
  loadEditSupplierView
}
