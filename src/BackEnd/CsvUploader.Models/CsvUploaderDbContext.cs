using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CsvUploader.Models
{
	public class CsvUploaderDbContext : DbContext
	{
		public CsvUploaderDbContext()
		{

		}

		public CsvUploaderDbContext(DbContextOptions options)
			: base(options)
		{

		}

		public virtual DbSet<Patient> Patients { get; set; }
	}
}
