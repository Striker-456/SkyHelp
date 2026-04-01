using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Authorization;

namespace SkyHelp.Controllers
{
    /// <summary>
    /// Endpoints de demostración con <c>[Authorize(Roles = ...)]</c> para cada rol del sistema.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class EjemplosAutorizacionController : ControllerBase
    {
        [HttpGet("administrador")]
        [Authorize(Roles = RoleNames.Administrador)]
        public IActionResult EjemploAdministrador() =>
            Ok(new
            {
                rol = RoleNames.Administrador,
                descripcion = "CRUD usuarios y clientes, CRUD tickets, ver reportes, asignar roles."
            });

        [HttpGet("tecnico")]
        [Authorize(Roles = RoleNames.Tecnico)]
        public IActionResult EjemploTecnico() =>
            Ok(new
            {
                rol = RoleNames.Tecnico,
                descripcion = "Ver tickets asignados, cambiar estado, agregar comentarios; sin eliminar registros."
            });

        [HttpGet("domi")]
        [Authorize(Roles = RoleNames.Domiciliario)]
        public IActionResult EjemploDomi() =>
            Ok(new
            {
                rol = RoleNames.Domiciliario,
                descripcion = "Ver pedidos asignados, cambiar estado del pedido, ver dirección del cliente."
            });

        [HttpGet("usuario")]
        [Authorize(Roles = RoleNames.Usuario)]
        public IActionResult EjemploUsuario() =>
            Ok(new
            {
                rol = RoleNames.Usuario,
                descripcion = "Crear ticket, ver sus propios tickets, editar su perfil."
            });
    }
}
