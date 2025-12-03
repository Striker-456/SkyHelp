using Microsoft.EntityFrameworkCore;
using SkyHelp.Context;
using SkyHelp.Repositories.Interfaces;

namespace SkyHelp.Repositories
{
    public class PedidosRepository : IPedidosRepository
    {
        private readonly SkyHelpContext _context;// Inyección de dependencia del contexto de la base de datos

        public PedidosRepository(SkyHelpContext context)
        {
            _context = context;
        }

      public async Task<List<Pedidos>> ObtenerPedidos()
        {
            return await _context.Pedidos.ToListAsync();
        }
        public async Task<Pedidos> ObtenerPedidoPorId(Guid id)
        {
            return await _context.Pedidos.FirstOrDefaultAsync(x => x.IdPedido == id);
        }
        public async Task<bool> CrearPedido(Pedidos pedido)
        {
            try
            {
                await _context.Pedidos.AddAsync(pedido);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw new Exception(ex.Message.ToString());
            }
        }
        public async Task<bool> ActualizarPedido(Pedidos pedido)
        {
            try
            {
                var pedidoExistente = await _context.Pedidos.FirstOrDefaultAsync(x => x.IdPedido == pedido.IdPedido);
                if (pedidoExistente == null)
                {
                    return false;
                    throw new Exception("Pedido Para Actualizar No Existe");
                }
                pedidoExistente.IdUsuario = pedido.IdUsuario;
                pedidoExistente.IdDomiciliario = pedido.IdDomiciliario;
                pedidoExistente.DireccionEntrega = pedido.DireccionEntrega;
                pedidoExistente.EstadoPedido = pedido.EstadoPedido;
                pedidoExistente.Observaciones = pedido.Observaciones;
                pedidoExistente.FechaPedido = pedido.FechaPedido;
                _context.Pedidos.Update(pedidoExistente);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                throw new Exception(ex.Message.ToString());
            }
        }

        public async Task<bool> EliminarPedido(Guid id)
        {
            try
            {
                var pedidoExistente = await _context.Pedidos.FirstOrDefaultAsync(x => x.IdPedido == id);
                if (pedidoExistente == null)
                {
                    return false;
                    throw new Exception("Pedido Para Eliminar No Existe");
                }
                _context.Pedidos.Remove(pedidoExistente);
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
