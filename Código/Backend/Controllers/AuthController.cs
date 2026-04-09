using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SkyHelp.Authorization;
using SkyHelp.EncriptarSHA256;
using SkyHelp.Context;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SkyHelp.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUsuariosRepository _usuariosRepository;
        private readonly IConfiguration _configuration;
        private readonly SkyHelpContext _context;

        public AuthController(IUsuariosRepository usuariosRepository, IConfiguration configuration, SkyHelpContext context)
        {
            _usuariosRepository = usuariosRepository;
            _configuration = configuration;
            _context = context;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(Login login)
        {
            return await LoginInternal(login, requiredRoleName: null);
        }

        [HttpPost("login-admin")]
        public async Task<IActionResult> LoginAdmin([FromBody] Login login)
        {
            return await LoginInternal(login, requiredRoleName: RoleNames.Administrador);
        }

        [HttpPost("login-usuario")]
        public async Task<IActionResult> LoginUsuario([FromBody] Login login)
        {
            return await LoginInternal(login, requiredRoleName: RoleNames.Usuario);
        }

        [HttpPost("login-cliente")]
        public async Task<IActionResult> LoginCliente([FromBody] Login login)
        {
            return await LoginInternal(login, requiredRoleName: RoleNames.Usuario);
        }

        [HttpPost("login-tecnico")]
        public async Task<IActionResult> LoginTecnico([FromBody] Login login)
        {
            return await LoginInternal(login, requiredRoleName: RoleNames.Tecnico);
        }

        [HttpPost("login-domiciliario")]
        public async Task<IActionResult> LoginDomiciliario([FromBody] Login login)
        {
            return await LoginInternal(login, requiredRoleName: RoleNames.Domiciliario);
        }

        private async Task<IActionResult> LoginInternal(Login login, string? requiredRoleName)
        {
            if (login == null || string.IsNullOrEmpty(login.Correo) || string.IsNullOrEmpty(login.Contrasena))
                return BadRequest("El correo electrónico y la contraseña son obligatorios.");

            var usuario = await _usuariosRepository.ObtenerUsuarioPorCorreo(login.Correo);
            if (usuario == null)
                return Unauthorized();

            if (Seguridad.EncriptarSHA256(login.Contrasena) != usuario.Contrasena)
                return Unauthorized("Credenciales inválidas.");

            var rol = await _context.Roles.FirstOrDefaultAsync(r => r.IDRol == usuario.IdRol);
            if (rol == null || string.IsNullOrWhiteSpace(rol.NombreRol))
                return Unauthorized("No se encontró el rol del usuario.");

            var jwtRole = RoleClaimMapper.ToJwtRole(rol.NombreRol);

            if (!string.IsNullOrWhiteSpace(requiredRoleName))
            {
                if (!string.Equals(jwtRole, requiredRoleName, StringComparison.Ordinal))
                    return Unauthorized($"El usuario no tiene el rol requerido: {requiredRoleName}.");
            }

            // Keep encoding consistent with Program.cs (Jwt:Key)
            var secretKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var tokenOptions = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, usuario.IdUsuario.ToString()),
                    new Claim(ClaimTypes.Name, usuario.Correo),
                    new Claim("nombreCompleto", usuario.NombreCompleto ?? usuario.NombreUsuarios ?? usuario.Correo),
                    new Claim(ClaimTypes.Role, jwtRole)
                },
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: signinCredentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            return Ok(new { Token = tokenString, Role = jwtRole });
        }
    }
}



