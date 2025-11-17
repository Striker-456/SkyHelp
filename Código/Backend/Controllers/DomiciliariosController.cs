using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microservicios;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Controllers
{
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
        [HttpGet("ObtenerDomiciliarios")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerDomiciliarios()
        {
            try
            {
                var lista = await _domiciliariosRepository.ObtenerDomiciliarios();

                if (lista == null || !lista.Any())
                {
                    return NotFound("No se encontraron domiciliarios.");
                }

                return Ok(lista);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener los domiciliarios.");
            }
        }

        // OBTENER POR ID
        [HttpGet("ObtenerDomiciliarioPorID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerDomiciliarioPorID(Guid id)
        {
            try
            {
                var domiciliario = await _domiciliariosRepository.ObtenerDomiciliariosPorID(id);

                if (domiciliario == null)
                {
                    return NotFound("Domiciliario no encontrado.");
                }

                return Ok(domiciliario);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener el domiciliario.");
            }
        }

        // CREAR
        [HttpPost("CrearDomiciliario")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CrearDomiciliario([FromBody] Domiciliarios domiciliario)
        {
            try
            {
                var resultado = await _domiciliariosRepository.CrearDomiciliario(domiciliario);

                if (!resultado)
                {
                    return BadRequest("No se pudo crear el domiciliario.");
                }

                return Ok("Domiciliario creado exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al crear el domiciliario.");
            }
        }

        // ACTUALIZAR
        [HttpPut("ActualizarDomiciliario")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ActualizarDomiciliario([FromBody] Domiciliarios domiciliario)
        {
            try
            {
                var resultado = await _domiciliariosRepository.ActualizarDomiciliario(domiciliario);

                if (!resultado)
                {
                    return NotFound("No se pudo actualizar el domiciliario.");
                }

                return Ok("Domiciliario actualizado exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al actualizar el domiciliario.");
            }
        }

        // ELIMINAR
 
        [HttpDelete("EliminarDomiciliario")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EliminarDomiciliario(Guid id)
        {
            try
            {
                var resultado = await _domiciliariosRepository.EliminarDomiciliario(id);

                if (!resultado)
                {
                    return NotFound("No se pudo eliminar el domiciliario.");
                }

                return Ok("Domiciliario eliminado exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al eliminar el domiciliario.");
            }
        }
    }
}
