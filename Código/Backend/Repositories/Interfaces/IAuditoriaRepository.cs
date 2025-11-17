using SkyHelp.Models;
namespace SkyHelp.Repositories.Interfaces
{
    public interface IAuditoriaRepository
    {
        Task<List<Auditoria>> ObtenerAuditorias();
        Task<Auditoria> ObtenerAuditoriaPorID(Guid id);
        Task<bool> CrearAuditoria(Auditoria auditoria);
        Task<bool> ActualizarAuditoria(Auditoria auditoria);
        Task<bool> EliminarAuditoria(Guid id);
    }
}
