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
            .Include(x => x.Employee)
            .Where(x => x.EmployeeId == employeeId && x.AttendanceDate.Year == year && x.AttendanceDate.Month == month)
            .OrderByDescending(x => x.AttendanceDate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Attendance>> GetTodayActiveAsync(CancellationToken cancellationToken = default)
    {
        var today = DateTime.UtcNow.Date;
        return await Context.Attendances
            .AsNoTracking()
            .Include(x => x.Employee!).ThenInclude(x => x.Department)
            .Where(x => x.AttendanceDate == today && x.CheckOutTime == null)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Attendance>> GetAllWithEmployeeAsync(CancellationToken cancellationToken = default)
    {
        return await Context.Attendances
            .AsNoTracking()
            .Include(x => x.Employee!).ThenInclude(x => x.Department)
            .OrderByDescending(x => x.AttendanceDate)
            .ThenByDescending(x => x.CheckInTime)
            .ToListAsync(cancellationToken);
    }
}