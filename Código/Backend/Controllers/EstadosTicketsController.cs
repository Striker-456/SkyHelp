using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class EstadosTicketsController : ControllerBase
    {
        private readonly IEstadosTicketsRepository _estadosTicketsRepository;
        public EstadosTicketsController(IEstadosTicketsRepository estadosTicketsRepository)
        {
            _estadosTicketsRepository = estadosTicketsRepository;
        }


        // OBTENER TODOS
        [HttpGet("ObtenerEstadosTickets")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> ObtenerEstadosTickets()
        {
            try
            {
                var estadosTickets = await _estadosTicketsRepository.ObtenerEstadosTickets();
                if (estadosTickets == null || !estadosTickets.Any())
                {
                    return NotFound("No se encontraron estados de tickets.");
                }
                return Ok(estadosTickets);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener los estados de tickets.");
            }
        }
    }
}
