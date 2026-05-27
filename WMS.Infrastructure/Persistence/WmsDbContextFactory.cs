using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace WMS.Infrastructure.Persistence;

public class WmsDbContextFactory : IDesignTimeDbContextFactory<WmsDbContext>
{
    public WmsDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<WmsDbContext>();
        optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS;Database=WMSDb;Trusted_Connection=True;TrustServerCertificate=True;");

        return new WmsDbContext(optionsBuilder.Options);
    }
}