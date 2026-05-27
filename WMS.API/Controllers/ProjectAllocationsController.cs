using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WMS.Infrastructure.Persistence;
using WMS.Domain.Entities;

namespace WMS.API.Controllers;

[ApiController]
[Route("api/projects/{projectId:int}/allocations")]
[Authorize]
public class ProjectAllocationsController : ControllerBase
{
    private readonly WmsDbContext _db;

    public ProjectAllocationsController(WmsDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(int projectId, CancellationToken cancellationToken)
    {
        var items = await _db.EmployeeProjectAllocations
            .Where(a => a.ProjectId == projectId)
            .Include(a => a.Employee)
            .ToListAsync(cancellationToken);

        var result = items.Select(a => new {
            id = a.Id,
            employeeId = a.EmployeeId,
            employeeName = a.Employee != null ? a.Employee.FullName : string.Empty,
            allocationPercentage = a.AllocationPercentage,
            allocationStartDate = a.AllocationStartDate,
            allocationEndDate = a.AllocationEndDate
        });

        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Create(int projectId, [FromBody] CreateAllocationRequest request, CancellationToken cancellationToken)
    {
        if (!await _db.Projects.AnyAsync(p => p.Id == projectId, cancellationToken))
            return NotFound("Project not found");

        if (!await _db.Employees.AnyAsync(e => e.Id == request.EmployeeId, cancellationToken))
            return NotFound("Employee not found");

        var alloc = new EmployeeProjectAllocation
        {
            ProjectId = projectId,
            EmployeeId = request.EmployeeId,
            AllocationPercentage = request.AllocationPercentage,
            AllocationStartDate = request.AllocationStartDate,
            AllocationEndDate = request.AllocationEndDate
        };

        _db.EmployeeProjectAllocations.Add(alloc);
        await _db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetAll), new { projectId }, null);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Delete(int projectId, int id, CancellationToken cancellationToken)
    {
        var alloc = await _db.EmployeeProjectAllocations.FindAsync(new object[] { id }, cancellationToken);
        if (alloc == null || alloc.ProjectId != projectId) return NotFound();

        _db.EmployeeProjectAllocations.Remove(alloc);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    public class CreateAllocationRequest
    {
        public int EmployeeId { get; set; }
        public decimal AllocationPercentage { get; set; }
        public DateTime AllocationStartDate { get; set; }
        public DateTime? AllocationEndDate { get; set; }
    }
}
