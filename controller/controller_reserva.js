const Reserva = require('../models/Reserva');

class Controller_Reserva {

    async save_reserva(req) {
        try {
            const { id_cuenta_reservante, id_inmueble, fecha_reserva, estado } = req.body;

            const nueva_Reserva = await Reserva.create({
                id_cuenta_reservante,
                id_inmueble,
                fecha_reserva,
                estado,
            });

            return nueva_Reserva.id;
        } catch (error) {
            console.error('Error al guardar la reserva:', error.message);
            return `Error al guardar: ${error.message}`;
        }
    }
}

module.exports = Controller_Reserva;
