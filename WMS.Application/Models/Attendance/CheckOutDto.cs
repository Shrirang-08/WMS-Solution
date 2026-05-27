namespace WMS.Application.Models.Attendance;

public class CheckOutDto
{
    public TimeSpan? CheckOutTime { get; set; }
    public string? Remarks { get; set; }
}