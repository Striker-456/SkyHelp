using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;
using System.Security.Claims;

namespace SkyHelp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DomiciliariosController : ControllerBase
    {
        private readonly IDomiciliariosRepository _domiciliariosRepository;

        public DomiciliariosController(IDomiciliariosRepository domiciliariosRepository)
        {
            _domiciliariosRepository = domiciliariosRepository;
        }

        // OBTENER TODOS
        [Authorize]
        [HttpGet("ObtenerDomiciliarios")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerDomiciliarios()
        {
            try
            {
                var lista = await _domiciliariosRepository.ObtenerDomiciliarios();
                return Ok(lista ?? new List<Domiciliarios>());
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener los domiciliarios.");
            }
        }

        // OBTENER DOMICILIARIO ACTUAL (del usuario autenticado)
        [Authorize]
        [HttpGet("ObtenerDomiciliarioActual")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerDomiciliarioActual()
        {
            try
            {
                // Obtener el ID del usuario autenticado
                var idUsuarioStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(idUsuarioStr) || !Guid.TryParse(idUsuarioStr, out var idUsuario))
                {
                    return Unauthorized("No se pudo obtener el ID del usuario.");
                }

                // Obtener todos los domiciliarios y buscar el que coincida con el usuario
                var domiciliarios = await _domiciliariosRepository.ObtenerDomiciliarios();
                var domiciliarioActual = domiciliarios?.FirstOrDefault(d => d.IDUsuario == idUsuario);

                if (domiciliarioActual == null)
                {
                    return NotFound("No se encontró un domiciliario asociado a este usuario.");
                }

                return Ok(domiciliarioActual);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener el domiciliario actual.");
            }
        }
    }
}
