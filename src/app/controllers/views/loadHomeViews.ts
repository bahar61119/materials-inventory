import { ViewFileNames } from '../../constants/fileNames';
import { SheetConstants } from '../../constants/sheetConstants';
import { HomeFilter } from '../../models/homeFilterModel';
import { Supplier } from '../../models/supplierModel';
import { HomeService } from '../../services/homeService';
import { ProfileService } from '../../services/profileService';
import { SupplierService } from '../../services/supplierService';
import { loadView } from './loadView';

function loadHomeView(filter: object = HomeFilter.of()) {
  ProfileService.validateProfile();
  let dashboard = HomeService.getDashboard(HomeFilter.from(filter));
  let suppliers: Array<Supplier> = SupplierService.getEntityList(SheetConstants.SUPPLIER_SHEET_NAME, Supplier.name);
  let data = {
    dashboard,
    suppliers,
    filter
  }
  return loadView(ViewFileNames.HOME, data);
}

export {
  loadHomeView
}
