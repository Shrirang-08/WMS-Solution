using System.ComponentModel.DataAnnotations;

namespace WMS.Application.Models.Leaves;

public class ApproveRejectLeaveDto
{
    [Required]
    public bool IsApproved { get; set; }

    [StringLength(250)]
    public string? ManagerComments { get; set; }
}