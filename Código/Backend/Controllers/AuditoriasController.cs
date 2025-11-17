using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditoriasController : ControllerBase
    {
        private readonly IAuditoriaRepository _AuditoriaRepository;
        public AuditoriasController(IAuditoriaRepository auditoriaRepository)
        {
            _AuditoriaRepository = auditoriaRepository;
        }

        [HttpGet("ObtenerAuditorias")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerAuditorias()
        {
            try
            {
                var auditorias = await _AuditoriaRepository.ObtenerAuditorias();
                if (auditorias == null || !auditorias.Any())
                {
                    return NotFound("No se encontraron auditorias.");
                }
                return Ok(auditorias);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener Auditorias.");
            }
        }

        [HttpGet("ObtenerAuditoriaPorID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> ObtenerAuditoriaPorId(Guid ID)
        {
            try
            {
                var auditoria = await _AuditoriaRepository.ObtenerAuditoriaPorID(ID);
                if (auditoria == null)
                {
                    return NotFound("Auditoria no encontrada.");
                }
                return Ok(auditoria);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener la auditoria.");
            }
        }

        [HttpPost("CrearAuditoria")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]


        public async Task<IActionResult> CrearAuditoria([FromBody] Auditoria auditoria)
        {
            try
            {
                var resultado = await _AuditoriaRepository.CrearAuditoria(auditoria);
                if (!resultado)
                {
                    return BadRequest("No se puede crear la auditoria.");
                }
                return Ok("auditoria Creada");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al crear la auditoria.");
            }
        }

        [HttpPut("ActualizarAuditoria")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> ActualizarAuditoria([FromBody] Auditoria auditoria)
        {
            try
            {
                var resultado = await _AuditoriaRepository.ActualizarAuditoria(auditoria);
                if (!resultado)
                {
                    return NotFound("No se pudo actualizar la auditoria.");
                }
                return Ok("Auditoria actualizada exitosamente.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al actualizar la auditoria.");
            }
        }

        [HttpDelete("EliminarAuditoria")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> EliminarAuditoria(Guid ID)
        {
            try
            {
                var resultado = await _AuditoriaRepository.EliminarAuditoria(ID);
                if (!resultado)
                {
                    return NotFound("No se pudo eliminar la auditoria.");
                }
                return Ok("Auditoria eliminada exitosamente.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al eliminar la auditoria.");
            }
        }
    }
}
