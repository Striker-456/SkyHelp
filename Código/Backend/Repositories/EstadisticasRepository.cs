using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Repositories
{
    public class EstadisticasRepository : IEstadisticasRepository
    {
        private readonly SkyHelpContext _context;
        public EstadisticasRepository(SkyHelpContext context)
        {
            _context = context;
        }
        public async Task<List<Estadisticas>> ObtenerEstadisticas()
        {
            return await _context.Estadisticas.ToListAsync();
        }
        public async Task<Estadisticas> ObtenerEstadisticaPorId(Guid id)
        {
            return await _context.Estadisticas.FirstOrDefaultAsync(e => e.IdEstadistica == id);
        }
        public async Task<bool> CrearEstadistica(Estadisticas estadistica)
        {
            try
            {
                await _context.Estadisticas.AddAsync(estadistica);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw new Exception(ex.Message);
            }
        }
        public async Task<bool> ActualizarEstadistica(Estadisticas estadistica)
        {
            try
            {
                var estadisticaExistente = await _context.Estadisticas.FirstOrDefaultAsync(e => e.IdEstadistica == estadistica.IdEstadistica);
                if (estadisticaExistente == null)
                {
                    return false;
                    throw new Exception("La estadística para actualizar no existe.");
                }
                //Actualización campo por campo
                estadisticaExistente.Periodo = estadistica.Periodo;
                estadisticaExistente.FechaInicio = estadistica.FechaInicio;
                estadisticaExistente.FechaFin = estadistica.FechaFin;
                estadisticaExistente.TipoGrafico = estadistica.TipoGrafico;
                estadisticaExistente.Datos = estadistica.Datos;
                estadisticaExistente.IdUsuario = estadistica.IdUsuario;
                estadisticaExistente.ExportadoExcel = estadistica.ExportadoExcel;
                estadisticaExistente.ExportadoPDF = estadistica.ExportadoPDF;
                estadisticaExistente.FechaGeneracion = estadistica.FechaGeneracion;
                _context.Estadisticas.Update(estadisticaExistente);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw new Exception(ex.Message);
            }
        }
        public async Task<bool> EliminarEstadistica(Guid id)
        {
            try
            {
                var estadisticaExistente = await _context.Estadisticas.FirstOrDefaultAsync(e => e.IdEstadistica == id);
                if (estadisticaExistente == null)
                {
                    return false;
                    throw new Exception("La estadística para eliminar no existe.");
                }
                _context.Estadisticas.Remove(estadisticaExistente);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw new Exception(ex.Message);
            }
        }
    }
}