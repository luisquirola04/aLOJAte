

const { DataTypes } = require('sequelize');
const sequelize = require('../config/config_bd');

const Reserva = sequelize.define('Reserva', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_reservante: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },

    id_inmueble: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        allowNull: false,
        unique: true,
    },

    

    fecha_reserva: {
        type: DataTypes.DATE,
        allowNull: false 
    },

    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    estado_visible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    tableName: 'reserva',
});

module.exports = Reserva;
