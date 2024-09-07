@IsTest
public class ShareDocumentationControllerTest {
    @TestSetup
    static void makeData(){
        Documentation__c doc = new Documentation__c();
        doc.Name__c = 'Documentação teste';
        insert doc;

        Diagram__c dia = new Diagram__c();
        dia.DiagramName__c = 'Diagrama teste';
        dia.Type__c = 'Entity Relationship';
        dia.Documentation__c = doc.Id;

        insert dia;
    }

    @IsTest
    static void shareDocumentationTest(){
        Id docId = [SELECT Id FROM Documentation__c].Id;
        Id groupId = [SELECT Id FROM Group WHERE DeveloperName = 'AllInternalUsersNativeDiagrams'].Id;
        
        Test.startTest();
        Map<String,String> result = ShareDocumentationController.shareDocumentation(docId, new List<Id>{groupId}, 'Edit');
        Test.stopTest();

        System.assertEquals(result.get('status'), 'success', 'Resultado do compartilhamento deveria ser sucesso!');        
    }

    @IsTest
    static void unshareDocumentationTest(){
        Id docId = [SELECT Id FROM Documentation__c].Id;
        Id groupId = [SELECT Id FROM Group WHERE DeveloperName = 'AllInternalUsersNativeDiagrams'].Id;

        
        Test.startTest();
        ShareDocumentationController.shareDocumentation(docId, new List<Id>{groupId}, 'Edit');
        Map<String,String> result = ShareDocumentationController.unshareDocumentation(docId, groupId);
        Test.stopTest();

        System.assertEquals(result.get('status'), 'success', 'Resultado do descompartilhamento deveria ser sucesso!');        
    }

    @IsTest
    static void getRecordShareTest(){
        Id docId = [SELECT Id FROM Documentation__c].Id;
        Group groupShared = [SELECT Id, Name FROM Group WHERE DeveloperName = 'AllInternalUsersNativeDiagrams'];

        
        Test.startTest();
        ShareDocumentationController.shareDocumentation(docId, new List<Id>{groupShared.Id}, 'Edit');
        List<Map<String, String>> result = ShareDocumentationController.getRecordShare(docId);
        Test.stopTest();

        System.assertEquals(result[0].get('Name'), groupShared.Name, 'Listagem de compartilhamento vazia!');        
    }
}