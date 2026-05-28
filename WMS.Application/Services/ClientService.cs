using AutoMapper;
using WMS.Application.Interfaces.Repositories;
using WMS.Application.Interfaces.Services;
using WMS.Application.Models.Clients;
using WMS.Domain.Entities;

namespace WMS.Application.Services;

public class ClientService(IGenericRepository<Client> clientRepo, IMapper mapper) : IClientService
{
    public async Task<IReadOnlyList<ClientDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var clients = await clientRepo.GetAllAsync(cancellationToken);
        return mapper.Map<IReadOnlyList<ClientDto>>(clients);
    }
}
