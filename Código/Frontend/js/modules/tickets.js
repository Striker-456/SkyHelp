// js/modules/tickets.js
// Métodos para gestión de tickets

AplicacionSkyHelp.prototype.obtenerContenidoTickets = async function() {
    try {
        const rol = this.usuarioActual.rol;
        const promesas = [
            Api.getTickets(), 
            Api.getEstadosTickets(), 
            Api.getTecnicos().catch(() => []),
            Api.getUsuarios().catch(() => []),
            Api.getDomiciliarios().catch(() => [])
        ];

        const resultados = await Promise.allSettled(promesas);

        datosSkyHelp.tickets  = resultados[0].status === 'fulfilled' ? (resultados[0].value || []) : [];
        datosSkyHelp.estados  = resultados[1].status === 'fulfilled' ? (resultados[1].value || []) : [];
        datosSkyHelp.tecnicos = resultados[2].status === 'fulfilled' ? (resultados[2].value || []) : [];
        datosSkyHelp.usuarios = resultados[3].status === 'fulfilled' ? (resultados[3].value || []) : [];
        datosSkyHelp.domiciliarios = resultados[4].status === 'fulfilled' ? (resultados[4].value || []) : [];
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
                        ${(datosSkyHelp.estados || []).map(e => `<option value="${e.nombreEstado}">${e.nombreEstado}</option>`).join('')}
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
        // Si es el usuario actual, usar nombre de sesión
        const miId = this.usuarioActual.id || sessionStorage.getItem('skyhelp_id');
        if (idUsuario === miId) return this.usuarioActual.nombre;
        
        // Buscar en la lista de usuarios cargada
        const u = (datosSkyHelp.usuarios || []).find(u => u.idUsuario === idUsuario);
        if (u) {
            // Priorizar nombreCompleto sobre correo (soportar ambas variantes de case)
            return u.nombreCompleto || u.NombreCompleto || u.nombreUsuarios || u.NombreUsuarios || u.correo || u.Correo;
        }
        
        // Si no está en la lista, retornar ID corto
        return idUsuario ? `Cliente ${idUsuario.substring(0,6)}` : '—';
    };

    const getTecnico = (idTecnico) => {
        if (!idTecnico) return 'Sin asignar';
        const t = (datosSkyHelp.tecnicos || []).find(t => t.idTecnico === idTecnico);
        if (!t) return 'Sin asignar';
        return t.nombreCompleto || getNombre(t.idUsuario);
    };

    const getEstado = (idEstado) => {
        const e = (datosSkyHelp.estados || []).find(e => e.idEstado === idEstado);
        return e ? e.nombreEstado : (idEstado || '—');
    };

    const esTecnico = this.usuarioActual.rol === 'tecnico';
    const esAdmin = this.usuarioActual.rol === 'administrador';
    const miId = this.usuarioActual.id || sessionStorage.getItem('skyhelp_id');
    const miTecnico = esTecnico ? (datosSkyHelp.tecnicos || []).find(t => t.idUsuario === miId) : null;

    return tickets.map(ticket => {
        const id = ticket.idTicket || '';
        const numero = ticket.numeroTicket ? `#${ticket.numeroTicket}` : id.substring(0,8) + '...';
        const descripcion = ticket.descripcion || '';
        const categoria = ticket.categoria || '';
        const prioridad = ticket.prioridad || '';
        const estado = getEstado(ticket.idEstado);
        const cliente = getNombre(ticket.idUsuario);
        const tecnico = getTecnico(ticket.idTecnico);
        const esResuelto = estado.toLowerCase().includes('resuel');
        const puedeResolver = esAdmin && !esResuelto;
        const esMiTicketTecnico = esTecnico && miTecnico && ticket.idTecnico === miTecnico.idTecnico;
        const puedeIniciarDiagnostico = esMiTicketTecnico && !ticket.fechaDiagnostico && !esResuelto;
        const puedeFinalizarDiagnostico = esMiTicketTecnico && ticket.fechaDiagnostico && !ticket.diagnostico && !esResuelto;

        return `
        <tr>
            <td><strong>${numero}</strong></td>
            <td>${categoria}</td>
            <td>${descripcion}</td>
            <td>${cliente}</td>
            <td>${tecnico}</td>
            <td><span class="insignia-estado ${this.obtenerClaseInsigniaEstado(estado)}">${estado}</span></td>
            <td><span class="insignia-estado ${this.obtenerClaseInsigniaPrioridad(prioridad)}">${prioridad}</span></td>
            <td>
                <div class="acciones-ticket">
                    <button class="btn btn-primario" style="padding:0.5rem 1rem;font-size:0.8125rem;" onclick="aplicacion.verDetalleTicket('${id}')">Ver</button>
                    ${this.usuarioActual.rol !== 'usuario' && !esTecnico ? `<button class="btn btn-secundario" style="padding:0.5rem 1rem;font-size:0.8125rem;" onclick="aplicacion.mostrarModalEditarTicket('${id}')">Editar</button>` : ''}
                    ${esAdmin ? `<button class="btn btn-secundario" style="padding:0.5rem 1rem;font-size:0.8125rem;" onclick="aplicacion.mostrarModalAsignarTecnico('${id}')">Asignar Técnico</button>` : ''}
                    ${puedeIniciarDiagnostico ? `<button class="btn btn-secundario" style="padding:0.5rem 1rem;font-size:0.8125rem;" onclick="aplicacion.iniciarDiagnosticoTicket('${id}')">Iniciar Diagnóstico</button>` : ''}
                    ${puedeFinalizarDiagnostico ? `<button class="btn btn-exito" style="padding:0.5rem 1rem;font-size:0.8125rem;background-color:#10b981;color:white;border:none;" onclick="aplicacion.mostrarModalDiagnostico('${id}')">Finalizar Diagnóstico</button>` : ''}
                    ${puedeResolver ? `<button class="btn btn-exito" style="padding:0.5rem 1rem;font-size:0.8125rem;background-color:#10b981;color:white;border:none;" onclick="aplicacion.resolverTicket('${id}')">Resolver</button>` : ''}
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

    const estados = datosSkyHelp.estados || [];
    const usuarios = datosSkyHelp.usuarios || [];
    const tecnicos = datosSkyHelp.tecnicos || [];

    const getEstadoNombre = (idEstado) => {
        const e = estados.find(e => e.idEstado === idEstado);
        return e ? e.nombreEstado : '';
    };

    const getNombre = (idUsuario) => {
        const miId = this.usuarioActual.id || sessionStorage.getItem('skyhelp_id');
        if (idUsuario === miId) return this.usuarioActual.nombre;
        const u = usuarios.find(u => u.idUsuario === idUsuario);
        if (u) {
            return u.nombreCompleto || u.NombreCompleto || u.nombreUsuarios || u.NombreUsuarios || u.correo || u.Correo;
        }
        return idUsuario ? `Cliente ${idUsuario.substring(0,6)}` : '—';
    };

    const getTecnico = (idTecnico) => {
        if (!idTecnico) return 'Sin asignar';
        const t = tecnicos.find(t => t.idTecnico === idTecnico);
        if (!t) return 'Sin asignar';
        return t.nombreCompleto || getNombre(t.idUsuario);
    };

    const filtrados = datosSkyHelp.tickets.filter(ticket => {
        const estadoNombre = getEstadoNombre(ticket.idEstado);
        const nombreCliente = getNombre(ticket.idUsuario);
        const nombreTecnico = getTecnico(ticket.idTecnico);
        const numeroTicket = ticket.numeroTicket ? `#${ticket.numeroTicket}` : '';

        // Buscar en múltiples campos
        const coincideBusqueda = terminoBusqueda === '' || 
                                 (ticket.numeroTicket && ticket.numeroTicket.toString().includes(terminoBusqueda)) ||
                                 (ticket.idTicket || '').toLowerCase().includes(terminoBusqueda) ||
                                 (ticket.categoria || '').toLowerCase().includes(terminoBusqueda) ||
                                 (ticket.descripcion || '').toLowerCase().includes(terminoBusqueda) ||
                                 nombreCliente.toLowerCase().includes(terminoBusqueda) ||
                                 nombreTecnico.toLowerCase().includes(terminoBusqueda) ||
                                 (ticket.prioridad || '').toLowerCase().includes(terminoBusqueda);

        const coincideEstado    = filtroEstado === 'todos' || estadoNombre === filtroEstado;
        const coincidePrioridad = filtroPrioridad === 'todos' || ticket.prioridad === filtroPrioridad;
        
        return coincideBusqueda && coincideEstado && coincidePrioridad;
    });

    const cuerpoTabla = document.getElementById('cuerpo-tabla-tickets');
    if (cuerpoTabla) {
        cuerpoTabla.innerHTML = this.renderizarFilasTickets(filtrados);
    }
};

AplicacionSkyHelp.prototype.verDetalleTicket = async function(id) {
    const ticket = datosSkyHelp.tickets.find(t => (t.idTicket || t.id) === id);
    if (!ticket) return;

    const estados = datosSkyHelp.estados || [];
    const estadoObj = estados.find(e => e.idEstado === ticket.idEstado);
    const estadoNombre = estadoObj ? estadoObj.nombreEstado : '';

    let tecnicos = datosSkyHelp.tecnicos || [];
    let usuarios = datosSkyHelp.usuarios || [];
    let domiciliarios = datosSkyHelp.domiciliarios || [];
    
    // Si no hay técnicos o domiciliarios cargados, cargarlos ahora
    if (!tecnicos.length || !domiciliarios.length) {
        try {
            const resultados = await Promise.allSettled([
                tecnicos.length ? Promise.resolve(tecnicos) : Api.getTecnicos().catch(() => []),
                domiciliarios.length ? Promise.resolve(domiciliarios) : Api.getDomiciliarios().catch(() => [])
            ]);
            tecnicos = resultados[0].status === 'fulfilled' ? (resultados[0].value || []) : [];
            domiciliarios = resultados[1].status === 'fulfilled' ? (resultados[1].value || []) : [];
            
            // Guardar en cache global
            datosSkyHelp.tecnicos = tecnicos;
            datosSkyHelp.domiciliarios = domiciliarios;
        } catch(e) {
            console.error('Error cargando técnicos y domiciliarios:', e);
        }
    }
    
    const tecnicoObj = tecnicos.find(t => t.idTecnico === ticket.idTecnico);
    const domiciliarioObj = domiciliarios.find(d => d.idDomiciliario === ticket.idDomiciliario);
    
    const getNombre = (idUsuario) => {
        const miId = this.usuarioActual.id || sessionStorage.getItem('skyhelp_id');
        if (idUsuario === miId) return this.usuarioActual.nombre;
        const u = usuarios.find(u => u.idUsuario === idUsuario);
        return u ? (u.nombreCompleto || u.NombreCompleto || u.nombreUsuarios || u.NombreUsuarios) : '—';
    };
    const tecnicoNombre = tecnicoObj ? (tecnicoObj.NombreCompleto || tecnicoObj.nombreCompleto || getNombre(tecnicoObj.idUsuario)) : 'Sin asignar';
    const domiciliarioNombre = domiciliarioObj ? (domiciliarioObj.NombreCompleto || domiciliarioObj.nombreCompleto) : 'Sin asignar';
    const clienteNombre = getNombre(ticket.idUsuario) || '—';

    const fecha = ticket.fechaCreacion ? new Date(ticket.fechaCreacion).toLocaleDateString() : '—';

    const pasos = [
        { label: 'Recibido',    icono: '📥' },
        { label: 'Diagnóstico', icono: '🔍' },
        { label: 'Reparación',  icono: '🔧' },
        { label: 'Pruebas',     icono: '✅' },
        { label: 'Entregado',   icono: '📦' }
    ];

    const historial = [
        { emoji: '🎫', bg: '#dbeafe', accion: `Ticket creado`, tiempo: fecha + ' · 09:00' },
        { emoji: '👤', bg: '#ede9fe', accion: `Asignado a ${tecnicoNombre}`, tiempo: fecha + ' · 10:30' },
        { emoji: '🔧', bg: '#fef3c7', accion: 'Diagnóstico iniciado', tiempo: fecha + ' · 08:15' },
        ...(estadoNombre.toLowerCase().includes('resuel') ? [{ emoji: '✅', bg: '#d1fae5', accion: 'Ticket resuelto exitosamente', tiempo: fecha + ' · 16:45' }] : [])
    ];

    const idCorto = ticket.numeroTicket ? `#${ticket.numeroTicket}` : (id || '').substring(0, 8) + '...';

    const esTecnico = this.usuarioActual.rol === 'tecnico';
    const esAdminDetalle = this.usuarioActual.rol === 'administrador';
    const miId = this.usuarioActual.id || sessionStorage.getItem('skyhelp_id');
    const miTecnico = tecnicos.find(t => t.idUsuario === miId);
    const esMiTicketTecnico = (esAdminDetalle) || (esTecnico && miTecnico && ticket.idTecnico === miTecnico.idTecnico);
    const yaResuelto = estadoNombre.toLowerCase().includes('resuel');
    const puedeIniciarDiagnostico = esMiTicketTecnico && !ticket.fechaDiagnostico && !yaResuelto;
    const puedeFinalizarDiagnostico = esMiTicketTecnico && ticket.fechaDiagnostico && !ticket.diagnostico && !yaResuelto;

    const contenido = `
        <div class="modal-encabezado">
            <div>
                <h3>${idCorto} — ${ticket.categoria || ''}</h3>
                <div class="modal-encabezado-sub">
                    <span class="insignia-estado ${this.obtenerClaseInsigniaEstado(estadoNombre)}">${estadoNombre}</span>
                    <span class="insignia-estado ${this.obtenerClaseInsigniaPrioridad(ticket.prioridad)}">Prioridad ${ticket.prioridad || ''}</span>
                </div>
            </div>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <div class="modal-cuerpo">
            <!-- Barra de progreso -->
            <div class="progreso-dispositivo-card" style="margin-bottom:1.5rem;">
                <div class="progreso-pasos">
                    ${pasos.map((p, i) => `
                        <div class="progreso-paso ${i === 0 ? 'completado' : ''}">
                            <div class="progreso-paso-icono">${p.icono}</div>
                            <div class="progreso-paso-label">${p.label}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="info-ticket-grid">
                <div class="info-ticket-item">
                    <div class="etiqueta">EQUIPO</div>
                    <div class="valor">${ticket.categoria || '—'}</div>
                </div>
                <div class="info-ticket-item">
                    <div class="etiqueta">PROBLEMA</div>
                    <div class="valor">${ticket.descripcion || '—'}</div>
                </div>
                <div class="info-ticket-item">
                    <div class="etiqueta">CLIENTE</div>
                    <div class="valor">${clienteNombre}</div>
                </div>
                <div class="info-ticket-item">
                    <div class="etiqueta">TÉCNICO ASIGNADO</div>
                    <div class="valor">${tecnicoNombre}</div>
                </div>
                <div class="info-ticket-item">
                    <div class="etiqueta">DOMICILIARIO ASIGNADO</div>
                    <div class="valor">${domiciliarioNombre}</div>
                </div>
                <div class="info-ticket-item">
                    <div class="etiqueta">FECHA DE CREACIÓN</div>
                    <div class="valor">${fecha}</div>
                </div>
                <div class="info-ticket-item">
                    <div class="etiqueta">PRIORIDAD</div>
                    <div class="valor">${ticket.prioridad || '—'}</div>
                </div>
                <div class="info-ticket-item" style="grid-column:1/-1;">
                    <div class="etiqueta">DIAGNÓSTICO</div>
                    <div class="valor">${ticket.diagnostico || 'Pendiente por parte del técnico'}</div>
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
            ${puedeIniciarDiagnostico ? `<button class="btn btn-secundario" onclick="aplicacion.iniciarDiagnosticoTicket('${id}')">Iniciar Diagnóstico</button>` : ''}
            ${puedeFinalizarDiagnostico ? `<button class="btn btn-exito" style="background-color:#10b981;color:white;border:none;" onclick="aplicacion.mostrarModalDiagnostico('${id}')">Finalizar Diagnóstico</button>` : ''}
            ${this.usuarioActual.rol !== 'usuario' && this.usuarioActual.rol !== 'cliente' && !esTecnico ? `<button class="btn btn-secundario" onclick="aplicacion.mostrarModalEditarTicket('${id}')">Editar Ticket</button>` : ''}
            <button class="btn btn-primario" onclick="aplicacion.cerrarModal()">Cerrar</button>
        </div>
    `;
    this.abrirModal(contenido, true);
};

AplicacionSkyHelp.prototype.mostrarModalAsignarTecnico = async function(id) {
    const ticket = datosSkyHelp.tickets.find(t => (t.idTicket || t.id) === id);
    if (!ticket) return;

    let tecnicos = datosSkyHelp.tecnicos || [];
    if (!tecnicos.length) { try { tecnicos = await Api.getTecnicos() || []; datosSkyHelp.tecnicos = tecnicos; } catch (e) { tecnicos = []; } }

    const getNombreUsuario = (idUsuario) => {
        const u = (datosSkyHelp.usuarios || []).find(u => u.idUsuario === idUsuario);
        return u ? (u.nombreCompleto || u.NombreCompleto || u.nombreUsuarios || u.NombreUsuarios) : '';
    };

    const opcionesTecnicos = tecnicos.map(t =>
        `<option value="${t.idTecnico}" ${t.idTecnico === ticket.idTecnico ? 'selected' : ''}>${t.nombreCompleto || getNombreUsuario(t.idUsuario)}</option>`
    ).join('');

    const numeroDisplay = ticket.numeroTicket ? `#${ticket.numeroTicket}` : id.substring(0, 8) + '...';

    const contenido = `
        <div class="modal-encabezado">
            <div><h3>Asignar Técnico — ${numeroDisplay}</h3></div>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <form onsubmit="aplicacion.guardarAsignacionTecnico(event, '${id}')">
            <div class="modal-cuerpo">
                <div class="grupo-formulario">
                    <label>Técnico *</label>
                    <select name="idTecnico" required>${opcionesTecnicos}</select>
                </div>
            </div>
            <div class="modal-pie">
                <button type="button" class="btn btn-secundario" onclick="aplicacion.cerrarModal()">Cancelar</button>
                <button type="submit" class="btn btn-primario">Asignar</button>
            </div>
        </form>
    `;
    this.abrirModal(contenido, true);
};

AplicacionSkyHelp.prototype.guardarAsignacionTecnico = async function(evento, id) {
    evento.preventDefault();
    const idTecnico = new FormData(evento.target).get('idTecnico');
    try {
        await Api.asignarTecnico(id, idTecnico);
        this.cerrarModal();
        this.mostrarToast('✅ Técnico asignado exitosamente');
        if (this.seccionActual === 'tickets' || this.seccionActual === 'dashboard') this.cargarContenido(this.seccionActual);
    } catch (e) {
        this.mostrarToast('Error al asignar el técnico: ' + e.message, 'error');
    }
};

AplicacionSkyHelp.prototype.iniciarDiagnosticoTicket = async function(id) {
    try {
        await Api.iniciarDiagnostico(id);
        this.mostrarToast('✅ Diagnóstico iniciado');
        this.cerrarModal();
        if (this.seccionActual === 'tickets' || this.seccionActual === 'dashboard') this.cargarContenido(this.seccionActual);
    } catch (e) {
        this.mostrarToast('Error al iniciar el diagnóstico: ' + e.message, 'error');
    }
};

AplicacionSkyHelp.prototype.mostrarModalDiagnostico = async function(id) {
    const ticket = datosSkyHelp.tickets.find(t => (t.idTicket || t.id) === id);
    if (!ticket) return;

    const numeroDisplay = ticket.numeroTicket ? `#${ticket.numeroTicket}` : id.substring(0, 8) + '...';

    const contenido = `
        <div class="modal-encabezado">
            <div><h3>Registrar Diagnóstico — ${numeroDisplay}</h3></div>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <form onsubmit="aplicacion.guardarDiagnostico(event, '${id}')">
            <div class="modal-cuerpo">
                <div class="grupo-formulario">
                    <label>Diagnóstico *</label>
                    <textarea name="diagnostico" rows="4" required placeholder="Describe el diagnóstico del equipo...">${ticket.diagnostico || ''}</textarea>
                </div>
            </div>
            <div class="modal-pie">
                <button type="button" class="btn btn-secundario" onclick="aplicacion.cerrarModal()">Cancelar</button>
                <button type="submit" class="btn btn-primario">Guardar Diagnóstico</button>
            </div>
        </form>
    `;
    this.abrirModal(contenido, true);
};

AplicacionSkyHelp.prototype.guardarDiagnostico = async function(evento, id) {
    evento.preventDefault();
    const diagnostico = new FormData(evento.target).get('diagnostico');
    try {
        await Api.registrarDiagnostico(id, diagnostico);
        this.cerrarModal();
        this.mostrarToast('✅ Diagnóstico registrado exitosamente');
        if (this.seccionActual === 'tickets' || this.seccionActual === 'dashboard') this.cargarContenido(this.seccionActual);
    } catch (e) {
        this.mostrarToast('Error al registrar el diagnóstico: ' + e.message, 'error');
    }
};

AplicacionSkyHelp.prototype.mostrarModalNuevoTicket = async function() {
    const tiposEquipo = [['🖥️','Escritorio','Computador de escritorio'],['💻','Laptop','Laptop'],['🖧','Servidor','Servidor'],['🖨️','Impresora','Impresora'],['🖱️','Monitor','Monitor'],['📦','Otro','Otro']];
    const problemasRapidos = [['⚡','No enciende'],['🖥️','Pantalla dañada'],['🐌','Lentitud extrema'],['🦠','Virus o malware'],['⌨️','Teclado no funciona'],['🌐','No conecta a internet'],['🔋','Batería no carga'],['🔊','Ruido extraño']];
    const prioridades = [['Baja','prioridad-baja'],['Media','prioridad-media'],['Alta','prioridad-alta'],['Crítica','prioridad-critica']];

    const contenido = `
        <div class="modal-encabezado ticket-wizard-header">
            <div>
                <h3>Nuevo Ticket de Soporte</h3>
                <p style="color:rgba(255,255,255,0.8);font-size:0.875rem;margin-top:0.25rem;">Cuéntanos qué le pasa a tu equipo</p>
            </div>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <form onsubmit="aplicacion.guardarNuevoTicket(event)" id="form-nuevo-ticket">
            <div class="modal-cuerpo ticket-wizard-body">
                <div class="wizard-pasos">
                    <div class="wizard-paso activo" id="wp-1"><div class="wizard-paso-num">1</div><span>Equipo</span></div>
                    <div class="wizard-linea"></div>
                    <div class="wizard-paso" id="wp-2"><div class="wizard-paso-num">2</div><span>Problema</span></div>
                    <div class="wizard-linea"></div>
                    <div class="wizard-paso" id="wp-3"><div class="wizard-paso-num">3</div><span>Detalles</span></div>
                </div>
                <div class="wizard-seccion activa" id="ws-1">
                    <div class="wizard-seccion-titulo">¿Qué tipo de equipo tienes?</div>
                    <div class="wizard-tipos-equipo">
                        ${tiposEquipo.map(([ico,lbl,val]) => `<label class="tipo-equipo-card"><input type="radio" name="tipo_equipo" value="${val}" onchange="aplicacion._wizardSeleccionarTipo(this)"><div class="tipo-equipo-icono">${ico}</div><div class="tipo-equipo-nombre">${lbl}</div></label>`).join('')}
                    </div>
                    <div class="grupo-formulario" style="margin-top:1.5rem;">
                        <label>Modelo / Referencia del equipo *</label>
                        <input type="text" name="categoria" id="wizard-equipo" placeholder="Ej. Dell OptiPlex 7090, MacBook Air M2..." required>
                    </div>
                </div>
                <div class="wizard-seccion" id="ws-2">
                    <div class="wizard-seccion-titulo">¿Cuál es el problema?</div>
                    <div class="wizard-problemas-rapidos">
                        ${problemasRapidos.map(([ico,txt]) => `<button type="button" class="problema-rapido" onclick="aplicacion._wizardProblema(this,'${txt}')">${ico} ${txt}</button>`).join('')}
                    </div>
                    <div class="grupo-formulario" style="margin-top:1.25rem;">
                        <label>Describe el problema con más detalle *</label>
                        <textarea name="descripcion" id="wizard-problema" rows="3" placeholder="Cuéntanos qué pasa exactamente, cuándo empezó, si hay mensajes de error..." required></textarea>
                    </div>
                    <div class="grupo-formulario">
                        <label>Prioridad *</label>
                        <div class="wizard-prioridades">
                            ${prioridades.map(([val,cls]) => `<label class="prioridad-card ${cls}"><input type="radio" name="prioridad" value="${val}" required><div class="prioridad-dot"></div><span>${val}</span></label>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="wizard-seccion" id="ws-3">
                    <div class="wizard-seccion-titulo">Últimos detalles</div>
                    <p style="color:var(--gris-500);font-size:0.875rem;margin-bottom:1.25rem;">Un administrador asignará el técnico que atenderá tu solicitud.</p>
                    <div class="grupo-formulario">
                        <label>Dirección de recogida (opcional)</label>
                        <input type="text" name="direccion" placeholder="Calle 123 #45-67, Ciudad">
                    </div>
                    <div class="wizard-resumen">
                        <div class="wizard-resumen-titulo">📋 Resumen del ticket</div>
                        <div class="wizard-resumen-item">Equipo: <strong id="res-equipo">—</strong></div>
                        <div class="wizard-resumen-item">Problema: <strong id="res-problema">—</strong></div>
                        <div class="wizard-resumen-item">Prioridad: <strong id="res-prioridad">—</strong></div>
                    </div>
                </div>
            </div>
            <div class="modal-pie wizard-pie">
                <button type="button" class="btn btn-secundario" id="wizard-btn-atras" onclick="aplicacion._wizardAtras()" style="display:none;">← Atrás</button>
                <button type="button" class="btn btn-primario" id="wizard-btn-siguiente" onclick="aplicacion._wizardSiguiente()">Siguiente →</button>
                <button type="submit" class="btn btn-primario btn-enviar-ticket" id="wizard-btn-enviar" style="display:none;">
                    <svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>
                    Crear Ticket
                </button>
            </div>
        </form>
    `;
    this._wizardPaso = 1;
    this.abrirModal(contenido, true);
};

AplicacionSkyHelp.prototype._wizardSeleccionarTipo = function(radio) {
    document.querySelectorAll('.tipo-equipo-card').forEach(c => c.classList.remove('seleccionado'));
    radio.closest('.tipo-equipo-card').classList.add('seleccionado');
    const eq = document.getElementById('wizard-equipo');
    if (eq) { eq.value = radio.value + ' '; eq.focus(); }
};

AplicacionSkyHelp.prototype._wizardProblema = function(btn, texto) {
    document.querySelectorAll('.problema-rapido').forEach(b => b.classList.remove('seleccionado'));
    btn.classList.add('seleccionado');
    const ta = document.getElementById('wizard-problema');
    if (ta) { ta.value = texto; ta.focus(); }
};

AplicacionSkyHelp.prototype._wizardSiguiente = function() {
    const paso = this._wizardPaso;
    if (paso === 1) {
        if (!document.getElementById('wizard-equipo')?.value.trim()) { document.getElementById('wizard-equipo')?.focus(); return; }
    }
    if (paso === 2) {
        const prob = document.getElementById('wizard-problema')?.value.trim();
        const prio = document.querySelector('input[name="prioridad"]:checked');
        if (!prob) { document.getElementById('wizard-problema')?.focus(); return; }
        if (!prio) { this.mostrarToast('⚠️ Selecciona una prioridad', 'advertencia'); return; }
        document.getElementById('res-equipo').textContent   = document.getElementById('wizard-equipo')?.value || '—';
        document.getElementById('res-problema').textContent = prob;
        document.getElementById('res-prioridad').textContent = prio.value;
    }
    this._wizardIrA(paso + 1);
};

AplicacionSkyHelp.prototype._wizardAtras = function() { this._wizardIrA(this._wizardPaso - 1); };

AplicacionSkyHelp.prototype._wizardIrA = function(nuevo) {
    const ant = document.getElementById(`ws-${this._wizardPaso}`);
    const sig = document.getElementById(`ws-${nuevo}`);
    if (!sig) return;
    ant?.classList.remove('activa');
    sig.classList.add('activa');
    document.getElementById(`wp-${this._wizardPaso}`)?.classList.remove('activo');
    if (this._wizardPaso < nuevo) document.getElementById(`wp-${this._wizardPaso}`)?.classList.add('completado');
    document.getElementById(`wp-${nuevo}`)?.classList.add('activo');
    this._wizardPaso = nuevo;
    document.getElementById('wizard-btn-atras').style.display    = nuevo > 1 ? 'flex' : 'none';
    document.getElementById('wizard-btn-siguiente').style.display = nuevo < 3 ? 'flex' : 'none';
    document.getElementById('wizard-btn-enviar').style.display    = nuevo === 3 ? 'flex' : 'none';
};

AplicacionSkyHelp.prototype.guardarNuevoTicket = async function(evento) {
    evento.preventDefault();
    const datos = new FormData(evento.target);

    try {
        // Obtener estado "Pendiente"
        let estados = datosSkyHelp.estados || [];
        if (!estados.length) estados = await Api.getEstadosTickets() || [];
        const estadoPendiente = estados.find(e => e.nombreEstado?.toLowerCase().includes('pendiente'));
        if (!estadoPendiente) throw new Error('No se encontró el estado Pendiente en la BD');

        // El técnico lo asigna el Administrador después (ver mostrarModalAsignarTecnico) — el
        // cliente nunca elige quién lo atiende.
        const nuevoTicket = {
            descripcion:    datos.get('descripcion'),
            categoria:      datos.get('categoria'),
            prioridad:      datos.get('prioridad'),
            fechaCreacion:  new Date().toISOString(),
            idEstado:       estadoPendiente.idEstado,
            idUsuario:      this.usuarioActual.id || '00000000-0000-0000-0000-000000000000',
            idTecnico:      null,
            idDomiciliario: null
        };

        await Api.crearTicket(nuevoTicket);
        this.cerrarModal();
        this.mostrarToast('✅ Ticket creado exitosamente');
        if (this.seccionActual === 'tickets') this.cargarContenido('tickets');
    } catch (e) {
        this.mostrarToast('Error al crear ticket: ' + e.message, 'error');
    }
};

AplicacionSkyHelp.prototype.mostrarModalEditarTicket = async function(id) {
    const ticket = datosSkyHelp.tickets.find(t => (t.idTicket || t.id) === id);
    if (!ticket) return;

    // Cargar datos necesarios (solo estados: la edición ya no toca técnico/domiciliario, que ahora
    // tienen sus propias acciones dedicadas — ver mostrarModalAsignarTecnico y el módulo Domiciliarios).
    let estados = datosSkyHelp.estados || [];
    if (!estados.length) {
        try { estados = await Api.getEstadosTickets() || []; datosSkyHelp.estados = estados; }
        catch (e) { console.error('Error cargando estados para modal:', e); }
    }

    const prioridades = ['Baja', 'Media', 'Alta', 'Crítica'];
    const opcionSelect = (val, cur) => `<option value="${val}" ${cur === val ? 'selected' : ''}>${val}</option>`;

    const opcionesEstados = estados.map(e =>
        `<option value="${e.idEstado}" ${e.idEstado === ticket.idEstado ? 'selected' : ''}>${e.nombreEstado}</option>`
    ).join('');

    const numeroDisplay = ticket.numeroTicket ? `#${ticket.numeroTicket}` : id.substring(0,8) + '...';

    const contenido = `
        <div class="modal-encabezado">
            <div>
                <h3>Editar Ticket</h3>
                <div class="modal-encabezado-sub">
                    <span class="insignia-estado insignia-azul">${numeroDisplay}</span>
                </div>
            </div>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <form onsubmit="aplicacion.guardarEdicionTicket(event, '${id}')">
            <div class="modal-cuerpo">
                <div class="fila-formulario">
                    <div class="grupo-formulario">
                        <label>Categoría / Equipo *</label>
                        <input type="text" name="categoria" value="${ticket.categoria || ''}" required>
                    </div>
                    <div class="grupo-formulario">
                        <label>Prioridad *</label>
                        <select name="prioridad" required>
                            ${prioridades.map(p => opcionSelect(p, ticket.prioridad)).join('')}
                        </select>
                    </div>
                </div>
                <div class="grupo-formulario">
                    <label>Descripción *</label>
                    <input type="text" name="descripcion" value="${ticket.descripcion || ''}" required>
                </div>
                <div class="grupo-formulario">
                    <label>Estado *</label>
                    <select name="idEstado" required>${opcionesEstados}</select>
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

    const ticket = datosSkyHelp.tickets.find(t => (t.idTicket || t.id) === id);
    if (!ticket) {
        this.mostrarToast('Error: Ticket no encontrado', 'error');
        return;
    }

    const categoria = datos.get('categoria');
    const prioridad = datos.get('prioridad');
    const descripcion = datos.get('descripcion');
    const idEstado = datos.get('idEstado');

    try {
        await Api.actualizarDetallesTicket(id, categoria, prioridad, descripcion);
        if (idEstado && idEstado !== ticket.idEstado) {
            await Api.actualizarEstadoTicket(id, idEstado);
        }
        this.cerrarModal();
        this.mostrarToast('✅ Ticket actualizado exitosamente');
        if (this.seccionActual === 'tickets') this.cargarContenido('tickets');
        else if (this.seccionActual === 'dashboard') this.cargarContenido('dashboard');
    } catch (e) {
        console.error('Error al actualizar ticket:', e);
        this.mostrarToast('Error al actualizar ticket: ' + e.message, 'error');
    }
};

AplicacionSkyHelp.prototype.resolverTicket = async function(id) {
    const ticket = datosSkyHelp.tickets.find(t => (t.idTicket || t.id) === id);
    if (!ticket) {
        this.mostrarToast('Error: Ticket no encontrado', 'error');
        return;
    }

    // Mostrar confirmación personalizada
    this.mostrarConfirmacion(
        '¿Estás seguro de que deseas marcar este ticket como resuelto?',
        'Resolver Ticket',
        `aplicacion.confirmarResolverTicket('${id}')`,
        ''
    );
};

AplicacionSkyHelp.prototype.confirmarResolverTicket = async function(id) {
    try {
        // Obtener el estado "Resuelto"
        let estados = datosSkyHelp.estados || [];
        if (!estados.length) {
            estados = await Api.getEstadosTickets() || [];
        }
        
        const estadoResuelto = estados.find(e => e.nombreEstado?.toLowerCase().includes('resuel'));
        if (!estadoResuelto) {
            throw new Error('No se encontró el estado Resuelto en la base de datos');
        }

        const ticket = datosSkyHelp.tickets.find(t => (t.idTicket || t.id) === id);
        if (!ticket) {
            throw new Error('Ticket no encontrado');
        }

        await Api.actualizarEstadoTicket(id, estadoResuelto.idEstado);
        this.mostrarToast('✅ Ticket marcado como resuelto');
        
        // Recargar la lista de tickets
        if (this.seccionActual === 'tickets') {
            this.cargarContenido('tickets');
        } else if (this.seccionActual === 'dashboard') {
            this.cargarContenido('dashboard');
        }
    } catch (e) {
        console.error('Error al resolver ticket:', e);
        this.mostrarToast('Error al resolver ticket: ' + e.message, 'error');
    }
};
