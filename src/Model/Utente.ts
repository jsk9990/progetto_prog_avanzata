import {DataTypes,Sequelize} from 'sequelize'; //importo sequelize 
import {Singleton}  from './Singleton'; //import singleton 
import {Grafo}  from './Grafo'; //import Grafo
import { Richieste } from './Richieste';
import { Simulazione } from './Simulazione';


const sequelize: Sequelize = Singleton.getConnection();

export const Utente = sequelize.define('Utente', {
    id_utente: {
        type:DataTypes.INTEGER(),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    password: {
        type:DataTypes.STRING(45),
        allowNull: false
    },
    credito :{
        type:DataTypes.FLOAT(),
        allowNull: false
    },
    privilegi: {
        type:DataTypes.BOOLEAN(),
        allowNull: false
    },
    create_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
  
},

{ 
    timestamps: false,
    freezeTableName: true
}); 

Utente.hasMany(Grafo, {
    foreignKey: 'id_utente', 
    as: 'Grafo', 
});

Utente.hasMany(Richieste, {
    foreignKey: 'id_utente',
    as: 'richieste',
});


Utente.hasMany(Simulazione, {
    foreignKey: 'id_utente',
    as: 'simulazione',
});


module.exports = { Utente: Utente };
