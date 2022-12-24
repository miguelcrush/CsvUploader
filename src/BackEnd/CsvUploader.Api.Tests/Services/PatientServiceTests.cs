using AutoMapper;
using CsvUploader.Api.Mapping;
using CsvUploader.Api.Services;
using CsvUploader.DataTransfer;
using CsvUploader.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CsvUploader.Api.Tests.Services
{
	public class PatientServiceTests
	{
		/// <summary>
		/// Verifies that the <see cref="PatientService.GetPatients" method returns patients./>
		/// </summary>
		[Fact]
		public async void GetPatientsList_ReturnsListOfPatients()
		{
			var mapper = GetMapper();
			await ExecuteWithContext(async (dbContext) =>
			{
				var patientService = new PatientService(dbContext, mapper);

				var result = await patientService.GetPatients();

				Assert.True(result.Count() == 2);
			});
		}

		/// <summary>
		/// Verifies that a post patient CSV is parsed correctly and returns the created items.
		/// </summary>
		[Fact]
		public async void PostPatientsCsv_ReturnsListOfPatients()
		{
			var mapper = GetMapper();
			await ExecuteWithContext(async (dbContext) =>
			{
				var patientService = new PatientService(dbContext, mapper);
				var csv = "First Name,Last Name,Birthday,Gender\r\nDave,Davidson,2000-01-01,M\r\nGina,Geoffrys,2010-02-02,F";
				var result = await patientService.SavePatientCsv(csv);

				Assert.True(result.WasSuccessful && result.Payload.Count == 2);
			});
		}

		/// <summary>
		/// Verifies that a poorly-formatted CSV results in a bad request response.
		/// </summary>
		[Fact]
		public async void PostPatientsCsv_BadRequest()
		{
			var mapper = GetMapper();
			await ExecuteWithContext(async (dbContext) =>
			{
				var patientService = new PatientService(dbContext, mapper);
				var csv = "First Name,Last Name,Birthday,Gender\r\nDave,Davidson,blah blah,M\r\nGina,Geoffrys,2010-02-02,F";
				var result = await patientService.SavePatientCsv(csv);

				Assert.True(!result.WasSuccessful && result.Summary == ErrorSummary.InvalidRequest);
			});
		}

		private IMapper GetMapper()
		{
			var config = new MapperConfiguration(cfg =>
			{
				cfg.AddProfile<AutomapperConfig>();
			});

			var mapper = new Mapper(config);
			return mapper;
		}

		private async Task ExecuteWithContext(Action<CsvUploaderDbContext> action)
		{
			var opts = new DbContextOptionsBuilder<CsvUploaderDbContext>()
				.UseInMemoryDatabase(Guid.NewGuid().ToString())
				.Options;

			using (var context = new CsvUploaderDbContext(opts))
			{
				context.Patients.AddRange(new List<Patient>()
				{
					new Patient()
					{
						FirstName = "FirstName",
						LastName="LastName",
						Birthday = DateTime.Parse("2000-01-01"),
						Gender = "M"
					},
					new Patient()
					{
						FirstName = "First2Name",
						LastName= "Last2Name",
						Birthday= DateTime.Parse("2021-02-02"),
						Gender = "F"
					}
				});

				await context.SaveChangesAsync();

				action(context);
			}
		}
	}
}
