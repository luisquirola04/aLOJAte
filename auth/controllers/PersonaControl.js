'use strict';

const modelsPromise = require('../models'); // Importa la promesa de inicialización de los modelos
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const saltRounds = 8;

class PersonaControl {
  // Listar personas
  async listarP(req, res) {
    try {
      const models = await modelsPromise; // Asegura que los modelos estén inicializados
      const persona = models.persona;
      const lista = await persona.findAll({
        include: [
          { model: models.cuenta, as: "cuenta", attributes: ['correo', 'estado'] },
          { model: models.rol, as: "rol", attributes: ['nombre', 'external_id'] },
        ],
        attributes: ['apellidos', 'external_id', 'nombres', 'telefono', 'cedula'],
      });
      res.status(200).json({ msg: "OK", code: 200, datos: lista });
    } catch (error) {
      console.error("Error en listarP:", error);
      res.status(500).json({ msg: "Error interno del servidor", code: 500 });
    }
  }

  // Obtener persona por external_id
  async obtenerP(req, res) {
    try {
      const models = await modelsPromise;
      const persona = models.persona;
      const external = req.params.external;

      const lista = await persona.findOne({
        where: { external_id: external },
        include: [
          { model: models.cuenta, as: "cuenta", attributes: ['correo', 'estado'] },
          { model: models.rol, as: "rol", attributes: ['nombre', 'external_id'] },
        ],
        attributes: ['apellidos', 'external_id', 'nombres', 'telefono', 'cedula'],
      });

      if (!lista) {
        res.status(200).json({ tag: "OK", code: 200, datos: {} });
      } else {
        res.status(200).json({ tag: "OK", code: 200, datos: lista });
      }
    } catch (error) {
      console.error("Error en obtenerP:", error);
      res.status(500).json({ msg: "Error interno del servidor", code: 500 });
    }
  }

  // Guardar persona
  async guardarP(req, res) {
    try {
      const models = await modelsPromise;
      const persona = models.persona;
      const rol = models.rol;
      const cuenta = models.cuenta;

      if (
        req.body.hasOwnProperty('nombres') &&
        req.body.hasOwnProperty('apellidos') &&
        req.body.hasOwnProperty('telefono') &&
        req.body.hasOwnProperty('cedula') &&
        req.body.hasOwnProperty('correo') &&
        req.body.hasOwnProperty('clave') &&
        req.body.hasOwnProperty('rol')
      ) {
        const rolAux = await rol.findOne({ where: { external_id: req.body.rol } });

        if (rolAux) {
          const cedulaRegex = /^[0-9]{10}$/;

          if (!cedulaRegex.test(req.body.cedula)) {
            res.status(400).json({ msg: "ERROR", tag: "Formato de cédula inválido", code: 400 });
            return;
          }

          const claveHash = (clave) => bcrypt.hashSync(clave, bcrypt.genSaltSync(saltRounds), null);

          const data = {
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            telefono: req.body.telefono,
            cedula: req.body.cedula,
            id_rol: rolAux.id,
            external_id: uuid.v4(),
            cuenta: {
              correo: req.body.correo,
              clave: claveHash(req.body.clave),
            },
          };

          const transaction = await models.sequelize.transaction();

          try {
            const result = await persona.create(data, {
              include: [{ model: cuenta, as: "cuenta" }],
              transaction,
            });

            await transaction.commit();

            if (!result) {
              res.status(401).json({ msg: "ERROR", tag: "No se puede crear", code: 401 });
            } else {
              rolAux.external_id = uuid.v4();
              await rolAux.save();
              res.status(200).json({ tag: "OK", code: 200 });
            }
          } catch (error) {
            await transaction.rollback();
            res.status(500).json({ msg: "Error interno del servidor", tag: "Error en transacción", error });
          }
        } else {
          res.status(400).json({ msg: "ERROR", tag: "El dato no existe", code: 400 });
        }
      } else {
        res.status(400).json({ msg: "ERROR", tag: "Aun faltan datos", code: 400 });
      }
    } catch (error) {
      console.error("Error en guardarP:", error);
      res.status(500).json({ msg: "Error interno del servidor", code: 500 });
    }
  }

  async obtenerCedula(req, res) {
    try {
      const models = await modelsPromise;
      const persona = models.persona;
      const cuenta = models.cuenta;
      const rol = models.rol;

      const parametro = req.params.valorBusqueda;

      const lista = await persona.findAll({
        where: { cedula: parametro },
        include: [
          { model: cuenta, as: "cuenta", attributes: ['correo', 'estado'] },
          { model: rol, as: "rol", attributes: ['nombre', 'external_id'] },
        ],
        attributes: ['apellidos', 'external_id', 'nombres', 'telefono', 'cedula'],
      });

      res.status(200).json({ tag: "OK", code: 200, datos: lista });
    } catch (error) {
      console.error("Error en obtenerCedula:", error);
      res.status(500).json({ msg: "Error interno del servidor", code: 500 });
    }
  }

  /* Búsqueda y listado de personas por nombre */
  async obtenerNombre(req, res) {
    try {
      const models = await modelsPromise;
      const persona = models.persona;
      const cuenta = models.cuenta;
      const rol = models.rol;

      const parametro = req.params.valorBusqueda;

      const lista = await persona.findAll({
        where: { nombres: parametro },
        include: [
          { model: cuenta, as: "cuenta", attributes: ['correo', 'estado'] },
          { model: rol, as: "rol", attributes: ['nombre', 'external_id'] },
        ],
        attributes: ['apellidos', 'external_id', 'nombres', 'telefono', 'cedula'],
      });

      res.status(200).json({ tag: "OK", code: 200, datos: lista });
    } catch (error) {
      console.error("Error en obtenerNombre:", error);
      res.status(500).json({ msg: "Error interno del servidor", code: 500 });
    }
  }

  /* Modificar los datos de una persona */
  async modificarP(req, res) {
    try {
      const models = await modelsPromise;
      const persona = models.persona;
      const cuenta = models.cuenta;
      const rol = models.rol;

      const perAux = await persona.findOne({
        where: { external_id: req.params.external },
        include: [
          { model: cuenta, as: "cuenta", attributes: ['external_id'] },
        ],
      });

      if (!perAux) {
        res.status(400).json({ msg: "Error", tag: "El dato a modificar no existe", code: 400 });
        return;
      }

      if (
        req.body.hasOwnProperty('nombres') &&
        req.body.hasOwnProperty('apellidos') &&
        req.body.hasOwnProperty('telefono') &&
        req.body.hasOwnProperty('cedula')
      ) {
        const claveHash = (clave) => bcrypt.hashSync(clave, bcrypt.genSaltSync(saltRounds), null);

        const rolAux = await rol.findOne({ where: { external_id: req.body.rol } });
        if (!rolAux) {
          res.status(400).json({ msg: "Error", tag: "Rol no encontrado", code: 400 });
          return;
        }

        perAux.id_rol = rolAux.id;
        perAux.nombres = req.body.nombres;
        perAux.apellidos = req.body.apellidos;
        perAux.telefono = req.body.telefono;
        perAux.cedula = req.body.cedula;

        if (req.body.clave && req.body.clave !== '') {
          const cuentaAux = await cuenta.findOne({ where: { external_id: perAux.cuenta.external_id } });
          cuentaAux.clave = claveHash(req.body.clave);
          await cuentaAux.save();
        }

        if (req.body.correo && req.body.correo !== '') {
          const cuentaAux = await cuenta.findOne({ where: { external_id: perAux.cuenta.external_id } });
          cuentaAux.correo = req.body.correo;
          await cuentaAux.save();
        }

        const result = await perAux.save();

        if (!result) {
          res.status(400).json({ msg: "Error", tag: "No se han modificado los datos", code: 400 });
        } else {
          res.status(200).json({ msg: "Success", tag: "Datos modificados correctamente", code: 200 });
        }
      } else {
        res.status(400).json({ msg: "Error", tag: "Faltan datos", code: 400 });
      }
    } catch (error) {
      console.error("Error en modificarP:", error);
      res.status(500).json({ msg: "Error interno del servidor", code: 500 });
    }
  }

  /* Dar de baja o activar los datos de una cuenta */
  async cambiarEstado(req, res) {
    try {
      const models = await modelsPromise;
      const persona = models.persona;
      const cuenta = models.cuenta;

      const perAux = await persona.findOne({
        where: { external_id: req.params.external },
        include: [
          { model: cuenta, as: "cuenta", attributes: ['external_id', 'estado'] },
        ],
      });

      if (!perAux) {
        res.status(400).json({ msg: "Error", tag: "El dato a modificar no existe", code: 400 });
        return;
      }

      const cuentaAux = await cuenta.findOne({ where: { external_id: perAux.cuenta.external_id } });
      if (!cuentaAux) {
        res.status(400).json({ msg: "Error", tag: "Cuenta no encontrada", code: 400 });
        return;
      }

      cuentaAux.estado = req.body.estado === "true";
      cuentaAux.external_id = uuid.v4();
      perAux.external_id = uuid.v4();

      const resultCuenta = await cuentaAux.save();
      const resultPersona = await perAux.save();

      if (!resultCuenta || !resultPersona) {
        res.status(400).json({ msg: "Error", tag: "No se pudo cambiar el estado de la cuenta", code: 400 });
      } else {
        const msg = cuentaAux.estado
          ? "Cuenta activada correctamente"
          : "Cuenta dada de baja correctamente";
        res.status(200).json({ msg: "Success", tag: msg, code: 200 });
      }
    } catch (error) {
      console.error("Error en cambiarEstado:", error);
      res.status(500).json({ msg: "Error interno del servidor", code: 500 });
    }
  }
}

module.exports = PersonaControl;


    