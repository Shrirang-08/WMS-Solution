using System.ComponentModel.DataAnnotations;

namespace WMS.Application.Models.Employees;

public class CreateEmployeeDto
{
    [Required]
    [StringLength(50)]
    public string EmployeeCode { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [Phone]
    [StringLength(20)]
    public string? PhoneNumber { get; set; }

    [Required]
    public DateTime DateOfBirth { get; set; }

    [Required]
    public DateTime HireDate { get; set; }

    [Required]
    [StringLength(100)]
    public string JobTitle { get; set; } = string.Empty;

    public decimal Salary { get; set; }

    [Required]
    public int DepartmentId { get; set; }

    [Required]
    public int RoleId { get; set; }
}