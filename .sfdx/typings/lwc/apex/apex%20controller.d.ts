declare module "@salesforce/apex/ObjectFieldController.getObjects" {
  export default function getObjects(): Promise<any>;
}
declare module "@salesforce/apex/ObjectFieldController.getFields" {
  export default function getFields(param: {objectName: any}): Promise<any>;
}
declare module "@salesforce/apex/ObjectFieldController.getRecords" {
  export default function getRecords(param: {objectNames: any, fieldNames: any, pageNumber: any, pageSize: any, searchKey: any}): Promise<any>;
}
