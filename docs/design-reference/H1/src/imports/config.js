// js/modules/config.js
// Métodos para configuración

AplicacionSkyHelp.prototype.obtenerContenidoConfiguracion = function() {
    return `
        <div class="deslizar-arriba">
            <div class="tarjeta">
                <h3>Configuración General</h3>
                <div style="max-width: 650px; margin-top: 2rem;">
                    <div class="grupo-formulario">
                        <label>Nombre de la Empresa</label>
                        <input type="text" value="SkyHelp">
                    </div>
                    
                    <div class="grupo-formulario">
                        <label>Email de Contacto</label>
                        <input type="email" value="contacto@skyhelp.com">
                    </div>
                    
                    <div class="grupo-formulario">
                        <label>Teléfono</label>
                        <input type="tel" value="+57 123 456 7890">
                    </div>
                    
                    <div class="grupo-formulario">
                        <label>Dirección</label>
                        <input type="text" value="Calle 123 #45-67, Bogotá">
                    </div>
                    
                    <div class="grupo-formulario">
                        <label>Zona Horaria</label>
                        <select>
                            <option>America/Bogota (GMT-5)</option>
                            <option>America/Mexico_City (GMT-6)</option>
                            <option>America/Lima (GMT-5)</option>
                        </select>
                    </div>
                    
                    <button class="btn btn-primario">Guardar Cambios</button>
                </div>
            </div>
        </div>
    `;
};