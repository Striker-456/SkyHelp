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
                                            <button class="btn btn-primario" style="padding:0.5rem 1rem;font-size:0.8125rem;" onclick="aplicacion.mostrarToast('Función de editar usuario próximamente', 'exito')">Editar</button>
                                            <button class="btn btn-secundario" style="padding:0.5rem 1rem;font-size:0.8125rem;" onclick="aplicacion.mostrarToast('Función de desactivar usuario próximamente', 'exito')">Desactivar</button>
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
    const nuevoUsuario = {
        nombreCompleto: datos.get('nombre'),
        correo: datos.get('correo'),
        contrasena: datos.get('contrasena'),
        rol: datos.get('rol')
    };
    try {
        await Api.crearUsuario(nuevoUsuario);
        this.cerrarModal();
        this.mostrarToast(`✅ Usuario ${nuevoUsuario.nombreCompleto} creado exitosamente`);
        if (this.seccionActual === 'usuarios') this.cargarContenido('usuarios');
    } catch (e) {
        this.mostrarToast('Error al crear usuario: ' + e.message, 'error');
    }
};