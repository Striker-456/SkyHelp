// js/modules/api.js
// Capa de comunicación con el backend SkyHelp

const API_BASE = '/api';

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
        const respuesta = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena })
        });
        if (!respuesta.ok) throw new Error('Credenciales inválidas');
        return respuesta.json();
    },

    // Roles
    getRoles()                    { return this.get('/rol/ObtenerRoles'); },

    // Tickets — el endpoint depende del rol
    getTickets() {
        const rol = sessionStorage.getItem('skyhelp_rol');
        if (rol === 'Administrador') return this.get('/tickets/ObtenerTickets');
        if (rol === 'Tecnico')       return this.get('/tickets/ObtenerTicketsAsignadosTecnico');
        return this.get('/tickets/ObtenerMisTickets');
    },
    crearTicket(ticket)           { return this.post('/tickets/CrearTicket', ticket); },
    actualizarTicket(ticket)      { return this.put('/tickets/ActualizarTicket', ticket); },

    // Usuarios
    getUsuarios()                 { return this.get('/usuarios/ObtenerUsuarios'); },
    crearUsuario(usuario)         { return this.post('/usuarios/CrearUsuario', usuario); },
    actualizarUsuario(usuario)    { return this.put('/usuarios/ActualizarUsuario', usuario); },
    eliminarUsuario(id)           { return this.delete(`/usuarios/EliminarUsuario?ID=${id}`); },

    // Estados de tickets
    getEstadosTickets()           { return this.get('/estadostickets/ObtenerEstadosTickets'); },

    // Técnicos
    getTecnicos()                 { return this.get('/tecnicos/ObtenerTecnicos'); },

    // Domiciliarios
    getDomiciliarios()            { return this.get('/domiciliarios/ObtenerDomiciliarios'); },
};
