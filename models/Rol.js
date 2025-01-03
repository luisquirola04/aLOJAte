const { DataTypes } = require('sequelize');
const sequelize = require('../config/config_bd');

const Rol = sequelize.define('Rol', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {type:DataTypes.STRING, 
        allowNull:false, 
        unique:true },
    descipcion: {
        type: DataTypes.STRING,
        allowNull: false 
    },

},{
    tableName: 'rol',
});

module.exports = Rol;
