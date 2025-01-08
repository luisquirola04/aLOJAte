'use strict'

module.exports = (sequelize, DataTypes) => {

    const persona = sequelize.define('persona', {
        nombres: { type: DataTypes.STRING(150), defaultValue: "NONE" },
        apellidos: { type: DataTypes.STRING(150), defaultValue: "NONE" },
        telefono: { type: DataTypes.STRING, defaultValue: "NONE" },
        cedula: { type: DataTypes.STRING(20), defaultValue: "NONE", unique: true },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }

    }, { freezeTableName: true });
    persona.associate = function (models) {
        persona.hasOne(models.cuenta, { foreignKey: 'id_persona', as: 'cuenta' });
        persona.belongsTo(models.rol, { foreignKey: 'id_rol' });
    }
    return persona;
}
