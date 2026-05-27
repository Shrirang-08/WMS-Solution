using System.ComponentModel.DataAnnotations;

namespace WMS.Application.Models.Employees;

public class UpdateEmployeeDto : CreateEmployeeDto
{
    [Required]
    public bool IsActive { get; set; }
}