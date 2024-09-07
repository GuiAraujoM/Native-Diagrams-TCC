public class ndfs_ChatGptResponseWrapper{
    @AuraEnabled
	public String id;	//chatcmpl-9auE36LCz7IFsAb6ifdoGYIGkCzzi
    @AuraEnabled
	public Integer created;	//1718582967
    @AuraEnabled
	public String model;	//gpt-3.5-turbo-0125
    @AuraEnabled
	public Choices[] choices;
    @AuraEnabled
	public Usage usage;
	public class Choices {
        @AuraEnabled
		public Integer index;	//0
        @AuraEnabled
		public Message message;
        @AuraEnabled
		public String finish_reason;	//stop
	}
	public class Message {
        @AuraEnabled
		public String role;	//assistant
        @AuraEnabled
		public String content;	//{"class":"GraphLinksModel","nodeDataArray":[{"category":"entity","items":[{"name":"Id","isKey":true},{"name":"Nome","isKey":false},{"name":"CPF","isKey":false}],"location":{"class":"go.Point","x":-153,"y":-101},"key":-1,"headerTitle":"Pessoa","headerSubTitle":"Pessoa__c"},{"category":"entity","items":[{"name":"Id","isKey":true},{"name":"Nome","isKey":false},{"name":"CPF","isKey":false},{"name":"Relação","isKey":false}],"location":{"class":"go.Point","x":-492,"y":-107},"key":-2,"headerTitle":"Dependente","headerSubTitle":"Dependente__c"}],"linkDataArray":[{"from":-1,"to":-2,"fromArrow":"Line","toArrow":"Fork","toText":"","fromText":""}]}
	}
	public class Usage {
        @AuraEnabled
		public Integer prompt_tokens;	//1380
        @AuraEnabled
		public Integer completion_tokens;	//191
        @AuraEnabled
		public Integer total_tokens;	//1571
	}
}