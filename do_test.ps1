param(
    [string]$BaseUrl = "http://localhost:5185"
)

[System.Net.ServicePointManager]::ServerCertificateValidationCallback = { param($a,$b,$c,$d) return $true }
$login = @{ username='admin'; password='Admin@123' } | ConvertTo-Json
Write-Output "Logging in at $BaseUrl..."
$resp = Invoke-RestMethod -Uri "$BaseUrl/api/auth/login" -Method Post -Body $login -ContentType 'application/json'
$token = $resp.token
Write-Output 'TOKEN:'
Write-Output $token
$employee = @{ employeeCode='EMP-9998'; firstName='Automation'; lastName='Tester'; email='auto.tester@example.com'; phoneNumber='1234567890'; dateOfBirth='1990-01-01'; hireDate='2026-01-01'; jobTitle='Automation Tester'; salary=45000; departmentId=2; roleId=3 } | ConvertTo-Json
$headers = @{ Authorization = "Bearer $token" }
$create = Invoke-RestMethod -Uri "$BaseUrl/api/employees" -Method Post -Headers $headers -Body $employee -ContentType 'application/json' -ErrorAction Stop
Write-Output 'Created.'