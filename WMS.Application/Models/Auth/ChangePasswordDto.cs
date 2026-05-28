using System.ComponentModel.DataAnnotations;

namespace WMS.Application.Models.Auth;

public class ChangePasswordDto
{
    public int? UserId { get; set; }

    public int? EmployeeId { get; set; }

    [StringLength(200)]
    public string? CurrentPassword { get; set; }

    [Required]
    [StringLength(200)]
    public string NewPassword { get; set; } = string.Empty;
}
