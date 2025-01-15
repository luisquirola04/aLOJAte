"use strict";

const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const basename = path.basename(__filename);
const db = {};

// Variables de entorno para la base de datos
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_NAME = process.env.DB_NAME || "authdb";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "admin12345";
const DB_DIALECT = process.env.DB_DIALECT || "mysql";

// Inicializar Sequelize sin especificar la base de datos
const sequelize = new Sequelize('', DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: DB_DIALECT,
});

// Verificar si la base de datos existe
async function checkAndCreateDatabase() {
  try {
    const [databases] = await sequelize.query("SHOW DATABASES LIKE ?", {
      replacements: [DB_NAME],
    });
    
    if (databases.length === 0) {
      // La base de datos no existe, crearla
      await sequelize.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`Database '${DB_NAME}' created successfully.`);
    }
  } catch (error) {
    console.error("Error checking or creating the database:", error);
  }
}

async function initializeDatabase() {
  // Llamar a la función para verificar y crear la base de datos
  await checkAndCreateDatabase();

  // Ahora podemos conectar con la base de datos 'authdb'
  const sequelizeWithDB = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: DB_DIALECT,
  });

  // Cargar modelos dinámicamente
  fs.readdirSync(__dirname)
    .filter((file) => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js")
    .forEach((file) => {
      const model = require(path.join(__dirname, file))(sequelizeWithDB, DataTypes);
      db[model.name] = model;
    });

  // Configurar asociaciones de modelos si las hay
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  // Exportar sequelize con los modelos
  db.sequelize = sequelizeWithDB;
  db.Sequelize = Sequelize;

  // Return the initialized `db`
  return db;
}

module.exports = initializeDatabase();