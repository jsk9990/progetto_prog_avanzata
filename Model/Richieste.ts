import {DataTypes,Sequelize} from 'sequelize'; //importo sequelize 
import {Singleton}  from '../Model/Singleton'; //import singleton 
import { Grafo } from './Grafo';
import { Utente } from './Utente';



const sequelize: Sequelize = Singleton.getConnection();

export const Richieste = sequelize.define('Richieste', {
    id_richieste: {
        type:DataTypes.INTEGER(),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_grafo: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        references: {
            model: 'Grafo', 
            key: 'id_grafo'
        }
    },
    id_utente_request: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        /*references: {
            model: 'Utente', 
            key: 'id_utente'
        }*/
    },
    id_utente_response: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        /*
        references: {
            model: 'Utente', 
            key: 'id_utente'
        }*/
    },
    descrizione: {
        type:DataTypes.STRING(255),
        allowNull: true,
    },
    modifiche: {
        type:DataTypes.JSON,
        allowNull: false,
    },
    stato_richiesta: {
        type:DataTypes.STRING(45),
        allowNull: false,
        defaultValue: 'pending'
    },
    /*
    time_stamp: {
        type:DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
    */
},
{
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