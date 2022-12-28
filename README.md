# CsvUploader
## Key Features:
- Lists uploaded patient information with the ability to search, sort and edit patient records
- Supports the ability to upload a CSV with patient information

## Architecture:
- .NET 6.0 Web Api hosted in MS Azure (https://appsvc-csvuploader-api.azurewebsites.net/swagger/index.html)
- NextJS frontend-backend hosted in Vercel (https://csv-uploader-miguelcrush.vercel.app/)
- MSSQL hosted in Azure
- Source hosted in GitHub (https://github.com/miguelcrush/CsvUploader)
- CI/CD hosted by Azure DevOps

## Details:
### Web API:
- Technologies used:
  - Automapper (for mapping Models to Data Transfer Objects)
  - Swagger (for API documentation)
  - xUnit testing
- Routes protected via API key
- CI/CD via ADO (backend only)

### Frontend
- Technologies used:
  - React
  - nextJs (NodeJs server technology that supports quick prototyping & secret support)
   - This model was chosen specifically so the API key can be kept secure (never sent to client)
  - Chakra UI (component library with emphasis on accessibility)
- CI / CD via Vercel hosting (frontend only) 

### Database
- EF Core
- Schema defined in source control (SSDT project)
  - Access avaialable upon request

### CI / CD (backend)
- See https://github.com/miguelcrush/CsvUploader/blob/main/azure-pipelines.yml for pipeline configuration
- Automated build
- Automated testing
- Deployment to Azure Web App
- Secrets (connection string for example) stored in Azure Key Vault
