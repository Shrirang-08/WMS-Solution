using System.ComponentModel.DataAnnotations;
using WMS.Domain.Common;

namespace WMS.Domain.Entities;

public class Client : BaseEntity
{
    [Required]
    [StringLength(150)]
    public string Name { get; set; } = string.Empty;

    [EmailAddress]
    [StringLength(150)]
    public string? Email { get; set; }

    [Phone]
    [StringLength(20)]
    public string? PhoneNumber { get; set; }

    [StringLength(250)]
    public string? Address { get; set; }

    public ICollection<Project> Projects { get; set; } = new List<Project>();
}