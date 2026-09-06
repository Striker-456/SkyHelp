// js/modules/reports.js
// Métodos para reportes

AplicacionSkyHelp.prototype.obtenerContenidoReportes = function() {
    return `
        <div class="deslizar-arriba">
            <div class="cuadricula-estadisticas-dashboard">
                <div class="tarjeta-estadistica-dashboard">
                    <div class="icono-estadistica" style="background: var(--color-azul)">
                        <svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                    </div>
                    <div class="info-estadistica">
                        <div class="etiqueta-estadistica-dashboard">Tiempo Promedio de Resolución</div>
                        <div class="valor-estadistica-dashboard">2.3h</div>
                    </div>
                </div>
                
                <div class="tarjeta-estadistica-dashboard">
                    <div class="icono-estadistica" style="background: var(--color-verde)">
                        <svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
                    </div>
                    <div class="info-estadistica">
                        <div class="etiqueta-estadistica-dashboard">Tasa de Satisfacción</div>
                        <div class="valor-estadistica-dashboard">98%</div>
                    </div>
                </div>
                
                <div class="tarjeta-estadistica-dashboard">
                    <div class="icono-estadistica" style="background: var(--color-purpura)">
                        <svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div class="info-estadistica">
                        <div class="etiqueta-estadistica-dashboard">Técnicos Activos</div>
                        <div class="valor-estadistica-dashboard">12</div>
                    </div>
                </div>
                
                <div class="tarjeta-estadistica-dashboard">
                    <div class="icono-estadistica" style="background: var(--color-naranja)">
                        <svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <div class="info-estadistica">
                        <div class="etiqueta-estadistica-dashboard">Ahorro Mensual</div>
                        <div class="valor-estadistica-dashboard">$4.2K</div>
                    </div>
                </div>
            </div>
            
            <div class="tarjeta">
                <h3>Reportes Disponibles</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; margin-top: 1.5rem;">
                    <button class="btn btn-secundario" style="justify-content: center; padding: 1.25rem;">
                        📊 Reporte de Tickets
                    </button>
                    <button class="btn btn-secundario" style="justify-content: center; padding: 1.25rem;">
                        👥 Reporte de Técnicos
                    </button>
                    <button class="btn btn-secundario" style="justify-content: center; padding: 1.25rem;">
                        ⏱️ Tiempos de Respuesta
                    </button>
                    <button class="btn btn-secundario" style="justify-content: center; padding: 1.25rem;">
                        😊 Satisfacción del Cliente
                    </button>
                </div>
            </div>
        </div>
    `;
};