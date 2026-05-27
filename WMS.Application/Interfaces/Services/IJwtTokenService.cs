using WMS.Domain.Entities;

namespace WMS.Application.Interfaces.Services;

public interface IJwtTokenService
{
    string GenerateToken(UserLogin userLogin, Employee employee, Role role);
}