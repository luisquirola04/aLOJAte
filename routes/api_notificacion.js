const express = require('express');
const ruta = express.Router();
const { listar_notificaciones, crear_notificacion, actualizar_estado_notificacion, actualizar_notificacion } = require('../controllers/controlador_notificacion');
const { validar_notificacion, validar_actualizar_notificacion } = require('../middleware');

// api para listar las notificaciones de un usuario
ruta.get('/notificaciones/:id', listar_notificaciones);
// api para crear una notificacion
ruta.post('/notificacion', validar_notificacion, crear_notificacion);
// api para actualizar una notificacion
ruta.put('/notificacion/:id', validar_actualizar_notificacion, actualizar_notificacion);
// api para desactivar una notificacion
ruta.post('/notificacion/:id', actualizar_estado_notificacion);

module.exports = ruta;
