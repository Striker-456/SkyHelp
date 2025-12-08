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
        private readonly SkyHelpContext _context;
        public ArticulosRepository(SkyHelpContext context)
        {
            _context = context;
        }
        // OBTENER TODOS
        public async Task<List<Articulos>> ObtenerArticulos()
        {
            return await _context.Articulos.ToListAsync();
        }
        // OBTENER POR ID
        public async Task<Articulos> ObtenerArticulosPorID(Guid id)
        {
            return await _context.Articulos.FirstOrDefaultAsync(x => x.IdArticulo == id);
        }
        // CREAR
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
        // ACTUALIZAR
        public async Task<bool> ActualizarArticulo(Articulos articulo)
        {
            try
            {
                var articuloExistente = await _context.Articulos.FirstOrDefaultAsync(x => x.IdArticulo == articulo.IdArticulo);
                if (articuloExistente == null)
                {
                    return false;
                    throw new Exception("Artículo para actualizar no existe.");
                }
                articuloExistente.Titulo = articulo.Titulo;
                articuloExistente.Categoria = articulo.Categoria;
                articuloExistente.Contenido = articulo.Contenido;
                articuloExistente.FechaPublicacion = articulo.FechaPublicacion;
                articuloExistente.TotalVistas = articulo.TotalVistas;
                articuloExistente.CalificacionPromedio = articulo.CalificacionPromedio;
                articuloExistente.IdUsuario = articulo.IdUsuario;
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
        // ELIMINAR
        public async Task<bool> EliminarArticulo(Guid id)
        {
            try
            {
                var articuloExistente = await _context.Articulos.FirstOrDefaultAsync(x => x.IdArticulo == id);
                if (articuloExistente == null)
                {
                    return false;
                    throw new Exception("Artículo para eliminar no existe.");
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