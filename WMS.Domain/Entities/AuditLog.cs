using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WMS.Domain.Common;

namespace WMS.Domain.Entities;

public class AuditLog : BaseEntity
{
    [Required]
    [StringLength(100)]
    public string EntityName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Action { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? OldValues { get; set; }

    [StringLength(2000)]
    public string? NewValues { get; set; }

    [StringLength(2000)]
    public string? ChangedBy { get; set; }

    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(Employee))]
    public int? EmployeeId { get; set; }

    public Employee? Employee { get; set; }
}