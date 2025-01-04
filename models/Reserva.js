const { DataTypes } = require('sequelize');
const sequelize = require('../config/config_bd');

const Reserva = sequelize.define('Reserva', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
        allowNull: false 
    },
    
}, {
    tableName: 'reserva',
});

module.exports = Reserva;
