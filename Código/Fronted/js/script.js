// SkyHelp - Sistema CRM de Gestión de Equipos
// Implementación en JavaScript Vanilla

class AplicacionSkyHelp {
    constructor() {
        this.vistaActual = 'inicio';
        this.usuarioActual = null;
        this.seccionActual = 'dashboard';
        this.barraLateralAbierta = true;

        // Ajusta si tu API corre en otro puerto/host
        this.apiBaseUrl = 'https://localhost:7062';
        this.tokenStorageKey = 'skyhelp_token';
        
        // Usuarios de demostración
        this.usuariosDemo = [
            { correo: 'admin@skyhelp.com', contrasena: 'admin123', nombre: 'María Administradora', rol: 'administrador' },
            { correo: 'tecnico@skyhelp.com', contrasena: 'tecnico123', nombre: 'Juan Técnico', rol: 'tecnico' },
            { correo: 'cliente@skyhelp.com', contrasena: 'cliente123', nombre: 'Ana Cliente', rol: 'cliente' },
            { correo: 'domiciliario@skyhelp.com', contrasena: 'domiciliario123', nombre: 'Carlos Domiciliario', rol: 'domiciliario' }
        ];
        
        // Datos de ejemplo de tickets
        this.tickets = [
            { id: 'TK-001', equipo: 'Dell OptiPlex 7090', problema: 'Monitor no enciende', estado: 'En progreso', cliente: 'María González', tecnico: 'Juan Pérez', prioridad: 'Alta', creado: '2024-01-15', actualizado: '2024-01-16' },
            { id: 'TK-002', equipo: 'HP ProDesk 400 G7', problema: 'No enciende', estado: 'Pendiente', cliente: 'Carlos López', tecnico: 'Sin asignar', prioridad: 'Crítica', creado: '2024-01-16', actualizado: '2024-01-16' },
            { id: 'TK-003', equipo: 'MacBook Air', problema: 'Teclado no funciona', estado: 'Asignado', cliente: 'Ana Martínez', tecnico: 'Pedro Rodríguez', prioridad: 'Media', creado: '2024-01-14', actualizado: '2024-01-15' },
            { id: 'TK-004', equipo: 'Lenovo ThinkCentre M720', problema: 'Lentitud extrema', estado: 'Resuelto', cliente: 'Luis Rodríguez', tecnico: 'Ana García', prioridad: 'Baja', creado: '2024-01-10', actualizado: '2024-01-12' },
            { id: 'TK-005', equipo: 'Dell Inspiron 15', problema: 'Pantalla rota', estado: 'En progreso', cliente: 'Pedro Sánchez', tecnico: 'Juan Pérez', prioridad: 'Alta', creado: '2024-01-17', actualizado: '2024-01-17' }
        ];
        
        this.inicializar();
    }
    
    inicializar() {
        console.log('Aplicación SkyHelp inicializada');
        this.mostrarVista('inicio');
    }
    
    // Gestión de Vistas
    mostrarVista(nombreVista) {
        const vistas = document.querySelectorAll('.vista');
        vistas.forEach(vista => vista.classList.remove('activa'));
        
        const vistaObjetivo = document.getElementById(`pagina-${nombreVista}`) || document.getElementById(`vista-${nombreVista}`);
        if (vistaObjetivo) {
            vistaObjetivo.classList.add('activa');
            this.vistaActual = nombreVista;
        }
    }
    
    mostrarInicio() {
        this.mostrarVista('inicio');
    }
    
    mostrarLogin() {
        this.mostrarVista('login');
    }
    
    mostrarApp() {
        this.mostrarVista('aplicacion');
        this.inicializarBarraLateral();
        this.navegarA('dashboard');
    }
    
    // Gestión de Pestañas
    cambiarPestana(nombrePestana) {
        const pestanas = document.querySelectorAll('.pestana');
        const contenidosPestana = document.querySelectorAll('.contenido-pestana');
        
        pestanas.forEach(pestana => {
            if (pestana.dataset.pestana === nombrePestana) {
                pestana.classList.add('activa');
            } else {
                pestana.classList.remove('activa');
            }
        });
        
        contenidosPestana.forEach(contenido => {
            if (contenido.id === `pestana-${nombrePestana}`) {
                contenido.classList.add('activa');
            } else {
                contenido.classList.remove('activa');
            }
        });
    }
    
    // Alternar Contraseña
    alternarContrasena(idInput) {
        const input = document.getElementById(idInput);
        if (input.type === 'password') {
            input.type = 'text';
        } else {
            input.type = 'password';
        }
    }
    
    // Networking / JWT
    obtenerTokenGuardado() {
        return localStorage.getItem(this.tokenStorageKey);
    }

    guardarToken(token) {
        if (!token) return;
        localStorage.setItem(this.tokenStorageKey, token);
    }

    limpiarToken() {
        localStorage.removeItem(this.tokenStorageKey);
    }

    mapearRol(nombreRol) {
        const raw = (nombreRol || '').toString().toLowerCase();
        if (raw.includes('admin')) return 'administrador';
        if (raw.includes('tecnico')) return 'tecnico';
        if (raw.includes('cliente')) return 'cliente';
        if (raw.includes('domicili')) return 'domiciliario';
        return raw || 'cliente';
    }

    async apiRequest(path, { method = 'GET', body = null, auth = false } = {}) {
        const url = `${this.apiBaseUrl}${path}`;
        const headers = {};

        if (body !== null) headers['Content-Type'] = 'application/json';

        if (auth) {
            const token = this.obtenerTokenGuardado();
            if (!token) throw new Error('No hay token JWT. Inicia sesión.');
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(url, {
            method,
            headers,
            body: body !== null ? JSON.stringify(body) : undefined
        });

        const text = await res.text();
        if (!res.ok) {
            let msg = text;
            try {
                const parsed = text ? JSON.parse(text) : null;
                msg = parsed?.mensaje || parsed?.title || parsed?.detail || text;
            } catch {
                // ignore
            }
            throw new Error(`HTTP ${res.status}: ${msg}`);
        }

        if (!text) return null;
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    }

    async obtenerUsuarioPorCorreo(correo) {
        // Nota: tu backend tiene el endpoint "ObtnerUsuariosPorCorreo" (typo incluido).
        return await this.apiRequest(
            `/api/Usuarios/ObtnerUsuariosPorCorreo?Correo=${encodeURIComponent(correo)}`,
            { auth: true }
        );
    }

    async obtenerRolPorId(idRol) {
        return await this.apiRequest(
            `/api/Rol/ObtenerRolPorID?ID=${encodeURIComponent(idRol)}`,
            { auth: true }
        );
    }

    async cargarTicketsDesdeApi() {
        // Cargar datos base (tickets + catálogos) para renderizar nombres
        const [tickets, estados, usuarios, tecnicos] = await Promise.all([
            this.apiRequest('/api/Tickets/ObtenerTickets', { auth: true }),
            this.apiRequest('/api/EstadosTickets/ObtenerEstadosTickets', { auth: true }),
            this.apiRequest('/api/Usuarios/ObtenerUsuarios', { auth: true }),
            this.apiRequest('/api/Tecnicos/ObtenerTecnicos', { auth: true })
        ]);

        const estadosMap = new Map((estados || []).map(e => [e.IdEstado, e.NombreEstado]));
        const usuariosMap = new Map((usuarios || []).map(u => [
            u.IdUsuario,
            u.NombreCompleto || u.NombreUsuarios || u.Correo
        ]));
        const tecnicosMap = new Map((tecnicos || []).map(t => [t.IdTecnico, t.IdUsuario]));

        this.tickets = (tickets || []).map(t => {
            const estadoNombre = estadosMap.get(t.IdEstado) || (t.IdEstado ? t.IdEstado.toString() : '');
            const clienteNombre = usuariosMap.get(t.IdUsuario) || (t.IdUsuario ? t.IdUsuario.toString() : '');

            const tecnicoUsuarioId = tecnicosMap.get(t.IdTecnico);
            const tecnicoNombre = tecnicoUsuarioId ? usuariosMap.get(tecnicoUsuarioId) : '';

            return {
                id: t.IdTicket,
                equipo: t.Categoria || '',
                problema: t.Descripcion || '',
                cliente: clienteNombre || 'Sin asignar',
                tecnico: tecnicoNombre || 'Sin asignar',
                estado: estadoNombre || 'Pendiente',
                prioridad: t.Prioridad || '',
                creado: t.FechaCreacion ? new Date(t.FechaCreacion).toLocaleDateString() : ''
            };
        });
    }
    
    // Autenticación
    async manejarLogin(evento) {
        evento.preventDefault();
        
        const datosFormulario = new FormData(evento.target);
        const correo = datosFormulario.get('correo');
        const contrasena = datosFormulario.get('contrasena');
        
        this.mostrarCarga();

        try {
            const resp = await this.apiRequest('/api/Auth/login', {
                method: 'POST',
                body: { Correo: correo, Contrasena: contrasena },
                auth: false
            });

            const token = resp?.Token || resp?.token;
            if (!token) throw new Error('No se recibió Token JWT del backend.');

            this.guardarToken(token);

            const usuario = await this.obtenerUsuarioPorCorreo(correo);
            const rol = await this.obtenerRolPorId(usuario.IdRol);

            this.usuarioActual = {
                nombre: usuario.NombreCompleto || usuario.NombreUsuarios || correo,
                correo: usuario.Correo || correo,
                rol: this.mapearRol(rol?.NombreRol || rol?.nombreRol || rol?.nombre || '')
            };

            await this.cargarTicketsDesdeApi();

            this.ocultarCarga();
            this.mostrarApp();
        } catch (err) {
            this.ocultarCarga();
            alert(`Error al iniciar sesión o cargar datos.\n${err?.message || err}`);
        }
    }
    
    manejarRegistro(evento) {
        evento.preventDefault();
        
        const datosFormulario = new FormData(evento.target);
        const nombre = datosFormulario.get('nombre');
        const correo = datosFormulario.get('correo');
        const rol = datosFormulario.get('rol');
        const contrasena = datosFormulario.get('contrasena');
        const confirmarContrasena = datosFormulario.get('confirmarContrasena');
        
        if (contrasena !== confirmarContrasena) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        if (!nombre || !correo || !rol || !contrasena) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }
        
        this.mostrarCarga();
        
        setTimeout(() => {
            this.usuarioActual = { nombre, correo, rol };
            this.ocultarCarga();
            this.mostrarApp();
        }, 1500);
    }
    
    cerrarSesion() {
        this.limpiarToken();
        this.usuarioActual = null;
        this.mostrarInicio();
    }
    
    // Carga
    mostrarCarga() {
        const pantallaCarga = document.getElementById('pantalla-carga');
        pantallaCarga.classList.remove('oculto');
    }
    
    ocultarCarga() {
        const pantallaCarga = document.getElementById('pantalla-carga');
        pantallaCarga.classList.add('oculto');
    }
    
    // Barra Lateral
    inicializarBarraLateral() {
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
    }
    
    obtenerItemsNavPorRol(rol) {
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
    }
    
    alternarBarraLateral() {
        const barraLateral = document.getElementById('barra-lateral');
        this.barraLateralAbierta = !this.barraLateralAbierta;
        
        if (this.barraLateralAbierta) {
            barraLateral.classList.remove('contraida');
            barraLateral.classList.add('abierta');
        } else {
            barraLateral.classList.add('contraida');
            barraLateral.classList.remove('abierta');
        }
    }
    
    // Navegación
    navegarA(seccion) {
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
    }
    
    // Carga de Contenido
    cargarContenido(seccion) {
        const areaContenido = document.getElementById('area-contenido');
        
        switch (seccion) {
            case 'dashboard':
                areaContenido.innerHTML = this.obtenerContenidoDashboard();
                break;
            case 'tickets':
                areaContenido.innerHTML = this.obtenerContenidoTickets();
                this.inicializarFiltrosTickets();
                break;
            case 'usuarios':
                areaContenido.innerHTML = this.obtenerContenidoUsuarios();
                break;
            case 'reportes':
                areaContenido.innerHTML = this.obtenerContenidoReportes();
                break;
            case 'configuracion':
                areaContenido.innerHTML = this.obtenerContenidoConfiguracion();
                break;
            case 'conocimiento':
                areaContenido.innerHTML = this.obtenerContenidoConocimiento();
                break;
            case 'perfil':
                areaContenido.innerHTML = this.obtenerContenidoPerfil();
                break;
            case 'historial':
                areaContenido.innerHTML = this.obtenerContenidoHistorial();
                break;
            default:
                areaContenido.innerHTML = this.obtenerContenidoDashboard();
        }
    }
    
    // Contenido del Dashboard
    obtenerContenidoDashboard() {
        const estadisticas = this.obtenerEstadisticasPorRol(this.usuarioActual.rol);
        
        if (this.usuarioActual.rol === 'cliente' || this.usuarioActual.rol === 'domiciliario') {
            return this.obtenerContenidoMapa();
        }
        
        return `
            <div class="deslizar-arriba">
                <div class="cuadricula-estadisticas-dashboard">
                    ${estadisticas.map(est => `
                        <div class="tarjeta-estadistica-dashboard">
                            <div class="icono-estadistica" style="background: ${est.color}">
                                ${est.icono}
                            </div>
                            <div class="info-estadistica">
                                <div class="etiqueta-estadistica-dashboard">${est.etiqueta}</div>
                                <div class="valor-estadistica-dashboard">${est.valor}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="tarjeta">
                    <h3>Tickets Recientes</h3>
                    <div class="contenedor-tabla">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Equipo</th>
                                    <th>Problema</th>
                                    <th>Cliente</th>
                                    <th>Estado</th>
                                    <th>Prioridad</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.tickets.slice(0, 5).map(ticket => `
                                    <tr>
                                        <td><strong>${ticket.id}</strong></td>
                                        <td>${ticket.equipo}</td>
                                        <td>${ticket.problema}</td>
                                        <td>${ticket.cliente}</td>
                                        <td><span class="insignia-estado ${this.obtenerClaseInsigniaEstado(ticket.estado)}">${ticket.estado}</span></td>
                                        <td><span class="insignia-estado ${this.obtenerClaseInsigniaPrioridad(ticket.prioridad)}">${ticket.prioridad}</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
    
    obtenerEstadisticasPorRol(rol) {
        const mapaIconos = {
            grafico: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>',
            reloj: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
            verificar: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>',
            alerta: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
            herramienta: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
            usuarios: '<svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
        };
        
        switch (rol) {
            case 'administrador':
                return [
                    { etiqueta: 'Tickets Totales', valor: '247', icono: mapaIconos.grafico, color: 'var(--color-azul)' },
                    { etiqueta: 'Pendientes', valor: '45', icono: mapaIconos.reloj, color: 'var(--color-amarillo)' },
                    { etiqueta: 'Resueltos Hoy', valor: '12', icono: mapaIconos.verificar, color: 'var(--color-verde)' },
                    { etiqueta: 'Críticos', valor: '3', icono: mapaIconos.alerta, color: 'var(--color-primario)' }
                ];
            case 'tecnico':
                return [
                    { etiqueta: 'Mis Tickets', valor: '18', icono: mapaIconos.herramienta, color: 'var(--color-azul)' },
                    { etiqueta: 'En Progreso', valor: '7', icono: mapaIconos.reloj, color: 'var(--color-amarillo)' },
                    { etiqueta: 'Completados', valor: '142', icono: mapaIconos.verificar, color: 'var(--color-verde)' },
                    { etiqueta: 'Urgentes', valor: '2', icono: mapaIconos.alerta, color: 'var(--color-primario)' }
                ];
            default:
                return [
                    { etiqueta: 'Entregas Hoy', valor: '8', icono: mapaIconos.usuarios, color: 'var(--color-azul)' },
                    { etiqueta: 'En Ruta', valor: '3', icono: mapaIconos.reloj, color: 'var(--color-amarillo)' },
                    { etiqueta: 'Completadas', valor: '67', icono: mapaIconos.verificar, color: 'var(--color-verde)' },
                    { etiqueta: 'Pendientes', valor: '2', icono: mapaIconos.alerta, color: 'var(--color-naranja)' }
                ];
        }
    }
    
    // Contenido del Mapa
    obtenerContenidoMapa() {
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
    }
    
    // Contenido de Tickets
    obtenerContenidoTickets() {
        return `
            <div class="deslizar-arriba">
                <div class="encabezado-tickets">
                    <input type="text" id="busqueda-tickets" class="entrada-busqueda" placeholder="Buscar tickets..." onkeyup="aplicacion.filtrarTickets()">
                    
                    <div class="filtros">
                        <select id="filtro-estado" onchange="aplicacion.filtrarTickets()">
                            <option value="todos">Todos los estados</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Asignado">Asignado</option>
                            <option value="En progreso">En progreso</option>
                            <option value="Resuelto">Resuelto</option>
                        </select>
                        
                        <select id="filtro-prioridad" onchange="aplicacion.filtrarTickets()">
                            <option value="todos">Todas las prioridades</option>
                            <option value="Crítica">Crítica</option>
                            <option value="Alta">Alta</option>
                            <option value="Media">Media</option>
                            <option value="Baja">Baja</option>
                        </select>
                        
                        ${this.usuarioActual.rol === 'cliente' || this.usuarioActual.rol === 'administrador' ? '<button class="btn btn-primario" onclick="aplicacion.mostrarModalNuevoTicket()">Nuevo Ticket</button>' : ''}
                    </div>
                </div>
                
                <div class="tarjeta">
                    <div class="contenedor-tabla">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Equipo</th>
                                    <th>Problema</th>
                                    <th>Cliente</th>
                                    <th>Técnico</th>
                                    <th>Estado</th>
                                    <th>Prioridad</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="cuerpo-tabla-tickets">
                                ${this.renderizarFilasTickets(this.tickets)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderizarFilasTickets(tickets) {
        return tickets.map(ticket => `
            <tr>
                <td><strong>${ticket.id}</strong></td>
                <td>${ticket.equipo}</td>
                <td>${ticket.problema}</td>
                <td>${ticket.cliente}</td>
                <td>${ticket.tecnico}</td>
                <td><span class="insignia-estado ${this.obtenerClaseInsigniaEstado(ticket.estado)}">${ticket.estado}</span></td>
                <td><span class="insignia-estado ${this.obtenerClaseInsigniaPrioridad(ticket.prioridad)}">${ticket.prioridad}</span></td>
                <td>
                    <div class="acciones-ticket">
                        <button class="btn btn-primario" style="padding: 0.5rem 1rem; font-size: 0.8125rem;" onclick="alert('Ver detalles de ${ticket.id}')">Ver</button>
                        ${this.usuarioActual.rol !== 'cliente' ? '<button class="btn btn-secundario" style="padding: 0.5rem 1rem; font-size: 0.8125rem;" onclick="alert(\'Editar ticket\')">Editar</button>' : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    inicializarFiltrosTickets() {
        // Los filtros se inicializan mediante onchange/onkeyup en el HTML
    }
    
    filtrarTickets() {
        const terminoBusqueda = document.getElementById('busqueda-tickets')?.value.toLowerCase() || '';
        const filtroEstado = document.getElementById('filtro-estado')?.value || 'todos';
        const filtroPrioridad = document.getElementById('filtro-prioridad')?.value || 'todos';
        
        const filtrados = this.tickets.filter(ticket => {
            const coincideBusqueda = ticket.id.toLowerCase().includes(terminoBusqueda) ||
                                    ticket.equipo.toLowerCase().includes(terminoBusqueda) ||
                                    ticket.cliente.toLowerCase().includes(terminoBusqueda) ||
                                    ticket.problema.toLowerCase().includes(terminoBusqueda);
            const coincideEstado = filtroEstado === 'todos' || ticket.estado === filtroEstado;
            const coincidePrioridad = filtroPrioridad === 'todos' || ticket.prioridad === filtroPrioridad;
            
            return coincideBusqueda && coincideEstado && coincidePrioridad;
        });
        
        const cuerpoTabla = document.getElementById('cuerpo-tabla-tickets');
        if (cuerpoTabla) {
            cuerpoTabla.innerHTML = this.renderizarFilasTickets(filtrados);
        }
    }
    
    mostrarModalNuevoTicket() {
        alert('Funcionalidad de crear nuevo ticket (modal pendiente de implementar)');
    }
    
    // Contenido de Usuarios
    obtenerContenidoUsuarios() {
        return `
            <div class="deslizar-arriba">
                <div class="encabezado-tickets">
                    <h3>Gestión de Usuarios</h3>
                    <button class="btn btn-primario">Nuevo Usuario</button>
                </div>
                
                <div class="tarjeta">
                    <div class="contenedor-tabla">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.usuariosDemo.map(usuario => `
                                    <tr>
                                        <td><strong>${usuario.nombre}</strong></td>
                                        <td>${usuario.correo}</td>
                                        <td><span class="insignia-estado insignia-azul">${usuario.rol}</span></td>
                                        <td><span class="insignia-estado insignia-verde">Activo</span></td>
                                        <td>
                                            <div class="acciones-ticket">
                                                <button class="btn btn-primario" style="padding: 0.5rem 1rem; font-size: 0.8125rem;">Editar</button>
                                                <button class="btn btn-secundario" style="padding: 0.5rem 1rem; font-size: 0.8125rem;">Desactivar</button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Contenido de Reportes
    obtenerContenidoReportes() {
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
    }
    
    // Contenido de Configuración
    obtenerContenidoConfiguracion() {
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
    }
    
    // Contenido de Conocimiento
    obtenerContenidoConocimiento() {
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
    }
    
    // Contenido de Perfil
    obtenerContenidoPerfil() {
        return `
            <div class="deslizar-arriba">
                <div class="tarjeta">
                    <h3>Mi Perfil</h3>
                    <div style="max-width: 650px; margin-top: 2rem;">
                        <div class="grupo-formulario">
                            <label>Nombre Completo</label>
                            <input type="text" value="${this.usuarioActual.nombre}">
                        </div>
                        
                        <div class="grupo-formulario">
                            <label>Email</label>
                            <input type="email" value="${this.usuarioActual.correo}" disabled>
                        </div>
                        
                        <div class="grupo-formulario">
                            <label>Rol</label>
                            <input type="text" value="${this.usuarioActual.rol}" disabled style="text-transform: capitalize;">
                        </div>
                        
                        <div class="grupo-formulario">
                            <label>Teléfono</label>
                            <input type="tel" placeholder="+57 123 456 7890">
                        </div>
                        
                        <div class="grupo-formulario">
                            <label>Nueva Contraseña</label>
                            <input type="password" placeholder="Dejar en blanco para no cambiar">
                        </div>
                        
                        <div class="grupo-formulario">
                            <label>Confirmar Contraseña</label>
                            <input type="password" placeholder="Confirmar nueva contraseña">
                        </div>
                        
                        <button class="btn btn-primario">Actualizar Perfil</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Contenido de Historial
    obtenerContenidoHistorial() {
        return `
            <div class="deslizar-arriba">
                <div class="tarjeta">
                    <h3>Historial de Entregas</h3>
                    <div class="contenedor-tabla">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Equipo</th>
                                    <th>Cliente</th>
                                    <th>Dirección</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>TK-005</strong></td>
                                    <td>2024-01-17</td>
                                    <td>Dell Inspiron 15</td>
                                    <td>Pedro Sánchez</td>
                                    <td>Avenida 56 #78-90</td>
                                    <td><span class="insignia-estado insignia-verde">Completado</span></td>
                                </tr>
                                <tr>
                                    <td><strong>TK-004</strong></td>
                                    <td>2024-01-16</td>
                                    <td>Lenovo ThinkCentre M720</td>
                                    <td>Luis Rodríguez</td>
                                    <td>Carrera 34 #56-78</td>
                                    <td><span class="insignia-estado insignia-verde">Completado</span></td>
                                </tr>
                                <tr>
                                    <td><strong>TK-002</strong></td>
                                    <td>2024-01-15</td>
                                    <td>HP ProDesk 400 G7</td>
                                    <td>Carlos López</td>
                                    <td>Calle 90 #12-34</td>
                                    <td><span class="insignia-estado insignia-verde">Completado</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Métodos Auxiliares
    obtenerClaseInsigniaEstado(estado) {
        const mapa = {
            'Resuelto': 'insignia-verde',
            'En progreso': 'insignia-azul',
            'Asignado': 'insignia-purpura',
            'Pendiente': 'insignia-amarillo'
        };
        return mapa[estado] || 'insignia-azul';
    }
    
    obtenerClaseInsigniaPrioridad(prioridad) {
        const mapa = {
            'Crítica': 'insignia-rojo',
            'Alta': 'insignia-naranja',
            'Media': 'insignia-amarillo',
            'Baja': 'insignia-verde'
        };
        return mapa[prioridad] || 'insignia-azul';
    }
}

// Inicializar aplicación
const aplicacion = new AplicacionSkyHelp();