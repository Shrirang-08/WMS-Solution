using Microsoft.EntityFrameworkCore;
using WMS.Application.Interfaces.Repositories;
using WMS.Domain.Entities;
using WMS.Infrastructure.Persistence;

namespace WMS.Infrastructure.Repositories;

public class AttendanceRepository(WmsDbContext context) : GenericRepository<Attendance>(context), IAttendanceRepository
{
    public async Task<IReadOnlyList<Attendance>> GetByEmployeeAndMonthAsync(int employeeId, int year, int month, CancellationToken cancellationToken = default)
    {
        return await Context.Attendances
            .AsNoTracking()
            .Where(x => x.EmployeeId == employeeId && x.AttendanceDate.Year == year && x.AttendanceDate.Month == month)
            .OrderByDescending(x => x.AttendanceDate)
            .ToListAsync(cancellationToken);
    }
}