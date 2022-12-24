using CsvUploader.DataTransfer;
using Microsoft.AspNetCore.Mvc;

namespace CsvUploader.Api.Controllers
{
	public abstract class BaseCsvUploaderController : ControllerBase
	{
		public async Task<IActionResult> HandleTypedResult<TResult,TController>(
			TypedResult<TResult> result, 
			int successfulStatusCode,
			ILogger<TController> logger) where TResult : class 
		{
			if (result.WasSuccessful)
			{
				return StatusCode(successfulStatusCode, result.Payload);
			}
			else
			{
				switch (result.Summary)
				{
					case ErrorSummary.InvalidRequest:
						return StatusCode(StatusCodes.Status400BadRequest, result.Message);
					case ErrorSummary.GeneralError:
					case ErrorSummary.None:
					default:
						logger.LogError(result.Message, result.Exception ?? new Exception(result.Message));
						return StatusCode(500, "Unhandled exception");
				}
			}
		}
	}
}
