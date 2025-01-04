const express = require('express');
const router = express.Router();
const Controller_Reserva = require('../controller/controller_reserva');
const controller = new Controller_Reserva();




router.post("/realizar/reserva", async(req, res) => {
    const respuesta = await controller.save_reserva(req);

    if (typeof respuesta == 'number') {
        return res.status(200).json({ message: "Reserva realizada con exito" , code: 200});
    }
    else {
        return res.status(400).json({ message: "Error al realizar la reserva", code: 400});
    }
});


module.exports = router;