"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utente = void 0;
const sequelize_1 = require("sequelize"); //importo sequelize 
const Singleton_1 = require("./Singleton"); //import singleton 
const Grafo_1 = require("./Grafo"); //import Grafo
const Richieste_1 = require("./Richieste");
const Simulazione_1 = require("./Simulazione");
const sequelize = Singleton_1.Singleton.getConnection();
exports.Utente = sequelize.define('Utente', {
    id_utente: {
        type: sequelize_1.DataTypes.INTEGER(),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: false
    },
    credito: {
        type: sequelize_1.DataTypes.FLOAT(),
        allowNull: false
    },
    privilegi: {
        type: sequelize_1.DataTypes.BOOLEAN(),
        allowNull: false
    },
    create_time: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
}, {
    timestamps: false,
    freezeTableName: true
});
exports.Utente.hasMany(Grafo_1.Grafo, {
    foreignKey: 'id_utente',
    as: 'Grafo',
});
exports.Utente.hasMany(Richieste_1.Richieste, {
    foreignKey: 'id_utente',
    as: 'richieste',
});
exports.Utente.hasMany(Simulazione_1.Simulazione, {
    foreignKey: 'id_utente',
    as: 'simulazione',
});
module.exports = { Utente: exports.Utente };
