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
        if (!respuesta || !respuesta.token) throw new Error('El servidor no devolvió un token válido');

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
        this.mostrarToast('Error: ' + error.message, 'error');
    }
};

AplicacionSkyHelp.prototype.manejarRegistro = async function(evento) {
    evento.preventDefault();

    const datos = new FormData(evento.target);
    const nombre = datos.get('nombre');
    const correo = datos.get('correo');
    const telefono = datos.get('telefono');
    const contrasena = datos.get('contrasena');
    const confirmarContrasena = datos.get('confirmarContrasena');

    if (contrasena !== confirmarContrasena) {
        this.mostrarToast('Las contraseñas no coinciden', 'error');
        return;
    }

    if (!nombre || !correo || !contrasena) {
        this.mostrarToast('Por favor completa todos los campos obligatorios', 'error');
        return;
    }

    this.mostrarCarga();

    try {
        // El servidor asigna SIEMPRE el rol "Usuario" en el registro público;
        // los roles Tecnico/Domiciliario/Administrador los otorga un administrador.
        const nuevoUsuario = {
            nombreUsuarios: nombre.split(' ')[0],
            nombreCompleto: nombre,
            correo,
            contrasena,
            telefono: telefono || ''
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
        this.mostrarToast('Error al registrar: ' + error.message, 'error');
    }
};

AplicacionSkyHelp.prototype.cerrarSesion = function() {
    Api.limpiarSesion();
    this.usuarioActual = null;
    this.mostrarInicio();
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

// ============================================================
// RESTABLECIMIENTO DE CONTRASENA (enlace temporal por correo)
// ============================================================

// Política espejo del backend (PasswordPolicy): 8+, mayúscula, número y especial.
// Se usa solo para dar retroalimentación inmediata; el backend vuelve a validar.
AplicacionSkyHelp.prototype.reglasContrasena = function(contrasena) {
    const especiales = '!@#$%^&*()-_=+[]{};:,.<>?/|~`"\'\\';
    return {
        longitud: contrasena.length >= 8,
        mayuscula: /[A-Z]/.test(contrasena),
        numero: /[0-9]/.test(contrasena),
        especial: [...contrasena].some(c => especiales.includes(c))
    };
};

// Pinta la lista de requisitos mientras el usuario escribe.
AplicacionSkyHelp.prototype.actualizarRequisitosContrasena = function(valor) {
    const lista = document.getElementById('requisitos-contrasena');
    if (!lista) return;
    const reglas = this.reglasContrasena(valor || '');
    lista.querySelectorAll('li').forEach(li => {
        const cumple = !!reglas[li.dataset.regla];
        li.classList.toggle('cumplido', cumple);
    });
};

// Abre la pestaña de recuperación desde el enlace "¿Olvidaste tu contraseña?".
AplicacionSkyHelp.prototype.irARecuperar = function(evento) {
    if (evento) evento.preventDefault();
    this.cambiarPestana('recuperar');
    this.mostrarFormularioSolicitud();
    const input = document.getElementById('correo-recuperacion');
    if (input) setTimeout(() => input.focus(), 60);
};

// Vuelve a la pestaña de login.
AplicacionSkyHelp.prototype.volverALogin = function(evento) {
    if (evento) evento.preventDefault();
    this.cambiarPestana('login');
};

// Muestra el paso 1 (pedir correo) y oculta el paso 2 (nueva contraseña).
AplicacionSkyHelp.prototype.mostrarFormularioSolicitud = function() {
    const solicitud = document.getElementById('formulario-solicitar-recuperacion');
    const restablecer = document.getElementById('formulario-restablecer');
    if (solicitud) solicitud.style.display = '';
    if (restablecer) restablecer.style.display = 'none';
};

// Muestra el paso 2 (nueva contraseña) y oculta el paso 1.
AplicacionSkyHelp.prototype.mostrarFormularioRestablecer = function() {
    const solicitud = document.getElementById('formulario-solicitar-recuperacion');
    const restablecer = document.getElementById('formulario-restablecer');
    if (solicitud) solicitud.style.display = 'none';
    if (restablecer) restablecer.style.display = '';
};

// Paso 1: el usuario pide el enlace para su correo.
AplicacionSkyHelp.prototype.manejarSolicitarRecuperacion = async function(evento) {
    evento.preventDefault();

    const correo = new FormData(evento.target).get('correo');
    if (!correo) {
        this.mostrarToast('Ingresa tu correo electronico', 'error');
        return;
    }

    this.mostrarCarga();
    try {
        await Api.solicitarRestablecimiento(correo);
        this.ocultarCarga();
        this.mostrarToast('Si el correo esta registrado, recibiras un enlace en unos minutos', 'exito');
        this.volverALogin();
    } catch (error) {
        this.ocultarCarga();
        this.mostrarToast('Error: ' + error.message, 'error');
    }
};

// Paso 2: el usuario define la nueva contraseña con el token del enlace.
AplicacionSkyHelp.prototype.manejarRestablecerContrasena = async function(evento) {
    evento.preventDefault();

    const datos = new FormData(evento.target);
    const nuevaContrasena = datos.get('nuevaContrasena');
    const confirmarContrasena = datos.get('confirmarContrasena');
    const token = this.tokenRecuperacion;

    if (!token) {
        this.mostrarToast('El enlace no es valido. Solicita uno nuevo.', 'error');
        this.mostrarFormularioSolicitud();
        return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
        this.mostrarToast('Las contrasenas no coinciden', 'error');
        return;
    }

    const reglas = this.reglasContrasena(nuevaContrasena || '');
    if (!reglas.longitud || !reglas.mayuscula || !reglas.numero || !reglas.especial) {
        this.mostrarToast('La contrasena no cumple la politica de seguridad', 'error');
        return;
    }

    this.mostrarCarga();
    try {
        await Api.restablecerContrasena(token, nuevaContrasena);
        this.ocultarCarga();
        this.mostrarToast('Contrasena restablecida. Ya puedes iniciar sesion', 'exito');

        // Limpiar el token de la URL para que no quede en el historial.
        try { window.history.replaceState({}, '', window.location.pathname); } catch (e) { /* noop */ }
        this.tokenRecuperacion = null;
        evento.target.reset();
        this.actualizarRequisitosContrasena('');

        this.mostrarFormularioSolicitud();
        this.cambiarPestana('login');
    } catch (error) {
        this.ocultarCarga();
        this.mostrarToast('Error: ' + error.message, 'error');
    }
};

// Al cargar, detecta ?token=... en la URL (usuario que abrió el enlace del correo).
AplicacionSkyHelp.prototype.detectarTokenRecuperacion = function() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) return false;

    this.tokenRecuperacion = token;
    this.mostrarVista('login');
    this.cambiarPestana('recuperar');
    this.mostrarFormularioRestablecer();

    const input = document.getElementById('nueva-contrasena');
    if (input) setTimeout(() => input.focus(), 80);
    return true;
};
