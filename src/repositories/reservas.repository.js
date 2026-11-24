// =====================================================================
// CAPA DE ACCESO A DATOS (repositorio)
// Única capa que sabe DÓNDE se guardan los datos (MySQL).
// Los ? son parámetros: el valor viaja aparte de la consulta (evita inyección SQL).
// =====================================================================
const pool = require('../db');

// Filtro: ?huesped=Ana Torres → WHERE huesped = 'Ana Torres'
async function findAll(filtros = {}) {
  let sql = 'SELECT * FROM reservas';
  const valores = [];
  if (filtros.huesped) {
    sql += ' WHERE huesped = ?';
    valores.push(filtros.huesped);
  }
  const [filas] = await pool.query(sql + ' ORDER BY id', valores);
  return filas;
}

async function findById(id) {
  const [filas] = await pool.query('SELECT * FROM reservas WHERE id = ?', [id]);
  return filas.length > 0 ? filas[0] : null;
}

// Para la regla de unicidad: busca otra reserva con el mismo codigo
async function findByCodigo(codigo) {
  const [filas] = await pool.query('SELECT * FROM reservas WHERE codigo = ?', [codigo]);
  return filas.length > 0 ? filas[0] : null;
}

async function create(reserva) {
  const [resultado] = await pool.query(
    'INSERT INTO reservas (codigo, huesped, fecha_entrada, fecha_salida, personas, agencia_id) VALUES (?, ?, ?, ?, ?, ?)',
    [
      reserva.codigo,
      reserva.huesped,
      reserva.fecha_entrada,
      reserva.fecha_salida,
      reserva.personas,
      reserva.agencia_id,
    ]
  );

  return findById(resultado.insertId);
}

async function update(id, reserva) {
  const [resultado] = await pool.query(
    'UPDATE reservas SET codigo = ?, huesped = ?, fecha_entrada = ?, fecha_salida = ?, personas = ?, agencia_id = ? WHERE id = ?',
    [
      reserva.codigo,
      reserva.huesped,
      reserva.fecha_entrada,
      reserva.fecha_salida,
      reserva.personas,
      reserva.agencia_id,
      id,
    ]
  );

  if (resultado.affectedRows === 0) return null;
  return findById(id);
}

async function remove(id) {
  const [resultado] = await pool.query('DELETE FROM reservas WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}

module.exports = { findAll, findById, findByCodigo, create, update, remove };
