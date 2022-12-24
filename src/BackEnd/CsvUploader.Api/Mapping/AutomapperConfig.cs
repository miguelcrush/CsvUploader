using AutoMapper;
using CsvUploader.DataTransfer;
using CsvUploader.Models;

namespace CsvUploader.Api.Mapping
{
	public class AutomapperConfig : Profile
	{
		public AutomapperConfig() 
		{
			CreateMap<Patient, PatientDTO>().ReverseMap();
		}
	}
}
