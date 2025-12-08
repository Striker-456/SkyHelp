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
    public class TicketsController : ControllerBase
    {
        private readonly ITicketsRepository _ticketsRepository;


        public TicketsController(ITicketsRepository ticketsRepository)
        {
            _ticketsRepository = ticketsRepository;
        }

        // OBTENER TODOS
        [HttpGet("ObtenerTickets")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> ObtenerTickets()
        {
            try
            {
                var lista = await _ticketsRepository.ObtenerTickets();
                if (lista == null || !lista.Any())
                {
                    return NotFound("No se encontraron tickets.");
                }
                return Ok(lista);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener los tickets.");
            }
        }

        // OBTENER POR ID
        [HttpGet("ObtenerPorId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> ObtenerTicketPorId(Guid Id)
        {
            try
            {
                var ticket = await _ticketsRepository.ObtenerTicketPorId(Id);
                if (ticket == null)
                {
                    return NotFound("Ticket no encontrado.");
                }
                return Ok(ticket);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al obtener el ticket.");
            }
        }

        // CREAR
        [HttpPost("CrearTicket")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> CrearTicket([FromBody] Tickets ticket)
        {
            try
            {
                var resultado = await _ticketsRepository.CrearTicket(ticket);
                if (!resultado)
                {
                    return BadRequest("No se pudo crear el ticket.");
                }
                return Ok("Ticket creado exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al crear el ticket.");
            }
        }

        // ACTUALIZAR
        [HttpPut("ActualizarTicket")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> ActualizarTicket([FromBody] Tickets ticket)
        {
            try
            {
                var resultado = await _ticketsRepository.ActualizarTicket(ticket);
                if (!resultado)
                {
                    return NotFound("No se pudo actualizar el ticket.");
                }
                return Ok("Ticket actualizado exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al actualizar el ticket.");
            }
        }

        // ELIMINAR
        [HttpDelete("EliminarTicket")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> EliminarTicket(Guid Id)
        {
            try
            {
                var resultado = await _ticketsRepository.EliminarTicket(Id);
                if (!resultado)
                {
                    return NotFound("Ticket no encontrado o no se pudo eliminar.");
                }
                return Ok("Ticket eliminado exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al eliminar el ticket.");
            }
        }
    }
}
