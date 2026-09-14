using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

                var resultado = (lista ?? new List<Tecnicos>()).Select(t => new {
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
    }
}
