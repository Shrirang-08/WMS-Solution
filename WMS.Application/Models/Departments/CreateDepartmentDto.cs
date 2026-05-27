using System.ComponentModel.DataAnnotations;

namespace WMS.Application.Models.Departments;

public class CreateDepartmentDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(250)]
    public string? Description { get; set; }
}