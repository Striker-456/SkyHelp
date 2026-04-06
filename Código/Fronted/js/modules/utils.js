// js/modules/utils.js
// Métodos auxiliares

AplicacionSkyHelp.prototype.obtenerClaseInsigniaEstado = function(estado) {
    const mapa = {
        'Resuelto': 'insignia-verde',
        'En progreso': 'insignia-azul',
        'Asignado': 'insignia-purpura',
        'Pendiente': 'insignia-amarillo'
    };
    return mapa[estado] || 'insignia-azul';
};

AplicacionSkyHelp.prototype.obtenerClaseInsigniaPrioridad = function(prioridad) {
    const mapa = {
        'Crítica': 'insignia-rojo',
        'Alta': 'insignia-naranja',
        'Media': 'insignia-amarillo',
        'Baja': 'insignia-verde'
    };
    return mapa[prioridad] || 'insignia-azul';
};

AplicacionSkyHelp.prototype.mostrarDetalleCaracteristica = function(id) {
    const datos = {
        tickets: {
            titulo: 'Gestión de Tickets',
            emoji: '🎫',
            degradado: 'linear-gradient(135deg, #ef4444, #f97316)',
            subtitulo: 'Controla cada incidencia de principio a fin',
            descripcion: 'El módulo de tickets es el corazón de SkyHelp. Centraliza todas las solicitudes de soporte, permite asignarlas a los técnicos correctos y ofrece visibilidad total del proceso de reparación a todos los involucrados.',
            items: [
                { icono: '📝', titulo: 'Creación rápida', desc: 'Abre nuevos tickets en segundos con formularios inteligentes que sugieren categorías y prioridades automáticamente.' },
                { icono: '🎯', titulo: 'Asignación inteligente', desc: 'Asigna tickets al técnico más adecuado según carga de trabajo, especialidad y disponibilidad.' },
                { icono: '🔄', titulo: 'Flujo de estados', desc: 'Sigue cada ticket por sus etapas: Pendiente → Asignado → En progreso → Resuelto, con alertas en cada cambio.' },
                { icono: '⚡', titulo: 'Prioridades y SLA', desc: 'Define niveles Crítico, Alto, Medio y Bajo con tiempos de respuesta garantizados por acuerdo de nivel de servicio.' },
                { icono: '💬', titulo: 'Historial completo', desc: 'Cada ticket registra automáticamente todos los cambios, comentarios y adjuntos para total trazabilidad.' },
                { icono: '📎', titulo: 'Archivos adjuntos', desc: 'Adjunta fotos del equipo dañado, diagnósticos en PDF o presupuestos directamente al ticket.' },
            ],
            stats: [
                { valor: '60%', label: 'Menos tiempo de resolución' },
                { valor: '247+', label: 'Tickets gestionados' },
                { valor: '98%', label: 'Tasa de satisfacción' },
            ]
        },
        roles: {
            titulo: 'Múltiples Roles',
            emoji: '👥',
            degradado: 'linear-gradient(135deg, #ec4899, #a855f7)',
            subtitulo: 'Cada usuario, una experiencia personalizada',
            descripcion: 'SkyHelp adapta su interfaz y funcionalidades según el rol de cada usuario. Desde el cliente que solo quiere saber el estado de su equipo, hasta el administrador que necesita visión completa del negocio.',
            items: [
                { icono: '🏢', titulo: 'Administrador', desc: 'Acceso completo al sistema: gestión de usuarios, reportes globales, configuración del sistema y supervisión de todo el equipo.' },
                { icono: '🔧', titulo: 'Técnico', desc: 'Vista enfocada en sus tickets asignados, base de conocimientos técnica, herramientas de diagnóstico y registro de intervenciones.' },
                { icono: '👤', titulo: 'Cliente', desc: 'Panel simplificado para crear solicitudes, seguir el estado de sus equipos en tiempo real y ver el historial de reparaciones.' },
                { icono: '🚚', titulo: 'Domiciliario', desc: 'App optimizada para gestión de rutas, confirmar recogidas/entregas, y comunicarse con clientes y técnicos.' },
                { icono: '🔐', titulo: 'Permisos granulares', desc: 'Cada rol tiene acceso estrictamente a las funciones que necesita, garantizando seguridad y privacidad de la información.' },
                { icono: '🔔', titulo: 'Notificaciones por rol', desc: 'Cada usuario recibe únicamente las alertas relevantes para sus responsabilidades, evitando sobrecarga de información.' },
            ],
            stats: [
                { valor: '4', label: 'Roles especializados' },
                { valor: '50+', label: 'Usuarios simultáneos' },
                { valor: '100%', label: 'Acceso personalizado' },
            ]
        },
        domiciliarios: {
            titulo: 'Gestión de Domiciliarios',
            emoji: '🚚',
            degradado: 'linear-gradient(135deg, #a855f7, #8b5cf6)',
            subtitulo: 'Logística de recogida y entrega sin fricciones',
            descripcion: 'Coordina todo el proceso de movilización de equipos. Desde que el cliente solicita la recogida hasta que recibe su equipo reparado, el domiciliario tiene toda la información que necesita en un solo lugar.',
            items: [
                { icono: '📍', titulo: 'Seguimiento GPS', desc: 'Rastrea la ubicación del domiciliario en tiempo real. Clientes y administradores saben exactamente dónde está su equipo.' },
                { icono: '🗺️', titulo: 'Optimización de rutas', desc: 'El sistema sugiere el orden óptimo para realizar las entregas del día, ahorrando tiempo y combustible.' },
                { icono: '📦', titulo: 'Gestión de recogidas', desc: 'Programa y confirma recogidas de equipos directamente desde la app, con notificación automática al cliente.' },
                { icono: '✅', titulo: 'Confirmación digital', desc: 'El cliente firma digitalmente la recepción del equipo y recibe comprobante inmediato por correo.' },
                { icono: '🔔', titulo: 'Alertas al cliente', desc: 'El cliente recibe notificaciones automáticas cuando el domiciliario sale, está cerca y ha entregado el equipo.' },
                { icono: '📋', titulo: 'Historial de entregas', desc: 'Registro completo de todas las recogidas y entregas con timestamps, estados y firma del receptor.' },
            ],
            stats: [
                { valor: '40%', label: 'Ahorro en tiempos de entrega' },
                { valor: '15 min', label: 'Tiempo promedio de respuesta' },
                { valor: '24/7', label: 'Disponibilidad de seguimiento' },
            ]
        },
        reportes: {
            titulo: 'Reportes Detallados',
            emoji: '📊',
            degradado: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            subtitulo: 'Toma decisiones basadas en datos reales',
            descripcion: 'Transforma la operación diaria en conocimiento estratégico. SkyHelp recopila automáticamente métricas clave de todo el proceso y las presenta en dashboards visuales e informes exportables.',
            items: [
                { icono: '⏱️', titulo: 'Tiempos de respuesta', desc: 'Analiza el tiempo promedio de atención por técnico, tipo de equipo y prioridad. Identifica cuellos de botella fácilmente.' },
                { icono: '😊', titulo: 'Satisfacción del cliente', desc: 'Encuestas automáticas post-reparación con análisis de tendencias de satisfacción en el tiempo.' },
                { icono: '🔧', titulo: 'Rendimiento de técnicos', desc: 'Métricas individuales por técnico: tickets resueltos, tiempo promedio, calificaciones y especialidades.' },
                { icono: '💰', titulo: 'Análisis de costos', desc: 'Controla el costo operativo por ticket, identificando oportunidades de ahorro y áreas de inversión.' },
                { icono: '📈', titulo: 'Tendencias históricas', desc: 'Compara períodos, detecta estacionalidades y anticipa picos de demanda para planificar recursos.' },
                { icono: '📄', titulo: 'Exportación', desc: 'Genera reportes en PDF o Excel con un clic. Comparte informes ejecutivos con tu equipo directivo fácilmente.' },
            ],
            stats: [
                { valor: '2.3h', label: 'Tiempo promedio de resolución' },
                { valor: '$4.2K', label: 'Ahorro mensual promedio' },
                { valor: '15+', label: 'Tipos de reportes disponibles' },
            ]
        },
        notificaciones: {
            titulo: 'Notificaciones en Tiempo Real',
            emoji: '🔔',
            degradado: 'linear-gradient(135deg, #f59e0b, #f97316)',
            subtitulo: 'Nadie se pierde ninguna actualización importante',
            descripcion: 'El sistema de notificaciones de SkyHelp mantiene a cada usuario informado en el momento exacto en que algo relevante ocurre, sin saturar con información innecesaria.',
            items: [
                { icono: '📱', titulo: 'Notificaciones push', desc: 'Recibe alertas instantáneas en el dispositivo móvil o escritorio, incluso cuando la aplicación está cerrada.' },
                { icono: '📧', titulo: 'Correo electrónico', desc: 'Envío automático de correos con resúmenes detallados ante cambios de estado, asignaciones y resoluciones.' },
                { icono: '🔔', titulo: 'Alertas en la app', desc: 'Centro de notificaciones dentro del sistema con historial completo, marcado de leídas y filtros por tipo.' },
                { icono: '⚙️', titulo: 'Configuración personalizada', desc: 'Cada usuario decide qué tipo de eventos le generan notificación: nuevos tickets, cambios de estado, mensajes, etc.' },
                { icono: '🎯', titulo: 'Alertas por rol', desc: 'Los técnicos reciben alertas de asignaciones; los clientes, actualizaciones de su equipo; los admins, resúmenes globales.' },
                { icono: '⏰', titulo: 'Recordatorios automáticos', desc: 'El sistema envía recordatorios cuando un ticket lleva mucho tiempo sin actividad o cuando se acerca el vencimiento del SLA.' },
            ],
            stats: [
                { valor: '<1s', label: 'Tiempo de entrega de alertas' },
                { valor: '99.9%', label: 'Uptime del sistema' },
                { valor: '3', label: 'Canales de notificación' },
            ]
        },
        conocimiento: {
            titulo: 'Centro de Conocimiento',
            emoji: '📚',
            degradado: 'linear-gradient(135deg, #10b981, #059669)',
            subtitulo: 'El saber colectivo al alcance de todos',
            descripcion: 'Una base de conocimiento centralizada donde técnicos y administradores documentan soluciones, procedimientos y mejores prácticas. Reduce el tiempo de diagnóstico y mejora la calidad del servicio.',
            items: [
                { icono: '🔍', titulo: 'Búsqueda inteligente', desc: 'Motor de búsqueda potente que encuentra artículos por palabras clave, categoría, equipo o síntoma en milisegundos.' },
                { icono: '📖', titulo: 'Artículos técnicos', desc: 'Guías paso a paso para los problemas más frecuentes, con imágenes, videos y listas de verificación incluidas.' },
                { icono: '❓', titulo: 'FAQ interactivo', desc: 'Preguntas frecuentes organizadas por rol (cliente, técnico) con respuestas claras y enlaces a artículos relacionados.' },
                { icono: '🏷️', titulo: 'Categorías y etiquetas', desc: 'Organiza el contenido por marca de equipo, tipo de problema, área técnica y nivel de dificultad.' },
                { icono: '✍️', titulo: 'Creación colaborativa', desc: 'Técnicos y administradores pueden crear y editar artículos. Sistema de revisión y aprobación integrado.' },
                { icono: '📊', titulo: 'Artículos más útiles', desc: 'Métricas de uso: artículos más visitados, valoraciones de utilidad y sugerencias de mejora del contenido.' },
            ],
            stats: [
                { valor: '200+', label: 'Artículos disponibles' },
                { valor: '35%', label: 'Reducción en consultas repetidas' },
                { valor: '4.8★', label: 'Valoración promedio' },
            ]
        }
    };

    const d = datos[id];
    if (!d) return;

    const itemsHTML = d.items.map(item => `
        <div class="detalle-item">
            <div class="detalle-item-icono">${item.icono}</div>
            <div>
                <div class="detalle-item-titulo">${item.titulo}</div>
                <div class="detalle-item-desc">${item.desc}</div>
            </div>
        </div>
    `).join('');

    const statsHTML = d.stats.map(s => `
        <div class="detalle-stat">
            <div class="detalle-stat-valor">${s.valor}</div>
            <div class="detalle-stat-label">${s.label}</div>
        </div>
    `).join('');

    const contenido = `
        <div class="modal-encabezado detalle-modal-encabezado" style="background:${d.degradado};">
            <div>
                <div class="detalle-emoji">${d.emoji}</div>
                <h3 style="color:white;">${d.titulo}</h3>
                <p style="color:rgba(255,255,255,0.9);margin-top:0.375rem;font-size:0.9375rem;">${d.subtitulo}</p>
            </div>
            <button class="btn-cerrar-modal" style="background:rgba(255,255,255,0.2);color:white;" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <div class="modal-cuerpo">
            <p style="color:var(--gris-600);line-height:1.8;margin-bottom:2rem;">${d.descripcion}</p>

            <div class="detalle-stats-banda">
                ${statsHTML}
            </div>

            <h4 style="font-size:1rem;font-weight:700;color:var(--gris-800);margin:2rem 0 1.25rem;">Funcionalidades principales</h4>
            <div class="detalle-items-grid">
                ${itemsHTML}
            </div>
        </div>
        <div class="modal-pie">
            <button class="btn btn-secundario" onclick="aplicacion.cerrarModal()">Cerrar</button>
            <button class="btn btn-primario" onclick="aplicacion.cerrarModal(); aplicacion.mostrarLogin();">
                Comenzar gratis
                <svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
        </div>
    `;
    this.abrirModal(contenido, true);
};