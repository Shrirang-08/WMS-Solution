using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WMS.Domain.Common;
using WMS.Domain.Enums;

namespace WMS.Domain.Entities;

public class Attendance : BaseEntity
{
    [ForeignKey(nameof(Employee))]
    public int EmployeeId { get; set; }

    public Employee? Employee { get; set; }

    [DataType(DataType.Date)]
    public DateTime AttendanceDate { get; set; }

    [DataType(DataType.Time)]
    public TimeSpan CheckInTime { get; set; }

    [DataType(DataType.Time)]
    public TimeSpan? CheckOutTime { get; set; }

    [Required]
    public AttendanceStatus Status { get; set; }

    [StringLength(250)]
    public string? Remarks { get; set; }
}