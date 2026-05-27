using WMS.Application.Interfaces.Repositories;
using WMS.Application.Interfaces.Services;
using WMS.Application.Models.Auth;
using WMS.Domain.Entities;
using WMS.Infrastructure.Services;

namespace WMS.Tests;

public class AuthServiceTests
{
    [Fact]
    public async Task LoginAsync_ReturnsToken_WhenPasswordMatches()
    {
        var unitOfWork = new FakeUnitOfWork();
        var hasher = new Microsoft.AspNetCore.Identity.PasswordHasher<object>();
        var passwordHash = hasher.HashPassword(new object(), "Admin@123");

        unitOfWork.UserLoginRepository.UserLoginToReturn = new UserLogin
        {
            Id = 1,
            Username = "admin",
            PasswordHash = passwordHash,
            Employee = new Employee
            {
                Id = 1,
                FirstName = "System",
                LastName = "Admin",
                Email = "admin@wms.local",
                EmployeeCode = "EMP-0001"
            },
            Role = new Role { Id = 1, Name = "Admin" }
        };

        var tokenService = new FakeJwtTokenService();
        var service = new AuthService(unitOfWork, tokenService, null!);

        var response = await service.LoginAsync(new LoginRequestDto { Username = "admin", Password = "Admin@123" });

        Assert.Equal("admin", response.Username);
        Assert.Equal("Admin", response.Role);
        Assert.Equal("fake-jwt", response.Token);
        Assert.True(unitOfWork.SaveChangesCalled);
    }

    private sealed class FakeUnitOfWork : IUnitOfWork
    {
        public FakeUserLoginRepository UserLoginRepository { get; } = new();
        public IEmployeeRepository Employees => throw new NotImplementedException();
        public IDepartmentRepository Departments => throw new NotImplementedException();
        public IAttendanceRepository Attendances => throw new NotImplementedException();
        public ILeaveRepository Leaves => throw new NotImplementedException();
        public IProjectRepository Projects => throw new NotImplementedException();
        public IUserLoginRepository UserLogins => UserLoginRepository;
        public bool SaveChangesCalled { get; private set; }
        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            SaveChangesCalled = true;
            return Task.FromResult(1);
        }
    }

    private sealed class FakeUserLoginRepository : IUserLoginRepository
    {
        public UserLogin? UserLoginToReturn { get; set; }
        public Task<IReadOnlyList<UserLogin>> GetAllAsync(CancellationToken cancellationToken = default) => Task.FromResult<IReadOnlyList<UserLogin>>(Array.Empty<UserLogin>());
        public Task<UserLogin?> GetByIdAsync(int id, CancellationToken cancellationToken = default) => Task.FromResult<UserLogin?>(UserLoginToReturn);
        public Task<bool> ExistsAsync(System.Linq.Expressions.Expression<Func<UserLogin, bool>> predicate, CancellationToken cancellationToken = default) => Task.FromResult(false);
        public Task AddAsync(UserLogin entity, CancellationToken cancellationToken = default) => Task.CompletedTask;
        public void Update(UserLogin entity) { }
        public void Delete(UserLogin entity) { }
        public Task<UserLogin?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default) => Task.FromResult(UserLoginToReturn);
    }

    private sealed class FakeJwtTokenService : IJwtTokenService
    {
        public string GenerateToken(UserLogin userLogin, Employee employee, Role role) => "fake-jwt";
    }
}