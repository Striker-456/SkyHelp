// js/modules/history.js
// Métodos para historial de entregas

AplicacionSkyHelp.prototype.obtenerContenidoHistorial = function() {
    const historial = (datosSkyHelp.entregas || []).filter(e => e.estado === 'Completado');
    const totalCalifs = historial.filter(e => e.calificacion);
    const promedio = totalCalifs.length ? (totalCalifs.reduce((a,b) => a + b.calificacion, 0) / totalCalifs.length).toFixed(1) : '—';

    const renderEstrellas = (n) => n ? '★'.repeat(n) + '☆'.repeat(5-n) : '—';

    return `
        <div class="deslizar-arriba">
            <div class="bienvenida-cliente" style="margin-bottom:1.5rem;">
                <div class="bienvenida-texto">
                    <h2>Historial de Entregas 📋</h2>
                    <p>Registro completo de todas tus entregas y recogidas</p>
                </div>
                <div class="dom-resumen-calif">
                    <div class="dom-calif-stars" style="font-size:1.25rem;">${'★'.repeat(Math.round(parseFloat(promedio)||5))}</div>
                    <div style="font-size:0.875rem;color:var(--gris-500);">Promedio: <strong style="color:var(--gris-900);">${promedio}</strong></div>
                </div>
            </div>

            <div class="dom-stats" style="margin-bottom:2rem;">
                <div class="dom-stat dom-stat-verde">
                    <div class="dom-stat-icono">✅</div>
                    <div class="dom-stat-num">${historial.length}</div>
                    <div class="dom-stat-label">Completadas</div>
                </div>
                <div class="dom-stat dom-stat-azul">
                    <div class="dom-stat-icono">⭐</div>
                    <div class="dom-stat-num">${promedio}</div>
                    <div class="dom-stat-label">Calificación</div>
                </div>
                <div class="dom-stat dom-stat-amarillo">
                    <div class="dom-stat-icono">📦</div>
                    <div class="dom-stat-num">${historial.filter(e=>e.tipo==='Recogida').length}</div>
                    <div class="dom-stat-label">Recogidas</div>
                </div>
                <div class="dom-stat dom-stat-rojo">
                    <div class="dom-stat-icono">🚚</div>
                    <div class="dom-stat-num">${historial.filter(e=>e.tipo==='Entrega').length}</div>
                    <div class="dom-stat-label">Entregas</div>
                </div>
            </div>

            <div class="tarjeta">
                <div class="contenedor-tabla">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipo</th>
                                <th>Equipo</th>
                                <th>Cliente</th>
                                <th>Dirección</th>
                                <th>Hora</th>
                                <th>Calificación</th>
                                <th>Notas</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${historial.map(e => `
                                <tr>
                                    <td><strong>${e.id}</strong></td>
                                    <td><span class="insignia-estado ${e.tipo==='Recogida'?'insignia-purpura':'insignia-azul'}">${e.tipo}</span></td>
                                    <td>${e.equipo}</td>
                                    <td>${e.cliente}</td>
                                    <td style="font-size:0.8125rem;">${e.direccion}</td>
                                    <td>${e.hora}</td>
                                    <td>
                                        <div class="hist-estrellas ${e.calificacion >= 4 ? 'estrellas-buenas' : e.calificacion >= 3 ? 'estrellas-medias' : 'estrellas-malas'}">
                                            ${renderEstrellas(e.calificacion)}
                                        </div>
                                    </td>
                                    <td style="font-size:0.8125rem;color:var(--gris-500);">${e.notas || '—'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};