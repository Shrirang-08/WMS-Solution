using WMS.Application.Models.Projects;

namespace WMS.Application.Interfaces.Services;

public interface IProjectService
{
    Task<IReadOnlyList<ProjectDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ProjectDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<int> CreateAsync(CreateProjectDto request, CancellationToken cancellationToken = default);
    Task UpdateAsync(int id, UpdateProjectDto request, CancellationToken cancellationToken = default);
    Task DeleteAsync(int id, CancellationToken cancellationToken = default);
}