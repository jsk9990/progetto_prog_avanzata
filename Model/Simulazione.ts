import {DataTypes,Sequelize} from 'sequelize'; //importo sequelize 
import {Singleton}  from '../Model/Singleton'; //import singleton 
import { Grafo } from './Grafo';
import { Utente } from './Utente';

const sequelize: Sequelize = Singleton.getConnection();

export const Simulazione = sequelize.define('Simulazione', {
    id_simulazione: {
        type:DataTypes.INTEGER(),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_utente: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        references: {
            model: 'Utente', 
            key: 'id_utente'
        }
    },
    id_grafo: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        references: {
            model: 'Grafo',
            key : 'id_grafo'
        }
    },
    start_peso : {
        type:DataTypes.FLOAT(),
        allowNull: false
    },
    stop_peso : {
        type:DataTypes.FLOAT(),
        allowNull: false
    },
    step : {
        type:DataTypes.FLOAT(),
        allowNull: false
    },
    costo : {
        type:DataTypes.FLOAT(),
        allowNull: false
    },
    timestamp : {
        type:DataTypes.DATE(),
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
},
{
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
