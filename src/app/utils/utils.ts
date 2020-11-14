export class Utils {
    static arrayToObject(array: Array<any>, key: string) {
        return array.reduce((object, item) => {
          return {
            ...object,
            [item[key]]: item,
          };
        }, {});
    };
}