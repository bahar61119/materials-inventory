export class ErrorMessage {
    static get internalError(){
        return "Internal Error. Please contact with administrator";
    }

    static get sheetNotFound(){
        return (sheetName: string) => `Error: Sheet(${sheetName}) not found`;
    }
}