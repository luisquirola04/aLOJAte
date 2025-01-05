// routes/routes_inmueble.js
const express = require('express');
const router = express.Router();
const Controller_Inmueble = require('../controller/controller_inmueble');
const controller = new Controller_Inmueble();

router.post('/registrar_inmueble', (req, res) => controller.registrarInmueble(req, res));
router.get('/inmuebles', (req, res) => controller.listarInmuebles(req, res));
router.get('/inmuebles/activos', (req, res) => controller.listarInmueblesActivos(req, res));
router.get('/inmueble/:uuid', (req, res) => controller.obtenerInmueble(req, res));
router.put('/inmueble/:uuid', (req, res) => controller.actualizarInmueble(req, res));
router.put('/inmueble/:uuid/activar', (req, res) => controller.activarInmueble(req, res));
router.put('/inmueble/:uuid/desactivar', (req, res) => controller.desactivarInmueble(req, res));

module.exports = router;