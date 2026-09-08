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
    public class EvaluacionesController : ControllerBase
    {
        private readonly IEvaluacionesRepository _evaluacionesRepository;

        public EvaluacionesController(IEvaluacionesRepository evaluacionesRepository)
        {
            _evaluacionesRepository = evaluacionesRepository;
        }

        private Guid ObtenerIdActor()
        {
            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(idStr, out var id) ? id : Guid.Empty;
        }

        private bool EsPropioOAdmin(Guid idUsuarioDelRecurso) =>
            User.IsInRole(RoleNames.Administrador) || idUsuarioDelRecurso == ObtenerIdActor();

        // OBTENER TODOS (todas las de todos los usuarios: solo admin)
        [Authorize(Roles = RoleNames.Administrador)]
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
                if (!EsPropioOAdmin(evaluacion.IdUsuario))
                    return Forbid();
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
                // Un usuario no-admin solo puede evaluar a nombre propio, nunca suplantando a otro.
                if (!User.IsInRole(RoleNames.Administrador))
                    evaluacion.IdUsuario = ObtenerIdActor();

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
                var existente = await _evaluacionesRepository.ObtenerEvaluacionPorId(evaluacion.IdEvaluacion);
                if (existente == null)
                    return NotFound("Evaluacion no encontrada.");
                if (!EsPropioOAdmin(existente.IdUsuario))
                    return Forbid();
                // No permitir reasignar la evaluación a otro usuario ni a otro ticket.
                if (!User.IsInRole(RoleNames.Administrador))
                {
                    evaluacion.IdUsuario = existente.IdUsuario;
                    evaluacion.IdTicket = existente.IdTicket;
                }

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
                var existente = await _evaluacionesRepository.ObtenerEvaluacionPorId(ID);
                if (existente == null)
                    return NotFound("Evaluacion no encontrada.");
                if (!EsPropioOAdmin(existente.IdUsuario))
                    return Forbid();

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
