// =====================================================================
// CAPA DE PRESENTACIÓN (rutas)
// Asocia cada método HTTP + URI con una función del controlador
// y decide qué rutas exigen token y qué roles pueden usarlas.
// =====================================================================
const { Router } = require('express');
const controller = require('../controllers/reservas.controller');
const { verificarToken, requiereRol } = require('../middlewares/auth');

const router = Router();

// Todas las rutas exigen un token válido (401 si falta, es inválido o venció)
router.use(verificarToken);

// Consultar: cualquier rol autenticado
router.get('/', controller.listar);          // listar (filtro ?huesped=)
router.get('/:id', controller.obtener);      // obtener por id

// Crear, actualizar y eliminar: solo administrador (403 a los demás roles)
router.post('/', requiereRol('administrador'), controller.crear);
router.put('/:id', requiereRol('administrador'), controller.actualizar);
router.delete('/:id', requiereRol('administrador'), controller.eliminar);

module.exports = router;
