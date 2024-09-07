public with sharing class ShareDocumentationController {
    @AuraEnabled
    public static Map<String,String> shareDocumentation(Id recordId, Id[] userOrGroupIdsList, String accessLevel){
        if(String.isBlank(recordId)) throw new IllegalArgumentException('recordId cannot be null');
        if(userOrGroupIdsList == null || userOrGroupIdsList.size() == 0) throw new IllegalArgumentException('userOrGroupIdsList cannot be null');
        if(String.isBlank(accessLevel)) throw new IllegalArgumentException('accessLevel cannot be null');
                   
        //Sharing Documentation__c
        Documentation__Share[] documentationShareList = new List<Documentation__Share>();
        Documentation__Share documentationShare;
        for(Id userOrGroupId : userOrGroupIdsList){
            documentationShare = new Documentation__Share();
            documentationShare.ParentID = recordId;
            documentationShare.AccessLevel = accessLevel;
            documentationShare.UserOrGroupId = userOrGroupId;
            documentationShareList.add(documentationShare);
        }

        //Sharing Diagram__c
        Diagram__c[] diagramsList = [SELECT Id FROM Diagram__c WHERE Documentation__c = :recordId];
        Diagram__Share[] diagramShareList = new List<Diagram__Share>(); 
        Diagram__Share diagramShare;
        for(Diagram__c diagram : diagramsList){
            for(Id userOrGroupId : userOrGroupIdsList){
                diagramShare = new Diagram__Share();
                diagramShare.ParentID = diagram.Id;
                diagramShare.AccessLevel = accessLevel;
                diagramShare.UserOrGroupId = userOrGroupId;
                diagramShareList.add(diagramShare);
            }
        }

        insert documentationShareList;
        insert diagramShareList;

        Map<String, String> result = new Map<String, String>();
        result.put('status', 'success');
        result.put('message', 'Record shared successfully');
        return result;
    }

    @AuraEnabled
    public static Map<String,String> unshareDocumentation(Id recordId, Id userOrGroupId){
        if(String.isBlank(recordId)) throw new IllegalArgumentException('recordId cannot be null');
        if(String.isBlank(userOrGroupId)) throw new IllegalArgumentException('userOrGroupId cannot be null');

        List<Documentation__Share> documentationShareToDelete = [SELECT Id FROM Documentation__Share WHERE ParentID = :recordId AND UserOrGroupId = :userOrGroupId];
        Set<Id> diagramsIds = new Map<Id,Diagram__c>([SELECT Id FROM Diagram__c WHERE Documentation__c = :recordId]).keySet();
        
        List<Diagram__Share> diagramShareToDelete = [SELECT Id FROM Diagram__Share WHERE ParentID IN :diagramsIds AND UserOrGroupId = :userOrGroupId];
        
        delete documentationShareToDelete;
        delete diagramShareToDelete;

        Map<String, String> result = new Map<String, String>();
        result.put('status', 'success');
        result.put('message', 'Record unshared successfully');
        return result;
    }

    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getRecordShare(Id recordId){
        if(String.isBlank(recordId)) throw new IllegalArgumentException('recordId cannot be null');
        
        Documentation__Share[] documentationShareList = [SELECT UserOrGroupId, AccessLevel FROM Documentation__Share WHERE ParentId = :recordId];
        Set<Id> userOrGroupIdSet = new Set<Id>();
        for(Documentation__Share docShare : documentationShareList){
            userOrGroupIdSet.add(docShare.UserOrGroupId);
        }

        Map<Id, User> usersAlreadySharedMap = new Map<Id, User>([SELECT Id, Name FROM User WHERE Id IN :userOrGroupIdSet]);
        Map<Id, Group> groupsAlreadySharedMap = new Map<Id, Group>([SELECT Id, Name FROM Group WHERE Id IN :userOrGroupIdSet]);

        List<Map<String, String>> dataTo = new List<Map<String, String>>();

        Map<String, String> alreadySharedMap = new Map<String, String>();
        for(Documentation__Share documentationShare : documentationShareList){
            alreadySharedMap = new Map<String, String>();
            alreadySharedMap.put('Id', documentationShare.UserOrGroupId);
            alreadySharedMap.put('AccessLevel', documentationShare.AccessLevel);
            if(String.valueOf(documentationShare.UserOrGroupId).contains('005')){
                User userRecord = usersAlreadySharedMap.get(documentationShare.UserOrGroupId);
                alreadySharedMap.put('Name', userRecord.Name);
                alreadySharedMap.put('Type', 'User');
            }else{
                Group groupRecord = groupsAlreadySharedMap.get(documentationShare.UserOrGroupId);
                alreadySharedMap.put('Name', groupRecord.Name);
                alreadySharedMap.put('Type', 'Group');
            }
            dataTo.add(alreadySharedMap);
        }

        return dataTo;
    } 
}