namespace WMS.Application.Models.Employees;

public class EmployeeDetailsDto : EmployeeListDto
{
    public string? PhoneNumber { get; set; }
    public DateTime DateOfBirth { get; set; }
    public DateTime HireDate { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public decimal Salary { get; set; }
}