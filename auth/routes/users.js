var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');
const multer = require('multer');
const { body } = require('express-validator');

const rolC = require('../controllers/RolControl');
let rolControl = new rolC();
const personaC = require('../controllers/PersonaControl');
let personaControl = new personaC();
const cuentaC = require("../controllers/CuentaControl");
let cuentaControl = new cuentaC();

// Inicialización de la promesa de modelos
const modelsPromise = require('../models');

// Middleware para autenticación 
var auth = function middleware(req, res, next) {
  const token = req.headers["token-api"];
  if (token) {
    require("dotenv").config();
    const llave = process.env.KEY_PRI;
    jwt.verify(token, llave, async (err, decoded) => {
      if (err) {
        res.status(401);
        res.json({ tag: "token expirado o no valido", code: 401 });
      } else {
        try {
          // Esperamos que la promesa de modelos se resuelva antes de continuar
          const models = await modelsPromise;
          req.decoded = decoded;

          // Ahora utilizamos los modelos de forma asíncrona
          let aux = await models.cuenta.findOne({
            where: { external_id: req.decoded.external },
          });

          if (!aux) {
            res.status(401);
            res.json({ tag: "token no valido", code: 401 });
          } else {
            next();
          }
        } catch (error) {
          console.error("Error en la autenticación:", error);
          res.status(500).json({ tag: "Error interno", code: 500 });
        }
      }
    });
  } else {
    res.status(401);
    res.json({ tag: "No existe token", code: 401 });
  }
};

// Middleware ------- filtro para peticiones // autorización
var auth2 = function checkRole(rol) {
  return function (req, res, next) {
    const user = req.headers['rol-user'];
    if (rol.includes(user)) {
      next();
    } else {
      res.status(403);
      res.json({ msg: "Error", tag: 'Acceso no autorizado', code: 403 });
    }
  };
};
//login
router.post("/admin/login", cuentaControl.inicio_sesion);

//api de rol
router.get('/admin/rol', auth, rolControl.listar);
router.post('/admin/rol/guardar', rolControl.guardar);

//api de personas
router.get('/admin/usuario', auth, auth2(["Administrador"]), personaControl.listarP);
router.post('/admin/usuario/guardar', auth, auth2(["Administrador"]), personaControl.guardarP);
router.post('/admin/usuario/modificar/:external', auth, auth2(["Administrador", "Usuario"]), personaControl.modificarP);
router.get('/admin/usuario/buscar/:external', auth, auth2(["Administrador", "Usuario"]), personaControl.obtenerP);
router.get('/admin/usuario/buscar/cedula/:valorBusqueda', auth, auth2(["Administrador"]), personaControl.obtenerCedula);
router.get('/admin/usuario/buscar/nombre/:valorBusqueda', auth, auth2(["Administrador"]), personaControl.obtenerNombre);
router.post('/admin/usuario/estado/:external', auth, auth2(["Administrador", "Usuario"]), personaControl.cambiarEstado);

module.exports = router;
