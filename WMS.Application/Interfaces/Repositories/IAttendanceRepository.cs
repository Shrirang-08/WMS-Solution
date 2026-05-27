using WMS.Domain.Entities;

namespace WMS.Application.Interfaces.Repositories;

public interface IAttendanceRepository : IGenericRepository<Attendance>
{
    Task<IReadOnlyList<Attendance>> GetByEmployeeAndMonthAsync(int employeeId, int year, int month, CancellationToken cancellationToken = default);
}