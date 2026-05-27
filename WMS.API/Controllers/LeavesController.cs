using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WMS.Application.Interfaces.Services;
using WMS.Application.Models.Leaves;

namespace WMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LeavesController(ILeaveService leaveService) : ControllerBase
{
    [HttpGet("employee/{employeeId:int}")]
    public async Task<ActionResult<IReadOnlyList<LeaveDto>>> GetByEmployee(int employeeId, CancellationToken cancellationToken)
        => Ok(await leaveService.GetByEmployeeAsync(employeeId, cancellationToken));

    [HttpPost("apply")]
    public async Task<ActionResult> Apply([FromBody] ApplyLeaveDto request, CancellationToken cancellationToken)
    {
        var id = await leaveService.ApplyAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetByEmployee), new { employeeId = request.EmployeeId }, new { id });
    }

    [HttpPatch("{id:int}/cancel")]
    public async Task<IActionResult> Cancel(int id, CancellationToken cancellationToken)
    {
        await leaveService.CancelAsync(id, cancellationToken);
        return NoContent();
    }

    [HttpPatch("{id:int}/decision")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> ApproveReject(int id, [FromBody] ApproveRejectLeaveDto request, CancellationToken cancellationToken)
    {
        await leaveService.ApproveRejectAsync(id, request, cancellationToken);
        return NoContent();
    }
}