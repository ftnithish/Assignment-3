declare module "@salesforce/apex/OpportunityBuilderController.getAccounts" {
  export default function getAccounts(): Promise<any>;
}
declare module "@salesforce/apex/OpportunityBuilderController.getContacts" {
  export default function getContacts(param: {accountId: any}): Promise<any>;
}
declare module "@salesforce/apex/OpportunityBuilderController.getPricebooks" {
  export default function getPricebooks(): Promise<any>;
}
declare module "@salesforce/apex/OpportunityBuilderController.getProducts" {
  export default function getProducts(param: {pricebookId: any}): Promise<any>;
}
declare module "@salesforce/apex/OpportunityBuilderController.createOpportunityWithOLIs" {
  export default function createOpportunityWithOLIs(param: {accountId: any, contactId: any, pricebookId: any, closeDate: any, lineItems: any}): Promise<any>;
}
