using WMS.Domain.Entities;

namespace WMS.Application.Interfaces.Repositories;

public interface IUserLoginRepository : IGenericRepository<UserLogin>
{
    Task<UserLogin?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default);
    Task<UserLogin?> GetByEmployeeIdAsync(int employeeId, CancellationToken cancellationToken = default);
    Task<UserLogin?> GetByIdWithRoleAsync(int id, CancellationToken cancellationToken = default);
}