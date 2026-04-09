using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Authorization;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;
using System.Security.Claims;

namespace SkyHelp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly ITicketsRepository _ticketsRepository;
        private readonly ITecnicosRepository _tecnicosRepository;

        public TicketsController(
            ITicketsRepository ticketsRepository,
            ITecnicosRepository tecnicosRepository)
        {
            _ticketsRepository = ticketsRepository;
            _tecnicosRepository = tecnicosRepository;
        }

        [Authorize(Roles = RoleNames.Administrador)]
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

        [Authorize(Roles = RoleNames.Tecnico)]
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

        [Authorize(Roles = RoleNames.Usuario)]
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

        [Authorize(Roles = $"{RoleNames.Administrador},{RoleNames.Tecnico},{RoleNames.Usuario}")]
        [HttpGet("ObtenerPorId")]
        public async Task<IActionResult> ObtenerTicketPorId(Guid Id)
        {
            try
            {
                var ticket = await _ticketsRepository.ObtenerTicketPorId(Id);
                if (ticket == null)
                    return NotFound("Ticket no encontrado.");

                if (User.IsInRole(RoleNames.Usuario) && !User.IsInRole(RoleNames.Administrador))
                {
                    var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    if (string.IsNullOrEmpty(idStr) || !Guid.TryParse(idStr, out var idUsuario) || ticket.IdUsuario != idUsuario)
                        return Forbid();
                }

                if (User.IsInRole(RoleNames.Tecnico) && !User.IsInRole(RoleNames.Administrador))
                {
                    var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    if (string.IsNullOrEmpty(idStr) || !Guid.TryParse(idStr, out var idUsuario))
                        return Unauthorized();
                    var tecnico = await _tecnicosRepository.ObtenerTecnicoPorIdUsuario(idUsuario);
                    if (tecnico == null || ticket.IdTecnico != tecnico.IdTecnico)
                        return Forbid();
                }

                return Ok(ticket);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener el ticket.");
            }
        }

        [Authorize(Roles = $"{RoleNames.Administrador},{RoleNames.Usuario}")]
        [HttpPost("CrearTicket")]
        public async Task<IActionResult> CrearTicket([FromBody] Tickets ticket)
        {
            try
            {
                if (User.IsInRole(RoleNames.Usuario) && !User.IsInRole(RoleNames.Administrador))
                {
                    var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    if (string.IsNullOrEmpty(idStr) || !Guid.TryParse(idStr, out var idUsuario))
                        return Unauthorized();
                    ticket.IdUsuario = idUsuario;
                }

                var resultado = await _ticketsRepository.CrearTicket(ticket);
                if (!resultado)
                    return BadRequest("No se pudo crear el ticket.");
                return Ok("Ticket creado exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al crear el ticket.");
            }
        }

        [Authorize(Roles = $"{RoleNames.Administrador},{RoleNames.Tecnico},{RoleNames.Usuario}")]
        [HttpPut("ActualizarTicket")]
        public async Task<IActionResult> ActualizarTicket([FromBody] Tickets ticket)
        {
            try
            {
                if (ticket == null || ticket.IdTicket == Guid.Empty)
                    return BadRequest("El ticket no es válido o falta el ID.");

                if (User.IsInRole(RoleNames.Usuario) && !User.IsInRole(RoleNames.Administrador))
                {
                    var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    if (string.IsNullOrEmpty(idStr) || !Guid.TryParse(idStr, out var idUsuario))
                        return Unauthorized();
                    var existente = await _ticketsRepository.ObtenerTicketPorId(ticket.IdTicket);
                    if (existente == null || existente.IdUsuario != idUsuario)
                        return Forbid();
                }
                else if (User.IsInRole(RoleNames.Tecnico) && !User.IsInRole(RoleNames.Administrador))
                {
                    var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    if (string.IsNullOrEmpty(idStr) || !Guid.TryParse(idStr, out var idUsuario))
                        return Unauthorized();
                    var tecnico = await _tecnicosRepository.ObtenerTecnicoPorIdUsuario(idUsuario);
                    var existente = await _ticketsRepository.ObtenerTicketPorId(ticket.IdTicket);
                    if (tecnico == null || existente == null || existente.IdTecnico != tecnico.IdTecnico)
                        return Forbid();
                }

                var resultado = await _ticketsRepository.ActualizarTicket(ticket);
                if (!resultado)
                    return StatusCode(StatusCodes.Status500InternalServerError, "No se pudo actualizar el ticket.");
                
                return Ok("Ticket actualizado exitosamente.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        [Authorize(Roles = RoleNames.Tecnico)]
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

        [Authorize(Roles = RoleNames.Administrador)]
        [HttpDelete("EliminarTicket")]
        public async Task<IActionResult> EliminarTicket(Guid Id)
        {
            try
            {
                var resultado = await _ticketsRepository.EliminarTicket(Id);
                if (!resultado)
                    return NotFound("Ticket no encontrado o no se pudo eliminar.");
                return Ok("Ticket eliminado exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al eliminar el ticket.");
            }
        }
    }

    public class ComentarioTicketRequest
    {
        public Guid IdTicket { get; set; }
        public string Texto { get; set; } = "";
    }
}
