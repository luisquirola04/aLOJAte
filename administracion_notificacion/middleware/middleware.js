const { body, validationResult } = require('express-validator');

// metodo para validar los campos de la notificación
const validar_notificacion = [
    // Verificar que solo se envíen los campos permitidos
    body().custom(body => {
        const campos_permitidos = ['titulo', 'descripcion', 'id_cuenta'];
        const campos_recibidos = Object.keys(body);
        const campos_extra = campos_recibidos.filter(campo => !campos_permitidos.includes(campo));
        if (campos_extra.length > 0) {
            throw new Error(`Campos no permitidos: ${campos_extra.join(', ')}`);
        }
        return true;
    }),

    body('titulo')
        .exists().withMessage('El título es requerido')
        .isString().withMessage('El título debe ser una cadena de texto')
        .trim().notEmpty().withMessage('El título no debe estar vacío'),

    body('descripcion')
        .exists().withMessage('La descripción es requerida')
        .isString().withMessage('La descripción debe ser una cadena de texto')
        .trim().notEmpty().withMessage('La descripción no debe estar vacía'),

    body('id_cuenta')
        .exists().withMessage('El ID de la cuenta es requerido')
        .isInt({ gt: 0 }).withMessage('El ID de la cuenta debe ser un número mayor a 0'),

    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ code: 400, msg: "ERROR", info: errores.array()[0].msg });
        }
        next();
    }
];

//validar los campos de la notificación al actualizar
const validar_actualizar_notificacion = [
    // Verificar que solo se envíen los campos permitidos
    body().custom(body => {
        const campos_permitidos = ['titulo', 'descripcion'];
        const campos_recibidos = Object.keys(body);
        const campos_extra = campos_recibidos.filter(campo => !campos_permitidos.includes(campo));
        if (campos_extra.length > 0) {
            throw new Error(`Campos no permitidos: ${campos_extra.join(', ')}`);
        }
        return true;
    }),

    body('titulo')
        .optional()
        .isString().withMessage('El título debe ser una cadena de texto')
        .trim().notEmpty().withMessage('El título no debe estar vacío'),

    body('descripcion')
        .optional()
        .isString().withMessage('La descripción debe ser una cadena de texto')
        .trim().notEmpty().withMessage('La descripción no debe estar vacía'),

    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ code: 400, msg: "ERROR", info: errores.array()[0].msg });
        }
        next();
    }
];

// metodo para manejar rutas no encontradas
const manejar_rutas = (req, res) => {
    res.status(404).json({ code: 404, msg: "ERROR", data: 'Ruta no encontrada' });
}


//metodo para validar que el formato json sea correcto
const validar_json = (req, res, next) => {
    if (req.is('json')) {
        next();
    } else {
        res.status(400).json({ code: 400, msg: "ERROR", info: 'Formato de json incorrecto' });
    }
}
module.exports = { validar_notificacion, validar_actualizar_notificacion, manejar_rutas, validar_json };