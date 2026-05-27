using AutoMapper;
using WMS.Application.Interfaces.Repositories;
using WMS.Application.Interfaces.Services;
using WMS.Application.Models.Departments;
using WMS.Domain.Entities;

namespace WMS.Application.Services;

public class DepartmentService(IUnitOfWork unitOfWork, IMapper mapper) : IDepartmentService
{
    public async Task<IReadOnlyList<DepartmentDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var departments = await unitOfWork.Departments.GetAllAsync(cancellationToken);
        return mapper.Map<IReadOnlyList<DepartmentDto>>(departments);
    }

    public async Task<DepartmentDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var department = await unitOfWork.Departments.GetByIdAsync(id, cancellationToken);
        return department == null ? null : mapper.Map<DepartmentDto>(department);
    }

    public async Task<int> CreateAsync(CreateDepartmentDto request, CancellationToken cancellationToken = default)
    {
        var department = mapper.Map<Department>(request);
        await unitOfWork.Departments.AddAsync(department, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return department.Id;
    }

    public async Task UpdateAsync(int id, UpdateDepartmentDto request, CancellationToken cancellationToken = default)
    {
        var department = await unitOfWork.Departments.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Department {id} was not found.");

        mapper.Map(request, department);
        unitOfWork.Departments.Update(department);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var department = await unitOfWork.Departments.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Department {id} was not found.");

        unitOfWork.Departments.Delete(department);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}