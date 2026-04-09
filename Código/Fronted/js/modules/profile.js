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
                        <form onsubmit="aplicacion.guardarPerfil(event)">
                            <div class="fila-formulario">
                                <div class="grupo-formulario">
                                    <label>Nombre Completo</label>
                                    <input type="text" name="nombre" value="${u.nombre}" required>
                                </div>
                                <div class="grupo-formulario">
                                    <label>Rol</label>
                                    <input type="text" value="${u.rol}" disabled style="text-transform:capitalize;opacity:0.7;">
                                </div>
                            </div>
                            <div class="fila-formulario">
                                <div class="grupo-formulario">
                                    <label>Correo Electrónico</label>
                                    <input type="email" value="${u.correo}" disabled style="opacity:0.7;">
                                </div>
                                <div class="grupo-formulario">
                                    <label>Teléfono</label>
                                    <input type="tel" name="telefono" value="${u.telefono || ''}" placeholder="+57 300 123 4567">
                                </div>
                            </div>
                            ${esDomi ? `
                            <div class="grupo-formulario">
                                <label>Vehículo</label>
                                <input type="text" name="vehiculo" value="${u.vehiculo || ''}" placeholder="Ej. Moto Honda CB 125">
                            </div>` : ''}

                            <div style="border-top:1px solid var(--gris-200);padding-top:1.5rem;margin-top:1rem;">
                                <h4 style="margin-bottom:1.25rem;color:var(--gris-700);font-size:0.9375rem;">Cambiar Contraseña</h4>
                                <div class="fila-formulario">
                                    <div class="grupo-formulario">
                                        <label>Nueva Contraseña</label>
                                        <input type="password" name="contrasena" placeholder="Dejar vacío para no cambiar">
                                    </div>
                                    <div class="grupo-formulario">
                                        <label>Confirmar Contraseña</label>
                                        <input type="password" name="confirmarContrasena" placeholder="Repetir nueva contraseña">
                                    </div>
                                </div>
                            </div>

                            <div style="display:flex;gap:1rem;margin-top:1rem;">
                                <button type="submit" class="btn btn-primario">
                                    <svg class="icono" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                                    Guardar Cambios
                                </button>
                                <button type="button" class="btn btn-secundario" onclick="aplicacion.cargarContenido('perfil')">Cancelar</button>
                            </div>
                        </form>
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
            await Api.put('/usuarios/CambiarContrasena', { nuevaContrasena: contrasena });
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
            await Api.put('/usuarios/ActualizarMiPerfil', {
                idUsuario,
                nombreUsuarios: this.usuarioActual.nombre.split(' ')[0],
                nombreCompleto: this.usuarioActual.nombre,
                correo:         this.usuarioActual.correo,
                contrasena:     '',
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
