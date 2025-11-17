using Microsoft.EntityFrameworkCore;
using SkyHelp.Repositories;
using SkyHelp.Repositories.Interfaces;

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
            services.AddScoped<IAuditoriaRepository, AuditoriaRepository>();// Inyección de dependencia del repositorio de auditoría
            return services;
            
        }
    }
}
