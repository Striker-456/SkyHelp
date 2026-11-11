using SkyHelp.EncriptarSHA256;
using System.Security.Cryptography;
using System.Text;

namespace SkyHelp.Security
{
    /// <summary>
    /// Resultado de la verificación de una contraseña.
    /// </summary>
    public enum PasswordVerificationResult
    {
        Failed,
        Success,
        SuccessRehashNeeded
    }

    /// <summary>
    /// Hasheo de contraseñas con PBKDF2 (HMAC-SHA256).
    /// - Salt aleatorio de 128 bits por contraseña.
    /// - 600.000 iteraciones (recomendación OWASP para PBKDF2-SHA256).
    /// - Formato compatible con ASP.NET Core Identity v3: "{iteraciones}.{saltBase64}.{hashBase64}".
    /// - Comparación en tiempo constante (evita timing attacks).
    /// - Migración progresiva: detecta hashes legacy SHA-256 sin salt (Seguridad.EncriptarSHA256)
    ///   y permite re-hashearlos con PBKDF2 en el siguiente login.
    /// </summary>
    public static class PasswordHasher
    {
        private const int IteracionesPbkdf2 = 600_000;
        private const int TamanioSalt = 16; // 128 bits
        private const int TamanioHash = 32; // 256 bits
        private const char Separador = '.';

        /// <summary>
        /// Hash dummy usado para igualar tiempos de respuesta cuando el usuario no existe,
        /// evitando enumeración de cuentas por diferencia de timing (OWASP WSTG-IDNT-04).
        /// </summary>
        public static readonly string HashDummy = CrearHashPbkdf2("dummy-password-timing-equalizer");

        /// <summary>Genera el hash PBKDF2 de una contraseña en texto plano.</summary>
        public static string HashPassword(string contrasena)
        {
            if (string.IsNullOrWhiteSpace(contrasena))
                throw new ArgumentException("La contraseña no puede estar vacía.", nameof(contrasena));

            return CrearHashPbkdf2(contrasena);
        }

        /// <summary>
        /// Verifica una contraseña contra el hash almacenado.
        /// Devuelve <see cref="PasswordVerificationResult.SuccessRehashNeeded"/> cuando el hash
        /// es válido pero usa el formato legacy SHA-256 (o un número de iteraciones antiguo).
        /// </summary>
        public static PasswordVerificationResult VerifyHashedPassword(string? hashAlmacenado, string contrasenaIngresada)
        {
            if (string.IsNullOrEmpty(hashAlmacenado) || string.IsNullOrEmpty(contrasenaIngresada))
                return PasswordVerificationResult.Failed;

            var partes = hashAlmacenado.Split(Separador);
            if (partes.Length == 3 && int.TryParse(partes[0], out var iteraciones) && iteraciones > 0)
            {
                // Formato PBKDF2: {iteraciones}.{saltBase64}.{hashBase64}
                try
                {
                    var salt = Convert.FromBase64String(partes[1]);
                    var hashEsperado = Convert.FromBase64String(partes[2]);
                    var hashCalculado = Rfc2898DeriveBytes.Pbkdf2(
                        contrasenaIngresada,
                        salt,
                        iteraciones,
                        HashAlgorithmName.SHA256,
                        hashEsperado.Length);

                    if (!CryptographicOperations.FixedTimeEquals(hashCalculado, hashEsperado))
                        return PasswordVerificationResult.Failed;

                    return iteraciones == IteracionesPbkdf2
                        ? PasswordVerificationResult.Success
                        : PasswordVerificationResult.SuccessRehashNeeded;
                }
                catch (FormatException)
                {
                    return PasswordVerificationResult.Failed;
                }
            }

            // Formato legacy: SHA-256 sin salt (Seguridad.EncriptarSHA256).
            // El uso del método obsoleto es intencional: solo para migrar hashes antiguos.
#pragma warning disable CS0618
            var hashLegacy = Seguridad.EncriptarSHA256(contrasenaIngresada);
#pragma warning restore CS0618
            var coinciden = CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(hashLegacy),
                Encoding.UTF8.GetBytes(hashAlmacenado));

            return coinciden
                ? PasswordVerificationResult.SuccessRehashNeeded
                : PasswordVerificationResult.Failed;
        }

        /// <summary>Indica si el hash almacenado debe regenerarse (formato legacy o iteraciones antiguas).</summary>
        public static bool NeedsRehash(string? hashAlmacenado)
        {
            if (string.IsNullOrEmpty(hashAlmacenado))
                return true;

            var partes = hashAlmacenado.Split(Separador);
            return partes.Length != 3
                   || !int.TryParse(partes[0], out var iteraciones)
                   || iteraciones != IteracionesPbkdf2;
        }

        private static string CrearHashPbkdf2(string contrasena)
        {
            var salt = RandomNumberGenerator.GetBytes(TamanioSalt);
            var hash = Rfc2898DeriveBytes.Pbkdf2(
                contrasena,
                salt,
                IteracionesPbkdf2,
                HashAlgorithmName.SHA256,
                TamanioHash);

            return string.Concat(
                IteracionesPbkdf2.ToString(),
                Separador,
                Convert.ToBase64String(salt),
                Separador,
                Convert.ToBase64String(hash));
        }
    }

    /// <summary>
    /// Política de contraseñas aplicada en registro, cambio de contraseña, alta administrativa
    /// y restablecimiento por enlace temporal.
    /// Reglas exigidas:
    /// - Longitud mínima de 8 caracteres.
    /// - Al menos una letra mayúscula.
    /// - Al menos un número.
    /// - Al menos un carácter especial (símbolo ASCII imprimible).
    /// </summary>
    public static class PasswordPolicy
    {
        public const int LongitudMinima = 8;
        public const int LongitudMaxima = 72;

        /// <summary>Conjunto de caracteres considerados "especiales".</summary>
        public const string CaracteresEspeciales = "!@#$%^&*()-_=+[]{};:,.<>?/|~`\"'\\";

        /// <summary>Devuelve null si la contraseña es válida; en caso contrario, el mensaje de error.</summary>
        public static string? Validar(string? contrasena)
        {
            if (string.IsNullOrWhiteSpace(contrasena))
                return "La contraseña es obligatoria.";

            if (contrasena.Length < LongitudMinima)
                return $"La contraseña debe tener al menos {LongitudMinima} caracteres.";

            if (contrasena.Length > LongitudMaxima)
                return $"La contraseña no puede superar los {LongitudMaxima} caracteres.";

            if (!contrasena.Any(char.IsUpper))
                return "La contraseña debe contener al menos una letra mayúscula.";

            if (!contrasena.Any(char.IsDigit))
                return "La contraseña debe contener al menos un número.";

            if (!contrasena.Any(c => CaracteresEspeciales.Contains(c)))
                return "La contraseña debe contener al menos un carácter especial (por ejemplo: !@#$%^&*).";

            return null;
        }
    }
}
