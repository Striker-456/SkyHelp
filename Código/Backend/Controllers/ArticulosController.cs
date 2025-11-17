using SkyHelp.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Repositories;
using SkyHelp.Repositories.Interfaces;
using System.Linq.Expressions;

namespace SkyHelp.Controllers
{
    [Route("api/[controller]")]// Definindo a ruta base para o controlador
    [ApiController]
    public class ArticulosController : ControllerBase
    {
        private readonly IArticulosRepository _ArticulosRepository;
        public ArticulosController(IArticulosRepository articulosRepository)// Constructor de la clase con inyección de dependencia
        {
            _ArticulosRepository = articulosRepository;// Inyección de dependencia del repositorio de artículos
        }
        [HttpGet("ObtenerArticulos")]// Definiendo que este método responde a solicitudes GET
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Indicando que este método puede retornar un estado 404 Not Found
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error
        public async Task<IActionResult> ObtenerArticulos()// Método para obtener todos los artículos
        {
            try
            {
                var articulos = await _ArticulosRepository.ObtenerArticulos();// Llamando al método del repositorio para obtener los artículos
                if (articulos == null || !articulos.Any())// Verificando si la lista de artículos está vacía
                {
                    return NotFound("No se encontraron artículos.");// Retornando una respuesta HTTP 404 si no se encuentran artículos
                }
                return Ok(articulos);// Retornando una respuesta HTTP 200 con la lista de artículos
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener Artículos.");// Retornando una respuesta HTTP 500 en caso de error
            }
        }
        [HttpGet("ObtenerArticulosPorID")]// Definiendo que este método responde a solicitudes GET
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Indicando que este método puede retornar un estado 404 Not Found
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error
        public async Task<IActionResult> ObtenerArticulosPorId(Guid id)// Método para obtener un artículo por su ID
        {
            try
            {
                var articulo = await _ArticulosRepository.ObtenerArticulosPorID(id);// Llamando al método del repositorio para obtener el artículo por ID
                if (articulo == null)// Verificando si el artículo no fue encontrado
                {
                    return NotFound("Artículo no encontrado.");// Retornando una respuesta HTTP 404 si no se encuentra el artículo
                }
                return Ok(articulo);// Retornando una respuesta HTTP 200 con el artículo encontrado
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener Artículo.");// Retornando una respuesta HTTP 500 en caso de error
            }
        }
        [HttpPost("CrearArticulo")]// Definiendo que este método responde a solicitudes GET
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Indicando que este método puede retornar un estado 404 Not Found
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error
        public async Task<IActionResult> CrearArticulo(Articulos articulo)// Método para crear un nuevo artículo
        {
            try
            {
                var resultado = await _ArticulosRepository.CrearArticulo(articulo);// Llamando al método del repositorio para crear el artículo
                if (!resultado)// Verificando si la creación del artículo falló
                {
                    return NotFound("No se pudo crear el artículo.");// Retornando una respuesta HTTP 404 si no se pudo crear el artículo
                }
                return Ok("Artículo creado exitosamente.");// Retornando una respuesta HTTP 200 si el artículo fue creado exitosamente
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al crear Artículo.");// Retornando una respuesta HTTP 500 en caso de error
            }
        }
        [HttpPut("ActualizarArticulo")]// Definiendo que este método responde a solicitudes GET
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Indicando que este método puede retornar un estado 404 Not Found
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error
        public async Task<IActionResult> ActualizarArticulo(Articulos articulo)// Método para actualizar un artículo existente
        {
            try
            {
                var resultado = await _ArticulosRepository.ActualizarArticulo(articulo);// Llamando al método del repositorio para actualizar el artículo
                if (!resultado)// Verificando si la actualización del artículo falló
                {
                    return NotFound("No se pudo actualizar el artículo.");// Retornando una respuesta HTTP 404 si no se pudo actualizar el artículo
                }
                return Ok("Artículo actualizado exitosamente.");// Retornando una respuesta HTTP 200 si el artículo fue actualizado exitosamente
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al actualizar Artículo.");// Retornando una respuesta HTTP 500 en caso de error
            }
        }
        [HttpDelete("EliminarArticulo")]// Definiendo que este método responde a solicitudes GET
        [ProducesResponseType(StatusCodes.Status200OK)]// Indicando que este método puede retornar un estado 200 OK
        [ProducesResponseType(StatusCodes.Status404NotFound)]// Indicando que este método puede retornar un estado 404 Not Found
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]// Indicando que este método puede retornar un estado 500 Internal Server Error
        public async Task<IActionResult> EliminarArticulo(Guid id)// Método para eliminar un artículo por su ID
        {
            try
            {
                var resultado = await _ArticulosRepository.EliminarArticulo(id);// Llamando al método del repositorio para eliminar el artículo
                if (!resultado)// Verificando si la eliminación del artículo falló
                {
                    return NotFound("No se pudo eliminar el artículo.");// Retornando una respuesta HTTP 404 si no se pudo eliminar el artículo
                }
                return Ok("Artículo eliminado exitosamente.");// Retornando una respuesta HTTP 200 si el artículo fue eliminado exitosamente
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al eliminar Artículo.");// Retornando una respuesta HTTP 500 en caso de error
            }
        }
    }

}
