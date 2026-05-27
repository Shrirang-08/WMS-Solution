namespace WMS.Application.Models.Attendance;

public class AttendanceDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public DateTime AttendanceDate { get; set; }
    public TimeSpan CheckInTime { get; set; }
    public TimeSpan? CheckOutTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Remarks { get; set; }
}