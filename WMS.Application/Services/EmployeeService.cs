using AutoMapper;
using WMS.Application.Interfaces.Repositories;
using WMS.Application.Interfaces.Services;
using WMS.Application.Models.Employees;
using WMS.Domain.Entities;

namespace WMS.Application.Services;

public class EmployeeService(IUnitOfWork unitOfWork, IMapper mapper) : IEmployeeService
{
    public async Task<IReadOnlyList<EmployeeListDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var employees = await unitOfWork.Employees.GetAllAsync(cancellationToken);
        return mapper.Map<IReadOnlyList<EmployeeListDto>>(employees);
    }

    public async Task<EmployeeDetailsDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var employee = await unitOfWork.Employees.GetDetailsAsync(id, cancellationToken);
        return employee == null ? null : mapper.Map<EmployeeDetailsDto>(employee);
    }

    public async Task<IReadOnlyList<EmployeeListDto>> SearchAsync(string searchTerm, CancellationToken cancellationToken = default)
    {
        var employees = await unitOfWork.Employees.SearchAsync(searchTerm, cancellationToken);
        return mapper.Map<IReadOnlyList<EmployeeListDto>>(employees);
    }

    public async Task<int> CreateAsync(CreateEmployeeDto request, CancellationToken cancellationToken = default)
    {
        var employee = mapper.Map<Employee>(request);
        await unitOfWork.Employees.AddAsync(employee, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return employee.Id;
    }

    public async Task UpdateAsync(int id, UpdateEmployeeDto request, CancellationToken cancellationToken = default)
    {
        var employee = await unitOfWork.Employees.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Employee {id} was not found.");

        mapper.Map(request, employee);
        employee.IsActive = request.IsActive;
        unitOfWork.Employees.Update(employee);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var employee = await unitOfWork.Employees.GetByIdAsync(id, cancellationToken)
            ?? throw new KeyNotFoundException($"Employee {id} was not found.");

        unitOfWork.Employees.Delete(employee);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}