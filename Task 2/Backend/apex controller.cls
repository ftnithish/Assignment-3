public with sharing class OpportunityBuilderController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name FROM Account ORDER BY Name LIMIT 200];
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(Id accountId) {
        return [SELECT Id, Name, Email, Phone FROM Contact WHERE AccountId = :accountId ORDER BY Name];
    }

    @AuraEnabled(cacheable=true)
    public static List<Pricebook2> getPricebooks() {
        return [SELECT Id, Name, IsActive FROM Pricebook2 WHERE IsActive = true];
    }

    @AuraEnabled(cacheable=true)
    public static List<PricebookEntry> getProducts(Id pricebookId) {
        return [
            SELECT Id, Product2Id, Product2.Name, UnitPrice, Pricebook2Id
            FROM PricebookEntry
            WHERE Pricebook2Id = :pricebookId AND IsActive = true
        ];
    }

    public class LineItemWrapper {
        @AuraEnabled public Id pricebookEntryId;
        @AuraEnabled public Decimal quantity;
        @AuraEnabled public Decimal unitPrice;
    }

    @AuraEnabled
    public static Id createOpportunityWithOLIs(
        Id accountId,
        Id contactId,
        Id pricebookId,
        Date closeDate,
        List<LineItemWrapper> lineItems
    ) {
         Opportunity opp = new Opportunity(
            Name = 'New Opportunity - ' + System.now().format(),
            AccountId = accountId,
            CloseDate = closeDate,
            StageName = 'Prospecting',
            Pricebook2Id = pricebookId
        );
        insert opp;

         List<OpportunityLineItem> olis = new List<OpportunityLineItem>();
        for (LineItemWrapper li : lineItems) {
            olis.add(new OpportunityLineItem(
                OpportunityId = opp.Id,
                PricebookEntryId = li.pricebookEntryId,
                Quantity = li.quantity,
                UnitPrice = li.unitPrice
            ));
        }
        insert olis;

        return opp.Id;
    }
}
