param(
    [string]$BaseUrl = "http://localhost:5185",
    [string]$Username = "admin",
    [string]$Password = "Admin@123"
)

$ErrorActionPreference = "Stop"

Write-Host "WMS API Integration Test" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login
Write-Host "1. Testing Login..." -ForegroundColor Yellow
$loginBody = @{ username = $Username; password = $Password } | ConvertTo-Json
try {
    $loginResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "   Login OK. Token received." -ForegroundColor Green
} catch {
    Write-Host "   Login FAILED: $_" -ForegroundColor Red
    exit 1
}

$headers = @{ Authorization = "Bearer $token" }

# Step 2: Get all employees
Write-Host "2. Testing GET /api/employees..." -ForegroundColor Yellow
try {
    $employees = Invoke-RestMethod -Uri "$BaseUrl/api/employees" -Method Get -Headers $headers
    Write-Host "   OK. Employees count: $($employees.Count)" -ForegroundColor Green
} catch {
    Write-Host "   FAILED: $_" -ForegroundColor Red
}

# Step 3: Get Dashboard
Write-Host "3. Testing GET /api/dashboard..." -ForegroundColor Yellow
try {
    $dashboard = Invoke-RestMethod -Uri "$BaseUrl/api/dashboard" -Method Get -Headers $headers
    Write-Host "   OK. Dashboard data received." -ForegroundColor Green
} catch {
    Write-Host "   FAILED: $_" -ForegroundColor Red
}

# Step 4: Create new employee
Write-Host "4. Testing POST /api/employees (create)..." -ForegroundColor Yellow
$newEmployee = @{
    employeeCode = "EMP-$(Get-Random -Minimum 1000 -Maximum 9999)"
    firstName = "Test"
    lastName = "User"
    email = "test.user$(Get-Random -Minimum 100 -Maximum 999)@example.com"
    phoneNumber = "1234567890"
    dateOfBirth = "1990-01-01"
    hireDate = "2026-01-01"
    jobTitle = "Test Engineer"
    salary = 50000
    departmentId = 2
    roleId = 3
} | ConvertTo-Json

try {
    $createResponse = Invoke-RestMethod -Uri "$BaseUrl/api/employees" -Method Post -Headers $headers -Body $newEmployee -ContentType "application/json"
    Write-Host "   OK. Employee created." -ForegroundColor Green
} catch {
    Write-Host "   FAILED: $_" -ForegroundColor Red
}

# Step 5: Get departments
Write-Host "5. Testing GET /api/departments..." -ForegroundColor Yellow
try {
    $departments = Invoke-RestMethod -Uri "$BaseUrl/api/departments" -Method Get -Headers $headers
    Write-Host "   OK. Departments count: $($departments.Count)" -ForegroundColor Green
} catch {
    Write-Host "   FAILED: $_" -ForegroundColor Red
}

# Step 6: Search employees
Write-Host "6. Testing GET /api/employees/search..." -ForegroundColor Yellow
try {
    $searchResult = Invoke-RestMethod -Uri "$BaseUrl/api/employees/search?term=admin" -Method Get -Headers $headers
    Write-Host "   OK. Search results: $($searchResult.Count)" -ForegroundColor Green
} catch {
    Write-Host "   FAILED: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Integration test complete!" -ForegroundColor Cyan
