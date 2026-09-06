// js/modules/auditoria.js
// Módulo de Auditorías (solo administrador) — datos reales vía Api.getAuditorias

AplicacionSkyHelp.prototype._claseInsigniaAccion = function(accion) {
    const mapa = {
        'Crear': 'insignia-verde',
        'Actualizar': 'insignia-azul',
        'Eliminar': 'insignia-rojo',
        'Inicio de sesión': 'insignia-purpura',
        'Cierre de sesión': 'insignia-naranja'
    };
    return mapa[accion] || 'insignia-azul';
};

AplicacionSkyHelp.prototype._filaAuditoria = function(a) {
    const fecha = new Date(a.fechaEvento);
    return `
        <tr>
            <td style="white-space:nowrap;font-size:0.8125rem;">${fecha.toLocaleDateString()}<br><span style="color:var(--gris-400);">${fecha.toLocaleTimeString()}</span></td>
            <td>
                <div style="display:flex;align-items:center;gap:0.625rem;">
                    <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--color-primario),var(--color-rosa));display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.8125rem;flex-shrink:0;">${(a.usuario || '?').charAt(0)}</div>
                    <span style="font-weight:500;">${a.usuario}</span>
                </div>
            </td>
            <td><span class="insignia-estado ${this._claseInsigniaAccion(a.tipoEvento)}">${a.tipoEvento}</span></td>
            <td><span style="font-size:0.8125rem;background:var(--gris-100);padding:0.25rem 0.625rem;border-radius:0.5rem;color:var(--gris-700);">${a.tablaAfectada}</span></td>
            <td style="font-size:0.875rem;color:var(--gris-600);max-width:260px;">${a.descripcion}</td>
            <td style="font-size:0.8125rem;font-family:monospace;color:var(--gris-500);">${a.direccionIp || '—'}</td>
            <td>
                <button class="btn btn-secundario" style="padding:0.375rem 0.75rem;font-size:0.8125rem;" onclick="aplicacion._verDetalleAuditoria('${a.id}')">Detalle</button>
            </td>
        </tr>`;
};

AplicacionSkyHelp.prototype.obtenerContenidoAuditoria = async function() {
    let auditorias = [];
    try {
        auditorias = await Api.getAuditorias() || [];
    } catch (e) {
        auditorias = [];
    }
    this._auditoriasCache = auditorias;

    const filas = auditorias.length === 0
        ? '<tr><td colspan="7" style="text-align:center;color:var(--gris-400);padding:2.5rem;">Sin registros de auditoría</td></tr>'
        : auditorias.map(a => this._filaAuditoria(a)).join('');

    return `
    <div class="deslizar-arriba" style="display:flex;flex-direction:column;gap:1.5rem;">
        <div class="tarjeta" style="padding:1.5rem 1.75rem;background:linear-gradient(135deg,var(--color-primario) 0%,var(--color-rosa) 100%);">
            <h2 style="color:white;margin:0 0 0.25rem;">Auditorías</h2>
            <p style="color:rgba(255,255,255,0.8);margin:0;font-size:0.9375rem;">Consulta y realiza seguimiento a las acciones realizadas dentro del sistema.</p>
        </div>

        <div class="tarjeta" style="padding:1.25rem 1.75rem;">
            <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:flex-end;">
                <div style="flex:1;min-width:180px;">
                    <label style="display:block;font-size:0.8125rem;font-weight:600;color:var(--gris-600);margin-bottom:0.375rem;">Usuario</label>
                    <input type="text" id="aud-usuario" placeholder="Buscar por usuario o descripción..." onchange="aplicacion._auditoriaFiltrar()"
                        style="width:100%;padding:0.5rem 0.875rem;border:1.5px solid var(--gris-200);border-radius:0.75rem;font-size:0.875rem;outline:none;">
                </div>
                <div style="min-width:150px;">
                    <label style="display:block;font-size:0.8125rem;font-weight:600;color:var(--gris-600);margin-bottom:0.375rem;">Acción</label>
                    <select id="aud-accion" onchange="aplicacion._auditoriaFiltrar()" style="padding:0.5rem 0.875rem;border:1.5px solid var(--gris-200);border-radius:0.75rem;font-size:0.875rem;background:white;width:100%;">
                        <option value="">Todas</option>
                        <option>Crear</option><option>Actualizar</option><option>Eliminar</option>
                        <option>Inicio de sesión</option><option>Cierre de sesión</option>
                    </select>
                </div>
                <div style="min-width:150px;">
                    <label style="display:block;font-size:0.8125rem;font-weight:600;color:var(--gris-600);margin-bottom:0.375rem;">Módulo</label>
                    <select id="aud-modulo" onchange="aplicacion._auditoriaFiltrar()" style="padding:0.5rem 0.875rem;border:1.5px solid var(--gris-200);border-radius:0.75rem;font-size:0.875rem;background:white;width:100%;">
                        <option value="">Todos</option>
                        <option>Tickets</option><option>Usuarios</option><option>Técnicos</option>
                        <option>Reportes</option><option>Auth</option>
                    </select>
                </div>
                <div style="min-width:150px;">
                    <label style="display:block;font-size:0.8125rem;font-weight:600;color:var(--gris-600);margin-bottom:0.375rem;">Desde</label>
                    <input type="date" id="aud-desde" onchange="aplicacion._auditoriaFiltrar()" style="padding:0.5rem 0.875rem;border:1.5px solid var(--gris-200);border-radius:0.75rem;font-size:0.875rem;width:100%;">
                </div>
                <div style="min-width:150px;">
                    <label style="display:block;font-size:0.8125rem;font-weight:600;color:var(--gris-600);margin-bottom:0.375rem;">Hasta</label>
                    <input type="date" id="aud-hasta" onchange="aplicacion._auditoriaFiltrar()" style="padding:0.5rem 0.875rem;border:1.5px solid var(--gris-200);border-radius:0.75rem;font-size:0.875rem;width:100%;">
                </div>
                <button class="btn btn-secundario" onclick="aplicacion._auditoriaLimpiar()" style="padding:0.5rem 1rem;font-size:0.875rem;">Limpiar</button>
            </div>
        </div>

        <div class="tarjeta" style="padding:1.75rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;flex-wrap:wrap;gap:0.75rem;">
                <h3>Registros de Auditoría</h3>
                <span id="aud-conteo" style="font-size:0.8125rem;color:var(--gris-500);">${auditorias.length} registros</span>
            </div>
            <div class="contenedor-tabla">
                <table>
                    <thead>
                        <tr>
                            <th>Fecha / Hora</th><th>Usuario</th><th>Acción</th><th>Módulo</th>
                            <th>Descripción</th><th>Dirección IP</th><th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="aud-tbody">${filas}</tbody>
                </table>
            </div>
        </div>
    </div>`;
};

AplicacionSkyHelp.prototype._auditoriaFiltrar = async function() {
    const filtros = {
        usuario: document.getElementById('aud-usuario')?.value || '',
        accion: document.getElementById('aud-accion')?.value || '',
        modulo: document.getElementById('aud-modulo')?.value || '',
        desde: document.getElementById('aud-desde')?.value || '',
        hasta: document.getElementById('aud-hasta')?.value || ''
    };

    let auditorias = [];
    try {
        auditorias = await Api.getAuditorias(filtros) || [];
    } catch (e) {
        auditorias = [];
    }
    this._auditoriasCache = auditorias;

    const body = document.getElementById('aud-tbody');
    if (!body) return;
    body.innerHTML = auditorias.length === 0
        ? '<tr><td colspan="7" style="text-align:center;color:var(--gris-400);padding:2rem;">Sin resultados</td></tr>'
        : auditorias.map(a => this._filaAuditoria(a)).join('');

    const c = document.getElementById('aud-conteo');
    if (c) c.textContent = `${auditorias.length} registros`;
};

AplicacionSkyHelp.prototype._auditoriaLimpiar = function() {
    ['aud-usuario', 'aud-accion', 'aud-modulo', 'aud-desde', 'aud-hasta'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    this._auditoriaFiltrar();
};

AplicacionSkyHelp.prototype._verDetalleAuditoria = function(id) {
    const a = (this._auditoriasCache || []).find(x => x.id === id);
    if (!a) return;
    const fecha = new Date(a.fechaEvento);
    this.abrirModal(`
        <div class="modal-encabezado">
            <h3>Detalle de Auditoría</h3>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <div class="modal-cuerpo">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;">
                <div><label style="font-size:0.8125rem;font-weight:600;color:var(--gris-500);">Fecha y Hora</label>
                    <p style="margin-top:0.25rem;">${fecha.toLocaleDateString()} — ${fecha.toLocaleTimeString()}</p></div>
                <div><label style="font-size:0.8125rem;font-weight:600;color:var(--gris-500);">Usuario</label>
                    <p style="margin-top:0.25rem;">${a.usuario}</p></div>
                <div><label style="font-size:0.8125rem;font-weight:600;color:var(--gris-500);">Acción</label>
                    <p style="margin-top:0.25rem;"><span class="insignia-estado ${this._claseInsigniaAccion(a.tipoEvento)}">${a.tipoEvento}</span></p></div>
                <div><label style="font-size:0.8125rem;font-weight:600;color:var(--gris-500);">Módulo</label>
                    <p style="margin-top:0.25rem;">${a.tablaAfectada}</p></div>
                <div style="grid-column:1/-1;"><label style="font-size:0.8125rem;font-weight:600;color:var(--gris-500);">Descripción</label>
                    <p style="margin-top:0.25rem;color:var(--gris-700);">${a.descripcion}</p></div>
                <div><label style="font-size:0.8125rem;font-weight:600;color:var(--gris-500);">Dirección IP</label>
                    <p style="margin-top:0.25rem;font-family:monospace;">${a.direccionIp || '—'}</p></div>
                <div><label style="font-size:0.8125rem;font-weight:600;color:var(--gris-500);">ID de registro afectado</label>
                    <p style="margin-top:0.25rem;font-family:monospace;font-size:0.8125rem;">${a.idRegistro}</p></div>
            </div>
        </div>
        <div class="modal-pie"><button class="btn btn-secundario" onclick="aplicacion.cerrarModal()">Cerrar</button></div>
    `);
};
