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
                        
                        <div class="item-entrega">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                                <strong>TK-001</strong>
                                <span class="insignia-estado insignia-azul">En ruta</span>
                            </div>
                            <div style="font-size: 0.9375rem; color: var(--gris-600);">
                                <div>Dell OptiPlex 7090</div>
                                <div>María González - Calle 123 #45-67</div>
                                <div style="margin-top: 0.75rem; color: var(--color-primario); font-weight: 600;">⏱️ 15 min</div>
                            </div>
                        </div>
                        
                        <div class="item-entrega">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                                <strong>TK-003</strong>
                                <span class="insignia-estado insignia-amarillo">Pendiente</span>
                            </div>
                            <div style="font-size: 0.9375rem; color: var(--gris-600);">
                                <div>MacBook Air</div>
                                <div>Ana Martínez - Carrera 89 #12-34</div>
                                <div style="margin-top: 0.75rem; color: var(--gris-600); font-weight: 600;">⏱️ 45 min</div>
                            </div>
                        </div>
                        
                        <div class="item-entrega">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                                <strong>TK-005</strong>
                                <span class="insignia-estado insignia-verde">Completado</span>
                            </div>
                            <div style="font-size: 0.9375rem; color: var(--gris-600);">
                                <div>Dell Inspiron 15</div>
                                <div>Pedro Sánchez - Avenida 56 #78-90</div>
                                <div style="margin-top: 0.75rem; color: var(--color-verde); font-weight: 600;">✓ Entregado</div>
                            </div>
                        </div>
                    </div>
                ` : `
                    <div class="barra-lateral-mapa">
                        <h3 style="margin-bottom: 1.5rem;">Tu Equipo</h3>
                        
                        <div class="item-entrega">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                                <strong>TK-001</strong>
                                <span class="insignia-estado insignia-azul">En tránsito</span>
                            </div>
                            <div style="font-size: 0.9375rem; color: var(--gris-600);">
                                <div><strong>Dell OptiPlex 7090</strong></div>
                                <div style="margin-top: 0.75rem;">Monitor no enciende</div>
                                <div style="margin-top: 0.75rem;">
                                    <div>🚚 Domiciliario: Carlos</div>
                                    <div>📍 A 2.5 km de tu ubicación</div>
                                    <div style="color: var(--color-primario); margin-top: 0.75rem; font-weight: 600;">⏱️ Llegada estimada: 15 min</div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin-top: 1.25rem; padding: 1.25rem; background: linear-gradient(135deg, var(--color-azul), #3b82f6); color: white; border-radius: 0.75rem; font-size: 0.9375rem;">
                            <strong>Estado:</strong> En camino a tu domicilio<br>
                            <strong>Técnico asignado:</strong> Juan Pérez<br>
                            <strong>Última actualización:</strong> Hace 2 min
                        </div>
                    </div>
                `}
            </div>
        </div>
    `;
};