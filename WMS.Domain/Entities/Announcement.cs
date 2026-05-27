using System.ComponentModel.DataAnnotations;
using WMS.Domain.Common;

namespace WMS.Domain.Entities;

public class Announcement : BaseEntity
{
    [Required]
    [StringLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(1000)]
    public string Message { get; set; } = string.Empty;

    public DateTime PublishDate { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiryDate { get; set; }
}