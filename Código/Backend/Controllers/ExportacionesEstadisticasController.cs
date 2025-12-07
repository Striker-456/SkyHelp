using Microservicios;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Repositories;
using SkyHelp.Repositories.Interfaces;
namespace SkyHelp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExportacionesEstadisticasController : ControllerBase
    {
        private readonly IExportacionesEstadisticasRepository _exportacionesRepository;
        public ExportacionesEstadisticasController(IExportacionesEstadisticasRepository exportacionesRepository)
        {
            _exportacionesRepository = exportacionesRepository;
        }
        // OBTENER TODOS
        [HttpGet("ObtenerExportacionesEstadisticas")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerExportacionesEstadisticas()
        {
            try
            {
                var lista = await _exportacionesRepository.ObtenerExportacionesEstadisticas();
                if (lista == null || !lista.Any())
                {
                    return NotFound("No se encontraron exportaciones de estadísticas.");
                }
                return Ok(lista);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,"Error al obtener las exportaciones de estadísticas.");
            }
        }
        // OBTENER POR ID
        [HttpGet("ObtenerExportacionEstadisticaPorId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerExportacionEstadisticaPorId(Guid id)
        {
            try
            {
                var exportacion = await _exportacionesRepository.ObtenerExportacionEstadisticaPorId(id);
                if (exportacion == null)
                {
                    return NotFound("Exportación estadística no encontrada.");
                }
                return Ok(exportacion);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,"Error al obtener la exportación de estadística.");
            }
        }
        // CREAR
        [HttpPost("CrearExportacionEstadistica")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CrearExportacionEstadistica([FromBody] ExportacionesEstadisticas exportacion)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var resultado = await _exportacionesRepository.CrearExportacionEstadistica(exportacion);
                if (!resultado)
                {
                    return BadRequest("No se pudo crear la exportación estadística.");
                }
                return Ok("Exportación estadística creada exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,"Error al crear la exportación de estadística.");
            }
        }
        // ACTUALIZAR
        [HttpPut("ActualizarExportacionEstadistica")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ActualizarExportacionEstadistica([FromBody] ExportacionesEstadisticas exportacion)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var resultado = await _exportacionesRepository.ActualizarExportacionEstadistica(exportacion);
                if (!resultado)
                {
                    return NotFound("No se pudo actualizar la exportación estadística.");
                }
                return Ok("Exportación estadística actualizada exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,"Error al actualizar la exportación de estadística.");
            }
        }
        // ELIMINAR
        [HttpDelete("EliminarExportacionEstadistica")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EliminarExportacionEstadistica(Guid id)
        {
            try
            {
                var resultado = await _exportacionesRepository.EliminarExportacionEstadistica(id);

                if (!resultado)
                {
                    return NotFound("No se pudo eliminar la exportación estadística.");
                }
                return Ok("Exportación estadística eliminada exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,"Error al eliminar la exportación de estadística.");
            }
        }
    }
}
