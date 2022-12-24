using Castle.Core.Logging;
using CsvUploader.Api.Controllers;
using CsvUploader.Api.Services;
using CsvUploader.DataTransfer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Text;

namespace CsvUploader.Api.Tests.Controllers
{
    public class ControllerTests
    {
        [Fact]
        public async void GetPatients_ReturnsIActionResult_WithListOfAllPatients()
        {
            var patientService = new Mock<IPatientService>();
            patientService.Setup(svc => svc.GetPatients())
                .Returns(GetTestPatients());

            var logger = new Mock<ILogger<PatientsController>>();

            var controller = new PatientsController(logger.Object, patientService.Object);

            var result = await controller.GetPatients();

            Assert.True(result is OkObjectResult);

            var okResult = result as OkObjectResult;

            Assert.True(okResult.Value.GetType() == typeof(List<PatientDTO>));
            Assert.True((okResult.Value as List<PatientDTO>).Count == 2);
        }

        [Fact]
        public async void PostPatientsCsv_ReturnsIActionResult_WithListOfPatients()
        {
            var testPatients = await GetTestPatients();

            var patientService = new Mock<IPatientService>();
            patientService.Setup(svc => svc.SavePatientCsv(It.IsAny<string>()))
                .ReturnsAsync(new TypedResult<List<PatientDTO>>(testPatients));

            var logger = new Mock<ILogger<PatientsController>>();

            var controller = new PatientsController(logger.Object, patientService.Object);

            var csv = "First Name, Last Name, Birthday, Gender\r\nDavid,Tester,2000-10-11,M";
            var bytes = Encoding.UTF8.GetBytes(csv);
            using(var stream = new MemoryStream(bytes))
            {

                var formFile = new FormFile(stream, 0, stream.Length, "file", "file");
                var result = await controller.PostPatientCsv(formFile);
                Assert.True( result.GetType().IsAssignableFrom(typeof(ObjectResult)));

                var okObjectResult = result as ObjectResult;
                Assert.True(okObjectResult.StatusCode == 201);
                Assert.True(okObjectResult.Value is List<PatientDTO>);
                Assert.True((okObjectResult.Value as List<PatientDTO>).Count == 2);
			}

        }

        [Fact]
        public async void PostPatientsCsv_ReturnsBadRequestWhenMissingFile()
        {
			var testPatients = await GetTestPatients();

			var patientService = new Mock<IPatientService>();
			patientService.Setup(svc => svc.SavePatientCsv(It.IsAny<string>()))
				.ReturnsAsync(new TypedResult<List<PatientDTO>>(testPatients));

			var logger = new Mock<ILogger<PatientsController>>();

			var controller = new PatientsController(logger.Object, patientService.Object);

            var result =await controller.PostPatientCsv(null);

            Assert.True(result.GetType().IsAssignableFrom(typeof(BadRequestObjectResult)));
		}

		private async Task<List<PatientDTO>> GetTestPatients()
        {
            var list = new List<PatientDTO>
            {
                new PatientDTO
                {
                    FirstName = "Zero",
                    LastName= "Cool",
                    Birthday = DateTime.Parse("1985-10-12"),
                    Gender = "M",
                    Id=1
                },
                new PatientDTO()
                {
                    FirstName="Crash",
                    LastName = "Override",
                    Birthday = DateTime.Parse("1988-11-27"),
                    Gender = "M",
                    Id=2
                }
            };

            return await Task.FromResult(list);
        }
    }
}