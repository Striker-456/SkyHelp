using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.Models;
using SkyHelp.Repositories.Interfaces.SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Repositories
{
        public class DomiciliariosRepository : IDomiciliariosRepository
        {
            private readonly SkyHelpContext _context; // Inyección de dependencia del contexto de la base de datos

            public DomiciliariosRepository(SkyHelpContext context)
            {
                _context = context;
            }

            public async Task<List<Domiciliarios>> ObtenerDomiciliarios()
            {
                return await _context.Domiciliarios.ToListAsync();
            }

            public async Task<Domiciliarios> ObtenerDomiciliarioPorID(Guid id)
            {
                return await _context.Domiciliarios.FirstOrDefaultAsync(x => x.IDDomiciliario == id);
            }

            public async Task<bool> CrearDomiciliario(Domiciliarios domiciliario)
            {
                try
                {
                    await _context.Domiciliarios.AddAsync(domiciliario);
                    await _context.SaveChangesAsync();
                    return true;
                }
                catch (Exception ex)
                {
                    return false;
                    throw new Exception(ex.Message.ToString());
                }
            }

            public async Task<bool> ActualizarDomiciliario(Domiciliarios domiciliario)
            {
                try
                {
                    var domiciliarioExistente = await _context.Domiciliarios
                        .FirstOrDefaultAsync(x => x.IDDomiciliario == domiciliario.IDDomiciliario);

                    if (domiciliarioExistente == null)
                    {
                        return false;
                        throw new Exception("Domiciliario para actualizar no existe");
                    }

                    domiciliarioExistente.NombreCompleto = domiciliario.NombreCompleto;
                    domiciliarioExistente.Telefono = domiciliario.Telefono;
                    domiciliarioExistente.Email = domiciliario.Email;
                    domiciliarioExistente.EstadoActividad = domiciliario.EstadoActividad;
                    domiciliarioExistente.PlacaVehiculo = domiciliario.PlacaVehiculo;
                    domiciliarioExistente.IDUsuario = domiciliario.IDUsuario;

                    _context.Domiciliarios.Update(domiciliarioExistente);
                    await _context.SaveChangesAsync();
                    return true;
                }
                catch (Exception ex)
                {
                    return false;
                    throw new Exception(ex.Message.ToString());
                }
            }

            public async Task<bool> EliminarDomiciliario(Guid id)
            {
                try
                {
                    var domiciliarioExistente = await _context.Domiciliarios.FirstOrDefaultAsync(x => x.IDDomiciliario == id);

                    if (domiciliarioExistente == null)
                    {
                        return false;
                        throw new Exception("Domiciliario para eliminar no existe");
                    }

                    _context.Domiciliarios.Remove(domiciliarioExistente);
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


