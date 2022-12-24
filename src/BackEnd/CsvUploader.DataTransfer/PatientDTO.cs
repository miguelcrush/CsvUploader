using System.ComponentModel.DataAnnotations;

namespace CsvUploader.DataTransfer
{
	public class PatientDTO
	{
		public int Id { get; set; }
		[Required(AllowEmptyStrings =false, ErrorMessage = "First Name is required.")]
		public string FirstName { get; set; } = string.Empty;
		[Required(AllowEmptyStrings = false, ErrorMessage = "Last Name is required.")]
		public string LastName { get; set; } = string.Empty;
		[Required(AllowEmptyStrings = false, ErrorMessage = "Gender is required.")]
		public string Gender { get; set; } = string.Empty;

		[Required]
		public DateTime? Birthday { get; set; }
	}
}