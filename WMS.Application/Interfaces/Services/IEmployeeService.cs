using WMS.Application.Models.Employees;

namespace WMS.Application.Interfaces.Services;

public interface IEmployeeService
{
    Task<IReadOnlyList<EmployeeListDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<EmployeeDetailsDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<EmployeeListDto>> SearchAsync(string searchTerm, CancellationToken cancellationToken = default);
    Task<int> CreateAsync(CreateEmployeeDto request, CancellationToken cancellationToken = default);
    Task UpdateAsync(int id, UpdateEmployeeDto request, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}