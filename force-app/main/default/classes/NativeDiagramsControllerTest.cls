@IsTest
public class NativeDiagramsControllerTest {
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
    public static void getDiagramTest() {
        Id diagramId = [SELECT Id FROM Diagram__c WHERE DiagramName__c = 'Diagrama teste'].Id;

        Test.startTest();      
            Diagram__c d = NativeDiagramsController.getDiagram(diagramId);
        Test.stopTest();

        System.assertEquals(d.DiagramName__c, 'Diagrama teste', 'Deveria ter retornado o diagrama');
    }

    @IsTest
    public static void getDiagramsByDocumentation() {
        Id docId = [SELECT Id FROM Documentation__c WHERE Name__c = 'Documentação teste'].Id;

        Test.startTest();      
            Diagram__c[] diaList = NativeDiagramsController.getDiagramsByDocumentation(docId);
        Test.stopTest();

        System.assertEquals(diaList.size(), 1, 'Deveria ter retornado a lista de diagramas');
    }

    
}