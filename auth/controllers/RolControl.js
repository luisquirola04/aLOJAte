'use strict';

const modelsPromise = require('../models'); // Promesa de inicialización de los modelos
const uuid = require('uuid');

class RolControl {
    // Para listar todos los roles
    async listar(req, res) {
        try {
            const models = await modelsPromise;
            const rol = models.rol;

            const lista = await rol.findAll({
                attributes: ['nombre', 'external_id']
            });

            res.status(200).json({ msg: "OK", code: 200, datos: lista });
        } catch (error) {
            console.error("Error en listar roles:", error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }

    // Para guardar un nuevo rol
    async guardar(req, res) {
        try {
            const models = await modelsPromise;
            const rol = models.rol;

            if (req.body.hasOwnProperty('nombre')) {
                const data = {
                    nombre: req.body.nombre,
                    external_id: uuid.v4()
                };

                const result = await rol.create(data);

                if (result) {
                    res.status(200).json({ msg: "OK", code: 200 });
                } else {
                    res.status(400).json({ msg: "ERROR", tag: "No se puede crear el rol", code: 400 });
                }
            } else {
                res.status(400).json({ msg: "ERROR", tag: "Faltan datos", code: 400 });
            }
        } catch (error) {
            console.error("Error en guardar rol:", error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500 });
        }
    }
}

module.exports = RolControl;