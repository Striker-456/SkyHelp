// js/modules/map.js
// Métodos para el mapa y entregas

AplicacionSkyHelp.prototype.obtenerContenidoMapa = function() {
    const titulo = this.usuarioActual.rol === 'cliente' ? 'Seguimiento de tu Equipo' : 'Mis Entregas del Día';
    const descripcion = this.usuarioActual.rol === 'cliente' 
        ? 'Rastrea la ubicación en tiempo real de tu equipo' 
        : 'Gestiona y visualiza tus entregas programadas';
    
    return `
        <div class="deslizar-arriba">
            <div style="margin-bottom: 2rem;">
                <h2>${titulo}</h2>
                <p style="color: var(--gris-600);">${descripcion}</p>
            </div>
            
            <div class="contenedor-mapa">
                <div class="marcador-mapa">
                    <div style="text-align: center;">
                        <svg style="width: 80px; height: 80px; margin-bottom: 1.5rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <div>Mapa Interactivo</div>
                        <div style="font-size: 1.125rem; opacity: 0.9; margin-top: 0.75rem;">Sistema de seguimiento GPS en tiempo real</div>
                    </div>
                </div>
                
                ${this.usuarioActual.rol === 'domiciliario' ? `
                    <div class="barra-lateral-mapa">
                        <h3 style="margin-bottom: 1.5rem;">Entregas del día</h3>
                        <div style="text-align:center;padding:2rem;color:var(--gris-600);">
                            No hay entregas asignadas por el momento
                        </div>
                    </div>
                ` : `
                    <div class="barra-lateral-mapa">
                        <h3 style="margin-bottom: 1.5rem;">Tu Equipo</h3>
                        <div style="text-align:center;padding:2rem;color:var(--gris-600);">
                            No hay equipos en seguimiento por el momento
                        </div>
                    </div>
                `}
            </div>
        </div>
    `;
};