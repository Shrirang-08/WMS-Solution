using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WMS.Application.Interfaces.Services;
using WMS.Application.Models.Employees;

namespace WMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeesController(IEmployeeService employeeService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<EmployeeListDto>>> GetAll(CancellationToken cancellationToken)
        => Ok(await employeeService.GetAllAsync(cancellationToken));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<EmployeeDetailsDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var employee = await employeeService.GetByIdAsync(id, cancellationToken);
        return employee == null ? NotFound() : Ok(employee);
    }

    [HttpGet("search")]
    public async Task<ActionResult<IReadOnlyList<EmployeeListDto>>> Search([FromQuery] string term, CancellationToken cancellationToken)
        => Ok(await employeeService.SearchAsync(term, cancellationToken));

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult> Create([FromBody] CreateEmployeeDto request, CancellationToken cancellationToken)
    {
        var id = await employeeService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, null);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEmployeeDto request, CancellationToken cancellationToken)
    {
        await employeeService.UpdateAsync(id, request, cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        await employeeService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}