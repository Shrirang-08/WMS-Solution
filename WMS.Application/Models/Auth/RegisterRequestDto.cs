using System.ComponentModel.DataAnnotations;
using WMS.Application.Models.Employees;

namespace WMS.Application.Models.Auth;

public class RegisterRequestDto
{
    [Required]
    [StringLength(150)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string Password { get; set; } = string.Empty;

    // Reuse existing CreateEmployeeDto for employee details
    [Required]
    public CreateEmployeeDto Employee { get; set; } = new CreateEmployeeDto();
}
