const { DataTypes } = require('sequelize');
const sequelize = require('../config/config_bd');

const Catalogo = sequelize.define('Catalogo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre:  {
        type: DataTypes.STRING,
        allowNull: false 
    },  
    descripcion:  {
        type: DataTypes.STRING,
        allowNull: false 
    },  
},{
    tableName: 'catalogo',
});

module.exports = Catalogo;
