namespace CsvUploader.Models
{
	public class Patient
	{
		public int Id { get; set; }
		public string? FirstName { get; set; } = string.Empty;
		public string? LastName { get; set; } = string.Empty;
		public string? Gender { get; set; } = string.Empty;

		public DateTime Birthday { get; set; }
	}
}