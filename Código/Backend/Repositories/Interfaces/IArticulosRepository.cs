using Microservicios;

namespace SkyHelp.Repositories.Interfaces
{
    public interface IArticulosRepository
    {
        Task<Articulos> ObtenerArticulosPorID(Guid id);
        Task<List<Articulos>> ObtenerArticulos();
        Task<bool> CrearArticulo(Articulos articulo);
        Task<bool> ActualizarArticulo(Articulos articulo);
        Task<bool> EliminarArticulo(Guid id);
    }
}
