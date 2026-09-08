using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Authorization;
using SkyHelp.Repositories.Interfaces;
using System.Security.Claims;

namespace SkyHelp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class NotificacionesController : ControllerBase
    {
        private readonly INotificacionesRepository _notificacionesRepository;
        public NotificacionesController(INotificacionesRepository notificacionesRepository)
        {
            _notificacionesRepository = notificacionesRepository;
        }

        private Guid ObtenerIdActor()
        {
            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(idStr, out var id) ? id : Guid.Empty;
        }

        private bool EsPropioOAdmin(Guid idUsuarioDelRecurso) =>
            User.IsInRole(RoleNames.Administrador) || idUsuarioDelRecurso == ObtenerIdActor();
        // Obtener todas las notificaciones (todas las de todos los usuarios: solo admin)
        [Authorize(Roles = RoleNames.Administrador)]
        [HttpGet("ObtenerNotificaciones")]
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Indicando que este método puede retornar un estado 404 Not Found
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error

        public async Task<IActionResult> ObtenerNotificaciones()
        {
            try
            {
                var notificaciones = await _notificacionesRepository.ObtenerNotificaciones();
                if (notificaciones == null || !notificaciones.Any())
                {
                    return NotFound("No se encontraron notificaciones.");
                }
                return Ok(notificaciones);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener notificaciones.");
            }
        }

        

        // Obtener notificaciones por Usuario

        [HttpGet("ObtenerPorUsuario")]
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Indicando que este método puede retornar un estado 404 Not Found
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error
        public async Task<IActionResult> ObtenerPorUsuario(Guid idUsuario)
        {
            try
            {
                if (!EsPropioOAdmin(idUsuario))
                    return Forbid();

                var notificaciones = await _notificacionesRepository.ObtenerPorUsuario(idUsuario);
                if (notificaciones == null || !notificaciones.Any())
                {
                    return NotFound("No se encontraron notificaciones para el usuario especificado.");
                }
                return Ok(notificaciones);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener notificaciones del usuario.");
            }
        }

        // Obtener notificación por ID
        [HttpGet("ObtenerNotificacionesPorId")]
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Indicando que este método puede retornar un estado 404 Not Found
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error

        public async Task<IActionResult> ObtenerNotificacionesPorId(Guid id)
        {
            try
            {
                var notificacion = await _notificacionesRepository.ObtenerNotificacionesPorId(id);
                if (notificacion == null)
                {
                    return NotFound("Notificación no encontrada.");
                }
                if (!EsPropioOAdmin(notificacion.IdUsuario))
                    return Forbid();
                return Ok(notificacion);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener la notificación.");
            }
        }

        // Crear notificación
        [HttpPost("CrearNotificacion")]
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Indicando que este método puede retornar un estado 404 Not Found
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error

        public async Task<IActionResult> CrearNotificacion([FromBody] Notificaciones notificacion)
        {
            try
            {
                // Un usuario no-admin solo puede crear notificaciones para sí mismo, nunca a nombre de otro.
                if (!User.IsInRole(RoleNames.Administrador))
                    notificacion.IdUsuario = ObtenerIdActor();

                var resultado = await _notificacionesRepository.CrearNotificacion(notificacion);
                if (!resultado)
                {
                    return BadRequest("No se puede crear la notificación.");
                }
                return Ok("Notificación creada correctamente.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al crear la notificación.");
            }
        }


        // Eliminar notificación
        [HttpDelete("EliminarNotificacion")]
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Indicando que este método puede retornar un estado 404 Not Found
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error
        public async Task<IActionResult> EliminarNotificacion(Guid id)
        {
            try
            {
                var existente = await _notificacionesRepository.ObtenerNotificacionesPorId(id);
                if (existente == null)
                    return NotFound("Notificación no encontrada.");
                if (!EsPropioOAdmin(existente.IdUsuario))
                    return Forbid();

                var resultado = await _notificacionesRepository.EliminarNotificacion(id);
                if (!resultado)
                {
                    return NotFound("Notificación no encontrada.");
                }
                return Ok("Notificación eliminada correctamente.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al eliminar la notificación.");
            }
        }

    }
}

