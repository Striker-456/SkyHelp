using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SkyHelp.Authorization;
using SkyHelp.Context;
using SkyHelp.Models.DTOs;
using SkyHelp.Repositories.Interfaces;
using SkyHelp.Security;
using SkyHelp.Services.Interfaces;
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
        private readonly IPasswordResetService _passwordResetService;

        public AuthController(
            IUsuariosRepository usuariosRepository,
            IConfiguration configuration,
            SkyHelpContext context,
            IPasswordResetService passwordResetService)
        {
            _usuariosRepository = usuariosRepository;
            _configuration = configuration;
            _context = context;
            _passwordResetService = passwordResetService;
        }

        [EnableRateLimiting("login")]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest login)
        {
            return await LoginInternal(login, requiredRoleName: null);
        }

        [EnableRateLimiting("login")]
        [HttpPost("login-admin")]
        public async Task<IActionResult> LoginAdmin([FromBody] LoginRequest login)
        {
            return await LoginInternal(login, requiredRoleName: RoleNames.Administrador);
        }

        [EnableRateLimiting("login")]
        [HttpPost("login-usuario")]
        public async Task<IActionResult> LoginUsuario([FromBody] LoginRequest login)
        {
            return await LoginInternal(login, requiredRoleName: RoleNames.Usuario);
        }

        [EnableRateLimiting("login")]
        [HttpPost("login-cliente")]
        public async Task<IActionResult> LoginCliente([FromBody] LoginRequest login)
        {
            return await LoginInternal(login, requiredRoleName: RoleNames.Usuario);
        }

        [EnableRateLimiting("login")]
        [HttpPost("login-tecnico")]
        public async Task<IActionResult> LoginTecnico([FromBody] LoginRequest login)
        {
            return await LoginInternal(login, requiredRoleName: RoleNames.Tecnico);
        }

        [EnableRateLimiting("login")]
        [HttpPost("login-domiciliario")]
        public async Task<IActionResult> LoginDomiciliario([FromBody] LoginRequest login)
        {
            return await LoginInternal(login, requiredRoleName: RoleNames.Domiciliario);
        }

        // ------------------------------------------------------- RESTABLECIMIENTO DE CONTRASEÑA

        /// <summary>
        /// Paso 1: solicita un enlace temporal de restablecimiento.
        /// Responde SIEMPRE 200 con el mismo mensaje, exista o no la cuenta,
        /// para no permitir enumeración de usuarios (OWASP WSTG-IDNT-04).
        /// </summary>
        [AllowAnonymous]
        [EnableRateLimiting("login")]
        [HttpPost("SolicitarRestablecimiento")]
        public async Task<IActionResult> SolicitarRestablecimiento([FromBody] SolicitarRestablecimientoRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrWhiteSpace(request.Correo))
                    return BadRequest("El correo electrónico es obligatorio.");

                var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
                await _passwordResetService.GenerarTokenAsync(request.Correo, ip);

                // Misma respuesta para correo registrado y no registrado.
                return Ok(new
                {
                    mensaje = "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña en unos minutos."
                });
            }
            catch (Exception)
            {
                // Fallo de infraestructura (p. ej. SMTP caído). No se revela el detalle al cliente.
                return StatusCode(StatusCodes.Status503ServiceUnavailable,
                    "No se pudo procesar la solicitud en este momento. Inténtalo más tarde.");
            }
        }

        /// <summary>
        /// Paso 2: consume el token del enlace y establece la nueva contraseña.
        /// Aplica la misma política que el cambio de contraseña autenticado.
        /// </summary>
        [AllowAnonymous]
        [EnableRateLimiting("login")]
        [HttpPost("RestablecerContrasena")]
        public async Task<IActionResult> RestablecerContrasena([FromBody] RestablecerContrasenaRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrWhiteSpace(request.Token))
                    return BadRequest("El token es obligatorio.");

                var error = await _passwordResetService.RestablecerContrasenaAsync(request.Token, request.NuevaContrasena);
                if (error != null) return BadRequest(error);

                return Ok("Contraseña restablecida correctamente. Ya puedes iniciar sesión.");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error al restablecer la contraseña.");
            }
        }
        private async Task<IActionResult> LoginInternal(LoginRequest login, string? requiredRoleName)
        {
            if (login == null || string.IsNullOrWhiteSpace(login.Correo) || string.IsNullOrWhiteSpace(login.Contrasena))
                return BadRequest("El correo electrónico y la contraseña son obligatorios.");

            // Respuesta idéntica para "usuario no existe" e "inválidas": evita enumeración de cuentas.
            const string mensajeInvalido = "Credenciales inválidas.";

            var usuario = await _usuariosRepository.ObtenerUsuarioPorCorreo(login.Correo);
            if (usuario == null)
            {
                // Verificación dummy: iguala el tiempo de respuesta y evita timing attacks.
                PasswordHasher.VerifyHashedPassword(PasswordHasher.HashDummy, login.Contrasena);
                return Unauthorized(new { mensaje = mensajeInvalido });
            }

            var verificacion = PasswordHasher.VerifyHashedPassword(usuario.Contrasena, login.Contrasena);
            if (verificacion == PasswordVerificationResult.Failed)
                return Unauthorized(new { mensaje = mensajeInvalido });

            // Las cuentas inactivas no pueden iniciar sesión.
            if (!string.Equals(usuario.EstadoCuenta, "Activo", StringComparison.OrdinalIgnoreCase))
                return Unauthorized(new { mensaje = mensajeInvalido });

            var rol = await _context.Roles.FirstOrDefaultAsync(r => r.IDRol == usuario.IdRol);
            if (rol == null || string.IsNullOrWhiteSpace(rol.NombreRol))
                return Unauthorized(new { mensaje = mensajeInvalido });

            var jwtRole = RoleClaimMapper.ToJwtRole(rol.NombreRol);

            if (!string.IsNullOrWhiteSpace(requiredRoleName) &&
                !string.Equals(jwtRole, requiredRoleName, StringComparison.Ordinal))
                return Unauthorized(new { mensaje = mensajeInvalido });

            // Migración progresiva: si el hash es legacy SHA-256, se regenera con PBKDF2.
            if (verificacion == PasswordVerificationResult.SuccessRehashNeeded)
            {
                try
                {
                    usuario.Contrasena = login.Contrasena; // el repositorio aplica PBKDF2
                    await _usuariosRepository.ActualizarUsuario(usuario);
                }
                catch
                {
                    // No bloquear el inicio de sesión por un fallo en la migración del hash.
                }
            }

            // Mismo encoding que Program.cs (Jwt:Key)
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
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
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: signinCredentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            return Ok(new { Token = tokenString, Role = jwtRole });
        }
    }
}
