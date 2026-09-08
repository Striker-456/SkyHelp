// js/modules/auth.js
// Autenticación conectada al backend SkyHelp

AplicacionSkyHelp.prototype.manejarLogin = async function(evento) {
    evento.preventDefault();

    const datos = new FormData(evento.target);
    const correo = datos.get('correo');
    const contrasena = datos.get('contrasena');

    this.mostrarCarga();

    try {
        const respuesta = await Api.login(correo, contrasena);
        console.log('Respuesta login:', respuesta);
        if (!respuesta || !respuesta.token) throw new Error('Sin token: ' + JSON.stringify(respuesta));

        const payload = JSON.parse(atob(respuesta.token.split('.')[1]));
        const nombre = payload['nombreCompleto'] 
            || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] 
            || correo;
        const idUsuario = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '';

        Api.guardarSesion(respuesta.token, respuesta.role, nombre, correo);
        sessionStorage.setItem('skyhelp_id', idUsuario);

        this.usuarioActual = {
            correo,
            nombre,
            rol: respuesta.role.toLowerCase(),
            token: respuesta.token,
            id: idUsuario
        };

        this.ocultarCarga();
        this.mostrarApp();
    } catch (error) {
        this.ocultarCarga();
        console.error('Error login:', error);
        alert('Error: ' + error.message);
    }
};

AplicacionSkyHelp.prototype.manejarRegistro = async function(evento) {
    evento.preventDefault();

    const datos = new FormData(evento.target);
    const nombre = datos.get('nombre');
    const correo = datos.get('correo');
    const contrasena = datos.get('contrasena');
    const confirmarContrasena = datos.get('confirmarContrasena');

    if (contrasena !== confirmarContrasena) {
        alert('Las contraseñas no coinciden');
        return;
    }

    if (!nombre || !correo || !contrasena) {
        alert('Por favor completa todos los campos obligatorios');
        return;
    }

    this.mostrarCarga();

    try {
        // El auto-registro siempre crea una cuenta Cliente; solo un administrador
        // puede asignar otro tipo de usuario (Técnico, Domiciliario, Administrador)
        // desde el panel de Gestión de Usuarios.
        const roles = await Api.getRoles();
        const rol = roles.find(r => normalizarTexto(r.nombreRol) === normalizarTexto('cliente'));
        if (!rol) throw new Error('No se encontró el rol Cliente');

        const nuevoUsuario = {
            nombreUsuarios: nombre.split(' ')[0],
            nombreCompleto: nombre,
            correo,
            contrasena,
            idRol: rol.idRol,
            estadoCuenta: 'Activo'
        };

        await Api.crearUsuario(nuevoUsuario);

        // Iniciar sesión automáticamente tras registro
        const respuesta = await Api.login(correo, contrasena);
        if (!respuesta || !respuesta.token) throw new Error('El servidor no devolvió un token válido');

        const payloadReg = JSON.parse(atob(respuesta.token.split('.')[1]));
        const nombreSesion = payloadReg['nombreCompleto']
            || payloadReg['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
            || correo;
        const idUsuario = payloadReg['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '';

        Api.guardarSesion(respuesta.token, respuesta.role, nombreSesion, correo);
        sessionStorage.setItem('skyhelp_id', idUsuario);

        this.usuarioActual = {
            correo,
            nombre: nombreSesion,
            rol: respuesta.role.toLowerCase(),
            token: respuesta.token,
            id: idUsuario
        };

        this.ocultarCarga();
        this.mostrarApp();
    } catch (error) {
        this.ocultarCarga();
        alert('Error al registrar: ' + error.message);
    }
};

AplicacionSkyHelp.prototype.cerrarSesion = function() {
    Api.logout().catch(() => {}).finally(() => {
        Api.limpiarSesion();
        this.usuarioActual = null;
        this.mostrarInicio();
    });
};

// Restaurar sesión si ya hay token guardado
AplicacionSkyHelp.prototype.restaurarSesion = function() {
    const sesion = Api.getUsuarioSesion();
    if (sesion) {
        this.usuarioActual = {
            correo: sesion.correo,
            nombre: sesion.nombre,
            rol: sesion.rol.toLowerCase(),
            token: sesion.token,
            id: sessionStorage.getItem('skyhelp_id') || ''
        };
        this.mostrarApp();
        return true;
    }
    return false;
};
