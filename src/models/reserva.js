// =====================================================================
// CAPA DE MODELO (entidad)
// Define qué campos tiene una Reserva y qué reglas deben cumplir.
// No sabe nada de HTTP ni de bases de datos.
// =====================================================================

const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/; // AAAA-MM-DD

function esTextoValido(valor) {
  return typeof valor === 'string' && valor.trim() !== '';
}

// AAAA-MM-DD y además una fecha que exista (rechaza 2026-02-30)
function esFechaValida(valor) {
  if (typeof valor !== 'string' || !FORMATO_FECHA.test(valor)) return false;
  const fecha = new Date(`${valor}T00:00:00Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor;
}

// Devuelve una lista de errores de validación (vacía si todo está bien)
function validarReserva(datos) {
  const errores = [];
  if (!datos || typeof datos !== 'object') {
    return ['Se esperaba un objeto JSON con los datos de la reserva'];
  }
  if (!esTextoValido(datos.codigo)) errores.push('codigo es obligatorio');
  if (!esTextoValido(datos.huesped)) errores.push('huesped es obligatorio');

  const entradaOk = esFechaValida(datos.fecha_entrada);
  const salidaOk = esFechaValida(datos.fecha_salida);
  if (!entradaOk) errores.push('fecha_entrada es obligatoria con formato AAAA-MM-DD');
  if (!salidaOk) errores.push('fecha_salida es obligatoria con formato AAAA-MM-DD');
  // Las fechas AAAA-MM-DD se pueden comparar como texto: '2026-12-05' > '2026-12-01'
  if (entradaOk && salidaOk && datos.fecha_salida <= datos.fecha_entrada) {
    errores.push('fecha_salida debe ser posterior a fecha_entrada');
  }

  if (!Number.isInteger(datos.personas) || datos.personas <= 0) {
    errores.push('personas es obligatorio y debe ser un entero mayor que 0');
  }
    if (!Number.isInteger(datos.agencia_id) || datos.agencia_id <= 0) {
    errores.push('agencia_id es obligatorio y debe ser un entero mayor que 0');
  }
  return errores;
}

// Construye una reserva "limpia" solo con los campos permitidos

function construirReserva(datos) {
  return {
    codigo: datos.codigo.trim(),
    huesped: datos.huesped.trim(),
    fecha_entrada: datos.fecha_entrada,
    fecha_salida: datos.fecha_salida,
    personas: datos.personas,
    agencia_id: datos.agencia_id,
  };

}

module.exports = { validarReserva, construirReserva };
