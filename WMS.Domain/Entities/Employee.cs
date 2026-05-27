using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WMS.Domain.Common;

namespace WMS.Domain.Entities;

public class Employee : BaseEntity
{
    [Required]
    [StringLength(50)]
    public string EmployeeCode { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = string.Empty;

    [NotMapped]
    public string FullName => string.Concat(FirstName, string.IsNullOrWhiteSpace(LastName) ? string.Empty : " ", LastName);

    [Required]
    [EmailAddress]
    [StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [Phone]
    [StringLength(20)]
    public string? PhoneNumber { get; set; }

    [Required]
    [DataType(DataType.Date)]
    public DateTime DateOfBirth { get; set; }

    [Required]
    [DataType(DataType.Date)]
    public DateTime HireDate { get; set; }

    [Required]
    [StringLength(100)]
    public string JobTitle { get; set; } = string.Empty;

    public decimal Salary { get; set; }

    [ForeignKey(nameof(Department))]
    public int DepartmentId { get; set; }

    public Department? Department { get; set; }

    [ForeignKey(nameof(Role))]
    public int RoleId { get; set; }

    public Role? Role { get; set; }

    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    public ICollection<Leave> Leaves { get; set; } = new List<Leave>();
    public ICollection<EmployeeProjectAllocation> EmployeeProjectAllocations { get; set; } = new List<EmployeeProjectAllocation>();
    public ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
}