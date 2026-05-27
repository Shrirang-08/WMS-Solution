using Microsoft.EntityFrameworkCore;
using WMS.Domain.Entities;

namespace WMS.Infrastructure.Persistence;

public class WmsDbContext(DbContextOptions<WmsDbContext> options) : DbContext(options)
{
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Attendance> Attendances => Set<Attendance>();
    public DbSet<Leave> Leaves => Set<Leave>();
    public DbSet<Announcement> Announcements => Set<Announcement>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<EmployeeProjectAllocation> EmployeeProjectAllocations => Set<EmployeeProjectAllocation>();
    public DbSet<UserLogin> UserLogins => Set<UserLogin>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Employee>()
            .HasIndex(x => x.EmployeeCode)
            .IsUnique();

        modelBuilder.Entity<Employee>()
            .HasIndex(x => x.Email)
            .IsUnique();

        modelBuilder.Entity<Employee>()
            .Property(x => x.Salary)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Role>()
            .HasIndex(x => x.Name)
            .IsUnique();

        modelBuilder.Entity<Department>()
            .HasIndex(x => x.Name)
            .IsUnique();

        modelBuilder.Entity<Client>()
            .HasIndex(x => x.Name)
            .IsUnique();

        modelBuilder.Entity<Project>()
            .HasOne(x => x.Client)
            .WithMany(x => x.Projects)
            .HasForeignKey(x => x.ClientId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Project>()
            .HasOne(x => x.Department)
            .WithMany(x => x.Projects)
            .HasForeignKey(x => x.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Employee>()
            .HasOne(x => x.Department)
            .WithMany(x => x.Employees)
            .HasForeignKey(x => x.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Employee>()
            .HasOne(x => x.Role)
            .WithMany(x => x.Employees)
            .HasForeignKey(x => x.RoleId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<UserLogin>()
            .HasIndex(x => x.Username)
            .IsUnique();

        modelBuilder.Entity<UserLogin>()
            .HasOne(x => x.Employee)
            .WithOne()
            .HasForeignKey<UserLogin>(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Attendance>()
            .HasIndex(x => new { x.EmployeeId, x.AttendanceDate })
            .IsUnique();

        modelBuilder.Entity<Leave>()
            .HasIndex(x => new { x.EmployeeId, x.FromDate, x.ToDate });

        modelBuilder.Entity<EmployeeProjectAllocation>()
            .HasOne(x => x.Employee)
            .WithMany(x => x.EmployeeProjectAllocations)
            .HasForeignKey(x => x.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<EmployeeProjectAllocation>()
            .HasOne(x => x.Project)
            .WithMany(x => x.EmployeeProjectAllocations)
            .HasForeignKey(x => x.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<EmployeeProjectAllocation>()
            .Property(x => x.AllocationPercentage)
            .HasPrecision(5, 2);

        SeedData.Seed(modelBuilder);
    }
}