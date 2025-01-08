const express = require('express');
const ruta = express.Router();
const notificacion_control = require('../controllers/controlador_notificacion');
const { validar_notificacion, validar_actualizar_notificacion } = require('../middleware/middleware');

// api para listar las notificaciones de un usuario
ruta.get('/notificaciones/:uuid', notificacion_control.listar_notificaciones);
// api para crear una notificacion
ruta.post('/notificacion', validar_notificacion, notificacion_control.crear_notificacion);
// api para actualizar una notificacion
ruta.put('/notificacion/:uuid', validar_actualizar_notificacion, notificacion_control.actualizar_notificacion);
// api para actualizar el estado de una notificacion
ruta.post('/notificacion/estado:uuid', notificacion_control.actualizar_estado_notificacion);

module.exports = ruta;
