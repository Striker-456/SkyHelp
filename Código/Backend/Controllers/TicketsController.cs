using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Authorization;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;
using SkyHelp.Services.Interfaces;
using System.Security.Claims;

namespace SkyHelp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly ITicketsRepository _ticketsRepository;
        private readonly ITecnicosRepository _tecnicosRepository;
        private readonly IAuditoriaService _auditoriaService;

        public TicketsController(
            ITicketsRepository ticketsRepository,
            ITecnicosRepository tecnicosRepository,
            IAuditoriaService auditoriaService)
        {
            _ticketsRepository = ticketsRepository;
            _tecnicosRepository = tecnicosRepository;
            _auditoriaService = auditoriaService;
        }

        private string? ObtenerIp() => HttpContext.Connection.RemoteIpAddress?.ToString();

        private Guid ObtenerIdActor()
        {
            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(idStr, out var id) ? id : Guid.Empty;
        }

        [Authorize]
        [HttpGet("ObtenerTickets")]
        public async Task<IActionResult> ObtenerTickets()
        {
            try
            {
                var lista = await _ticketsRepository.ObtenerTickets();
                if (lista == null || !lista.Any())
                    return NotFound("No se encontraron tickets.");
                return Ok(lista);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener los tickets.");
            }
        }

        [Authorize]
        [HttpGet("ObtenerTicketsAsignadosTecnico")]
        public async Task<IActionResult> ObtenerTicketsAsignadosTecnico()
        {
            try
            {
                var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(idStr) || !Guid.TryParse(idStr, out var idUsuario))
                    return Unauthorized();

                var tecnico = await _tecnicosRepository.ObtenerTecnicoPorIdUsuario(idUsuario);
                if (tecnico == null)
                    return NotFound("No hay registro de técnico vinculado a este usuario.");

                var lista = await _ticketsRepository.ObtenerTicketsPorTecnico(tecnico.IdTecnico);
                return Ok(lista);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener los tickets asignados.");
            }
        }

        [Authorize]
        [HttpGet("ObtenerTicketsAsignadosDomiciliario")]
        public async Task<IActionResult> ObtenerTicketsAsignadosDomiciliario(Guid idDomiciliario)
        {
            try
            {
                var lista = await _ticketsRepository.ObtenerTicketsPorDomiciliario(idDomiciliario);
                return Ok(lista);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener los tickets asignados.");
            }
        }

        [Authorize]
        [HttpGet("ObtenerMisTickets")]
        public async Task<IActionResult> ObtenerMisTickets()
        {
            try
            {
                var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(idStr) || !Guid.TryParse(idStr, out var idUsuario))
                    return Unauthorized();

                var lista = await _ticketsRepository.ObtenerTicketsPorUsuario(idUsuario);
                return Ok(lista);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener sus tickets.");
            }
        }

        [Authorize]
        [HttpGet("ObtenerPorId")]
        public async Task<IActionResult> ObtenerTicketPorId(Guid Id)
        {
            try
            {
                var ticket = await _ticketsRepository.ObtenerTicketPorId(Id);
                if (ticket == null)
                    return NotFound("Ticket no encontrado.");

                return Ok(ticket);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener el ticket.");
            }
        }

        [Authorize]
        [HttpPost("CrearTicket")]
        public async Task<IActionResult> CrearTicket([FromBody] Tickets ticket)
        {
            try
            {
                var resultado = await _ticketsRepository.CrearTicket(ticket);
                if (!resultado)
                    return BadRequest("No se pudo crear el ticket.");
                await _auditoriaService.RegistrarAsync(ObtenerIdActor(), "Crear", "Tickets", ticket.IdTicket,
                    $"Ticket #{ticket.NumeroTicket} creado.", ObtenerIp());
                return Ok("Ticket creado exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al crear el ticket.");
            }
        }

        [Authorize]
        [HttpPut("ActualizarTicket")]
        public async Task<IActionResult> ActualizarTicket([FromBody] ActualizarDomiciliarioTicketRequest request)
        {
            try
            {
                if (request == null || request.IdTicket == Guid.Empty)
                    return BadRequest("El ticket no es válido o falta el ID.");

                var resultado = await _ticketsRepository.ActualizarDomiciliarioTicket(request.IdTicket, request.IdDomiciliario);
                if (!resultado)
                    return StatusCode(StatusCodes.Status500InternalServerError, "No se pudo actualizar el domiciliario del ticket.");

                await _auditoriaService.RegistrarAsync(ObtenerIdActor(), "Actualizar", "Tickets", request.IdTicket,
                    "Domiciliario del ticket actualizado.", ObtenerIp());
                return Ok("Domiciliario del ticket actualizado exitosamente.");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error en ActualizarTicket: {ex.Message}");
                System.Diagnostics.Debug.WriteLine($"Stack: {ex.StackTrace}");
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        [Authorize]
        [HttpPut("ActualizarEstadoTicket")]
        public async Task<IActionResult> ActualizarEstadoTicket([FromBody] ActualizarEstadoTicketRequest request)
        {
            try
            {
                if (request == null || request.IdTicket == Guid.Empty)
                    return BadRequest("El ticket no es válido o falta el ID.");

                if (request.IdEstado == Guid.Empty)
                    return BadRequest("El estado no es válido.");

                // Usar SQL directo para actualizar solo el estado
                var resultado = await _ticketsRepository.ActualizarEstadoTicket(request.IdTicket, request.IdEstado);
                if (!resultado)
                    return StatusCode(StatusCodes.Status500InternalServerError, "No se pudo actualizar el estado del ticket.");

                await _auditoriaService.RegistrarAsync(ObtenerIdActor(), "Actualizar", "Tickets", request.IdTicket,
                    "Estado del ticket actualizado.", ObtenerIp());
                return Ok("Estado del ticket actualizado exitosamente.");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error en ActualizarEstadoTicket: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        [Authorize]
        [HttpPost("ComentarioTicket")]
        public async Task<IActionResult> ComentarioTicket([FromBody] ComentarioTicketRequest body)
        {
            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(idStr) || !Guid.TryParse(idStr, out var idUsuario))
                return Unauthorized();

            var tecnico = await _tecnicosRepository.ObtenerTecnicoPorIdUsuario(idUsuario);
            var ticket = await _ticketsRepository.ObtenerTicketPorId(body.IdTicket);
            if (tecnico == null || ticket == null || ticket.IdTecnico != tecnico.IdTecnico)
                return Forbid();

            return Ok(new { mensaje = "Comentario aceptado; enlazar persistencia cuando exista el modelo.", texto = body.Texto });
        }

        [Authorize]
        [HttpDelete("EliminarTicket")]
        public async Task<IActionResult> EliminarTicket(Guid Id)
        {
            try
            {
                var resultado = await _ticketsRepository.EliminarTicket(Id);
                if (!resultado)
                    return NotFound("Ticket no encontrado o no se pudo eliminar.");
                await _auditoriaService.RegistrarAsync(ObtenerIdActor(), "Eliminar", "Tickets", Id,
                    "Ticket eliminado.", ObtenerIp());
                return Ok("Ticket eliminado exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al eliminar el ticket.");
            }
        }
    }

    public class ActualizarDomiciliarioTicketRequest
    {
        public Guid IdTicket { get; set; }
        public Guid? IdDomiciliario { get; set; }
    }

    public class ActualizarEstadoTicketRequest
    {
        public Guid IdTicket { get; set; }
        public Guid IdEstado { get; set; }
    }

    public class ComentarioTicketRequest
    {
        public Guid IdTicket { get; set; }
        public string Texto { get; set; } = "";
    }
}
