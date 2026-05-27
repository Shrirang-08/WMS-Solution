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
}