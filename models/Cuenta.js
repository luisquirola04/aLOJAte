const { DataTypes } = require('sequelize');
const sequelize = require('../config/config_bd');

const Cuenta = sequelize.define('Cuenta', {
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
    
    correo:{ type:DataTypes.STRING, 
        allowNull:false, 
        unique:true},

    clave: {type:DataTypes.STRING, 
         validate: {
        len: [8, 255] 
    }},

    estado:  {
        type: DataTypes.BOOLEAN,
        allowNull: false 
    },  

},{
    tableName: 'cuenta',
});

module.exports = Cuenta;
