// js/modules/history.js
// Historial de entregas del domiciliario

AplicacionSkyHelp.prototype.obtenerContenidoHistorial = async function() {
    let pedidos = [];
    try {
        pedidos = await Api.get('/pedidos/ObtenerPedidos') || [];
    } catch (e) {
        pedidos = [];
    }

    const filas = pedidos.length === 0
        ? `<tr><td colspan="5" style="text-align:center;padding:2rem;">No hay entregas registradas</td></tr>`
        : pedidos.map(p => `
            <tr>
                <td><strong>${p.idPedido || ''}</strong></td>
                <td>${p.fecha ? new Date(p.fecha).toLocaleDateString() : ''}</td>
                <td>${p.descripcion || ''}</td>
                <td>${p.cliente || ''}</td>
                <td><span class="insignia-estado insignia-verde">${p.estado || ''}</span></td>
            </tr>
        `).join('');

    return `
        <div class="deslizar-arriba">
            <div class="tarjeta">
                <h3>Historial de Entregas</h3>
                <div class="contenedor-tabla">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha</th>
                                <th>Descripción</th>
                                <th>Cliente</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>${filas}</tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};
