using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Repositories.Interfaces;

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


        // Obtener notificaciones por Usuario

        [HttpGet("ObtenerPorUsuario")]
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Indicando que este método puede retornar un estado 404 Not Found
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error
        public async Task<IActionResult> ObtenerPorUsuario(Guid idUsuario)
        {
            try
            {
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
                return Ok(notificacion);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener la notificación.");
            }
        }

        // Marcar notificación como leída
        [HttpPost("MarcarComoLeida")]
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Indicando que este método puede retornar un estado 404 Not Found
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error

        public async Task<IActionResult> MarcarComoLeida(Guid id)
        {
            try
            {
                var resultado = await _notificacionesRepository.MarcarComoLeida(id);
                if (!resultado)
                {
                    return NotFound("Notificación no encontrada.");
                }
                return Ok("Notificación marcada como leída.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al marcar la notificación como leída.");
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

