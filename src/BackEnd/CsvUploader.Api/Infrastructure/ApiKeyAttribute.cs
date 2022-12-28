using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;

namespace CsvUploader.Api.Infrastructure
{
	/// <summary>
	/// Attribute requring an API key for successful execution
	/// </summary>
	[AttributeUsage(validOn: AttributeTargets.Method | AttributeTargets.Class)]
	public class RequiresApiKeyAttribute : Attribute, IAsyncActionFilter
	{
		private const string API_KEY_NAME = "apikey";

		public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
		{
			if(!context.HttpContext.Request.Headers.TryGetValue(API_KEY_NAME, out var extractedApiKey))
			{
				context.Result = new ContentResult()
				{
					StatusCode = 401,
					Content = "Api key was not provided"
				};
				return;
			}

			var config = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
			var apiKey = config.GetValue<string>("ApiKey");
			if (!apiKey.Equals(extractedApiKey))
			{
				context.Result = new ContentResult()
				{
					StatusCode = 401,
					Content = "Api key is invalid"
				};
				return;
			}

			await next();
		}
	}
}
