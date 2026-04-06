// js/modules/navigation.js
// Métodos de navegación y barra lateral

AplicacionSkyHelp.prototype.inicializarBarraLateral = function() {
    if (!this.usuarioActual) return;
    
    const itemsNav = this.obtenerItemsNavPorRol(this.usuarioActual.rol);
    const navegacionBarra = document.getElementById('navegacion-barra');
    
    navegacionBarra.innerHTML = itemsNav.map(item => `
        <a class="item-nav ${item.id === 'dashboard' ? 'activo' : ''}" onclick="aplicacion.navegarA('${item.id}')" data-seccion="${item.id}">
            ${item.icono}
            <span>${item.etiqueta}</span>
        </a>
    `).join('');
    
    // Actualizar información del usuario
    document.getElementById('nombre-usuario').textContent = this.usuarioActual.nombre;
    document.getElementById('rol-usuario').textContent = this.usuarioActual.rol;
    document.getElementById('avatar-usuario').textContent = this.usuarioActual.nombre.charAt(0);
};

AplicacionSkyHelp.prototype.obtenerItemsNavPorRol = function(rol) {
    const itemsComunes = [
        {
            id: 'dashboard',
            etiqueta: 'Dashboard',
            icono: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>'
        },
        {
            id: 'tickets',
            etiqueta: 'Tickets',
            icono: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'
        }
    ];
    
    if (rol === 'administrador') {
        return [
            ...itemsComunes,
            {
                id: 'tecnicos',
                etiqueta: 'Técnicos',
                icono: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
            },
            {
                id: 'usuarios',
                etiqueta: 'Usuarios',
                icono: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
            },
            {
                id: 'reportes',
                etiqueta: 'Reportes',
                icono: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>'
            },
            {
                id: 'configuracion',
                etiqueta: 'Configuración',
                icono: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>'
            }
        ];
    } else if (rol === 'tecnico') {
        return [
            ...itemsComunes,
            {
                id: 'conocimiento',
                etiqueta: 'Base de Conocimientos',
                icono: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>'
            },
            {
                id: 'perfil',
                etiqueta: 'Mi Perfil',
                icono: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
            }
        ];
    } else if (rol === 'domiciliario') {
        return [
            {
                id: 'dashboard',
                etiqueta: 'Mis Entregas',
                icono: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="16" height="13" x="6" y="4" rx="2"/><path d="M22 7h-2M7 7H1M7 20H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h3m13 0h-3m-10 0h7M14 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/></svg>'
            },
            {
                id: 'historial',
                etiqueta: 'Historial',
                icono: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>'
            },
            {
                id: 'perfil',
                etiqueta: 'Mi Perfil',
                icono: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
            }
        ];
    } else {
        return [
            ...itemsComunes,
            {
                id: 'perfil',
                etiqueta: 'Mi Perfil',
                icono: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
            }
        ];
    }
};

AplicacionSkyHelp.prototype.alternarBarraLateral = function() {
    const barraLateral = document.getElementById('barra-lateral');
    if (!barraLateral) return;
    
    // Toggle la clase minimizada
    if (barraLateral.classList.contains('minimizada')) {
        barraLateral.classList.remove('minimizada');
        this.barraLateralAbierta = true;
    } else {
        barraLateral.classList.add('minimizada');
        this.barraLateralAbierta = false;
    }
};

AplicacionSkyHelp.prototype.navegarA = function(seccion) {
    this.seccionActual = seccion;
    
    // Actualizar elemento de navegación activo
    const itemsNav = document.querySelectorAll('.item-nav');
    itemsNav.forEach(item => {
        if (item.dataset.seccion === seccion) {
            item.classList.add('activo');
        } else {
            item.classList.remove('activo');
        }
    });
    
    // Actualizar título de página
    const titulos = {
        dashboard: 'Dashboard',
        tickets: 'Gestión de Tickets',
        tecnicos: 'Gestión de Técnicos',
        usuarios: 'Gestión de Usuarios',
        reportes: 'Reportes y Estadísticas',
        configuracion: 'Configuración',
        conocimiento: 'Base de Conocimientos',
        perfil: 'Mi Perfil',
        historial: 'Historial de Entregas'
    };
    document.getElementById('titulo-pagina').textContent = titulos[seccion] || 'Dashboard';
    
    // Cargar contenido
    this.cargarContenido(seccion);
};

AplicacionSkyHelp.prototype.cargarContenido = async function(seccion) {
    const areaContenido = document.getElementById('area-contenido');
    areaContenido.innerHTML = '<div style="padding:2rem;text-align:center;">Cargando...</div>';

    let contenido = '';
    switch (seccion) {
        case 'dashboard':
            contenido = await this.obtenerContenidoDashboard();
            break;
        case 'tickets':
            contenido = await this.obtenerContenidoTickets();
            break;
        case 'tecnicos':
            contenido = await this.obtenerContenidoTechnicos();
            break;
        case 'usuarios':
            contenido = await this.obtenerContenidoUsuarios();
            break;
        case 'reportes':
            contenido = this.obtenerContenidoReportes();
            break;
        case 'configuracion':
            contenido = this.obtenerContenidoConfiguracion();
            break;
        case 'conocimiento':
            contenido = this.obtenerContenidoConocimiento();
            break;
        case 'perfil':
            contenido = this.obtenerContenidoPerfil();
            break;
        case 'historial':
            contenido = await this.obtenerContenidoHistorial();
            break;
        default:
            contenido = await this.obtenerContenidoDashboard();
    }

    areaContenido.innerHTML = contenido;

    if (seccion === 'tickets') this.inicializarFiltrosTickets();
};