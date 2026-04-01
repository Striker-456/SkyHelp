using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SkyHelp;
using SkyHelp.Authorization;
using SkyHelp.Repositories.Interfaces;
using SkyHelp.Repositories.Interfaces.SkyHelp.Repositories.Interfaces;
using System.Security.Claims;

namespace SkyHelp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidosController : ControllerBase
    {
        private readonly IPedidosRepository _PedidosRepository;
        private readonly IDomiciliariosRepository _domiciliariosRepository;

        public PedidosController(IPedidosRepository pedidosRepository, IDomiciliariosRepository domiciliariosRepository)
        {
            _PedidosRepository = pedidosRepository;
            _domiciliariosRepository = domiciliariosRepository;
        }

        [Authorize(Roles = RoleNames.Administrador)]
        [HttpGet("ObtenerPedidos")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerPedidos()
        {
            try
            {
                var pedidos = await _PedidosRepository.ObtenerPedidos();
                if (pedidos == null || !pedidos.Any())
                {
                    return NotFound("No se encontraron pedidos.");
                }
                return Ok(pedidos);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener los pedidos.");
            }
        }

        [Authorize(Roles = RoleNames.Domiciliario)]
        [HttpGet("ObtenerPedidosAsignadosDomi")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerPedidosAsignadosDomi()
        {
            try
            {
                var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(idStr) || !Guid.TryParse(idStr, out var idUsuario))
                    return Unauthorized();

                var domi = await _domiciliariosRepository.ObtenerDomiciliarioPorIdUsuario(idUsuario);
                if (domi == null)
                    return NotFound("No hay registro de domiciliario vinculado a este usuario.");

                var pedidos = await _PedidosRepository.ObtenerPedidosPorDomiciliario(domi.IdDomiciliario);
                return Ok(pedidos);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener los pedidos asignados.");
            }
        }

        [Authorize(Roles = $"{RoleNames.Administrador},{RoleNames.Domiciliario}")]
        [HttpGet("ObtenerPorId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerPedidosPorId(Guid Id)
        {
            try
            {
                var Pedido = await _PedidosRepository.ObtenerPedidoPorId(Id);
                if (Pedido == null)
                {
                    return NotFound("Pedido no encontrado.");
                }

                if (User.IsInRole(RoleNames.Domiciliario) && !User.IsInRole(RoleNames.Administrador))
                {
                    var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    if (string.IsNullOrEmpty(idStr) || !Guid.TryParse(idStr, out var idUsuario))
                        return Unauthorized();
                    var domi = await _domiciliariosRepository.ObtenerDomiciliarioPorIdUsuario(idUsuario);
                    if (domi == null || Pedido.IdDomiciliario != domi.IdDomiciliario)
                        return Forbid();
                }

                return Ok(Pedido);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al obtener el Pedido.");
            }
        }

        [Authorize(Roles = $"{RoleNames.Administrador},{RoleNames.Usuario}")]
        [HttpPost("CrearPedido")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CrearPedido([FromBody] Pedidos pedido)
        {
            try
            {
                if (User.IsInRole(RoleNames.Usuario) && !User.IsInRole(RoleNames.Administrador))
                {
                    var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    if (string.IsNullOrEmpty(idStr) || !Guid.TryParse(idStr, out var idUsuario))
                        return Unauthorized();
                    pedido.IdUsuario = idUsuario;
                }

                var resultado = await _PedidosRepository.CrearPedido(pedido);
                if (!resultado)
                {
                    return BadRequest("No se puede crear el pedido.");
                }
                return Ok("Pedido Creado");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al crear el pedido.");
            }
        }

        [Authorize(Roles = $"{RoleNames.Administrador},{RoleNames.Domiciliario}")]
        [HttpPut("ActualizarPedido")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ActualizarPedido([FromBody] Pedidos pedido)
        {
            try
            {
                if (User.IsInRole(RoleNames.Domiciliario) && !User.IsInRole(RoleNames.Administrador))
                {
                    var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    if (string.IsNullOrEmpty(idStr) || !Guid.TryParse(idStr, out var idUsuario))
                        return Unauthorized();
                    var domi = await _domiciliariosRepository.ObtenerDomiciliarioPorIdUsuario(idUsuario);
                    var existente = await _PedidosRepository.ObtenerPedidoPorId(pedido.IdPedido);
                    if (domi == null || existente == null || existente.IdDomiciliario != domi.IdDomiciliario)
                        return Forbid();
                }

                var resultado = await _PedidosRepository.ActualizarPedido(pedido);
                if (!resultado)
                {
                    return BadRequest("No se puede actualizar el pedido.");
                }
                return Ok("Pedido Actualizado");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al actualizar el pedido.");
            }
        }

        [Authorize(Roles = RoleNames.Administrador)]
        [HttpDelete("EliminarPedido")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EliminarPedido(Guid Id)
        {
            try
            {
                var resultado = await _PedidosRepository.EliminarPedido(Id);
                if (!resultado)
                {
                    return BadRequest("No se puede eliminar el pedido.");
                }
                return Ok("Pedido Eliminado");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al eliminar el pedido.");
            }
        }
    }
}
