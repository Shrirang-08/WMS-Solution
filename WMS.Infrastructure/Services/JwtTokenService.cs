using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using WMS.Application.Interfaces.Services;
using WMS.Domain.Entities;

namespace WMS.Infrastructure.Services;

public class JwtTokenService(IConfiguration configuration) : IJwtTokenService
{
    public string GenerateToken(UserLogin userLogin, Employee employee, Role role)
    {
        var jwtSection = configuration.GetSection("Jwt");
        var key = jwtSection["Key"] ?? throw new InvalidOperationException("JWT key is missing.");
        var issuer = jwtSection["Issuer"] ?? throw new InvalidOperationException("JWT issuer is missing.");
        var audience = jwtSection["Audience"] ?? throw new InvalidOperationException("JWT audience is missing.");
        var expiryMinutes = int.Parse(jwtSection["ExpiryMinutes"] ?? "60");

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, userLogin.Username),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.NameIdentifier, userLogin.Id.ToString()),
            new(ClaimTypes.Name, employee.FirstName + " " + employee.LastName),
            new(ClaimTypes.Email, employee.Email),
            new(ClaimTypes.Role, role.Name),
            new("employeeId", employee.Id.ToString()),
            new("employeeCode", employee.EmployeeCode)
        };

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}