var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');
const multer = require('multer');
const { body } = require('express-validator');


const rolC = require('../app/controls/RolControl');
let rolControl = new rolC();
const personaC = require('../app/controls/PersonaControl');
let personaControl = new personaC();
const cuentaC = require("../app/controls/CuentaControl");
let cuentaControl = new cuentaC();


//Middleware para autenticacion 
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
        var models = require("../app/models");
        req.decoded = decoded;
        let aux = await models.cuenta.findOne({
          where: { external_id: req.decoded.external },
        });
        if (!aux) {
          res.status(401);
          res.json({ tag: "token no valido", code: 401 });
        } else {
          next();
        }
      }
    });
  } else {
    res.status(401);
    res.json({ tag: "No existe token", code: 401 });
  }
};

// Middleware ------- filtro para peticiones// autorizacion
var auth2 = function checkRole(rol) {
  return function (req, res, next) {
    const user = req.headers['rol-user'];
    if (rol.includes(user)) {
      next();
    } else {
      res.status(403)
      res.json({ msg: "Error", tag: 'Acceso no autorizado', code: 403 });
    }
  };
};

//Filtro para extenciones de imagenes sensores
const fileFilter = (req, file, cb) => {
  const extensiones = ['jpg', 'png', "jpeg"]

  // Verifica la extensión del archivo
  const isValidExtension = extensiones.includes(file.originalname.split('.').pop());

  if (isValidExtension) {
    cb(null, true);
  } else {
    cb(new Error('Archivo no permitido'));
  }
};

//guardar imagenes
const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/multimedia');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: Storage,
  fileFilter: fileFilter,
});

//login
router.post("/admin/login", cuentaControl.inicio_sesion);

//api sensores
router.get('/admin/sensores', auth, auth2(["Administrador"]), sensoresControl.listar);
router.post('/admin/sensores/guardar', auth, auth2(["Administrador"]), upload.fields([{ name: 'img', maxCount: 1 }]), sensoresControl.guardar);
router.post('/admin/sensores/modificar/:external', auth, auth2(["Administrador"]), upload.fields([{ name: 'img', maxCount: 1 }]), sensoresControl.modificar);
router.get('/admin/sensores/buscar/tipo/:valorBusqueda', auth, auth2(["Administrador"]), sensoresControl.obtenerTipo);
router.get('/admin/sensores/buscar/nombre/:valorBusqueda', auth, auth2(["Administrador"]), sensoresControl.obtenerNombre);
router.get('/admin/sensores/obtener/:external', auth, auth2(["Administrador"]), sensoresControl.obtener);
router.post('/admin/sensores/estado/:external', auth, auth2(["Administrador"]), sensoresControl.cambiarEstado);

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

//api datos sensores
router.get('/sensores', auth, auth2(["Administrador", "Usuario"]), datoControl.listar);
router.get('/sensores/buscar/tipo/:valorBusqueda', auth, auth2(["Administrador", "Usuario"]), datoControl.listarTipo);
router.get('/sensores/buscar/fecha/:valorBusqueda', auth, auth2(["Administrador", "Usuario"]), datoControl.listarFecha);
router.get('/sensores/buscar/nombre/:valorBusqueda', auth, auth2(["Administrador", "Usuario"]), datoControl.listarNombre);

//api configuracion datos esp32 maestro
router.get('/admin/config', auth, auth2(["Administrador"]), Esp32Maestro.listar);

router.post('/admin/config/guardar', auth, auth2(["Administrador"]), Esp32Maestro.guardar);

//api pronosticos
router.get('/pronosticos/obtener', auth, auth2(["Administrador", "Usuario"]), pronosticoControl.obtenerPronostico);
router.get('/pronosticos/obtenerH', auth, auth2(["Administrador", "Usuario"]), pronosticoControl.obtenerPronosticoH);

//api catalogo
router.post('/admin/catalogo/guardar', auth, auth2(["Administrador"]), catalogoControl.guardar);
router.get('/admin/catalogo', auth, auth2(["Administrador", "Usuario"]), catalogoControl.listar);

//api movil sensor
router.get('/sensores/temperatura', datoControl.obtenerTemperatura);
router.get('/pronosticos/lista', pronosticoControl.obtenerPronosticoMovil);

module.exports = router;
