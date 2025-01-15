const express = require('express');
const sequelize = require('./config/config_bd');
const cors = require('cors')
const bodyParser = require('body-parser');
const Notificacion = require('./models/Notificacion');
const middleware = require('./middleware/middleware');

const app = express();
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//metodo para manejar las rutas no encontradas
app.use(middleware.manejar_rutas);
//verificar que el formato json sea correcto
app.use(middleware.validar_json);

//metodo para verificar que la base de datos este conectada y sincronizada
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


// Ruta Notificaciones 
const api_notificacion = require('./routes/api_notificacion');
app.use(api_notificacion);

const port = 5002;
//SERVIDOR ESCUCHANDO
app.listen(port, () => {
    console.log("Servidor escuchando en puerto", port);
});

