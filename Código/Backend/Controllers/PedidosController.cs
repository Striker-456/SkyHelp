using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Repositories;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PedidosController : ControllerBase
    {
        private readonly IPedidosRepository _PedidosRepository;

        public PedidosController(IPedidosRepository pedidosRepository)
        {
            _PedidosRepository = pedidosRepository;
        }

        // OBTENER TODOS
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

        // Obtener por ID
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
                return Ok(Pedido);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al obtener el Pedido.");
            }
        }

        // Crear Pedido
        [HttpPost("CrearPedido")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> CrearPedido([FromBody] Pedidos pedido)
        {
            try
            {
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

        // Actualizar Pedido
        [HttpPut("ActualizarPedido")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> ActualizarPedido([FromBody] Pedidos pedido)
        {
            try
            {
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

        // Eliminar Pedido
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
