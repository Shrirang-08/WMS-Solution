using WMS.Application.Models.Departments;

namespace WMS.Application.Interfaces.Services;

public interface IDepartmentService
{
    Task<IReadOnlyList<DepartmentDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<DepartmentDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<int> CreateAsync(CreateDepartmentDto request, CancellationToken cancellationToken = default);
    Task UpdateAsync(int id, UpdateDepartmentDto request, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}