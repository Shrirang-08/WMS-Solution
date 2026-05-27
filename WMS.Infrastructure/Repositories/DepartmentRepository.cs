using WMS.Application.Interfaces.Repositories;
using WMS.Domain.Entities;
using WMS.Infrastructure.Persistence;

namespace WMS.Infrastructure.Repositories;

public class DepartmentRepository(WmsDbContext context) : GenericRepository<Department>(context), IDepartmentRepository;