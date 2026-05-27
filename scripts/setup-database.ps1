param(
    [string]$ConnectionString = "Server=localhost\SQLEXPRESS;Database=WMSDb;Trusted_Connection=True;TrustServerCertificate=True;"
)

Write-Host "WMS Database Setup Script" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will create the WMS database and apply EF Core migrations."
Write-Host ""

# Check if dotnet-ef tool is installed
$efTool = dotnet ef --version 2>$null
if (-not $efTool) {
    Write-Host "Installing dotnet-ef tool..." -ForegroundColor Yellow
    dotnet tool install --global dotnet-ef
}

# Navigate to solution root
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$solutionRoot = Resolve-Path "$scriptPath\.."
Set-Location $solutionRoot

Write-Host "Step 1: Building solution..." -ForegroundColor Green
dotnet build WMS-Solution.slnx

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Please fix errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Removing existing migration (optional)..." -ForegroundColor Yellow
Write-Host "  To create a fresh migration: dotnet ef migrations add InitialCreate --project WMS.Infrastructure --startup-project WMS.API"
Write-Host ""

Write-Host "Step 3: Applying migrations to database..." -ForegroundColor Green
dotnet ef database update --project WMS.Infrastructure --startup-project WMS.API

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: Database created and migrations applied!" -ForegroundColor Green
    Write-Host "Connection string: $ConnectionString"
    Write-Host ""
    Write-Host "Seeded admin credentials:" -ForegroundColor Cyan
    Write-Host "  Username: admin"
    Write-Host "  Password: Admin@123"
    Write-Host ""
    Write-Host "To run the API: dotnet run --project WMS.API" -ForegroundColor Yellow
    Write-Host "To run the frontend: cd WMS-Client; ng serve" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "ERROR: Database migration failed." -ForegroundColor Red
    Write-Host "Make sure SQL Server is running and accessible."
    Write-Host "Connection string used: $ConnectionString"
}
