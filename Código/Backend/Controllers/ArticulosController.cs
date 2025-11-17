using SkyHelp.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Repositories;
using SkyHelp.Repositories.Interfaces;
using System.Linq.Expressions;

namespace SkyHelp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticulosController : ControllerBase
    {
        private readonly IArticulosRepository _articulosRepository;

        public ArticulosController(IArticulosRepository articulosRepository)
        {
            _articulosRepository = articulosRepository;
        }

        // OBTENER TODOS
        [HttpGet("ObtenerArticulos")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerArticulos()
        {
            try
            {
                var lista = await _articulosRepository.ObtenerArticulos();

                if (lista == null || !lista.Any())
                {
                    return NotFound("No se encontraron artículos.");
                }

                return Ok(lista);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al obtener los artículos.");
            }
        }

        // OBTENER POR ID
        [HttpGet("ObtenerArticuloPorID")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ObtenerArticuloPorID(Guid id)
        {
            try
            {
                var articulo = await _articulosRepository.ObtenerArticulosPorID(id);

                if (articulo == null)
                {
                    return NotFound("Artículo no encontrado.");
                }

                return Ok(articulo);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al obtener el artículo.");
            }
        }

        // CREAR
        [HttpPost("CrearArticulo")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CrearArticulo([FromBody] Articulos articulo)
        {
            try
            {
                var resultado = await _articulosRepository.CrearArticulo(articulo);

                if (!resultado)
                {
                    return BadRequest("No se pudo crear el artículo.");
                }

                return Ok("Artículo creado exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al crear el artículo.");
            }
        }

        // ACTUALIZAR
        [HttpPut("ActualizarArticulo")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ActualizarArticulo([FromBody] Articulos articulo)
        {
            try
            {
                var resultado = await _articulosRepository.ActualizarArticulo(articulo);

                if (!resultado)
                {
                    return NotFound("No se pudo actualizar el artículo.");
                }

                return Ok("Artículo actualizado exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al actualizar el artículo.");
            }
        }

        // ELIMINAR
        [HttpDelete("EliminarArticulo")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EliminarArticulo(Guid id)
        {
            try
            {
                var resultado = await _articulosRepository.EliminarArticulo(id);

                if (!resultado)
                {
                    return NotFound("No se pudo eliminar el artículo.");
                }

                return Ok("Artículo eliminado exitosamente.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al eliminar el artículo.");
            }
        }
    }
}