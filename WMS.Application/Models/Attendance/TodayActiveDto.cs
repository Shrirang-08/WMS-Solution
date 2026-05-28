namespace WMS.Application.Models.Attendance;

public class TodayActiveEmployeeDto
{
    public int AttendanceId { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string EmployeeCode { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public string CheckInTime { get; set; } = string.Empty;
}

public class TodayActiveDto
{
    public int TotalActive { get; set; }
    public List<TodayActiveEmployeeDto> Employees { get; set; } = new();
}
