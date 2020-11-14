import { ErrorMessage } from '../constants/errorMessages';
import { SheetDB } from '../db/sheetDB';
import { Entity } from '../models/entityModel';
import { GenerateId } from '../utils/generateId';
import { SheetMetadata } from '../models/sheetMetadata';
import { EntityFactory } from './entityFactory';
import { UserService } from './userService';

export class EntityService {
    public static getEntityList<T>(sheetName: string, entityName: string): Array<T> {
        let numberOfFields = this.getNumberOfFields(entityName);
        let sheetMetaData = SheetMetadata.of(sheetName)
                                .withTotalColumn(numberOfFields);
        const rawDataList = this.getRawDataList(sheetMetaData);
        let entityList = new Array<T>();
        rawDataList.forEach(rawData => {
            entityList.push(this.getEntityFromRawData(rawData, entityName));
        })
        return entityList;
    }

    public static getEntity<T>(id: string, sheetName: string, entityName: string): T {
        let numberOfFields = this.getNumberOfFields(entityName);
        let index = this.getIndex(id, sheetName, entityName);
        let sheetMetaData = SheetMetadata.of(sheetName)
                                    .withStartRow(index+2)
                                    .withTotalRow(1)
                                    .withTotalColumn(numberOfFields);
        const rawData = this.getRawDataList(sheetMetaData).flatMap(data => data);
        return this.getEntityFromRawData(rawData, entityName);
    }

    public static deleteEntity(id: string, sheetName: string, entityName: string): string {
        let index = this.getIndex(id, sheetName, entityName);
        try {
            SheetDB.deleteRow(
            SheetMetadata.of(sheetName).withStartRow(index+2)
          );
          return id;
        } catch(error) {
          console.error(error);
          throw new Error(ErrorMessage.entityDeleteError(entityName));
        }
    }

    public static updateEntity<T extends Entity>(entity: T, entityIdName: string, sheetName: string, entityName: string): string {
        entity.withLatestUpdateByUser(UserService.getCurrentUser().email);
        entity.withLatestUpdateTime(Date.now().toString());
        let numberOfFields = this.getNumberOfFields(entityName);
        let isEdit = entity[entityIdName]? true: false;
        let startRow = entity[entityIdName]? this.getIndex(entity[entityIdName], sheetName, entityName) + 2: 0;
        let startColumn = isEdit? 2: 1;
        let totalColumn = isEdit? numberOfFields-1: numberOfFields;
        let sheetMetaData = SheetMetadata.of(sheetName)
            .withStartRow(startRow)
            .withStartColumn(startColumn)
            .withTotalRow(1)
            .withTotalColumn(totalColumn);
        let entityId = entity[entityIdName]? entity[entityIdName]: GenerateId.getUniqueId();
        entity[entityIdName] = entityId; 
        let data = this.getRawDataFromEntity(entity, entityIdName, !isEdit);
        SheetDB.updateRow(sheetMetaData, [data]);
        return entityId;
      }

    public static getIndex(entityId: string, sheetName: string, entityName: string): number {
        entityId = entityId.toLowerCase();
        let condition = (id: string) => id === entityId;
        let index = this.getRawDataList(SheetMetadata.of(sheetName))
            .flatMap(itemId => itemId)
            .map(itemId => String(itemId).toLowerCase())
            .findIndex(condition);
        
        if(index === -1) {
        throw new Error(ErrorMessage.entityNotFound(entityName));
        }

        return index;
    }

    public static getRawDataList(sheetMetaData: SheetMetadata): Array<any> {
        try {
        return SheetDB.getSheetData(sheetMetaData);
        } catch(error) {
        console.error(error);
        throw new Error(ErrorMessage.internalError);
        }
    }

    public static getRawDataFromEntity<T>(entity: T, idName: string, withId: boolean = false): Array<any> {
        let data: Array<any> = [];
        let supplierKeys = Object.keys(entity);
        supplierKeys.forEach( (key: any) => {
        if(!(key === idName && !withId)) {
            data.push(entity[key]);
        }
        });
        return data;
    }

    public static getEntityFromRawData(rawData: Array<any>, entityName: string): any{
        let entity = EntityFactory.getEntity(entityName);
        let keys = Object.keys(entity);
        keys.forEach( (key: any, index: number) => {
            entity[key] = String(rawData[index]);
        });
        return entity;
    }

    public static getNumberOfFields(entityName: string) {
        return Object.keys(EntityFactory.getEntity(entityName)).length;
    }

    public static convertDateString(date: string, format: string) {
        if(!date) return date;
        return Utilities.formatDate(new Date(date) , "GMT", format);
    }
}