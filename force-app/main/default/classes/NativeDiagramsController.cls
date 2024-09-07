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

    // @AuraEnabled
    // public static ndfs_ChatGptResponseWrapper promptGpt(String userMessage, Id diagramId, Boolean includeContext){
    //     try {
    //         HttpRequest req = new HttpRequest();
    //         req.setEndpoint('callout:ndfs_ChatGPT/chat/completions');
    //         req.setMethod('POST');
    //         req.setHeader('Content-Type', 'application/json');
    //         req.setTimeout(120000);
    //         Http http = new Http();

    //         //ndsf_GPTPromptInstructions__mdt[] instructions = [SELECT ndsf_Instruction__c, ndsf_JSONExample__c FROM ndsf_GPTPromptInstructions__mdt];

    //         ndfs_ChatGptRequestWrapper wrapper = new ndfs_ChatGptRequestWrapper();
    //         wrapper.model = 'ft:gpt-3.5-turbo-1106:personal:er-generator:9qUURZdb';
    //         wrapper.messages = new List<ndfs_ChatGptRequestWrapper.Messages>();
    //         // for(ndsf_GPTPromptInstructions__mdt instruction : instructions){
    //         //     ndfs_ChatGptRequestWrapper.Messages message = new ndfs_ChatGptRequestWrapper.Messages();
    //         //     message.role = 'system';
    //         //     message.content = instruction.ndsf_Instruction__c + ' Exemplo de JSON: ```json' + instruction.ndsf_JSONExample__c + '```';
    //         //     wrapper.messages.add(message);
    //         // }

    //         if(includeContext){
    //             Diagram__c diagram = [SELECT Id, Model__c FROM Diagram__c WHERE Id = :diagramId];
    //             ndfs_ChatGptRequestWrapper.Messages context = new ndfs_ChatGptRequestWrapper.Messages();
    //             context.role = 'user';
    //             context.content = 'Esse é o diagrama já existente: ```json' + diagram.Model__c + '``` você pode complementá-lo';
    //             wrapper.messages.add(context);
    //         }

    //         ndfs_ChatGptRequestWrapper.Messages message = new ndfs_ChatGptRequestWrapper.Messages();
    //         message.role = 'user';
    //         message.content = userMessage;
    //         wrapper.messages.add(message);

    //         req.setBody(JSON.serialize(wrapper));
    //         System.debug(JSON.serialize(wrapper));

    //         HTTPResponse res = http.send(req);
    //         ndfs_ChatGptResponseWrapper responseWrapper = (ndfs_ChatGptResponseWrapper) JSON.deserialize(res.getBody(), ndfs_ChatGptResponseWrapper.class);
    //         System.debug(responseWrapper.choices[0].message);

    //         return responseWrapper;
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }
}