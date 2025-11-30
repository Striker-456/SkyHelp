using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ReportesController : ControllerBase
    {
        private readonly IReportesRepository _ReportesRepository;

        public ReportesController(IReportesRepository ReportesRepository)
        {
            _ReportesRepository = ReportesRepository;
        }

        // OBTENER TODOS
        [HttpGet("ObtenerReportes")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerReportes()
        {
            try
            {
                var Reportes = await _ReportesRepository.ObtenerReportes();
                if (Reportes == null || !Reportes.Any())
                {
                    return NotFound("No se encontraron reportes.");
                }
                return Ok(Reportes);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al obtener los reportes.");
            }

        }

        // OBTENER POR ID
        [HttpGet("ObtenerReportePorID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> ObtenerReportePorId(Guid ID)
        {
            try
            {
                var reporte = await _ReportesRepository.ObtenerReportesPorId(ID);
                if (reporte == null)
                {
                    return NotFound("Reporte no encontrado.");
                }
                return Ok(reporte);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al obtener el reporte.");
            }
        }

        // CREAR
        [HttpPost("CrearReporte")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> CrearReporte([FromBody] Reportes reporte)
        {
            try
            {
                var resultado = await _ReportesRepository.CrearReporte(reporte);
                if (!resultado)
                {
                    return BadRequest("No se pudo crear el reporte.");
                }
                return Ok("Reporte creado exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al crear el reporte.");
            }
        }

        // ACTUALIZAR
        [HttpPut("ActualizarReporte")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> ActualizarReporte([FromBody] Reportes reporte)
        {
            try
            {
                var resultado = await _ReportesRepository.ActualizarReporte(reporte);
                if (!resultado)
                {
                    return BadRequest("No se pudo actualizar el reporte.");
                }
                return Ok("Reporte actualizado exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al actualizar el reporte.");
            }
        }

        // ELIMINAR
        [HttpDelete("EliminarReporte")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> EliminarReporte(Guid ID)
        {
            try
            {
                var resultado = await _ReportesRepository.EliminarReporte(ID);
                if (!resultado)
                {
                    return BadRequest("No se pudo eliminar el reporte.");
                }
                return Ok("Reporte eliminado exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al eliminar el reporte.");
            }
        }
    }
}
