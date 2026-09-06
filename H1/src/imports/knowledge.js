// js/modules/knowledge.js
// Métodos para base de conocimientos

AplicacionSkyHelp.prototype.obtenerContenidoConocimiento = function() {
    return `
        <div class="deslizar-arriba">
            <div class="encabezado-tickets">
                <input type="text" class="entrada-busqueda" placeholder="Buscar artículos...">
                <button class="btn btn-primario">Nuevo Artículo</button>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
                <div class="tarjeta">
                    <h3>🔧 Problemas Comunes</h3>
                    <p style="color: var(--gris-600); margin: 1.25rem 0;">Guías para resolver los problemas más frecuentes</p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 0.75rem 0; border-bottom: 1px solid var(--gris-200);">
                            <a href="#" class="enlace">Monitor no enciende</a>
                        </li>
                        <li style="padding: 0.75rem 0; border-bottom: 1px solid var(--gris-200);">
                            <a href="#" class="enlace">Computadora lenta</a>
                        </li>
                        <li style="padding: 0.75rem 0; border-bottom: 1px solid var(--gris-200);">
                            <a href="#" class="enlace">Problemas de conexión</a>
                        </li>
                        <li style="padding: 0.75rem 0;">
                            <a href="#" class="enlace">Teclado no funciona</a>
                        </li>
                    </ul>
                </div>
                
                <div class="tarjeta">
                    <h3>📚 Tutoriales</h3>
                    <p style="color: var(--gris-600); margin: 1.25rem 0;">Aprende a usar todas las funciones del sistema</p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 0.75rem 0; border-bottom: 1px solid var(--gris-200);">
                            <a href="#" class="enlace">Cómo crear un ticket</a>
                        </li>
                        <li style="padding: 0.75rem 0; border-bottom: 1px solid var(--gris-200);">
                            <a href="#" class="enlace">Asignar técnicos</a>
                        </li>
                        <li style="padding: 0.75rem 0; border-bottom: 1px solid var(--gris-200);">
                            <a href="#" class="enlace">Generar reportes</a>
                        </li>
                        <li style="padding: 0.75rem 0;">
                            <a href="#" class="enlace">Configurar notificaciones</a>
                        </li>
                    </ul>
                </div>
                
                <div class="tarjeta">
                    <h3>❓ Preguntas Frecuentes</h3>
                    <p style="color: var(--gris-600); margin: 1.25rem 0;">Respuestas a las dudas más comunes</p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 0.75rem 0; border-bottom: 1px solid var(--gris-200);">
                            <a href="#" class="enlace">¿Cómo cambiar mi contraseña?</a>
                        </li>
                        <li style="padding: 0.75rem 0; border-bottom: 1px solid var(--gris-200);">
                            <a href="#" class="enlace">¿Puedo cancelar un ticket?</a>
                        </li>
                        <li style="padding: 0.75rem 0; border-bottom: 1px solid var(--gris-200);">
                            <a href="#" class="enlace">¿Cómo rastrear mi equipo?</a>
                        </li>
                        <li style="padding: 0.75rem 0;">
                            <a href="#" class="enlace">¿Cuánto tarda la reparación?</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `;
};