using CsvUploader.Api.Services;
using CsvUploader.DataTransfer;
using Microsoft.AspNetCore.Mvc;

namespace CsvUploader.Api.Controllers
{
	/// <summary>
	/// Controller for patient operations
	/// </summary>
	[ApiController]
	[Route("api/[controller]")]
	public class PatientsController : BaseCsvUploaderController
	{ 
		private readonly ILogger<PatientsController> _logger;
		private readonly IPatientService _patientService;


		/// <summary>
		/// Constructor
		/// </summary>
		/// <param name="logger"></param>
		/// <param name="patientService"></param>
		public PatientsController(
			ILogger<PatientsController> logger,
			IPatientService patientService
			)
		{
			_logger = logger;
			_patientService = patientService;
		}

		/// <summary>
		/// Gets a the list of existing patients.
		/// </summary>
		/// <returns>A list of <see cref="PatientDTO"/></returns>
		[HttpGet]
		[ProducesResponseType(typeof(List<PatientDTO>), 200)]
		public async Task<IActionResult> GetPatients()
		{
			var result = await _patientService.GetPatients();
			return Ok(result);
		}

		/// <summary>
		/// Creates a set of patients based on a csv file.
		/// </summary>
		/// <param name="file"></param>
		/// <returns>The list of created patients.</returns>
		[HttpPost("csv")]
		[ProducesResponseType(typeof(List<PatientDTO>), 201)]
		public async Task<IActionResult> PostPatientCsv(IFormFile file)
		{
			if(file == null)
			{
				return BadRequest("File is required");
			}

			var csvData = default(string);
			using (var stream = file.OpenReadStream())
			{
				using (var streamReader = new StreamReader(stream))
				{
					csvData = await streamReader.ReadToEndAsync();
				}
			}

			var result = await _patientService.SavePatientCsv(csvData);
			return await base.HandleTypedResult(result, 201, _logger);
		}
	}
}