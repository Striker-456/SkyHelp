using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EvaluacionesController : ControllerBase
    {
        private readonly IEvaluacionesRepository _evaluacionesRepository;

        public EvaluacionesController(IEvaluacionesRepository evaluacionesRepository)
        {
            _evaluacionesRepository = evaluacionesRepository;
        }

        // OBTENER TODOS
        [HttpGet("ObtenerEvaluaciones")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> ObtenerEvaluaciones()
        {
            try
            {
                var evaluaciones = await _evaluacionesRepository.ObtenerEvaluaciones();
                if (evaluaciones == null || !evaluaciones.Any())
                {
                    return NotFound("No se encontraron evaluaciones.");
                }
                return Ok(evaluaciones);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener evaluaciones.");
            }
        }

        // OBTENER POR ID
        [HttpGet("ObtenerEvaluacionPorId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> ObtenerEvaluacionPorId(Guid Id)
        {
            try
            {
                var evaluacion = await _evaluacionesRepository.ObtenerEvaluacionPorId(Id);
                if (evaluacion == null)
                {
                    return NotFound("Evaluacion no encontrada.");
                }
                return Ok(evaluacion);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener la evaluacion.");
            }
        }

        // Crear Evaluacion
        [HttpPost("CrearEvaluacion")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> CrearEvaluacion([FromBody] Models.Evaluaciones evaluacion)
        {
            try
            {
                var resultado = await _evaluacionesRepository.CrearEvaluacion(evaluacion);
                if (!resultado)
                {
                    return BadRequest("No se puede crear la evaluacion.");
                }
                return Ok("Evaluacion Creada");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al crear la evaluacion.");
            }
        }

        // Actualizar Evaluacion
        [HttpPut("ActualizarEvaluacion")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> ActualizarEvaluacion([FromBody] Models.Evaluaciones evaluacion)
        {
            try
            {
                var resultado = await _evaluacionesRepository.ActualizarEvaluacion(evaluacion);
                if (!resultado)
                {
                    return BadRequest("No se puede actualizar la evaluacion.");
                }
                return Ok("Evaluacion Actualizada");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al actualizar la evaluacion.");
            }
        }

        // Eliminar Evaluacion
        [HttpDelete("EliminarEvaluacion")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> EliminarEvaluacion(Guid ID)
        {
            try
            {
                var resultado = await _evaluacionesRepository.EliminarEvaluacion(ID);
                if (!resultado)
                {
                    return BadRequest("No se puede eliminar la evaluacion.");
                }
                return Ok("Evaluacion Eliminada");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al eliminar la evaluacion.");
            }
        }
    }
}
