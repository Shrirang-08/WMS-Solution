using WMS.Application.Interfaces.Repositories;

namespace WMS.Infrastructure.Persistence;

public class UnitOfWork(
    IEmployeeRepository employees,
    IDepartmentRepository departments,
    IAttendanceRepository attendances,
    ILeaveRepository leaves,
    IProjectRepository projects,
    IUserLoginRepository userLogins,
    WmsDbContext context) : IUnitOfWork
{
    public IEmployeeRepository Employees { get; } = employees;
    public IDepartmentRepository Departments { get; } = departments;
    public IAttendanceRepository Attendances { get; } = attendances;
    public ILeaveRepository Leaves { get; } = leaves;
    public IProjectRepository Projects { get; } = projects;
    public IUserLoginRepository UserLogins { get; } = userLogins;

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        => context.SaveChangesAsync(cancellationToken);
}