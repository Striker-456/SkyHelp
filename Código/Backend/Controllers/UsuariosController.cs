using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Authorization;
using SkyHelp.EncriptarSHA256;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;
using System.Security.Claims;


namespace SkyHelp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuariosRepository _UsuariosRepository;
        public UsuariosController(IUsuariosRepository usuariosRepository)// Constructor de la clase con inyección de dependencia
        {
            _UsuariosRepository = usuariosRepository;// inyección de dependencia del repositorio de usuarios
        }

        [Authorize]
        [HttpGet("ObtnerUsuariosPorCorreo")]// Definiendo que este método responde a solicitudes GET)
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Indicando que este método puede retornar un estado 404 Not Found
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error

        public async Task<IActionResult> ObtenerUsuariosPorCorreo(string Correo)// Método para obtener usuarios por correo
        {
            try
            {
                var usuarios = await _UsuariosRepository.ObtenerUsuarioPorCorreo(Correo);// Llamando al método del repositorio para obtener los usuarios por correo
                if (usuarios == null) // Verificando si el usuario existe
                {
                    return NotFound("Usuario no encontrado."); // Retornando una respuesta HTTP 404 si no se encuentra el usuario
                }
                return Ok(usuarios); // Retornando una respuesta HTTP 200 con el usuario encontrado
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener el usuario."); // Retornando una respuesta HTTP 500 en caso de error
            }
        }


        [Authorize]
        [HttpGet("ObtenerNombrePorId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ObtenerNombrePorId(Guid id)
        {
            try
            {
                var usuario = await _UsuariosRepository.ObtenerUsuario(id);
                if (usuario == null) return NotFound();
                return Ok(new { usuario.IdUsuario, usuario.NombreCompleto, usuario.Correo });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener el usuario.");
            }
        }

        [Authorize]
        [HttpGet("ObtenerUsuarios")]// Definiendo que este método responde a solicitudes GET
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error
        public async Task<IActionResult> ObtenerUsuarios()// Método para obtener todos los usuarios
        {
            try
            {
                var usuarios = await _UsuariosRepository.ObtenerUsuarios();// Llamando al método del repositorio para obtener los usuarios
                return Ok(usuarios ?? new List<Usuarios>());// Retornando una respuesta HTTP 200 con la lista de usuarios (vacía si no hay)
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener Usuarios.");// Retornando una respuesta HTTP 500 en caso de error
            }
        }

        [Authorize]
        [HttpGet("ObtenerUsuarioPorID")]// Definiendo que este método responde a solicitudes GET
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Indicando que este método puede retornar un estado 404 Not Found
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error

        public async Task<IActionResult> ObtenerUsuarioPorId (Guid ID) // Metodo para Obtener Usuario pro ID
        {
            try
            {
                var usuario = await _UsuariosRepository.ObtenerUsuario(ID); // Llamando al metodo del repositorio para obtener el usuario por ID
                if (usuario == null) // Verificando si el usuario existe
                {
                    return NotFound("Usuario no encontrado."); // Retornando una respuesta HTTP 404 si no se encuentra el usuario
                }
                if (User.IsInRole(RoleNames.Usuario) && !User.IsInRole(RoleNames.Administrador))
                {
                    var self = await _UsuariosRepository.ObtenerUsuarioPorCorreo(User.Identity?.Name ?? "");
                    if (self == null || self.IdUsuario != ID)
                        return Forbid();
                }
                return Ok(usuario); // Retornando una respuesta HTTP 200 con el usuario encontrado
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener el usuario."); // Retornando una respuesta HTTP 500 en caso de error
            }
        }
        
        [AllowAnonymous]
        [HttpPost("CrearUsuario")]// Definiendo que este método responde a solicitudes GET
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Indicando que este método puede retornar un estado 404 Not Found
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error

        public async Task<IActionResult> CrearUsuario([FromBody] Usuarios usuario)
        {
            try
            {
                var Resultado = await _UsuariosRepository.CrearUsuario(usuario);

                if (!Resultado)
                {
                    return BadRequest("No se puede Crear Usuario");
                }
                return Ok("Usuario Creado Correctamente");
            }
            catch (Exception ex)
{ 
    return StatusCode(500, ex.ToString());
}
        }

        [Authorize]
        [HttpPut("CambiarContrasena")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CambiarContrasena([FromBody] CambiarContrasenaConVerificacionRequest request)
        {
            try
            {
                var correo = User.Identity?.Name;
                if (string.IsNullOrEmpty(correo))
                    return Unauthorized();

                var usuario = await _UsuariosRepository.ObtenerUsuarioPorCorreo(correo);
                if (usuario == null)
                    return NotFound("Usuario no encontrado.");

                // Verificar contraseña actual
                if (Seguridad.EncriptarSHA256(request.ContrasenaActual) != usuario.Contrasena)
                    return BadRequest("Contraseña actual inválida.");

                usuario.Contrasena = request.NuevaContrasena;
                var resultado = await _UsuariosRepository.ActualizarUsuario(usuario);
                if (!resultado)
                    return BadRequest("No se pudo actualizar la contraseña.");

                return Ok("Contraseña actualizada correctamente.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al cambiar la contraseña.");
            }
        }

        [Authorize]
        [HttpPut("CambiarNombre")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CambiarNombre([FromBody] CambiarNombreRequest request)
        {
            try
            {
                var correo = User.Identity?.Name;
                if (string.IsNullOrEmpty(correo))
                    return Unauthorized();

                var usuario = await _UsuariosRepository.ObtenerUsuarioPorCorreo(correo);
                if (usuario == null)
                    return NotFound("Usuario no encontrado.");

                // Verificar contraseña
                if (Seguridad.EncriptarSHA256(request.Contrasena) != usuario.Contrasena)
                    return BadRequest("Contraseña inválida.");

                // Crear objeto para actualizar sin cambiar contraseña
                var usuarioActualizado = new Usuarios
                {
                    IdUsuario = usuario.IdUsuario,
                    IdRol = usuario.IdRol,
                    NombreUsuarios = request.NuevoNombre.Split(' ')[0],
                    NombreCompleto = request.NuevoNombre,
                    Correo = usuario.Correo,
                    EstadoCuenta = usuario.EstadoCuenta,
                    Telefono = usuario.Telefono,
                    Contrasena = string.Empty // NO cambiar contraseña
                };
                
                var resultado = await _UsuariosRepository.ActualizarUsuario(usuarioActualizado);
                if (!resultado)
                    return BadRequest("No se pudo actualizar el nombre.");

                return Ok("Nombre actualizado correctamente.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al cambiar el nombre.");
            }
        }

        [Authorize]
        [HttpPut("CambiarCorreo")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CambiarCorreo([FromBody] CambiarCorreoRequest request)
        {
            try
            {
                var correo = User.Identity?.Name;
                if (string.IsNullOrEmpty(correo))
                    return Unauthorized();

                var usuario = await _UsuariosRepository.ObtenerUsuarioPorCorreo(correo);
                if (usuario == null)
                    return NotFound("Usuario no encontrado.");

                // Verificar contraseña
                if (Seguridad.EncriptarSHA256(request.Contrasena) != usuario.Contrasena)
                    return BadRequest("Contraseña inválida.");

                // Verificar que el nuevo correo no exista
                var usuarioExistente = await _UsuariosRepository.ObtenerUsuarioPorCorreo(request.NuevoCorreo);
                if (usuarioExistente != null)
                    return BadRequest("El correo ya está registrado.");

                // Crear objeto para actualizar sin cambiar contraseña
                var usuarioActualizado = new Usuarios
                {
                    IdUsuario = usuario.IdUsuario,
                    IdRol = usuario.IdRol,
                    NombreUsuarios = usuario.NombreUsuarios,
                    NombreCompleto = usuario.NombreCompleto,
                    Correo = request.NuevoCorreo,
                    EstadoCuenta = usuario.EstadoCuenta,
                    Telefono = usuario.Telefono,
                    Contrasena = string.Empty // NO cambiar contraseña
                };
                
                var resultado = await _UsuariosRepository.ActualizarUsuario(usuarioActualizado);
                if (!resultado)
                    return BadRequest("No se pudo actualizar el correo.");

                return Ok("Correo actualizado correctamente.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al cambiar el correo.");
            }
        }

        [Authorize]
        [HttpPut("ActualizarUsuario")]// Definiendo que este método responde a solicitudes PUT
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Indicando que este método puede retornar un estado 404 Not Found
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error

        public async Task<IActionResult> ActualizarUsuario([FromBody] ActualizarPerfilRequest usuario)
        {
            try
            {
                // Obtener el usuario existente
                var usuarioExistente = await _UsuariosRepository.ObtenerUsuario(usuario.IdUsuario);
                if (usuarioExistente == null)
                    return NotFound("Usuario no encontrado.");

                // Crear objeto Usuarios para actualizar
                var usuarioActualizado = new Usuarios
                {
                    IdUsuario = usuario.IdUsuario,
                    IdRol = usuario.IdRol ?? usuarioExistente.IdRol, // Usar nuevo rol si se proporciona, sino mantener el existente
                    NombreUsuarios = usuario.NombreUsuarios,
                    NombreCompleto = usuario.NombreCompleto,
                    Correo = usuario.Correo,
                    Contrasena = !string.IsNullOrWhiteSpace(usuario.Contrasena) ? usuario.Contrasena : string.Empty, // Usar nueva contraseña si se proporciona
                    EstadoCuenta = usuario.EstadoCuenta,
                    Telefono = usuario.Telefono
                };

                var Resultado = await _UsuariosRepository.ActualizarUsuario(usuarioActualizado);
                if (!Resultado)
                {
                    return BadRequest("No se puede Actualizar Usuario");
                }
                return Ok("Usuario Actualizado Correctamente");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al Actualizar Usuario");
            }
        }
        [Authorize]
        [HttpDelete("EliminarUsuario")]// Definiendo que este método responde a solicitudes DELETE
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Indicando que este método puede retornar un estado 404 Not Found
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error

        public async Task<IActionResult> EliminarUsuario(Guid ID)
        {
            try
            {
                var Resultado = await _UsuariosRepository.EliminarUsuario(ID);
                if (!Resultado)
                {
                    return BadRequest("No se Pudo Eliminar Al Usuario");
                }
                return Ok("Usuario Eliminado Correctamente");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al eliminar  Usuario.");
            }
        }

        /// <summary>El rol Usuario solo puede actualizar su propio perfil; no puede cambiar su rol.</summary>
        [Authorize]
        [HttpPut("ActualizarMiPerfil")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ActualizarMiPerfil([FromBody] ActualizarPerfilRequest perfilRequest)
        {
            try
            {
                var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(idStr) || !Guid.TryParse(idStr, out var idClaim))
                    return Unauthorized();

                if (perfilRequest.IdUsuario != idClaim)
                    return Forbid();

                var existente = await _UsuariosRepository.ObtenerUsuario(perfilRequest.IdUsuario);
                if (existente == null)
                    return NotFound("Usuario no encontrado.");

                if (!string.Equals(existente.Correo, User.Identity?.Name, StringComparison.OrdinalIgnoreCase))
                    return Forbid();

                // Actualizar solo los campos permitidos
                existente.NombreUsuarios = perfilRequest.NombreUsuarios;
                existente.NombreCompleto = perfilRequest.NombreCompleto;
                existente.Telefono = perfilRequest.Telefono;
                existente.EstadoCuenta = perfilRequest.EstadoCuenta;

                // Crear un objeto Usuarios para pasar al repositorio
                var usuarioActualizado = new Usuarios
                {
                    IdUsuario = existente.IdUsuario,
                    IdRol = existente.IdRol,
                    NombreUsuarios = existente.NombreUsuarios,
                    NombreCompleto = existente.NombreCompleto,
                    Correo = existente.Correo,
                    Contrasena = string.Empty, // Pasar vacío para NO actualizar la contraseña
                    EstadoCuenta = existente.EstadoCuenta,
                    Telefono = existente.Telefono
                };

                var resultado = await _UsuariosRepository.ActualizarUsuario(usuarioActualizado);
                if (!resultado)
                    return BadRequest("No se puede actualizar el perfil.");
                return Ok("Perfil actualizado correctamente.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al actualizar el perfil.");
            }
        }
    }
}

public class ActualizarPerfilRequest
{
    public Guid IdUsuario { get; set; }
    public string NombreUsuarios { get; set; } = string.Empty;
    public string NombreCompleto { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string EstadoCuenta { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public string? Contrasena { get; set; } // Opcional - solo si se quiere cambiar
    public Guid? IdRol { get; set; } // Opcional - solo si se quiere cambiar el rol
}

public class CambiarContrasenaRequest
{
    public string NuevaContrasena { get; set; } = string.Empty;
}

public class CambiarContrasenaConVerificacionRequest
{
    public string ContrasenaActual { get; set; } = string.Empty;
    public string NuevaContrasena { get; set; } = string.Empty;
}

public class CambiarNombreRequest
{
    public string NuevoNombre { get; set; } = string.Empty;
    public string Contrasena { get; set; } = string.Empty;
}

public class CambiarCorreoRequest
{
    public string NuevoCorreo { get; set; } = string.Empty;
    public string Contrasena { get; set; } = string.Empty;
}
