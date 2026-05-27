using System.ComponentModel.DataAnnotations;

namespace WMS.Application.Models.Leaves;

public class ApplyLeaveDto
{
    [Required]
    public int EmployeeId { get; set; }

    [Required]
    public DateTime FromDate { get; set; }

    [Required]
    public DateTime ToDate { get; set; }

    [Required]
    [StringLength(100)]
    public string LeaveType { get; set; } = string.Empty;

    [Required]
    [StringLength(500)]
    public string Reason { get; set; } = string.Empty;
}