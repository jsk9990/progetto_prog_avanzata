"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simulazione = void 0;
const sequelize_1 = require("sequelize"); //importo sequelize 
const Singleton_1 = require("../Model/Singleton"); //import singleton 
const sequelize = Singleton_1.Singleton.getConnection();
exports.Simulazione = sequelize.define('Simulazione', {
    id_simulazione: {
        type: sequelize_1.DataTypes.INTEGER(),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_utente: {
        type: sequelize_1.DataTypes.INTEGER(),
        allowNull: false,
        references: {
            model: 'Utente',
            key: 'id_utente'
        }
    },
    id_grafo: {
        type: sequelize_1.DataTypes.INTEGER(),
        allowNull: false,
        references: {
            model: 'Grafo',
            key: 'id_grafo'
        }
    },
    start_peso: {
        type: sequelize_1.DataTypes.FLOAT(),
        allowNull: false
    },
    stop_peso: {
        type: sequelize_1.DataTypes.FLOAT(),
        allowNull: false
    },
    step: {
        type: sequelize_1.DataTypes.FLOAT(),
        allowNull: false
    },
    costo: {
        type: sequelize_1.DataTypes.FLOAT(),
        allowNull: false
    },
    timestamp: {
        type: sequelize_1.DataTypes.DATE(),
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    timestamps: false,
    freezeTableName: true
});
/*
Simulazione.belongsTo(Utente,{
    foreignKey : 'id_utente',
    as : 'Utente_simulazione'
});

Simulazione.belongsTo(Grafo,{
    foreignKey : 'id_grafo',
    as : 'Grafo_simulazione'
});
*/
