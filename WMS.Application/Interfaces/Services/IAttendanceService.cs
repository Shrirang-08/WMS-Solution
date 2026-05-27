using WMS.Application.Models.Attendance;

namespace WMS.Application.Interfaces.Services;

public interface IAttendanceService
{
    Task<IReadOnlyList<AttendanceDto>> GetByEmployeeAndMonthAsync(int employeeId, int year, int month, CancellationToken cancellationToken = default);
    Task<int> CheckInAsync(CheckInDto request, CancellationToken cancellationToken = default);
    Task CheckOutAsync(int attendanceId, CheckOutDto request, CancellationToken cancellationToken = default);
}