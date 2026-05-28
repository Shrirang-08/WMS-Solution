using Microsoft.EntityFrameworkCore;
using WMS.Application.Interfaces.Repositories;
using WMS.Domain.Entities;
using WMS.Infrastructure.Persistence;

namespace WMS.Infrastructure.Repositories;

public class LeaveRepository(WmsDbContext context) : GenericRepository<Leave>(context), ILeaveRepository
{
    public async Task<IReadOnlyList<Leave>> GetByEmployeeAsync(int employeeId, CancellationToken cancellationToken = default)
    {
        return await Context.Leaves
            .AsNoTracking()
            .Include(x => x.Employee)
            .Where(x => x.EmployeeId == employeeId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Leave>> GetPendingAsync(CancellationToken cancellationToken = default)
    {
        return await Context.Leaves
            .AsNoTracking()
            .Include(x => x.Employee)
            .Where(x => x.Status == Domain.Enums.LeaveStatus.Pending)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}