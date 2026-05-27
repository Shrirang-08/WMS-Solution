using System.ComponentModel.DataAnnotations;

namespace WMS.Application.Models.Projects;

public class CreateProjectDto
{
    [Required]
    [StringLength(150)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    [StringLength(50)]
    public string? ProjectCode { get; set; }

    [Required]
    public int ClientId { get; set; }

    [Required]
    public int DepartmentId { get; set; }
}