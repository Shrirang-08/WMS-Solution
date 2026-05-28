using Microsoft.EntityFrameworkCore;
using WMS.Application.Interfaces.Repositories;
using WMS.Domain.Entities;
using WMS.Infrastructure.Persistence;

namespace WMS.Infrastructure.Repositories;

public class UserLoginRepository(WmsDbContext context) : GenericRepository<UserLogin>(context), IUserLoginRepository
{
    public Task<UserLogin?> GetByUsernameAsync(string username, CancellationToken cancellationToken = default)
    {
        return Context.UserLogins
            .Include(x => x.Employee)
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Username == username, cancellationToken);
    }

    public Task<UserLogin?> GetByEmployeeIdAsync(int employeeId, CancellationToken cancellationToken = default)
    {
        return Context.UserLogins
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.EmployeeId == employeeId, cancellationToken);
    }

    public Task<UserLogin?> GetByIdWithRoleAsync(int id, CancellationToken cancellationToken = default)
    {
        return Context.UserLogins
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }
}