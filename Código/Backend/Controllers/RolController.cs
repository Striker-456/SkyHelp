using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RolController : ControllerBase
    {
        private readonly IRolRepository _RolRepository;
        public RolController(IRolRepository rolRepository)
        {
            _RolRepository = rolRepository;
        }

        [AllowAnonymous]
        [HttpGet("ObtenerRoles")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        public async Task<IActionResult> ObtenerRoles()
        {
            try
            {
                var roles = await _RolRepository.ObtenerRoles();
                if (roles == null || !roles.Any())
                {
                    return NotFound("No se encontraron roles.");
                }
                return Ok(roles);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener Roles.");
            }
        }
    }
}
