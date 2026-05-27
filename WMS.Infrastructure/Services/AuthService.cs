using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WMS.Application.Interfaces.Repositories;
using WMS.Application.Interfaces.Services;
using WMS.Application.Models.Auth;
using WMS.Infrastructure.Persistence;

namespace WMS.Infrastructure.Services;

public class AuthService(IUnitOfWork unitOfWork, IJwtTokenService jwtTokenService, WmsDbContext context) : IAuthService
{
    private static readonly PasswordHasher<object> PasswordHasher = new();

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var userLogin = await unitOfWork.UserLogins.GetByUsernameAsync(request.Username, cancellationToken)
            ?? throw new UnauthorizedAccessException("Invalid username or password.");

        var verification = PasswordHasher.VerifyHashedPassword(new object(), userLogin.PasswordHash, request.Password);
        if (verification == PasswordVerificationResult.Failed)
        {
            throw new UnauthorizedAccessException("Invalid username or password.");
        }

        userLogin.LastLoginAt = DateTime.UtcNow;
    unitOfWork.UserLogins.Update(userLogin);
    await unitOfWork.SaveChangesAsync(cancellationToken);

        var token = jwtTokenService.GenerateToken(userLogin, userLogin.Employee!, userLogin.Role!);

        return new LoginResponseDto
        {
            UserLoginId = userLogin.Id,
            Username = userLogin.Username,
            EmployeeName = userLogin.Employee!.FirstName + " " + userLogin.Employee!.LastName,
            Role = userLogin.Role!.Name,
            Token = token,
            ExpiresAtUtc = DateTime.UtcNow.AddMinutes(60)
        };
    }

    public async Task<LoginResponseDto> RegisterAsync(RegisterRequestDto request, CancellationToken cancellationToken = default)
    {
        if (await unitOfWork.UserLogins.ExistsAsync(x => x.Username == request.Username, cancellationToken))
        {
            throw new InvalidOperationException($"Username '{request.Username}' is already taken.");
        }

        if (await unitOfWork.Employees.ExistsAsync(x => x.EmployeeCode == request.Employee.EmployeeCode, cancellationToken))
        {
            throw new InvalidOperationException($"Employee code '{request.Employee.EmployeeCode}' is already in use.");
        }

        if (await unitOfWork.Employees.ExistsAsync(x => x.Email == request.Employee.Email, cancellationToken))
        {
            throw new InvalidOperationException($"Email '{request.Employee.Email}' is already in use.");
        }

        if (!await unitOfWork.Departments.ExistsAsync(x => x.Id == request.Employee.DepartmentId, cancellationToken))
        {
            throw new KeyNotFoundException($"Department '{request.Employee.DepartmentId}' was not found.");
        }

        if (!await context.Roles.AsNoTracking().AnyAsync(x => x.Id == request.Employee.RoleId, cancellationToken))
        {
            throw new KeyNotFoundException($"Role '{request.Employee.RoleId}' was not found.");
        }

        // create employee
        var employee = new WMS.Domain.Entities.Employee
        {
            EmployeeCode = request.Employee.EmployeeCode,
            FirstName = request.Employee.FirstName,
            LastName = request.Employee.LastName,
            Email = request.Employee.Email,
            PhoneNumber = request.Employee.PhoneNumber,
            DateOfBirth = request.Employee.DateOfBirth,
            HireDate = request.Employee.HireDate,
            JobTitle = request.Employee.JobTitle,
            Salary = request.Employee.Salary,
            DepartmentId = request.Employee.DepartmentId,
            RoleId = request.Employee.RoleId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await unitOfWork.Employees.AddAsync(employee, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        // create user login
        var passwordHash = PasswordHasher.HashPassword(new object(), request.Password);
        var userLogin = new WMS.Domain.Entities.UserLogin
        {
            EmployeeId = employee.Id,
            Username = request.Username,
            PasswordHash = passwordHash,
            RoleId = request.Employee.RoleId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await unitOfWork.UserLogins.AddAsync(userLogin, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        // reload the saved login to include role
        var savedLogin = await unitOfWork.UserLogins.GetByUsernameAsync(request.Username, cancellationToken);
        var roleName = savedLogin?.Role?.Name ?? string.Empty;
        var token = jwtTokenService.GenerateToken(savedLogin!, employee, savedLogin!.Role!);

        return new LoginResponseDto
        {
            UserLoginId = savedLogin!.Id,
            Username = savedLogin!.Username,
            EmployeeName = employee.FirstName + " " + employee.LastName,
            Role = roleName,
            Token = token,
            ExpiresAtUtc = DateTime.UtcNow.AddMinutes(60)
        };
    }
}