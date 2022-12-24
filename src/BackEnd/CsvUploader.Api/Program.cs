

using CsvUploader.Api.Mapping;
using CsvUploader.Api.Services;
using CsvUploader.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var connString = builder.Configuration.GetConnectionString("Default");

builder.Services.AddDbContext<CsvUploaderDbContext>(opts =>
{
	opts.UseSqlServer(connString);
});

builder.Services.AddAutoMapper(typeof(AutomapperConfig));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opts =>
{
	opts.SwaggerDoc("v1", new OpenApiInfo()
	{
		Version = "v1",
		Title = "CsvUploader"
	});

	var filePath = Path.Combine(AppContext.BaseDirectory, "CsvUploader.Api.xml");
	opts.IncludeXmlComments(filePath);
});

builder.Services.AddScoped<IPatientService, PatientService>();

var app = builder.Build();

var isDevelopment = app.Environment.IsDevelopment() || app.Environment.EnvironmentName.Equals("localhost", StringComparison.OrdinalIgnoreCase);

// Configure the HTTP request pipeline.
if (isDevelopment)
{
	app.UseSwagger();
	app.UseSwaggerUI();
	
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
