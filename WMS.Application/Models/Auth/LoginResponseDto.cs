namespace WMS.Application.Models.Auth;

public class LoginResponseDto
{
    public int UserLoginId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string EmployeeName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiresAtUtc { get; set; }
}