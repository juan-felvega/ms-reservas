// CAPA DE PRESENTACIÓN: rutas de agencias (solo lectura, cualquier rol autenticado)
const { Router } = require('express');
const controller = require('../controllers/agencias.controller');
const { verificarToken } = require('../middlewares/auth');

const router = Router();

router.use(verificarToken);                // todas las rutas exigen token

router.get('/', controller.listar);       // GET /agencias  y  GET /agencias?ids=1,3
router.get('/:id', controller.obtener);   // GET /agencias/:id

module.exports = router;
