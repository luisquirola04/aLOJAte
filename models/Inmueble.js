const { DataTypes } = require('sequelize');
const sequelize = require('../config/config_bd');

const Inmueble = sequelize.define('Inmueble', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    nombre:  {
        type: DataTypes.STRING,
        allowNull: false 
    },  
    
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        allowNull: false,
        unique: true,
    },

    imagen:  {
        type: DataTypes.STRING,
        allowNull: false 
    },  

    descripcion:  {
        type: DataTypes.STRING,
        allowNull: false 
    },  

    longitud:  {
        type: DataTypes.DOUBLE,
        allowNull: false 
    },  

    latitud: {
        type: DataTypes.DOUBLE,
        allowNull: false 
    },  

    nro_casa: {
        type: DataTypes.STRING,
        allowNull: false 
    },  

    descripcion_ubicacion: {
        type: DataTypes.STRING,
        allowNull: false 
    },  

    capacidad: {
        type: DataTypes.INTEGER,
        allowNull: false 
    },  
    precio: {
        type: DataTypes.DOUBLE,
        allowNull: false 
    },  

    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false 
    },  
},{
    tableName: 'inmueble',
});

module.exports = Inmueble;
