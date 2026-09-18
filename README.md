
# SkyHelp CRM
Sistema CRM para gestión de tickets de soporte técnico, reparación y entrega de equipos electrónicos.

#URL
https://sky-help-fronted.vercel.app/#tickets 
## Estructura del repositorio

```
Código/
├── Backend/     API .NET 8 (Controllers → Services/Repositories → DTOs, EF Core + SQL Server)
├── Frontend/    Frontend vanilla JS (sin build step), un módulo por dominio en js/modules/
├── docker-compose.yml
└── .env.example

docs/design-reference/H1/   Referencia de diseño (prototipo Figma Make) — proyecto Vite/React
                             aparte, no se compila ni se importa desde Código/.
```

Ver `Código/Frontend/README.md` para el detalle del frontend.

## Levantar el proyecto en local

### Backend (API)

```bash
cd Código/Backend
dotnet user-secrets set "Jwt:Key" "<clave-de-al-menos-32-caracteres>"
dotnet user-secrets set "Jwt:Issuer" "SkyHelp"
dotnet user-secrets set "Jwt:Audience" "SkyHelpClientes"
dotnet user-secrets set "ConnectionStrings:SQL" "<tu-connection-string>"
dotnet run
```

La API queda en `http://localhost:5191`, con Swagger habilitado en entorno de desarrollo.

### Frontend

Es HTML/CSS/JS estático, sin paso de compilación. Basta con servirlo con cualquier servidor estático:

```bash
cd Código/Frontend
npx http-server -p 5500
```

`js/modules/api.js` apunta a `http://localhost:5191` como `API_BASE`.

### Con Docker

```bash
cd Código
cp .env.example .env   # completar SA_PASSWORD
docker-compose up
```

## Arquitectura

- **Backend**: capa `Services/` (con sus `DTOs/`) solo donde ya existía lógica de negocio que lo justificaba (Auditorías, Reportes, Estadísticas, Pedidos); el resto de controladores llama a `Repositories/` directamente. `Authorization/` define los roles canónicos (`RoleNames`) y el mapeo desde los nombres de rol en base de datos. `Context/InyeccionDependencias.cs` centraliza el registro de dependencias.
- **Frontend**: una única página (`index.html`) más una clase `AplicacionSkyHelp` (definida en `js/modules/core.js`) que cada módulo en `js/modules/` extiende con los métodos de su dominio (tickets, usuarios, domiciliarios, etc.). No hay chat/mensajería en el sistema — decisión de producto explícita.
- **Roles**: Administrador, Técnico, Domiciliario, Usuario (cliente). Solo un Administrador puede asignar roles distintos de Usuario.
