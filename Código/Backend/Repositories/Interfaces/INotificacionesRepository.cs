namespace SkyHelp.Repositories.Interfaces
{
    public interface INotificacionesRepository
    {
        Task<Notificaciones> ObtenerNotificacionesPorId(Guid Id);
        Task<List<Notificaciones>> ObtenerPorUsuario(Guid idUsuario);
        Task<bool> MarcarComoLeida (Guid id);
        Task<bool> CrearNotificacion(Notificaciones notificacion);
        Task<bool> EliminarNotificacion(Guid id);

    }
}
