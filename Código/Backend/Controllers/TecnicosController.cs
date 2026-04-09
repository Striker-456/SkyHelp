using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Authorization;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TecnicosController : ControllerBase
    {
        private readonly ITecnicosRepository _tecnicosRepository;
        public TecnicosController(ITecnicosRepository tecnicosRepository)
        {
            _tecnicosRepository = tecnicosRepository;
        }
        // OBTENER TODOS
        [Authorize]
        [HttpGet("ObtenerTecnicos")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerTecnicos()
        {
            try
            {
                var lista = await _tecnicosRepository.ObtenerTecnicos();
                if (lista == null || !lista.Any())
                    return NotFound("No se encontraron técnicos.");

                var resultado = lista.Select(t => new {
                    t.IdTecnico,
                    t.IdUsuario,
                    t.FechaRegistro,
                    NombreCompleto = t.Usuario?.NombreCompleto ?? t.Usuario?.NombreUsuarios ?? "",
                    Correo = t.Usuario?.Correo ?? ""
                });
                return Ok(resultado);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener los técnicos.");
            }
        }
        // OBTENER POR ID
        [Authorize(Roles = RoleNames.Administrador)]
        [HttpGet("ObtenerTecnicoPorID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerTecnicoPorID(Guid id)
        {
            try
            {
                var tecnico = await _tecnicosRepository.ObtenerTecnicoPorId(id);
                if (tecnico == null)
                {
                    return NotFound("Técnico no encontrado.");
                }
                return Ok(tecnico);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener el técnico.");
            }
        }
        // CREAR
        [Authorize(Roles = RoleNames.Administrador)]
        [HttpPost("CrearTecnico")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CrearTecnico([FromBody] Tecnicos tecnico)
        {
            try
            {
                var resultado = await _tecnicosRepository.CrearTecnico(tecnico);
                if (!resultado)
                {
                    return BadRequest("No se pudo crear el técnico.");
                }
                return Ok("Técnico creado exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al crear el técnico.");
            }
        }
        // ACTUALIZAR
        [Authorize(Roles = RoleNames.Administrador)]
        [HttpPut("ActualizarTecnico")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ActualizarTecnico([FromBody] Tecnicos tecnico)
        {
            try
            {
                var resultado = await _tecnicosRepository.ActualizarTecnico(tecnico);
                if (!resultado)
                {
                    return NotFound("No se pudo actualizar el técnico.");
                }
                return Ok("Técnico actualizado exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al actualizar el técnico.");
            }
        }
        // ELIMINAR
        [Authorize(Roles = RoleNames.Administrador)]
        [HttpDelete("EliminarTecnico")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EliminarTecnico(Guid id)
        {
            try
            {
                var resultado = await _tecnicosRepository.EliminarTecnico(id);
                if (!resultado)
                {
                    return NotFound("No se pudo eliminar el técnico.");
                }
                return Ok("Técnico eliminado exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al eliminar el técnico.");
            }
        }
    }
}
