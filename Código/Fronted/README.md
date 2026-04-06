# SkyHelp - Sistema CRM de Gestión de Equipos

## Estructura Modular del Proyecto

Este proyecto ha sido reorganizado en una arquitectura modular para mejorar la mantenibilidad y organización del código.

### Estructura de Archivos

```
SkyHelp_Front/
├── index.html          # Archivo principal HTML
├── css/
│   └── style.css       # Estilos CSS
└── js/
    ├── script.js       # Inicialización de la aplicación
    └── modules/        # Módulos JavaScript organizados por funcionalidad
        ├── data.js     # Datos de demostración
        ├── core.js     # Clase base y métodos principales
        ├── auth.js     # Autenticación (login/registro)
        ├── navigation.js # Barra lateral y navegación
        ├── dashboard.js  # Contenido del dashboard
        ├── map.js      # Mapa y seguimiento GPS
        ├── tickets.js  # Gestión de tickets
        ├── users.js    # Gestión de usuarios
        ├── reports.js  # Reportes y estadísticas
        ├── config.js   # Configuración del sistema
        ├── knowledge.js # Base de conocimientos
        ├── profile.js  # Perfil de usuario
        ├── history.js  # Historial de entregas
        ├── modal.js    # Utilidades de modales
        └── utils.js    # Funciones auxiliares
```

### Arquitectura Modular

La aplicación utiliza una arquitectura basada en prototipos de JavaScript donde cada módulo extiende la clase `AplicacionSkyHelp` con métodos específicos:

- **data.js**: Contiene los datos de demostración (`datosSkyHelp`)
- **core.js**: Define la clase base `AplicacionSkyHelp` con métodos fundamentales
- **Módulos funcionales**: Cada módulo añade métodos específicos al prototipo de la clase

### Orden de Carga

Los scripts se cargan en el siguiente orden para asegurar dependencias correctas:

1. `data.js` - Datos base
2. `core.js` - Clase principal
3. `auth.js` - Autenticación
4. `navigation.js` - Navegación
5. `dashboard.js` - Dashboard
6. `map.js` - Mapa
7. `tickets.js` - Tickets
8. `users.js` - Usuarios
9. `reports.js` - Reportes
10. `config.js` - Configuración
11. `knowledge.js` - Conocimiento
12. `profile.js` - Perfil
13. `history.js` - Historial
14. `modal.js` - Modales
15. `utils.js` - Utilidades
16. `script.js` - Inicialización

### Cómo Ejecutar

1. Abrir `index.html` en un navegador web
2. O usar un servidor local:
   ```bash
   cd SkyHelp_Front
   python -m http.server 8000
   ```
   Luego abrir `http://localhost:8000`

### Cuentas de Prueba

- **Administrador**: admin@skyhelp.com / admin123
- **Técnico**: tecnico@skyhelp.com / tecnico123
- **Cliente**: cliente@skyhelp.com / cliente123
- **Domiciliario**: domiciliario@skyhelp.com / domiciliario123

### Características Principales

- ✅ Gestión completa de tickets
- ✅ Múltiples roles de usuario
- ✅ Seguimiento GPS en tiempo real
- ✅ Reportes y estadísticas
- ✅ Base de conocimientos
- ✅ Notificaciones automáticas
- ✅ Interfaz responsive

### Desarrollo

Para modificar funcionalidades específicas, editar el módulo correspondiente en `js/modules/`. La clase principal se mantiene en `js/script.js` para la inicialización.</content>
<parameter name="filePath">c:\Users\andrea\OneDrive\Documentos\Sebas 2025\Skyhelp_Front\README.md