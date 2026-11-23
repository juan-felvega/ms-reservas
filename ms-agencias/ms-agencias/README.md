# ms-agencias · Contrato de la API

Microservicio **proveedor** del examen del Módulo 3 (solo lectura). Puerto: **3012**.
Lo consulta el microservicio de reservas, que guarda el atributo `agencia_id`.

## Cómo ejecutarlo

Requisitos: Node.js 22.9 o superior, MySQL 8 y ms-usuarios corriendo (para obtener tokens).

1. Como root en MySQL:

```sql
CREATE DATABASE agencias_db;
CREATE USER 'agencias_user'@'localhost' IDENTIFIED BY 'una-clave-segura';
GRANT ALL PRIVILEGES ON agencias_db.* TO 'agencias_user'@'localhost';
```

2. `mysql -u agencias_user -p agencias_db` y luego `SOURCE db/schema.sql;`
3. `npm install`
4. Copiar `.env.example` como `.env`. `JWT_SECRET` debe ser **la misma de ms-usuarios**.
5. `npm run dev`

## Representación

```json
{"id": 1, "nombre_agencia": "Viajes Pacífico", "ciudad": "Cali", "estado_convenio": "activo"}
```

## Atributos

| Atributo | Tipo |
|---|---|
| id | entero |
| nombre_agencia | texto |
| ciudad | texto |
| estado_convenio | texto |

## Endpoints

Todas las peticiones llevan `Authorization: Bearer <token>`. Cualquier rol autenticado puede consultar.

| Operación | Método | URI | Respuesta exitosa | Errores |
|---|---|---|---|---|
| Listar | GET | /agencias | 200 arreglo | 401 |
| Consultar por lotes | GET | /agencias?ids=1,3 | 200 arreglo (solo los que existen) | 400 · 401 |
| Obtener | GET | /agencias/:id | 200 objeto | 400 · 401 · 404 |

## Datos iniciales

| id | nombre_agencia | ciudad | estado_convenio |
|---|---|---|---|
| 1 | Viajes Pacífico | Cali | activo |
| 2 | Destinos Andinos | Bogotá | activo |
| 3 | Turismo Express | Medellín | suspendido |
| 4 | Caribe Tours | Cartagena | activo |

## Para el consumidor

La carpeta `para-el-consumidor/` trae `agencias.client.js` con la función `pedir()` ya escrita (token y tiempo de espera). Se copia en `ms-reservas/src/clients/` y se completa.

## Frontend del examen

La carpeta `frontend/` trae `index.html`, ya configurado para ms-reservas y ms-agencias. No se modifica: se copia al `DocumentRoot` del host virtual del examen en servidor2, y desde Windows se abre `http://examen.<dominio>/`. La página inicia sesión por `/api/usuarios/login` y muestra los listados de `/api/reservas` y `/api/agencias` por el mismo nombre, así que no necesita CORS.

## Me consultan

| Me consulta | Peticiones que me hace |
|---|---|
| ms-reservas | `GET /agencias/:id` (validar) · `GET /agencias?ids=…` (componer) |
