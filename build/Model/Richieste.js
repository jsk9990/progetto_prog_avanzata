"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Richieste = void 0;
const sequelize_1 = require("sequelize"); //importo sequelize 
const Singleton_1 = require("../Model/Singleton"); //import singleton 
const sequelize = Singleton_1.Singleton.getConnection();
exports.Richieste = sequelize.define('Richieste', {
    id_richieste: {
        type: sequelize_1.DataTypes.INTEGER(),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_grafo: {
        type: sequelize_1.DataTypes.INTEGER(),
        allowNull: false,
        references: {
            model: 'Grafo',
            key: 'id_grafo'
        }
    },
    id_utente_request: {
        type: sequelize_1.DataTypes.INTEGER(),
        allowNull: false,
        /*references: {
            model: 'Utente',
            key: 'id_utente'
        }*/
    },
    id_utente_response: {
        type: sequelize_1.DataTypes.INTEGER(),
        allowNull: false,
        /*
        references: {
            model: 'Utente',
            key: 'id_utente'
        }*/
    },
    descrizione: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    modifiche: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
    },
    stato_richiesta: {
        type: sequelize_1.DataTypes.STRING(45),
        allowNull: false,
        defaultValue: 'pending'
    },
    update_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    timestamps: false,
    freezeTableName: true
});
/*
Richieste.belongsTo(Utente,{
    foreignKey : 'id_utente',
    as : 'Utente_richiesta'
});

Richieste.belongsTo(Grafo,{
    foreignKey : 'id_grafo',
    as : 'Utente_richiesta'
});
*/ 
