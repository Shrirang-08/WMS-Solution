# WMS — High-Level Design Document

## 1. Overview

**Workforce Management System (WMS)** is a full-stack web application for managing employee attendance, leave requests, project allocations, and organizational reporting. Built with ASP.NET Core 8 (Clean Architecture) and Angular 21, deployed to Microsoft Azure via CI/CD.

## 2. System Architecture

```plantuml
@startuml
skinparam componentStyle rectangle

package "Presentation Layer" #LightCyan {
  [Angular 21 SPA\nAzure App Service\nNode 22 PM2] as ANG
}

package "API Layer" #LightGreen {
  [ASP.NET Core 8\nAzure App Service\n. NET 8 Linux] as API
}

package "Application Layer" #LightYellow {
  [WMS.Application\nService Interfaces\nDTOs - AutoMapper] as APP
}

package "Infrastructure Layer" #LightCoral {
  [WMS.Infrastructure\nEF Core Repositories\nUnit of Work - JWT] as INFRA
}

package "Domain Layer" #LightGray {
  [WMS.Domain\nEntities - Enums] as DOM
}

database "Azure SQL Database\nBasic Tier 5 DTU" as DB

ANG --> API : HTTPS / JSON
API --> APP
APP --> INFRA
INFRA --> DOM
INFRA --> DB

@enduml
```

## 3. Architectural Principles

| Principle | Application |
|---|---|
| **Clean Architecture** | 4-layer onion: Domain → Application → Infrastructure → API |
| **SOLID** | Single-responsibility services, interface-based DI |
| **Repository + Unit of Work** | Data access abstraction over EF Core |
| **JWT Authentication** | Stateless auth with role-based authorization |
| **Code-First Migrations** | EF Core auto-migrates on application startup |

## 4. Deployment Architecture (Azure)

```plantuml
@startuml
skinparam packageStyle rectangle

rectangle "Azure DevOps Pipeline" as DEVOPS {
  (Build: dotnet + ng build) as BUILD
  (Test: xUnit) as TEST
  (Deploy: AzureWebApp@1) as DEPLOY
  BUILD --> TEST --> DEPLOY
}

rectangle "Resource Group: WMS-RG" as RG {
  node "wms-api-app-123\nApp Service B1 Linux\n.NET 8" as API
  node "wms-client-app\nApp Service B1 Linux\nNode 22" as CLIENT
  database "wms-sql-server\nAzure SQL\nWMSDb Basic" as SQL
}

DEPLOY --> API
DEPLOY --> CLIENT
API --> SQL
CLIENT -right-> API : CORS

@enduml
```

### CI/CD Pipeline

- **Trigger**: `main`, `dev`, `feature/*` branches
- **Build**: `dotnet restore → build → test → publish (zip)` + `npm ci → ng build (prod)`
- **Deploy**: `AzureWebApp@1` (zipDeploy, webAppLinux) for both apps
- **Service Connection**: `AzureServiceConnection` (Contributor on WMS-RG)

## 5. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Backend Runtime | .NET (ASP.NET Core) | 8.x |
| Frontend Runtime | Angular | 21 |
| UI Framework | Angular Material | 21 |
| ORM | Entity Framework Core | 8.x |
| Database | SQL Server (Azure SQL) | — |
| Auth | JWT Bearer (custom service) | — |
| Mapping | AutoMapper | — |
| CI/CD | Azure DevOps (YAML pipelines) | — |

## 6. Domain Entities & Relationships

```plantuml
@startuml
skinparam classAttributeIconSize 0

entity Employee {
  * Id : int <<PK>>
  * EmployeeCode : string <<UK>>
  * FirstName : string
  * LastName : string
  * Email : string <<UK>>
  * PhoneNumber : string
  * DateOfBirth : date
  * HireDate : date
  * JobTitle : string
  * Salary : decimal
  * DepartmentId : int <<FK>>
  * RoleId : int <<FK>>
  * IsActive : bool
}

entity Attendance {
  * Id : int <<PK>>
  * EmployeeId : int <<FK>>
  * AttendanceDate : date
  * CheckInTime : time
  * CheckOutTime : time
  * Status : int
  * Remarks : string
}

entity Leave {
  * Id : int <<PK>>
  * EmployeeId : int <<FK>>
  * FromDate : date
  * ToDate : date
  * LeaveType : string
  * Reason : string
  * Status : int
  * ManagerComments : string
}

entity UserLogin {
  * Id : int <<PK>>
  * EmployeeId : int <<FK>> <<UK>>
  * Username : string <<UK>>
  * PasswordHash : string
  * RoleId : int <<FK>>
  * LastLoginAt : datetime
}

entity Department {
  * Id : int <<PK>>
  * Name : string <<UK>>
  * Description : string
}

entity Role {
  * Id : int <<PK>>
  * Name : string <<UK>>
  * Description : string
}

entity Project {
  * Id : int <<PK>>
  * Name : string
  * Description : string
  * StartDate : date
  * EndDate : date
  * ProjectCode : string
  * ClientId : int <<FK>>
  * DepartmentId : int <<FK>>
}

entity Client {
  * Id : int <<PK>>
  * Name : string <<UK>>
  * Email : string
  * PhoneNumber : string
  * Address : string
}

entity EmployeeProjectAllocation {
  * Id : int <<PK>>
  * EmployeeId : int <<FK>>
  * ProjectId : int <<FK>>
  * AllocationPercentage : decimal
  * AllocationStartDate : datetime
  * AllocationEndDate : datetime
}

entity AuditLog {
  * Id : int <<PK>>
  * EntityName : string
  * Action : string
  * OldValues : string
  * NewValues : string
  * ChangedBy : string
  * ChangedAt : datetime
  * EmployeeId : int <<FK>>
}

Employee ||--o{ Attendance : has
Employee ||--o{ Leave : requests
Employee ||--|| UserLogin : "has one"
Employee }o--|| Department : "belongs to"
Employee }o--|| Role : "has role"
UserLogin }o--|| Role : uses
Department ||--o{ Project : owns
Project }o--|| Client : "for"
Employee ||--o{ EmployeeProjectAllocation : allocated
Project ||--o{ EmployeeProjectAllocation : members
Employee ||--o{ AuditLog : logs

@enduml
```

## 7. API Endpoints

| Area | Method | Endpoint | Roles |
|---|---|---|---|
| **Auth** | POST | `/api/auth/login` | Anonymous |
| | POST | `/api/auth/change-password` | Any |
| **Employees** | GET | `/api/employees` | Any |
| | GET/POST | `/api/employees/{id}` | Any / Admin+Manager |
| | PUT/DELETE | `/api/employees/{id}` | Admin+Manager / Admin |
| | GET | `/api/employees/search?term=` | Any |
| **Attendance** | GET | `/api/attendance/employee/{id}/month/{y}/{m}` | Any |
| | POST | `/api/attendance/check-in` | Any |
| | POST | `/api/attendance/{id}/check-out` | Any |
| | GET | `/api/attendance/today-active` | Any |
| | GET | `/api/attendance/all` | Admin |
| **Leaves** | GET | `/api/leaves/employee/{id}` | Any |
| | GET | `/api/leaves/pending` | Admin+Manager |
| | POST | `/api/leaves/apply` | Any |
| | PATCH | `/api/leaves/{id}/cancel` | Any |
| | PATCH | `/api/leaves/{id}/decision` | Admin+Manager |
| **Projects** | GET/POST | `/api/projects` | Any / Admin+Manager |
| | PUT/DELETE | `/api/projects/{id}` | Admin+Manager / Admin |
| | GET/POST | `/api/projects/{id}/allocations` | Any / Admin+Manager |
| **Dashboard** | GET | `/api/dashboard` | Any |

## 8. Security Model

### Roles

| Role | Description |
|---|---|
| **Admin** | Full system access — CRUD all entities, change passwords, view reports |
| **Manager** | Manage employees, approve/reject leave (Employee role only), project allocations |
| **Employee** | Self-service — check-in/out, apply/cancel leaves, view own data |

### Authentication Flow

```plantuml
@startuml
actor User
participant "Angular App" as ANG
participant "AuthController" as CTRL
participant "AuthService" as SRV
participant "JwtTokenService" as JWT
database "Database" as DB

User -> ANG: Enter credentials
ANG -> CTRL: POST /api/auth/login
CTRL -> SRV: LoginAsync(request)
SRV -> DB: Find UserLogin by Username
DB --> SRV: UserLogin + Employee + Role
SRV -> SRV: Verify password hash
SRV -> JWT: GenerateToken(claims)
JWT --> SRV: JWT string (60 min expiry)
SRV --> CTRL: LoginResponseDto { token, role, name }
CTRL --> ANG: 200 OK
ANG -> ANG: Store token in localStorage
note right of ANG: AuthInterceptor attaches\nBearer to all requests
ANG -> CTRL: GET /api/employees (with JWT)
CTRL -> CTRL: Validate JWT (issuer, audience, key)
CTRL --> ANG: 200 OK + data
@enduml
```

## 9. Frontend Architecture

```plantuml
@startuml
skinparam rectangle {
  BorderColor black
}

rectangle "App" as APP

rectangle "LoginComponent\n/login" as LOGIN
rectangle "ShellComponent (AuthGuard)" as SHELL

rectangle "DashboardComponent\n/dashboard" as DASH
rectangle "StaffDashboardComponent\n/me" as STAFF
rectangle "ManagerDashboardComponent\n/manager" as MGR
rectangle "EmployeeListComponent\n/employees" as EMP
rectangle "DepartmentListComponent\n/departments" as DEPT
rectangle "AttendancePageComponent\n/attendance" as ATT
rectangle "LeavePageComponent\n/leaves" as LV
rectangle "ProjectPageComponent\n/projects" as PROJ
rectangle "ReportsPageComponent\n/reports" as RPT

APP --> LOGIN
APP --> SHELL

SHELL --> DASH
SHELL --> STAFF
SHELL --> MGR
SHELL --> EMP
SHELL --> DEPT
SHELL --> ATT
SHELL --> LV
SHELL --> PROJ
SHELL --> RPT

note top of LOGIN : Public
note top of SHELL : Authenticated

@enduml
```

### Routing

| Path | Component | Guard |
|---|---|---|
| `/login` | LoginComponent | None |
| `/dashboard` | DashboardComponent | AuthGuard |
| `/employees` | EmployeeListComponent | AuthGuard |
| `/attendance` | AttendancePageComponent | AuthGuard |
| `/leaves` | LeavePageComponent | AuthGuard |
| `/projects` | ProjectPageComponent | AuthGuard |
| `/reports` | ReportsPageComponent | AuthGuard |
| `/me` | StaffDashboardComponent | AuthGuard |
| `/manager` | ManagerDashboardComponent | AuthGuard |

### State Management

- **Auth state**: `BehaviorSubject<CurrentUser>` in `AuthService`
- **API data**: Direct HTTP calls via Angular `HttpClient` with `Observable` chain
- **Local storage**: JWT token + user info (`wms_user` key)

## 10. Data Flow Examples

### Check-in Flow

```plantuml
@startuml
actor User
participant "AttendancePageComponent" as PAGE
participant "AttendanceService" as SRV
participant "AttendanceController" as CTRL
participant "AttendanceService (Backend)" as BSRV
database "Database" as DB

User -> PAGE: Click "Check In"
PAGE -> PAGE: Get local time + employeeId
PAGE -> SRV: checkIn({ employeeId, date, time })
SRV -> CTRL: POST /api/attendance/check-in
CTRL -> BSRV: CheckInAsync(dto)
BSRV -> BSRV: Create Attendance entity (DateTime.UtcNow)
BSRV -> DB: INSERT INTO Attendances
DB --> BSRV: OK
BSRV --> CTRL: attendance ID
CTRL --> SRV: 201 Created
SRV --> PAGE: Response
PAGE -> PAGE: SnackBar "Checked in successfully"
PAGE -> PAGE: Refresh monthly table
PAGE -> PAGE: Show "Checked In" card + Check Out button
@enduml
```

### Leave Approval Flow

```plantuml
@startuml
actor Manager
participant "LeavePageComponent" as PAGE
participant "LeaveService" as SRV
participant "LeavesController" as CTRL
participant "LeaveService (Backend)" as BSRV
database "Database" as DB

Manager -> PAGE: Click Approve on pending leave
PAGE -> SRV: approveReject(id, { isApproved: true })
SRV -> CTRL: PATCH /api/leaves/{id}/decision
CTRL -> BSRV: ApproveRejectAsync(id, dto, actorId, role)
BSRV -> BSRV: Validate: not self-approval
BSRV -> BSRV: Validate: Manager can approve Employee only
BSRV -> DB: UPDATE Leaves SET Status = Approved
DB --> BSRV: OK
BSRV --> CTRL: 204 No Content
CTRL --> SRV: OK
SRV --> PAGE: Response
PAGE -> PAGE: Refresh both leave lists
PAGE -> Manager: SnackBar "Leave approved"
@enduml
```

## 11. Error Handling

- **ExceptionHandlingMiddleware** catches all unhandled exceptions
- HTTP status mapping:
  - `UnauthorizedAccessException` → 401
  - `InvalidOperationException` → 400
  - `KeyNotFoundException` → 404
  - All others → 500 (logged)
- All responses: `{ statusCode, message }` JSON format
- Frontend displays errors via `MatSnackBar`

## 12. Project Structure

```
WMS-Solution/
├── WMS.Domain/              # Entities, Enums, BaseEntity
├── WMS.Application/         # Services, Interfaces, DTOs, Mapping
├── WMS.Infrastructure/      # EF Core, Repositories, AuthService, JWT
├── WMS.API/                 # Controllers, Middleware, Program.cs
├── WMS.Tests/               # xUnit unit tests
├── WMS-Client/              # Angular 21 frontend (standalone)
└── docs/                    # Design documents
```

## 13. Key Design Decisions

| Decision | Rationale |
|---|---|
| Clean Architecture over simple MVC | Separation of concerns, testability, domain isolation |
| Repository + Unit of Work | Consistent data access, easier to mock in tests |
| AutoMapper over manual mapping | Reduced boilerplate for entity→DTO transformations |
| Standalone Angular components | Simplified module structure, lazy loading readiness |
| ZipDeploy over Git deployment | Clean CI/CD without build servers on App Service |
| Separate App Service Plans per stack | Each service runs optimal runtime (.NET vs Node) |
