"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nodi = void 0;
const sequelize_1 = require("sequelize"); //importo sequelize 
const Singleton_1 = require("./Singleton"); //import singleton 
const Grafo_1 = require("../Model/Grafo"); //import Grafo
const sequelize = Singleton_1.Singleton.getConnection();
exports.Nodi = sequelize.define('Nodi', {
    id_nodi: {
        type: sequelize_1.DataTypes.INTEGER(),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_grafo: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: false,
        references: {
            model: Grafo_1.Grafo,
            key: 'id_grafo'
        }
    },
    nodo_nome: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: false
    },
}, {
    timestamps: false,
    freezeTableName: true
});
// Relazione Nodi-Grafo
/*

Nodi.belongsTo(Grafo, {
    foreignKey: 'id_grafo',
    targetKey: 'id_grafo'
})

Nodi.hasMany(Archi, {
    foreignKey: 'id_nodi'
})
*/
module.exports = { Nodi: exports.Nodi };
