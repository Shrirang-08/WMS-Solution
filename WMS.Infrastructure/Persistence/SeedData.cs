using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using WMS.Domain.Entities;

namespace WMS.Infrastructure.Persistence;

public static class SeedData
{
    public static void Seed(ModelBuilder modelBuilder)
    {
        var passwordHasher = new PasswordHasher<object>();

        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin", Description = "System administrator" },
            new Role { Id = 2, Name = "Manager", Description = "Line manager" },
            new Role { Id = 3, Name = "Employee", Description = "Standard employee" });

        modelBuilder.Entity<Department>().HasData(
            new Department { Id = 1, Name = "Human Resources", Description = "HR Department" },
            new Department { Id = 2, Name = "Information Technology", Description = "IT Department" },
            new Department { Id = 3, Name = "Finance", Description = "Finance Department" });

        modelBuilder.Entity<Client>().HasData(
            new Client { Id = 1, Name = "Internal", Email = "internal@wms.local", PhoneNumber = "0000000000", Address = "Head Office" });

        modelBuilder.Entity<Employee>().HasData(
            new Employee
            {
                Id = 1,
                EmployeeCode = "EMP-0001",
                FirstName = "System",
                LastName = "Admin",
                Email = "admin@wms.local",
                PhoneNumber = "9999999999",
                DateOfBirth = new DateTime(1990, 1, 1),
                HireDate = new DateTime(2024, 1, 1),
                JobTitle = "System Administrator",
                Salary = 100000,
                DepartmentId = 2,
                RoleId = 1,
                IsActive = true,
                CreatedAt = new DateTime(2024, 1, 1)
            });

        modelBuilder.Entity<UserLogin>().HasData(
            new UserLogin
            {
                Id = 1,
                EmployeeId = 1,
                Username = "admin",
                PasswordHash = passwordHasher.HashPassword(new object(), "Admin@123"),
                RoleId = 1,
                IsActive = true,
                CreatedAt = new DateTime(2024, 1, 1)
            });

        modelBuilder.Entity<Announcement>().HasData(
            new Announcement { Id = 1, Title = "Welcome", Message = "WMS is ready for use.", PublishDate = DateTime.UtcNow, IsActive = true });
    }
}