const express = require('express');
const router = express.Router();


const Controller_Catalogo = require('../controller/controller_catalogo');
const controller = new Controller_Catalogo();

router.post('/registrar_catalogo', (req, res) => controller.registrarCatalogo(req, res));
router.get('/catalogos', (req, res) => controller.listarCatalogos(req, res));
router.get('/catalogo/:uuid', (req, res) => controller.obtenerCatalogo(req, res));
router.put('/catalogo/:uuid', (req, res) => controller.actualizarCatalogo(req, res));
router.delete('/catalogo/:uuid', (req, res) => controller.eliminarCatalogo(req, res));

module.exports = router;