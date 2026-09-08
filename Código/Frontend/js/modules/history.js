// js/modules/history.js
// Historial de entregas del domiciliario

AplicacionSkyHelp.prototype.obtenerContenidoHistorial = async function() {
    let entregas = [];
    try {
        entregas = await Api.getMisEntregas() || [];
    } catch (e) {
        entregas = [];
    }

    const entregadas = entregas.filter(en => en.estadoPedido === 'Entregado');

    const filas = entregadas.length === 0
        ? `<tr><td colspan="5" style="text-align:center;padding:2rem;">No hay entregas registradas</td></tr>`
        : entregadas.map(en => `
            <tr>
                <td><strong>#${en.numeroPedido}</strong></td>
                <td>${en.fechaEntrega ? new Date(en.fechaEntrega).toLocaleDateString() : ''}</td>
                <td>${en.descripcionTicket || ''}</td>
                <td>${en.clienteNombre || ''}</td>
                <td><span class="insignia-estado insignia-verde">${en.estadoPedido || ''}</span></td>
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
