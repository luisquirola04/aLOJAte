const { DataTypes } = require('sequelize');
const sequelize = require('../config/config_bd');

const Persona = sequelize.define('Persona', {
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

    
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numero_telefonico: {
        type: DataTypes.STRING,
        allowNull: false
    },
    correo_contacto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dni: { type: DataTypes.STRING, 
        allowNull: false, 
        unique: true },
}, {
    tableName: 'persona',
});

module.exports = Persona;
