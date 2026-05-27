using System.ComponentModel.DataAnnotations;

namespace WMS.Application.Models.Auth;

public class LoginRequestDto
{
    [Required]
    [StringLength(150)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string Password { get; set; } = string.Empty;
}