using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SkyHelp.EncriptarSHA256;
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

        public AuthController(IUsuariosRepository usuariosRepository, IConfiguration configuration)
        {
            _usuariosRepository = usuariosRepository;
            _configuration = configuration;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(Login login)
        {
            if (login == null || string.IsNullOrEmpty(login.Correo) || string.IsNullOrEmpty(login.Contrasena))
            {
                return BadRequest("El correo electrónico y la contraseña son obligatorios.");
            }

            var usuario = await _usuariosRepository.ObtenerUsuarioPorCorreo(login.Correo);
            if (usuario == null)
            {
                return Unauthorized();
            }
            Console.WriteLine(Seguridad.EncriptarSHA256(login.Contrasena));
            Console.WriteLine(usuario.Contrasena);
            if (Seguridad.EncriptarSHA256(login.Contrasena) == usuario.Contrasena)
            {
                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

                var tokeOptions = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: new List<Claim>
                    {
            new Claim(ClaimTypes.Name, usuario.Correo),
            new Claim(ClaimTypes.Role, "Admin")
                    },
                    expires: DateTime.Now.AddMinutes(30),
                    signingCredentials: signinCredentials
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
                return Ok(new { Token = tokenString });
            }
            else
            {
                return Unauthorized("Credenciales inválidas.");
            }
        }
    }
}



