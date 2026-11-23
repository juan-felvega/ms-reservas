// =====================================================================
// CLIENTE HTTP de ms-agencias, para el microservicio de reservas.
// Copie este archivo en ms-reservas/src/clients/ y COMPLÉTELO:
// la función pedir() ya está hecha; faltan las funciones que usan
// la validación, la regla de negocio y la composición.
// En el .env de ms-reservas:  AGENCIAS_URL=http://127.0.0.1:3012
// =====================================================================
const HttpError = require('../utils/http-error');
const AGENCIAS_URL = process.env.AGENCIAS_URL;

// Hace una petición GET a ms-agencias reenviando el token del usuario.
// Devuelve la respuesta de fetch, o null si ms-agencias no respondió.
async function pedir(ruta, token) {
  try {
    return await fetch(`${AGENCIAS_URL}${ruta}`, {
      headers: { Authorization: token },     // el token de la petición original
      signal: AbortSignal.timeout(3000),      // no esperar más de 3 segundos
    });
  } catch (error) {
    return null;                              // ms-agencias caído o sin responder
  }
}

// Ejemplo de uso:
//   const respuesta = await pedir('/agencias/3', token);
//   if (!respuesta) ...                   → ms-agencias no respondió
//   if (respuesta.status === 404) ...     → no existe
//   const datos = await respuesta.json(); → el objeto (o el arreglo, con ?ids=)

module.exports = { pedir };
