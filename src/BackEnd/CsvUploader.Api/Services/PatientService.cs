using AutoMapper;
using AutoMapper.Configuration;
using CsvUploader.DataTransfer;
using CsvUploader.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Data;

namespace CsvUploader.Api.Services
{
	/// <summary>
	/// Class describing a service that performs patient operations.
	/// </summary>
	public interface IPatientService
	{
		/// <summary>
		/// Gets patient list
		/// </summary>
		/// <returns></returns>
		Task<TypedResult<List<PatientDTO>>> GetPatients(PatientSearchDTO searchDTO);

		/// <summary>
		/// Accepts a CSV delimited string and creates <see cref="Patient"/> records from it.
		/// </summary>
		/// <param name="csv"></param>
		/// <returns>The created patients.</returns>
		Task<TypedResult<List<PatientDTO>>> SavePatientCsv(string csv);

		/// <summary>
		/// Saves a patient
		/// </summary>
		/// <param name="patient"></param>
		/// <returns></returns>
		Task<TypedResult<PatientDTO>> SavePatient(PatientDTO patient);

	}

	///<inheritdoc/>
	public class PatientService : IPatientService
	{
		private readonly CsvUploaderDbContext _dbContext;
		private readonly IMapper _mapper;

		public PatientService(
			CsvUploaderDbContext dbContext,
			IMapper mapper
			)
		{
			_dbContext = dbContext;
			_mapper = mapper;
		}

		///<inheritdoc/>
		public async Task<TypedResult<List<PatientDTO>>> GetPatients(PatientSearchDTO searchDto)
		{
			if (searchDto == null)
			{
				searchDto = new PatientSearchDTO();
			}

			var patientsQuery = _dbContext.Patients.Where(p=> 1 == 1);
			if (!string.IsNullOrEmpty(searchDto.SearchTerm))
			{
				patientsQuery = patientsQuery
					.Where(p =>
						p.FirstName.Contains(searchDto.SearchTerm)
						|| p.LastName.Contains(searchDto.SearchTerm)
					);
			}

			if(searchDto.Sort == SortEnum.Ascending)
			{
				patientsQuery = patientsQuery.OrderBy(p => p.LastName);
			}
			else
			{
				patientsQuery = patientsQuery.OrderByDescending(p => p.LastName);
			}

			var results = await patientsQuery.ToListAsync();

			return new TypedResult<List<PatientDTO>>( results.Select(p=> _mapper.Map<PatientDTO>(p)).ToList());
		}

		///<inheritdoc/>
		public  async Task<TypedResult<List<PatientDTO>>> SavePatientCsv(string csv)
		{
			if (string.IsNullOrEmpty(csv))
			{
				return new TypedResult<List<PatientDTO>>(new List<PatientDTO>());
			}

			//assume that the csv could have incorrectly ordered columns
			//parse to datatable for easier handling - will also make it easier to handle additional properties if needed

			//(definitely overengineered :))

			var expectedSchema = new Dictionary<string, Type>(StringComparer.OrdinalIgnoreCase)
			{
				{"First Name", typeof(string) },
				{"Last Name", typeof(string) },
				{"Birthday", typeof(string) },
				{"Gender", typeof(string) }
			};

			var datatable = new DataTable();
			var lines = csv.Split("\r\n");
			var firstLine = lines[0];
			var firstLineCells = firstLine.Split(",");

			//for each cell of the first line (headers), create a column
			foreach(var headerCell in firstLineCells)
			{
				var dataType = default(Type);
				if(!expectedSchema.TryGetValue(headerCell, out dataType))
				{
					return new TypedResult<List<PatientDTO>>(ErrorSummary.InvalidRequest, "Invalid CSV schema");
				}
				datatable.Columns.Add(headerCell, dataType);
			}

			//create a map of the column names & indexes
			var colMap = datatable.Columns.OfType<DataColumn>()
				.Select((c,i)=> new {Name=c.ColumnName, Index = i})
				.ToDictionary(cm=> cm.Index, cm=> cm.Name);

			for(int lineNo = 1; lineNo < lines.Length; lineNo++)
			{
				var line = lines[lineNo];
				//if we hit a blank line ,break
				if (string.IsNullOrEmpty(line))
				{
					break;
				}
				var split = line.Split(",");
				var dataRow = datatable.NewRow();

				for(int cellNo = 0; cellNo< split.Length; cellNo++)
				{
					dataRow[colMap[cellNo]] = split[cellNo];
				}

				datatable.Rows.Add(dataRow);
			}

			var patientDtos = new List<PatientDTO>();

			//extract known props from datatable
			foreach(DataRow dataRow in datatable.Rows)
			{
				var birthday = default(DateTime);
				if (!DateTime.TryParse(dataRow["Birthday"].ToString(), out birthday))
				{
					return new TypedResult<List<PatientDTO>>(ErrorSummary.InvalidRequest, $"Birthday value {dataRow["Birthday"]} is invalid.");
				}

				patientDtos.Add(new PatientDTO()
				{
					Birthday = birthday,
					FirstName = dataRow.Field<string>("First Name"),
					LastName = dataRow.Field<string>("Last Name"),
					Gender = dataRow.Field<string>("Gender")
				}) ;
			}

			//validate using validator context (which utilizes data annotations on the model)
			//we're doing it this way as its a CSV and the runtime cannot perform model validation against that
			var results = new List<PatientDTO>();
			foreach(var patientDto in patientDtos)
			{
				var saveResult = await SavePatient(patientDto);
				if (!saveResult.WasSuccessful)
				{
					return new TypedResult<List<PatientDTO>>(saveResult.Summary, saveResult.Message);
				}

				results.Add(saveResult.Payload);
			}

			//return the new rows
			return new TypedResult<List<PatientDTO>>(results.Select(m => _mapper.Map<PatientDTO>(m)).ToList());
		}

		public async Task<TypedResult<PatientDTO>> SavePatient(PatientDTO patient)
		{
			if (patient == null)
			{
				return new TypedResult<PatientDTO>(ErrorSummary.InvalidRequest, $"{nameof(patient)} is required");
			}

			var validationResult = await Validate(patient);
			if (!validationResult.WasSuccessful)
			{
				return new TypedResult<PatientDTO>(ErrorSummary.InvalidRequest, validationResult.Message);
			}

			var mapped = _mapper.Map<Patient>(patient);

			if (mapped.Id == 0)
			{
				_dbContext.Patients.Add(mapped);
			}
			else
			{
				_dbContext.Patients.Update(mapped);
			}
			await _dbContext.SaveChangesAsync();

			return new TypedResult<PatientDTO>(_mapper.Map<PatientDTO>(mapped));
		}

		private async Task<TypedResult> Validate(PatientDTO patient)
		{
			var validatorContext = new System.ComponentModel.DataAnnotations.ValidationContext(patient);
			var validationResults = new List<ValidationResult>();
			var isValid = Validator.TryValidateObject(patient, validatorContext, validationResults);
			if (!isValid)
			{
				return new TypedResult(ErrorSummary.InvalidRequest, string.Join(", ", validationResults.Select(v => v.ErrorMessage)));
			}
			return TypedResult.SuccessfulResult();
		}
	}
}
