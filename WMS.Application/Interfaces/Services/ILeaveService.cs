using WMS.Application.Models.Leaves;

namespace WMS.Application.Interfaces.Services;

public interface ILeaveService
{
    Task<IReadOnlyList<LeaveDto>> GetByEmployeeAsync(int employeeId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<LeaveDto>> GetPendingAsync(CancellationToken cancellationToken = default);
    Task<int> ApplyAsync(ApplyLeaveDto request, CancellationToken cancellationToken = default);
    Task CancelAsync(int id, CancellationToken cancellationToken = default);
    Task ApproveRejectAsync(int id, ApproveRejectLeaveDto request, int actingEmployeeId, string actingRole, CancellationToken cancellationToken = default);
}