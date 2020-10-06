import { SheetMetaDataInterface } from '../types/sheetMetadataInterface';
export class SheetMetadata implements SheetMetaDataInterface {
    sheetName: string;
    startRow: number;
    startColumn: number;
    totalColumn: number;
    totalRow: number;

    private constructor(sheetName: string) {
      this.sheetName = sheetName;
      this.startRow = 2;
      this.startColumn = 1;
      this.totalColumn = 1;
      this.totalRow = 0;
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

    withTotalRow(totalRow: number) {
      this.totalRow = totalRow;
      return this;
    }
}
