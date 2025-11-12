using System.Security.Cryptography;
using System.Text;

namespace SkyHelp.EncriptarSHA256
{
    public static class Seguridad
    {
        public static string EncriptarSHA256(string texto)
        {
            using (SHA256 sha256 =SHA256.Create())
            {
                byte[] bytes = Encoding.UTF8.GetBytes(texto);
                byte[] hash = sha256.ComputeHash(bytes);
                return Convert.ToBase64String(hash);

                StringBuilder resultado = new StringBuilder();
                for (int i = 0; i < hash.Length; i++)
                {
                    resultado.Append(hash[i].ToString("x2"));
                }
                return resultado.ToString();
            }
        }
    }
}
