// js/modules/profile.js
// Métodos para perfil de usuario

AplicacionSkyHelp.prototype.obtenerContenidoPerfil = function() {
    const u = this.usuarioActual;
    const rolIcono = { administrador: '🏢', tecnico: '🔧', cliente: '👤', domiciliario: '🚚' };
    return `
        <div class="deslizar-arriba">
            <div class="perfil-layout">
                <!-- Tarjeta de avatar -->
                <div class="perfil-sidebar">
                    <div class="tarjeta perfil-avatar-card">
                        <div class="perfil-avatar-grande">${u.nombre.charAt(0)}</div>
                        <div class="perfil-nombre">${u.nombre}</div>
                        <div class="perfil-rol-badge">${rolIcono[u.rol] || '👤'} ${u.rol}</div>
                        <div class="perfil-correo">${u.correo || 'sin correo'}</div>
                        <div class="perfil-stats-mini">
                            <div class="perfil-stat-mini">
                                <div class="perfil-stat-num">${u.rol === 'domiciliario' ? (datosSkyHelp.entregas||[]).filter(e=>e.estado==='Completado').length : datosSkyHelp.tickets.length}</div>
                                <div class="perfil-stat-lbl">${u.rol === 'domiciliario' ? 'Entregas' : 'Tickets'}</div>
                            </div>
                            <div class="perfil-stat-mini">
                                <div class="perfil-stat-num">${u.rol === 'domiciliario' ? '4.8★' : u.rol === 'tecnico' ? '142' : '98%'}</div>
                                <div class="perfil-stat-lbl">${u.rol === 'domiciliario' ? 'Calificación' : u.rol === 'tecnico' ? 'Resueltos' : 'Satisfacción'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Formulario -->
                <div class="perfil-form-area">
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
                                    <input type="email" name="correo" value="${u.correo || ''}" placeholder="correo@ejemplo.com">
                                </div>
                                <div class="grupo-formulario">
                                    <label>Teléfono</label>
                                    <input type="tel" name="telefono" value="${u.telefono || ''}" placeholder="+57 300 123 4567">
                                </div>
                            </div>
                            ${u.rol === 'domiciliario' ? `
                            <div class="grupo-formulario">
                                <label>Vehículo</label>
                                <input type="text" name="vehiculo" value="${u.vehiculo || ''}" placeholder="Ej. Moto Honda CB 125">
                            </div>` : ''}
                            <div style="border-top:1px solid var(--gris-200);padding-top:1.5rem;margin-top:0.5rem;">
                                <h4 style="margin-bottom:1.25rem;color:var(--gris-700);font-size:0.9375rem;">Cambiar Contraseña</h4>
                                <div class="fila-formulario">
                                    <div class="grupo-formulario">
                                        <label>Nueva Contraseña</label>
                                        <input type="password" name="contrasena" placeholder="Dejar vacío para no cambiar">
                                    </div>
                                    <div class="grupo-formulario">
                                        <label>Confirmar Contraseña</label>
                                        <input type="password" name="confirmar" placeholder="Repetir nueva contraseña">
                                    </div>
                                </div>
                            </div>
                            <div style="display:flex;gap:1rem;margin-top:0.5rem;">
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

AplicacionSkyHelp.prototype.guardarPerfil = function(evento) {
    evento.preventDefault();
    const datos = new FormData(evento.target);
    const contrasena = datos.get('contrasena');
    const confirmar = datos.get('confirmar');
    if (contrasena && contrasena !== confirmar) {
        this.mostrarToast('❌ Las contraseñas no coinciden', 'error');
        return;
    }
    this.usuarioActual.nombre = datos.get('nombre') || this.usuarioActual.nombre;
    this.usuarioActual.correo = datos.get('correo') || this.usuarioActual.correo;
    this.usuarioActual.telefono = datos.get('telefono') || '';
    if (datos.get('vehiculo')) this.usuarioActual.vehiculo = datos.get('vehiculo');
    // Actualizar sidebar
    const elNombre = document.getElementById('nombre-usuario');
    const elAvatar = document.getElementById('avatar-usuario');
    if (elNombre) elNombre.textContent = this.usuarioActual.nombre;
    if (elAvatar) elAvatar.textContent = this.usuarioActual.nombre.charAt(0);
    this.mostrarToast('✅ Perfil actualizado correctamente', 'exito');
    this.cargarContenido('perfil');
};