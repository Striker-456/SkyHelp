
const API_BASE = 'http://localhost:5191';

const Api = {
    // Obtener token almacenado
    getToken() {
        return sessionStorage.getItem('skyhelp_token');
    },

    // Guardar sesión
    guardarSesion(token, rol, nombre, correo) {
        sessionStorage.setItem('skyhelp_token', token);
        sessionStorage.setItem('skyhelp_rol', rol);
        sessionStorage.setItem('skyhelp_nombre', nombre);
        sessionStorage.setItem('skyhelp_correo', correo);
    },

    // Limpiar sesión
    limpiarSesion() {
        sessionStorage.removeItem('skyhelp_token');
        sessionStorage.removeItem('skyhelp_rol');
        sessionStorage.removeItem('skyhelp_nombre');
        sessionStorage.removeItem('skyhelp_correo');
    },

    // Obtener usuario de sesión
    getUsuarioSesion() {
        const token = this.getToken();
        if (!token) return null;
        return {
            token,
            rol: sessionStorage.getItem('skyhelp_rol'),
            nombre: sessionStorage.getItem('skyhelp_nombre'),
            correo: sessionStorage.getItem('skyhelp_correo')
        };
    },

    // Headers con autorización
    headers() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
        };
    },

    // Petición genérica
    async request(method, endpoint, body = null) {
        const opciones = {
            method,
            headers: this.headers()
        };
        if (body) opciones.body = JSON.stringify(body);

        const respuesta = await fetch(`${API_BASE}${endpoint}`, opciones);

        if (respuesta.status === 401) {
            this.limpiarSesion();
            window.location.reload();
            return null;
        }

        if (!respuesta.ok) {
            const error = await respuesta.text();
            throw new Error(error || `Error ${respuesta.status}`);
        }

        const texto = await respuesta.text();
        if (!texto) return null;
        try { return JSON.parse(texto); } catch { return texto; }
    },

    get(endpoint)         { return this.request('GET', endpoint); },
    post(endpoint, body)  { return this.request('POST', endpoint, body); },
    put(endpoint, body)   { return this.request('PUT', endpoint, body); },
    delete(endpoint)      { return this.request('DELETE', endpoint); },

    // Auth
   async login(correo, contrasena) {
    const respuesta = await fetch(`${API_BASE}/api/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena })
    });

    if (!respuesta.ok) {
        const error = await respuesta.text();
        throw new Error(error || 'Credenciales inválidas');
    }

    return respuesta.json();
},

    // Roles
    getRoles()                    { return this.get('/api/rol/ObtenerRoles'); },

    // Tickets — el endpoint depende del rol
    getTickets() {
        const rol = sessionStorage.getItem('skyhelp_rol');
        if (rol === 'Administrador') return this.get('/api/tickets/ObtenerTickets');
        if (rol === 'Tecnico')       return this.get('/api/tickets/ObtenerTicketsAsignadosTecnico');
        return this.get('/api/tickets/ObtenerMisTickets');
    },
    getTicketsPorDomiciliario(idDomiciliario) { return this.get(`/api/tickets/ObtenerTicketsAsignadosDomiciliario?idDomiciliario=${idDomiciliario}`); },
    crearTicket(ticket)           { return this.post('/api/tickets/CrearTicket', ticket); },
    actualizarTicket(ticket)      { return this.put('/api/tickets/ActualizarTicket', ticket); },
    actualizarEstadoTicket(idTicket, idEstado) { return this.put('/api/tickets/ActualizarEstadoTicket', { idTicket, idEstado }); },

    // Usuarios
    getUsuarios()                 { return this.get('/api/usuarios/ObtenerUsuarios'); },
    getNombreUsuarioPorId(id)     { return this.get(`/api/usuarios/ObtenerNombrePorId?id=${id}`); },
    crearUsuario(usuario)         { return this.post('/api/usuarios/CrearUsuario', usuario); },
    actualizarUsuario(usuario)    { return this.put('/api/usuarios/ActualizarUsuario', usuario); },
    eliminarUsuario(id)           { return this.delete(`/api/usuarios/EliminarUsuario?ID=${id}`); },

    // Estados de tickets
    getEstadosTickets()           { return this.get('/api/estadostickets/ObtenerEstadosTickets'); },

    // Técnicos
    getTecnicos()                 { return this.get('/api/tecnicos/ObtenerTecnicos'); },

    // Domiciliarios
    getDomiciliarios()            { return this.get('/api/domiciliarios/ObtenerDomiciliarios'); },
    getDomiciliarioActual()       { return this.get('/api/domiciliarios/ObtenerDomiciliarioActual'); },
    crearDomiciliario(domiciliario) { return this.post('/api/domiciliarios/CrearDomiciliario', domiciliario); },

    // Cambios de perfil
    cambiarNombre(data)           { return this.put('/api/usuarios/CambiarNombre', data); },
    cambiarCorreo(data)           { return this.put('/api/usuarios/CambiarCorreo', data); },
    cambiarContrasena(data)       { return this.put('/api/usuarios/CambiarContrasena', data); },
};
