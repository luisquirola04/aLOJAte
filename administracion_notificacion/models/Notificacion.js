const { DataTypes } = require('sequelize');
const sequelize = require('../config/config_bd');
const e = require('express');

const Notificacion = sequelize.define('Notificacion', {
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
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_cuenta: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'notificacion',
    timestamps: true,  
});

module.exports = Notificacion;
