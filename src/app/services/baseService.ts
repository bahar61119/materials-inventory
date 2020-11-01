import { ErrorMessage } from '../constants/errorMessages';
import { SheetDB } from '../db/sheetDB';
import { Entity } from '../models/entityModel';
import { GenerateId } from '../utils/generateId';
import { SheetMetadata } from '../utils/sheetMetadata';
import { EntityFactory } from './entityFactory';
import { UserDBService } from './userDBService';

export class BaseService {
    protected static getEntityList<T>(sheetName: string, entityName: string): Array<T> {
        let numberOfFields = BaseService.getNumberOfFields(entityName);
        let sheetMetaData = SheetMetadata.of(sheetName)
                                .withTotalColumn(numberOfFields);
        const rawDataList = BaseService.getRawDataList(sheetMetaData);
        let entityList = new Array<T>();
        rawDataList.forEach(rawData => {
            entityList.push(BaseService.getEntityFromRawData(rawData, entityName));
        })
        return entityList;
    }

    protected static getEntity<T>(id: string, sheetName: string, entityName: string): T {
        let numberOfFields = BaseService.getNumberOfFields(entityName);
        let index = BaseService.getIndex(id, sheetName, entityName);
        let sheetMetaData = SheetMetadata.of(sheetName)
                                    .withStartRow(index+2)
                                    .withTotalRow(1)
                                    .withTotalColumn(numberOfFields);
        const rawData = BaseService.getRawDataList(sheetMetaData).flatMap(data => data);
        return BaseService.getEntityFromRawData(rawData, entityName);
    }

    protected static deleteEntity(id: string, sheetName: string, entityName: string): string {
        let index = BaseService.getIndex(id, sheetName, entityName);
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

    static updateEntity<T extends Entity>(entity: T, entityIdName: string, sheetName: string, entityName: string): string {
        entity.withLatestUpdateByUser(UserDBService.getCurrentUser().email);
        entity.withLatestUpdateTime(Date.now().toString());
        let numberOfFields = BaseService.getNumberOfFields(entityName);
        let isEdit = entity[entityIdName]? true: false;
        let startRow = entity[entityIdName]? BaseService.getIndex(entity[entityIdName], sheetName, entityName) + 2: 0;
        let startColumn = isEdit? 2: 1;
        let totalColumn = isEdit? numberOfFields-1: numberOfFields;
        let sheetMetaData = SheetMetadata.of(sheetName)
            .withStartRow(startRow)
            .withStartColumn(startColumn)
            .withTotalRow(1)
            .withTotalColumn(totalColumn);
        let entityId = entity[entityIdName]? entity[entityIdName]: GenerateId.getUniqueId();
        entity[entityIdName] = entityId; 
        let data = BaseService.getRowDataFromEntity(entity, entityIdName, !isEdit);
        SheetDB.updateRow(sheetMetaData, [data]);
        return entityId;
      }

    protected static getIndex(entityId: string, sheetName: string, entityName: string): number {
        entityId = entityId.toLowerCase();
        let condition = (id: string) => id === entityId;
        let index = BaseService.getRawDataList(SheetMetadata.of(sheetName))
            .flatMap(itemId => itemId)
            .map(itemId => String(itemId).toLowerCase())
            .findIndex(condition);
        
        if(index === -1) {
        throw new Error(ErrorMessage.entityNotFound(entityName));
        }

        return index;
    }

    protected static getRawDataList(sheetMetaData: SheetMetadata): Array<any> {
        try {
        return SheetDB.getSheetData(sheetMetaData);
        } catch(error) {
        console.error(error);
        throw new Error(ErrorMessage.internalError);
        }
    }

    protected static getRowDataFromEntity<T>(entity: T, idName: string, withId: boolean = false): Array<any> {
        let data: Array<any> = [];
        let supplierKeys = Object.keys(entity);
        supplierKeys.forEach( (key: any) => {
        if(!(key === idName && !withId)) {
            data.push(entity[key]);
        }
        });
        return data;
    }

    protected static getEntityFromRawData(rawData: Array<any>, entityName: string): any{
        let entity = EntityFactory.getEntity(entityName);
        let keys = Object.keys(entity);
        keys.forEach( (key: any, index: number) => {
            entity[key] = String(rawData[index]);
        });
        return entity;
    }

    protected static getNumberOfFields(entityName: string) {
        return Object.keys(EntityFactory.getEntity(entityName)).length;
    }
}