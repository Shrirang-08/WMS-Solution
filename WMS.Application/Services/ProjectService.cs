using AutoMapper;
using WMS.Application.Interfaces.Repositories;
using WMS.Application.Interfaces.Services;
using WMS.Application.Models.Projects;
using WMS.Domain.Entities;

namespace WMS.Application.Services;

public class ProjectService(IUnitOfWork unitOfWork, IMapper mapper) : IProjectService
{
    public async Task<IReadOnlyList<ProjectDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var projects = await unitOfWork.Projects.GetAllAsync(cancellationToken);
        return mapper.Map<IReadOnlyList<ProjectDto>>(projects);
    }

    public async Task<ProjectDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var project = await unitOfWork.Projects.GetByIdAsync(id, cancellationToken);
        return project == null ? null : mapper.Map<ProjectDto>(project);
    }

    public async Task<int> CreateAsync(CreateProjectDto request, CancellationToken cancellationToken = default)
    {
        var project = mapper.Map<Project>(request);
        await unitOfWork.Projects.AddAsync(project, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return project.Id;
    }

    public async Task UpdateAsync(int id, UpdateProjectDto request, CancellationToken cancellationToken = default)
    {
        var project = await unitOfWork.Projects.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Project {id} was not found.");

        mapper.Map(request, project);
        unitOfWork.Projects.Update(project);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var project = await unitOfWork.Projects.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Project {id} was not found.");

        unitOfWork.Projects.Delete(project);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}