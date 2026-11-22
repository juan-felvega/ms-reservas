// =====================================================================
// CAPA DE PRESENTACIÓN (controlador)
// Traduce HTTP <-> servicio: lee la petición (params, query, body),
// llama al servicio y arma la respuesta (código de estado + JSON).
// =====================================================================
const service = require('../services/reservas.service');
const HttpError = require('../utils/http-error');

function leerId(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'El id debe ser un entero positivo');
  return id;
}

// GET /reservas  y  GET /reservas?huesped=Ana Torres
async function listar(req, res) {
  const filtros = {};
  if (req.query.huesped !== undefined) {
    if (typeof req.query.huesped !== 'string' || req.query.huesped.trim() === '') {
      throw new HttpError(400, 'huesped no puede estar vacío');
    }
    filtros.huesped = req.query.huesped.trim();
  }
  res.status(200).json(await service.listar(filtros));
}

// GET /reservas/:id
async function obtener(req, res) {
  res.status(200).json(await service.obtener(leerId(req)));
}

// POST /reservas
async function crear(req, res) {
  const nueva = await service.crear(req.body);
  res.status(201).location(`${req.baseUrl}/${nueva.id}`).json(nueva);
}

// PUT /reservas/:id
async function actualizar(req, res) {
  res.status(200).json(await service.actualizar(leerId(req), req.body));
}

// DELETE /reservas/:id
async function eliminar(req, res) {
  await service.eliminar(leerId(req));
  res.status(204).end();                      // 204 No Content: éxito, sin cuerpo
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
