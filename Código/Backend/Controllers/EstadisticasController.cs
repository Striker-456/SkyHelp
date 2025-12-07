using Microservicios;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Repositories;
using SkyHelp.Repositories.Interfaces;
namespace SkyHelp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstadisticasController : ControllerBase
    {
        private readonly IEstadisticasRepository _estadisticasRepository;
        public EstadisticasController(IEstadisticasRepository estadisticasRepository)
        {
            _estadisticasRepository = estadisticasRepository;
        }
        // OBTENER TODOS
        [HttpGet("ObtenerEstadisticas")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerEstadisticas()
        {
            try
            {
                var lista = await _estadisticasRepository.ObtenerEstadisticas();

                if (lista == null || !lista.Any())
                {
                    return NotFound("No se encontraron estadísticas.");
                }
                return Ok(lista);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,"Error al obtener las estadísticas.");
            }
        }
        // OBTENER POR ID
        [HttpGet("ObtenerEstadisticaPorId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerEstadisticaPorId(Guid id)
        {
            try
            {
                var estadistica = await _estadisticasRepository.ObtenerEstadisticaPorId(id);
                if (estadistica == null)
                {
                    return NotFound("Estadística no encontrada.");
                }
                return Ok(estadistica);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,"Error al obtener la estadística.");
            }
        }
        // CREAR
        [HttpPost("CrearEstadistica")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CrearEstadistica([FromBody] Estadisticas estadistica)
        {
            try
            {
                var resultado = await _estadisticasRepository.CrearEstadistica(estadistica);
                if (!resultado)
                {
                    return BadRequest("No se pudo crear la estadística.");
                }
                return Ok("Estadística creada exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,"Error al crear la estadística.");
            }
        }
        // ACTUALIZAR
        [HttpPut("ActualizarEstadistica")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ActualizarEstadistica([FromBody] Estadisticas estadistica)
        {
            try
            {
                var resultado = await _estadisticasRepository.ActualizarEstadistica(estadistica);

                if (!resultado)
                {
                    return NotFound("No se pudo actualizar la estadística.");
                }

                return Ok("Estadística actualizada exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,"Error al actualizar la estadística.");
            }
        }
        // ELIMINAR
        [HttpDelete("EliminarEstadistica")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EliminarEstadistica(Guid id)
        {
            try
            {
                var resultado = await _estadisticasRepository.EliminarEstadistica(id);
                if (!resultado)
                {
                    return NotFound("No se pudo eliminar la estadística.");
                }
                return Ok("Estadística eliminada exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,"Error al eliminar la estadística.");
            }
        }
    }
}
