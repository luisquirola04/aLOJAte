const express = require('express');
const router = express.Router();
const Controller_Reserva = require('../controller/controller_reserva');
const controller = new Controller_Reserva();




router.get("/realizar/:nro",(req,res)=>{
    let respuesta = controller.metodo(req.params.nro);
    res.send(respuesta);
});

router.post("/realizar/reserva",(req,res)=>{
    const {nro} = req.body;
    let respuesta = controller.metodo_example(nro);

    res.json({response: respuesta , 
        code: 200,
    });
});


module.exports = router;