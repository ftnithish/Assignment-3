

import { LightningElement, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/OpportunityBuilderController.getAccounts';
import getContacts from '@salesforce/apex/OpportunityBuilderController.getContacts';
import getPricebooks from '@salesforce/apex/OpportunityBuilderController.getPricebooks';
import getProducts from '@salesforce/apex/OpportunityBuilderController.getProducts';
import createOpportunityWithOLIs from '@salesforce/apex/OpportunityBuilderController.createOpportunityWithOLIs';

export default class OpportunityBuilder extends LightningElement {
    @track accountOptions = [];
    @track contactOptions = [];
    @track pricebookOptions = [];
    @track productOptions = [];
    @track contactDetails;
    @track lineItems = [];

    selectedAccount;
    selectedContact;
    selectedPricebook;
    closeDate;

     @wire(getAccounts)
    wiredAccounts({ data, error }) {
        if (data) {
            this.accountOptions = data.map(acc => ({ label: acc.Name, value: acc.Id }));
        }
    }

    handleAccountChange(event) {
        this.selectedAccount = event.detail.value;
        this.loadContacts();
    }

    loadContacts() {
        getContacts({ accountId: this.selectedAccount })
            .then(result => {
                this.contactOptions = result.map(c => ({ label: c.Name, value: c.Id }));
            });
    }

    handleContactChange(event) {
        this.selectedContact = event.detail.value;
        this.contactDetails = this.contactOptions.find(c => c.value === this.selectedContact);
    }

     @wire(getPricebooks)
    wiredPricebooks({ data }) {
        if (data) {
            this.pricebookOptions = data.map(pb => ({ label: pb.Name, value: pb.Id }));
        }
    }

    handlePricebookChange(event) {
        this.selectedPricebook = event.detail.value;
        this.loadProducts();
    }

    loadProducts() {
        getProducts({ pricebookId: this.selectedPricebook })
            .then(result => {
                this.productOptions = result.map(p => ({ 
                    label: p.Product2.Name + ' - ' + p.UnitPrice, 
                    value: p.Id 
                }));
            });
    }

    handleDateChange(event) {
        this.closeDate = event.detail.value;
    }

     addRow() {
        this.lineItems = [...this.lineItems, { id: Date.now(), productId: null, quantity: 1, unitPrice: 0, totalPrice: 0 }];
    }

    deleteRow(event) {
        const index = event.target.dataset.index;
        this.lineItems.splice(index, 1);
        this.lineItems = [...this.lineItems];
    }

    deleteAllRows() {
        this.lineItems = [];
    }

    handleProductChange(event) {
        const index = event.target.dataset.index;
        const productId = event.detail.value;
        const product = this.productOptions.find(p => p.value === productId);

        this.lineItems[index].productId = productId;
        this.lineItems[index].unitPrice = parseFloat(product.label.split('-')[1]);
        this.lineItems[index].totalPrice = this.lineItems[index].quantity * this.lineItems[index].unitPrice;
        this.lineItems = [...this.lineItems];
    }

    handleQuantityChange(event) {
        const index = event.target.dataset.index;
        const qty = event.detail.value;
        this.lineItems[index].quantity = qty;
        this.lineItems[index].totalPrice = qty * this.lineItems[index].unitPrice;
        this.lineItems = [...this.lineItems];
    }

    createOpportunity() {
        const payload = this.lineItems.map(row => ({
            pricebookEntryId: row.productId,
            quantity: row.quantity,
            unitPrice: row.unitPrice
        }));

        createOpportunityWithOLIs({
            accountId: this.selectedAccount,
            contactId: this.selectedContact,
            pricebookId: this.selectedPricebook,
            closeDate: this.closeDate,
            lineItems: payload
        }).then(result => {
            alert('Opportunity created: ' + result);
        });
    }
}
