# WMS — Low-Level Design Document

## 1. Domain Layer — Entities

### Entity Class Diagram

```plantuml
@startuml
skinparam classAttributeIconSize 0

abstract class BaseEntity {
  + int Id
  + DateTime CreatedAt
  + DateTime? UpdatedAt
  + bool IsActive
}

class Employee {
  + string EmployeeCode
  + string FirstName
  + string LastName
  + string FullName
  + string Email
  + string? PhoneNumber
  + DateTime DateOfBirth
  + DateTime HireDate
  + string JobTitle
  + decimal Salary
  + int DepartmentId
  + int RoleId
}

class Attendance {
  + int EmployeeId
  + DateTime AttendanceDate
  + TimeSpan CheckInTime
  + TimeSpan? CheckOutTime
  + AttendanceStatus Status
  + string? Remarks
}

class Leave {
  + int EmployeeId
  + DateTime FromDate
  + DateTime ToDate
  + string LeaveType
  + string Reason
  + LeaveStatus Status
  + string? ManagerComments
}

class UserLogin {
  + int EmployeeId
  + string Username
  + string PasswordHash
  + int RoleId
  + DateTime? LastLoginAt
}

class Department {
  + string Name
  + string? Description
}

class Role {
  + string Name
  + string? Description
}

class Project {
  + string Name
  + string? Description
  + DateTime StartDate
  + DateTime? EndDate
  + string? ProjectCode
  + int ClientId
  + int DepartmentId
}

class Client {
  + string Name
  + string? Email
  + string? PhoneNumber
  + string? Address
}

class EmployeeProjectAllocation {
  + int EmployeeId
  + int ProjectId
  + decimal AllocationPercentage
  + DateTime AllocationStartDate
  + DateTime? AllocationEndDate
}

class AuditLog {
  + string EntityName
  + string Action
  + string? OldValues
  + string? NewValues
  + string? ChangedBy
  + DateTime ChangedAt
  + int? EmployeeId
}

BaseEntity <|-- Employee
BaseEntity <|-- Attendance
BaseEntity <|-- Leave
BaseEntity <|-- UserLogin
BaseEntity <|-- Department
BaseEntity <|-- Role
BaseEntity <|-- Project
BaseEntity <|-- Client
BaseEntity <|-- EmployeeProjectAllocation
BaseEntity <|-- AuditLog

Employee "1" --> "1" UserLogin : has
Employee "1" --> "N" Attendance : has
Employee "1" --> "N" Leave : requests
Employee "N" --> "1" Department : belongs_to
Employee "N" --> "1" Role : has_role
UserLogin "N" --> "1" Role : uses
Employee "1" --> "N" EmployeeProjectAllocation : allocated
Project "1" --> "N" EmployeeProjectAllocation : has_members
Project "N" --> "1" Department : owned_by
Project "N" --> "1" Client : for
Employee "1" --> "N" AuditLog : logs

@enduml
```

### Enums

```plantuml
@startuml
enum AttendanceStatus {
  Present = 1
  Absent = 2
  Late = 3
  HalfDay = 4
  OnLeave = 5
}

enum LeaveStatus {
  Pending = 1
  Approved = 2
  Rejected = 3
  Cancelled = 4
}
@enduml
```

## 2. Database Schema

```plantuml
@startuml
skinparam classAttributeIconSize 0

entity Employees {
  * Id : INT PK
  * EmployeeCode : NVARCHAR(50) UK
  * FirstName : NVARCHAR(100)
  * LastName : NVARCHAR(100)
  * Email : NVARCHAR(150) UK
  * PhoneNumber : NVARCHAR(20)
  * DateOfBirth : DATE
  * HireDate : DATE
  * JobTitle : NVARCHAR(100)
  * Salary : DECIMAL(18,2)
  * DepartmentId : INT FK
  * RoleId : INT FK
  * IsActive : BIT
  * CreatedAt : DATETIME2
  * UpdatedAt : DATETIME2
}

entity Attendances {
  * Id : INT PK
  * EmployeeId : INT FK
  * AttendanceDate : DATE
  * CheckInTime : TIME
  * CheckOutTime : TIME
  * Status : INT
  * Remarks : NVARCHAR(250)
  ___
  UK: (EmployeeId, AttendanceDate)
}

entity Leaves {
  * Id : INT PK
  * EmployeeId : INT FK
  * FromDate : DATE
  * ToDate : DATE
  * LeaveType : NVARCHAR(100)
  * Reason : NVARCHAR(500)
  * Status : INT
  * ManagerComments : NVARCHAR(250)
  ___
  IDX: (EmployeeId, FromDate, ToDate)
}

entity UserLogins {
  * Id : INT PK
  * EmployeeId : INT FK UK
  * Username : NVARCHAR(150) UK
  * PasswordHash : NVARCHAR(500)
  * RoleId : INT FK
  * LastLoginAt : DATETIME2
  * IsActive : BIT
}

entity Departments {
  * Id : INT PK
  * Name : NVARCHAR(100) UK
  * Description : NVARCHAR(250)
}

entity Roles {
  * Id : INT PK
  * Name : NVARCHAR(100) UK
  * Description : NVARCHAR(250)
}

entity Projects {
  * Id : INT PK
  * Name : NVARCHAR(150)
  * Description : NVARCHAR(500)
  * StartDate : DATE
  * EndDate : DATE
  * ProjectCode : NVARCHAR(50)
  * ClientId : INT FK
  * DepartmentId : INT FK
}

entity Clients {
  * Id : INT PK
  * Name : NVARCHAR(150) UK
  * Email : NVARCHAR(150)
  * PhoneNumber : NVARCHAR(20)
  * Address : NVARCHAR(250)
}

entity EmployeeProjectAllocations {
  * Id : INT PK
  * EmployeeId : INT FK
  * ProjectId : INT FK
  * AllocationPercentage : DECIMAL(5,2)
  * AllocationStartDate : DATETIME2
  * AllocationEndDate : DATETIME2
}

entity AuditLogs {
  * Id : INT PK
  * EntityName : NVARCHAR(100)
  * Action : NVARCHAR(100)
  * OldValues : NVARCHAR(2000)
  * NewValues : NVARCHAR(2000)
  * ChangedBy : NVARCHAR(2000)
  * ChangedAt : DATETIME2
  * EmployeeId : INT FK
}

entity Announcements {
  * Id : INT PK
  * Title : NVARCHAR(200)
  * Message : NVARCHAR(2000)
  * PublishDate : DATETIME2
  * IsActive : BIT
}

Employees ||--o{ Attendances : has
Employees ||--o{ Leaves : requests
Employees ||--|| UserLogins : has_one
Employees }o--|| Departments : belongs_to
Employees }o--|| Roles : has_role
UserLogins }o--|| Roles : uses
Departments ||--o{ Projects : owns
Projects }o--|| Clients : for
Employees ||--o{ EmployeeProjectAllocations : allocated
Projects ||--o{ EmployeeProjectAllocations : members
Employees ||--o{ AuditLogs : logs

@enduml
```

## 3. Data Transfer Objects

| Layer | DTO | Key Properties |
|---|---|---|
| **Attendance** | `CheckInDto` | `employeeId`, `attendanceDate?`, `checkInTime?` |
| | `CheckOutDto` | `checkOutTime?`, `remarks?` |
| | `AttendanceDto` | `id`, `employeeId/employeeName`, `attendanceDate`, `checkIn/checkOut`, `status` |
| | `TodayActiveDto` | `totalActive`, `employees[]` |
| **Leave** | `ApplyLeaveDto` | `employeeId`, `fromDate`, `toDate`, `leaveType`, `reason` |
| | `ApproveRejectLeaveDto` | `isApproved`, `managerComments?` |
| | `LeaveDto` | `id`, `employeeId/employeeName`, `fromDate`, `toDate`, `leaveType`, `reason`, `status` |
| **Auth** | `LoginRequestDto` | `username`, `password` |
| | `LoginResponseDto` | `userLoginId`, `username`, `employeeName`, `role`, `token`, `expiresAtUtc` |
| | `ChangePasswordDto` | `userId?`, `employeeId?`, `currentPassword?`, `newPassword` |
| **Employee** | `EmployeeListDto` | `id`, `employeeCode`, `fullName`, `email`, `departmentName`, `roleName` |
| | `EmployeeDetailsDto` | extends `EmployeeListDto` + `firstName`, `lastName`, `jobTitle`, `salary`, etc. |
| | `CreateEmployeeDto` | `username?`, `password?` + full employee fields |
| **Dashboard** | `DashboardDto` | `totalEmployees`, `totalDepartments`, `totalProjects`, `pendingLeaves`, `todayPresentCount` |

## 4. Service Layer

### AttendanceService

```plantuml
@startuml
start
partition "GetByEmployeeAndMonthAsync" {
  :AttendanceRepository.GetByEmployeeAndMonthAsync();
  :Map to AttendanceDto[];
  :Return DTOs;
}
partition "CheckInAsync" {
  :Create Attendance entity (DateTime.UtcNow);
  :Attendances.AddAsync();
  :SaveChangesAsync();
  :Return attendance.Id;
}
partition "CheckOutAsync" {
  :GetByIdAsync() or throw KeyNotFoundException;
  :Set CheckOutTime;
  :Update() + SaveChangesAsync();
}
partition "GetAllAsync" {
  :GetAllWithEmployeeAsync();
  :Map to AttendanceDto[];
}
partition "GetTodayActiveAsync" {
  :GetTodayActiveAsync();
  :Build TodayActiveDto;
}
stop
@enduml
```

### LeaveService

```plantuml
@startuml
start
partition "GetByEmployeeAsync" {
  :LeaveRepository.GetByEmployeeAsync();
  :Map to LeaveDto[];
}
partition "GetPendingAsync" {
  :GetPendingAsync() (WHERE Status == Pending);
  :Map to LeaveDto[];
}
partition "ApplyAsync" {
  :Map to Leave entity;
  :Set Status = Pending;
  :SaveChangesAsync();
}
partition "CancelAsync" {
  :GetByIdAsync() or throw;
  :Set Status = Cancelled;
  :SaveChangesAsync();
}
partition "ApproveRejectAsync" {
  :GetByIdAsync() or throw;
  :Validate: not self-approval;
  if (Manager role) then (yes)
    :Validate: can only approve Employee leaves;
  endif
  :Set Status = Approved/Rejected;
  :Set ManagerComments;
  :SaveChangesAsync();
}
stop
@enduml
```

### Auth Flow

```plantuml
@startuml
actor User
participant "Angular App" as ANG
participant "AuthController" as CTRL
participant "AuthService" as SRV
participant "JwtTokenService" as JWT
database "Database" as DB

User -> ANG: Enter credentials
ANG -> CTRL: POST /api/auth/login { username, password }
CTRL -> SRV: LoginAsync(request)
SRV -> DB: Find UserLogin by Username (include Employee + Role)
DB --> SRV: UserLogin
SRV -> SRV: Verify password (PBKDF2)
SRV -> DB: Update LastLoginAt
SRV -> JWT: GenerateToken(claims)
JWT --> SRV: JWT (exp: 60 min)
SRV --> CTRL: LoginResponseDto
CTRL --> ANG: 200 { token, username, role, employeeName }

note right of ANG : Subsequent requests attach Bearer token

ANG -> CTRL: GET /api/resource (Authorization: Bearer token)
CTRL -> CTRL: Validate JWT (issuer, audience, signing key, expiry)
CTRL --> ANG: 200 OK + data
@enduml
```

## 5. Repository Layer

### Repository Interface

```plantuml
@startuml
skinparam classAttributeIconSize 0

interface IGenericRepository<T> {
  + GetAllAsync() IReadOnlyList<T>
  + GetByIdAsync(id) T?
  + ExistsAsync(predicate) bool
  + AddAsync(entity)
  + Update(entity)
  + Delete(entity)
}

interface IEmployeeRepository {
  + SearchAsync(term) IReadOnlyList<Employee>
  + GetDetailsAsync(id) Employee?
}

interface IAttendanceRepository {
  + GetByEmployeeAndMonthAsync(empId, year, month) IReadOnlyList<Attendance>
  + GetTodayActiveAsync() IReadOnlyList<Attendance>
  + GetAllWithEmployeeAsync() IReadOnlyList<Attendance>
}

interface ILeaveRepository {
  + GetByEmployeeAsync(empId) IReadOnlyList<Leave>
  + GetPendingAsync() IReadOnlyList<Leave>
}

interface IUnitOfWork {
  + Employees : IEmployeeRepository
  + Departments : IDepartmentRepository
  + Attendances : IAttendanceRepository
  + Leaves : ILeaveRepository
  + Projects : IProjectRepository
  + UserLogins : IUserLoginRepository
  + SaveChangesAsync() int
}

IGenericRepository <|-- IEmployeeRepository
IGenericRepository <|-- IAttendanceRepository
IGenericRepository <|-- ILeaveRepository

@enduml
```

### Key Repository Queries

| Repository | Method | Query Pattern |
|---|---|---|
| **Employee** | `GetAllAsync()` (override) | `Employees.Include(Dept).Include(Role).OrderBy(FirstName)` |
| | `SearchAsync(term)` | `Employees.Include(Dept/Role).Where(Name/Code/Email contains term)` |
| | `GetDetailsAsync(id)` | `Employees.Include(Dept/Role/Attendances/Leaves).FirstOrDefault(id)` |
| **Attendance** | `GetByEmployeeAndMonthAsync()` | `Attendances.Where(EmpId + Year + Month).Include(Employee).OrderByDesc(Date)` |
| | `GetTodayActiveAsync()` | `Attendances.Where(Date==today && CheckOut==null).Include(Employee.Department)` |
| | `GetAllWithEmployeeAsync()` | `Attendances.Include(Employee.Department).OrderByDesc(Date)` |
| **Leave** | `GetByEmployeeAsync()` | `Leaves.Where(EmpId).Include(Employee).OrderByDesc(CreatedAt)` |
| | `GetPendingAsync()` | `Leaves.Where(Status==Pending).Include(Employee).OrderByDesc(CreatedAt)` |

## 6. JWT Token Service

```plantuml
@startuml
partition "Token Generation" {
  () "JWT Claims\n- sub: userLogin.Id\n- employeeId: employee.Id\n- role: role.Name\n- given_name: employee.FullName" as CLAIMS
  () "Symmetric Key\nHmacSha256" as KEY
  () "JWT Token\nissuer: WMS.API\naudience: WMS.Angular\nexpiry: 60 min" as TOKEN
  CLAIMS --> TOKEN
  KEY --> TOKEN
}
partition "Client Storage" {
  () "localStorage" as STORE
  TOKEN --> STORE : Sent to client
  STORE --> () "Authorization: Bearer token" as HEADER
}
partition "Token Validation" {
  () "ValidateIssuer = true" as V1
  () "ValidateAudience = true" as V2
  () "ValidateLifetime = true (ClockSkew=0)" as V3
  () "ValidateIssuerSigningKey = true" as V4
  HEADER --> V1
  V1 --> V2
  V2 --> V3
  V3 --> V4
}
@enduml
```

## 7. Exception Handling Middleware

```plantuml
@startuml
start
:HTTP Request received;
:ExceptionHandlingMiddleware.InvokeAsync();

if (Request succeeds) then (yes)
  :Return 200 OK Response;
  stop
else (no - exception thrown)
  if (Exception type?) then (UnauthorizedAccessException)
    :Return 401 Unauthorized;
  elseif (InvalidOperationException)
    :Return 400 Bad Request;
  elseif (KeyNotFoundException)
    :Return 404 Not Found;
  else (Other Exception)
    :Log via ILogger<ExceptionHandlingMiddleware>;
    :Return 500 Internal Server Error;
  endif
  :JSON Response { statusCode, message };
endif
stop
@enduml
```

## 8. Frontend Architecture

### Check-In Client Flow

```plantuml
@startuml
actor User
participant "AttendancePageComponent" as PAGE
participant "AttendanceService (Angular)" as SRV
participant "API" as API
participant "AttendanceService (Backend)" as BSRV
database "Database" as DB

User -> PAGE: Click "Check In"
PAGE -> PAGE: Get employeeId (auth or selector)
PAGE -> PAGE: Get local time new Date()
PAGE -> SRV: checkIn({ employeeId, date, time })
SRV -> API: POST /api/attendance/check-in
note right: AuthInterceptor adds Bearer token
API -> BSRV: CheckInAsync(dto)
BSRV -> BSRV: Create Attendance (DateTime.UtcNow)
BSRV -> DB: INSERT Attendance
DB --> BSRV: OK
BSRV --> API: attendance.Id
API --> SRV: 201 Created
SRV --> PAGE: Response
PAGE -> PAGE: SnackBar "Checked in successfully"
PAGE -> PAGE: refreshAttendance()
PAGE -> PAGE: todayRecord getter re-evaluates
PAGE -> PAGE: Shows "Checked In" card + Check Out button
@enduml
```

### Auth Interceptor & Guard

```plantuml
@startuml
start
:HTTP Request initiated;

partition "AuthInterceptor.intercept()" {
  if (Token exists in AuthService?) then (yes)
    :Clone request;
    :Set header Authorization: Bearer ${token};
    :Pass modified request to next.handle();
  else (no)
    :Pass original request to next.handle();
  endif
}

:HTTP Response returned;

partition "AuthGuard.canActivate()" {
  if (AuthService.isLoggedIn?) then (yes)
    :Allow navigation to route;
  else (no)
    :Redirect to /login;
    :Return false;
  endif
}

stop
@enduml
```

## 9. Key Service Methods

| Service | Method | Description |
|---|---|---|
| **AuthService** | `LoginAsync` | Validate credentials → generate JWT → return user + token |
| | `ChangePasswordAsync` | Verify current password → hash new → update |
| **AttendanceService** | `CheckInAsync` | Create attendance record with UTC timestamp |
| | `CheckOutAsync` | Update existing attendance with check-out time |
| | `GetTodayActiveAsync` | Return all employees checked in but not out today |
| **LeaveService** | `ApplyAsync` | Create leave request with Pending status |
| | `ApproveRejectAsync` | Validate permissions → update status |
| | `CancelAsync` | Set status to Cancelled |
| **DashboardService** | `GetDashboardAsync` | Aggregate KPIs across all entities |
| **EmployeeService** | `GetAllAsync` | Return all employees with Department/Role names |
| | `CreateAsync` | Create employee + optional UserLogin |

## 10. Seed Data

| Table | Records |
|---|---|
| **Roles** | Admin (1), Manager (2), Employee (3) |
| **Departments** | HR (1), IT (2), Finance (3) |
| **Clients** | Internal (1) |
| **Employees** | System Admin (1) — IT dept, Admin role |
| **UserLogins** | admin / Admin@123 (1) |
| **Announcements** | Welcome message |

## 11. Pipeline Configuration

```plantuml
@startuml
start

partition "Build Stage (windows-latest)" {
  fork
    :Backend Job;
    :dotnet restore;
    :dotnet build --configuration Release;
    :dotnet test (xUnit with Code Coverage);
    :dotnet publish → $(Build.ArtifactStagingDirectory)/backend;
    :PublishBuildArtifacts@1 → 'backend-drop';
  fork again
    :Frontend Job;
    :npm ci (WMS-Client/);
    :ng build --configuration production;
    :PublishBuildArtifacts@1\n→ 'WMS-Client/dist/WMS-Client/browser'\n→ 'frontend-drop';
  end fork
}

partition "Deploy Stage (environment: production)" {
  fork
    :DeployBackend;
    :download 'backend-drop';
    :AzureWebApp@1 → wms-api-app-123\n(webAppLinux, zipDeploy);
    :AzureAppServiceSettings@1\n→ ASPNETCORE_ENVIRONMENT\n→ ConnectionStrings\n→ Jwt__Key;
  fork again
    :DeployFrontend;
    :download 'frontend-drop';
    :ArchiveFiles@2 → zip artifact;
    :AzureWebApp@1 → wms-client-app\n(webAppLinux, zipDeploy);
    :AzureCLI@2 → set startup command\npm2 serve /home/site/wwwroot --spa;
    :AzureAppServiceSettings@1\n→ SCM_DO_BUILD_DURING_DEPLOYMENT=false;
  end fork
}

stop
@enduml
```

## 12. Configuration

| Environment | Key | Value |
|---|---|---|
| **Dev** | `ConnectionStrings.DefaultConnection` | `Server=localhost\SQLEXPRESS;Database=WMSDb;Trusted_Connection=True` |
| | `Jwt:Key` | `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#` |
| | `Jwt:ExpiryMinutes` | `60` |
| **Prod** | `SqlServerFqdn` | Azure SQL server FQDN |
| | `ASPNETCORE_ENVIRONMENT` | `Production` |
| | `SCM_DO_BUILD_DURING_DEPLOYMENT` | `false` (frontend) |
| **Frontend** | `apiUrl` | `https://wms-api-app-123-xxx.centralindia-01.azurewebsites.net/api` |
