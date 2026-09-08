// js/modules/reports.js
// Módulo de Reportes — generación y exportación real (PDF/Excel/CSV) vía la API.

AplicacionSkyHelp.prototype._tiposReporte = [
    { id: 'tickets', icono: '🎫', nombre: 'Reporte de Tickets', desc: 'Listado y análisis de todos los tickets del sistema', color: 'var(--color-azul)' },
    { id: 'usuarios', icono: '👥', nombre: 'Reporte de Usuarios', desc: 'Información y actividad de los usuarios registrados', color: 'var(--color-purpura)' },
    { id: 'actividad', icono: '📈', nombre: 'Reporte de Actividad', desc: 'Historial de acciones y eventos del sistema', color: 'var(--color-verde)' },
    { id: 'auditorias', icono: '🔍', nombre: 'Reporte de Auditorías', desc: 'Trazabilidad y control de operaciones críticas', color: 'var(--color-naranja)' },
    { id: 'rendimiento', icono: '⚡', nombre: 'Reporte de Rendimiento', desc: 'KPIs y métricas de desempeño del equipo técnico', color: 'var(--color-primario)' },
];

AplicacionSkyHelp.prototype._descargarArchivo = async function(idReporte, formato) {
    try {
        const resultado = await Api.exportarReporte(idReporte, formato);
        if (!resultado) return;
        const url = URL.createObjectURL(resultado.blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = resultado.nombreArchivo;
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();
        URL.revokeObjectURL(url);
    } catch (e) {
        this.mostrarToast('Error al exportar: ' + e.message, 'error');
    }
};

AplicacionSkyHelp.prototype._mostrarReporteGenerado = function(reporte) {
    const filas = reporte.filas.length === 0
        ? `<tr><td colspan="${reporte.columnas.length}" style="text-align:center;color:var(--gris-400);padding:1.5rem;">Sin datos para el rango seleccionado</td></tr>`
        : reporte.filas.slice(0, 200).map(fila => `
            <tr>${reporte.columnas.map(c => `<td style="font-size:0.8125rem;">${fila[c] ?? ''}</td>`).join('')}</tr>
        `).join('');

    this.abrirModal(`
        <div class="modal-encabezado">
            <h3>${reporte.titulo}</h3>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <div class="modal-cuerpo">
            <div style="display:flex;gap:0.75rem;margin-bottom:1.25rem;flex-wrap:wrap;">
                ${Object.entries(reporte.resumen || {}).map(([k, v]) => `
                    <div style="background:var(--gris-50);border-radius:0.75rem;padding:0.625rem 1rem;font-size:0.8125rem;">
                        <strong>${v}</strong> <span style="color:var(--gris-500);">${k}</span>
                    </div>`).join('')}
            </div>
            <div class="contenedor-tabla" style="max-height:360px;overflow:auto;">
                <table>
                    <thead><tr>${reporte.columnas.map(c => `<th>${c}</th>`).join('')}</tr></thead>
                    <tbody>${filas}</tbody>
                </table>
            </div>
        </div>
        <div class="modal-pie" style="gap:0.5rem;">
            <button class="btn btn-secundario" onclick="aplicacion._descargarArchivo('${reporte.idReporte}','pdf')">PDF</button>
            <button class="btn btn-secundario" onclick="aplicacion._descargarArchivo('${reporte.idReporte}','excel')">Excel</button>
            <button class="btn btn-secundario" onclick="aplicacion._descargarArchivo('${reporte.idReporte}','csv')">CSV</button>
            <button class="btn btn-primario" onclick="aplicacion.cerrarModal()">Cerrar</button>
        </div>
    `, true);
};

AplicacionSkyHelp.prototype._generarReporteTipo = async function(tipo) {
    const desde = document.getElementById('rep-desde')?.value || null;
    const hasta = document.getElementById('rep-hasta')?.value || null;
    try {
        const reporte = await Api.generarReporte({ tipo, desde, hasta });
        this._mostrarReporteGenerado(reporte);
    } catch (e) {
        this.mostrarToast('Error al generar el reporte: ' + e.message, 'error');
    }
};

AplicacionSkyHelp.prototype.obtenerContenidoReportes = async function() {
    let recientes = [];
    try {
        recientes = await Api.getReportesRecientes() || [];
    } catch (e) {
        recientes = [];
    }

    const filaRecientes = recientes.length === 0
        ? '<tr><td colspan="5" style="text-align:center;color:var(--gris-400);padding:2rem;">Sin reportes recientes generados</td></tr>'
        : recientes.map(r => `
        <tr>
            <td><strong>${r.titulo}</strong></td>
            <td style="font-size:0.8125rem;color:var(--gris-500);">${new Date(r.fechaGeneracion).toLocaleString()}</td>
            <td style="font-size:0.875rem;">${r.generadoPor}</td>
            <td><span class="insignia-estado insignia-verde">Completado</span></td>
            <td>
                <div style="display:flex;gap:0.5rem;">
                    <button class="btn btn-secundario" style="padding:0.375rem 0.75rem;font-size:0.8125rem;" onclick="aplicacion._descargarArchivo('${r.idReporte}','pdf')">PDF</button>
                    <button class="btn btn-secundario" style="padding:0.375rem 0.75rem;font-size:0.8125rem;" onclick="aplicacion._descargarArchivo('${r.idReporte}','excel')">Excel</button>
                    <button class="btn btn-secundario" style="padding:0.375rem 0.75rem;font-size:0.8125rem;" onclick="aplicacion._descargarArchivo('${r.idReporte}','csv')">CSV</button>
                </div>
            </td>
        </tr>`).join('');

    return `
    <div class="deslizar-arriba" style="display:flex;flex-direction:column;gap:1.5rem;">

        <div class="tarjeta" style="padding:1.5rem 1.75rem;background:linear-gradient(135deg,var(--color-azul) 0%,var(--color-purpura) 100%);">
            <h2 style="color:white;margin:0 0 0.25rem;">Reportes</h2>
            <p style="color:rgba(255,255,255,0.8);margin:0;font-size:0.9375rem;">Genera y consulta reportes para analizar la información del sistema.</p>
        </div>

        <div class="tarjeta" style="padding:1.25rem 1.75rem;">
            <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:flex-end;">
                <div style="min-width:150px;">
                    <label style="display:block;font-size:0.8125rem;font-weight:600;color:var(--gris-600);margin-bottom:0.375rem;">Desde</label>
                    <input type="date" id="rep-desde" style="padding:0.5rem 0.875rem;border:1.5px solid var(--gris-200);border-radius:0.75rem;font-size:0.875rem;width:100%;">
                </div>
                <div style="min-width:150px;">
                    <label style="display:block;font-size:0.8125rem;font-weight:600;color:var(--gris-600);margin-bottom:0.375rem;">Hasta</label>
                    <input type="date" id="rep-hasta" style="padding:0.5rem 0.875rem;border:1.5px solid var(--gris-200);border-radius:0.75rem;font-size:0.875rem;width:100%;">
                </div>
                <p style="margin:0;color:var(--gris-500);font-size:0.8125rem;">El rango de fechas aplica al generar cada reporte según su fecha de creación.</p>
            </div>
        </div>

        <div>
            <h3 style="margin-bottom:1rem;">Tipos de Reporte</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.25rem;">
                ${this._tiposReporte.map(r => `
                <div class="tarjeta" style="padding:1.5rem;display:flex;flex-direction:column;gap:1rem;border-top:3px solid ${r.color};">
                    <div style="font-size:2rem;">${r.icono}</div>
                    <div>
                        <div style="font-weight:700;font-size:1rem;color:var(--gris-900);margin-bottom:0.375rem;">${r.nombre}</div>
                        <div style="font-size:0.875rem;color:var(--gris-500);line-height:1.5;">${r.desc}</div>
                    </div>
                    <button class="btn btn-primario" style="font-size:0.8125rem;padding:0.5rem 0.75rem;justify-content:center;" onclick="aplicacion._generarReporteTipo('${r.id}')">Generar reporte</button>
                </div>`).join('')}
            </div>
        </div>

        <div class="tarjeta" style="padding:1.75rem;">
            <h3 style="margin-bottom:1.25rem;">Reportes Recientes</h3>
            <div class="contenedor-tabla">
                <table>
                    <thead>
                        <tr><th>Nombre del Reporte</th><th>Fecha</th><th>Generado por</th><th>Estado</th><th>Exportar</th></tr>
                    </thead>
                    <tbody>${filaRecientes}</tbody>
                </table>
            </div>
        </div>
    </div>`;
};
