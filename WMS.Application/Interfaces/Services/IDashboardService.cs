using WMS.Application.Models.Dashboard;

namespace WMS.Application.Interfaces.Services;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardAsync(CancellationToken cancellationToken = default);
}