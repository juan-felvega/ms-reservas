// =====================================================================
// CAPA DE PRESENTACIÓN (rutas)
// Asocia cada método HTTP + URI con una función del controlador.
// =====================================================================
const { Router } = require('express');
const controller = require('../controllers/reservas.controller');

const router = Router();

router.get('/', controller.listar);          // listar (filtro ?huesped=)
router.get('/:id', controller.obtener);      // obtener por id
router.post('/', controller.crear);          // crear
router.put('/:id', controller.actualizar);   // actualizar
router.delete('/:id', controller.eliminar);  // eliminar

module.exports = router;
