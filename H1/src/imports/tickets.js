// js/modules/tickets.js
// Métodos para gestión de tickets

AplicacionSkyHelp.prototype.obtenerContenidoTickets = function() {
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
    return tickets.map(ticket => `
        <tr>
            <td><strong>${ticket.id}</strong></td>
            <td>${ticket.equipo}</td>
            <td>${ticket.problema}</td>
            <td>${ticket.cliente}</td>
            <td>${ticket.tecnico}</td>
            <td><span class="insignia-estado ${this.obtenerClaseInsigniaEstado(ticket.estado)}">${ticket.estado}</span></td>
            <td><span class="insignia-estado ${this.obtenerClaseInsigniaPrioridad(ticket.prioridad)}">${ticket.prioridad}</span></td>
            <td>
                <div class="acciones-ticket">
                    <button class="btn btn-primario" style="padding: 0.5rem 1rem; font-size: 0.8125rem;" onclick="aplicacion.verDetalleTicket('${ticket.id}')">Ver</button>
                    <button class="btn btn-chat-mini" onclick="aplicacion.abrirChatTicket('${ticket.id}')" title="Chat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:14px;height:14px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        ${ticket.chat && ticket.chat.length > 0 ? `<span class="chat-badge-mini">${ticket.chat.length}</span>` : ''}
                    </button>
                    ${this.usuarioActual.rol === 'cliente' && ticket.estado === 'Resuelto' && !ticket.calificacionCliente ? `
                        <button class="btn btn-calificar" style="padding:0.5rem 0.875rem;font-size:0.8125rem;" onclick="aplicacion.mostrarModalCalificarTicket('${ticket.id}')">
                            ⭐ Calificar
                        </button>
                    ` : ''}
                    ${ticket.calificacionCliente ? `<span style="color:#f59e0b;font-size:0.875rem;">${'★'.repeat(ticket.calificacionCliente)}</span>` : ''}
                    ${this.usuarioActual.rol !== 'cliente' ? `<button class="btn btn-secundario" style="padding: 0.5rem 1rem; font-size: 0.8125rem;" onclick="aplicacion.mostrarModalEditarTicket('${ticket.id}')">Editar</button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
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

    const progreso = ticket.progreso || 0;
    const pasos = [
        { label: 'Recibido', icono: '📥', completado: progreso >= 10 },
        { label: 'Diagnóstico', icono: '🔍', completado: progreso >= 30 },
        { label: 'Reparación', icono: '🔧', completado: progreso >= 60 },
        { label: 'Pruebas', icono: '✅', completado: progreso >= 85 },
        { label: 'Entregado', icono: '📦', completado: progreso >= 100 }
    ];

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

            <!-- Barra de progreso del dispositivo -->
            <div class="progreso-dispositivo-card">
                <div class="progreso-dispositivo-header">
                    <div class="progreso-dispositivo-titulo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:18px;height:18px;flex-shrink:0;"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                        Estado de reparación
                    </div>
                    <div class="progreso-porcentaje-badge">${progreso}%</div>
                </div>

                <div class="progreso-barra-container">
                    <div class="progreso-barra-track">
                        <div class="progreso-barra-fill" data-target="${progreso}" style="width:0%">
                            <div class="progreso-barra-brillo"></div>
                        </div>
                    </div>
                </div>

                <div class="progreso-pasos">
                    ${pasos.map((p, i) => `
                        <div class="progreso-paso ${p.completado ? 'completado' : ''} ${i === pasos.filter(x=>x.completado).length - 1 && progreso < 100 ? 'activo' : ''}">
                            <div class="progreso-paso-icono">${p.icono}</div>
                            <div class="progreso-paso-label">${p.label}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

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
            <button class="btn btn-chat" onclick="aplicacion.cerrarModal(); setTimeout(()=>aplicacion.abrirChatTicket('${ticket.id}'),50)">
                <svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Chat con ${this.usuarioActual.rol === 'cliente' ? 'técnico' : 'cliente'}
                ${(ticket.chat && ticket.chat.length > 0) ? `<span class="chat-badge-btn">${ticket.chat.length}</span>` : ''}
            </button>
            ${this.usuarioActual.rol !== 'cliente' ? `<button class="btn btn-secundario" onclick="aplicacion.mostrarModalEditarTicket('${ticket.id}')">Editar Ticket</button>` : ''}
            ${this.usuarioActual.rol === 'cliente' && ticket.estado === 'Resuelto' && !ticket.calificacionCliente ? `
                <button class="btn btn-calificar" onclick="aplicacion.cerrarModal();setTimeout(()=>aplicacion.mostrarModalCalificarTicket('${ticket.id}'),50)">
                    <svg class="icono" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    Calificar servicio
                </button>
            ` : ''}
            ${this.usuarioActual.rol === 'cliente' && ticket.calificacionCliente ? `
                <div class="calificacion-mostrada">
                    ${'★'.repeat(ticket.calificacionCliente)}${'☆'.repeat(5-ticket.calificacionCliente)}
                    <span>Tu calificación</span>
                </div>
            ` : ''}
            <button class="btn btn-primario" onclick="aplicacion.cerrarModal()">Cerrar</button>
        </div>
    `;
    this.abrirModal(contenido, true);

    // Animar barra de progreso
    setTimeout(() => {
        const fill = document.querySelector('.progreso-barra-fill');
        if (fill) fill.style.width = fill.dataset.target + '%';
    }, 150);
};

AplicacionSkyHelp.prototype.mostrarModalNuevoTicket = function() {
    const contenido = `
        <div class="modal-encabezado ticket-wizard-header">
            <div>
                <h3>Nuevo Ticket de Soporte</h3>
                <p style="color:var(--gris-500);font-size:0.875rem;margin-top:0.25rem;">Cuéntanos qué le pasa a tu equipo</p>
            </div>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <form onsubmit="aplicacion.guardarNuevoTicket(event)" id="form-nuevo-ticket">
            <div class="modal-cuerpo ticket-wizard-body">

                <!-- Indicador de pasos -->
                <div class="wizard-pasos">
                    <div class="wizard-paso activo" id="wp-1">
                        <div class="wizard-paso-num">1</div>
                        <span>Equipo</span>
                    </div>
                    <div class="wizard-linea"></div>
                    <div class="wizard-paso" id="wp-2">
                        <div class="wizard-paso-num">2</div>
                        <span>Problema</span>
                    </div>
                    <div class="wizard-linea"></div>
                    <div class="wizard-paso" id="wp-3">
                        <div class="wizard-paso-num">3</div>
                        <span>Detalles</span>
                    </div>
                </div>

                <!-- Paso 1: Tipo de equipo -->
                <div class="wizard-seccion activa" id="ws-1">
                    <div class="wizard-seccion-titulo">¿Qué tipo de equipo tienes?</div>
                    <div class="wizard-tipos-equipo">
                        <label class="tipo-equipo-card">
                            <input type="radio" name="tipo_equipo" value="Computador de escritorio" onchange="aplicacion._wizardSeleccionarTipo(this)">
                            <div class="tipo-equipo-icono">🖥️</div>
                            <div class="tipo-equipo-nombre">Escritorio</div>
                        </label>
                        <label class="tipo-equipo-card">
                            <input type="radio" name="tipo_equipo" value="Laptop" onchange="aplicacion._wizardSeleccionarTipo(this)">
                            <div class="tipo-equipo-icono">💻</div>
                            <div class="tipo-equipo-nombre">Laptop</div>
                        </label>
                        <label class="tipo-equipo-card">
                            <input type="radio" name="tipo_equipo" value="Servidor" onchange="aplicacion._wizardSeleccionarTipo(this)">
                            <div class="tipo-equipo-icono">🖧</div>
                            <div class="tipo-equipo-nombre">Servidor</div>
                        </label>
                        <label class="tipo-equipo-card">
                            <input type="radio" name="tipo_equipo" value="Impresora" onchange="aplicacion._wizardSeleccionarTipo(this)">
                            <div class="tipo-equipo-icono">🖨️</div>
                            <div class="tipo-equipo-nombre">Impresora</div>
                        </label>
                        <label class="tipo-equipo-card">
                            <input type="radio" name="tipo_equipo" value="Monitor" onchange="aplicacion._wizardSeleccionarTipo(this)">
                            <div class="tipo-equipo-icono">🖱️</div>
                            <div class="tipo-equipo-nombre">Monitor</div>
                        </label>
                        <label class="tipo-equipo-card">
                            <input type="radio" name="tipo_equipo" value="Otro" onchange="aplicacion._wizardSeleccionarTipo(this)">
                            <div class="tipo-equipo-icono">📦</div>
                            <div class="tipo-equipo-nombre">Otro</div>
                        </label>
                    </div>
                    <div class="grupo-formulario" style="margin-top:1.5rem;">
                        <label>Modelo / Referencia del equipo *</label>
                        <input type="text" name="equipo" id="wizard-equipo" placeholder="Ej. Dell OptiPlex 7090, MacBook Air M2..." required>
                    </div>
                </div>

                <!-- Paso 2: Problema -->
                <div class="wizard-seccion" id="ws-2">
                    <div class="wizard-seccion-titulo">¿Cuál es el problema?</div>
                    <div class="wizard-problemas-rapidos">
                        <button type="button" class="problema-rapido" onclick="aplicacion._wizardProblema(this, 'No enciende')">⚡ No enciende</button>
                        <button type="button" class="problema-rapido" onclick="aplicacion._wizardProblema(this, 'Pantalla dañada')">🖥️ Pantalla dañada</button>
                        <button type="button" class="problema-rapido" onclick="aplicacion._wizardProblema(this, 'Lentitud extrema')">🐌 Muy lento</button>
                        <button type="button" class="problema-rapido" onclick="aplicacion._wizardProblema(this, 'Virus o malware')">🦠 Virus</button>
                        <button type="button" class="problema-rapido" onclick="aplicacion._wizardProblema(this, 'Teclado no funciona')">⌨️ Teclado</button>
                        <button type="button" class="problema-rapido" onclick="aplicacion._wizardProblema(this, 'No conecta a internet')">🌐 Sin internet</button>
                        <button type="button" class="problema-rapido" onclick="aplicacion._wizardProblema(this, 'Batería no carga')">🔋 Batería</button>
                        <button type="button" class="problema-rapido" onclick="aplicacion._wizardProblema(this, 'Ruido extraño')">🔊 Ruido</button>
                    </div>
                    <div class="grupo-formulario" style="margin-top:1.25rem;">
                        <label>Describe el problema con más detalle *</label>
                        <textarea name="problema" id="wizard-problema" rows="3" placeholder="Cuéntanos qué pasa exactamente, cuándo empezó, si hay mensajes de error..." required style="resize:vertical;"></textarea>
                    </div>
                    <div class="grupo-formulario">
                        <label>Prioridad *</label>
                        <div class="wizard-prioridades">
                            <label class="prioridad-card prioridad-baja">
                                <input type="radio" name="prioridad" value="Baja" required>
                                <div class="prioridad-dot"></div>
                                <span>Baja</span>
                            </label>
                            <label class="prioridad-card prioridad-media">
                                <input type="radio" name="prioridad" value="Media">
                                <div class="prioridad-dot"></div>
                                <span>Media</span>
                            </label>
                            <label class="prioridad-card prioridad-alta">
                                <input type="radio" name="prioridad" value="Alta">
                                <div class="prioridad-dot"></div>
                                <span>Alta</span>
                            </label>
                            <label class="prioridad-card prioridad-critica">
                                <input type="radio" name="prioridad" value="Crítica">
                                <div class="prioridad-dot"></div>
                                <span>Crítica</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Paso 3: Datos de contacto -->
                <div class="wizard-seccion" id="ws-3">
                    <div class="wizard-seccion-titulo">Datos de contacto</div>
                    <div class="grupo-formulario">
                        <label>Tu nombre *</label>
                        <input type="text" name="cliente" id="wizard-cliente" value="${this.usuarioActual.nombre || ''}" placeholder="Nombre completo" required>
                    </div>
                    <div class="grupo-formulario">
                        <label>Teléfono de contacto</label>
                        <input type="tel" name="telefono" placeholder="+57 300 123 4567">
                    </div>
                    <div class="grupo-formulario">
                        <label>Dirección de recogida (opcional)</label>
                        <input type="text" name="direccion" placeholder="Calle 123 #45-67, Ciudad">
                    </div>

                    <!-- Resumen -->
                    <div class="wizard-resumen" id="wizard-resumen">
                        <div class="wizard-resumen-titulo">📋 Resumen del ticket</div>
                        <div class="wizard-resumen-item"><span>Equipo:</span> <strong id="res-equipo">—</strong></div>
                        <div class="wizard-resumen-item"><span>Problema:</span> <strong id="res-problema">—</strong></div>
                        <div class="wizard-resumen-item"><span>Prioridad:</span> <strong id="res-prioridad">—</strong></div>
                    </div>
                </div>

            </div>
            <div class="modal-pie wizard-pie">
                <button type="button" class="btn btn-secundario" id="wizard-btn-atras" onclick="aplicacion._wizardAtras()" style="display:none;">
                    <svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    Atrás
                </button>
                <button type="button" class="btn btn-primario" id="wizard-btn-siguiente" onclick="aplicacion._wizardSiguiente()">
                    Siguiente
                    <svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
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
    const equipoInput = document.getElementById('wizard-equipo');
    if (equipoInput && !equipoInput.value) {
        equipoInput.value = radio.value + ' ';
        equipoInput.focus();
    }
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
        const equipo = document.getElementById('wizard-equipo')?.value.trim();
        if (!equipo) { document.getElementById('wizard-equipo')?.focus(); return; }
    }
    if (paso === 2) {
        const problema = document.getElementById('wizard-problema')?.value.trim();
        const prioridad = document.querySelector('input[name="prioridad"]:checked');
        if (!problema) { document.getElementById('wizard-problema')?.focus(); return; }
        if (!prioridad) { this.mostrarToast('⚠️ Selecciona una prioridad', 'advertencia'); return; }
        // Llenar resumen
        document.getElementById('res-equipo').textContent = document.getElementById('wizard-equipo')?.value || '—';
        document.getElementById('res-problema').textContent = problema;
        document.getElementById('res-prioridad').textContent = prioridad.value;
    }

    this._wizardIrA(paso + 1);
};

AplicacionSkyHelp.prototype._wizardAtras = function() {
    this._wizardIrA(this._wizardPaso - 1);
};

AplicacionSkyHelp.prototype._wizardIrA = function(nuevoPaso) {
    const anterior = document.getElementById(`ws-${this._wizardPaso}`);
    const siguiente = document.getElementById(`ws-${nuevoPaso}`);
    const pasoAnterior = document.getElementById(`wp-${this._wizardPaso}`);
    const pasoSiguiente = document.getElementById(`wp-${nuevoPaso}`);

    if (!siguiente) return;

    anterior?.classList.remove('activa');
    siguiente.classList.add('activa');
    pasoAnterior?.classList.remove('activo');
    if (this._wizardPaso < nuevoPaso) pasoAnterior?.classList.add('completado');
    pasoSiguiente?.classList.add('activo');

    this._wizardPaso = nuevoPaso;

    const btnAtras = document.getElementById('wizard-btn-atras');
    const btnSig = document.getElementById('wizard-btn-siguiente');
    const btnEnviar = document.getElementById('wizard-btn-enviar');

    if (btnAtras) btnAtras.style.display = nuevoPaso > 1 ? 'flex' : 'none';
    if (btnSig) btnSig.style.display = nuevoPaso < 3 ? 'flex' : 'none';
    if (btnEnviar) btnEnviar.style.display = nuevoPaso === 3 ? 'flex' : 'none';
};

AplicacionSkyHelp.prototype.guardarNuevoTicket = function(evento) {
    evento.preventDefault();
    const datos = new FormData(evento.target);
    const hoy = new Date().toISOString().split('T')[0];
    const nuevoId = `TK-${String(datosSkyHelp.tickets.length + 1).padStart(3, '0')}`;

    datosSkyHelp.tickets.unshift({
        id: nuevoId,
        equipo: datos.get('equipo'),
        problema: datos.get('problema'),
        estado: 'Pendiente',
        cliente: datos.get('cliente') || this.usuarioActual.nombre,
        tecnico: 'Sin asignar',
        prioridad: datos.get('prioridad'),
        progreso: 5,
        creado: hoy,
        actualizado: hoy,
        chat: []
    });

    this.cerrarModal();
    this.mostrarToast(`🎫 Ticket ${nuevoId} creado exitosamente`, 'exito');
    if (this.seccionActual === 'tickets') this.cargarContenido('tickets');
    else if (this.seccionActual === 'dashboard') this.cargarContenido('dashboard');
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
                    <span class="insignia-estado insignia-purpura">${ticket.equipo}</span>
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
                <div class="grupo-formulario">
                    <label>Progreso de reparación (${ticket.progreso || 0}%)</label>
                    <input type="range" name="progreso" min="0" max="100" value="${ticket.progreso || 0}" 
                        oninput="this.previousElementSibling.textContent='Progreso de reparación (' + this.value + '%)'">
                </div>
            </div>
            <div class="modal-pie">
                <button type="button" class="btn btn-secundario" onclick="aplicacion.cerrarModal()">Cancelar</button>
                <button type="submit" class="btn btn-primario">Guardar Cambios</button>
            </div>
        </form>
    `;
    this.abrirModal(contenido);
};

AplicacionSkyHelp.prototype.guardarEdicionTicket = function(evento, id) {
    evento.preventDefault();
    const datos = new FormData(evento.target);
    const indice = datosSkyHelp.tickets.findIndex(t => t.id === id);
    if (indice === -1) return;

    datosSkyHelp.tickets[indice] = {
        ...datosSkyHelp.tickets[indice],
        equipo: datos.get('equipo'),
        problema: datos.get('problema'),
        estado: datos.get('estado'),
        tecnico: datos.get('tecnico'),
        prioridad: datos.get('prioridad'),
        progreso: parseInt(datos.get('progreso') || datosSkyHelp.tickets[indice].progreso || 0),
        actualizado: new Date().toISOString().split('T')[0]
    };

    this.cerrarModal();
    this.mostrarToast(`✏️ Ticket ${id} actualizado exitosamente`, 'exito');
    if (this.seccionActual === 'tickets') this.cargarContenido('tickets');
    else if (this.seccionActual === 'dashboard') this.cargarContenido('dashboard');
};

// ===== CALIFICACIÓN DEL CLIENTE =====

AplicacionSkyHelp.prototype.mostrarModalCalificarTicket = function(ticketId) {
    const ticket = datosSkyHelp.tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    // Buscar entrega asociada para calificar también al domiciliario
    const entrega = (datosSkyHelp.entregas || []).find(e => e.ticketId === ticketId && e.estado === 'Completado');

    const contenido = `
        <div class="modal-encabezado" style="background:linear-gradient(135deg,#f59e0b,#f97316);border-radius:1.5rem 1.5rem 0 0;">
            <div>
                <h3 style="color:white;">Calificar Servicio</h3>
                <p style="color:rgba(255,255,255,0.85);font-size:0.875rem;margin-top:0.25rem;">${ticket.equipo} · ${ticket.id}</p>
            </div>
            <button class="btn-cerrar-modal" style="background:rgba(255,255,255,0.2);color:white;" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <div class="modal-cuerpo">

            <!-- Calificación al técnico -->
            <div class="calif-seccion">
                <div class="calif-persona">
                    <div class="calif-avatar" style="background:linear-gradient(135deg,var(--color-azul),#60a5fa);">
                        ${ticket.tecnico !== 'Sin asignar' ? ticket.tecnico.charAt(0) : '?'}
                    </div>
                    <div>
                        <div class="calif-nombre">${ticket.tecnico !== 'Sin asignar' ? ticket.tecnico : 'Técnico'}</div>
                        <div class="calif-rol">🔧 Técnico de reparación</div>
                    </div>
                </div>
                <p class="calif-pregunta">¿Cómo fue el servicio técnico?</p>
                <div class="estrellas-calificacion" id="estrellas-tecnico">
                    ${[1,2,3,4,5].map(n => `<button class="estrella-btn" onclick="aplicacion._calificarSeccion('tecnico',${n})">★</button>`).join('')}
                </div>
                <p id="texto-tecnico" class="calif-texto-estado">Toca las estrellas para calificar</p>
                <input type="hidden" id="val-tecnico" value="0">
            </div>

            ${entrega ? `
            <div class="calif-separador"></div>

            <!-- Calificación al domiciliario -->
            <div class="calif-seccion">
                <div class="calif-persona">
                    <div class="calif-avatar" style="background:linear-gradient(135deg,var(--color-verde),#34d399);">
                        C
                    </div>
                    <div>
                        <div class="calif-nombre">Domiciliario</div>
                        <div class="calif-rol">🚚 Recogida y entrega</div>
                    </div>
                </div>
                <p class="calif-pregunta">¿Cómo fue el servicio de domicilio?</p>
                <div class="estrellas-calificacion" id="estrellas-domiciliario">
                    ${[1,2,3,4,5].map(n => `<button class="estrella-btn" onclick="aplicacion._calificarSeccion('domiciliario',${n})">★</button>`).join('')}
                </div>
                <p id="texto-domiciliario" class="calif-texto-estado">Toca las estrellas para calificar</p>
                <input type="hidden" id="val-domiciliario" value="0">
            </div>
            ` : ''}

            <div class="grupo-formulario" style="margin-top:1.5rem;">
                <label>Comentario (opcional)</label>
                <textarea id="comentario-calificacion" rows="2" placeholder="Cuéntanos tu experiencia..."></textarea>
            </div>
        </div>
        <div class="modal-pie">
            <button class="btn btn-secundario" onclick="aplicacion.cerrarModal()">Cancelar</button>
            <button class="btn btn-primario" onclick="aplicacion._guardarCalificacionTicket('${ticketId}', ${!!entrega})">
                <svg class="icono" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Enviar Calificación
            </button>
        </div>
    `;
    this.abrirModal(contenido);
};

AplicacionSkyHelp.prototype._calificarSeccion = function(seccion, valor) {
    const textos = ['', 'Muy malo 😞', 'Malo 😕', 'Regular 😐', 'Bueno 😊', 'Excelente 🤩'];
    document.getElementById(`val-${seccion}`).value = valor;
    const el = document.getElementById(`texto-${seccion}`);
    if (el) el.textContent = textos[valor];
    document.querySelectorAll(`#estrellas-${seccion} .estrella-btn`).forEach((btn, i) => {
        btn.classList.toggle('activa', i < valor);
    });
};

AplicacionSkyHelp.prototype._guardarCalificacionTicket = function(ticketId, tieneEntrega) {
    const valTecnico = parseInt(document.getElementById('val-tecnico')?.value || 0);
    const valDom = tieneEntrega ? parseInt(document.getElementById('val-domiciliario')?.value || 0) : null;
    const comentario = document.getElementById('comentario-calificacion')?.value || '';

    if (!valTecnico) {
        this.mostrarToast('⚠️ Califica al técnico antes de enviar', 'advertencia');
        return;
    }

    const ticket = datosSkyHelp.tickets.find(t => t.id === ticketId);
    if (ticket) {
        ticket.calificacionCliente = valTecnico;
        ticket.comentarioCliente = comentario;
    }

    // Guardar calificación del domiciliario en la entrega
    if (tieneEntrega && valDom) {
        const entrega = (datosSkyHelp.entregas || []).find(e => e.ticketId === ticketId);
        if (entrega) entrega.calificacion = valDom;
    }

    this.cerrarModal();
    this.mostrarToast('⭐ ¡Gracias por tu calificación!', 'exito');
    if (this.seccionActual === 'tickets') this.cargarContenido('tickets');
    else if (this.seccionActual === 'dashboard') this.cargarContenido('dashboard');
};
