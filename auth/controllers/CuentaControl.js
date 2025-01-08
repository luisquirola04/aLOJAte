'use strict';

const modelsPromise = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class CuentaControl {
  async inicio_sesion(req, res) {
    try {
      // Verificar que existan los datos necesarios en el cuerpo de la solicitud
      if (req.body.hasOwnProperty('correo') && req.body.hasOwnProperty('clave')) {
        // Esperar a que los modelos estén inicializados
        const models = await modelsPromise;

        // Buscar la cuenta en la base de datos
        let cuentaA = await models.cuenta.findOne({
          where: { correo: req.body.correo },
          include: [
            {
              model: models.persona,
              as: 'persona',
              attributes: ['apellidos', 'nombres', 'id_rol', 'external_id'],
            },
          ],
        });

        if (!cuentaA) {
          return res.status(400).json({ msg: 'Error', tag: 'Cuenta no existe', code: 400 });
        }

        // Validar la clave
        const isClaveValida = (clave, claveUser) => bcrypt.compareSync(claveUser, clave);

        if (cuentaA.estado) {
          if (isClaveValida(cuentaA.clave, req.body.clave)) {
            // Buscar el rol asociado
            const rolA = await models.rol.findOne({
              where: { id: cuentaA.persona.id_rol },
              attributes: ['nombre'],
            });

            // Crear el token JWT
            const tokenData = {
              rol: rolA.nombre,
              external: cuentaA.external_id,
              check: true,
            };
            const key = process.env.KEY_PRI;
            const token = jwt.sign(tokenData, key, { expiresIn: '2h' });

            // Responder con los datos del usuario autenticado
            const info = {
              token: token,
              user: `${cuentaA.persona.apellidos} ${cuentaA.persona.nombres}`,
              rol: rolA.nombre,
              exter: cuentaA.persona.external_id,
            };
            return res.status(200).json({ msg: 'OK', tag: 'BIENVENIDO', data: info, code: 200 });
          } else {
            return res.status(400).json({ msg: 'Error', tag: 'Datos incorrectos', code: 400 });
          }
        } else {
          return res.status(400).json({ msg: 'Error', tag: 'Cuenta desactivada', code: 400 });
        }
      } else {
        return res.status(400).json({ msg: 'Error', tag: 'Faltan datos', code: 400 });
      }
    } catch (error) {
      console.error('Error en inicio_sesion:', error);
      return res.status(500).json({ msg: 'Error interno del servidor', code: 500 });
    }
  }
}

module.exports = CuentaControl;