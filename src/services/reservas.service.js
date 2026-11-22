// =====================================================================
// CAPA DE SERVICIO (lógica de negocio)
// Aplica las validaciones y la regla de negocio (codigo único → 409).
// No sabe nada de HTTP (req/res) ni de cómo se guardan los datos.
// =====================================================================
const repo = require('../repositories/reservas.repository');
const { validarReserva, construirReserva } = require('../models/reserva');
const HttpError = require('../utils/http-error');

// Valida los datos (400) y devuelve la reserva limpia
function prepararReserva(datos) {
  const errores = validarReserva(datos);
  if (errores.length > 0) throw new HttpError(400, 'Datos inválidos', errores);
  return construirReserva(datos);
}

// Regla de negocio: no puede haber dos reservas con el mismo codigo (409 Conflict).
// idActual: al actualizar, la misma reserva puede conservar su codigo.
async function verificarCodigoUnico(codigo, idActual = null) {
  const existente = await repo.findByCodigo(codigo);
  if (existente && existente.id !== idActual) {
    throw new HttpError(409, `Ya existe una reserva con el codigo ${codigo}`);
  }
}

// Si dos peticiones llegan a la vez, la restricción UNIQUE de la tabla
// es la última defensa: MySQL responde ER_DUP_ENTRY y lo convertimos en 409.
function traducirDuplicado(error, codigo) {
  if (error.code === 'ER_DUP_ENTRY') {
    return new HttpError(409, `Ya existe una reserva con el codigo ${codigo}`);
  }
  return error;
}

async function listar(filtros) {
  return repo.findAll(filtros);
}

async function obtener(id) {
  const reserva = await repo.findById(id);
  if (!reserva) throw new HttpError(404, `No existe la reserva con id ${id}`);
  return reserva;
}

async function crear(datos) {
  const reserva = prepararReserva(datos);
  await verificarCodigoUnico(reserva.codigo);
  try {
    return await repo.create(reserva);
  } catch (error) {
    throw traducirDuplicado(error, reserva.codigo);
  }
}

async function actualizar(id, datos) {
  const reserva = prepararReserva(datos);
  if (!(await repo.findById(id))) throw new HttpError(404, `No existe la reserva con id ${id}`);
  await verificarCodigoUnico(reserva.codigo, id);
  try {
    return await repo.update(id, reserva);
  } catch (error) {
    throw traducirDuplicado(error, reserva.codigo);
  }
}

async function eliminar(id) {
  const eliminada = await repo.remove(id);
  if (!eliminada) throw new HttpError(404, `No existe la reserva con id ${id}`);
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
