using AutoMapper;
using WMS.Application.Interfaces.Repositories;
using WMS.Application.Interfaces.Services;
using WMS.Application.Models.Leaves;
using WMS.Domain.Entities;
using WMS.Domain.Enums;

namespace WMS.Application.Services;

public class LeaveService(IUnitOfWork unitOfWork, IMapper mapper) : ILeaveService
{
    public async Task<IReadOnlyList<LeaveDto>> GetByEmployeeAsync(int employeeId, CancellationToken cancellationToken = default)
    {
        var leaves = await unitOfWork.Leaves.GetByEmployeeAsync(employeeId, cancellationToken);
        return mapper.Map<IReadOnlyList<LeaveDto>>(leaves);
    }

    public async Task<int> ApplyAsync(ApplyLeaveDto request, CancellationToken cancellationToken = default)
    {
        var leave = mapper.Map<Leave>(request);
        leave.Status = LeaveStatus.Pending;
        await unitOfWork.Leaves.AddAsync(leave, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return leave.Id;
    }

    public async Task CancelAsync(int id, CancellationToken cancellationToken = default)
    {
        var leave = await unitOfWork.Leaves.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Leave {id} was not found.");

        leave.Status = LeaveStatus.Cancelled;
        unitOfWork.Leaves.Update(leave);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task ApproveRejectAsync(int id, ApproveRejectLeaveDto request, CancellationToken cancellationToken = default)
    {
        var leave = await unitOfWork.Leaves.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Leave {id} was not found.");

        leave.Status = request.IsApproved ? LeaveStatus.Approved : LeaveStatus.Rejected;
        leave.ManagerComments = request.ManagerComments;
        unitOfWork.Leaves.Update(leave);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}