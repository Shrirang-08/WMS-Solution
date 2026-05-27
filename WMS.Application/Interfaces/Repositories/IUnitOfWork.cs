namespace WMS.Application.Interfaces.Repositories;

public interface IUnitOfWork
{
    IEmployeeRepository Employees { get; }
    IDepartmentRepository Departments { get; }
    IAttendanceRepository Attendances { get; }
    ILeaveRepository Leaves { get; }
    IProjectRepository Projects { get; }
    IUserLoginRepository UserLogins { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}