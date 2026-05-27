using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WMS.Domain.Common;

namespace WMS.Domain.Entities;

public class Project : BaseEntity
{
    [Required]
    [StringLength(150)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Required]
    [DataType(DataType.Date)]
    public DateTime StartDate { get; set; }

    [DataType(DataType.Date)]
    public DateTime? EndDate { get; set; }

    [StringLength(50)]
    public string? ProjectCode { get; set; }

    [ForeignKey(nameof(Client))]
    public int ClientId { get; set; }

    public Client? Client { get; set; }

    [ForeignKey(nameof(Department))]
    public int DepartmentId { get; set; }

    public Department? Department { get; set; }

    public ICollection<EmployeeProjectAllocation> EmployeeProjectAllocations { get; set; } = new List<EmployeeProjectAllocation>();
}