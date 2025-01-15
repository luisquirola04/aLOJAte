const express = require('express');
const sequelize = require('./config/config_bd');
const cors = require('cors')
const bodyParser = require('body-parser');

const Reserva = require('./models//Reserva');


const app = express();
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


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





const port = 5003;
//SERVIDOR ESCUCHANDO
app.listen(port, () => {
    console.log("server is listening on port", port);
});

// Manejo de rutas no encontradas 
app.use((req, res, next) => { res.status(404).json({ code: 404, msg: "ERROR", data: 'Ruta no encontrada' }); });