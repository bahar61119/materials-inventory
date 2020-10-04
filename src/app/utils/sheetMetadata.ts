export enum SupplierMetadata {
    sheetName = "Supplier Data",
    startRow = 2,
    startColumn = 1,
    totalColumn = 8,
}

import { SheetMetaDataInterface } from '../types/sheetMetadataInterface';
export class SheetMetadata implements SheetMetaDataInterface {
    sheetName: string;
    startRow: number;
    startColumn: number;
    totalColumn: number;

    private constructor(sheetName: string) {
      this.sheetName = sheetName;
      this.startRow = 2;
      this.startColumn = 1;
      this.totalColumn = 1;
    }

    static of(sheetName: string) {
      return new SheetMetadata(sheetName);
    }

    withSheetName(sheetName: string) {
      this.sheetName = sheetName;
      return this;
    }

    withStartRow(startRow: number) {
      this.startRow = startRow;
      return this;
    }

    withStartColumn(startColumn: number) {
      this.startColumn = startColumn;
      return this;
    }

    withTotalColumn(totalColumn: number) {
      this.totalColumn = totalColumn;
      return this;
    }
}
