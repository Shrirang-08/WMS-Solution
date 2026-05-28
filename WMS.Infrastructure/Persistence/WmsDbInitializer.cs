using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WMS.Domain.Entities;

namespace WMS.Infrastructure.Persistence;

public class WmsDbInitializer
{
    private static readonly PasswordHasher<object> PasswordHasher = new();

    public static async Task SeedAsync(WmsDbContext context, CancellationToken ct = default)
    {
        Console.WriteLine("[seed] Checking if seed data is needed...");

        if (await context.UserLogins.AnyAsync(ct))
        {
            Console.WriteLine("[seed] UserLogins already exist, skipping.");
            return;
        }
        Console.WriteLine("[seed] No UserLogins found. Proceeding to seed...");

        if (!await context.Roles.AnyAsync(ct))
        {
            context.Roles.AddRange(
                new Role { Name = "Admin", Description = "System administrator" },
                new Role { Name = "Manager", Description = "Line manager" },
                new Role { Name = "Employee", Description = "Standard employee" }
            );
            await context.SaveChangesAsync(ct);
        }

        var depts = new List<Department>();
        if (!await context.Departments.AnyAsync(ct))
        {
            depts = new List<Department>
            {
                new() { Name = "Human Resources", Description = "HR Department" },
                new() { Name = "Information Technology", Description = "IT Department" },
                new() { Name = "Finance", Description = "Finance Department" }
            };
            context.Departments.AddRange(depts);
            await context.SaveChangesAsync(ct);
        }

        if (!await context.Clients.AnyAsync(ct))
        {
            context.Clients.Add(new Client { Name = "Internal", Email = "internal@wms.local", PhoneNumber = "0000000000", Address = "Head Office" });
            await context.SaveChangesAsync(ct);
        }

        if (!await context.Employees.AnyAsync(ct))
        {
            var adminRole = await context.Roles.FirstAsync(r => r.Name == "Admin", ct);
            var itDept = await context.Departments.FirstAsync(d => d.Name == "Information Technology", ct);

            context.Employees.Add(new Employee
            {
                EmployeeCode = "EMP-0001",
                FirstName = "System",
                LastName = "Admin",
                Email = "admin@wms.local",
                PhoneNumber = "9999999999",
                DateOfBirth = new DateTime(1990, 1, 1),
                HireDate = new DateTime(2024, 1, 1),
                JobTitle = "System Administrator",
                Salary = 100000,
                DepartmentId = itDept.Id,
                RoleId = adminRole.Id,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            });
            await context.SaveChangesAsync(ct);
        }

        if (!await context.UserLogins.AnyAsync(ct))
        {
            var adminRole = await context.Roles.FirstAsync(r => r.Name == "Admin", ct);
            var adminEmp = await context.Employees.FirstAsync(e => e.EmployeeCode == "EMP-0001", ct);

            context.UserLogins.Add(new UserLogin
            {
                EmployeeId = adminEmp.Id,
                Username = "admin",
                PasswordHash = PasswordHasher.HashPassword(new object(), "Admin@123"),
                RoleId = adminRole.Id,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            });
            await context.SaveChangesAsync(ct);
        }
    }
}
