using System.ComponentModel.DataAnnotations.Schema;
using WMS.Domain.Common;

namespace WMS.Domain.Entities;

public class EmployeeProjectAllocation : BaseEntity
{
    [ForeignKey(nameof(Employee))]
    public int EmployeeId { get; set; }

    public Employee? Employee { get; set; }

    [ForeignKey(nameof(Project))]
    public int ProjectId { get; set; }

    public Project? Project { get; set; }

    public decimal AllocationPercentage { get; set; }

    public DateTime AllocationStartDate { get; set; }

    public DateTime? AllocationEndDate { get; set; }
}