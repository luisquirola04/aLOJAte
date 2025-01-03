const { DataTypes } = require('sequelize');
const sequelize = require('../config/config_bd');

const Notificacion = sequelize.define('Notificacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false 
    },

    fecha: {
        type: DataTypes.DATE,
        allowNull: false 
    },

},{
    tableName: 'notificacion',
});

module.exports = Notificacion;
