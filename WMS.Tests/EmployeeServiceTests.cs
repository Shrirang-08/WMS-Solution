using AutoMapper;
using WMS.Application.Interfaces.Repositories;
using WMS.Application.Mapping;
using WMS.Application.Models.Employees;
using WMS.Application.Services;
using WMS.Domain.Entities;
using Microsoft.Extensions.Logging.Abstractions;

namespace WMS.Tests;

public class EmployeeServiceTests
{
    [Fact]
    public async Task GetAllAsync_ReturnsMappedEmployees()
    {
        var unitOfWork = new FakeUnitOfWork();
        unitOfWork.EmployeeRepository.SetItems(new List<Employee>
        {
            new()
            {
                Id = 1,
                EmployeeCode = "EMP-01",
                FirstName = "Jane",
                LastName = "Doe",
                Email = "jane@wms.local",
                Department = new Department { Id = 1, Name = "HR" },
                Role = new Role { Id = 1, Name = "Admin" }
            }
        });

        var service = new EmployeeService(unitOfWork, CreateMapper());

        var result = await service.GetAllAsync();

        Assert.Single(result);
        Assert.Equal("Jane Doe", result[0].FullName);
        Assert.Equal("HR", result[0].DepartmentName);
        Assert.Equal("Admin", result[0].RoleName);
    }

    [Fact]
    public async Task CreateAsync_SavesNewEmployee()
    {
        var unitOfWork = new FakeUnitOfWork();
        var service = new EmployeeService(unitOfWork, CreateMapper());

        var id = await service.CreateAsync(new CreateEmployeeDto
        {
            EmployeeCode = "EMP-02",
            FirstName = "John",
            LastName = "Smith",
            Email = "john@wms.local",
            DateOfBirth = new DateTime(1995, 1, 1),
            HireDate = new DateTime(2025, 1, 1),
            JobTitle = "Developer",
            DepartmentId = 1,
            RoleId = 1
        });

        Assert.Equal(1, id);
        Assert.Single(unitOfWork.EmployeeRepository.Items);
        Assert.Equal("John", unitOfWork.EmployeeRepository.Items[0].FirstName);
    }

    private static IMapper CreateMapper()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>(), Microsoft.Extensions.Logging.Abstractions.NullLoggerFactory.Instance);
        return config.CreateMapper();
    }

    private sealed class FakeUnitOfWork : IUnitOfWork
    {
        public FakeEmployeeRepository EmployeeRepository { get; } = new();
        public FakeDepartmentRepository DepartmentRepository { get; } = new();
        public FakeAttendanceRepository AttendanceRepository { get; } = new();
        public FakeLeaveRepository LeaveRepository { get; } = new();
        public FakeProjectRepository ProjectRepository { get; } = new();
        public FakeUserLoginRepository UserLoginRepository { get; } = new();

        public IEmployeeRepository Employees => EmployeeRepository;
        public IDepartmentRepository Departments => DepartmentRepository;
        public IAttendanceRepository Attendances => AttendanceRepository;
        public ILeaveRepository Leaves => LeaveRepository;
        public IProjectRepository Projects => ProjectRepository;
        public IUserLoginRepository UserLogins => UserLoginRepository;

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) => Task.FromResult(1);
    }

    private sealed class FakeEmployeeRepository : IEmployeeRepository
    {
        public List<Employee> Items { get; private set; } = new();

        public void SetItems(List<Employee> items) => Items = items;

        public Task<bool> ExistsAsync(System.Linq.Expressions.Expression<Func<Employee, bool>> predicate, CancellationToken cancellationToken = default) => Task.FromResult(false);
        public Task AddAsync(Employee entity, CancellationToken cancellationToken = default)
        {
            entity.Id = Items.Count + 1;
            Items.Add(entity);
            return Task.CompletedTask;
        }

        public void Delete(Employee entity) => Items.Remove(entity);

        public Task<IReadOnlyList<Employee>> GetAllAsync(CancellationToken cancellationToken = default) => Task.FromResult((IReadOnlyList<Employee>)Items);
        public Task<Employee?> GetByIdAsync(int id, CancellationToken cancellationToken = default) => Task.FromResult(Items.FirstOrDefault(x => x.Id == id));
        public Task<Employee?> GetDetailsAsync(int id, CancellationToken cancellationToken = default) => Task.FromResult(Items.FirstOrDefault(x => x.Id == id));
        public Task<IReadOnlyList<Employee>> SearchAsync(string searchTerm, CancellationToken cancellationToken = default) => Task.FromResult((IReadOnlyList<Employee>)Items);
        public void Update(Employee entity) { }
    }

    private sealed class FakeDepartmentRepository : IDepartmentRepository
    {
        public Task<IReadOnlyList<Department>> GetAllAsync(CancellationToken cancellationToken = default) => Task.FromResult<IReadOnlyList<Department>>(Array.Empty<Department>());
        public Task<Department?> GetByIdAsync(int id, CancellationToken cancellationToken = default) => Task.FromResult<Department?>(null);
        public Task<bool> ExistsAsync(System.Linq.Expressions.Expression<Func<Department, bool>> predicate, CancellationToken cancellationToken = default) => Task.FromResult(false);
        public Task AddAsync(Department entity, CancellationToken cancellationToken = default) => Task.CompletedTask;
        public void Update(Department entity) { }
        public void Delete(Department entity) { }
    }

    private sealed class FakeAttendanceRepository : IAttendanceRepository
    {
        public Task<IReadOnlyList<Attendance>> GetAllAsync(CancellationToken cancellationToken = default) => Task.FromResult<IReadOnlyList<Attendance>>(Array.Empty<Attendance>());
        public Task<Attendance?> GetByIdAsync(int id, CancellationToken cancellationToken = default) => Task.FromResult<Attendance?>(null);
        public Task<bool> ExistsAsync(System.Linq.Expressions.Expression<Func<Attendance, bool>> predicate, CancellationToken cancellationToken = default) => Task.FromResult(false);
        public Task AddAsync(Attendance entity, CancellationToken cancellationToken = default) => Task.CompletedTask;
        public void Update(Attendance entity) { }
        public void Delete(Attendance entity) { }
        public Task<IReadOnlyList<Attendance>> GetByEmployeeAndMonthAsync(int employeeId, int year, int month, CancellationToken cancellationToken = default) => Task.FromResult<IReadOnlyList<Attendance>>(Array.Empty<Attendance>());
        public Task<IReadOnlyList<Attendance>> GetTodayActiveAsync(CancellationToken cancellationToken = default) => Task.FromResult<IReadOnlyList<Attendance>>(Array.Empty<Attendance>());
        public Task<IReadOnlyList<Attendance>> GetAllWithEmployeeAsync(CancellationToken cancellationToken = default) => Task.FromResult<IReadOnlyList<Attendance>>(Array.Empty<Attendance>());
    }

    private sealed class FakeLeaveRepository : ILeaveRepository
    {
        public Task<IReadOnlyList<Leave>> GetAllAsync(CancellationToken cancellationToken = default) => Task.FromResult<IReadOnlyList<Leave>>(Array.Empty<Leave>());
        public Task<Leave?> GetByIdAsync(int id, CancellationToken cancellationToken = default) => Task.FromResult<Leave?>(null);
        public Task<bool> ExistsAsync(System.Linq.Expressions.Expression<Func<Leave, bool>> predicate, CancellationToken cancellationToken = default) => Task.FromResult(false);
        public Task AddAsync(Leave entity, CancellationToken cancellationToken = default) => Task.CompletedTask;
        public void Update(Leave entity) { }
        public void Delete(Leave entity) { }
        public Task<IReadOnlyList<Leave>> GetByEmployeeAsync(int employeeId, CancellationToken cancellationToken = default) => Task.FromResult<IReadOnlyList<Leave>>(Array.Empty<Leave>());
        public Task<IReadOnlyList<Leave>> GetPendingAsync(CancellationToken cancellationToken = default) => Task.FromResult<IReadOnlyList<Leave>>(Array.Empty<Leave>());
    }

    private sealed class FakeProjectRepository : IProjectRepository
    {
        public Task<IReadOnlyList<Project>> GetAllAsync(CancellationToken cancellationToken = default) => Task.FromResult<IReadOnlyList<Project>>(Array.Empty<Project>());
        public Task<Project?> GetByIdAsync(int id, CancellationToken cancellationToken = default) => Task.FromResult<Project?>(null);
        public Task<bool> ExistsAsync(System.Linq.Expressions.Expression<Func<Project, bool>> predicate, CancellationToken cancellationToken = default) => Task.FromResult(false);
        public Task AddAsync(Project entity, CancellationToken cancellationToken = default) => Task.CompletedTask;
        public void Update(Project entity) { }
        public void Delete(Project entity) { }
    }

    private sealed class FakeUserLoginRepository : IUserLoginRepository
    {
        public Task<IReadOnlyList<UserLogin>> GetAllAsync(CancellationToken cancellationToken = default) => Task.FromResult<IReadOnlyList<UserLogin>>(Array.Empty<UserLogin>());
        public Task<UserLogin?> GetByIdAsync(int id, CancellationToken cancellationToken = default) => Task.FromResult<UserLogin?>(null);
        public Task<bool> ExistsAsync(System.Linq.Expressions.Expression<Func<UserLogin, bool>> predicate, CancellationToken cancellationToken = default) => Task.FromResult(false);
        public Task AddAsync(UserLogin entity, CancellationToken cancellationToken = default) => Task.CompletedTask;
        public void Update(UserLogin entity) { }
        public void Delete(UserLogin entity) { }
        public Task<UserLogin?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default) => Task.FromResult<UserLogin?>(null);
        public Task<UserLogin?> GetByEmployeeIdAsync(int employeeId, CancellationToken cancellationToken = default) => Task.FromResult<UserLogin?>(null);
        public Task<UserLogin?> GetByIdWithRoleAsync(int id, CancellationToken cancellationToken = default) => Task.FromResult<UserLogin?>(null);
    }
}