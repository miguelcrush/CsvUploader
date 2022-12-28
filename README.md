# CsvUploader
## Key Features
- Lists uploaded patient information with the ability to search, sort and edit patient records
- Supports the ability to upload a CSV with patient information

## Known Issue
- Upon cold launch, the API needs to spin back up which introduces some latency to the first request. The Vercel hosting platform (on the 'hobby' service - free plan) has a limit of 5 seconds until requests are timed out. These two items in combination may result in the first request to the app to be accompanied with a "FUNCTION INVOCATION TIMEOUT" message, but can be disregarded.

## Architecture
- .NET 6.0 Web Api hosted in MS Azure (https://appsvc-csvuploader-api.azurewebsites.net/swagger/index.html)
- NextJS frontend-backend hosted in Vercel (https://csv-uploader-miguelcrush.vercel.app/)
- MSSQL hosted in Azure
- Source hosted in GitHub (https://github.com/miguelcrush/CsvUploader)
- CI/CD hosted by Azure DevOps

## Details:
### Web API
- Technologies used:
  - Automapper (for mapping Models to Data Transfer Objects)
  - Swagger (for API documentation)
  - xUnit testing
- Routes protected via API key
- CI/CD via ADO (backend only)

### Frontend
- Responsive design
- Technologies used:
  - React
  - nextJs (NodeJs server technology that supports quick prototyping & secret support) - this model was chosen specifically so the API key can be kept secure (never sent to client)
  - Chakra UI (component library with emphasis on accessibility)
  - Cypress for testing
- CI / CD via Vercel hosting (frontend only) 

### Database
- EF Core
- Schema defined in source control (SSDT project)
  - Access to server avaialable upon request

### CI / CD (backend)
- See https://github.com/miguelcrush/CsvUploader/blob/main/azure-pipelines.yml for pipeline configuration
- Automated build
- Automated testing
- Deployment to Azure Web App
- Secrets (connection string for example) stored in Azure Key Vault

## Running Locally
### Frontend
- CD to `/Frontend`
- run `npm install`
- configure `.env.local`
 - `API_KEY=`, `API_BASE_URL=`
### Backend
- configure app settings
 - `ApiKey`, `ConnectionStrings:Default`
