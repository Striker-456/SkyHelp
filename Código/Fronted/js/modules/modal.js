// js/modules/modal.js
// Métodos para gestión de modales

AplicacionSkyHelp.prototype.abrirModal = function(contenido, grande = false) {
    const overlay = document.getElementById('contenedor-modal');
    const modal = document.getElementById('modal-principal');
    modal.className = `modal${grande ? ' modal-grande' : ''}`;
    modal.innerHTML = contenido;
    overlay.classList.remove('oculto');
    document.body.style.overflow = 'hidden';
};

AplicacionSkyHelp.prototype.cerrarModal = function() {
    const overlay = document.getElementById('contenedor-modal');
    if (overlay) {
        overlay.classList.add('oculto');
        document.body.style.overflow = '';
    }
};

AplicacionSkyHelp.prototype.cerrarModalAlFondo = function(evento) {
    if (evento.target === evento.currentTarget) this.cerrarModal();
};

AplicacionSkyHelp.prototype.mostrarToast = function(mensaje, tipo = 'exito') {
    const toast = document.getElementById('toast-notificacion');
    const textoToast = document.getElementById('toast-mensaje');
    if (!toast || !textoToast) return;
    textoToast.textContent = mensaje;
    toast.className = `toast toast-${tipo}`;
    setTimeout(() => toast.classList.add('oculto'), 3000);
};

AplicacionSkyHelp.prototype.mostrarConfirmacion = function(mensaje, titulo = '¿Confirmar?', onConfirmar, onCancelar) {
    const contenido = `
        <div class="modal-encabezado">
            <h3>${titulo}</h3>
            <button class="btn-cerrar-modal" onclick="aplicacion.cerrarModal()">✕</button>
        </div>
        <div class="modal-cuerpo" style="text-align: center; padding: 2rem;">
            <p style="font-size: 1rem; color: var(--gris-700); margin-bottom: 2rem;">${mensaje}</p>
        </div>
        <div class="modal-pie" style="justify-content: center; gap: 1rem;">
            <button class="btn btn-secundario" onclick="aplicacion.cerrarModal(); ${onCancelar ? onCancelar : ''}">Cancelar</button>
            <button class="btn btn-primario" onclick="aplicacion.cerrarModal(); ${onConfirmar}">Confirmar</button>
        </div>
    `;
    this.abrirModal(contenido);
};
