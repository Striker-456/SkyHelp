// js/modules/data.js
// Datos de SkyHelp

const datosSkyHelp = {
    // Usuarios para autenticación (necesarios para el sistema de login)
    usuariosDemo: [
        { correo: 'admin@skyhelp.com',        contrasena: 'admin123',        nombre: 'María Administradora', rol: 'administrador' },
        { correo: 'tecnico@skyhelp.com',       contrasena: 'tecnico123',      nombre: 'Juan Técnico',         rol: 'tecnico' },
        { correo: 'cliente@skyhelp.com',       contrasena: 'cliente123',      nombre: 'Ana Cliente',          rol: 'cliente' },
        { correo: 'domiciliario@skyhelp.com',  contrasena: 'domiciliario123', nombre: 'Carlos Domiciliario',  rol: 'domiciliario' }
    ],

    // Entregas (se llenan dinámicamente)
    entregas: [],

    // Tickets (se llenan dinámicamente)
    tickets: []
};
