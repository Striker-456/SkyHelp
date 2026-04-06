// js/modules/tickets.js
// Métodos para gestión de tickets

AplicacionSkyHelp.prototype.obtenerContenidoTickets = async function() {
    try {
        const rol = this.usuarioActual.rol;
        const promesas = [Api.getTickets(), Api.getEstadosTickets()];

        // Solo admin puede ver usuarios y técnicos
        if (rol === 'administrador') {
            promesas.push(Api.getUsuarios(), Api.getTecnicos());
        }

        const resultados = await Promise.allSettled(promesas);

        datosSkyHelp.tickets  = resultados[0].status === 'fulfilled' ? (resultados[0].value || []) : [];
        datosSkyHelp.estados  = resultados[1].status === 'fulfilled' ? (resultados[1].value || []) : [];
        datosSkyHelp.usuarios = resultados[2]?.status === 'fulfilled' ? (resultados[2].value || []) : [];
        datosSkyHelp.tecnicos = resultados[3]?.status === 'fulfilled' ? (resultados[3].value || []) : [];
    } catch (e) {
        datosSkyHelp.tickets = [];
        this.mostrarToast('Error al cargar tickets: ' + e.message, 'error');
    }

    return `
        <div class="deslizar-arriba">
            <div class="encabezado-tickets">
                <input type="text" id="busqueda-tickets" class="entrada-busqueda" placeholder="Buscar tickets..." onkeyup="aplicacion.filtrarTickets()">
                
                <div class="filtros">
                    <select id="filtro-estado" onchange="aplicacion.filtrarTickets()">
                        <option value="todos">Todos los estados</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Asignado">Asignado</option>
                        <option value="En progreso">En progreso</option>
                        <option value="Resuelto">Resuelto</option>
                    </select>
                    
                    <select id="filtro-prioridad" onchange="aplicacion.filtrarTickets()">
                        <option value="todos">Todas las prioridades</option>
                        <option value="Crítica">Crítica</option>
                        <option value="Alta">Alta</option>
                        <option value="Media">Media</option>
                        <option value="Baja">Baja</option>
                    </select>
                    
                    ${this.usuarioActual.rol === 'cliente' || this.usuarioActual.rol === 'administrador' ? '<button class="btn btn-primario" onclick="aplicacion.mostrarModalNuevoTicket()">Nuevo Ticket</button>' : ''}
                </div>
            </div>
            
            <div class="tarjeta">
                <div class="contenedor-tabla">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Equipo</th>
                                <th>Problema</th>
                                <th>Cliente</th>
                                <th>Técnico</th>
                                <th>Estado</th>
                                <th>Prioridad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="cuerpo-tabla-tickets">
                            ${this.renderizarFilasTickets(datosSkyHelp.tickets)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};

AplicacionSkyHelp.prototype.renderizarFilasTickets = function(tickets) {
    if (!tickets || tickets.length === 0) {
        return `<tr><td colspan="8" style="text-align:center;padding:2rem;">No hay tickets</td></tr>`;
    }

    const getNombre = (idUsuario) => {
        const u = (datosSkyHelp.usuarios || []).find(u => u.idUsuario === idUsuario);
        return u ? (u.nombreCompleto || u.nombreUsuarios || u.correo) : (idUsuario || '—');
    };

    const getTecnico = (idTecnico) => {
        if (!idTecnico) return 'Sin asignar';
        const t = (datosSkyHelp.tecnicos || []).find(t => t.idTecnico === idTecnico);
        if (!t) return 'Sin asignar';
        return getNombre(t.idUsuario);
    };

    const getEstado = (idEstado) => {
        const e = (datosSkyHelp.estados || []).find(e => e.idEstado === idEstado);
        return e ? e.nombreEstado : (idEstado || '—');
    };

    return tickets.map(ticket => {
        const id = ticket.idTicket || '';
        const descripcion = ticket.descripcion || '';
        const categoria = ticket.categoria || '';
        const prioridad = ticket.prioridad || '';
        const estado = getEstado(ticket.idEstado);
        const cliente = getNombre(ticket.idUsuario);
        const tecnico = getTecnico(ticket.idTecnico);
        return `
        <tr>
            <td><strong>${id.substring(0,8)}...</strong></td>
            <td>${categoria}</td>
            <td>${descripcion}</td>
            <td>${cliente}</td>
            <td>${tecnico}</td>
            <td><span class="insignia-estado ${this.obtenerClaseInsigniaEstado(estado)}">${estado}</span></td>
            <td><span class="insignia-estado ${this.obtenerClaseInsigniaPrioridad(prioridad)}">${prioridad}</span></td>
            <td>
                <div class="acciones-ticket">
                    <button class="btn btn-primario" style="padding:0.5rem 1rem;font-size:0.8125rem;" onclick="aplicacion.verDetalleTicket('${id}')">Ver</button>
                    ${this.usuarioActual.rol !== 'usuario' ? `<button class="btn btn-secundario" style="padding:0.5rem 1rem;font-size:0.8125rem;" onclick="aplicacion.mostrarModalEditarTicket('${id}')">Editar</button>` : ''}
                </div>
            </td>
        </tr>`;
    }).join('');
};
AplicacionSkyHelp.prototype.inicializarFiltrosTickets = function() {
    // Los filtros se inicializan mediante onchange/onkeyup en el HTML
};

AplicacionSkyHelp.prototype.filtrarTickets = function() {
    const terminoBusqueda = document.getElementById('busqueda-tickets')?.value.toLowerCase() || '';
    const filtroEstado = document.getElementById('filtro-estado')?.value || 'todos';
    const filtroPrioridad = document.getElementById('filtro-prioridad')?.value || 'todos';
    
    const filtrados = datosSkyHelp.tickets.filter(ticket => {
        const coincideBusqueda = ticket.id.toLowerCase().includes(terminoBusqueda) ||
                                ticket.equipo.toLowerCase().includes(terminoBusqueda) ||
                                ticket.cliente.toLowerCase().includes(terminoBusqueda) ||
                                ticket.problema.toLowerCase().includes(terminoBusqueda);
        const coincideEstado = filtroEstado === 'todos' || ticket.estado === filtroEstado;
        const coincidePrioridad = filtroPrioridad === 'todos' || ticket.prioridad === filtroPrioridad;
        
        return coincideBusqueda && coincideEstado && coincidePrioridad;
    });
    
    const cuerpoTabla = document.getElementById('cuerpo-tabla-tickets');
    if (cuerpoTabla) {
        cuerpoTabla.innerHTML = this.renderizarFilasTickets(filtrados);
    }
};

AplicacionSkyHelp.prototype.verDetalleTicket = function(id) {
    const ticket = datosSkyHelp.tickets.find(t => t.id === id);
    if (!ticket) return;

    const historial = [
        { emoji: '🎫', bg: '#dbeafe', accion: `Ticket ${ticket.id} creado`, tiempo: ticket.creado + ' · 09:00' },
        { emoji: '👤', bg: '#ede9fe', accion: `Asignado a ${ticket.tecnico !== 'Sin asignar' ? ticket.tecnico : 'cola de espera'}`, tiempo: ticket.creado + ' · 10:30' },
        { emoji: '🔧', bg: '#fef3c7', accion: 'Diagnóstico iniciado', tiempo: ticket.actualizado + ' · 08:15' },
        ...(ticket.estado === 'Resuelto' ? [{ emoji: '✅', bg: '#d1fae5', accion: 'Ticket resuelto exitosamente', tiempo: ticket.actualizado + ' · 16:45' }] : [])
    ];

    const contenido = `
        <div class="modal-encabezado">
            <div>
                <h3>${ticket.id} — ${ticket.equipo}</h3>
                <div class="modal-encabezado-sub">
                    <span class="insignia-estado ${this.obtenerClaseInsigniaEstado(ticket.estado)}">${ticket.estado}</span>
                    <span class="insignia-estado ${this.obtenerClaseInsigniaPrioridad(ticket.prioridad)}">Prioridad ${ticket.prioridad}</span>
                </div>
            </div>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <div class="modal-cuerpo">
            <div class="info-ticket-grid">
                <div class="info-ticket-item">
                    <div class="etiqueta">Equipo</div>
                    <div class="valor">${ticket.equipo}</div>
                </div>
                <div class="info-ticket-item">
                    <div class="etiqueta">Problema</div>
                    <div class="valor">${ticket.problema}</div>
                </div>
                <div class="info-ticket-item">
                    <div class="etiqueta">Cliente</div>
                    <div class="valor">${ticket.cliente}</div>
                </div>
                <div class="info-ticket-item">
                    <div class="etiqueta">Técnico Asignado</div>
                    <div class="valor">${ticket.tecnico}</div>
                </div>
                <div class="info-ticket-item">
                    <div class="etiqueta">Fecha de Creación</div>
                    <div class="valor">${ticket.creado}</div>
                </div>
                <div class="info-ticket-item">
                    <div class="etiqueta">Última Actualización</div>
                    <div class="valor">${ticket.actualizado}</div>
                </div>
            </div>

            <div class="linea-tiempo">
                <h4>📋 Historial de Actividad</h4>
                ${historial.map(ev => `
                    <div class="evento-timeline">
                        <div class="punto-timeline" style="background:${ev.bg};">${ev.emoji}</div>
                        <div class="contenido-timeline">
                            <div class="accion">${ev.accion}</div>
                            <div class="tiempo">${ev.tiempo}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="modal-pie">
            ${this.usuarioActual.rol !== 'cliente' ? `<button class="btn btn-secundario" onclick="aplicacion.mostrarModalEditarTicket('${ticket.id}')">Editar Ticket</button>` : ''}
            <button class="btn btn-primario" onclick="aplicacion.cerrarModal()">Cerrar</button>
        </div>
    `;
    this.abrirModal(contenido, true);
};

AplicacionSkyHelp.prototype.mostrarModalNuevoTicket = function() {
    const tecnicos = ['Sin asignar', 'Juan Pérez', 'Pedro Rodríguez', 'Ana García'];

    const contenido = `
        <div class="modal-encabezado">
            <h3>Nuevo Ticket</h3>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <form onsubmit="aplicacion.guardarNuevoTicket(event)">
            <div class="modal-cuerpo">
                <div class="fila-formulario">
                    <div class="grupo-formulario">
                        <label>Equipo *</label>
                        <input type="text" name="equipo" placeholder="Ej. Dell OptiPlex 7090" required>
                    </div>
                    <div class="grupo-formulario">
                        <label>Prioridad *</label>
                        <select name="prioridad" required>
                            <option value="">Seleccionar</option>
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                            <option value="Crítica">Crítica</option>
                        </select>
                    </div>
                </div>
                <div class="grupo-formulario">
                    <label>Problema / Descripción *</label>
                    <input type="text" name="problema" placeholder="Describe el problema del equipo" required>
                </div>
                <div class="fila-formulario">
                    <div class="grupo-formulario">
                        <label>Cliente *</label>
                        <input type="text" name="cliente" placeholder="Nombre del cliente" required>
                    </div>
                    <div class="grupo-formulario">
                        <label>Técnico Asignado</label>
                        <select name="tecnico">
                            ${tecnicos.map(t => `<option value="${t}">${t}</option>`).join('')}
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-pie">
                <button type="button" class="btn btn-secundario" onclick="aplicacion.cerrarModal()">Cancelar</button>
                <button type="submit" class="btn btn-primario">Crear Ticket</button>
            </div>
        </form>
    `;
    this.abrirModal(contenido);
};

AplicacionSkyHelp.prototype.guardarNuevoTicket = async function(evento) {
    evento.preventDefault();
    const datos = new FormData(evento.target);

    const nuevoTicket = {
        equipo: datos.get('equipo'),
        problema: datos.get('problema'),
        estado: 'Pendiente',
        cliente: datos.get('cliente'),
        tecnico: datos.get('tecnico') || 'Sin asignar',
        prioridad: datos.get('prioridad')
    };

    try {
        await Api.crearTicket(nuevoTicket);
        this.cerrarModal();
        this.mostrarToast('✅ Ticket creado exitosamente');
        if (this.seccionActual === 'tickets') this.cargarContenido('tickets');
    } catch (e) {
        this.mostrarToast('Error al crear ticket: ' + e.message, 'error');
    }
};

AplicacionSkyHelp.prototype.mostrarModalEditarTicket = function(id) {
    const ticket = datosSkyHelp.tickets.find(t => t.id === id);
    if (!ticket) return;

    const tecnicos = ['Sin asignar', 'Juan Pérez', 'Pedro Rodríguez', 'Ana García'];
    const estados = ['Pendiente', 'Asignado', 'En progreso', 'Resuelto'];
    const prioridades = ['Baja', 'Media', 'Alta', 'Crítica'];
    const opcionTecnico = (t) => `<option value="${t}" ${ticket.tecnico === t ? 'selected' : ''}>${t}</option>`;
    const opcionSelect = (val, cur) => `<option value="${val}" ${cur === val ? 'selected' : ''}>${val}</option>`;

    const contenido = `
        <div class="modal-encabezado">
            <div>
                <h3>Editar Ticket</h3>
                <div class="modal-encabezado-sub">
                    <span class="insignia-estado insignia-azul">${ticket.id}</span>
                </div>
            </div>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <form onsubmit="aplicacion.guardarEdicionTicket(event, '${ticket.id}')">
            <div class="modal-cuerpo">
                <div class="fila-formulario">
                    <div class="grupo-formulario">
                        <label>Equipo *</label>
                        <input type="text" name="equipo" value="${ticket.equipo}" required>
                    </div>
                    <div class="grupo-formulario">
                        <label>Prioridad *</label>
                        <select name="prioridad" required>
                            ${prioridades.map(p => opcionSelect(p, ticket.prioridad)).join('')}
                        </select>
                    </div>
                </div>
                <div class="grupo-formulario">
                    <label>Problema / Descripción *</label>
                    <input type="text" name="problema" value="${ticket.problema}" required>
                </div>
                <div class="fila-formulario">
                    <div class="grupo-formulario">
                        <label>Estado *</label>
                        <select name="estado" required>
                            ${estados.map(e => opcionSelect(e, ticket.estado)).join('')}
                        </select>
                    </div>
                    <div class="grupo-formulario">
                        <label>Técnico Asignado</label>
                        <select name="tecnico">
                            ${tecnicos.map(t => opcionTecnico(t)).join('')}
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-pie">
                <button type="button" class="btn btn-secundario" onclick="aplicacion.cerrarModal()">Cancelar</button>
                <button type="submit" class="btn btn-primario">Guardar Cambios</button>
            </div>
        </form>
    `;
    this.cerrarModal();
    setTimeout(() => this.abrirModal(contenido), 50);
};

AplicacionSkyHelp.prototype.guardarEdicionTicket = async function(evento, id) {
    evento.preventDefault();
    const datos = new FormData(evento.target);

    const ticketActualizado = {
        equipo: datos.get('equipo'),
        problema: datos.get('problema'),
        estado: datos.get('estado'),
        tecnico: datos.get('tecnico'),
        prioridad: datos.get('prioridad')
    };

    try {
        await Api.actualizarTicket(id, ticketActualizado);
        this.cerrarModal();
        this.mostrarToast(`✅ Ticket ${id} actualizado exitosamente`);
        if (this.seccionActual === 'tickets') this.cargarContenido('tickets');
        else if (this.seccionActual === 'dashboard') this.cargarContenido('dashboard');
    } catch (e) {
        this.mostrarToast('Error al actualizar ticket: ' + e.message, 'error');
    }
};