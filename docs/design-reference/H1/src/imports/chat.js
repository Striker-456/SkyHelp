// js/modules/chat.js
// Chat entre cliente y técnico

AplicacionSkyHelp.prototype.abrirChatTicket = function(ticketId) {
    const ticket = datosSkyHelp.tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const esCliente = this.usuarioActual.rol === 'cliente';
    const esTecnico = this.usuarioActual.rol === 'tecnico';
    const otroNombre = esCliente ? ticket.tecnico : ticket.cliente;
    const otroRol = esCliente ? 'Técnico' : 'Cliente';
    const mensajes = ticket.chat || [];

    const contenido = `
        <div class="chat-modal">
            <div class="chat-encabezado">
                <div class="chat-encabezado-info">
                    <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()" style="margin-right:0.75rem;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:16px;height:16px;"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    </button>
                    <div class="chat-avatar-header">${otroNombre.charAt(0)}</div>
                    <div>
                        <div class="chat-nombre-header">${otroNombre === 'Sin asignar' ? 'Esperando técnico...' : otroNombre}</div>
                        <div class="chat-rol-header">${otroRol} · <strong>${ticket.equipo}</strong> · ${ticket.id}</div>
                    </div>
                </div>
                <div class="chat-estado-header">
                    <span class="insignia-estado ${this.obtenerClaseInsigniaEstado(ticket.estado)}">${ticket.estado}</span>
                    <button class="btn-ver-progreso" onclick="aplicacion.cerrarModal(); setTimeout(()=>aplicacion.verDetalleTicket('${ticket.id}'),50)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:16px;height:16px;"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                        Ver ticket
                    </button>
                </div>
            </div>

            <div class="chat-barra-progreso-mini">
                <div class="chat-progreso-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:14px;height:14px;"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    ${ticket.equipo} — Progreso
                </div>
                <div class="chat-progreso-valor">${ticket.progreso || 0}%</div>
                <div class="chat-barra-track">
                    <div class="chat-barra-fill" style="width: 0%" data-target="${ticket.progreso || 0}"></div>
                </div>
            </div>

            <div class="chat-mensajes" id="chat-mensajes-${ticketId}">
                <div class="chat-fecha-separador">
                    <span>${mensajes.length > 0 ? mensajes[0].fecha : 'Hoy'}</span>
                </div>
                ${mensajes.map((m, i) => {
                    // "mío" = el mensaje fue enviado por el rol actual del usuario logueado
                    const esMio = m.autor === this.usuarioActual.rol;
                    const mostrarFecha = i > 0 && m.fecha !== mensajes[i-1].fecha;
                    return `
                        ${mostrarFecha ? `<div class="chat-fecha-separador"><span>${m.fecha}</span></div>` : ''}
                        <div class="chat-burbuja-wrap ${esMio ? 'mio' : 'otro'}">
                            ${!esMio ? `<div class="chat-avatar-burbuja">${m.nombre.charAt(0)}</div>` : ''}
                            <div class="chat-burbuja ${esMio ? 'burbuja-mia' : 'burbuja-otro'}">
                                ${!esMio ? `<div class="chat-burbuja-autor">${m.nombre}</div>` : ''}
                                <div class="chat-burbuja-texto">${m.mensaje}</div>
                                <div class="chat-burbuja-hora">${m.hora} ${esMio ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:11px;height:11px;display:inline;opacity:0.7;"><path d="M20 6L9 17l-5-5"/></svg>' : ''}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
                ${mensajes.length === 0 ? `
                    <div class="chat-vacio">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        <p>Aún no hay mensajes.<br>Inicia la conversación sobre <strong>${ticket.equipo}</strong></p>
                    </div>
                ` : ''}
            </div>

            <div class="chat-input-area">
                <div class="chat-input-wrap">
                    <textarea 
                        id="chat-input-${ticketId}" 
                        class="chat-textarea" 
                        placeholder="Escribe un mensaje..."
                        rows="1"
                        onkeydown="aplicacion.chatKeyDown(event, '${ticketId}')"
                        oninput="this.style.height='auto';this.style.height=Math.min(this.scrollHeight,120)+'px'"
                    ></textarea>
                    <button class="chat-btn-enviar" onclick="aplicacion.enviarMensajeChat('${ticketId}')" title="Enviar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    this.abrirModal(contenido, true);

    // Animar barra de progreso y scroll al fondo
    setTimeout(() => {
        const fill = document.querySelector('.chat-barra-fill');
        if (fill) fill.style.width = fill.dataset.target + '%';
        const msgs = document.getElementById(`chat-mensajes-${ticketId}`);
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
    }, 100);
};

AplicacionSkyHelp.prototype.chatKeyDown = function(event, ticketId) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.enviarMensajeChat(ticketId);
    }
};

AplicacionSkyHelp.prototype.enviarMensajeChat = function(ticketId) {
    const input = document.getElementById(`chat-input-${ticketId}`);
    if (!input) return;
    const texto = input.value.trim();
    if (!texto) return;

    const ticket = datosSkyHelp.tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    if (!ticket.chat) ticket.chat = [];

    const ahora = new Date();
    const hora = ahora.toTimeString().slice(0, 5);
    const fecha = ahora.toISOString().split('T')[0];

    const nuevoMensaje = {
        autor: this.usuarioActual.rol,
        nombre: this.usuarioActual.nombre,
        mensaje: texto,
        hora,
        fecha
    };

    ticket.chat.push(nuevoMensaje);
    input.value = '';
    input.style.height = 'auto';

    // Renderizar nuevo mensaje
    const contenedor = document.getElementById(`chat-mensajes-${ticketId}`);
    if (!contenedor) return;

    const vacio = contenedor.querySelector('.chat-vacio');
    if (vacio) vacio.remove();

    const div = document.createElement('div');
    div.className = 'chat-burbuja-wrap mio chat-mensaje-nuevo';
    div.innerHTML = `
        <div class="chat-burbuja burbuja-mia">
            <div class="chat-burbuja-texto">${texto}</div>
            <div class="chat-burbuja-hora">${hora}</div>
        </div>
    `;
    contenedor.appendChild(div);
    contenedor.scrollTop = contenedor.scrollHeight;

    // Simular respuesta del técnico si es cliente
    if (this.usuarioActual.rol === 'cliente' && ticket.tecnico !== 'Sin asignar') {
        this._simularRespuesta(ticket, ticketId);
    }
};

AplicacionSkyHelp.prototype._simularRespuesta = function(ticket, ticketId) {
    const respuestas = [
        'Entendido, lo reviso ahora mismo.',
        'Gracias por la información. Estoy trabajando en ello.',
        'Recibido. Te actualizo en breve con el diagnóstico.',
        'Perfecto, ya tomé nota. Seguimos en contacto.',
        'Ok, voy a verificar eso y te confirmo.'
    ];
    const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];

    setTimeout(() => {
        const contenedor = document.getElementById(`chat-mensajes-${ticketId}`);
        if (!contenedor) return;

        // Mostrar indicador de escritura
        const typing = document.createElement('div');
        typing.className = 'chat-burbuja-wrap otro';
        typing.id = 'chat-typing';
        typing.innerHTML = `
            <div class="chat-avatar-burbuja">${ticket.tecnico.charAt(0)}</div>
            <div class="chat-burbuja burbuja-otro chat-typing-burbuja">
                <span></span><span></span><span></span>
            </div>
        `;
        contenedor.appendChild(typing);
        contenedor.scrollTop = contenedor.scrollHeight;

        setTimeout(() => {
            const typingEl = document.getElementById('chat-typing');
            if (typingEl) typingEl.remove();

            const ahora = new Date();
            const hora = ahora.toTimeString().slice(0, 5);
            const fecha = ahora.toISOString().split('T')[0];

            ticket.chat.push({ autor: 'tecnico', nombre: ticket.tecnico, mensaje: respuesta, hora, fecha });

            const div = document.createElement('div');
            div.className = 'chat-burbuja-wrap otro chat-mensaje-nuevo';
            div.innerHTML = `
                <div class="chat-avatar-burbuja">${ticket.tecnico.charAt(0)}</div>
                <div class="chat-burbuja burbuja-otro">
                    <div class="chat-burbuja-autor">${ticket.tecnico}</div>
                    <div class="chat-burbuja-texto">${respuesta}</div>
                    <div class="chat-burbuja-hora">${hora}</div>
                </div>
            `;
            contenedor.appendChild(div);
            contenedor.scrollTop = contenedor.scrollHeight;
        }, 1800);
    }, 800);
};

AplicacionSkyHelp.prototype.obtenerContenidoChats = function() {
    const tickets = datosSkyHelp.tickets.filter(t => t.chat && t.chat.length > 0);

    return `
        <div class="deslizar-arriba">
            <div class="bienvenida-cliente" style="margin-bottom:1.5rem;">
                <div class="bienvenida-texto">
                    <h2>Mis Chats 💬</h2>
                    <p>Conversaciones activas con ${this.usuarioActual.rol === 'cliente' ? 'técnicos' : 'clientes'}</p>
                </div>
            </div>

            <div class="lista-chats">
                ${tickets.length === 0 ? `
                    <div class="chat-vacio" style="padding:4rem;background:white;border-radius:1.25rem;border:1.5px solid var(--gris-200);">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        <p>No tienes chats activos aún.<br>Abre un ticket para iniciar una conversación.</p>
                    </div>
                ` : tickets.map(t => {
                    const ultimo = t.chat[t.chat.length - 1];
                    const esCliente = this.usuarioActual.rol === 'cliente';
                    const otroNombre = esCliente ? t.tecnico : t.cliente;
                    return `
                        <div class="item-chat-lista" onclick="aplicacion.abrirChatTicket('${t.id}')">
                            <div class="chat-lista-avatar">${otroNombre.charAt(0)}</div>
                            <div class="chat-lista-info">
                                <div class="chat-lista-header">
                                    <span class="chat-lista-nombre">${otroNombre === 'Sin asignar' ? 'Esperando técnico' : otroNombre}</span>
                                    <span class="chat-lista-hora">${ultimo.hora}</span>
                                </div>
                                <div class="chat-lista-ticket">${t.id} · ${t.equipo}</div>
                                <div class="chat-lista-ultimo">${ultimo.mensaje.length > 55 ? ultimo.mensaje.slice(0,55)+'...' : ultimo.mensaje}</div>
                            </div>
                            <div class="chat-lista-meta">
                                <span class="insignia-estado ${this.obtenerClaseInsigniaEstado(t.estado)}">${t.estado}</span>
                                <span class="chat-lista-count">${t.chat.length}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
};
