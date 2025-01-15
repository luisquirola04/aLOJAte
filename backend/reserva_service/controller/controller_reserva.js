const Reserva = require('../models/Reserva');

class Controller_Reserva {

    async registrar_reserva(req, res) {
        try {
            const { id_cuenta_reservante, id_inmueble, fecha_reserva} = req.body;
            const reserva = await Reserva.create({
                id_cuenta_reservante, id_inmueble, fecha_reserva
            });
            return res.status(200).json({
                reserva
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async listar_reservas_inmueble(req, res) {
        try {
            const reservas = await reservas.findAll({
                where: {
                    id_inmueble: req.params.id_inmueble
                }
            });
            return res.status(200).json({
                reservas
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }


    async listar_reservas_arrendatario(req, res) {
        try {
            const reservas = await reservas.findAll({
                where: {
                    id_inmueble: req.params.id_cuenta_reservante
                }
            });
            return res.status(200).json({
                reservas
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }


    async actualizar_reserva(req, res) {
        try {
            const { uuid } = req.params;
            const { id_cuenta_reservante, id_inmueble, fecha_reserva} = req.body;
            const reserva = await Inmueble.update({
                id_cuenta_reservante, id_inmueble, fecha_reserva
            }, {
                where: { uuid }
            });
            return res.status(200).json({
                reserva
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async desactivar_visibilidad_reserva(req, res) {
        try {
            const { uuid } = req.params;
            const reserva = await reserva.update({
                estado_visible: false,
            }, {
                where: { uuid }
            });
            return res.status(200).json({
                reserva
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async aceptar_reserva(req, res) {
        try {
            const { uuid } = req.params;
            const reserva = await Reserva.update({
                estado: true
            }, {
                where: { uuid }
            });
            return res.status(200).json({
                reserva
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }
    
}


module.exports = Controller_Reserva;