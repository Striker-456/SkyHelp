// js/modules/auth.js
// Métodos de autenticación

// Agregar métodos a la clase AplicacionSkyHelp
AplicacionSkyHelp.prototype.manejarLogin = function(evento) {
    evento.preventDefault();
    
    const datosFormulario = new FormData(evento.target);
    const correo = datosFormulario.get('correo');
    const contrasena = datosFormulario.get('contrasena');
    
    this.mostrarCarga();
    
    setTimeout(() => {
        const usuario = datosSkyHelp.usuariosDemo.find(u => u.correo === correo && u.contrasena === contrasena);
        
        if (usuario) {
            this.usuarioActual = usuario;
            this.ocultarCarga();
            this.mostrarApp();
            setTimeout(() => this.mostrarToast(`👋 Bienvenido, ${usuario.nombre}`, 'exito'), 400);
        } else {
            this.ocultarCarga();
            this.mostrarToast('❌ Credenciales inválidas. Verifica tu correo y contraseña.', 'error');
        }
    }, 1200);
};

AplicacionSkyHelp.prototype.manejarRegistro = function(evento) {
    evento.preventDefault();
    
    const datosFormulario = new FormData(evento.target);
    const nombre = datosFormulario.get('nombre');
    const correo = datosFormulario.get('correo');
    const rol = datosFormulario.get('rol');
    const contrasena = datosFormulario.get('contrasena');
    const confirmarContrasena = datosFormulario.get('confirmarContrasena');
    
    if (contrasena !== confirmarContrasena) {
        this.mostrarToast('❌ Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (!nombre || !correo || !rol || !contrasena) {
        this.mostrarToast('⚠️ Por favor completa todos los campos obligatorios', 'advertencia');
        return;
    }
    
    this.mostrarCarga();
    
    setTimeout(() => {
        this.usuarioActual = { nombre, correo, rol };
        this.ocultarCarga();
        this.mostrarApp();
        setTimeout(() => this.mostrarToast(`🎉 Cuenta creada. Bienvenido, ${nombre}`, 'exito'), 400);
    }, 1500);
};

AplicacionSkyHelp.prototype.cerrarSesion = function() {
    this.usuarioActual = null;
    this.mostrarInicio();
};