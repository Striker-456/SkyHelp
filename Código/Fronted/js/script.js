// SkyHelp - Sistema CRM de Gestión de Equipos
// Implementación modular en JavaScript Vanilla

// Cargar módulos
// Nota: En un entorno de producción, usaríamos un bundler como Webpack
// Para este ejemplo, incluimos los scripts en el HTML

// Inicializar aplicación
const aplicacion = new AplicacionSkyHelp();

// Retroalimentacion en vivo de la politica de contrasena
// (mismas reglas que valida el backend en RestablecerContrasena).
document.addEventListener('DOMContentLoaded', function() {
    const campoNueva = document.getElementById('nueva-contrasena');
    if (campoNueva) {
        campoNueva.addEventListener('input', function() {
            aplicacion.actualizarRequisitosContrasena(this.value);
        });
    }
});
