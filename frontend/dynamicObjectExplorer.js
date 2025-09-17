import { LightningElement, track, wire } from 'lwc';
import getObjects from '@salesforce/apex/ObjectFieldController.getObjects';
import getFields from '@salesforce/apex/ObjectFieldController.getFields';
import getRecords from '@salesforce/apex/ObjectFieldController.getRecords';


export default class DynamicObjectExplorer extends LightningElement{
    @track objectOptions=[];
    @track fieldOptions=[];
    @track selectedObject='';
    @track selectedField=[];
    @track data=[];
    @track columns=[];
    @track searchKey='';

    pageSize=5;
    pageNumber=1;

    @wire(getObjects)
    wiredObjects({error, data}){
        if(data){
            this.objectOptions=data.map(res=>({label:res, value:res}) )
        }
    }
    handleObjectChange(event){
        this.selectedObject=event.detail.value;
        this.selectedField=[];
        this.data=[];
        this.columns=[];
       getFields({ objectName: this.selectedObject })
    .then(res => {
        this.fieldOptions = res.map(f => ({ label: f, value: f }));
    });

      
    }
    handleFieldChange(event){
        this.selectedField=event.detail.value;
        this.pageNumber=1;
        this.fetchRecords();
    }
    handleSearch(event){
        this.searchKey=event.target.value;
        this.pageNumber=1;
        this.fetchRecords();
    }

    fetchRecords(){
        if(!this.selectedObject || this.selectedField.length==0)return;
        getRecords({
            objectName:this.selectedObject,
            fieldNames:this.selectedField,
            pageNumber:this.pageNumber,
            pageSize:this.pageSize,
            searchKey:this.searchKey,
        }).then(res=>{
            this.data=res;
            this.columns=this.selectedFields.map(f=>({
                label:f,
                fieldName:f,
                type:'text'

            }))
            this.columns.push({
                type:'button',
                typeAttributes: { label: 'View', name: 'view', variant: 'brand' }
            })
        })
    }
    handleRowAction(event){
        const row=event.detail.row;
        alert('Record ID:', row.Id);
    }
    nextPage(){
this.pageNumber++;
this.fetchRecords();
    }
    prevPage(){
        if(this.pageNumber>1){
            this.pageNumber--;
            this.fetchRecords();
        }
    }
}



