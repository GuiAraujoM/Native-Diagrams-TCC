public class ndfs_ChatGptRequestWrapper{
	public String model; //gpt-3.5-turbo
	public Messages[] messages;
	public class Messages {
		public String role;	//system
		public String content;
	}
}