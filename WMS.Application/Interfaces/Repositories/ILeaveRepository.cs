using WMS.Domain.Entities;

namespace WMS.Application.Interfaces.Repositories;

public interface ILeaveRepository : IGenericRepository<Leave>
{
    Task<IReadOnlyList<Leave>> GetByEmployeeAsync(int employeeId, CancellationToken cancellationToken = default);
}