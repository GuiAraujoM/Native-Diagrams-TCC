public with sharing class NativeDiagramsController {
    @AuraEnabled(cacheable = true)
    public static Diagram__c getDiagram(Id diagramId){
        if(diagramId == null) throw new IllegalArgumentException('diagramId cannot be null');
        
        return [
            SELECT 
                Id,
                Name,
                Model__c, 
                DiagramName__c,
                Type__c
            FROM
                Diagram__c
            WHERE
                Id =: diagramId
        ][0];
    }

    @AuraEnabled(cacheable = true)
    public static List<Diagram__c> getDiagramsByDocumentation(Id documentationId){
        if(documentationId == null) throw new IllegalArgumentException('documentationId cannot be null');
       
        return [
            SELECT 
                Id,
                Name, 
                Description__c,
                DiagramName__c,
                Type__c
            FROM
                Diagram__c
            WHERE
                Documentation__c =: documentationId
        ];
    }
}
