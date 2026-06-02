using System.Text;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.OpenApi.Models;
using Serilog;
using WMS.API.Middleware;
using WMS.Application.Mapping;
using WMS.Infrastructure;
using WMS.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

var _startupWatch = System.Diagnostics.Stopwatch.StartNew();
Console.WriteLine($"[startup] Begin CreateBuilder at {DateTime.Now:O}");

builder.Host.UseSerilog((context, services, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration).ReadFrom.Services(services).Enrich.FromLogContext());

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpContextAccessor();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://wms-client-app-fcaeehc8ccdhhben.centralindia-01.azurewebsites.net")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Register AutoMapper manually so we do not need the DI extension package.
var mapperConfig = new MapperConfiguration(cfg =>
{
    cfg.AddProfile<MappingProfile>();
}, NullLoggerFactory.Instance);
builder.Services.AddSingleton(mapperConfig.CreateMapper());
builder.Services.AddInfrastructureServices(builder.Configuration);

Console.WriteLine($"[startup] Services registered at {DateTime.Now:O} (elapsed {_startupWatch.ElapsedMilliseconds}ms)");

var jwtSection = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSection["Key"] ?? string.Empty);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSection["Issuer"],
        ValidAudience = jwtSection["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "WMS API", Version = "v1" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT token as: Bearer {your token}"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();
Console.WriteLine($"[startup] Builder.Build() completed at {DateTime.Now:O} (elapsed {_startupWatch.ElapsedMilliseconds}ms)");

// Apply pending migrations and seed data
try
{
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<WmsDbContext>();
        Console.WriteLine("[startup] Running MigrateAsync...");
        await db.Database.MigrateAsync();
        Console.WriteLine("[startup] MigrateAsync completed.");
        Console.WriteLine("[startup] Running SeedAsync...");
        await WmsDbInitializer.SeedAsync(db);
        Console.WriteLine("[startup] SeedAsync completed.");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"[startup] ERROR during migration/seeding: {ex.Message}");
    Console.WriteLine($"[startup] StackTrace: {ex.StackTrace}");
    throw;
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseSwagger();
app.UseSwaggerUI();

var hasHttpsEndpoint = builder.Configuration.GetSection("Kestrel:Endpoints").GetChildren()
    .Any(endpoint => endpoint.GetValue<string>("Url")?.StartsWith("https://", StringComparison.OrdinalIgnoreCase) == true);

if (hasHttpsEndpoint)
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowAngularApp");
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => Results.Redirect("/swagger")).ExcludeFromDescription();
app.MapControllers();

Console.WriteLine($"[startup] About to run app at {DateTime.Now:O} (elapsed {_startupWatch.ElapsedMilliseconds}ms)");

app.Lifetime.ApplicationStarted.Register(() =>
{
    var urls = app.Urls.Count > 0 ? string.Join(", ", app.Urls) : "(urls not yet available)";
    Console.WriteLine($"[startup] Application started. Listening on: {urls}");
});

app.Run();
