"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archi = void 0;
const sequelize_1 = require("sequelize"); //importo sequelize 
const Singleton_1 = require("../Model/Singleton"); //import singleton 
const Grafo_1 = require("../Model/Grafo"); //import singleton 
const Nodi_1 = require("../Model/Nodi"); //import singleton 
const sequelize = Singleton_1.Singleton.getConnection();
exports.Archi = sequelize.define('Archi', {
    id_archi: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    id_grafo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Grafo_1.Grafo,
            key: 'id_grafo',
        },
    },
    id_nodo_partenza: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Nodi_1.Nodi,
            key: 'id_nodi',
        },
    },
    id_nodo_arrivo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Nodi_1.Nodi,
            key: 'id_nodi',
        },
    },
    peso: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    }
}, {
    timestamps: false,
    freezeTableName: true
});
/*
// N archi fanno riferimneto ad un solo Grafo
Archi.belongsTo(Grafo,{
    foreignKey : 'id_grafo',
    as : 'Archi'    // Archi.get(Grafo)
    
});

// Un solo arco è riferito ad un solo nodo di partenza
Archi.belongsTo(Nodi,{
    foreignKey : 'id_nodo_partenza',
    as : 'nodo_partenza'
    
});
// Un solo arco è riferito ad un solo nodo di arrivo
Archi.belongsTo(Nodi,{
    foreignKey : 'id_nodo_arrivo',
    as : 'nodo_arrivo'
});

*/
module.exports = { Archi: exports.Archi };
