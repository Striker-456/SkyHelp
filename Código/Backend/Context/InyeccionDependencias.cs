using Microsoft.EntityFrameworkCore;
using SkyHelp.Repositories;
using SkyHelp.Repositories.Interfaces;
using SkyHelp.Repositories.Interfaces.SkyHelp.Repositories.Interfaces;
using System.Net.Security;

namespace SkyHelp.Context
{
    public static class InyeccionDependencias
    {
        public static IServiceCollection AddExternal(this IServiceCollection services,IConfiguration _Configuration)// Método de extensión para agregar dependencias externas
        {
            String connectionString = "";
            connectionString = _Configuration["ConnectionStrings:SQL"];// Obtener la cadena de conexión desde la configuración

            services.AddDbContext<SkyHelpContext>(options => options.UseSqlServer(connectionString));// Configurar el contexto de la base de datos con SQL Server
            services.AddScoped<IUsuariosRepository, UsuariosRepository>();// Inyección de dependencia del repositorio de usuarios 
            services.AddScoped<IRolRepository, RolRepository>();// Inyección de dependencia del repositorio de roles
            services.AddScoped<IArticulosRepository, ArticulosRepository>();// Inyección de dependencia del repositorio de artículos
            services.AddScoped<IAuditoriaRepository, AuditoriaRepository>();//Inyección de dependencia del repositorio de auditoría
            services.AddScoped<IDomiciliariosRepository, DomiciliariosRepository>();//Inyección de dependencia del repositorio de domiciliarios
            services.AddScoped<IReportesRepository, ReportesRepository>();//Inyección de dependencia del repositorio de reportes
            services.AddScoped<INotificacionesRepository, NotificacionRepository>();//Inyección de dependencia del repositorio de notificaciones
            services.AddScoped<IPedidosRepository, PedidosRepository>();//Inyección de dependencia del repositorio de pedidos
            services.AddScoped<IEstadisticasRepository, EstadisticasRepository>();//Inyección de dependencia del repositorio de estadísticas
            services.AddScoped<IExportacionesEstadisticasRepository, ExportacionesEstadisticasRepository>();//Inyección de dependencia del repositorio de exportaciones de estadísticas
            services.AddScoped<ITecnicosRepository, TecnicosRepository>();//Inyección de dependencia del repositorio de técnicos
            return services;
            
        }
    }
}
