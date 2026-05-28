using AutoMapper;
using WMS.Application.Interfaces.Repositories;
using WMS.Application.Interfaces.Services;
using WMS.Application.Models.Attendance;
using WMS.Domain.Entities;
using WMS.Domain.Enums;

namespace WMS.Application.Services;

public class AttendanceService(IUnitOfWork unitOfWork, IMapper mapper) : IAttendanceService
{
    public async Task<IReadOnlyList<AttendanceDto>> GetByEmployeeAndMonthAsync(int employeeId, int year, int month, CancellationToken cancellationToken = default)
    {
        var attendances = await unitOfWork.Attendances.GetByEmployeeAndMonthAsync(employeeId, year, month, cancellationToken);
        return mapper.Map<IReadOnlyList<AttendanceDto>>(attendances);
    }

    public async Task<int> CheckInAsync(CheckInDto request, CancellationToken cancellationToken = default)
    {
        var attendance = new Attendance
        {
            EmployeeId = request.EmployeeId,
            AttendanceDate = request.AttendanceDate ?? DateTime.UtcNow.Date,
            CheckInTime = request.CheckInTime ?? DateTime.UtcNow.TimeOfDay,
            Status = AttendanceStatus.Present
        };

        await unitOfWork.Attendances.AddAsync(attendance, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return attendance.Id;
    }

    public async Task CheckOutAsync(int attendanceId, CheckOutDto request, CancellationToken cancellationToken = default)
    {
        var attendance = await unitOfWork.Attendances.GetByIdAsync(attendanceId, cancellationToken)
            ?? throw new KeyNotFoundException($"Attendance {attendanceId} was not found.");

        attendance.CheckOutTime = request.CheckOutTime ?? DateTime.UtcNow.TimeOfDay;
        attendance.Remarks = request.Remarks;
        unitOfWork.Attendances.Update(attendance);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<TodayActiveDto> GetTodayActiveAsync(CancellationToken cancellationToken = default)
    {
        var activeAttendances = await unitOfWork.Attendances.GetTodayActiveAsync(cancellationToken);
        return new TodayActiveDto
        {
            TotalActive = activeAttendances.Count,
            Employees = activeAttendances.Select(a => new TodayActiveEmployeeDto
            {
                AttendanceId = a.Id,
                EmployeeId = a.EmployeeId,
                EmployeeName = a.Employee!.FullName,
                EmployeeCode = a.Employee.EmployeeCode,
                DepartmentName = a.Employee.Department?.Name ?? "",
                CheckInTime = a.CheckInTime.ToString(@"hh\:mm")
            }).ToList()
        };
    }
}