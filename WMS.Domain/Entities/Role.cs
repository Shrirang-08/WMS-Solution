using System.ComponentModel.DataAnnotations;
using WMS.Domain.Common;

namespace WMS.Domain.Entities;

public class Role : BaseEntity
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(250)]
    public string? Description { get; set; }

    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    public ICollection<UserLogin> UserLogins { get; set; } = new List<UserLogin>();
}