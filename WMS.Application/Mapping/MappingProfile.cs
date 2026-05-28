using AutoMapper;
using WMS.Application.Models.Attendance;
using WMS.Application.Models.Clients;
using WMS.Application.Models.Departments;
using WMS.Application.Models.Dashboard;
using WMS.Application.Models.Employees;
using WMS.Application.Models.Leaves;
using WMS.Application.Models.Projects;
using WMS.Domain.Entities;

namespace WMS.Application.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Employee, EmployeeListDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName))
            .ForMember(dest => dest.DepartmentName, opt => opt.MapFrom(src => src.Department != null ? src.Department.Name : string.Empty))
            .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role != null ? src.Role.Name : string.Empty));

        CreateMap<Employee, EmployeeDetailsDto>()
            .IncludeBase<Employee, EmployeeListDto>();

        CreateMap<CreateEmployeeDto, Employee>();
        CreateMap<UpdateEmployeeDto, Employee>();

        CreateMap<Department, DepartmentDto>();
        CreateMap<CreateDepartmentDto, Department>();
        CreateMap<UpdateDepartmentDto, Department>();

        CreateMap<Attendance, AttendanceDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

        CreateMap<Leave, LeaveDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.EmployeeName, opt => opt.MapFrom(src => src.Employee != null ? src.Employee.FirstName + " " + src.Employee.LastName : string.Empty));
        CreateMap<ApplyLeaveDto, Leave>();

        CreateMap<Client, ClientDto>();
        CreateMap<Project, ProjectDto>();
        CreateMap<CreateProjectDto, Project>();
        CreateMap<UpdateProjectDto, Project>();

        CreateMap<DashboardDto, DashboardDto>();
    }
}