using SkyHelp.Models;
namespace SkyHelp.Repositories.Interfaces
{
    public interface IAuditoriaRepository
    {
        Task<List<Auditoria>> ObtenerAuditorias(string? usuario, string? accion, string? modulo, DateTime? desde, DateTime? hasta);
        Task<bool> CrearAuditoria(Auditoria auditoria);
    }
}
