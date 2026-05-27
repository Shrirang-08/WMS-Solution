# Workforce Management System (WMS)

A full-stack enterprise Workforce Management System built with Clean Architecture.

## Tech Stack

| Layer        | Technology                              |
|-------------|----------------------------------------|
| Backend     | ASP.NET Core Web API (.NET 8)          |
| Frontend    | Angular 21 + Angular Material          |
| Database    | SQL Server + EF Core (Code First)      |
| Auth        | JWT + Role-based Authorization         |
| Testing     | xUnit                                   |
| CI/CD       | Azure DevOps Pipelines                 |
| Logging     | Serilog                                 |
| Mapping     | AutoMapper                             |

## Architecture (Clean Architecture)

```
WMS-Solution/
├── WMS.Domain/         # Entities, Enums, Common (innermost layer)
├── WMS.Application/    # DTOs, Interfaces, Services, AutoMapper
├── WMS.Infrastructure/ # EF Core DbContext, Repositories, Auth, JWT
├── WMS.API/            # Controllers, Middleware, Program.cs
├── WMS.Tests/          # xUnit unit tests
├── WMS.DevOps/         # CI/CD pipeline YAML files
└── WMS-Client/         # Angular frontend
```

## Prerequisites

- [Visual Studio 2022](https://visualstudio.microsoft.com/vs/)
- [SQL Server 2019+](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- [SQL Server Management Studio (SSMS)](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)
- [.NET SDK 8.0](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 20+](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli): `npm install -g @angular/cli`

## Setup Instructions

### 1. Clone Repository

```bash
git clone <repo-url> WMS-Solution
cd WMS-Solution
```

### 2. Database Setup

#### Option A: Using Package Manager Console (Visual Studio)
```powershell
Update-Database -Project WMS.Infrastructure -StartupProject WMS.API
```

#### Option B: Using .NET CLI
```powershell
dotnet ef database update --project WMS.Infrastructure --startup-project WMS.API
```

This creates the `WMSDb` database with all tables and seed data.

> **Connection String**: `Server=localhost\SQLEXPRESS;Database=WMSDb;Trusted_Connection=True;TrustServerCertificate=True;`

### 3. Run Backend

```bash
dotnet run --project WMS.API
```

Swagger UI opens at: `http://localhost:5185/swagger`

### 4. Run Frontend

```bash
cd WMS-Client
npm install   # or npm ci
ng serve --proxy-config proxy.conf.json
```

Frontend runs at: `http://localhost:4200`

The proxy config forwards `/api` requests to the backend at `http://localhost:5185`.

### 5. Login Credentials (Seeded)

| Username | Password    | Role      |
|---------|------------|-----------|
| admin   | Admin@123  | Admin     |

## API Endpoints

| Method | Endpoint                            | Auth Required | Roles         |
|--------|-------------------------------------|---------------|---------------|
| POST   | /api/auth/login                     | No            | -             |
| POST   | /api/auth/register                  | No            | -             |
| GET    | /api/employees                      | Yes           | -             |
| GET    | /api/employees/{id}                 | Yes           | -             |
| GET    | /api/employees/search?term=         | Yes           | -             |
| POST   | /api/employees                      | Yes           | Admin,Manager |
| PUT    | /api/employees/{id}                 | Yes           | Admin,Manager |
| DELETE | /api/employees/{id}                 | Yes           | Admin         |
| GET    | /api/departments                    | Yes           | -             |
| POST   | /api/departments                    | Yes           | Admin         |
| PUT    | /api/departments/{id}               | Yes           | Admin         |
| DELETE | /api/departments/{id}               | Yes           | Admin         |
| GET    | /api/attendance/employee/{id}/month/{y}/{m} | Yes    | -             |
| POST   | /api/attendance/check-in            | Yes           | -             |
| POST   | /api/attendance/{id}/check-out      | Yes           | -             |
| GET    | /api/leaves/employee/{id}           | Yes           | -             |
| POST   | /api/leaves/apply                   | Yes           | -             |
| PATCH  | /api/leaves/{id}/cancel             | Yes           | -             |
| PATCH  | /api/leaves/{id}/decision           | Yes           | Admin,Manager |
| GET    | /api/projects                       | Yes           | -             |
| POST   | /api/projects                       | Yes           | Admin,Manager |
| PUT    | /api/projects/{id}                  | Yes           | Admin,Manager |
| DELETE | /api/projects/{id}                  | Yes           | Admin         |
| GET    | /api/dashboard                      | Yes           | -             |

## Testing

### Backend Tests
```bash
dotnet test WMS.Tests/WMS.Tests.csproj
```

### Frontend Tests
```bash
cd WMS-Client
ng test
```

### Postman Testing
1. Import the API collection from `tools/postman/` (if available)
2. Call `POST /api/auth/login` with `{ "username": "admin", "password": "Admin@123" }`
3. Copy the JWT token from the response
4. Use the token as Bearer token for authenticated requests

## Frontend Modules

| Module        | Path              | Description                     |
|--------------|-------------------|---------------------------------|
| Auth         | /login, /register | Login & registration            |
| Dashboard    | /dashboard        | KPI cards, stats               |
| Employees    | /employees        | CRUD, search                   |
| Departments  | /departments      | CRUD (admin only)              |
| Attendance   | /attendance       | Check-in/out, monthly view     |
| Leaves       | /leaves           | Apply, approve/reject          |
| Projects     | /projects         | CRUD, employee allocation      |
| Reports      | /reports          | CSV export                     |

## Azure DevOps CI/CD

Pipeline YAML files are in `WMS.DevOps/pipelines/`:

- `ci-build.yml` - Build pipeline (restore, build, test, publish)
- `cd-release.yml` - Release pipeline (deploy to Azure App Service)

### Setup in Azure DevOps

1. Create a new project in Azure DevOps
2. Push code to Azure Repos
3. Create a Build Pipeline pointing to `WMS.DevOps/pipelines/ci-build.yml`
4. Create a Release Pipeline pointing to `WMS.DevOps/pipelines/cd-release.yml`
5. Configure the following pipeline variables:
   - `SqlAdminPassword` - SQL Server admin password
   - `JwtKey` - 32+ character JWT signing key
   - `AzureServiceConnection` - your Azure service connection name

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push and create PR
git push origin feature/your-feature-name

# After PR approval, merge to dev
git checkout dev
git merge feature/your-feature-name

# Release: merge dev to main
git checkout main
git merge dev
git tag v1.0.0
git push origin main --tags
```

## Environment Variables

Override `appsettings.json` via environment variables for production:

| Variable                                    | Description            |
|---------------------------------------------|------------------------|
| `ConnectionStrings__DefaultConnection`      | SQL Server connection  |
| `Jwt__Key`                                  | JWT signing key        |
| `Jwt__Issuer`                               | JWT issuer             |
| `Jwt__Audience`                             | JWT audience           |
| `ASPNETCORE_ENVIRONMENT`                    | Environment name       |

## Security

- JWT tokens with HMAC-SHA256 signing
- Passwords hashed using ASP.NET Core Identity `PasswordHasher`
- Role-based authorization (`Admin`, `Manager`, `Employee`)
- CORS restricted to Angular dev server
- Exception handling middleware for consistent error responses
- SQL injection protection via EF Core parameterized queries

## Project Status

- [x] Backend API (all CRUD operations, auth, JWT)
- [x] Database schema (EF Core Code First, migrations, seed data)
- [x] Frontend (Angular, Material UI, all modules)
- [x] Unit tests (xUnit)
- [x] CI/CD pipeline (Azure DevOps YAML)
- [ ] Crystal Reports integration (install separately)
- [ ] Production deployment
