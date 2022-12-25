using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CsvUploader.DataTransfer
{
	/// <summary>
	/// Class representing the parameters for patient search
	/// </summary>
	public class PatientSearchDTO
	{
		public string? SearchTerm { get; set; }
		public SortEnum Sort { get; set; }
	}

	public enum SortEnum
	{
		Ascending,
		Descending,
	}
}
