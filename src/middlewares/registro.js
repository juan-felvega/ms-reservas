// =====================================================================
// MIDDLEWARE DE REGISTRO DE PETICIONES
// Escribe en la terminal cada petición recibida: método, ruta y código
// de respuesta. Ejemplo:  GET /reservas?huesped=Ana%20Torres → 200
// res.on('finish') se ejecuta cuando la respuesta ya se envió, que es
// el momento en que se conoce el código de estado final.
// =====================================================================
function registrarPeticion(req, res, next) {
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode}`);
  });
  next();
}

module.exports = registrarPeticion;
