// js/modules/profile.js
// Perfil de usuario con diseño de tarjeta lateral

AplicacionSkyHelp.prototype.obtenerContenidoPerfil = async function() {
    const u = this.usuarioActual;
    const rolIcono = { administrador: '🏢', tecnico: '🔧', usuario: '👤', cliente: '👤', domiciliario: '🚚', domi: '🚚' };

    // Contar tickets del usuario
    let totalTickets = 0, resueltos = 0;
    try {
        const tickets = await Api.getTickets() || [];
        datosSkyHelp.tickets = tickets;
        totalTickets = tickets.length;
        resueltos = tickets.filter(t => {
            const e = (datosSkyHelp.estados||[]).find(e => e.idEstado === t.idEstado);
            return (e?.nombreEstado||'').toLowerCase().includes('resuel');
        }).length;
    } catch(e) {
        totalTickets = datosSkyHelp.tickets?.length || 0;
    }

    const esDomi = u.rol === 'domiciliario' || u.rol === 'domi';
    const esTecnico = u.rol === 'tecnico';

    const stat2Num = esDomi ? '—' : esTecnico ? resueltos : '—';
    const stat2Lbl = esDomi ? 'Calificación' : esTecnico ? 'Resueltos' : 'Satisfacción';
    const stat1Lbl = esDomi ? 'Entregas' : 'Tickets';

    return `
        <div class="deslizar-arriba">
            <div class="perfil-layout">
                <!-- Tarjeta avatar -->
                <div>
                    <div class="tarjeta perfil-avatar-card">
                        <div class="perfil-avatar-grande">${u.nombre.charAt(0)}</div>
                        <div class="perfil-nombre">${u.nombre}</div>
                        <div class="perfil-rol-badge">${rolIcono[u.rol] || '👤'} ${u.rol}</div>
                        <div class="perfil-correo">${u.correo}</div>
                        <div class="perfil-stats-mini">
                            <div class="perfil-stat-mini">
                                <div class="perfil-stat-num">${totalTickets}</div>
                                <div class="perfil-stat-lbl">${stat1Lbl}</div>
                            </div>
                            <div class="perfil-stat-mini">
                                <div class="perfil-stat-num">${stat2Num}</div>
                                <div class="perfil-stat-lbl">${stat2Lbl}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Formulario -->
                <div>
                    <div class="tarjeta">
                        <h3 style="margin-bottom:1.75rem;">Información Personal</h3>
                        
                        <div class="fila-formulario">
                            <div class="grupo-formulario">
                                <label>Nombre Completo</label>
                                <div style="display:flex;gap:0.75rem;align-items:center;">
                                    <input type="text" value="${u.nombre}" disabled style="flex:1;opacity:0.7;">
                                    <button type="button" class="btn btn-secundario" style="padding:0.5rem 1rem;font-size:0.8125rem;" onclick="aplicacion.mostrarModalCambiarNombre()">Editar</button>
                                </div>
                            </div>
                            <div class="grupo-formulario">
                                <label>Rol</label>
                                <input type="text" value="${u.rol}" disabled style="text-transform:capitalize;opacity:0.7;">
                            </div>
                        </div>
                        
                        <div class="fila-formulario">
                            <div class="grupo-formulario">
                                <label>Correo Electrónico</label>
                                <div style="display:flex;gap:0.75rem;align-items:center;">
                                    <input type="email" value="${u.correo}" disabled style="flex:1;opacity:0.7;">
                                    <button type="button" class="btn btn-secundario" style="padding:0.5rem 1rem;font-size:0.8125rem;" onclick="aplicacion.mostrarModalCambiarCorreo()">Editar</button>
                                </div>
                            </div>
                            <div class="grupo-formulario">
                                <label>Teléfono</label>
                                <form onsubmit="aplicacion.guardarPerfil(event)">
                                    <input type="tel" name="telefono" value="${u.telefono || ''}" placeholder="+57 300 123 4567">
                                </form>
                            </div>
                        </div>
                        
                        <div style="border-top:1px solid var(--gris-200);padding-top:1.5rem;margin-top:1rem;">
                            <h4 style="margin-bottom:1.25rem;color:var(--gris-700);font-size:0.9375rem;">Seguridad</h4>
                            <button type="button" class="btn btn-primario" style="padding:0.75rem 1.5rem;" onclick="aplicacion.mostrarModalCambiarContrasena()">
                                <svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/><path d="M10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                                Cambiar Contraseña
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

AplicacionSkyHelp.prototype.guardarPerfil = async function(evento) {
    evento.preventDefault();
    const datos = new FormData(evento.target);
    const contrasena = datos.get('contrasena');
    const confirmar  = datos.get('confirmarContrasena');

    if (contrasena && contrasena !== confirmar) {
        alert('Las contraseñas no coinciden');
        return;
    }

    try {
        if (contrasena) {
            await Api.put('/api/usuarios/CambiarContrasena', { nuevaContrasena: contrasena });
            this.mostrarToast('✅ Contraseña actualizada. Vuelve a iniciar sesión.');
            setTimeout(() => this.cerrarSesion(), 2000);
            return;
        }

        // Actualizar nombre y teléfono en sesión local
        this.usuarioActual.nombre   = datos.get('nombre') || this.usuarioActual.nombre;
        this.usuarioActual.telefono = datos.get('telefono') || '';
        if (datos.get('vehiculo')) this.usuarioActual.vehiculo = datos.get('vehiculo');

        // Enviar al backend si no es admin (admin usa ActualizarUsuario)
        const idUsuario = this.usuarioActual.id || sessionStorage.getItem('skyhelp_id');
        if (idUsuario) {
            await Api.put('/api/usuarios/ActualizarMiPerfil', {
                idUsuario,
                nombreUsuarios: this.usuarioActual.nombre.split(' ')[0],
                nombreCompleto: this.usuarioActual.nombre,
                correo:         this.usuarioActual.correo,
                estadoCuenta:   'Activo',
                telefono:       datos.get('telefono') || ''
            });
        }

        Api.guardarSesion(
            this.usuarioActual.token,
            this.usuarioActual.rol,
            this.usuarioActual.nombre,
            this.usuarioActual.correo
        );

        this.mostrarToast('✅ Perfil actualizado correctamente');
        document.getElementById('nombre-usuario').textContent = this.usuarioActual.nombre;
        document.getElementById('avatar-usuario').textContent = this.usuarioActual.nombre.charAt(0);
        this.cargarContenido('perfil');
    } catch (e) {
        this.mostrarToast('Error al actualizar: ' + e.message, 'error');
    }
};


// Modal para cambiar nombre
AplicacionSkyHelp.prototype.mostrarModalCambiarNombre = function() {
    const contenido = `
        <div class="modal-encabezado">
            <h3>Cambiar Nombre Completo</h3>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <div class="modal-cuerpo">
            <form onsubmit="aplicacion.guardarCambioNombre(event)">
                <div class="grupo-formulario">
                    <label>Nuevo Nombre Completo *</label>
                    <input type="text" id="nuevo-nombre" placeholder="Ingresa tu nuevo nombre" required>
                </div>
                <div class="grupo-formulario">
                    <label>Contraseña Actual *</label>
                    <input type="password" id="contrasena-nombre" placeholder="Ingresa tu contraseña" required>
                </div>
                <div style="display:flex;gap:1rem;margin-top:1.5rem;">
                    <button type="submit" class="btn btn-primario">Guardar Cambio</button>
                    <button type="button" class="btn btn-secundario" onclick="aplicacion.cerrarModal()">Cancelar</button>
                </div>
            </form>
        </div>
    `;
    this.abrirModal(contenido);
};

// Modal para cambiar correo
AplicacionSkyHelp.prototype.mostrarModalCambiarCorreo = function() {
    const contenido = `
        <div class="modal-encabezado">
            <h3>Cambiar Correo Electrónico</h3>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <div class="modal-cuerpo">
            <form onsubmit="aplicacion.guardarCambioCorreo(event)">
                <div class="grupo-formulario">
                    <label>Nuevo Correo Electrónico *</label>
                    <input type="email" id="nuevo-correo" placeholder="Ingresa tu nuevo correo" required>
                </div>
                <div class="grupo-formulario">
                    <label>Contraseña Actual *</label>
                    <input type="password" id="contrasena-correo" placeholder="Ingresa tu contraseña" required>
                </div>
                <div style="display:flex;gap:1rem;margin-top:1.5rem;">
                    <button type="submit" class="btn btn-primario">Guardar Cambio</button>
                    <button type="button" class="btn btn-secundario" onclick="aplicacion.cerrarModal()">Cancelar</button>
                </div>
            </form>
        </div>
    `;
    this.abrirModal(contenido);
};

// Modal para cambiar contraseña
AplicacionSkyHelp.prototype.mostrarModalCambiarContrasena = function() {
    const contenido = `
        <div class="modal-encabezado">
            <h3>Cambiar Contraseña</h3>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <div class="modal-cuerpo">
            <form onsubmit="aplicacion.guardarCambioContrasena(event)">
                <div class="grupo-formulario">
                    <label>Contraseña Actual *</label>
                    <input type="password" id="contrasena-actual" placeholder="Ingresa tu contraseña actual" required>
                </div>
                <div class="grupo-formulario">
                    <label>Nueva Contraseña *</label>
                    <input type="password" id="nueva-contrasena" placeholder="Ingresa tu nueva contraseña" required>
                </div>
                <div class="grupo-formulario">
                    <label>Confirmar Nueva Contraseña *</label>
                    <input type="password" id="confirmar-contrasena" placeholder="Repite tu nueva contraseña" required>
                </div>
                <div style="display:flex;gap:1rem;margin-top:1.5rem;">
                    <button type="submit" class="btn btn-primario">Cambiar Contraseña</button>
                    <button type="button" class="btn btn-secundario" onclick="aplicacion.cerrarModal()">Cancelar</button>
                </div>
            </form>
        </div>
    `;
    this.abrirModal(contenido);
};

// Guardar cambio de nombre
AplicacionSkyHelp.prototype.guardarCambioNombre = async function(evento) {
    evento.preventDefault();
    
    // Obtener los inputs del formulario usando el evento
    const form = evento.target;
    const inputs = form.querySelectorAll('input');
    
    if (inputs.length < 2) {
        this.mostrarToast('❌ Error: No se encontraron todos los campos', 'error');
        return;
    }
    
    const nuevoNombre = inputs[0].value.trim();
    const contrasena = inputs[1].value.trim();

    try {
        await Api.cambiarNombre({
            nuevoNombre: nuevoNombre,
            contrasena: contrasena
        });
        
        // Actualizar sesión local
        this.usuarioActual.nombre = nuevoNombre;
        Api.guardarSesion(
            this.usuarioActual.token,
            this.usuarioActual.rol,
            nuevoNombre,
            this.usuarioActual.correo
        );
        
        // Recargar usuarioActual desde sessionStorage para asegurar sincronización
        const sesion = Api.getUsuarioSesion();
        if (sesion) {
            this.usuarioActual.nombre = sesion.nombre;
        }
        
        // Actualizar UI
        document.getElementById('nombre-usuario').textContent = nuevoNombre;
        document.getElementById('avatar-usuario').textContent = nuevoNombre.charAt(0);
        
        this.mostrarToast('✅ Nombre actualizado correctamente');
        this.cerrarModal();
        setTimeout(() => this.cargarContenido('perfil'), 1000);
    } catch (e) {
        if (e.message.includes('Contraseña')) {
            this.mostrarToast('❌ Contraseña inválida', 'error');
        } else {
            this.mostrarToast('Error: ' + e.message, 'error');
        }
    }
};

// Guardar cambio de correo
AplicacionSkyHelp.prototype.guardarCambioCorreo = async function(evento) {
    evento.preventDefault();
    
    // Obtener los inputs del formulario usando el evento
    const form = evento.target;
    const inputs = form.querySelectorAll('input');
    
    if (inputs.length < 2) {
        this.mostrarToast('❌ Error: No se encontraron todos los campos', 'error');
        return;
    }
    
    const nuevoCorreo = inputs[0].value.trim();
    const contrasena = inputs[1].value.trim();

    try {
        await Api.cambiarCorreo({
            nuevoCorreo: nuevoCorreo,
            contrasena: contrasena
        });
        
        // Actualizar sesión local
        this.usuarioActual.correo = nuevoCorreo;
        Api.guardarSesion(
            this.usuarioActual.token,
            this.usuarioActual.rol,
            this.usuarioActual.nombre,
            nuevoCorreo
        );
        
        // Recargar usuarioActual desde sessionStorage para asegurar sincronización
        const sesion = Api.getUsuarioSesion();
        if (sesion) {
            this.usuarioActual.correo = sesion.correo;
        }
        
        this.mostrarToast('✅ Correo actualizado correctamente');
        this.cerrarModal();
        setTimeout(() => this.cargarContenido('perfil'), 1000);
    } catch (e) {
        if (e.message.includes('Contraseña')) {
            this.mostrarToast('❌ Contraseña inválida', 'error');
        } else {
            this.mostrarToast('Error: ' + e.message, 'error');
        }
    }
};

// Guardar cambio de contraseña
AplicacionSkyHelp.prototype.guardarCambioContrasena = async function(evento) {
    evento.preventDefault();
    
    // Obtener los inputs del formulario usando el evento
    const form = evento.target;
    const inputs = form.querySelectorAll('input[type="password"]');
    
    if (inputs.length < 3) {
        console.error('No se encontraron los 3 campos de contraseña');
        this.mostrarToast('❌ Error: No se encontraron todos los campos', 'error');
        return;
    }
    
    const contrasenaActual = inputs[0].value.trim();
    const nuevaContrasena = inputs[1].value.trim();
    const confirmarContrasena = inputs[2].value.trim();

    // Debug
    console.log('Contraseña actual:', contrasenaActual);
    console.log('Nueva contraseña:', nuevaContrasena);
    console.log('Confirmar contraseña:', confirmarContrasena);
    console.log('¿Coinciden?', nuevaContrasena === confirmarContrasena);

    // Validar que la nueva contraseña no esté vacía
    if (!nuevaContrasena) {
        this.mostrarToast('❌ La nueva contraseña no puede estar vacía', 'error');
        return;
    }

    // Validar que las dos nuevas contraseñas coincidan
    if (nuevaContrasena !== confirmarContrasena) {
        this.mostrarToast('❌ Las nuevas contraseñas no coinciden', 'error');
        return;
    }

    try {
        await Api.cambiarContrasena({
            contrasenaActual: contrasenaActual,
            nuevaContrasena: nuevaContrasena
        });
        this.mostrarToast('✅ Contraseña actualizada. Cerrando sesión...');
        this.cerrarModal();
        setTimeout(() => this.cerrarSesion(), 2000);
    } catch (e) {
        if (e.message.includes('Contraseña')) {
            this.mostrarToast('❌ Contraseña actual inválida', 'error');
        } else {
            this.mostrarToast('Error: ' + e.message, 'error');
        }
    }
};
