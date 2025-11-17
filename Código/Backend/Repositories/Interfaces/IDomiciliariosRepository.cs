
namespace SkyHelp.Repositories
{
    public interface IDomiciliariosRepository
    {
        Task<IEnumerable<Microservicios.Domiciliarios>> TodosLosDomiciliariosAsync();
        Task<Microservicios.Domiciliarios> DomiciliariosIdAsync(Guid id);
        Task<Microservicios.Domiciliarios> DomiciliariosCreadosAsync(Microservicios.Domiciliarios domiciliario);
        Task<Microservicios.Domiciliarios> ActualizarDomiciliariosAsync(Microservicios.Domiciliarios domiciliario);
        Task<bool> EliminarDomiciliariosAsync(Guid id);
    }
}
