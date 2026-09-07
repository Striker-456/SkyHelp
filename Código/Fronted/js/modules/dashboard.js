// js/modules/dashboard.js
// Dashboard por rol — conectado a la API

AplicacionSkyHelp.prototype.obtenerContenidoDashboard = async function() {
    const rol = this.usuarioActual.rol;

    if (rol === 'usuario' || rol === 'cliente') {
        return await this.obtenerDashboardCliente();
    }
    if (rol === 'domiciliario' || rol === 'domi') {
        return await this.obtenerDashboardDomiciliario();
    }

    // Admin y técnico
    try {
        datosSkyHelp.tickets = await Api.getTickets() || [];
    } catch (e) {
        datosSkyHelp.tickets = [];
    }

    const estadisticas = this.obtenerEstadisticasPorRol(rol);

    return `
        <div class="deslizar-arriba">
            <div class="cuadricula-estadisticas-dashboard">
                ${estadisticas.map(est => `
                    <div class="tarjeta-estadistica-dashboard">
                        <div class="icono-estadistica" style="background: ${est.color}">${est.icono}</div>
                        <div class="info-estadistica">
                            <div class="etiqueta-estadistica-dashboard">${est.etiqueta}</div>
                            <div class="valor-estadistica-dashboard">${est.valor}</div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="tarjeta">
                <h3>Tickets Recientes</h3>
                <div class="contenedor-tabla">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Categoría</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                                <th>Prioridad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${datosSkyHelp.tickets.slice(0, 5).map(ticket => {
                                const id = ticket.idTicket || ticket.id || '';
                                const estados = datosSkyHelp.estados || [];
                                const estadoObj = estados.find(e => e.idEstado === ticket.idEstado);
                                const estadoNombre = estadoObj ? estadoObj.nombreEstado : (ticket.estado || '');
                                return `
                                <tr>
                                    <td><strong>${id.substring(0,8)}...</strong></td>
                                    <td>${ticket.categoria || ''}</td>
                                    <td>${ticket.descripcion || ''}</td>
                                    <td><span class="insignia-estado ${this.obtenerClaseInsigniaEstado(estadoNombre)}">${estadoNombre}</span></td>
                                    <td><span class="insignia-estado ${this.obtenerClaseInsigniaPrioridad(ticket.prioridad)}">${ticket.prioridad || ''}</span></td>
                                    <td><button class="btn btn-primario" style="padding:0.5rem 1rem;font-size:0.8125rem;" onclick="aplicacion.verDetalleTicket('${id}')">Ver</button></td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};

AplicacionSkyHelp.prototype.obtenerEstadisticasPorRol = function(rol) {
    const tickets = datosSkyHelp.tickets;
    const total     = tickets.length;
    const pendientes = tickets.filter(t => {
        const e = (datosSkyHelp.estados||[]).find(e => e.idEstado === t.idEstado);
        return (e?.nombreEstado||'').toLowerCase() === 'pendiente';
    }).length;
    const resueltos = tickets.filter(t => {
        const e = (datosSkyHelp.estados||[]).find(e => e.idEstado === t.idEstado);
        return (e?.nombreEstado||'').toLowerCase() === 'resuelto';
    }).length;
    const criticos = tickets.filter(t => (t.prioridad||'').toLowerCase() === 'crítica' || (t.prioridad||'').toLowerCase() === 'critica').length;
    const enProgreso = tickets.filter(t => {
        const e = (datosSkyHelp.estados||[]).find(e => e.idEstado === t.idEstado);
        return (e?.nombreEstado||'').toLowerCase() === 'abierto';
    }).length;

    const iconos = {
        grafico:    '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>',
        reloj:      '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
        verificar:  '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>',
        alerta:     '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
        herramienta:'<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'
    };

    if (rol === 'administrador') return [
        { etiqueta: 'Tickets Totales', valor: total,     icono: iconos.grafico,     color: 'var(--color-azul)' },
        { etiqueta: 'Pendientes',      valor: pendientes, icono: iconos.reloj,       color: 'var(--color-amarillo)' },
        { etiqueta: 'Cerrados',        valor: resueltos,  icono: iconos.verificar,   color: 'var(--color-verde)' },
        { etiqueta: 'Críticos',        valor: criticos,   icono: iconos.alerta,      color: 'var(--color-primario)' }
    ];

    return [
        { etiqueta: 'Mis Tickets',  valor: total,      icono: iconos.herramienta, color: 'var(--color-azul)' },
        { etiqueta: 'Abiertos',     valor: enProgreso, icono: iconos.reloj,       color: 'var(--color-amarillo)' },
        { etiqueta: 'Cerrados',     valor: resueltos,  icono: iconos.verificar,   color: 'var(--color-verde)' },
        { etiqueta: 'Urgentes',     valor: criticos,   icono: iconos.alerta,      color: 'var(--color-primario)' }
    ];
};

AplicacionSkyHelp.prototype.obtenerDashboardCliente = async function() {
    let tickets = [];
    let estados = [];
    try {
        [tickets, estados] = await Promise.allSettled([Api.getTickets(), Api.getEstadosTickets()])
            .then(r => [r[0].value||[], r[1].value||[]]);
        datosSkyHelp.tickets = tickets;
        datosSkyHelp.estados = estados;
    } catch (e) {
        tickets = datosSkyHelp.tickets || [];
        estados = datosSkyHelp.estados || [];
    }

    const getEstado = (idEstado) => {
        const e = estados.find(e => e.idEstado === idEstado);
        return e ? e.nombreEstado : '';
    };

    const activos   = tickets.filter(t => getEstado(t.idEstado).toLowerCase() !== 'resuelto');
    const resueltos = tickets.filter(t => getEstado(t.idEstado).toLowerCase() === 'resuelto').length;
    const ticketActivo = activos[0];

    // Guardar datos en cache global para acceso desde onclick
    datosSkyHelp.ticketsClienteCache = tickets;
    datosSkyHelp.estadosCache = estados;

    return `
        <div class="deslizar-arriba cli-dashboard">
            <div class="cli-hero">
                <div class="cli-hero-texto">
                    <div class="cli-saludo">Hola, ${this.usuarioActual.nombre.split(' ')[0]} 👋</div>
                    <h2 class="cli-titulo">¿En qué podemos ayudarte hoy?</h2>
                    <p class="cli-subtitulo">Gestiona tus equipos y solicitudes de soporte desde aquí</p>
                </div>
                <button class="cli-btn-nuevo" onclick="aplicacion.mostrarModalNuevoTicket()">
                    <div class="cli-btn-nuevo-icono">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:28px;height:28px;stroke-width:2.5;"><path d="M12 5v14M5 12h14"/></svg>
                    </div>
                    <div>
                        <div style="font-weight:700;font-size:1rem;">Nuevo Ticket</div>
                        <div style="font-size:0.8125rem;opacity:0.8;">Reportar un problema</div>
                    </div>
                </button>
            </div>

            <div class="cli-stats">
                <div class="cli-stat cli-stat-azul" onclick="aplicacion.mostrarTicketsClientePorFiltro('total')">
                    <div class="cli-stat-num">${tickets.length}</div>
                    <div class="cli-stat-lbl">Total</div>
                </div>
                <div class="cli-stat cli-stat-naranja" onclick="aplicacion.mostrarTicketsClientePorFiltro('activos')">
                    <div class="cli-stat-num">${activos.length}</div>
                    <div class="cli-stat-lbl">Activos</div>
                </div>
                <div class="cli-stat cli-stat-verde" onclick="aplicacion.mostrarTicketsClientePorFiltro('resueltos')">
                    <div class="cli-stat-num">${resueltos}</div>
                    <div class="cli-stat-lbl">Resueltos</div>
                </div>
            </div>

            ${ticketActivo ? `
            <div class="cli-ticket-activo" onclick="aplicacion.verDetalleTicket('${ticketActivo.idTicket||ticketActivo.id}')">
                <div class="cli-ticket-activo-header">
                    <div class="cli-ticket-activo-label">
                        <div class="cli-pulso"></div>
                        Ticket activo
                    </div>
                    <span class="insignia-estado ${this.obtenerClaseInsigniaEstado(getEstado(ticketActivo.idEstado))}">${getEstado(ticketActivo.idEstado)}</span>
                </div>
                <div class="cli-ticket-activo-equipo">${ticketActivo.categoria || ''}</div>
                <div class="cli-ticket-activo-problema">${ticketActivo.descripcion || ''}</div>
                <div class="cli-ticket-activo-footer">
                    <div class="cli-tecnico-info">
                        <div class="cli-tecnico-avatar">T</div>
                        <span>Prioridad: ${ticketActivo.prioridad || '—'}</span>
                    </div>
                    <div class="cli-ticket-acciones">
                        <button class="cli-btn-ver" onclick="event.stopPropagation();aplicacion.verDetalleTicket('${ticketActivo.idTicket||ticketActivo.id}')">
                            Ver detalles →
                        </button>
                    </div>
                </div>
            </div>
            ` : `
            <div class="cli-sin-tickets">
                <div style="font-size:3rem;margin-bottom:1rem;">🎉</div>
                <div style="font-weight:700;font-size:1.125rem;color:var(--gris-800);margin-bottom:0.5rem;">¡Todo en orden!</div>
                <div style="color:var(--gris-500);font-size:0.9375rem;">No tienes tickets activos en este momento.</div>
            </div>
            `}

            <div class="cli-acciones-titulo">Acciones rápidas</div>
            <div class="cli-acciones">
                <button class="cli-accion" onclick="aplicacion.mostrarModalNuevoTicket()">
                    <div class="cli-accion-icono" style="background:linear-gradient(135deg,var(--color-primario),var(--color-rosa));">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:22px;height:22px;"><path d="M12 5v14M5 12h14"/></svg>
                    </div>
                    <div class="cli-accion-texto">
                        <div class="cli-accion-titulo">Nuevo Ticket</div>
                        <div class="cli-accion-desc">Reportar un equipo</div>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:18px;height:18px;color:var(--gris-400);flex-shrink:0;"><path d="M9 18l6-6-6-6"/></svg>
                </button>
                <button class="cli-accion" onclick="aplicacion.navegarA('tickets')">
                    <div class="cli-accion-icono" style="background:linear-gradient(135deg,var(--color-azul),#60a5fa);">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:22px;height:22px;"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    </div>
                    <div class="cli-accion-texto">
                        <div class="cli-accion-titulo">Mis Tickets</div>
                        <div class="cli-accion-desc">Ver historial completo</div>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:18px;height:18px;color:var(--gris-400);flex-shrink:0;"><path d="M9 18l6-6-6-6"/></svg>
                </button>
                <button class="cli-accion" onclick="aplicacion.navegarA('perfil')">
                    <div class="cli-accion-icono" style="background:linear-gradient(135deg,var(--color-verde),#34d399);">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:22px;height:22px;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div class="cli-accion-texto">
                        <div class="cli-accion-titulo">Mi Perfil</div>
                        <div class="cli-accion-desc">Datos y configuración</div>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:18px;height:18px;color:var(--gris-400);flex-shrink:0;"><path d="M9 18l6-6-6-6"/></svg>
                </button>
            </div>
        </div>
    `;
};

AplicacionSkyHelp.prototype.obtenerDashboardDomiciliario = async function() {
    let tickets = [];
    let estados = [];
    let domiciliarioId = null;

    try {
        // Obtener el ID del domiciliario actual
        const domiciliarioActual = await Api.getDomiciliarioActual();
        if (domiciliarioActual) {
            domiciliarioId = domiciliarioActual.idDomiciliario;
        }

        // Obtener tickets asignados a este domiciliario
        if (domiciliarioId) {
            tickets = await Api.getTicketsPorDomiciliario(domiciliarioId) || [];
        }
        
        // Obtener estados
        estados = await Api.getEstadosTickets() || [];
        
        datosSkyHelp.tickets = tickets;
        datosSkyHelp.estados = estados;
    } catch (e) {
        console.error('Error cargando entregas:', e);
        tickets = [];
        estados = [];
    }

    const getEstado = (idEstado) => {
        const e = estados.find(e => e.idEstado === idEstado);
        return e ? e.nombreEstado : '';
    };

    const enRuta      = tickets.filter(t => getEstado(t.idEstado).toLowerCase().includes('ruta')).length;
    const pendientes  = tickets.filter(t => getEstado(t.idEstado).toLowerCase().includes('pendiente') || getEstado(t.idEstado).toLowerCase().includes('preparacion')).length;
    const completadas = tickets.filter(t => getEstado(t.idEstado).toLowerCase().includes('resuelto')).length;

    return `
        <div class="deslizar-arriba">
            <div class="dom-header">
                <div class="dom-header-info">
                    <div class="dom-avatar">${this.usuarioActual.nombre.charAt(0)}</div>
                    <div>
                        <h2>Hola, ${this.usuarioActual.nombre.split(' ')[0]} 👋</h2>
                        <p>Tienes <strong>${enRuta + pendientes}</strong> entregas activas</p>
                    </div>
                </div>
            </div>

            <div class="dom-stats">
                <div class="dom-stat dom-stat-azul">
                    <div class="dom-stat-icono">🚚</div>
                    <div class="dom-stat-num">${tickets.length}</div>
                    <div class="dom-stat-label">Total</div>
                </div>
                <div class="dom-stat dom-stat-amarillo">
                    <div class="dom-stat-icono">⏳</div>
                    <div class="dom-stat-num">${pendientes}</div>
                    <div class="dom-stat-label">Pendientes</div>
                </div>
                <div class="dom-stat dom-stat-rojo">
                    <div class="dom-stat-icono">📍</div>
                    <div class="dom-stat-num">${enRuta}</div>
                    <div class="dom-stat-label">En ruta</div>
                </div>
                <div class="dom-stat dom-stat-verde">
                    <div class="dom-stat-icono">✅</div>
                    <div class="dom-stat-num">${completadas}</div>
                    <div class="dom-stat-label">Completadas</div>
                </div>
            </div>

            <div class="dom-seccion-titulo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:20px;height:20px;"><rect width="16" height="13" x="6" y="4" rx="2"/><path d="M22 7h-2M7 7H1M7 20H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h3m13 0h-3m-10 0h7M14 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/></svg>
                Entregas Asignadas
            </div>

            ${tickets.length === 0 ? `
                <div class="cli-sin-tickets">
                    <div style="font-size:3rem;margin-bottom:1rem;">📦</div>
                    <div style="font-weight:700;font-size:1.125rem;color:var(--gris-800);margin-bottom:0.5rem;">Sin entregas asignadas</div>
                    <div style="color:var(--gris-500);">No tienes entregas pendientes por el momento.</div>
                </div>
            ` : `
                <div class="dom-lista-entregas">
                    ${tickets.map(ticket => `
                        <div class="dom-entrega-card">
                            <div class="dom-entrega-tipo-badge">📦 ${ticket.categoria || 'Entrega'}</div>
                            <div class="dom-entrega-body">
                                <div class="dom-entrega-top">
                                    <span class="dom-entrega-equipo">${ticket.descripcion || ticket.idTicket || ''}</span>
                                    <span class="insignia-estado insignia-azul">${getEstado(ticket.idEstado)}</span>
                                </div>
                                <div class="dom-entrega-acciones">
                                    <button class="btn btn-secundario" onclick="aplicacion.verDetalleTicketDomiciliario('${ticket.idTicket || ticket.id}')">Detalles</button>
                                    <button class="btn btn-primario" onclick="aplicacion.marcarPreparando('${ticket.idTicket || ticket.id}')">Preparar</button>
                                    <button class="btn btn-exito" onclick="aplicacion.iniciarRecorrido('${ticket.idTicket || ticket.id}')">Empezar Recorrido</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
    `;
};

AplicacionSkyHelp.prototype.mostrarTicketsClientePorFiltro = function(filtro) {
    const tickets = datosSkyHelp.ticketsClienteCache || [];
    const estados = datosSkyHelp.estadosCache || [];
    const self = this; // Guardar referencia a 'this'

    const getEstado = (idEstado) => {
        const e = estados.find(e => e.idEstado === idEstado);
        return e ? e.nombreEstado : '';
    };

    let ticketsFiltrados = tickets;
    let titulo = '';

    if (filtro === 'activos') {
        ticketsFiltrados = tickets.filter(t => getEstado(t.idEstado).toLowerCase() !== 'resuelto');
        titulo = 'Tickets Activos';
    } else if (filtro === 'resueltos') {
        ticketsFiltrados = tickets.filter(t => getEstado(t.idEstado).toLowerCase() === 'resuelto');
        titulo = 'Tickets Resueltos';
    } else {
        titulo = 'Todos los Tickets';
    }

    const contenido = `
        <div class="modal-encabezado">
            <div>
                <h3>${titulo}</h3>
            </div>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <div class="modal-cuerpo">
            ${ticketsFiltrados.length === 0 ? `
                <div style="text-align:center;padding:2rem;color:var(--gris-500);">
                    <div style="font-size:2rem;margin-bottom:1rem;">📭</div>
                    <div>No hay tickets en esta categoría</div>
                </div>
            ` : `
                <div class="lista-tickets-modal">
                    ${ticketsFiltrados.map(ticket => {
                        const estadoNombre = getEstado(ticket.idEstado);
                        const claseEstado = self.obtenerClaseInsigniaEstado(estadoNombre);
                        const clasePrioridad = self.obtenerClaseInsigniaPrioridad(ticket.prioridad);
                        return `
                        <div class="ticket-item-modal" onclick="aplicacion.verDetalleTicket('${ticket.idTicket || ticket.id}')">
                            <div class="ticket-item-header">
                                <strong>#${(ticket.idTicket || ticket.id || '').substring(0, 8)}</strong>
                                <span class="insignia-estado ${claseEstado}">${estadoNombre}</span>
                            </div>
                            <div class="ticket-item-categoria">${ticket.categoria || ''}</div>
                            <div class="ticket-item-descripcion">${ticket.descripcion || ''}</div>
                            <div class="ticket-item-footer">
                                <span class="insignia-prioridad ${clasePrioridad}">${ticket.prioridad || ''}</span>
                                <span class="ticket-item-fecha">${new Date(ticket.fechaCreacion).toLocaleDateString('es-ES')}</span>
                            </div>
                        </div>
                    `;
                    }).join('')}
                </div>
            `}
        </div>
        <div class="modal-pie">
            <button class="btn btn-primario" onclick="aplicacion.cerrarModal()">Cerrar</button>
        </div>
    `;

    this.abrirModal(contenido, true);
};

AplicacionSkyHelp.prototype.verDetalleTicketDomiciliario = async function(idTicket) {
    try {
        const ticket = await Api.get(`/tickets/ObtenerPorId?Id=${idTicket}`);
        if (!ticket) {
            this.mostrarToast('No se pudo cargar el ticket', 'error');
            return;
        }

        const estados = datosSkyHelp.estados || await Api.getEstadosTickets();
        const self = this; // Guardar referencia a 'this'
        
        const getEstado = (idEstado) => {
            const e = estados.find(e => e.idEstado === idEstado);
            return e ? e.nombreEstado : '';
        };

        const estadoNombre = getEstado(ticket.idEstado);
        const claseEstado = self.obtenerClaseInsigniaEstado(estadoNombre);
        const clasePrioridad = self.obtenerClaseInsigniaPrioridad(ticket.prioridad);

        const contenido = `
            <div class="modal-encabezado">
                <div>
                    <h3>Detalles del Ticket</h3>
                </div>
                <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
            </div>
            <div class="modal-cuerpo">
                <div class="info-ticket-grid">
                    <div class="info-ticket-item">
                        <div class="etiqueta">ID TICKET</div>
                        <div class="valor">${idTicket.substring(0, 8)}</div>
                    </div>
                    <div class="info-ticket-item">
                        <div class="etiqueta">CATEGORÍA</div>
                        <div class="valor">${ticket.categoria || '—'}</div>
                    </div>
                    <div class="info-ticket-item">
                        <div class="etiqueta">DESCRIPCIÓN</div>
                        <div class="valor">${ticket.descripcion || '—'}</div>
                    </div>
                    <div class="info-ticket-item">
                        <div class="etiqueta">ESTADO</div>
                        <div class="valor"><span class="insignia-estado ${claseEstado}">${estadoNombre}</span></div>
                    </div>
                    <div class="info-ticket-item">
                        <div class="etiqueta">PRIORIDAD</div>
                        <div class="valor"><span class="insignia-prioridad ${clasePrioridad}">${ticket.prioridad || '—'}</span></div>
                    </div>
                    <div class="info-ticket-item">
                        <div class="etiqueta">FECHA DE CREACIÓN</div>
                        <div class="valor">${new Date(ticket.fechaCreacion).toLocaleDateString('es-ES')}</div>
                    </div>
                </div>
            </div>
            <div class="modal-pie">
                <button class="btn btn-primario" onclick="aplicacion.cerrarModal()">Cerrar</button>
            </div>
        `;

        this.abrirModal(contenido, true);
    } catch (e) {
        console.error('Error al cargar detalles:', e);
        this.mostrarToast('❌ Error al cargar los detalles del ticket', 'error');
    }
};

AplicacionSkyHelp.prototype.marcarPreparando = async function(idTicket) {
    try {
        const estados = datosSkyHelp.estados || await Api.getEstadosTickets();
        const estadoPreparacion = estados.find(e => e.nombreEstado.toLowerCase().includes('preparacion'));
        
        if (!estadoPreparacion) {
            this.mostrarToast('Estado "En preparación" no encontrado', 'error');
            return;
        }

        await Api.actualizarEstadoTicket(idTicket, estadoPreparacion.idEstado);
        this.mostrarToast('✅ Ticket marcado como "En preparación"', 'exito');
        this.cerrarModal();
        // Recargar el dashboard
        await this.cargarContenido('dashboard');
    } catch (e) {
        console.error('Error al marcar como preparando:', e);
        this.mostrarToast('❌ Error al actualizar el estado', 'error');
    }
};

AplicacionSkyHelp.prototype.iniciarRecorrido = async function(idTicket) {
    const contenido = `
        <div class="modal-encabezado">
            <div>
                <h3>Tiempo Estimado de Entrega</h3>
            </div>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <div class="modal-cuerpo">
            <div style="display:flex;flex-direction:column;gap:1rem;">
                <button class="btn btn-primario" style="padding:1rem;font-size:1rem;" onclick="aplicacion.confirmarRecorrido('${idTicket}', '5-8 horas')">
                    ⏱️ 5-8 horas
                </button>
                <button class="btn btn-primario" style="padding:1rem;font-size:1rem;" onclick="aplicacion.confirmarRecorrido('${idTicket}', '10-12 horas')">
                    ⏱️ 10-12 horas
                </button>
                <button class="btn btn-primario" style="padding:1rem;font-size:1rem;" onclick="aplicacion.confirmarRecorrido('${idTicket}', '24 horas')">
                    ⏱️ 24 horas
                </button>
            </div>
        </div>
        <div class="modal-pie">
            <button class="btn btn-secundario" onclick="aplicacion.cerrarModal()">Cancelar</button>
        </div>
    `;

    this.abrirModal(contenido, true);
};

AplicacionSkyHelp.prototype.confirmarRecorrido = async function(idTicket, tiempoEstimado) {
    try {
        const estados = datosSkyHelp.estados || await Api.getEstadosTickets();
        const estadoEnRuta = estados.find(e => e.nombreEstado.toLowerCase().includes('ruta'));
        
        if (!estadoEnRuta) {
            this.mostrarToast('Estado "En ruta" no encontrado', 'error');
            return;
        }

        await Api.actualizarEstadoTicket(idTicket, estadoEnRuta.idEstado);
        this.mostrarToast(`✅ Recorrido iniciado - Tiempo estimado: ${tiempoEstimado}`, 'exito');
        this.cerrarModal();
        // Recargar el dashboard
        await this.cargarContenido('dashboard');
    } catch (e) {
        console.error('Error al iniciar recorrido:', e);
        this.mostrarToast('❌ Error al iniciar el recorrido', 'error');
    }
};
