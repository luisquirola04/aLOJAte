const Inmueble = require('../models/Inmueble');

class Controller_Inmueble {

    async registrarInmueble(req, res) {
        try {
            const { id_catalogo, id_cuenta, nombre, imagen, descripcion, longitud, latitud, nro_casa, descripcion_ubicacion, capacidad, precio, estado } = req.body;
            const inmueble = await Inmueble.create({
                id_catalogo, id_cuenta, nombre, imagen, descripcion, longitud, latitud, nro_casa, descripcion_ubicacion, capacidad, precio, estado
            });
            return res.status(201).json({
                inmueble
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async listarInmuebles(req, res) {
        try {
            const inmuebles = await Inmueble.findAll();
            return res.status(200).json({
                inmuebles
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }
    async listarInmueblesActivos(req, res) {
        try {
            const inmuebles = await Inmueble.findAll({
                where: { estado: true }
            });
            return res.status(200).json({
                inmuebles
            });
        }
        catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async obtenerInmueble(req, res) {
        try {
            const { uuid } = req.params;
            const inmueble = await Inmueble.findOne({
                where: { uuid }
            });
            return res.status(200).json({
                inmueble
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async actualizarInmueble(req, res) {
        try {
            const { uuid } = req.params;
            const { id_catalogo, id_cuenta, nombre, imagen, descripcion, longitud, latitud, nro_casa, descripcion_ubicacion, capacidad, precio, estado } = req.body;
            const inmueble = await Inmueble.update({
                id_catalogo, id_cuenta, nombre, imagen, descripcion, longitud, latitud, nro_casa, descripcion_ubicacion, capacidad, precio, estado
            }, {
                where: { uuid }
            });
            return res.status(200).json({
                inmueble
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async desactivarInmueble(req, res) {
        try {
            const { uuid } = req.params;
            const inmueble = await Inmueble.update({
                estado: false
            }, {
                where: { uuid }
            });
            return res.status(200).json({
                inmueble
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async activarInmueble(req, res) {
        try {
            const { uuid } = req.params;
            const inmueble = await Inmueble.update({
                estado: true
            }, {
                where: { uuid }
            });
            return res.status(200).json({
                inmueble
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }
    
}


module.exports = Controller_Inmueble;