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
    // Forzar reflow para reiniciar animación
    void toast.offsetWidth;
    toast.classList.remove('oculto');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => toast.classList.add('oculto'), 3500);
};