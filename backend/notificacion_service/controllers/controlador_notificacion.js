const Notificacion = require('../models/Notificacion');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const sequelize = require('../config/config_bd');
const URL_API = process.env.API_CUENTA;

class controlador_notificacion {
    // metodo para ver las notificaciones de un cuenta en especifico
    async listar_notificaciones(req, res) {
        try {
            const { uuid } = req.params;
            //realizar consulta a la api de cuenta
            const respuesta = await axios.get(`${URL_API}/admin/usuario/buscar/${uuid}`);
            const cuenta = respuesta.data;

            if (!cuenta) {
                return res.status(404).json({
                    code: 404,
                    msg: 'ERROR',
                    info: 'No existe la cuenta'
                });
            }

            const notificaciones = await Notificacion.findAll({
                where: {
                    id_cuenta: cuenta.id,
                    estado: true
                }
            });

            return res.status(200).json({ code: 200, msg: 'OK', data: notificaciones });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                code: 500,
                msg: 'ERROR',
                info: 'Error al obtener las notificaciones'
            });
        }
    }

    //metodo crear una notificacion para un cuenta en especifico
    async crear_notificacion(req, res) {
        const transaccion = await sequelize.transaction();
        try {
            const { titulo, descripcion, uuid } = req.body;
            //realizar consulta a la api de cuenta
            const respuesta = await axios.get(`${URL_API}/admin/usuario/buscar/${uuid}`);
            const cuenta = respuesta.data;

            console.log(cuenta);
            if (!cuenta) {
                return res.status(404).json({
                    code: 404,
                    msg: 'ERROR',
                    info: 'No existe el cuenta'
                });
            }
            const fecha_actual = new Date().toISOString();
            const uid = uuidv4();

            await Notificacion.create({
                uuid: uid,
                titulo: titulo,
                descripcion: descripcion,
                fecha: fecha_actual,
                id_cuenta: cuenta.id,
                estado: true,
                createdAt: fecha_actual,
                updatedAt: fecha_actual
            });

            // commit si todo esta correcto
            await transaccion.commit();

            return res.status(201).json({ code: 201, msg: 'OK', info: 'Notificacion creada correctamente', uuid: uid });
        } catch (error) {
            // rollback si hay error
            await transaccion.rollback();
            console.log(error);
            return res.status(500).json({
                code: 500,
                msg: 'ERROR',
                info: 'Error al crear la notificacion'
            });
        }
    }

    //metodo para actualizar una notificacion
    async actualizar_notificacion(req, res) {
        const transaccion = await sequelize.transaction();
        try {
            const { uuid } = req.params;
            const { titulo, descripcion } = req.body;
            const notificacion = await Notificacion.findOne({
                where: {
                    id: uuid,
                    estado: true
                }
            });
            if (!notificacion) {
                return res.status(404).json({
                    code: 404,
                    msg: 'ERROR',
                    info: 'No existe la notificacion'
                });
            }
            const fecha_actual = new Date().toISOString();
            const uid = uuidv4();

            await Notificacion.update({
                uuid: uid,
                titulo: titulo,
                descripcion: descripcion,
                updatedAt: fecha_actual
            }, {
                where: {
                    id: notificacion.id
                }
            });
            // commit si todo esta correcto
            await transaccion.commit();
            return res.status(200).json({ code: 200, msg: 'OK', info: 'Notificacion actualizada correctamente', uuid: uid });
        } catch (error) {
            // rollback si hay error
            await transaccion.rollback();
            console.log(error);
            return res.status(500).json({
                code: 500,
                msg: 'ERROR',
                info: 'Error al actualizar la notificacion'
            });
        }
    }

    //metodo para actualizar el estado de una notificacion
    async actualizar_estado_notificacion(req, res) {
        const transaccion = await sequelize.transaction();
        try {
            const { uuid } = req.params;
            const notificacion = await Notificacion.findOne({
                where: {
                    uuid: uuid
                }
            });

            if (!notificacion) {
                return res.status(404).json({
                    code: 404,
                    msg: 'ERROR',
                    info: 'No existe la notificacion'
                });
            }
            const fecha_actual = new Date().toISOString();

            if (notificacion.estado === false) {
                await Notificacion.update({
                    estado: true,
                    updatedAt: fecha_actual
                }, {
                    where: {
                        id: notificacion.id
                    }
                });
                // commit si todo esta correcto
                await transaccion.commit();
                return res.status(200).json({ code: 200, msg: 'OK', info: 'Notificacion activada correctamente' });
            } else {
                await Notificacion.update({
                    estado: false,
                    updatedAt: fecha_actual
                }, {
                    where: {
                        id: notificacion.id
                    }
                });
                // commit si todo esta correcto
                await transaccion.commit();
                return res.status(200).json({ code: 200, msg: 'OK', info: 'Notificacion desactivada correctamente' });
            }
        } catch (error) {
            // rollback si hay error
            await transaccion.rollback();
            console.log(error);
            return res.status(500).json({
                code: 500,
                msg: 'ERROR',
                info: 'Error al desactivar la notificacion'
            });
        }
    }
}
module.exports = new controlador_notificacion();