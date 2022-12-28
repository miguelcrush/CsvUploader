using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CsvUploader.DataTransfer
{
	public class TypedResult
	{

		public string Message { get; set; }
		public bool WasSuccessful { get; set; }
		public ErrorSummary Summary { get; set; }

		public Exception Exception { get; set; }

		public TypedResult()
		{

		}

		public TypedResult(Exception ex, string message)
		{
			this.Exception = ex;
			this.Message = message;
		}

		public TypedResult(ErrorSummary summary, string message)
		{
			this.Summary = summary;
			this.Message = message;
		}

		public static TypedResult SuccessfulResult()
		{
			return new TypedResult() { WasSuccessful = true };
		}
	}

	/// <summary>
	/// Class for exposing the results of an operation between BLL and API
	/// </summary>
	/// <typeparam name="T"></typeparam>
	public class TypedResult<T> :TypedResult where T: class
	{
		public T Payload { get; set; }

		public TypedResult(T payload)
		{
			WasSuccessful = true;
			Payload = payload;
		}

		public TypedResult(ErrorSummary errorSummary, string message)
		{
			WasSuccessful = false;
			Summary = errorSummary;
			Message = message;
		}
	}

	public enum ErrorSummary
	{
		None = 0,
		InvalidRequest = 1,
		GeneralError =2,
		NotFound=3
	}
}
