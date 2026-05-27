using System.ComponentModel.DataAnnotations;

namespace WMS.Application.Models.Attendance;

public class CheckInDto
{
    [Required]
    public int EmployeeId { get; set; }

    public DateTime? AttendanceDate { get; set; }

    public TimeSpan? CheckInTime { get; set; }
}