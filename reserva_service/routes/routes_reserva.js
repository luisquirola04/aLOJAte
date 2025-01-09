const express = require('express');
const router = express.Router();
const Controller_Reserva = require('../controller/controller_reserva');
const controller = new Controller_Reserva();


router.post('/reserva/registrar_reserva', (req, res) => controller.registrarReserva(req, res));
router.get('/reserva/:id_inmueble', (req, res) => controller.listar_reservas_inmueble(req, res));
router.get('/reserva/:id_cuenta_reservante', (req, res) => controller.listar_reservas_arrendatario(req, res));
router.get('/reserva/activos', (req, res) => controller.listarInmueblesActivos(req, res));
router.put('/reserva/visibilidad/:uuid', (req, res) => controller.desactivar_visibilidad_reserva(req, res));
router.put('/reserva/aceptar/:uuid', (req, res) => controller.activarInmueble(req, res));
router.put('/reserva/:uuid/desactivar', (req, res) => controller.desactivarInmueble(req, res));

module.exports = router;