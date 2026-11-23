# ms-reservas

Microservicio de **reservas** · Evaluación del Módulo 3 · Redes y Servicios Multimedia (UAO).
Hecho con **Node.js + Express 5** en capas y **MySQL**.

Pareja: Jhoan Esteban Burgos Guerrero · Juan Felipe Vega Reyes · Puerto: **3011**

## Contenido del repositorio

| Carpeta | Qué es |
|---|---|
| raíz (`src/`, `db/`, `docs/`) | **ms-reservas**, el microservicio de la pareja (puerto 3011) |
| `ms-usuarios/` | **ms-usuarios** (versión completa de la docente, puerto 3001): entrega el token con `POST /usuarios/login`. Se incluye para que el repositorio tenga todo lo necesario para correr y desplegar. Ver [ms-usuarios/README.md](ms-usuarios/README.md) |

ms-reservas no le pregunta nada a ms-usuarios: verifica el token con su propio `auth.js` y la **misma `JWT_SECRET`** en los dos `.env`.

## Cómo ejecutarlo

Requisitos: Node.js 22.9 o superior, MySQL y ms-usuarios corriendo en el puerto 3001 (carpeta `ms-usuarios/`: `npm install`, su `.env` a partir de `.env.example`, su `db/schema.sql` en `usuarios_db` y `npm run dev`).

1. Crear la base y el usuario, y cargar la tabla (en la consola de MySQL):
   ```
   CREATE DATABASE reservas_db;
   CREATE USER 'reservas_user'@'localhost' IDENTIFIED BY '<CLAVE>';
   GRANT ALL PRIVILEGES ON reservas_db.* TO 'reservas_user'@'localhost';
   USE reservas_db;
   SOURCE db/schema.sql;
   ```
2. Instalar y configurar:
   ```
   npm install
   copy .env.example .env      # en Linux: cp .env.example .env
   ```
   En el `.env`: `DB_PASSWORD` y la misma `JWT_SECRET` de ms-usuarios.
3. Arrancar: `npm run dev` y probar http://localhost:3011/health

## Capas

| Archivo | Capa | Responsabilidad |
|---|---|---|
| src/index.js | Arranque | Lee PORT y HOST y pone el servidor a escuchar |
| src/app.js | Configuración | Registro de peticiones, /health, rutas, 404 y manejo de errores |
| src/middlewares/registro.js | Middleware | Escribe en la terminal cada petición: método, ruta y código |
| src/middlewares/auth.js | Middleware | El de ms-usuarios: verifica el token y el rol |
| src/routes/reservas.routes.js | Presentación | Método HTTP + URI → controlador, y permisos por rol |
| src/controllers/reservas.controller.js | Presentación | Lee id, filtro y cuerpo; responde con el código de estado |
| src/services/reservas.service.js | Lógica de negocio | Validaciones (400), existencia (404) y codigo único (409) |
| src/repositories/reservas.repository.js | Acceso a datos | Consultas SQL parametrizadas a reservas_db |
| src/models/reserva.js | Modelo | Atributos de la reserva y su validación |
| src/utils/http-error.js | Utilidad | Error con código de estado HTTP |

## Contrato

### Representación

```json
{
  "id": 1,
  "codigo": "RES-001",
  "huesped": "Ana Torres",
  "fecha_entrada": "2026-12-01",
  "fecha_salida": "2026-12-05",
  "personas": 2
}
```

| Atributo | Tipo | Reglas |
|---|---|---|
| id | entero | Lo asigna la base de datos |
| codigo | texto | Obligatorio y **único** (repetido → 409) |
| huesped | texto | Obligatorio |
| fecha_entrada | fecha AAAA-MM-DD | Obligatoria, fecha válida |
| fecha_salida | fecha AAAA-MM-DD | Obligatoria, **posterior a fecha_entrada** (si no → 400) |
| personas | entero | Obligatorio, mayor que 0 |

### Seguridad

Todas las rutas de /reservas exigen `Authorization: Bearer <token>` (el token lo entrega ms-usuarios con `POST /usuarios/login`).

| Operación | Roles |
|---|---|
| GET (listar y por id) | Cualquier rol autenticado |
| POST, PUT, DELETE | Solo `administrador` |

Sin token o con token inválido → **401**. Rol sin permiso → **403**.

### Endpoints

| Método | URI | Éxito | Errores |
|---|---|---|---|
| GET | /health | 200 `{"servicio":"ms-reservas","estado":"ok"}` | — |
| GET | /reservas | 200 arreglo de reservas | 400 si `?huesped=` viene vacío · 401 |
| GET | /reservas?huesped=Ana Torres | 200 reservas de ese huésped | 400 · 401 |
| GET | /reservas/:id | 200 reserva | 400 id no numérico · 401 · 404 |
| POST | /reservas | 201 reserva creada (cabecera Location) | 400 datos inválidos · 401 · 403 · 409 codigo repetido |
| PUT | /reservas/:id | 200 reserva actualizada | 400 · 401 · 403 · 404 · 409 codigo de otra reserva |
| DELETE | /reservas/:id | 204 sin cuerpo | 400 · 401 · 403 · 404 |

Cuerpo de POST y PUT:

```json
{ "codigo": "RES-100", "huesped": "Luis Paz", "fecha_entrada": "2026-12-02", "fecha_salida": "2026-12-04", "personas": 3 }
```

Los errores responden `{ "error": "mensaje", "detalles": [ ... ] }`.

### Registro de peticiones

Cada petición queda en la terminal, por ejemplo:

```
POST /reservas → 409
GET /reservas?huesped=Ana%20Torres → 200
```

## Pruebas

Colección de Postman en [docs/ms-reservas.postman_collection.json](docs/ms-reservas.postman_collection.json), sin scripts: 2 logins y 19 casos (200, 201, 204, 400, 401, 403, 404 y 409).

1. Correr 00a (administrador) y 00b (otro rol) escribiendo el password solo en Postman.
2. Copiar cada token a las variables de la colección `token` y `token_otro_rol`.
3. Ejecutar del 01 al 19 con la base recién cargada (el 06 crea la reserva 4 y el 14 la elimina).
