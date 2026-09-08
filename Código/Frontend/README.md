# SkyHelp — Frontend

HTML/CSS/JS estático, sin paso de compilación. Todo el contenido de cada vista vive como
template strings dentro de `js/modules/*.js`, no hay archivos HTML parciales.

## Estructura

```
index.html          # Única página; landing + login + app quedan en el mismo documento
css/
├── style.css        # Importa todos los componentes de css/components/ en orden
└── components/       # Un archivo por sección (uno por cada js/modules/*.js relevante)
js/
├── script.js         # Punto de entrada: instancia AplicacionSkyHelp
└── modules/           # Un módulo por dominio, cada uno extiende el prototipo de AplicacionSkyHelp
    ├── api.js          # Cliente HTTP hacia el backend (API_BASE = http://localhost:5191)
    ├── data.js          # Estado en memoria compartido entre módulos (datosSkyHelp)
    ├── core.js           # Clase base AplicacionSkyHelp + inicialización
    ├── auth.js            # Login / registro (registro público siempre crea rol Cliente)
    ├── navigation.js       # Barra lateral, ítems de menú por rol, enrutado de secciones
    ├── dashboard.js         # Dashboard por rol (admin/técnico/cliente/domiciliario)
    ├── admin.js              # Gestión de técnicos
    ├── domiciliarios.js       # Gestión de domiciliarios + asignación de pedidos
    ├── map.js                  # Mapa / seguimiento de domiciliario
    ├── tickets.js                # CRUD de tickets, asignación de técnico, diagnóstico
    ├── users.js                   # Gestión de usuarios (admin)
    ├── auditoria.js                 # Módulo de Auditorías
    ├── reports.js                    # Módulo de Reportes
    ├── estadisticas.js                # Módulo de Estadísticas
    ├── config.js                       # Configuración (tema, etc.)
    ├── profile.js                       # Mi Perfil
    ├── history.js                        # Historial de entregas (domiciliario)
    ├── modal.js                           # Utilidades de modales (abrir/cerrar)
    └── utils.js                            # Helpers varios (insignias, normalizarTexto, etc.)
```

`index.html` carga estos scripts en ese mismo orden — respétalo si agregas un módulo nuevo:
los módulos posteriores asumen que `AplicacionSkyHelp` (core.js) y `Api`/`datosSkyHelp`
(api.js/data.js) ya existen.

No hay chat/mensajería en la aplicación — decisión de producto explícita, no lo reintroduzcas.

## Cómo ejecutar

```bash
npx http-server -p 5500
```

o cualquier otro servidor estático; abrir `http://localhost:5500`. El backend debe estar
corriendo en `http://localhost:5191` (ver `js/modules/api.js` → `API_BASE`).

## Arquitectura

Arquitectura basada en prototipos: `core.js` define la clase `AplicacionSkyHelp`, y cada
módulo en `js/modules/` le añade métodos vía `AplicacionSkyHelp.prototype.metodo = function() {...}`.
Cada módulo de dominio (tickets, usuarios, domiciliarios, etc.) sigue el mismo patrón:
una función `obtenerContenidoX()` que arma el HTML de la vista, y funciones de acción
(`guardarX`, `mostrarModalX`, etc.) que llaman a `Api` y refrescan la vista.
