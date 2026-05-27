using WMS.Application.Interfaces.Repositories;
using WMS.Application.Interfaces.Services;
using WMS.Application.Models.Dashboard;
using WMS.Domain.Enums;

namespace WMS.Application.Services;

public class DashboardService(IUnitOfWork unitOfWork) : IDashboardService
{
    public async Task<DashboardDto> GetDashboardAsync(CancellationToken cancellationToken = default)
    {
        var employees = await unitOfWork.Employees.GetAllAsync(cancellationToken);
        var departments = await unitOfWork.Departments.GetAllAsync(cancellationToken);
        var projects = await unitOfWork.Projects.GetAllAsync(cancellationToken);
        var leaves = await unitOfWork.Leaves.GetAllAsync(cancellationToken);
        var todayAttendances = await unitOfWork.Attendances.GetAllAsync(cancellationToken);

        return new DashboardDto
        {
            TotalEmployees = employees.Count,
            TotalDepartments = departments.Count,
            TotalProjects = projects.Count,
            PendingLeaves = leaves.Count(x => x.Status == LeaveStatus.Pending),
            TodayPresentCount = todayAttendances.Count(x => x.AttendanceDate.Date == DateTime.UtcNow.Date && x.Status == AttendanceStatus.Present)
        };
    }
}