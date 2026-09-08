// js/modules/domiciliarios.js
// Módulo de administración de Domiciliarios: asignación de pedidos (solo tras diagnóstico
// del técnico) y vista general de domiciliarios con su carga de entregas.

AplicacionSkyHelp.prototype.obtenerContenidoDomiciliarios = async function() {
    let tickets = [];
    let estados = [];
    let tecnicos = [];
    let usuarios = [];
    let domiciliarios = [];
    let pedidos = [];

    try {
        const resultados = await Promise.allSettled([
            Api.getTickets(),
            Api.getEstadosTickets(),
            Api.getTecnicos(),
            Api.getUsuarios(),
            Api.getDomiciliarios(),
            Api.getPedidos()
        ]);
        tickets       = resultados[0].status === 'fulfilled' ? (resultados[0].value || []) : [];
        estados       = resultados[1].status === 'fulfilled' ? (resultados[1].value || []) : [];
        tecnicos      = resultados[2].status === 'fulfilled' ? (resultados[2].value || []) : [];
        usuarios      = resultados[3].status === 'fulfilled' ? (resultados[3].value || []) : [];
        domiciliarios = resultados[4].status === 'fulfilled' ? (resultados[4].value || []) : [];
        pedidos       = resultados[5].status === 'fulfilled' ? (resultados[5].value || []) : [];
    } catch (e) {
        this.mostrarToast('Error al cargar domiciliarios: ' + e.message, 'error');
    }

    datosSkyHelp.domiciliarios = domiciliarios;

    const getEstadoNombre = (idEstado) => {
        const e = estados.find(e => e.idEstado === idEstado);
        return e ? e.nombreEstado : '';
    };

    const getNombreUsuario = (idUsuario) => {
        const u = usuarios.find(u => u.idUsuario === idUsuario);
        return u ? (u.nombreCompleto || u.NombreCompleto || u.nombreUsuarios || u.NombreUsuarios || u.correo) : '—';
    };

    const getNombreTecnico = (idTecnico) => {
        if (!idTecnico) return 'Sin asignar';
        const t = tecnicos.find(t => t.idTecnico === idTecnico);
        return t ? (t.nombreCompleto || getNombreUsuario(t.idUsuario)) : 'Sin asignar';
    };

    // Listos para asignar: el técnico ya diagnosticó, todavía no tienen domiciliario, y el ticket
    // no está resuelto/cerrado.
    const listosParaAsignar = tickets.filter(t =>
        t.diagnostico && !t.idDomiciliario && !getEstadoNombre(t.idEstado).toLowerCase().includes('resuel'));

    const opcionesDomiciliarios = domiciliarios.map(d =>
        `<option value="${d.idDomiciliario}">${d.nombreCompleto || d.email || ''}</option>`).join('');

    const filasAsignacion = listosParaAsignar.length === 0
        ? `<tr><td colspan="6" style="text-align:center;padding:2rem;">No hay diagnósticos pendientes de asignar</td></tr>`
        : listosParaAsignar.map(t => {
            const id = t.idTicket;
            const numero = t.numeroTicket ? `#${t.numeroTicket}` : id.substring(0, 8) + '...';
            return `
            <tr>
                <td><strong>${numero}</strong></td>
                <td>${getNombreUsuario(t.idUsuario)}</td>
                <td>${t.categoria || ''}</td>
                <td>${getNombreTecnico(t.idTecnico)}</td>
                <td style="max-width:260px;">${t.diagnostico || ''}</td>
                <td>
                    <div class="acciones-ticket">
                        <select id="sel-domi-${id}" ${domiciliarios.length === 0 ? 'disabled' : ''}>${opcionesDomiciliarios}</select>
                        <button class="btn btn-primario" style="padding:0.5rem 1rem;font-size:0.8125rem;"
                            onclick="aplicacion.asignarDomiciliarioATicket('${id}')" ${domiciliarios.length === 0 ? 'disabled' : ''}>Asignar</button>
                    </div>
                </td>
            </tr>`;
        }).join('');

    const filasDomiciliarios = domiciliarios.length === 0
        ? `<tr><td colspan="4" style="text-align:center;padding:2rem;">No hay domiciliarios registrados</td></tr>`
        : domiciliarios.map(d => {
            const pedidosDomi = pedidos.filter(p => p.idDomiciliario === d.idDomiciliario);
            const activos = pedidosDomi.filter(p => p.estadoPedido !== 'Entregado').length;
            const entregados = pedidosDomi.filter(p => p.estadoPedido === 'Entregado').length;
            return `
            <tr>
                <td><strong>${d.nombreCompleto || ''}</strong></td>
                <td>${d.telefono || '—'}</td>
                <td><span class="badge-estado estado-activo">${d.estadoActividad || 'Activo'}</span></td>
                <td>${activos} activas · ${entregados} entregadas</td>
            </tr>`;
        }).join('');

    return `
        <div class="deslizar-arriba">
            <div class="encabezado-tickets">
                <h3>Diagnósticos listos para asignar</h3>
            </div>
            <div class="tarjeta">
                <div class="contenedor-tabla">
                    <table>
                        <thead>
                            <tr>
                                <th>Ticket</th>
                                <th>Cliente</th>
                                <th>Equipo</th>
                                <th>Técnico</th>
                                <th>Diagnóstico</th>
                                <th>Asignar Domiciliario</th>
                            </tr>
                        </thead>
                        <tbody>${filasAsignacion}</tbody>
                    </table>
                </div>
            </div>

            <div class="encabezado-tickets" style="margin-top:2rem;">
                <h3>Domiciliarios</h3>
            </div>
            <div class="tarjeta">
                <div class="contenedor-tabla">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Teléfono</th>
                                <th>Estado</th>
                                <th>Entregas</th>
                            </tr>
                        </thead>
                        <tbody>${filasDomiciliarios}</tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};

AplicacionSkyHelp.prototype.asignarDomiciliarioATicket = async function(idTicket) {
    const select = document.getElementById(`sel-domi-${idTicket}`);
    const idDomiciliario = select ? select.value : null;
    if (!idDomiciliario) {
        this.mostrarToast('Selecciona un domiciliario', 'advertencia');
        return;
    }

    try {
        await Api.asignarDomiciliario(idTicket, idDomiciliario);
        this.mostrarToast('✅ Domiciliario asignado exitosamente');
        if (this.seccionActual === 'domiciliarios') this.cargarContenido('domiciliarios');
    } catch (e) {
        this.mostrarToast('Error al asignar el domiciliario: ' + e.message, 'error');
    }
};
