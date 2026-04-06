// js/modules/profile.js
// Métodos para perfil de usuario

AplicacionSkyHelp.prototype.obtenerContenidoPerfil = function() {
    return `
        <div class="deslizar-arriba">
            <div class="tarjeta">
                <h3>Mi Perfil</h3>
                <div style="max-width: 650px; margin-top: 2rem;">
                    <div class="grupo-formulario">
                        <label>Nombre Completo</label>
                        <input type="text" value="${this.usuarioActual.nombre}">
                    </div>
                    
                    <div class="grupo-formulario">
                        <label>Email</label>
                        <input type="email" value="${this.usuarioActual.correo}" disabled>
                    </div>
                    
                    <div class="grupo-formulario">
                        <label>Rol</label>
                        <input type="text" value="${this.usuarioActual.rol}" disabled style="text-transform: capitalize;">
                    </div>
                    
                    <div class="grupo-formulario">
                        <label>Teléfono</label>
                        <input type="tel" placeholder="+57 123 456 7890">
                    </div>
                    
                    <div class="grupo-formulario">
                        <label>Nueva Contraseña</label>
                        <input type="password" placeholder="Dejar en blanco para no cambiar">
                    </div>
                    
                    <div class="grupo-formulario">
                        <label>Confirmar Contraseña</label>
                        <input type="password" placeholder="Confirmar nueva contraseña">
                    </div>
                    
                    <button class="btn btn-primario">Actualizar Perfil</button>
                </div>
            </div>
        </div>
    `;
};