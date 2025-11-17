using Microservicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Repositories;

namespace SkyHelp.Controllers
{   
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DomiciliariosController : ControllerBase
    {
        private readonly IDomiciliariosRepository _repositorio;

        public DomiciliariosController(IDomiciliariosRepository repositorio)
        {
            _repositorio = repositorio;
        }

        // OBTENER TODOS LOS DOMICILIARIOS

        [HttpGet("ObtenerDomiciliarios")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerDomiciliarios()
        {
            try
            {
                var domiciliarios = await _repositorio.TodosLosDomiciliariosAsync();
                if (domiciliarios == null || !domiciliarios.Any())
                {
                    return NotFound("No se encontraron domiciliarios.");
                }
                return Ok(domiciliarios);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener los domiciliarios.");
            }
        }

        // OBTENER POR ID
        [HttpGet("ObtenerDomiciliarioPorId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerDomiciliarioPorId(Guid Id)
        {
            try
            {
                var domiciliario = await _repositorio.DomiciliariosIdAsync(Id);

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
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CrearDomiciliario(Domiciliarios domiciliario)
        {
            try
            {
                var creado = await _repositorio.DomiciliariosCreadosAsync(domiciliario);

                if (creado == null)
                {
                    return NotFound("No se pudo crear el domiciliario.");
                }

                return Ok(creado);
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
        public async Task<IActionResult> ActualizarDomiciliario(Domiciliarios domiciliario)
        {
            try
            {
                var actualizado = await _repositorio.ActualizarDomiciliariosAsync(domiciliario);

                if (actualizado == null)
                {
                    return NotFound("No se pudo actualizar el domiciliario.");
                }

                return Ok(actualizado);
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
        public async Task<IActionResult> EliminarDomiciliario(Guid Id)
        {
            try
            {
                var eliminado = await _repositorio.EliminarDomiciliariosAsync(Id);

                if (!eliminado)
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
