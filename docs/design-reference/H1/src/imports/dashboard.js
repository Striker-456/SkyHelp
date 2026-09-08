// js/modules/dashboard.js
// Métodos para el dashboard

AplicacionSkyHelp.prototype.obtenerContenidoDashboard = function() {
    const estadisticas = this.obtenerEstadisticasPorRol(this.usuarioActual.rol);
    
    if (this.usuarioActual.rol === 'cliente') {
        return this.obtenerDashboardCliente();
    }
    
    if (this.usuarioActual.rol === 'domiciliario') {
        return this.obtenerDashboardDomiciliario();
    }
    
    return `
        <div class="deslizar-arriba">
            <div class="cuadricula-estadisticas-dashboard">
                ${estadisticas.map(est => `
                    <div class="tarjeta-estadistica-dashboard">
                        <div class="icono-estadistica" style="background: ${est.color}">
                            ${est.icono}
                        </div>
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
                                <th>Equipo</th>
                                <th>Problema</th>
                                <th>Cliente</th>
                                <th>Estado</th>
                                <th>Prioridad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${datosSkyHelp.tickets.slice(0, 5).map(ticket => `
                                <tr>
                                    <td><strong>${ticket.id}</strong></td>
                                    <td>${ticket.equipo}</td>
                                    <td>${ticket.problema}</td>
                                    <td>${ticket.cliente}</td>
                                    <td><span class="insignia-estado ${this.obtenerClaseInsigniaEstado(ticket.estado)}">${ticket.estado}</span></td>
                                    <td><span class="insignia-estado ${this.obtenerClaseInsigniaPrioridad(ticket.prioridad)}">${ticket.prioridad}</span></td>
                                    <td><button class="btn btn-primario" style="padding:0.5rem 1rem;font-size:0.8125rem;" onclick="aplicacion.verDetalleTicket('${ticket.id}')">Ver</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};

AplicacionSkyHelp.prototype.obtenerEstadisticasPorRol = function(rol) {
    const mapaIconos = {
        grafico: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>',
        reloj: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
        verificar: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>',
        alerta: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
        herramienta: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
        usuarios: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
    };
    
    switch (rol) {
        case 'administrador':
            return [
                { etiqueta: 'Tickets Totales', valor: '247', icono: mapaIconos.grafico, color: 'var(--color-azul)' },
                { etiqueta: 'Pendientes', valor: '45', icono: mapaIconos.reloj, color: 'var(--color-amarillo)' },
                { etiqueta: 'Resueltos Hoy', valor: '12', icono: mapaIconos.verificar, color: 'var(--color-verde)' },
                { etiqueta: 'Críticos', valor: '3', icono: mapaIconos.alerta, color: 'var(--color-primario)' }
            ];
        case 'tecnico':
            return [
                { etiqueta: 'Mis Tickets', valor: '18', icono: mapaIconos.herramienta, color: 'var(--color-azul)' },
                { etiqueta: 'En Progreso', valor: '7', icono: mapaIconos.reloj, color: 'var(--color-amarillo)' },
                { etiqueta: 'Completados', valor: '142', icono: mapaIconos.verificar, color: 'var(--color-verde)' },
                { etiqueta: 'Urgentes', valor: '2', icono: mapaIconos.alerta, color: 'var(--color-primario)' }
            ];
        default:
            return [
                { etiqueta: 'Entregas Hoy', valor: '8', icono: mapaIconos.usuarios, color: 'var(--color-azul)' },
                { etiqueta: 'En Ruta', valor: '3', icono: mapaIconos.reloj, color: 'var(--color-amarillo)' },
                { etiqueta: 'Completadas', valor: '67', icono: mapaIconos.verificar, color: 'var(--color-verde)' },
                { etiqueta: 'Pendientes', valor: '2', icono: mapaIconos.alerta, color: 'var(--color-naranja)' }
            ];
    }
};

AplicacionSkyHelp.prototype.obtenerDashboardCliente = function() {
    const todos = datosSkyHelp.tickets;
    const activos = todos.filter(t => t.estado !== 'Resuelto');
    const resueltos = todos.filter(t => t.estado === 'Resuelto').length;
    const ticketActivo = activos[0]; // el más reciente activo

    return `
        <div class="deslizar-arriba cli-dashboard">

            <!-- Hero bienvenida -->
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

            <!-- Stats rápidas -->
            <div class="cli-stats">
                <div class="cli-stat cli-stat-azul">
                    <div class="cli-stat-num">${todos.length}</div>
                    <div class="cli-stat-lbl">Total</div>
                </div>
                <div class="cli-stat cli-stat-naranja">
                    <div class="cli-stat-num">${activos.length}</div>
                    <div class="cli-stat-lbl">Activos</div>
                </div>
                <div class="cli-stat cli-stat-verde">
                    <div class="cli-stat-num">${resueltos}</div>
                    <div class="cli-stat-lbl">Resueltos</div>
                </div>
            </div>

            <!-- Ticket activo destacado -->
            ${ticketActivo ? `
            <div class="cli-ticket-activo" onclick="aplicacion.verDetalleTicket('${ticketActivo.id}')">
                <div class="cli-ticket-activo-header">
                    <div class="cli-ticket-activo-label">
                        <div class="cli-pulso"></div>
                        Ticket activo
                    </div>
                    <span class="insignia-estado ${this.obtenerClaseInsigniaEstado(ticketActivo.estado)}">${ticketActivo.estado}</span>
                </div>
                <div class="cli-ticket-activo-equipo">${ticketActivo.equipo}</div>
                <div class="cli-ticket-activo-problema">${ticketActivo.problema}</div>
                <div class="cli-ticket-activo-progreso">
                    <div class="cli-progreso-info">
                        <span>Progreso de reparación</span>
                        <strong>${ticketActivo.progreso || 0}%</strong>
                    </div>
                    <div class="cli-progreso-barra">
                        <div class="cli-progreso-fill" style="width:${ticketActivo.progreso || 0}%"></div>
                    </div>
                </div>
                <div class="cli-ticket-activo-footer">
                    <div class="cli-tecnico-info">
                        <div class="cli-tecnico-avatar">${ticketActivo.tecnico !== 'Sin asignar' ? ticketActivo.tecnico.charAt(0) : '?'}</div>
                        <span>${ticketActivo.tecnico !== 'Sin asignar' ? ticketActivo.tecnico : 'Sin técnico asignado'}</span>
                    </div>
                    <div class="cli-ticket-acciones">
                        <button class="cli-btn-chat" onclick="event.stopPropagation();aplicacion.abrirChatTicket('${ticketActivo.id}')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:16px;height:16px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            Chat
                        </button>
                        <button class="cli-btn-ver" onclick="event.stopPropagation();aplicacion.verDetalleTicket('${ticketActivo.id}')">
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

            <!-- Acciones rápidas -->
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
                <button class="cli-accion" onclick="aplicacion.navegarA('chat')">
                    <div class="cli-accion-icono" style="background:linear-gradient(135deg,var(--color-purpura),#8b5cf6);">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:22px;height:22px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div class="cli-accion-texto">
                        <div class="cli-accion-titulo">Mis Chats</div>
                        <div class="cli-accion-desc">Hablar con técnicos</div>
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

            <!-- Todos los tickets -->
            ${todos.length > 1 ? `
            <div class="cli-acciones-titulo" style="margin-top:2rem;">Todos mis tickets</div>
            <div class="tarjeta" style="padding:1.5rem;">
                <div class="lista-tickets-cliente">
                    ${todos.slice(0, 5).map(t => `
                        <div class="item-ticket-cliente" onclick="aplicacion.verDetalleTicket('${t.id}')">
                            <div class="ticket-cliente-icono">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                            </div>
                            <div class="ticket-cliente-info">
                                <div class="ticket-cliente-titulo">${t.equipo}</div>
                                <div class="ticket-cliente-desc">${t.problema}</div>
                                <div class="ticket-cliente-meta">
                                    <span class="insignia-estado ${this.obtenerClaseInsigniaEstado(t.estado)}">${t.estado}</span>
                                    <span style="color:var(--gris-500);font-size:0.8125rem;">${t.creado}</span>
                                    ${t.calificacionCliente ? `<span style="color:#f59e0b;font-size:0.875rem;">${'★'.repeat(t.calificacionCliente)}</span>` : ''}
                                </div>
                            </div>
                            ${t.estado === 'Resuelto' && !t.calificacionCliente ? `
                                <button class="btn-calificar-mini" onclick="event.stopPropagation();aplicacion.mostrarModalCalificarTicket('${t.id}')">⭐</button>
                            ` : `
                                <svg class="icono" style="color:var(--gris-400);flex-shrink:0;" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 18l6-6-6-6"/></svg>
                            `}
                        </div>
                    `).join('')}
                </div>
                ${todos.length > 5 ? `<div style="text-align:center;margin-top:1rem;"><button class="btn btn-secundario" onclick="aplicacion.navegarA('tickets')">Ver todos (${todos.length})</button></div>` : ''}
            </div>
            ` : ''}
        </div>
    `;
};

AplicacionSkyHelp.prototype.obtenerDashboardDomiciliario = function() {
    const entregas = datosSkyHelp.entregas || [];
    const hoy = entregas;
    const enRuta = hoy.filter(e => e.estado === 'En ruta').length;
    const pendientes = hoy.filter(e => e.estado === 'Pendiente').length;
    const completadas = hoy.filter(e => e.estado === 'Completado').length;
    const califs = hoy.filter(e => e.calificacion).map(e => e.calificacion);
    const promCalif = califs.length ? (califs.reduce((a,b)=>a+b,0)/califs.length).toFixed(1) : '—';

    const colorEstado = { 'En ruta': 'insignia-azul', 'Pendiente': 'insignia-amarillo', 'Completado': 'insignia-verde' };
    const iconoTipo = { 'Recogida': '📦', 'Entrega': '🚚' };

    return `
        <div class="deslizar-arriba">
            <!-- Header domiciliario -->
            <div class="dom-header">
                <div class="dom-header-info">
                    <div class="dom-avatar">${this.usuarioActual.nombre.charAt(0)}</div>
                    <div>
                        <h2>Hola, ${this.usuarioActual.nombre.split(' ')[0]} 👋</h2>
                        <p>Tienes <strong>${enRuta + pendientes}</strong> entregas activas hoy</p>
                    </div>
                </div>
                <div class="dom-header-calif">
                    <div class="dom-calif-stars">${'★'.repeat(Math.round(parseFloat(promCalif)||5))}</div>
                    <div class="dom-calif-valor">${promCalif} <span>calificación</span></div>
                </div>
            </div>

            <!-- Stats -->
            <div class="dom-stats">
                <div class="dom-stat dom-stat-azul">
                    <div class="dom-stat-icono">🚚</div>
                    <div class="dom-stat-num">${hoy.length}</div>
                    <div class="dom-stat-label">Total hoy</div>
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

            <!-- Lista de entregas del día -->
            <div class="dom-seccion-titulo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:20px;height:20px;"><rect width="16" height="13" x="6" y="4" rx="2"/><path d="M22 7h-2M7 7H1M7 20H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h3m13 0h-3m-10 0h7M14 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/></svg>
                Entregas del Día
            </div>
            <div class="dom-lista-entregas">
                ${hoy.filter(e => e.estado !== 'Completado').concat(hoy.filter(e => e.estado === 'Completado')).map(e => `
                    <div class="dom-entrega-card ${e.estado === 'Completado' ? 'dom-entrega-completada' : ''}">
                        <div class="dom-entrega-tipo-badge">${iconoTipo[e.tipo]} ${e.tipo}</div>
                        <div class="dom-entrega-body">
                            <div class="dom-entrega-top">
                                <div class="dom-entrega-id-equipo">
                                    <span class="dom-entrega-id">${e.id}</span>
                                    <span class="dom-entrega-equipo">${e.equipo}</span>
                                </div>
                                <span class="insignia-estado ${colorEstado[e.estado]}">${e.estado}</span>
                            </div>
                            <div class="dom-entrega-cliente">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:14px;height:14px;flex-shrink:0;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <strong>${e.cliente}</strong>
                                <a href="tel:${e.telefono}" class="dom-tel">${e.telefono}</a>
                            </div>
                            <div class="dom-entrega-dir">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:14px;height:14px;flex-shrink:0;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                                ${e.direccion}
                                <span class="dom-distancia">${e.distancia}</span>
                            </div>
                            ${e.notas ? `<div class="dom-entrega-notas">📝 ${e.notas}</div>` : ''}
                            <div class="dom-entrega-footer">
                                <span class="dom-hora">🕐 ${e.hora}</span>
                                ${e.estado === 'Completado' && e.calificacion ? `
                                    <div class="dom-calif-mini">
                                        ${'★'.repeat(e.calificacion)}${'☆'.repeat(5-e.calificacion)}
                                        <span>${e.calificacion}/5</span>
                                    </div>
                                ` : ''}
                                ${e.estado !== 'Completado' ? `
                                    <div class="dom-acciones">
                                        <button class="dom-btn-accion dom-btn-llamar" onclick="window.open('tel:${e.telefono}')">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:14px;height:14px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                            Llamar
                                        </button>
                                        <button class="dom-btn-accion dom-btn-completar" onclick="aplicacion.completarEntrega('${e.id}')">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:14px;height:14px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                                            Completar
                                        </button>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
};

AplicacionSkyHelp.prototype.completarEntrega = function(entregaId) {
    const entrega = datosSkyHelp.entregas.find(e => e.id === entregaId);
    if (!entrega) return;

    const contenido = `
        <div class="modal-encabezado" style="background:linear-gradient(135deg,#10b981,#059669);border-radius:1.5rem 1.5rem 0 0;">
            <div>
                <h3 style="color:white;">Completar Entrega</h3>
                <p style="color:rgba(255,255,255,0.85);font-size:0.875rem;margin-top:0.25rem;">${entrega.equipo} · ${entrega.cliente}</p>
            </div>
            <button class="btn-cerrar-modal" style="background:rgba(255,255,255,0.2);color:white;" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <div class="modal-cuerpo">
            <div class="calificacion-container">
                <p style="text-align:center;color:var(--gris-600);margin-bottom:1.5rem;">¿Cómo califica la atención al cliente?</p>
                <div class="estrellas-calificacion" id="estrellas-cal">
                    ${[1,2,3,4,5].map(n => `
                        <button class="estrella-btn" data-val="${n}" onclick="aplicacion._seleccionarEstrella(${n})">★</button>
                    `).join('')}
                </div>
                <p class="calificacion-texto" id="cal-texto" style="text-align:center;color:var(--gris-500);font-size:0.875rem;margin-top:0.75rem;">Selecciona una calificación</p>
            </div>
            <div class="grupo-formulario" style="margin-top:1.5rem;">
                <label>Notas de la entrega (opcional)</label>
                <textarea id="notas-entrega" rows="3" placeholder="Ej: Cliente no estaba, dejé con portero..."></textarea>
            </div>
            <input type="hidden" id="cal-valor" value="0">
        </div>
        <div class="modal-pie">
            <button class="btn btn-secundario" onclick="aplicacion.cerrarModal()">Cancelar</button>
            <button class="btn btn-primario" onclick="aplicacion._guardarEntregaCompletada('${entregaId}')">
                <svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                Confirmar Entrega
            </button>
        </div>
    `;
    this.abrirModal(contenido);
};

AplicacionSkyHelp.prototype._seleccionarEstrella = function(valor) {
    document.getElementById('cal-valor').value = valor;
    const textos = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];
    const el = document.getElementById('cal-texto');
    if (el) el.textContent = textos[valor] + ' (' + valor + '/5)';
    document.querySelectorAll('.estrella-btn').forEach((btn, i) => {
        btn.classList.toggle('activa', i < valor);
    });
};

AplicacionSkyHelp.prototype._guardarEntregaCompletada = function(entregaId) {
    const entrega = datosSkyHelp.entregas.find(e => e.id === entregaId);
    if (!entrega) return;
    const cal = parseInt(document.getElementById('cal-valor')?.value || 0);
    const notas = document.getElementById('notas-entrega')?.value || '';
    entrega.estado = 'Completado';
    entrega.calificacion = cal || null;
    entrega.notas = notas;
    this.cerrarModal();
    this.mostrarToast('✅ Entrega completada exitosamente', 'exito');
    this.cargarContenido('dashboard');
};
