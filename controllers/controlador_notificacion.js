const Cuenta = require('../models/Cuenta');
const Notificacion = require('../models/Notificacion');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/config_bd');

class controlador_notificacion {
    // metodo para ver las notificaciones de un cuenta en especifico
    async listar_notificaciones(req, res) {
        try {
            const { id } = req.params;

            const cuenta = await Cuenta.findOne({
                where: {
                    id: id
                }
            });

            if (!cuenta) {
                return res.status(404).json({
                    code: 404,
                    msg: 'ERROR',
                    info: 'No existe la cuenta'
                });
            }

            const notificaciones = await Notificacion.findAll({
                where: {
                    id_cuenta: id,
                    estado: true
                }
            });
            console.log(notificaciones);

            res.status(200).json({ code: 200, msg: 'OK', data: notificaciones });
        } catch (error) {
            console.log(error);
            res.status(500).json({
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
            const { titulo, descripcion, id_cuenta } = req.body;
            const cuenta = await Cuenta.findOne({
                where: {
                    id: id_cuenta
                }
            });
            console.log(cuenta);
            if (!cuenta) {
                return res.status(404).json({
                    code: 404,
                    msg: 'ERROR',
                    info: 'No existe el cuenta'
                });
            }
            const fecha_actual = new Date();
            console.log(fecha_actual);
            await Notificacion.create({
                uuid: uuidv4(),
                titulo: titulo,
                descripcion: descripcion,
                fecha: fecha_actual,
                id_cuenta: id_cuenta,
                estado: true,
                createdAt: fecha_actual,
                updatedAt: fecha_actual
            });

            // commit si todo esta correcto
            await transaccion.commit();

            res.status(201).json({ code: 201, msg: 'OK', info: 'Notificacion creada correctamente' });
        } catch (error) {
            // rollback si hay error
            await transaccion.rollback();
            console.log(error);
            res.status(500).json({
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
            const { id } = req.params;
            const { titulo, descripcion } = req.body;
            const notificacion = await Notificacion.findOne({
                where: {
                    id: id,
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
            const fecha_actual = new Date();

            await Notificacion.update({
                uuid: uuidv4(),
                titulo: titulo,
                descripcion: descripcion,
                updatedAt: fecha_actual
            }, {
                where: {
                    id: id
                }
            });
            // commit si todo esta correcto
            await transaccion.commit();
            res.status(200).json({ code: 200, msg: 'OK', info: 'Notificacion actualizada correctamente' });
        } catch (error) {
            // rollback si hay error
            await transaccion.rollback();
            console.log(error);
            res.status(500).json({
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
            const { id } = req.params;
            const notificacion = await Notificacion.findOne({
                where: {
                    id: id
                }
            });
            if (!notificacion) {
                return res.status(404).json({
                    code: 404,
                    msg: 'ERROR',
                    info: 'No existe la notificacion'
                });
            }
            const fecha_actual = new Date();
            if (notificacion.estado === false) {
                await Notificacion.update({
                    estado: true,
                    updatedAt: fecha_actual
                }, {
                    where: {
                        id: id
                    }
                });
                // commit si todo esta correcto
                await transaccion.commit();
                res.status(200).json({ code: 200, msg: 'OK', info: 'Notificacion activada correctamente' });
            } else {
                await Notificacion.update({
                    estado: false,
                    updatedAt: fecha_actual
                }, {
                    where: {
                        id: id
                    }
                });
                // commit si todo esta correcto
                await transaccion.commit();
                res.status(200).json({ code: 200, msg: 'OK', info: 'Notificacion desactivada correctamente' });
            }
        } catch (error) {
            // rollback si hay error
            await transaccion.rollback();
            console.log(error);
            res.status(500).json({
                code: 500,
                msg: 'ERROR',
                info: 'Error al desactivar la notificacion'
            });
        }
    }
}
module.exports = new controlador_notificacion;