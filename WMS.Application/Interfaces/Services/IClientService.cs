using WMS.Application.Models.Clients;

namespace WMS.Application.Interfaces.Services;

public interface IClientService
{
    Task<IReadOnlyList<ClientDto>> GetAllAsync(CancellationToken cancellationToken = default);
}
