using WMS.Application.Interfaces.Repositories;
using WMS.Domain.Entities;
using WMS.Infrastructure.Persistence;

namespace WMS.Infrastructure.Repositories;

public class ProjectRepository(WmsDbContext context) : GenericRepository<Project>(context), IProjectRepository;