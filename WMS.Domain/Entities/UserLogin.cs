using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WMS.Domain.Common;

namespace WMS.Domain.Entities;

public class UserLogin : BaseEntity
{
    [ForeignKey(nameof(Employee))]
    public int EmployeeId { get; set; }

    public Employee? Employee { get; set; }

    [Required]
    [StringLength(150)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(500)]
    public string PasswordHash { get; set; } = string.Empty;

    [ForeignKey(nameof(Role))]
    public int RoleId { get; set; }

    public Role? Role { get; set; }

    public DateTime? LastLoginAt { get; set; }
}