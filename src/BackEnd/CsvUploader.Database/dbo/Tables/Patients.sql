CREATE TABLE [dbo].[Patients]
(
	Id int NOT NULL IDENTITY(1,1),
	FirstName nvarchar(255) NOT NULL,
	LastName nvarchar(255) NOT NULL,
	Birthday datetime NOT NULL,
	Gender nvarchar(15) NOT NULL,
	CONSTRAINT PK_Patients PRIMARY KEY(Id)
)
