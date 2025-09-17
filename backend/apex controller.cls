public with sharing class ObjectFieldController{
    @AuraEnabled(cacheable=true)
    public static List<String> getObjects(){
        List<String> objectNames= new List<String>();
        for(Schema.SObjectType objType: Schema.getGlobalDescribe().Values()){
            objectNames.add(objType.getDescribe().getName());
        }
        objectNames.sort();
        return objectNames;

    }
     @AuraEnabled(cacheable=true)
    public static List<String> getFields(String objectName){
       List<String> fieldNames= new List<String>();
Schema.SObjectType objType = Schema.getGlobalDescribe().get(objectName);
Map<String, Schema.SObjectField> fieldMap = objType.getDescribe().fields.getMap();
       for(String f: fieldMap.keySet()){
        fieldNames.add(f);
       }
       fieldNames.sort();
       return fieldNames;
    }

    @AuraEnabled
public static List<SObject> getRecords(
    String objectNames, List<String>fieldNames, integer pageNumber,integer pageSize, string searchKey
){
String fieldList = String.join(fieldNames, ',');
Integer offsetSize= (pageNumber-1)*pageSize;
String query = 'SELECT ' + String.join(fieldNames, ',') + ' FROM ' + objectName;
if(searchKey != null && searchKey!=''){
query += ' WHERE Name LIKE \'%' + String.escapeSingleQuotes(searchKey) + '%\'';

}
query += ' LIMIT '+ pageSize + ' OFFSET ' + offsetSize;
return Database.query(query);
}

}