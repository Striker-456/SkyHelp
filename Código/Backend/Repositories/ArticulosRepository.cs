using Microsoft.EntityFrameworkCore;
using SkyHelp;
using SkyHelp.Context;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;
using System.Linq.Expressions;
namespace SkyHelp.Repositories
{
    public class ArticulosRepository : IArticulosRepository
    {
        private readonly SkyHelpContext _context;// Inyección de dependencia del contexto de la base de datos
        public ArticulosRepository(SkyHelpContext context)
        {
            _context = context;
        }
        public async Task<List<Articulos>> ObtenerArticulos()
        {
            return await _context.Articulos.ToListAsync();
        }
        public async Task<Articulos?> ObtenerArticulosPorID(Guid id)
        {
            return await _context.Articulos.FindAsync(id);
        }
        public async Task<bool> CrearArticulo(Articulos articulo)
        {
            try
            {
                await _context.Articulos.AddAsync(articulo);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw new Exception(ex.Message.ToString());
            }
        }
        public async Task<bool> ActualizarArticulo(Articulos articulo)
        {
            try
            {
                var articuloExistente = await _context.Articulos.FirstOrDefaultAsync(x => x.IDArticulo == articulo.IDArticulo);
                if (articuloExistente == null)
                {
                    return false;
                    throw new Exception("Articulo Para Actualizar No Existe");
                }
                articuloExistente.Titulo = articulo.Titulo;
                articuloExistente.Contenido = articulo.Contenido;
                articuloExistente.FechaPublicacion = articulo.FechaPublicacion;
                articuloExistente.CalificacionPromedio = articulo.CalificacionPromedio;
                _context.Articulos.Update(articuloExistente);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw new Exception(ex.Message.ToString());
            }
        }
        public async Task<bool> EliminarArticulo(Guid id)
        {
            try
            {
                var articuloExistente = await _context.Articulos.FirstOrDefaultAsync(x => x.IDArticulo == id);
                if (articuloExistente == null)
                {
                    return false;
                    throw new Exception("Articulo Para Eliminar No Existe");
                }
                _context.Articulos.Remove(articuloExistente);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw new Exception(ex.Message.ToString());
            }
        }
    }
}
