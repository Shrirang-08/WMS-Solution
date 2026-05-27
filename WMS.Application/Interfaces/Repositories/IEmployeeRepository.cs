using WMS.Domain.Entities;

namespace WMS.Application.Interfaces.Repositories;

public interface IEmployeeRepository : IGenericRepository<Employee>
{
    Task<IReadOnlyList<Employee>> SearchAsync(string searchTerm, CancellationToken cancellationToken = default);
    Task<Employee?> GetDetailsAsync(int id, CancellationToken cancellationToken = default);
}