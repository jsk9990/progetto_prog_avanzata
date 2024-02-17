import {DataTypes,Sequelize} from 'sequelize'; //importo sequelize 
import {Singleton}  from '../Model/Singleton'; //import singleton 
import { Utente } from './Utente';
import { Nodi } from './Nodi';
import { Archi } from './Archi';
import { Richieste } from './Richieste';
import { Simulazione } from './Simulazione';


const sequelize: Sequelize = Singleton.getConnection();

export const Grafo = sequelize.define('Grafo', {
    id_grafo: {
        type:DataTypes.INTEGER(),
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_utente: {
        type: DataTypes.INTEGER(),
        autoIncrement: true,
        allowNull: false,
        references: {
            model: 'Utente', 
            key: 'id_utente'
        }
    },
    nome_grafo: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
  
},
{ 
    timestamps: false,
    freezeTableName: true
}); 

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
module.exports = { Grafo: Grafo };