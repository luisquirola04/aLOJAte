const Catalogo = require('../models/Catalogo');

class Controller_Catalogo {
    async registrarCatalogo(req, res) {
        try {
            const { nombre, descripcion } = req.body;
            const catalogo = await Catalogo.create({
                nombre, descripcion
            });
            return res.status(201).json({
                catalogo
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async listarCatalogos(req, res) {
        try {
            const catalogos = await Catalogo.findAll();
            return res.status(200).json({
                catalogos
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async obtenerCatalogo(req, res) {
        try {
            const { uuid } = req.params;
            const catalogo = await Catalogo.findOne({
                where: { uuid }
            });
            return res.status(200).json({
                catalogo
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async actualizarCatalogo(req, res) {
        try {
            const { uuid } = req.params;
            const { nombre, descripcion } = req.body;
            const catalogo = await Catalogo.update({
                nombre, descripcion
            }, {
                where: { uuid }
            });
            return res.status(200).json({
                catalogo
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    async eliminarCatalogo(req, res) {
        try {
            const { uuid } = req.params;
            await Catalogo.destroy({
                where: { uuid }
            });
            return res.status(200).json({
                message: 'Catalogo eliminado'
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    }

    
}

module.exports = Controller_Catalogo;