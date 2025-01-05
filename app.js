const express = require('express');
const sequelize = require('./config/config_bd');
const cors = require('cors')
const bodyParser = require('body-parser');

const Persona = require('./models//Persona');
const Catalogo = require('./models//Catalogo');
const Cuenta = require('./models//Cuenta');
const Inmueble = require('./models//Inmueble');
const Notificacion = require('./models//Notificacion');
const Reserva = require('./models//Reserva');
const Rol = require('./models//Rol');


const app = express();
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


Persona.hasOne(Cuenta, {
    foreignKey: {
        name: 'id_persona',
        allowNull: false,
        unique: true,
    },
    onDelete: 'CASCADE',
});
Cuenta.belongsTo(Persona, {
    foreignKey: {
        name: 'id_persona',
        allowNull: false,
        unique: true,
    },
    onDelete: 'CASCADE',
});



Rol.hasOne(Cuenta, {
    foreignKey: {
        name: 'id_rol',
        allowNull: false,
    },
    onDelete: 'CASCADE',
});
Cuenta.belongsTo(Rol, {
    foreignKey: {
        name: 'id_rol',
        allowNull: false,
    },
    onDelete: 'CASCADE',
});


Cuenta.hasMany(Inmueble, { foreignKey: 'id_propietario' });

Cuenta.hasMany(Reserva, { foreignKey: 'id_cuenta_reservante' });

Cuenta.hasMany(Notificacion, { foreignKey: "id_cuenta" });

Inmueble.hasMany(Reserva, { foreignKey: 'id_inmueble' });

Catalogo.hasMany(Inmueble, { foreignKey: 'id_catalogo' });


sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada');
    })
    .catch(error => {
        console.error('Error al sincronizar la base de datos:', error);
    });


app.get('/', (req, res) => {
    res.send('¡Servidor Express en funcionamiento!');
});


//RUTAS
const reserva = require('./routes/routes_reserva');
app.use(reserva);
// Ruta Notificaciones 
const api_notificacion = require('./routes/api_notificacion');
app.use(api_notificacion);






//SERVIDOR ESCUCHANDO
app.listen(5000, () => {
    console.log("server is listening on port", 5000);
});

// Manejo de rutas no encontradas 
app.use((req, res, next) => { res.status(404).json({ code: 404, msg: "ERROR", data: 'Ruta no encontrada' }); });