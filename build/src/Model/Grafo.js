"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grafo = void 0;
const sequelize_1 = require("sequelize"); //importo sequelize 
const Singleton_1 = require("../Model/Singleton"); //import singleton 
const sequelize = Singleton_1.Singleton.getConnection();
exports.Grafo = sequelize.define('Grafo', {
    id_grafo: {
        type: sequelize_1.DataTypes.INTEGER(),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_utente: {
        type: sequelize_1.DataTypes.INTEGER(),
        //autoIncrement: true,
        allowNull: false,
        references: {
            model: 'Utente',
            key: 'id_utente'
        }
    },
    nome_grafo: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: false
    },
    costo: {
        type: sequelize_1.DataTypes.FLOAT(),
        allowNull: false
    },
}, {
    timestamps: false,
    freezeTableName: true
});
/*
Grafo.belongsTo(Utente, {
    foreignKey: 'id_grafo',
    as: 'Utente',
} ),

Grafo.hasMany(Nodi, {
     foreignKey: 'id_grafo'
});


Grafo.hasMany(Archi, {
    foreignKey: 'id_grafo'
})

Grafo.hasMany(Richieste, {
    foreignKey: 'id_grafo'
})

Grafo.hasMany(Simulazione, {
    foreignKey: 'id_grafo'
})
*/
module.exports = { Grafo: exports.Grafo };
