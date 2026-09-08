// js/modules/estadisticas.js
// Módulo de Estadísticas (solo administrador) — KPIs y gráficas SVG artesanales
// alimentadas por Api.getResumenEstadisticas (sin librerías de gráficas externas).

AplicacionSkyHelp.prototype._paletaEstados = function(estado) {
    const mapa = {
        'Resuelto': '#10b981',
        'En progreso': '#3b82f6',
        'Asignado': '#a855f7',
        'Pendiente': '#f59e0b'
    };
    return mapa[estado] || '#94a3b8';
};

AplicacionSkyHelp.prototype._paletaPrioridad = function(prioridad) {
    const mapa = {
        'Crítica': '#ef4444', 'Critica': '#ef4444',
        'Alta': '#f97316',
        'Media': '#f59e0b',
        'Baja': '#10b981'
    };
    return mapa[prioridad] || '#94a3b8';
};

AplicacionSkyHelp.prototype._donaEstadisticas = function(distribucion, total) {
    if (!total) return '<p style="text-align:center;color:var(--gris-400);padding:2rem;">Sin datos</p>';
    const r = 60, cx = 80, cy = 80, stroke = 22;
    const circum = 2 * Math.PI * r;
    let offset = 0;
    const segmentos = distribucion.filter(d => d.total > 0).map(d => {
        const pct = d.total / total;
        const dash = circum * pct;
        const gap = circum - dash;
        const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
            stroke="${this._paletaEstados(d.estado)}" stroke-width="${stroke}"
            stroke-dasharray="${dash.toFixed(2)} ${gap.toFixed(2)}"
            stroke-dashoffset="${(-offset).toFixed(2)}"
            transform="rotate(-90 ${cx} ${cy})"/>`;
        offset += dash;
        return seg;
    });
    return `<svg width="160" height="160" viewBox="0 0 160 160">
        ${segmentos.join('')}
        <text x="${cx}" y="${cy - 8}" text-anchor="middle" font-size="22" font-weight="700" fill="var(--gris-800)">${total}</text>
        <text x="${cx}" y="${cy + 12}" text-anchor="middle" font-size="11" fill="var(--gris-500)">tickets</text>
    </svg>`;
};

AplicacionSkyHelp.prototype._barrasComparativa = function(meses) {
    const maxBar = Math.max(...meses.map(m => Math.max(m.resueltos, m.pendientes)), 1);
    const alturaMax = 120, anchoBar = 20, gapGrupo = 12, offsetX = 40;
    const svgW = meses.length * (anchoBar * 2 + gapGrupo + 8) + offsetX + 20;
    const barras = meses.map((m, i) => {
        const xBase = offsetX + i * (anchoBar * 2 + gapGrupo + 8);
        const h1 = (m.resueltos / maxBar) * alturaMax;
        const h2 = (m.pendientes / maxBar) * alturaMax;
        return `
            <rect x="${xBase}" y="${alturaMax + 10 - h1}" width="${anchoBar}" height="${h1}" fill="#10b981" rx="3"/>
            <rect x="${xBase + anchoBar + 4}" y="${alturaMax + 10 - h2}" width="${anchoBar}" height="${h2}" fill="#f59e0b" rx="3"/>
            <text x="${xBase + anchoBar + 2}" y="${alturaMax + 28}" text-anchor="middle" font-size="10" fill="var(--gris-500)">${m.mes}</text>
        `;
    }).join('');
    const ejeY = [0, 25, 50, 75, 100].map(pct => {
        const y = alturaMax + 10 - (pct / 100 * alturaMax);
        return `<line x1="${offsetX - 5}" y1="${y}" x2="${svgW - 10}" y2="${y}" stroke="var(--gris-100)" stroke-width="1"/>
        <text x="${offsetX - 8}" y="${y + 4}" text-anchor="end" font-size="9" fill="var(--gris-400)">${Math.round(pct / 100 * maxBar)}</text>`;
    }).join('');
    return `<svg width="${svgW}" height="170" viewBox="0 0 ${svgW} 170" style="min-width:320px;">${ejeY}${barras}</svg>`;
};

AplicacionSkyHelp.prototype.obtenerContenidoEstadisticas = async function(desde, hasta) {
    let r;
    try {
        r = await Api.getResumenEstadisticas(desde, hasta);
    } catch (e) {
        r = null;
    }
    if (!r) {
        return `<div class="deslizar-arriba"><div class="tarjeta" style="padding:2rem;text-align:center;color:var(--gris-500);">No se pudieron cargar las estadísticas.</div></div>`;
    }
    this._estadisticasCache = r;

    const kpis = [
        { label: 'Total Tickets', valor: r.totalTickets, color: 'var(--color-azul)', emoji: '🎫' },
        { label: 'Resueltos', valor: r.resueltos, color: 'var(--color-verde)', emoji: '✅' },
        { label: 'Pendientes', valor: r.pendientes, color: 'var(--color-amarillo)', emoji: '⏳' },
        { label: 'Usuarios Activos', valor: r.usuariosActivos, color: 'var(--color-purpura)', emoji: '👥' },
        { label: 'Críticos / Altos', valor: r.criticosAltos, color: 'var(--color-primario)', emoji: '🔴' },
        { label: 'Satisfacción', valor: r.satisfaccionPromedio + '%', color: 'var(--color-naranja)', emoji: '⭐' },
    ];

    const maxPrio = Math.max(...r.ticketsPorPrioridad.map(d => d.total), 1);
    const tasaResolucion = r.totalTickets ? Math.round(r.resueltos / r.totalTickets * 100) : 0;

    const filasRendimiento = r.rendimientoPorTecnico.length === 0
        ? '<tr><td colspan="5" style="text-align:center;color:var(--gris-400);padding:1.5rem;">Sin datos</td></tr>'
        : r.rendimientoPorTecnico.map(t => `
            <tr>
                <td><div style="display:flex;align-items:center;gap:0.625rem;">
                    <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--color-primario),var(--color-rosa));display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:0.8125rem;">${(t.tecnico || '?').charAt(0)}</div>
                    <strong>${t.tecnico}</strong></div></td>
                <td style="text-align:center;">${t.total}</td>
                <td style="text-align:center;color:#10b981;font-weight:600;">${t.resueltos}</td>
                <td style="text-align:center;color:#f59e0b;font-weight:600;">${t.activos}</td>
                <td><div style="display:flex;align-items:center;gap:0.5rem;">
                    <div style="flex:1;background:var(--gris-100);border-radius:999px;height:8px;overflow:hidden;">
                        <div style="width:${t.efectividad}%;height:100%;background:linear-gradient(90deg,var(--color-verde),#34d399);border-radius:999px;"></div>
                    </div>
                    <span style="font-size:0.8125rem;font-weight:600;color:var(--gris-700);min-width:2.5rem;">${t.efectividad}%</span>
                </div></td>
            </tr>`).join('');

    return `
    <div class="deslizar-arriba" style="display:flex;flex-direction:column;gap:1.5rem;">

        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
            <div>
                <h2 style="margin:0 0 0.25rem;color:var(--gris-900);">Estadísticas</h2>
                <p style="margin:0;color:var(--gris-500);font-size:0.9375rem;">Analiza el rendimiento y comportamiento de la información registrada en el sistema.</p>
            </div>
            <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
                <input type="date" id="est-desde" value="${desde || ''}" style="padding:0.5rem 0.875rem;border:1.5px solid var(--gris-200);border-radius:0.75rem;font-size:0.875rem;">
                <span style="color:var(--gris-400);font-size:0.875rem;">—</span>
                <input type="date" id="est-hasta" value="${hasta || ''}" style="padding:0.5rem 0.875rem;border:1.5px solid var(--gris-200);border-radius:0.75rem;font-size:0.875rem;">
                <button class="btn btn-primario" style="padding:0.5rem 1rem;font-size:0.875rem;" onclick="aplicacion._estadisticasAplicarFiltro()">Aplicar</button>
            </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:1.25rem;">
            ${kpis.map(k => `
            <div class="tarjeta" style="padding:1.25rem;display:flex;align-items:center;gap:0.875rem;">
                <div style="width:44px;height:44px;border-radius:0.875rem;background:${k.color};display:flex;align-items:center;justify-content:center;font-size:1.375rem;flex-shrink:0;">${k.emoji}</div>
                <div>
                    <div style="font-size:0.8rem;color:var(--gris-500);font-weight:500;line-height:1.3;">${k.label}</div>
                    <div style="font-size:1.375rem;font-weight:800;color:var(--gris-900);line-height:1.2;">${k.valor}</div>
                </div>
            </div>`).join('')}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;">
            <div class="tarjeta" style="padding:1.75rem;">
                <h3 style="margin-bottom:1.5rem;">Distribución por Estado</h3>
                <div style="display:flex;align-items:center;gap:2rem;flex-wrap:wrap;">
                    <div style="flex-shrink:0;">${this._donaEstadisticas(r.distribucionPorEstado, r.totalTickets)}</div>
                    <div style="flex:1;min-width:140px;">
                        ${r.distribucionPorEstado.map(d => `
                        <div style="display:flex;align-items:center;gap:0.625rem;margin-bottom:0.75rem;">
                            <div style="width:12px;height:12px;border-radius:3px;background:${this._paletaEstados(d.estado)};flex-shrink:0;"></div>
                            <span style="flex:1;font-size:0.875rem;color:var(--gris-600);">${d.estado}</span>
                            <span style="font-weight:700;font-size:0.9375rem;color:var(--gris-900);">${d.total}</span>
                        </div>`).join('')}
                        <div style="border-top:1px solid var(--gris-200);margin-top:0.75rem;padding-top:0.75rem;display:flex;justify-content:space-between;">
                            <span style="font-size:0.875rem;color:var(--gris-500);">Tasa de resolución</span>
                            <strong style="color:#10b981;">${tasaResolucion}%</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div class="tarjeta" style="padding:1.75rem;">
                <h3 style="margin-bottom:1.5rem;">Tickets por Prioridad</h3>
                ${r.ticketsPorPrioridad.map(d => `
                <div style="margin-bottom:1rem;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:0.375rem;font-size:0.875rem;">
                        <span style="color:var(--gris-700);font-weight:500;">${d.prioridad}</span>
                        <span style="font-weight:700;color:var(--gris-900);">${d.total}</span>
                    </div>
                    <div style="background:var(--gris-100);border-radius:999px;height:10px;overflow:hidden;">
                        <div style="width:${(d.total / maxPrio * 100).toFixed(0)}%;height:100%;background:${this._paletaPrioridad(d.prioridad)};border-radius:999px;"></div>
                    </div>
                </div>`).join('')}
            </div>
        </div>

        <div class="tarjeta" style="padding:1.75rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:0.75rem;">
                <h3>Comparativa: Resueltos vs Pendientes</h3>
                <div style="display:flex;gap:1rem;font-size:0.875rem;">
                    <div style="display:flex;align-items:center;gap:0.5rem;"><div style="width:12px;height:12px;border-radius:3px;background:#10b981;"></div><span>Resueltos</span></div>
                    <div style="display:flex;align-items:center;gap:0.5rem;"><div style="width:12px;height:12px;border-radius:3px;background:#f59e0b;"></div><span>Pendientes</span></div>
                </div>
            </div>
            <div style="overflow-x:auto;">${this._barrasComparativa(r.comparativaMensual)}</div>
        </div>

        <div class="tarjeta" style="padding:1.75rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;flex-wrap:wrap;gap:0.75rem;">
                <h3>Resumen de Rendimiento</h3>
                <span style="font-size:0.8125rem;color:var(--gris-500);">
                    ${r.rendimientoPorTecnico.length} técnico${r.rendimientoPorTecnico.length !== 1 ? 's' : ''} con actividad
                    ${r.tiempoPromedioResolucionHoras != null ? ` · Tiempo promedio de resolución: ${r.tiempoPromedioResolucionHoras}h` : ''}
                </span>
            </div>
            <div class="contenedor-tabla">
                <table>
                    <thead>
                        <tr><th>Técnico</th><th style="text-align:center;">Total</th><th style="text-align:center;">Resueltos</th><th style="text-align:center;">Activos</th><th>Efectividad</th></tr>
                    </thead>
                    <tbody>${filasRendimiento}</tbody>
                </table>
            </div>
        </div>
    </div>`;
};

AplicacionSkyHelp.prototype._estadisticasAplicarFiltro = async function() {
    const desde = document.getElementById('est-desde')?.value || '';
    const hasta = document.getElementById('est-hasta')?.value || '';
    const areaContenido = document.getElementById('area-contenido');
    areaContenido.innerHTML = '<div style="padding:2rem;text-align:center;">Cargando...</div>';
    areaContenido.innerHTML = await this.obtenerContenidoEstadisticas(desde, hasta);
};
