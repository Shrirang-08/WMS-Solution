using System.Text.Json.Serialization;

namespace WMS.Application.Models.Attendance;

public class AttendanceDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }

    [JsonPropertyName("employeeName")]
    public string EmployeeName { get; set; } = string.Empty;

    public DateTime AttendanceDate { get; set; }

    [JsonPropertyName("checkIn")]
    public TimeSpan CheckInTime { get; set; }

    [JsonPropertyName("checkOut")]
    public TimeSpan? CheckOutTime { get; set; }

    public string Status { get; set; } = string.Empty;
    public string? Remarks { get; set; }
}
