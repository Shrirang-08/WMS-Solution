using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WMS.Domain.Common;
using WMS.Domain.Enums;

namespace WMS.Domain.Entities;

public class Leave : BaseEntity
{
    [ForeignKey(nameof(Employee))]
    public int EmployeeId { get; set; }

    public Employee? Employee { get; set; }

    [Required]
    [DataType(DataType.Date)]
    public DateTime FromDate { get; set; }

    [Required]
    [DataType(DataType.Date)]
    public DateTime ToDate { get; set; }

    [Required]
    [StringLength(100)]
    public string LeaveType { get; set; } = string.Empty;

    [Required]
    [StringLength(500)]
    public string Reason { get; set; } = string.Empty;

    [Required]
    public LeaveStatus Status { get; set; } = LeaveStatus.Pending;

    [StringLength(250)]
    public string? ManagerComments { get; set; }
}