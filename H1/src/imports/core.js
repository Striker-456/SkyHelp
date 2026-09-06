// js/modules/core.js
// Clase base y métodos iniciales de SkyHelp

class AplicacionSkyHelp {
    constructor() {
        this.vistaActual = 'inicio';
        this.usuarioActual = null;
        this.seccionActual = 'dashboard';
        this.barraLateralAbierta = true;
        
        this.inicializar();
    }
    
    inicializar() {
        console.log('Aplicación SkyHelp inicializada');
        this.mostrarVista('inicio');
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.cerrarModal();
        });
        // Restaurar tema guardado
        if (localStorage.getItem('skyhelp-tema') === 'oscuro') {
            document.body.classList.add('modo-oscuro');
            document.querySelectorAll('.icono-luna').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.icono-sol').forEach(el => el.style.display = '');
        }
    }
    
    // Gestión de Vistas
    mostrarVista(nombreVista) {
        const vistas = document.querySelectorAll('.vista');
        vistas.forEach(vista => vista.classList.remove('activa'));
        
        const vistaObjetivo = document.getElementById(`pagina-${nombreVista}`) || document.getElementById(`vista-${nombreVista}`);
        if (vistaObjetivo) {
            vistaObjetivo.classList.add('activa');
            this.vistaActual = nombreVista;
            
            // Si se muestra la vista de aplicación, asegúrate de que la barra lateral esté abierta
            if (nombreVista === 'aplicacion') {
                setTimeout(() => {
                    const barraLateral = document.getElementById('barra-lateral');
                    if (barraLateral) {
                        barraLateral.classList.remove('minimizada');
                        this.barraLateralAbierta = true;
                    }
                }, 100);
            }
        }
    }
    
    mostrarInicio() {
        this.mostrarVista('inicio');
    }
    
    mostrarLogin() {
        this.mostrarVista('login');
    }
    
    mostrarApp() {
        this.mostrarVista('aplicacion');
        this.inicializarBarraLateral();
        this.navegarA('dashboard');
    }
    
    // Gestión de Pestañas
    cambiarPestana(nombrePestana) {
        const pestanas = document.querySelectorAll('.pestana');
        const contenidosPestana = document.querySelectorAll('.contenido-pestana');
        
        pestanas.forEach(pestana => {
            if (pestana.dataset.pestana === nombrePestana) {
                pestana.classList.add('activa');
            } else {
                pestana.classList.remove('activa');
            }
        });
        
        contenidosPestana.forEach(contenido => {
            if (contenido.id === `pestana-${nombrePestana}`) {
                contenido.classList.add('activa');
            } else {
                contenido.classList.remove('activa');
            }
        });
    }
    
    // Alternar Contraseña
    alternarContrasena(idInput) {
        const input = document.getElementById(idInput);
        if (input.type === 'password') {
            input.type = 'text';
        } else {
            input.type = 'password';
        }
    }
    
    // Carga
    mostrarCarga() {
        const pantallaCarga = document.getElementById('pantalla-carga');
        pantallaCarga.classList.remove('oculto');
    }
    
    ocultarCarga() {
        const pantallaCarga = document.getElementById('pantalla-carga');
        pantallaCarga.classList.add('oculto');
    }

    alternarModoOscuro() {
        const oscuro = document.body.classList.toggle('modo-oscuro');
        localStorage.setItem('skyhelp-tema', oscuro ? 'oscuro' : 'claro');
        // Actualizar todos los toggles (app + landing)
        document.querySelectorAll('.icono-luna').forEach(el => el.style.display = oscuro ? 'none' : '');
        document.querySelectorAll('.icono-sol').forEach(el => el.style.display = oscuro ? '' : 'none');
    }
}