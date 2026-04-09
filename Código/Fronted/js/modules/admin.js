// js/modules/admin.js
// Gestión de técnicos conectada a la API

AplicacionSkyHelp.prototype.obtenerContenidoTechnicos = async function() {
    let tecnicos = [];
    let usuarios = [];
    try {
        [tecnicos, usuarios] = await Promise.all([Api.getTecnicos(), Api.getUsuarios()]);
        tecnicos = tecnicos || [];
        usuarios = usuarios || [];
    } catch (e) {
        tecnicos = [];
        usuarios = [];
    }

    const getNombre = (idUsuario) => {
        const u = usuarios.find(u => u.idUsuario === idUsuario);
        return u ? (u.nombreCompleto || u.nombreUsuarios || u.correo) : idUsuario;
    };

    const getCorreo = (idUsuario) => {
        const u = usuarios.find(u => u.idUsuario === idUsuario);
        return u ? u.correo : '';
    };

    const filas = tecnicos.length === 0
        ? `<tr><td colspan="4" style="text-align:center;padding:2rem;">No hay técnicos registrados</td></tr>`
        : tecnicos.map(t => `
            <tr>
                <td>
                    <div class="info-tecnico">
                        <div class="avatar-tecnico">${(t.nombreCompleto || t.nombre || '?').charAt(0)}</div>
                        <div class="datos-tecnico">
                            <div class="nombre-tecnico">${t.nombreCompleto || t.nombre || ''}</div>
                            <div class="email-tecnico">${t.correo || ''}</div>
                        </div>
                    </div>
                </td>
                <td><span class="badge-estado estado-activo">🟢 Activo</span></td>
                <td>${t.especialidad || 'General'}</td>
                <td>
                    <button class="btn btn-primario" style="padding:0.5rem 1rem;font-size:0.8125rem;"
                        onclick="aplicacion.mostrarToast('Detalle próximamente')">Ver</button>
                </td>
            </tr>
        `).join('');

    return `
        <div class="deslizar-arriba">
            <div class="encabezado-tickets">
                <h3>Gestión de Técnicos</h3>
            </div>
            <div class="tarjeta">
                <div class="contenedor-tabla">
                    <table>
                        <thead>
                            <tr>
                                <th>Técnico</th>
                                <th>Estado</th>
                                <th>Especialidad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>${filas}</tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
};
