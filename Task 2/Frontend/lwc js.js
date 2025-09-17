


export default class OpportunityBuilder extends LightningElement{

@tarck accountOptions=[];
@track contactOptions=[];
@track pricebookOptions=[];
@tarck productOptions=[];
@track contactDetails;
@track lineItems=[];
selectedAccount;
selectedContact;
selectedPricebook;
closeDate;

@wire(getAccounts)
wiredAccounts({error, data}){
    if(data){
        this.accountOptions= data.map(acc=>({label:acc.Name, value: acc.Id}))
    }
}
handleAccountChange(event){
    this.selectedAccount= event.detail.value;
    this.loadContacts;
    
}
 loadContacts() {
        getContacts({ accountId: this.selectedAccount })
            .then(result => {
                this.contactOptions = result.map(c => ({ label: c.Name, value: c.Id }));
            });
    }
handleContactChange(event){
    this.selectedContact=event.detail.value;
    this.contactDetails= this.contactOptions.find(cvalue===this.selectedContact)
}
@wire(getpricebooks)
getPricebooks({data}){
    if(data){
        this.pricebookOptions=data.map(res=>({label:res.Name, value:res.Id}))
    }
}
handlePricebookChange(event){
    this.selectedPricebook=event.detail.value;
    this.loadProducts();
}
loadProducts(){
getProducts({pricebookId:this.selectedPricebook}).then(res=>{
    this.pricebookOptions= res.map(r=>({label:r.Product2.Name+'-'+r.UnitPrice, value:r.Id}))
})
}
handleDateChange(event){
    this.closeDate=event.detail.value;
}

}
