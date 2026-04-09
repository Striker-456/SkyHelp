// js/modules/chat.js
// Chat entre cliente y técnico — conectado a la API

AplicacionSkyHelp.prototype.abrirChatTicket = function(ticketId) {
    const ticket = datosSkyHelp.tickets.find(t => (t.idTicket || t.id) === ticketId);
    if (!ticket) return;

    const estados = datosSkyHelp.estados || [];
    const estadoNombre = (() => {
        const e = estados.find(e => e.idEstado === ticket.idEstado);
        return e ? e.nombreEstado : '';
    })();

    const contenido = `
        <div class="chat-modal">
            <div class="chat-encabezado">
                <div class="chat-encabezado-info">
                    <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()" style="margin-right:0.75rem;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:16px;height:16px;"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    </button>
                    <div class="chat-avatar-header">T</div>
                    <div>
                        <div class="chat-nombre-header">Ticket ${(ticketId||'').substring(0,8)}...</div>
                        <div class="chat-rol-header">${ticket.categoria || ticket.descripcion || ''}</div>
                    </div>
                </div>
                <div class="chat-estado-header">
                    <span class="insignia-estado ${this.obtenerClaseInsigniaEstado(estadoNombre)}">${estadoNombre}</span>
                </div>
            </div>

            <div class="chat-mensajes" id="chat-mensajes-${ticketId}">
                <div class="chat-vacio">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <p>Chat en tiempo real próximamente.<br>Por ahora usa los comentarios del ticket.</p>
                </div>
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

    const ahora = new Date();
    const hora = ahora.toTimeString().slice(0, 5);

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

    input.value = '';
    input.style.height = 'auto';
};

AplicacionSkyHelp.prototype.obtenerContenidoChats = async function() {
    let tickets = [];
    try {
        tickets = await Api.getTickets() || [];
        datosSkyHelp.tickets = tickets;
    } catch (e) {
        tickets = datosSkyHelp.tickets || [];
    }

    return `
        <div class="deslizar-arriba">
            <div class="bienvenida-cliente" style="margin-bottom:1.5rem;">
                <div class="bienvenida-texto">
                    <h2>Mis Tickets 💬</h2>
                    <p>Tus solicitudes de soporte activas</p>
                </div>
            </div>
            <div class="lista-chats">
                ${tickets.length === 0 ? `
                    <div class="chat-vacio" style="padding:4rem;background:white;border-radius:1.25rem;border:1.5px solid var(--gris-200);">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        <p>No tienes tickets activos aún.</p>
                    </div>
                ` : tickets.map(t => {
                    const id = t.idTicket || t.id || '';
                    const estados = datosSkyHelp.estados || [];
                    const estadoObj = estados.find(e => e.idEstado === t.idEstado);
                    const estadoNombre = estadoObj ? estadoObj.nombreEstado : '';
                    return `
                        <div class="item-chat-lista" onclick="aplicacion.abrirChatTicket('${id}')">
                            <div class="chat-lista-avatar">T</div>
                            <div class="chat-lista-info">
                                <div class="chat-lista-header">
                                    <span class="chat-lista-nombre">${t.categoria || 'Ticket'}</span>
                                </div>
                                <div class="chat-lista-ticket">${id.substring(0,8)}...</div>
                                <div class="chat-lista-ultimo">${t.descripcion || ''}</div>
                            </div>
                            <div class="chat-lista-meta">
                                <span class="insignia-estado ${this.obtenerClaseInsigniaEstado(estadoNombre)}">${estadoNombre}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
};
