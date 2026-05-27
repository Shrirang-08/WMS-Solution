using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WMS.Application.Interfaces.Services;
using WMS.Application.Models.Attendance;

namespace WMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AttendanceController(IAttendanceService attendanceService) : ControllerBase
{
    [HttpGet("employee/{employeeId:int}/month/{year:int}/{month:int}")]
    public async Task<ActionResult<IReadOnlyList<AttendanceDto>>> GetMonthly(int employeeId, int year, int month, CancellationToken cancellationToken)
        => Ok(await attendanceService.GetByEmployeeAndMonthAsync(employeeId, year, month, cancellationToken));

    [HttpPost("check-in")]
    public async Task<ActionResult> CheckIn([FromBody] CheckInDto request, CancellationToken cancellationToken)
    {
        var id = await attendanceService.CheckInAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetMonthly), new { employeeId = request.EmployeeId, year = (request.AttendanceDate ?? DateTime.UtcNow.Date).Year, month = (request.AttendanceDate ?? DateTime.UtcNow.Date).Month }, new { id });
    }

    [HttpPost("{id:int}/check-out")]
    public async Task<IActionResult> CheckOut(int id, [FromBody] CheckOutDto request, CancellationToken cancellationToken)
    {
        await attendanceService.CheckOutAsync(id, request, cancellationToken);
        return NoContent();
    }
}