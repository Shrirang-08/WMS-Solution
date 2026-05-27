using Microsoft.EntityFrameworkCore;
using WMS.Application.Interfaces.Repositories;
using WMS.Domain.Entities;
using WMS.Infrastructure.Persistence;

namespace WMS.Infrastructure.Repositories;

public class EmployeeRepository(WmsDbContext context) : GenericRepository<Employee>(context), IEmployeeRepository
{
    public async Task<IReadOnlyList<Employee>> SearchAsync(string searchTerm, CancellationToken cancellationToken = default)
    {
        searchTerm = searchTerm.Trim();

        return await Context.Employees
            .AsNoTracking()
            .Include(x => x.Department)
            .Include(x => x.Role)
            .Where(x => x.FirstName.Contains(searchTerm) || x.LastName.Contains(searchTerm) || x.EmployeeCode.Contains(searchTerm) || x.Email.Contains(searchTerm))
            .ToListAsync(cancellationToken);
    }

    public async Task<Employee?> GetDetailsAsync(int id, CancellationToken cancellationToken = default)
    {
        return await Context.Employees
            .Include(x => x.Department)
            .Include(x => x.Role)
            .Include(x => x.Attendances)
            .Include(x => x.Leaves)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }
}