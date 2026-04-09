// js/modules/users.js
// Métodos para gestión de usuarios

AplicacionSkyHelp.prototype.obtenerContenidoUsuarios = async function() {
    try {
        const [usuarios, roles] = await Promise.all([Api.getUsuarios(), Api.getRoles()]);
        datosSkyHelp.usuarios = usuarios || [];
        datosSkyHelp.roles = roles || [];
    } catch (e) {
        datosSkyHelp.usuarios = [];
        datosSkyHelp.roles = [];
        this.mostrarToast('Error al cargar usuarios: ' + e.message, 'error');
    }

    const getNombreRol = (idRol) => {
        const rol = datosSkyHelp.roles.find(r => r.idRol === idRol);
        return rol ? rol.nombreRol : idRol;
    };

    return `
        <div class="deslizar-arriba">
            <div class="encabezado-tickets">
                <h3>Gestión de Usuarios</h3>
                <button class="btn btn-primario" onclick="aplicacion.mostrarModalNuevoUsuario()">Nuevo Usuario</button>
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
                            ${datosSkyHelp.usuarios.map(usuario => `
                                <tr>
                                    <td><strong>${usuario.nombreCompleto || usuario.nombreUsuarios || ''}</strong></td>
                                    <td>${usuario.correo}</td>
                                    <td><span class="insignia-estado insignia-azul">${getNombreRol(usuario.idRol)}</span></td>
                                    <td><span class="insignia-estado ${usuario.estadoCuenta ? 'insignia-verde' : 'insignia-rojo'}">${usuario.estadoCuenta ? 'Activo' : 'Inactivo'}</span></td>
                                    <td>
                                        <div class="acciones-ticket">
                                            <button class="btn btn-primario" style="padding:0.5rem 1rem;font-size:0.8125rem;" onclick="aplicacion.mostrarModalEditarUsuario('${usuario.idUsuario}')">Editar</button>
                                            <button class="btn btn-secundario" style="padding:0.5rem 1rem;font-size:0.8125rem;background:#ef4444;color:white;border-color:#ef4444;" onclick="aplicacion.confirmarEliminarUsuario('${usuario.idUsuario}', '${(usuario.nombreCompleto || usuario.nombreUsuarios || '').replace(/'/g, '')}')">
                                                Eliminar
                                            </button>
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
};

AplicacionSkyHelp.prototype.mostrarModalNuevoUsuario = function() {
    const contenido = `
        <div class="modal-encabezado">
            <h3>Nuevo Usuario</h3>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <form onsubmit="aplicacion.guardarNuevoUsuario(event)">
            <div class="modal-cuerpo">
                <div class="fila-formulario">
                    <div class="grupo-formulario">
                        <label>Nombre Completo *</label>
                        <input type="text" name="nombre" placeholder="Nombre completo" required>
                    </div>
                    <div class="grupo-formulario">
                        <label>Rol *</label>
                        <select name="rol" required>
                            <option value="">Seleccionar rol</option>
                            <option value="administrador">Administrador</option>
                            <option value="tecnico">Técnico</option>
                            <option value="cliente">Cliente</option>
                            <option value="domiciliario">Domiciliario</option>
                        </select>
                    </div>
                </div>
                <div class="grupo-formulario">
                    <label>Correo Electrónico *</label>
                    <input type="email" name="correo" placeholder="correo@ejemplo.com" required>
                </div>
                <div class="fila-formulario">
                    <div class="grupo-formulario">
                        <label>Contraseña *</label>
                        <input type="password" name="contrasena" placeholder="••••••••" required>
                    </div>
                    <div class="grupo-formulario">
                        <label>Teléfono</label>
                        <input type="tel" name="telefono" placeholder="+57 123 456 7890">
                    </div>
                </div>
            </div>
            <div class="modal-pie">
                <button type="button" class="btn btn-secundario" onclick="aplicacion.cerrarModal()">Cancelar</button>
                <button type="submit" class="btn btn-primario">Crear Usuario</button>
            </div>
        </form>
    `;
    this.abrirModal(contenido);
};

AplicacionSkyHelp.prototype.guardarNuevoUsuario = async function(evento) {
    evento.preventDefault();
    const datos = new FormData(evento.target);
    const rolNombre = datos.get('rol');

    try {
        // Resolver IdRol desde el nombre
        const roles = datosSkyHelp.roles.length ? datosSkyHelp.roles : await Api.getRoles();
        const rol = roles.find(r => normalizarTexto(r.nombreRol) === normalizarTexto(rolNombre));
        if (!rol) throw new Error('Rol no encontrado: ' + rolNombre);

        const nombre = datos.get('nombre');
        const rolNombreReal = rol.nombreRol;

        await Api.crearUsuario({
            nombreUsuarios: nombre.split(' ')[0],
            nombreCompleto: nombre,
            correo: datos.get('correo'),
            contrasena: datos.get('contrasena'),
            idRol: rol.idRol,
            estadoCuenta: 'Activo'
        });

        // Si es técnico, crear registro en tabla Tecnicos
        if (normalizarTexto(rolNombreReal) === 'tecnico') {
            const usuarios = await Api.getUsuarios();
            const nuevoUsuario = usuarios.find(u => u.correo === datos.get('correo'));
            if (nuevoUsuario) {
                await Api.post('/tecnicos/CrearTecnico', {
                    idUsuario: nuevoUsuario.idUsuario,
                    fechaRegistro: new Date().toISOString()
                });
            }
        }

        this.cerrarModal();
        this.mostrarToast(`✅ Usuario ${nombre} creado exitosamente`);
        if (this.seccionActual === 'usuarios') this.cargarContenido('usuarios');
    } catch (e) {
        this.mostrarToast('Error al crear usuario: ' + e.message, 'error');
    }
};

AplicacionSkyHelp.prototype.confirmarEliminarUsuario = function(idUsuario, nombre) {
    const contenido = `
        <div class="modal-encabezado">
            <h3>Confirmar eliminación</h3>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <div class="modal-cuerpo" style="text-align:center;padding:2rem;">
            <p style="font-size:1.1rem;margin-bottom:1.5rem;">
                ¿Estás seguro de que deseas eliminar al usuario <strong>${nombre}</strong>?
            </p>
            <p style="color:#ef4444;font-size:0.9rem;">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-pie">
            <button class="btn btn-secundario" onclick="aplicacion.cerrarModal()">No</button>
            <button class="btn btn-primario" style="background:#ef4444;border-color:#ef4444;" onclick="aplicacion.eliminarUsuario('${idUsuario}')">Sí, eliminar</button>
        </div>
    `;
    this.abrirModal(contenido);
};

AplicacionSkyHelp.prototype.eliminarUsuario = async function(idUsuario) {
    try {
        await Api.eliminarUsuario(idUsuario);
        this.cerrarModal();
        this.mostrarToast('✅ Usuario eliminado correctamente');
        this.cargarContenido('usuarios');
    } catch (e) {
        this.cerrarModal();
        this.mostrarToast('Error al eliminar: ' + e.message, 'error');
    }
};

AplicacionSkyHelp.prototype.mostrarModalEditarUsuario = function(idUsuario) {
    const usuario = datosSkyHelp.usuarios.find(u => u.idUsuario === idUsuario);
    if (!usuario) return;

    const opcionesRoles = (datosSkyHelp.roles || []).map(r =>
        `<option value="${r.idRol}" ${r.idRol === usuario.idRol ? 'selected' : ''}>${r.nombreRol}</option>`
    ).join('');

    const contenido = `
        <div class="modal-encabezado">
            <h3>Editar Usuario</h3>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <form onsubmit="aplicacion.guardarEdicionUsuario(event, '${idUsuario}')">
            <div class="modal-cuerpo">
                <div class="fila-formulario">
                    <div class="grupo-formulario">
                        <label>Nombre Completo *</label>
                        <input type="text" name="nombreCompleto" value="${usuario.nombreCompleto || ''}" required>
                    </div>
                    <div class="grupo-formulario">
                        <label>Nombre Usuario *</label>
                        <input type="text" name="nombreUsuarios" value="${usuario.nombreUsuarios || ''}" required>
                    </div>
                </div>
                <div class="grupo-formulario">
                    <label>Correo *</label>
                    <input type="email" name="correo" value="${usuario.correo || ''}" required>
                </div>
                <div class="fila-formulario">
                    <div class="grupo-formulario">
                        <label>Rol *</label>
                        <select name="idRol" required>${opcionesRoles}</select>
                    </div>
                    <div class="grupo-formulario">
                        <label>Estado *</label>
                        <select name="estadoCuenta" required>
                            <option value="Activo" ${usuario.estadoCuenta === 'Activo' ? 'selected' : ''}>Activo</option>
                            <option value="Inactivo" ${usuario.estadoCuenta === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                        </select>
                    </div>
                </div>
                <div class="grupo-formulario">
                    <label>Nueva Contraseña <span style="color:var(--gris-500);font-size:0.85rem;">(dejar vacío para no cambiar)</span></label>
                    <input type="password" name="contrasena" placeholder="••••••••">
                </div>
            </div>
            <div class="modal-pie">
                <button type="button" class="btn btn-secundario" onclick="aplicacion.cerrarModal()">Cancelar</button>
                <button type="submit" class="btn btn-primario">Guardar Cambios</button>
            </div>
        </form>
    `;
    this.abrirModal(contenido);
};

AplicacionSkyHelp.prototype.guardarEdicionUsuario = async function(evento, idUsuario) {
    evento.preventDefault();
    const datos = new FormData(evento.target);

    try {
        await Api.actualizarUsuario({
            idUsuario:      idUsuario,
            nombreUsuarios: datos.get('nombreUsuarios'),
            nombreCompleto: datos.get('nombreCompleto'),
            correo:         datos.get('correo'),
            contrasena:     datos.get('contrasena') || '',
            idRol:          datos.get('idRol'),
            estadoCuenta:   datos.get('estadoCuenta')
        });

        this.cerrarModal();
        this.mostrarToast('✅ Usuario actualizado correctamente');
        this.cargarContenido('usuarios');
    } catch (e) {
        this.mostrarToast('Error al actualizar: ' + e.message, 'error');
    }
};
