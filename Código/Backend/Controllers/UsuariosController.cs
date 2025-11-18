using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;


namespace SkyHelp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]// Definindo a ruta base para o controlador
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuariosRepository _UsuariosRepository;
        public UsuariosController(IUsuariosRepository usuariosRepository)// Constructor de la clase con inyección de dependencia
        {
            _UsuariosRepository = usuariosRepository;// inyección de dependencia del repositorio de usuarios
        }
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


        [HttpGet("ObtenerUsuarios")]// Definiendo que este método responde a solicitudes GET
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Indicando que este método puede retornar un estado 404 Not Found
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error
        public async Task<IActionResult> ObtenerUsuarios()// Método para obtener todos los usuarios
        {
            try
            {
                var usuarios = await _UsuariosRepository.ObtenerUsuarios();// Llamando al método del repositorio para obtener los usuarios
                if (usuarios == null || !usuarios.Any())// Verificando si la lista de usuarios está vacía
                {
                    return NotFound("No se encontraron usuarios.");// Retornando una respuesta HTTP 404 si no se encuentran usuarios
                }
                return Ok(usuarios);// Retornando una respuesta HTTP 200 con la lista de usuarios
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener Usuarios.");// Retornando una respuesta HTTP 500 en caso de error
            }
        }

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
                return Ok(usuario); // Retornando una respuesta HTTP 200 con el usuario encontrado
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener el usuario."); // Retornando una respuesta HTTP 500 en caso de error
            }
        }

        [HttpPost("CrearUsuario")]// Definiendo que este método responde a solicitudes GET
        [AllowAnonymous]
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
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al Insertar Persona");
            }
        }

        [HttpPut("ActualizarUsuario")]// Definiendo que este método responde a solicitudes PUT
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Indicando que este método puede retornar un estado 404 Not Found
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error

        public async Task<IActionResult> ActualizarUsuario([FromBody] Usuarios usuario)
        {
            try
            {
                var Resultado = await _UsuariosRepository.ActualizarUsuario(usuario);
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
    }
}

