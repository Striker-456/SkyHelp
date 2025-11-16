using System.ComponentModel.DataAnnotations;

namespace Microservicios
{
    public class Login
    {
        [Required]
        public string Correo { get; set; } = string.Empty!;

        [Required]
        public string Contrasena { get; set; } = string.Empty!;
    }
}
